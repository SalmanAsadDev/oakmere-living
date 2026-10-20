import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { databaseClient } from "./lib/postgres.mjs";

const client = databaseClient();
try {
  await client.connect();
  const { rows: tables } = await client.query(
    "select relname,relrowsecurity from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relkind='r'",
  );
  assert.ok(tables.length >= 12);
  assert.ok(
    tables.every((t) => t.relrowsecurity),
    "Every public application table must have RLS",
  );
  await client.query("begin");
  const {
    rows: [totals],
  } = await client.query(
    "select count(*)::int as all_products, count(*) filter(where is_active)::int as published from public.products",
  );
  const {
    rows: [probe],
  } = await client.query(
    "insert into public.orders(session_id,customer_email,customer_name,delivery_address,payment_method,subtotal,delivery_cost,total_amount) values('rls-verification','probe@example.invalid','Disposable transaction probe','{}','cash_on_delivery',1,0,1) returning id",
  );
  async function denied(sql, values = []) {
    await client.query("savepoint access_probe");
    let blocked = false;
    try {
      await client.query(sql, values);
    } catch (error) {
      blocked = error.code === "42501";
    }
    await client.query("rollback to savepoint access_probe");
    await client.query("release savepoint access_probe");
    assert.ok(blocked, "An unauthorised operation was not denied");
  }
  await client.query("set local role anon");
  const {
    rows: [visible],
  } = await client.query(
    "select count(*)::int as products, count(*) filter(where not is_active)::int as drafts from public.products",
  );
  assert.equal(visible.products, totals.published);
  assert.equal(visible.drafts, 0);
  await denied("select id from public.orders");
  await denied("select email from public.staff_profiles");
  await denied(
    "insert into public.contact_requests(name,email,message) values('probe','probe@example.invalid','not permitted')",
  );
  await client.query("set local role authenticated");
  await client.query("select set_config('request.jwt.claims',$1,true)", [
    JSON.stringify({ sub: randomUUID(), role: "authenticated" }),
  ]);
  assert.equal(
    (
      await client.query(
        "select private.staff_has_role(array['admin','sales','support']) as staff",
      )
    ).rows[0].staff,
    false,
  );
  assert.equal(
    (
      await client.query(
        "select count(*)::int as records from public.orders where id=$1",
        [probe.id],
      )
    ).rows[0].records,
    0,
  );
  await denied(
    "insert into public.products(name,slug,base_price) values('probe','forbidden-probe',1)",
  );
  const mutation = await client.query(
    "update public.products set name='unauthorised' where is_active returning id",
  );
  assert.equal(
    mutation.rowCount,
    0,
    "Non-staff updates must not reach published products",
  );
  await denied(
    "insert into public.staff_profiles(id,email,role) values(auth.uid(),'probe@example.invalid','admin')",
  );
  await denied("select public.save_catalogue_product('{}'::jsonb)");
  // A synthetic confirmed identity exists only inside this rolled-back transaction.
  // Never alter the real owner's verification status or create a usable login.
  await client.query("reset role");
  const fixtureId = randomUUID();
  await client.query(
    "insert into auth.users(id,email,email_confirmed_at) values($1,$2,now())",
    [fixtureId, `${fixtureId}@example.invalid`],
  );
  await client.query(
    "insert into public.staff_profiles(id,email,role) values($1,$2,'admin')",
    [fixtureId, `${fixtureId}@example.invalid`],
  );
  const {
    rows: [category],
  } = await client.query("select id from public.categories limit 1");
  await client.query("set local role authenticated");
  await client.query("select set_config('request.jwt.claims',$1,true)", [
    JSON.stringify({ sub: fixtureId, role: "authenticated" }),
  ]);
  const payload = {
    name: "Transactional test product",
    slug: `transaction-probe-${fixtureId}`,
    categoryId: category.id,
    description: "Disposable verification",
    priceType: "base",
    isActive: true,
    dimensions: "",
    materials: [],
    images: ["/images/probe.webp"],
    variants: [
      {
        name: "Verified configuration",
        pricePence: 12999,
        colour: "",
        hex: "#a6a299",
        stockLevel: null,
        isActive: true,
        image: "",
      },
    ],
  };
  const {
    rows: [created],
  } = await client.query(
    "select public.save_catalogue_product($1::jsonb) as id",
    [JSON.stringify(payload)],
  );
  const {
    rows: [variant],
  } = await client.query(
    "select id,price_pence from public.variants where product_id=$1",
    [created.id],
  );
  assert.equal(variant.price_pence, 12999);
  await client.query(
    "update public.products set category_slugs=array['primary','secondary'] where id=$1",
    [created.id],
  );
  payload.id = created.id;
  payload.variants[0].id = variant.id;
  payload.variants[0].pricePence = 13999;
  await client.query("select public.save_catalogue_product($1::jsonb)", [
    JSON.stringify(payload),
  ]);
  const {
    rows: [edited],
  } = await client.query(
    "select base_price,category_slugs from public.products where id=$1",
    [created.id],
  );
  assert.equal(Number(edited.base_price), 139.99);
  assert.deepEqual(edited.category_slugs, ["primary", "secondary"]);
  await client.query("savepoint invalid_configuration");
  let invalidRejected = false;
  try {
    await client.query("select public.save_catalogue_product($1::jsonb)", [
      JSON.stringify({
        ...payload,
        name: "Must roll back",
        variants: [{ ...payload.variants[0], stockLevel: -1 }],
      }),
    ]);
  } catch {
    invalidRejected = true;
  }
  await client.query("rollback to savepoint invalid_configuration");
  assert.ok(invalidRejected);
  assert.equal(
    (
      await client.query("select name from public.products where id=$1", [
        created.id,
      ])
    ).rows[0].name,
    payload.name,
  );
  assert.equal(
    (
      await client.query(
        "select count(*)::int n from public.variants where product_id=$1 and id=$2",
        [created.id, variant.id],
      )
    ).rows[0].n,
    1,
  );
  await client.query("rollback");
  console.log(
    JSON.stringify(
      {
        rlsTables: tables.length,
        catalogue: totals,
        anonymousDraftsVisible: 0,
        privateOrderHidden: true,
        nonStaffWritesDenied: true,
        adminAtomicSaveVerified: true,
        invalidConfigurationRolledBack: true,
        secondaryCategoriesPreserved: true,
        probeData: "rolled back",
      },
      null,
      2,
    ),
  );
} catch (error) {
  await client.query("rollback").catch(() => {});
  console.error("Database verification failed:", error.code || error.message);
  process.exitCode = 1;
} finally {
  await client.end().catch(() => {});
}
