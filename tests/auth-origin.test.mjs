import test from "node:test";
import assert from "node:assert/strict";
import { authOrigin } from "../lib/domain/auth-origin.mjs";
test("PKCE returns to the exact trusted preview rather than a configured localhost origin", () => {
  const origin =
    "https://oakmere-living-abc123-salmanasad561-gmailcoms-projects.vercel.app";
  assert.equal(
    authOrigin(origin, {
      VERCEL: "1",
      AUTH_REDIRECT_ORIGIN: "http://localhost:3000",
    }),
    origin,
  );
  assert.throws(() => authOrigin("https://attacker.example", { VERCEL: "1" }));
  assert.throws(() =>
    authOrigin(
      "https://oakmere-living-abc123-salmanasad561-gmailcoms-projects.vercel.app.attacker.example",
      { VERCEL: "1" },
    ),
  );
});
test("local sign-in is supported without trusting arbitrary request hosts", () => {
  assert.equal(
    authOrigin("http://localhost:3000", {}),
    "http://localhost:3000",
  );
  assert.throws(() => authOrigin("http://localhost:3000/redirect", {}));
});
