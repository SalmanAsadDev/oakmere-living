# Antigravity implementation handoff

Updated: 7 October 2026. The frontend motion redesign is **in progress**, not accepted as final. The user authorises work on unfinished pages while Codex finishes the shared storefront. Do not restart or redesign the application.

## Read first

1. `AGENTS.md` and the relevant installed Next.js guides in `node_modules/next/dist/docs/`.
2. `PROJECT_IMPLEMENTATION_PLAN.md`: business requirements and acceptance criteria.
3. `TECHNICAL_IMPLEMENTATION_PLAN.md`: architecture and transaction contracts.
4. `docs/FRONTEND_MOTION_SPEC.md`: latest navigation/motion direction; overrides older category-page recommendations.
5. `docs/IMPLEMENTATION_PROGRESS.md`: actual implementation status and provider blockers.

The plans describe intended behaviour; they are not evidence those features exist. Inspect source before connecting anything.

## Work ownership while the frontend rebuild continues

**7 October additive scope:** `REFERENCE_PARITY_PLAN.md` is the latest route/functionality contract. Codex is implementing the newly requested shared planner, builder, assistant, navigation/cards/footer and parity page entry points. Antigravity retains order/admin and persisted service endpoints. Do not overwrite the new tools while wiring services. Disabled service forms require validated persistence before re-enabling.

Antigravity may create or change these currently unfinished areas:

- `app/contact/`, `app/delivery/`, `app/guides/`, `app/faqs/`, `app/privacy/`, `app/terms/`.
- `app/swatches/`, `app/showrooms/` and their own components in `components/services/`.
- `app/checkout/`, `components/checkout/` and order-confirmation routes, following the quote and guest-ownership contracts. Do not imply an order is saved without a successful persistent transaction.
- `app/admin/`, `components/admin/`, `app/api/`, `lib/server/`, `lib/validation/`, `lib/adapters/`, `supabase/` and backend tests, following the technical plan. These are absent/incomplete, not a working backend to merely style.
- `components/previews/` and `app/try-in-your-room/`, with private browser-only room photos. Do not edit the shared material-morph component.
- New, narrowly scoped domain modules (e.g. quote/order rules). Avoid changing the existing catalogue module until its integration boundary is agreed in the handoff log.

Codex retains ownership of these shared frontend files until the rebuild is finished:

- `app/page.tsx`, `app/about/`, `app/shop/`, `app/products/`, `app/cart/`, `app/basket/`, legacy `app/sofas/` redirects.
- `app/layout.tsx`, `app/globals.css`, `components/storefront/**`, `components/ui/**`, `lib/presentation/**`, `lib/domain/catalogue*`, `lib/data/media-manifest.json` and shared product imagery.
- Shared dependencies/configuration (`package.json`, lockfile, Next/PostCSS/TypeScript configuration). Propose needed changes in the handoff log; avoid competing edits.

Reuse shared components; do not modify them to make one new page work. The root layout already provides the header, footer and basket context. New pages should return their own main content, not duplicate those wrappers. Use existing Tailwind tokens, `.container`, `.section`, `.display`, `.eyebrow`, Button/Input/Sheet and `Reveal` where useful. Avoid broad CSS selectors and new animation timing values.

## Contracts that must stay stable

- Navigation: `/` is Home; `/shop` is the one catalogue with `category`, `material`, `q`, `sort` query filters; `/about` and `/cart` are distinct pages. Product detail is `/products/[slug]`. No category landing pages.
- Basket: import `useBasket` and `BasketItem` from `components/storefront/basket-provider.tsx`. Items expose `variantId`, `productId`, `slug`, `name`, `label`, `image`, `price` (integer pence), `quantity`. These are browser display values, never trusted order totals. No customer/address/payment data belongs in local storage.
- Catalogue: `lib/domain/catalogue.ts` is server-only and currently reads supplied JSON. Client components may import its types only. Database integration is still required; source `ready` does not mean approved for live sale.
- Payment methods are cash on delivery and card on delivery. No online card collection. Due now is zero; orders initially await team confirmation.
- Only verified facts go live. Do not invent showroom addresses, phone numbers, reviews, stock, legal seller details, guarantees or approved fabrics. Unknown operational facts must remain explicit configuration tasks.
- Server endpoints must authenticate/authorise, validate, rate-limit and persist correctly. Admin UI visibility is not authorisation. RLS and transactions are required; do not create anonymous writes to private tables to get a demo working.
- React 19 / Next 16 App Router / Tailwind 4 / Supabase. Read installed docs; do not downgrade dependencies or replace this with a Vite/Express/Mongo application.

