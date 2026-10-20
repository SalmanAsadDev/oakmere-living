import fs from "node:fs";
import pg from "pg";

export function databaseClient() {
  const value =
    process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;
  if (!value || !process.env.NEXT_PUBLIC_SUPABASE_URL)
    throw new Error("Database environment is missing.");
  const uri = new URL(value);
  const ref = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname.split(
    ".",
  )[0];
  if (
    uri.hostname !== `db.${ref}.supabase.co` &&
    decodeURIComponent(uri.username) !== `postgres.${ref}`
  )
    throw new Error(
      "Database connection does not match the configured Supabase project.",
    );
  for (const option of ["sslmode", "sslcert", "sslkey", "sslrootcert"])
    uri.searchParams.delete(option);
  return new pg.Client({
    connectionString: uri.href,
    ssl: {
      ca: fs.readFileSync(
        new URL(
          "../../supabase/certificates/prod-ca-2021.crt",
          import.meta.url,
        ),
      ),
      rejectUnauthorized: true,
    },
    connectionTimeoutMillis: 15_000,
  });
}
