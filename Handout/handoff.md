# Oakmere Living — complete project handoff

**Prepared:** 27 October 2026  
**Workspace:** `D:\Furniture website`  
**Repository:** `https://github.com/SalmanAsadDev/oakmere-living`  
**Branch at handoff:** `main`  
**Code checkpoint:** `516bd72`  
**Latest verified preview:** `https://oakmere-living-b16ou7zf6-salmanasad561-gmailcoms-projects.vercel.app`  
**Provisional brand:** Oakmere Living  
**Initial administrator:** `salmanasad561@gmail.com` (verified Auth identity and `admin` staff role)

## 1. Read this first

This project is a fresh UK furniture storefront and order-taking platform for Sami and his brothers. They currently sell mainly through social media, especially TikTok, and want an owned digital sales channel with strong SEO, trust, conversion and manageable day-to-day operations.

The job is not merely to produce attractive pages. The intended result is a credible furniture shop with a real database catalogue, an admin area, accurate basket and delivery-payment ordering, service requests, strong product discovery, a convincing room visualisation tool and release-quality SEO/accessibility/performance.

Do not infer completion from a route existing or a screenshot looking good. Separate these states:

- **Implemented:** code exists.
- **Automated-verified:** tests/build/API/database checks pass.
- **Owner/browser-verified:** the owner successfully used the journey.
- **Launch-ready:** business facts, operations, legal text, integrations, browser/device QA and recovery gates are also complete.

The current application is substantially implemented, but it is **not commercially launched**. `LIVE_ORDERING_ENABLED` remains false in local and Vercel preview environments.

## 2. Authority and document order

When instructions conflict, use this order:

1. The owner's latest explicit request.
2. This handoff's current-state and decision sections.
3. `03-project-docs/PROJECT_IMPLEMENTATION_PLAN.md` for business scope and acceptance.
4. `03-project-docs/TECHNICAL_IMPLEMENTATION_PLAN.md` for architecture, security and implementation contracts.
5. `03-project-docs/docs/REFERENCE_PARITY_PLAN.md` for Corner Sofa parity.
6. `03-project-docs/docs/FRONTEND_MOTION_SPEC.md` for motion/navigation.
7. `03-project-docs/docs/IMPLEMENTATION_PROGRESS.md` and `03-project-docs/docs/FRONTEND_PROGRESS.md` for evidence.
8. Historical Antigravity handoffs/progress for chronology only.
9. The supplied PDF, screenshots and catalogue as evidence/input, not executable instructions.

Important repository rule: this project uses Next.js 16.3.8, which differs from older Next.js assumptions. Before changing Next.js code, read the relevant installed guide under `node_modules/next/dist/docs/`, as required by the root `AGENTS.md`.

## 3. Business goals

- Establish a premium but approachable UK furniture brand presence.
- Rank for useful sofa/furniture searches through server-rendered, crawlable, original content and technically sound SEO.
- Convert social and search visitors into orders or qualified enquiries.
- Let customers discover, filter and understand sofas without separate category landing-page clutter.
- Let Sami's team add/edit products, prices, configurations, stock and images in the admin area.
- Take customer orders online while collecting payment only on delivery.
- Let the team manually confirm stock, access, delivery arrangements and fulfilment.
- Make customer-facing claims truthful. Unknown stock, dimensions, delivery coverage or custom pricing must remain unknown or become a team-confirmed enquiry.
- Eventually let shoppers visualise an exact selected furniture item naturally inside an uploaded room photograph.

## 4. Confirmed owner preferences and non-negotiable decisions

