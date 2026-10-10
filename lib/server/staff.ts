import "server-only";
import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "./supabase";

type StaffRole = "admin" | "sales" | "support";
export async function requireStaff(
  allowed: readonly StaffRole[] = ["admin", "sales", "support"],
) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) redirect("/admin/login");
  // The user ID is verified with Auth, never taken from form input or editable metadata.
  const { data: staff, error } = await createAdminClient()
    .from("staff_profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (error || !staff || !allowed.includes(staff.role as StaffRole))
    redirect("/admin/access-denied");
  return supabase;
}
