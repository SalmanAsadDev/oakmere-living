// PKCE must return to the browser origin that holds its verifier cookie.
// Only this project's configured origins and team-scoped previews are accepted.
export function authOrigin(requestOrigin, environment) {
  const candidates = [
    environment.AUTH_REDIRECT_ORIGIN,
    environment.NEXT_PUBLIC_SITE_URL,
    environment.VERCEL_URL && `https://${environment.VERCEL_URL}`,
    environment.VERCEL_PROJECT_PRODUCTION_URL &&
      `https://${environment.VERCEL_PROJECT_PRODUCTION_URL}`,
  ]
    .filter(Boolean)
    .map((value) => new URL(value).origin);
  if (!environment.VERCEL) candidates.push("http://localhost:3000");
  if (requestOrigin) {
    const url = new URL(requestOrigin);
    if (url.origin !== requestOrigin || url.username || url.password)
      throw new Error("Untrusted sign-in origin");
    if (
      candidates.includes(url.origin) ||
      (environment.VERCEL &&
        url.protocol === "https:" &&
        /^oakmere-living-[a-z0-9-]+-salmanasad561-gmailcoms-projects\.vercel\.app$/.test(
          url.hostname,
        ))
    )
      return url.origin;
    throw new Error("Untrusted sign-in origin");
  }
  return environment.VERCEL_URL
    ? `https://${environment.VERCEL_URL}`
    : candidates[0] || "http://localhost:3000";
}