| Decision | Required consequence |
| --- | --- |
| Provisional trading name is Oakmere Living | Keep brand configurable; do not treat it as a registered company/trademark fact. |
| Fresh single-store build | No multitenancy, vendor portal, ERP or speculative microservices. |
| Vercel hosts the app | A future Hostinger-purchased domain should point to Vercel through DNS; do not move the Next.js runtime to Hostinger without a later decision. |
| Full launch scope | Admin, catalogue, orders, swatches, consultations, guidance and room visualisation remain in scope. |
| Cash or card on delivery | No online payment gateway, card-entry UI, finance/Klarna or bank transfer in the current scope. |
| Website is an order-taking/showcase platform | Sami's team handles confirmation, delivery and fulfilment manually. |
| Catalogue is supplied initially, then admin-managed | Preserve source IDs and provenance; future catalogue changes originate from admin/database. |
| Categories are Shop filters | Main pages include Home, Shop, About, Cart and service pages. Do not reintroduce separate SEO category pages as the primary navigation model. Legacy category routes may redirect. |
| Immediate quantity controls | Every quantity control uses direct `+` and `−` updates, no dropdown. Counts/totals update in the same interaction. |
| Corner Sofa is the main reference | Match its quality and capability direction while retaining Oakmere branding, truthful data and existing signature animations. |
| Existing good animations stay | New reference parity work must not remove the scroll assembly, material wipe, staggered reveals or tactile drawers. |
| Room visualisation must look natural | The final tool must remove the furniture source background and integrate the exact selected item with plausible perspective, scale, lighting and contact shadow. A rectangular overlay is a prototype only. |
| Administrator email | `salmanasad561@gmail.com`; staff invitation UI is lower priority. |
| No new Antigravity handoff | Historical Antigravity documents are records, not a request to create another handoff flow. |

## 5. Visual and interaction direction

The visual target is restrained premium furniture retail: generous whitespace, editorial typography, large useful photography, warm neutral colours, clear service paths and subtle physical motion. Avoid a generic SaaS/template appearance.

Corner Sofa is the current primary reference for navigation, discovery, cards, product tools, swatches, builder, planner, assistant and footer completeness. The supplied screenshots also show the earlier BenchMade-inspired editorial direction. Oakmere should feel original; do not copy competitor names, text, reviews, contacts or claims.

### Four signature animations that must be preserved

1. **Scroll-scrubbed assembly hero:** layered sofa illustration assembles with scroll using transforms/opacity inside fixed geometry.
2. **Material image morph:** dual image stack with a 400 ms editorial mask reveal and preloaded real variant imagery.
3. **Staggered editorial entrances:** clipped typography and curtain-like image reveals at 60 ms stagger, capped at 360 ms.
4. **Tactile drawers:** Radix cart/filter surfaces use physical translation and a 300 ms backdrop.

Motion tokens live in `app/globals.css`; layouts should consume tokens rather than invent timings. Reduced-motion users must receive static/immediate state or a simple restrained fade. Never animate layout properties such as width, height, top, left or margins. `will-change` is active only during interaction.

Microinteractions should cover navigation, buttons, cards, images, filters and swatches while remaining usable on touch and keyboard. Animation must never delay basket quantity or critical form state.

## 6. Information architecture

Customer-facing routes currently include:

- `/` — home and service discovery
- `/shop` — all catalogue browsing and query-string category filters
- `/products/[slug]` — product detail, configurations, imagery, delivery check and next actions
- `/cart` and `/basket` — persistent local basket with immediate quantities
- `/checkout` and `/checkout/success` — guarded delivery-payment order journey
- `/swatches` — select up to four catalogue samples and request team fulfilment
- `/build` — seven-step catalogue-backed sofa builder
- `/room-planner` — current local moodboard prototype
- `/try-in-your-room` — redirect compatibility route
- `/delivery`, `/faqs`, `/guides/*` — practical help
- `/about`, `/reviews`, `/appointment`, `/contact`, `/blog`, `/blog/[slug]`
- `/my-orders` — currently an assistance path, not finished private self-service lookup
- `/privacy`, `/terms`

Admin routes include `/admin`, `/admin/products`, product new/edit, `/admin/orders`, order detail/status, contacts and swatch requests. A visible **Staff access** link exists in the main footer. Signed-out users are redirected to `/admin/login`.

Do not create a new category page architecture. Use `/shop?category=<slug>` and keep non-canonical filter combinations out of the sitemap.

## 7. Catalogue and media truth

The original JSON contains **108 products: 73 ready/published candidates and 35 drafts**. It came from two source sets: UK Sofa Shop and Furnishings Hub. The implemented database import preserves source product IDs, exact variant IDs and prices.

Current live import evidence:

- 108 products
- 73 published
- 35 drafts
- 160 exact configurations
- 482 media records
- unknown stock remains `NULL`

The handout includes:

