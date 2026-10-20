import { createClient } from "@supabase/supabase-js";
import { provisionAdmin } from "./lib/provision-admin.mjs";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.INITIAL_ADMIN_EMAIL || "salmanasad561@gmail.com";
try {
  if (!url || !key)
    throw new Error(
      "Configure the Supabase URL and server-only service key in .env.local.",
    );
  const client = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      fetch: (input, init) =>
        fetch(input, { ...init, signal: AbortSignal.timeout(15_000) }),
    },
  });
  const result = await provisionAdmin(client, email);
  console.log(JSON.stringify(result, null, 2));
  console.log(
    "No email was sent, no password was assigned and existing credentials were preserved.",
  );
  if (!result.emailVerified)
    console.log(
      "The administrator must verify ownership of the email through Supabase before staff access is allowed.",
    );
} catch (error) {
  // Do not print provider objects, request headers, connection strings or secrets.
  console.error(
    error instanceof Error ? error.message : "Administrator setup failed.",
  );
  process.exitCode = 1;
}
