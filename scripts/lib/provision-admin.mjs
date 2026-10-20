/** Server-side setup only. Never import this module into customer-facing code. */
export async function provisionAdmin(client, email) {
  const owner = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(owner))
    throw new Error("A valid administrator email is required.");
  // Check the schema before creating an Auth account. No schema or policies are changed here.
  const probe = await client.from("staff_profiles").select("id").limit(0);
  if (probe.error)
    throw new Error(
      "The staff schema is unavailable. Restore the database and apply reviewed migrations first.",
    );
  let user;
  for (let page = 1; page <= 100; page++) {
    const result = await client.auth.admin.listUsers({ page, perPage: 100 });
    if (result.error)
      throw new Error(
        "Could not read Auth accounts. Check the server-side credentials and project availability.",
      );
    user = result.data.users.find(
      (candidate) => candidate.email?.toLowerCase() === owner,
    );
    if (user || result.data.users.length < 100) break;
    if (page === 100)
      throw new Error(
        "Account search exceeded its safety limit; no account was created.",
      );
  }
  let created = false;
  if (!user) {
    const result = await client.auth.admin.createUser({
      email: owner,
      email_confirm: false,
    });
    if (result.error || !result.data.user)
      throw new Error(
        "Could not create the administrator Auth account. No password or confirmation was generated.",
      );
    user = result.data.user;
    created = true;
  }
  if (user.email?.toLowerCase() !== owner)
    throw new Error(
      "Auth returned an unexpected email; no staff role was assigned.",
    );
  const result = await client
    .from("staff_profiles")
    .upsert({ id: user.id, email: owner, role: "admin" }, { onConflict: "id" })
    .select("id,email,role")
    .single();
  if (
    result.error ||
    result.data?.id !== user.id ||
    result.data?.role !== "admin"
  )
    throw new Error(
      "Administrator role could not be verified. No other staff accounts were changed.",
    );
  return {
    email: owner,
    role: "admin",
    created,
    emailVerified: Boolean(user.email_confirmed_at),
  };
}