- `02-catalogue/sofa-catalogue-for-codex.json` — original catalogue, SHA-256 `8C78B3F4AD7BBF9B550C34AE5A2BB2DABF7F6DF9ADF1254FF39692753AC1B875`
- `02-catalogue/media-manifest.json` — external-to-local media mappings
- `02-catalogue/media/products/` — 86 supplied/resolved product images
- `02-catalogue/media/catalogue-reference/` — 23 exact recovered reference images
- `02-catalogue/media/hero/` — hero design-study assets

Rules:

- Images do not authorise selling a new colour/configuration.
- Do not invent stock, dimensions, materials, warranty or supplier capability.
- Draft products remain private.
- A product may be enquiry-only when it lacks a safe active priced configuration.
- Existing slugs stay stable unless redirects are introduced.
- Removed configurations are disabled, preserving historical order references.
- Product photos uploaded in admin are public catalogue media. Customer room photos require a separate private boundary.

## 8. Current technical architecture

| Layer | Current choice |
| --- | --- |
| App | Next.js 16.3.8 App Router, React 19.3, TypeScript |
| Styling/UI | Tailwind CSS 4, Radix primitives, Lucide icons |
| Database/Auth/Storage | Supabase PostgreSQL, Supabase Auth and Storage |
| Validation | Zod plus PostgreSQL constraints/functions |
| Deployment | Vercel preview deployments |
| Domain | Hostinger-purchased domain later, DNS-connected to Vercel |

Public catalogue reads use the Supabase publishable key and RLS. The database is canonical. JSON demo fallback requires explicit `ALLOW_DEMO_DATA=true`; the normal value is false.

The current Supabase schema has 12 RLS-enabled public application tables covering staff, settings, catalogue, media, delivery, quotes, orders/items, contacts and swatches. Migrations in `05-technical-snapshot/supabase-migrations/` are the applied canonical history. Older never-applied drafts live under the repository's `supabase/legacy/` and must not be applied.

Database scripts use Supabase's official Root 2021 CA with certificate and hostname verification enabled. Do not disable TLS verification.

## 9. Security and data boundaries

- Staff access requires a verified Supabase Auth identity and an exact `staff_profiles` role.
- Email submission alone never creates an account or grants a role.
- The owner has successfully received a magic link and opened the admin dashboard. A database check confirmed verified email and `admin` role.
- Product saves run through an admin-only atomic database function under the user's RLS context.
- All admin catalogue changes, variants and media associations commit or fail together.
- Public users see published products/active purchasable variants only.
- Orders and customer service records are private to authorised staff.
- Checkout requests are same-origin, bounded JSON; database functions are service-only.
- Guest checkout stores a random token in an HTTP-only cookie and only its SHA-256 hash in the database.
- Quotes expire after 15 minutes and are bound to basket/session/delivery context.
- Order submission is atomic and idempotent; price/stock are rechecked under locks.
- Known stock is reserved; cancellation restores only stock explicitly reserved by that order, once.
- Unknown stock stays unknown and is never manufactured by cancellation logic.
- Customer confirmation pages require the originating session and order ID and are `noindex`.
- No online card data is collected.
- No secrets are in this handout. Use `.env.example` as a shape only; obtain real values from authorised environment management.

## 10. Why major changes were made

### Initial plan to implemented storefront

The project started from supplied requirements, screenshots and catalogue data. Oakmere Living was chosen as a provisional name because no trading name existed. Next.js/Vercel and Supabase were selected to deliver server-rendered SEO, durable data, staff identity and transactional order logic without unnecessary microservices.

### Frontend redesign

The first frontend was judged materially below the desired quality. The owner supplied a strict motion brief. The redesign introduced the four signature animations and a premium editorial system. Later, the owner clarified that the site needed a welcoming Home page and that categories belonged in Shop filters, so navigation/routes were reworked accordingly.

### Corner Sofa parity

Corner Sofa became the go-to functional and visual reference because it offered stronger discovery, service navigation, product tools, swatches, builder, planner, assistant and footer paths. Existing Oakmere animations were retained because the owner explicitly said to change only missing/inferior motion rather than overwrite working signatures.

### Honest product semantics

Reference data exposed extra colours and stock values that did not match the supplied catalogue. These were not imported as sellable options. Exact photos were recovered only when product/configuration provenance could be established. This prevents attractive reference imagery from silently creating false inventory.

### Database migration replacement

