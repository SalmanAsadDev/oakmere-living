# Implementation progress — 20 October 2026

## Latest checkpoint: reference inputs and administrator

The owner authorised deriving requirements from Corner Sofa and designated `salmanasad561@gmail.com` as initial administrator; staff invitations are deferred. Reference audit and catalogue findings are in `docs/research/reference-policy-audit-2026-10-20.md`. No competitor business identity, contacts, reviews, warranty or additional sellable inventory were imported.

- Administrator bootstrap is implemented with exact Auth-ID matching, existing-account reuse and a schema preflight. No password is generated and email is not auto-confirmed. An explicit confirmed-email check protects staff access. Passwordless sign-in and a PKCE callback are implemented, with generic responses and no automatic signup/role assignment.
- Live provisioning failed before account creation: `zwoentqsqbukyvcwsslj.supabase.co` returned DNS ENOTFOUND. The user has been asked to check/restore the project. Existing Auth/staff records, live RLS and catalogue/order schema have not been inspected successfully. Do not call the administrator provisioned or login email delivery verified.
- Shared delivery policy and a local postcode-format/estimate checker now serve product and Delivery pages. Standard mainland estimate £0, 5–7 days after dispatch; express/removal remain team-confirmed enquiries. Remote/offshore areas receive a quote path rather than invented surcharges. FAQ and delivery text now agree and preserve cash/card on delivery.
- Public reference catalogue has 108 records. None of the exact matches for the 12 ready products missing measurements supplied usable dimensions. Additional reference colours and stock values were not treated as verified inventory.
- Automated check: 13 domain tests and TypeScript pass. Production build and HTTP smoke results will be recorded once complete. Browser automation is currently unavailable with a local kernel-assets path error, including after resetting the session; no new interactive browser verification is claimed.

Next sequence remains: restore/audit database and staff permissions → connect admin-published catalogue → authoritative quotes/atomic orders → product/mobile discovery improvements → saved/comparison/finder tools → room visualisation/contextual assistance → SEO/motion/analytics and full release verification. Paid providers have not been enabled. Existing checkout implementation guard remains in place.

## Previous checkpoint — 10 October

Current authority: project and technical plans; reference parity contract. Frontend evidence and limitations are recorded in `docs/FRONTEND_PROGRESS.md`. Historical Antigravity progress is in `docs/ANTIGRAVITY_PROGRESS.md`; inspect source and runtime evidence before treating its milestones as launch ready.

## Current setup

- Private GitHub repository: https://github.com/SalmanAsadDev/oakmere-living. Main contains Antigravity milestones through `7bef57f`; frontend release and integration guards are the next commits.
- Vercel project `oakmere-living` linked; CLI preview deployment available. Automatic GitHub deployment is not connected. Hostinger will supply domain/DNS later; application stays on Vercel.
- Supabase provisioned in London, development/preview configuration present; schema, RLS and real staff/persistent service journeys still require runtime proof. Earlier direct migration TLS failed with SELF_SIGNED_CERT_IN_CHAIN; verification was not disabled.
- Context7 and installed Vercel/React/Supabase skills used for supported APIs and release checks.
- Email, address provider and actual business contacts/policies remain unresolved.

## Milestones

| Area | Current state |
| --- | --- |
| Catalogue and storefront | 108 source records, 73 ready; shared frontend rebuilt with preserved motion and reference discovery/service navigation; production build passes |
| Basket | Exact variants, immediate +/− controls, live totals and browser persistence verified |
| Checkout/orders | Inherited prototype cannot open sales; mock cart/client prices/non-atomic writes remain behind explicit implementation guard |
| Admin | Antigravity routes retained; verified identity/role guards added to pages/actions; real staff/RLS/persistence proof pending |
| Contact/swatches | UI and POST validation wired; sample selection and enquiry prefill verified; real persistent submission and operational fulfilment still need proof |
| Builder | Seven steps; standard catalogue configurations enter basket; custom requests become enquiries |
| Room planner | Local moodboard prototype upload/keyboard/export verified; natural selected-product integration remains next milestone |
| Assistant | Local catalogue/policy guide working; generative/file assistant requires a configured provider and guarded server implementation |
| Content | Service/footer routes and original journal pages present; review moderation, appointment booking and private order lookup remain pending |
| SEO/release | Server catalogue/product routes and metadata retained; no commercial launch or indexing enablement until release gates pass |

## Checks

`npm run check` passes catalogue audit, seven tests and TypeScript. `npm run build` passes on Next.js 16.3.8. Browser checks and exact HTTP evidence are in the frontend progress report. Vercel preview URL and commit will be appended after deployment is READY. No new handoff document is being created.

## Latest preview

READY: https://oakmere-living-dqiho232k-salmanasad561-gmailcoms-projects.vercel.app (source `b339445`, guard integration `ea3ae44`, 10 October 2026). Both commits are pushed. Remote production build and deployed product/basket smoke check passed; full commercial launch remains gated. No production promotion was performed.

### 20 October verification outcome

- `npm run check`: catalogue audit, 13 domain tests and TypeScript passed.
- `npm run build`: Next.js 16.3.8 production build passed; 44 generated pages plus dynamic routes, including `/auth/callback`.
- Local production HTTP: Delivery, FAQ, Lily product detail and login error page return 200 with expected content. Administrator email is not rendered in the login page. Missing callback code returns 307 to the login error with private/no-store caching. Checkout POST remains 503.
- Provisioning command was attempted and stopped at staff-schema preflight; no live administrator creation or privilege write was reached. DNS diagnosis is recorded above. No email was sent and no password was generated.
- Full interactive browser, live email sign-in, Auth redirect allowlist, staff/RLS, catalogue publishing and persistent orders remain unverified. Do not infer those from build success.
