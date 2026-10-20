"use server";

import { createClient } from "@/lib/server/supabase";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/server/supabase";
import { headers } from "next/headers";
import { authOrigin } from "@/lib/domain/auth-origin.mjs";
import { z } from "zod";

export async function login(formData: FormData) {
  const input = z
    .object({
      email: z.string().trim().email().max(254),
      password: z.string().min(1).max(256),
    })
    .safeParse(Object.fromEntries(formData));
  if (!input.success) redirect("/admin/login?error=credentials");
  let failed = false;
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword(input.data);
    failed = Boolean(error);
  } catch {
    failed = true;
  }
  if (failed) redirect("/admin/login?error=credentials");
  // The dashboard independently verifies confirmed Auth identity and staff role.
  redirect("/admin");
}

export async function requestLoginLink(formData: FormData) {
  const parsed = z
    .string()
    .trim()
    .toLowerCase()
    .email()
    .max(254)
    .safeParse(formData.get("email"));
  if (!parsed.success) redirect("/admin/login?error=email");
  let unavailable = false;
  try {
    const { data: staff, error } = await createAdminClient()
      .from("staff_profiles")
      .select("id")
      .eq("email", parsed.data)
      .limit(1)
      .maybeSingle();
    if (error) unavailable = true;
    else if (staff) {
      const supabase = await createClient();
      const origin = authOrigin((await headers()).get("origin"), process.env);
      const result = await supabase.auth.signInWithOtp({
        email: parsed.data,
        options: {
          shouldCreateUser: false,
          emailRedirectTo: new URL("/auth/callback", origin).href,
        },
      });
      if (result.error) {
        // Keep the browser response identical for staff/non-staff addresses.
        console.warn("Staff sign-in email delivery failed", {
          code: result.error.code || "provider_error",
        });
      }
    }
  } catch {
    unavailable = true;
  }
  if (unavailable) redirect("/admin/login?error=unavailable");
  // Same response for non-staff addresses. A submitted email never grants a role.
  redirect("/admin/login?notice=link");
}
