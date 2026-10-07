"use server";

import { createClient } from "@/lib/server/supabase";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Ideally we would return the error to the frontend
    // but a simple redirect with error params is fine for now
    return redirect("/admin/login?error=Could not authenticate user");
  }

  // Double check if the user is staff, but middleware and RLS handle this mostly.
  return redirect("/admin");
}
