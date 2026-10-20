import test from "node:test";
import assert from "node:assert/strict";
import { provisionAdmin } from "../scripts/lib/provision-admin.mjs";

function fixture(users = [], schemaError = null) {
  const writes = [],
    creations = [];
  const client = {
    auth: {
      admin: {
        listUsers: async ({ page }) => ({
          data: { users: users.slice((page - 1) * 100, page * 100) },
          error: null,
        }),
        createUser: async (attributes) => {
          creations.push(attributes);
          return {
            data: { user: { id: "new-owner", email: attributes.email } },
            error: null,
          };
        },
      },
    },
    from: () => ({
      select: () => ({ limit: async () => ({ error: schemaError }) }),
      upsert: (row) => {
        writes.push(row);
        return {
          select: () => ({ single: async () => ({ data: row, error: null }) }),
        };
      },
    }),
  };
  return { client, writes, creations };
}
test("bootstrap reuses the exact existing Auth identity without changing its credentials", async () => {
  const f = fixture([
    { id: "other", email: "other@example.com" },
    {
      id: "owner",
      email: "Owner@example.com",
      email_confirmed_at: "2026-10-20",
    },
  ]);
  const result = await provisionAdmin(f.client, " OWNER@example.com ");
  assert.equal(result.created, false);
  assert.equal(f.creations.length, 0);
  assert.deepEqual(f.writes, [
    { id: "owner", email: "owner@example.com", role: "admin" },
  ]);
});
test("new administrator remains unverified and receives no generated password", async () => {
  const f = fixture();
  const result = await provisionAdmin(f.client, "owner@example.com");
  assert.deepEqual(f.creations, [
    { email: "owner@example.com", email_confirm: false },
  ]);
  assert.equal(result.emailVerified, false);
});
test("unavailable staff schema prevents account creation and privilege writes", async () => {
  const f = fixture([], { code: "missing" });
  await assert.rejects(
    provisionAdmin(f.client, "owner@example.com"),
    /staff schema/,
  );
  assert.equal(f.creations.length, 0);
  assert.equal(f.writes.length, 0);
});
