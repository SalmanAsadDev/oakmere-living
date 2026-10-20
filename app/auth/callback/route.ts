import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/server/supabase";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  let authenticated = false;
  if (code) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      authenticated = !error;
    } catch {
      /* Generic failure; never log the one-time code or session. */
    }
  }
  const response = NextResponse.redirect(
    new URL(
      authenticated ? "/admin" : "/admin/login?error=credentials",
      request.url,
    ),
  );
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}