## Infrastructure facts

- Private repo: https://github.com/SalmanAsadDev/oakmere-living. Commit and push each verified milestone with meaningful messages. Do not force-push or stage another tool's unfinished files.
- Vercel project `oakmere-living`, scope `salmanasad561-gmailcoms-projects`. GitHub automatic deployment is not connected; use the existing CLI credentials. Explicitly deploy with `--target=preview` for review builds. Preserve deployment protections.
- Supabase exists in London, attached to development/preview; production database integration is not configured. `.env.local` is ignored and contains credentials. Never copy it into documentation, commits or prompts.
- Direct Postgres access failed TLS verification with `SELF_SIGNED_CERT_IN_CHAIN`. Obtain the provider's CA certificate and configure verified TLS; do not disable certificate validation. The CLI-created `supabase/migrations/20261006160500_commerce_foundation.sql` is empty and unapplied.
- Email and address-lookup providers are not configured. Manual address entry is required. No simulated successful email/request/order confirmations.
- Keep indexing and live ordering disabled until the launch acceptance criteria pass.

## Remaining frontend rebuild work for Codex

**7 October checkpoint:** see `FRONTEND_PROGRESS.md` for the latest verified status and integration findings. The hero artwork, reveal sequencing and drawer reversal mechanism below have now been improved; local media coverage is now 86 of 100 attempted URLs (14 return 404). The source-image and device/performance dependencies remain. Before the next preview/launch milestone, address the unwired forms' native GET submissions and unverified contact details identified in that progress file.

1. Upgrade the hero's vector design study to a more convincing premium furniture treatment if approved. It is not a photograph of a real product.
2. Resolve missing catalogue photographs: 100 source URLs attempted, 20 copied, 80 errors. Never substitute another SKU's photo. See media-transfer report.
3. Material swap currently masks whole supplied photographs. A true silhouette-only fabric morph needs aligned product cutouts/masks, not arbitrary background-changing photographs.
4. Finish choreography polish. Current headings/cards use masks and capped stagger, but section title/subtitle/CTA sequencing needs a consistent final pass.
5. Test reduced-motion mode on a real/emulated browser preference, slow-image failure/recovery, rapid swatch interruption, drawer interruption/focus restoration and multiple mobile widths. Existing browser checks are not a complete accessibility/performance audit.
6. Improve drawer reversal continuity if interrupted halfway; current Radix keyframe animations do not lock input but can restart from an endpoint.
7. Verify CLS and performance on realistic mobile hardware; do not infer zero measured CLS from aspect-ratio CSS alone.

The revised Shop now uses request-time rendering so its client filter component can contribute product HTML on the initial response instead of leaving only a Suspense loading shell.

## Safe parallel workflow

Prefer separate branches/checkouts if both tools are writing at the same time. A branch switch in one shared directory affects both tools; do not switch branches under a running tool. If using the same directory sequentially, follow the ownership list strictly and inspect `git status` before edits/staging.

Run appropriate targeted tests and `npm run build` after an integration milestone. Do not run two installers, migrations or production deployments concurrently. Add evidence and blockers to `docs/ANTIGRAVITY_PROGRESS.md` (a new log owned by Antigravity), so Codex can integrate the work without reverse-engineering changes. Never reset, clean or overwrite the other tool's work.

## Paste-ready instruction

Continue implementing the unfinished Oakmere Living pages and backend in this existing repository. First read docs/ANTIGRAVITY_HANDOFF.md and the referenced plans. Follow its ownership boundaries: preserve the shared homepage, Shop, navigation, global styles, motion components and dependency configuration while Codex finishes the frontend rebuild. Begin with the supporting content pages, then implement real persistent contact/services and protected admin/order flows according to the technical plan. Reuse existing UI primitives and design tokens. Do not claim placeholder forms are functional, invent business facts, expose secrets, bypass TLS/RLS, or enable live orders/indexing prematurely. Record work and validation in docs/ANTIGRAVITY_PROGRESS.md, and commit/push verified milestones without staging unrelated changes.
