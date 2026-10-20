import assert from "node:assert/strict";
import { randomUUID, createHash } from "node:crypto";
import { databaseClient } from "./lib/postgres.mjs";

const origin = process.env.CHECKOUT_TEST_ORIGIN || "http://localhost:3101";
if (!/^http:\/\/localhost:\d+$/.test(origin))
  throw new Error(
    "HTTP checkout verification is restricted to a local test server.",
  );
const client = databaseClient();
const fixture = randomUUID();
let productId;
const sessions = new Set();
try {
  await client.connect();
  const {
    rows: [product],
  } = await client.query(
    "insert into public.products(name,slug,is_active,base_price) values('Disposable checkout verification',$1,true,123.45) returning id",
    [`checkout-test-${fixture}`],
  );
  productId = product.id;
  const {
    rows: [variant],
  } = await client.query(
    "insert into public.variants(product_id,name,price_pence,stock_level) values($1,'Test configuration',12345,2) returning id",
    [productId],
  );
  async function post(path, body, cookie, requestOrigin = origin) {
    const response = await fetch(`${origin}${path}`, {
      method: "POST",
      headers: {
        Origin: requestOrigin,
        "Content-Type": "application/json",
        ...(cookie ? { Cookie: cookie } : {}),
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(60000),
    });
    const set = response.headers.get("set-cookie");
    if (set?.includes("oakmere_guest=")) {
      const token = set.match(/oakmere_guest=([a-f0-9]{64})/)?.[1];
      if (token) sessions.add(createHash("sha256").update(token).digest("hex"));
    }
    return {
      status: response.status,
      body: await response.json(),
      cookie: set?.split(";")[0],
    };
  }
  const payload = {
    items: [{ variantId: variant.id, quantity: 2 }],
    address: {
      line1: "TEST ADDRESS - DO NOT FULFIL",
      line2: "",
      city: "Manchester",
      postcode: "M1 1AE",
      country: "United Kingdom",
      accessNotes: "Disposable automated test",
    },
  };
  assert.equal(
    (
      await post(
        "/api/checkout/quote",
        payload,
        null,
        "https://attacker.example",
      )
    ).status,
    400,
  );
  assert.equal(
    (await post("/api/checkout/quote", { ...payload, unitPrice: 1 })).status,
    422,
  );
  const first = await post("/api/checkout/quote", payload);
  assert.equal(first.status, 200);
  assert.equal(first.body.quote.totalPence, 24690);
  assert.ok(first.cookie);
  const second = await post("/api/checkout/quote", payload);
  assert.equal(second.status, 200);
  const order = {
    quoteId: first.body.quote.id,
    idempotencyKey: randomUUID(),
    contact: {
      name: "Disposable test - DO NOT FULFIL",
      email: "probe@example.invalid",
      phone: "00000000000",
    },
    paymentMethod: "cash_on_delivery",
    termsVersion: "2026-10-20",
    termsAccepted: true,
    deliveryConfirmationAccepted: true,
  };
  assert.equal((await post("/api/checkout", order, second.cookie)).status, 409);
  const [one, replay] = await Promise.all([
    post("/api/checkout", order, first.cookie),
    post("/api/checkout", order, first.cookie),
  ]);
  assert.equal(one.status, 200);
  assert.equal(replay.status, 200);
  assert.equal(one.body.orderId, replay.body.orderId);
  assert.equal(
    (
      await post(
        "/api/checkout",
        {
          ...order,
          quoteId: second.body.quote.id,
          idempotencyKey: randomUUID(),
        },
        second.cookie,
      )
    ).status,
    409,
  );
  const ownerView = await fetch(
    `${origin}/checkout/success?orderId=${one.body.orderId}`,
    { headers: { Cookie: first.cookie }, signal: AbortSignal.timeout(60000) },
  );
  assert.equal(ownerView.status, 200);
  assert.ok((await ownerView.text()).includes("Your order is received"));
  const foreignView = await fetch(
    `${origin}/checkout/success?orderId=${one.body.orderId}`,
    { headers: { Cookie: second.cookie }, signal: AbortSignal.timeout(60000) },
  );
  assert.equal(foreignView.status, 404);
  assert.equal(
    (
      await client.query(
        "select count(*)::int n from public.orders where quote_id=$1",
        [first.body.quote.id],
      )
    ).rows[0].n,
    1,
  );
  // Two independent checkouts compete for the same final two units.
  await client.query("update public.variants set stock_level=2 where id=$1", [
    variant.id,
  ]);
  const third = await post("/api/checkout/quote", payload);
  const fourth = await post("/api/checkout/quote", payload);
  const race = await Promise.all(
    [third, fourth].map((entry) =>
      post(
        "/api/checkout",
        {
          ...order,
          quoteId: entry.body.quote.id,
          idempotencyKey: randomUUID(),
        },
        entry.cookie,
      ),
    ),
  );
  assert.deepEqual(race.map((entry) => entry.status).sort(), [200, 409]);
  assert.equal(
    (
      await client.query(
        "select stock_level from public.variants where id=$1",
        [variant.id],
      )
    ).rows[0].stock_level,
    0,
  );
  console.log(
    JSON.stringify(
      {
        httpQuote: true,
        clientPriceRejected: true,
        crossOriginDenied: true,
        concurrentRetryCreatesOneOrder: true,
        concurrentStockReservation: true,
        foreignSessionDenied: true,
        stockExhaustionDenied: true,
        privateConfirmation: true,
      },
      null,
      2,
    ),
  );
} catch (error) {
  console.error(
    "HTTP checkout verification failed:",
    error.code || error.message,
  );
  process.exitCode = 1;
} finally {
  if (productId) {
    await client.query("begin");
    try {
      const { rows } = await client.query(
        "select distinct order_id from public.order_items where product_id=$1",
        [productId],
      );
      const ids = rows.map((row) => row.order_id);
      await client.query("delete from public.orders where id=any($1::uuid[])", [
        ids,
      ]);
      for (const session of sessions) {
        await client.query(
          "delete from public.checkout_quotes where session_id=$1",
          [session],
        );
        await client.query(
          "delete from private.checkout_limits where key=any($1::text[])",
          [[`order:${session}`, `quote:${session}`]],
        );
      }
      await client.query(
        "delete from public.checkout_quotes where cart_items @> $1::jsonb",
        [JSON.stringify([{ productId }])],
      );
      await client.query(
        "delete from public.products where id=$1 and slug=$2",
        [productId, `checkout-test-${fixture}`],
      );
      await client.query("commit");
      console.log(
        "Disposable product, quotes, orders and rate counters removed.",
      );
    } catch (error) {
      await client.query("rollback");
      console.error("Fixture cleanup needs attention:", error.code);
      process.exitCode = 1;
    }
  }
  await client.end().catch(() => {});
}