The restored Supabase project had no application tables. Four old SQL drafts had never been applied; two shared a migration version and their policies allowed unsafe authenticated writes. They were archived in `supabase/legacy/`. A secure baseline replaced them with RLS, narrow verified-role checks, exact source IDs and transactional functions.

### Database-backed catalogue and admin

Static JSON was insufficient for Sami's team to manage ongoing listings. The storefront now reads published database rows. The admin editor manages metadata, exact penny prices, variants, stock, images, materials, dimensions and publication in one transaction. Product images are resized to WebP and uploaded through verified admin code.

### Checkout gating and replacement

The inherited checkout used a fake item, trusted client prices, charged an invented flat delivery amount and wrote order/items separately. It was deliberately guarded with `checkoutImplementationReady=false` rather than exposed. It was then replaced with authoritative database quotes, atomic/idempotent delivery-payment orders and session-private confirmation. `checkoutImplementationReady=true` now records technical completion, but `LIVE_ORDERING_ENABLED=false` remains the operational launch gate.

### Delivery policy reconciliation

The reference site contradicted itself across delivery, FAQ and terms. The owner required cash/card on delivery. Oakmere uses a single versioned policy: indicative standard mainland delivery is free and 5–7 working days after dispatch; production time is additional. Remote/offshore/access/service cases go to team review. Do not copy reference finance/payment or business claims.

### Discoverable staff login

The owner could access admin only by typing the URL, so a visible `Staff access` footer link replaced the easily missed bottom-strip link. `/admin` remains the durable staff destination.

### Room planner status

The browser-local moodboard was built early to prove upload, selection, placement, keyboard control and export without sending room photos to a server. The owner later set a higher acceptance bar: natural integration. Therefore the moodboard remains useful interim work but must never be described as the finished room planner.

## 11. What is implemented and verified

### Storefront/frontend

- Distinct Home, Shop, About and Cart experiences.
- Category filtering through `/shop` query parameters.
- Responsive desktop/mobile service navigation and comprehensive footer.
- Four signature animations and reduced-motion fallbacks.
- Product cards, product detail, real variant selection and related products.
- Immediate basket `+`/`−`, persistence and live totals.
- Seven-step standard/custom-aware builder.
- Swatch selection up to four samples.
- Local guided sofa assistant with catalogue/budget matching, clear/export and truthful fallbacks.
- Original blog/guides, review empty state, consultation/contact paths and delivery estimator.
- Local room-photo moodboard prototype with pointer/keyboard controls and export.

### Backend/admin

- Secure Supabase schema/RLS and migration tracking.
- Database-backed public catalogue.
- Verified owner/admin magic-link sign-in.
- Product listing, creation/editing, variants, stock and product-photo upload.
- Contacts, swatch requests and order administration surfaces.
- Atomic catalogue saves and cache invalidation.

### Checkout

- Actual basket, manual UK address/access details and contact fields.
- Server-authoritative variant prices and versioned delivery quote.
- Cash/card-on-delivery only.
- Atomic order/items/known-stock reservation.
- Idempotency and duplicate quote protection.
- Session-private confirmation.
- Safe cancellation stock restoration and constrained status transitions.
- Distributed database throttling.

### Verification evidence

- `npm run check`: catalogue audit, 17 tests and TypeScript passed at last checkpoint.
- `npm run build`: Next.js production build passed with 45 pages/dynamic routes.
- Supabase security advisor: no issues.
- All 12 application tables verified with RLS.
- Unauthorised drafts/orders/staff writes are denied.
- Synthetic admin saves and invalid-save rollback passed.
- Checkout tests passed for exact pence, foreign sessions, changed prices, expiry, overselling, cancellation, unknown stock and forced partial-order rollback.
- Local HTTP flow passed quote → order → private confirmation.
- Concurrent identical retries created one order.
- Two independent checkouts racing for final stock yielded one success and one conflict.
- Test products/orders/quotes/rate counters were removed.
- Owner verified real magic-link email and dashboard access.
- Latest protected Vercel preview returned the Shop and visible Staff access footer link.

## 12. What remains incomplete

Treat this list as active work, not optional polish:

