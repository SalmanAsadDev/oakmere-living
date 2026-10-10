export const site = {
  name: "Oakmere Living",
  description: "Thoughtfully chosen sofas for the everyday moments that make a house your home. Explore corner sofas, cosy sets and recliners.",
  origin: process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),
};
export const databaseConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY);
export const liveOrderingEnabled = process.env.LIVE_ORDERING_ENABLED === "true" && databaseConfigured;
// Release blocker: the inherited checkout still uses a mock basket, client prices
// and non-transactional writes. Remove this guard only after CHECKOUT-01 in the
// reference parity plan is verified; an environment flag alone is insufficient.
export const checkoutImplementationReady = false;
