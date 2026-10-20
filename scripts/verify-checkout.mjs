import assert from "node:assert/strict";
import { randomUUID, createHash } from "node:crypto";
import { databaseClient } from "./lib/postgres.mjs";

const client = databaseClient();
try {
  await client.connect();
  await client.query("begin");
  const fixture = randomUUID();
  const {
    rows: [product],
  } = await client.query(
    "insert into public.products(name,slug,is_active,base_price) values('Disposable checkout probe',$1,true,123.45) returning id",
    [`probe-${fixture}`],
  );
  const {
    rows: [variant],
  } = await client.query(
    "insert into public.variants(product_id,name,price_pence,stock_level) values($1,'Probe configuration',12345,2) returning id",
    [product.id],
  );
  const session = createHash("sha256").update(fixture).digest("hex");
  const contact = {
    name: "Disposable test",
    email: "probe@example.invalid",
    phone: "00000000000",
  };
  const basket = [{ variantId: variant.id, quantity: 2 }];
  const context = {
    address: {
      line1: "Disposable test address",
      city: "Manchester",
      postcode: "M1 1AE",
      country: "United Kingdom",
      accessNotes: "TEST ONLY",
    },
  };
  async function quote() {
    return (
      await client.query(
        "select public.create_checkout_quote($1,$2::jsonb,$3::jsonb,'reference-2026-10-20',0) q",
        [session, JSON.stringify(basket), JSON.stringify(context)],
      )
    ).rows[0].q;
  }
  async function rejected(sql, args) {
    await client.query("savepoint rejected");
    let failed = false;
    try {
      await client.query(sql, args);
    } catch {
      failed = true;
    }
    await client.query("rollback to savepoint rejected");
    await client.query("release savepoint rejected");
    assert.ok(failed, "Expected request rejection");
  }
  await client.query("set local role anon");
  await rejected(
    "select public.create_checkout_quote($1,$2::jsonb,$3::jsonb,'reference-2026-10-20',0)",
    [session, JSON.stringify(basket), JSON.stringify(context)],
  );
  await client.query("set local role service_role");
  const first = await quote();
  const second = await quote();
  assert.equal(first.totalPence, 24690);
  assert.equal(first.items[0].unitPence, 12345);
  const submit =
    "select public.submit_checkout_order($1,$2,$3,$4::jsonb,'cash_on_delivery','2026-10-20') id";
  const idem = randomUUID();
  const args = [session, first.id, idem, JSON.stringify(contact)];
  const {
    rows: [order],
  } = await client.query(submit, args);
  const replay = (await client.query(submit, args)).rows[0];
  assert.equal(replay.id, order.id);
  assert.equal(
    (
      await client.query(
        "select stock_level from public.variants where id=$1",
        [variant.id],
      )
    ).rows[0].stock_level,
    0,
  );
  await rejected(submit, [
    session,
    first.id,
    idem,
    JSON.stringify({ ...contact, name: "Changed request" }),
  ]);
  await rejected(submit, [
    "a".repeat(64),
    second.id,
    randomUUID(),
    JSON.stringify(contact),
  ]);
  await rejected(submit, [
    session,
    second.id,
    randomUUID(),
    JSON.stringify(contact),
  ]);
  assert.equal(
    (
      await client.query(
        "select count(*)::int n from public.orders where session_id=$1",
        [session],
      )
    ).rows[0].n,
    1,
  );
  await client.query(
    "update public.orders set status='cancelled' where id=$1",
    [order.id],
  );
  assert.equal(
    (
      await client.query(
        "select stock_level from public.variants where id=$1",
        [variant.id],
      )
    ).rows[0].stock_level,
    2,
  );
  await client.query(
    "update public.orders set status='cancelled' where id=$1",
    [order.id],
  );
  assert.equal(
    (
      await client.query(
        "select stock_level from public.variants where id=$1",
        [variant.id],
      )
    ).rows[0].stock_level,
    2,
  );
  await rejected("update public.orders set status='pending' where id=$1", [
    order.id,
  ]);
  await client.query(
    "update public.variants set price_pence=13345 where id=$1",
    [variant.id],
  );
  await rejected(submit, [
    session,
    second.id,
    randomUUID(),
    JSON.stringify(contact),
  ]);
  const third = await quote();
  await client.query(
    "update public.checkout_quotes set expires_at=now()-interval '1 second' where id=$1",
    [third.id],
  );
  await rejected(submit, [
    session,
    third.id,
    randomUUID(),
    JSON.stringify(contact),
  ]);
  for (let i = 0; i < 3; i++) {
    const permitted = (
      await client.query("select public.consume_checkout_limit($1,2,600) ok", [
        `probe-${fixture}`,
      ])
    ).rows[0].ok;
    assert.equal(permitted, i < 2);
  }
  // Unknown stock did not reserve units. A later manual count must not be inflated.
  await client.query(
    "update public.variants set stock_level=null where id=$1",
    [variant.id],
  );
  const unknownQuote = await quote();
  const unknownOrder = (
    await client.query(submit, [
      session,
      unknownQuote.id,
      randomUUID(),
      JSON.stringify(contact),
    ])
  ).rows[0].id;
  await client.query("update public.variants set stock_level=7 where id=$1", [
    variant.id,
  ]);
  await client.query(
    "update public.orders set status='cancelled' where id=$1",
    [unknownOrder],
  );
  assert.equal(
    (
      await client.query(
        "select stock_level from public.variants where id=$1",
        [variant.id],
      )
    ).rows[0].stock_level,
    7,
  );
  // Simulate corrupted persisted quote data: an item failure must roll back
  // an already inserted header, preceding item and its stock reservation.
  await client.query("update public.variants set stock_level=20 where id=$1", [
    variant.id,
  ]);
  const corruptQuote = await quote();
  const badLines = [
    corruptQuote.items[0],
    {
      ...corruptQuote.items[0],
      quantity: 11,
      totalPence: corruptQuote.items[0].unitPence * 11,
    },
  ];
  await client.query(
    "update public.checkout_quotes set cart_items=$2::jsonb where id=$1",
    [corruptQuote.id, JSON.stringify(badLines)],
  );
  await rejected(submit, [
    session,
    corruptQuote.id,
    randomUUID(),
    JSON.stringify(contact),
  ]);
  assert.equal(
    (
      await client.query(
        "select count(*)::int n from public.orders where quote_id=$1",
        [corruptQuote.id],
      )
    ).rows[0].n,
    0,
  );
  assert.equal(
    (
      await client.query(
        "select stock_level from public.variants where id=$1",
        [variant.id],
      )
    ).rows[0].stock_level,
    20,
  );
  await client.query("rollback");
  console.log(
    JSON.stringify(
      {
        exactPence: true,
        serviceOnly: true,
        duplicateOrderPrevented: true,
        foreignSessionDenied: true,
        oversellingBlocked: true,
        cancellationReturnsStockOnce: true,
        unknownStockNeverInvented: true,
        partialOrderFailureRolledBack: true,
        cancelledReopenDenied: true,
        changedPriceDenied: true,
        expiredQuoteDenied: true,
        distributedRateLimit: true,
        fixtures: "rolled back",
      },
      null,
      2,
    ),
  );
} catch (error) {
  await client.query("rollback").catch(() => {});
  console.error("Checkout verification failed:", [
    error.code,
    error.message,
    error.where,
  ]);
  process.exitCode = 1;
} finally {
  await client.end().catch(() => {});
}
