import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import { databaseClient } from "./lib/postgres.mjs";

// Validate the same project binding as migrations. The password goes into the
// child environment, never its command line or output.
databaseClient();
const uri = new URL(
  process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL,
);
const password = decodeURIComponent(uri.password);
uri.password = "";
for (const option of ["sslmode", "sslcert", "sslkey", "sslrootcert"])
  uri.searchParams.delete(option);
uri.searchParams.set("sslmode", "verify-full");
uri.searchParams.set(
  "sslrootcert",
  fileURLToPath(
    new URL("../supabase/certificates/prod-ca-2021.crt", import.meta.url),
  ),
);
const npm = path.join(
  path.dirname(process.execPath),
  "node_modules/npm/bin/npm-cli.js",
);
if (!fs.existsSync(npm))
  throw new Error(
    "npm runtime not found; run advisors through the official Supabase CLI with environment-based credentials.",
  );
const child = spawn(
  process.execPath,
  [
    npm,
    "exec",
    "--yes",
    "--package=supabase@2.121.0",
    "--",
    "supabase",
    "db",
    "advisors",
    "--db-url",
    uri.href,
    "--type",
    "security",
    "--level",
    "warn",
    "--fail-on",
    "error",
  ],
  {
    env: { ...process.env, PGPASSWORD: password },
    stdio: ["ignore", "pipe", "pipe"],
  },
);
child.stdout.pipe(process.stdout);
child.stderr.pipe(process.stderr);
child.on("error", () => {
  console.error("Could not start the official database advisor.");
  process.exitCode = 1;
});
child.on("close", (code) => {
  process.exitCode = code ?? 1;
});