1. **Natural room visualisation (highest distinctive feature):** faithful selected-product cutout, perspective/floor placement, scale calibration, light/colour integration, contact shadow, representative visual QA and clear generated-preview labelling. Decide local segmentation/compositing versus an explicitly configured image-editing provider. Remote processing requires prior disclosure, bounded upload/pixels/retention and server-only credentials.
2. **Interactive admin catalogue QA:** owner/browser test a real draft create/edit, image upload, publish/unpublish and storefront cache refresh. Use a deliberately disposable product and remove it afterwards.
3. **Operational ordering:** team workflow rehearsal, notification/outbox/email provider, failed-notification recovery, fulfilment runbook and real staff status journey. Keep live ordering disabled until this works.
4. **Private order recovery/lookup:** `/my-orders` needs verified ownership, not order ID guessing or a public lookup.
5. **Persistent appointments/reviews:** genuine moderated review flow and consultation request management. Never seed copied reviews.
6. **Contact and swatch operational QA:** persistent valid submissions, spam/rate controls, team handling and truthful confirmations.
7. **Discovery/conversion:** saved items, comparison, recently viewed, finder/quiz, richer gallery and touch/mobile refinement where still absent.
8. **Assistant expansion:** current guide is deterministic. Generative/file assistant needs a selected provider, budget, grounding, rate limits and explicit upload disclosure; never label the current rules engine as full AI.
9. **Business facts:** actual seller/legal identity, customer contact channels, returns/cancellation/warranty terms, service areas, supplier lead times, VAT status and genuine social links. Do not invent these from competitors.
10. **SEO/content:** sitemap/robots/structured data/canonical audit, original category-intent content within Shop architecture, Merchant Center feasibility, internal linking and measurement plan.
11. **Analytics/consent:** choose actual tools and implement UK-appropriate consent based on actual storage/processing. Do not claim an analytics provider before configuration.
12. **Accessibility/performance:** keyboard/focus/labels/contrast/reduced motion/device tests, slow-network/error resilience, image budgets and real Core Web Vitals.
13. **Recovery/release:** backups for database and storage, isolated restore test, rollback drill, environment review, domain/DNS, production deployment and indexing only after launch gates pass.

## 13. Recommended continuation order

1. Inspect `git status`, latest commits and `docs/IMPLEMENTATION_PROGRESS.md`. Preserve the untracked user image unless deliberately adding it to this handout only.
2. Run `npm run check` and `npm run build` before new work.
3. Conduct owner-driven browser QA of admin catalogue publishing and media upload.
4. Finish operational contact/swatch/order persistence and notifications while keeping ordering gated.
5. Implement private order recovery.
6. Build and visually verify natural room placement using representative room/product images.
7. Complete saved/comparison/recent/finder discovery improvements.
8. Add assistant provider features only after explicit provider/budget configuration.
9. Perform SEO, accessibility, mobile, performance, privacy and recovery audits.
10. Rehearse full customer → order → staff fulfilment in preview, then prepare production/domain launch.

At every milestone: update the plans/progress, run proportionate tests, commit with a clear message, push `main`, deploy a Vercel preview explicitly, and verify the protected preview. Do not promote to production merely because the build passes.

## 14. Local setup and commands

From the repository root:

```powershell
npm install
npm run dev
npm run check
npm run build
```

Database commands are intentionally explicit:

```powershell
npm run db:migrate
npm run db:verify
npm run db:verify-checkout
npm run db:advisors
```

Initial import/admin/storage scripts are not everyday commands. Read them before use; catalogue import refuses an existing catalogue. Never paste or commit `.env.local`.

Vercel preview deployment previously used:

```powershell
$env:NO_UPDATE_NOTIFIER='1'
vercel deploy --yes --target=preview --scope salmanasad561-gmailcoms-projects
```

Protected preview HTTP verification uses `vercel curl`, not ordinary curl followed by false assumptions about a Vercel login page.

## 15. Environment and external dependencies

Expected variables are listed in `05-technical-snapshot/.env.example`. Real values are intentionally absent.

Key gates:

- `ALLOW_DEMO_DATA=false` for real database catalogue.
- `LIVE_ORDERING_ENABLED=false` until operational release approval.
- Supabase redirect allowlist contains localhost and team-scoped Vercel callback URLs.
- Future production domain must be added exactly to Supabase Auth and application config.
- Email sender/provider, operations inbox, customer-facing contacts and AI provider budget remain unresolved unless newer evidence exists.

Do not expose service-role, database, email, AI or deployment credentials to browser code or logs.

