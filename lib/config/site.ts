export const site = {
  name: "Oakmere Living",
  description:
    "Thoughtfully chosen sofas for the everyday moments that make a house your home. Explore corner sofas, cosy sets and recliners.",
  origin:
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000"),
};
export const databaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY &&
    process.env.SUPABASE_SERVICE_ROLE_KEY,
);
export const liveOrderingEnabled =
  process.env.LIVE_ORDERING_ENABLED === "true" && databaseConfigured;
// Database quotes and atomic order creation are implemented and verified with
// disposable fixtures. LIVE_ORDERING_ENABLED remains the separate launch gate.
// Real staff sign-in, fulfilment and browser release QA are still required.
export const checkoutImplementationReady = true;
