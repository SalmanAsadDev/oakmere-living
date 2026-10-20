import fs from "node:fs/promises";
import { createHash } from "node:crypto";
import { databaseClient } from "./lib/postgres.mjs";

const client = databaseClient();
try {
  await client.connect();
  await client.query("begin");
  await client.query(
    "select pg_advisory_xact_lock(hashtext('oakmere_schema_migrations'))",
  );
  const {
    rows: [state],
  } = await client.query(
    "select to_regclass('supabase_migrations.schema_migrations') as history, (select count(*) from information_schema.tables where table_schema='public')::int as tables",
  );
  if (!state.history && state.tables > 0)
    throw new Error(
      "Existing untracked tables require a schema review; nothing was changed.",
    );
  await client.query("create schema if not exists supabase_migrations");
  await client.query(
    "revoke all on schema supabase_migrations from public,anon,authenticated",
  );
  await client.query(
    "create table if not exists supabase_migrations.schema_migrations(version text primary key, statements text[], name text, checksum text)",
  );
  const root = new URL("../supabase/migrations/", import.meta.url);
  const files = (await fs.readdir(root))
    .filter((name) => /^\d+_.+\.sql$/.test(name))
    .sort();
  for (const name of files) {
    const version = name.split("_")[0];
    const sql = (await fs.readFile(new URL(name, root), "utf8")).replace(
      /\r\n/g,
      "\n",
    );
    const checksum = createHash("sha256").update(sql).digest("hex");
    const { rows: applied } = await client.query(
      "select checksum from supabase_migrations.schema_migrations where version=$1",
      [version],
    );
    if (applied.length) {
      if (applied[0].checksum !== checksum)
        throw new Error(
          "An applied migration checksum changed; review required.",
        );
      console.log("Already applied:", name);
      continue;
    }
    await client.query(sql);
    await client.query(
      "insert into supabase_migrations.schema_migrations(version,statements,name,checksum) values($1,$2,$3,$4)",
      [version, [sql], name.slice(version.length + 1, -4), checksum],
    );
    console.log("Applied in transaction:", name);
  }
  await client.query("commit");
  console.log(
    "Migrations committed with certificate and hostname verification enabled.",
  );
} catch (error) {
  await client.query("rollback").catch(() => {});
  console.error("Migration stopped:", error.code || error.message);
  process.exitCode = 1;
} finally {
  await client.end().catch(() => {});
}