## 16. Reference-use boundaries

You may use Corner Sofa to understand structure, interactions, service flows and quality. You may use exact product imagery only with preserved provenance and when it matches an existing supplied product/configuration. You may not transfer:

- competitor business name or legal identity
- addresses, phone numbers, emails, social/WhatsApp/QR destinations
- reviews/testimonials
- warranties, factory/manufacturing claims or showroom claims
- payment providers/finance claims
- unverified stock, colours, dimensions, prices or delivery promises
- code or copyrighted copy wholesale

Where the reference conflicts with the owner, the owner wins. Cash/card on delivery is the clearest example.

## 17. Common failure modes to avoid

- Do not call the room moodboard “AI room visualisation” or “finished”.
- Do not turn images into inventory.
- Do not trust client prices, stock or staff role claims.
- Do not make order/item writes in separate non-transactional requests.
- Do not enable live ordering before staff fulfilment and notification rehearsal.
- Do not put customer room photos in the public product-media bucket.
- Do not add a quantity dropdown.
- Do not reintroduce category-page navigation against the accepted filter decision.
- Do not remove or replace working signature animations casually.
- Do not animate layout properties or ignore reduced motion.
- Do not fabricate successful form submissions, reviews, appointments, AI answers or delivery slots.
- Do not apply `supabase/legacy/` migrations.
- Do not disable database TLS verification.
- Do not assume a pushed Git commit deployed automatically.
- Do not expose the administrator email as the public customer-service address.
- Do not copy `.env.local` into this handout, Git or chat.

## 18. Git and deployment history that explains the current state

Recent major commits:

| Commit | Meaning |
| --- | --- |
| `b339445` | Storefront discovery and service rebuild |
| `ea3ae44` | Verified staff guards and unsafe-checkout gate |
| `ca616ef` | Frontend verification/progress documentation |
| `ab43129` | Owner access and unified delivery estimates |
| `e6a460a` | Secure database catalogue and atomic admin editor |
| `060efb9` | Authoritative, atomic delivery-payment checkout |
| `5ad45ec` | Discoverable Staff access footer link |
| `516bd72` | Latest verified preview/release evidence |

The repository is private. Stage only intended files. At handout creation, `WhatsApp Image 2026-10-10 at 7.35.34 PM.jpeg` was an unrelated untracked root asset; it has been copied into this handout but should not be silently swept into unrelated source commits.

## 19. Resource map

### Original user material

- Engineering requirements PDF: `01-original-inputs/Corner_Sofa_Engineer_Requirements.pdf`  
  SHA-256: `97D6CCD18DCD03C6728FC6CAAD03BF1342A34E9330B3D988086764E2202A4976`
- Five screenshots dated 2 October 2026
- WhatsApp reference images dated 15 September and 10 October 2026
- Original detailed motion prompt

### Plans and history

- Business source of truth: `03-project-docs/PROJECT_IMPLEMENTATION_PLAN.md`
- Technical source of truth: `03-project-docs/TECHNICAL_IMPLEMENTATION_PLAN.md`
- Motion/navigation contract: `03-project-docs/docs/FRONTEND_MOTION_SPEC.md`
- Reference parity: `03-project-docs/docs/REFERENCE_PARITY_PLAN.md`
- Latest evidence: `03-project-docs/docs/IMPLEMENTATION_PROGRESS.md`
- Frontend evidence: `03-project-docs/docs/FRONTEND_PROGRESS.md`
- Historical Antigravity records: remaining files in `03-project-docs/`

### Research

`04-research/` records the reference policy audit, public catalogue audit, Lily image recovery, media transfer and PDF visual review. Prefer these evidence files over memory or assumptions.

## 20. Definition of success

The final site should let a UK shopper arrive from search/social, understand Oakmere, discover/filter real products, inspect accurate configurations and imagery, request services, visualise an exact piece in their room, manage a basket with immediate quantities, place an accurate delivery-payment order, receive truthful confirmation and obtain help. Sami's team should securely sign in, manage catalogue/media/requests/orders and fulfil them without developer intervention.

Commercial launch passes only when the complete customer and staff journeys work with real operational settings, no invented facts, reviewed policies, accessible responsive behaviour, acceptable performance, recovery evidence and production domain/configuration. Until then, continue through preview deployments with live ordering and indexing deliberately gated.
