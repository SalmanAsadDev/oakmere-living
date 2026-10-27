# Antigravity handoff 02 — Corner Sofa parity

Prepared 7 October 2026 at the user's request before the Codex session limit. This is an additional work package, not permission to discard the existing frontend. Read this before writing code. Check `git status` and the latest commits: another tool may have completed tasks after this snapshot.

## Start here

1. `AGENTS.md` and installed Next documentation in `node_modules/next/dist/docs/`.
2. `PROJECT_IMPLEMENTATION_PLAN.md` v0.3 and `TECHNICAL_IMPLEMENTATION_PLAN.md` v1.1.
3. `docs/REFERENCE_PARITY_PLAN.md` — newest additive requirements, route map and acceptance criteria.
4. `docs/FRONTEND_MOTION_SPEC.md` — mandatory existing motion tokens and four signatures.
5. `docs/FRONTEND_PROGRESS.md`, your `docs/ANTIGRAVITY_PROGRESS.md`, and the first handoff for infrastructure facts.

Latest verified application checkpoint at handoff preparation: **e1872e6**, pushed to `main`. Preview: https://oakmere-living-2g4fwwvq7-salmanasad561-gmailcoms-projects.vercel.app. Local tests/typecheck/build and Vercel build passed. There has not yet been a new parity-feature deployment. The reference audit and plan additions in this handoff are requirements, not completed features.

## User's latest instruction

Corner Sofa (https://www.cornersofa.online/) is now the primary visual reference. Match its navigation, useful product-card interactions, service discovery and page/function coverage using Oakmere branding and actual product photos. Add missing micro-interactions to navigation, photos and CTAs. Put Swatches in the top navigation. Include builder, room planner, reviews, appointments, blog, My orders, delivery availability and a shopper assistant. End Home with a clear shopping action and include equivalent footer destinations. **Preserve current animations and functioning basket/filters.** Categories stay query filters on `/shop`; they are not new category pages.

## What exists and must be preserved

- Distinct Home, Shop, About and Cart; legacy sofa/category URLs redirect to Shop.
- Real supplied catalogue normalization, source identity, integer-pence pricing, draft exclusion and variant validation. 108 source products, 73 marked ready; readiness is not proof of live-sale approval.
- Basket is a client context with public item snapshots. Server checkout must ignore client prices and recompute authoritative totals.
- Home hero: three cropped layers of an original transparent illustration, scroll assembly, fixed geometry. It is intentionally not a photograph of stock. Do not replace it with the reference's static lifestyle hero.
- Product image morph: loaded-image mask at 400ms, failed image retains prior photo; only actual variant images. True silhouette-only fabric morph still needs aligned photography.
- Independent section/card reveals at 60ms stagger capped 360ms; tactile Radix drawers use reversible CSS transitions, 300ms overlays, focus handling and reduced motion.
- 86 of the first 100 attempted ready-product image URLs are stored locally. 14 source URLs return 404. No substitute SKU photos were used.
- Your supporting pages exist. Codex disabled Contact/Swatches forms because their native GET submission exposed named fields in the URL; removed an unverified email link. Keep them disabled until validated persistent endpoints work.

## Reference evidence collected in browser

### Navigation / footer

Home navigation: Home, Products dropdown, Swatches, Build, Contact, About, Reviews, Delivery Availability; additional Plan Room, basket and My orders actions. Footer groups: Collection (all sofas, sets, corners, U-shape, recliners, sofa beds), Here to help (delivery, measuring, swatches, FAQ, planner, contact), Company (story, appointments, reviews, blog), plus contact/social and fabric CTA blocks.

Use our established route spellings from `REFERENCE_PARITY_PLAN.md`. Do not copy competitor telephone, email, social handles, QR codes, handmade claims, delivery promises or reviews. Oakmere contact/social information is still unconfirmed.

### Product cards / detail

Reference cards have actual image, category, name, selectable finishes, price, Shop sofa, Try in room, review link and option count. Product detail adds gallery arrows/thumbnails, Build this sofa, Swatches, delivery/measuring links, detail accordions and related products. Implement price/selection from our actual variants. The reference displays more variants for some products than our supplied data; copying images does NOT authorize selling those extra variants.

### Builder

Reference `/build/` has seven steps: shape, design, colour, fabric, piping, extras, summary. Shape uses catalogue-derived starting prices, back-style preference, custom-size quote option. Design lists actual products with details and comparison selection. Oakmere should support exact standard variants via existing basket and make unapproved custom choices an explicit quotation brief. Never invent a fixed custom price, supplier capability or saved quotation.

### Room planner

Reference `/room-planner/` has four stages: room photo, sofa, set space, place sofa. Upload says JPEG/PNG/WebP, 15 MB, browser-only, clears on refresh. A generated non-personal test image was uploaded to inspect stage 2; category/product selection appeared. No personal customer room photo was used. Later calibration/export behaviour still needs inspection and independent implementation verification.

### Assistant

Floating HELPER panel offers suggested questions, typed chat, Cancel, Clear, Save chat, team links, photo/doc attachment with 5 MB disclosure. **Observed failure:** clicking “Can I pay on delivery?” resulted in `ENOENT ... /var/task/frontend/.local-data`; no successful model answer was verified. Do not copy its filesystem persistence or assume it works.

Build a useful, truthful Oakmere guide. A catalogue-backed local guide can answer payment/measurement questions and filter actual products immediately; label it as guided help, not generative AI. Full AI parity needs real provider setup, grounding, validated bounded requests, rate limits, explicit file-upload disclosure and server-only credentials. No private room images should be sent automatically to an assistant. Provider integration must never block local shopping/navigation.

## Image recovery lead — verified exact match

Reference product: Lily 5 Seater Corner 2c2 High Back:
https://www.cornersofa.online/product/c106388e-7887-5e1e-af39-643201484bdc/?variant=9702cb23-7c3a-5de1-a568-9a17045c754f

Observed Grey main photo: `https://www.cornersofa.online/images/catalogue/45d1a3d1d702990f12976c1e.webp`.
Other gallery paths observed on that page: `db2820ed3d152f46954fbfa2.webp`, `65f68f9bc0e6cfb191dcbc23.webp`, `f957bd2750bbcb98408233c1.webp` under the same directory. **Their colour association has not been verified; do not guess.** Click each colour and inspect alt/src before mapping.

Our matching source product ID: `uksofashop:a585764d-0051-4b2c-8f4d-57122ad59d72`. Other affected source names: Lily Armed U-Shape High Back, Lily U-Shape High Back, Lily Footstool, Lily 3+2 Seater Scattered Back, Lily 5 Seater Corner 2c2 Scattered Back, Lily 3+2 Seater High Back. See `docs/research/media-transfer.json` for exact missing URLs. Download verified replacements into project media and record original URL, reference product page, colour and replacement. Preserve source IDs and original JSON.

## Implementation order and ownership

Check the latest commit/diff before taking each item; Codex may complete the first items while this handoff is being prepared. Do not modify files Codex is actively editing in the same checkout. The user has explicitly authorized you to continue after the session ends.

1. **Shared UI parity:** `components/storefront/shell.tsx`, `product-card.tsx`, `product-detail.tsx`, `app/page.tsx`, `app/globals.css`. Extend existing tokens; keyboard-focus equivalents; touch-visible actions; preserve hero and drawer logic. Verify no nested links/buttons in cards.
2. **Browser-local planner:** `app/room-planner/page.tsx`, `components/previews/room-planner.tsx`, small pure geometry/validation helpers. Serializable public product projection, initial product query selection, upload validation/decode errors, object-URL cleanup, pointer + keyboard/range placement, scaling, rotation, reset/export. Explain that source photographs may retain backgrounds and image previews are not precise fit guarantees. No photo upload endpoint/localStorage. Add entry points from Home/cards/PDP/nav/footer.
3. **Seven-step builder:** `app/build/page.tsx`, `components/storefront/sofa-builder.tsx`, pure selection validation helpers/tests. Invalidate dependent selections on shape/model changes. Exact standard variant adds to basket; custom size/piping/extras remain quote-only. Exporting a brief is not submitting an order. Persist real quotation requests only through a validated endpoint.
4. **Assistant:** separate small lazy client module; deterministic verified catalogue guidance can function without credits. If adding AI, follow installed Vercel AI SDK/AI Gateway skills, discover a current compatible model, keep credentials server-only, bound history/files/cost and document consent. Never read order/customer data without ownership authorization. Never fake an AI response or successful team handoff.
5. **Parity pages:** reviews, appointment, original inspiration/blog content, order lookup; approved delivery availability. Preserve genuine data boundaries. Empty states and unconfigured-service notices are acceptable during development but are not full functional completion. Record backend blockers explicitly.
6. **Persisted services / commerce:** continue your original order/admin/contact/swatches scope. Use verified TLS, Supabase Auth/RLS and transaction contracts from technical plan. Resolve CA connectivity without disabling TLS. No anonymous access to private customer tables, no local-disk Vercel persistence, no frontend-only admin authorization.
7. **Verification:** test exact variants/prices, custom quote guard, upload size/type/decode failures and URL cleanup, keyboard planner controls, assistant grounding, mobile navigation and every footer URL. Run `npm run check`, `npm run build`, targeted logic tests and browser workflows. Confirm reduced-motion and actual mobile overflow; do not equate a passed build with accessibility/performance completion.

## Infrastructure / publishing

Private GitHub: https://github.com/SalmanAsadDev/oakmere-living. Current shared branch `main`; do not switch it under another writer. Commit/push coherent verified milestones; stage only your intended files. Untracked source screenshots/PDF, `.agents/` and the existing empty `supabase/` migration are not automatically part of your commit.

Vercel project `oakmere-living`, scope `salmanasad561-gmailcoms-projects`. Preview command: `vercel deploy --yes --target=preview --scope salmanasad561-gmailcoms-projects`. Keep production indexing/live ordering disabled. Do not promote simply because a preview builds. `.env.local` is ignored; never print/copy secrets. Automatic GitHub deployment is not connected, so a push alone does not update Vercel.

## Required progress report

Append to `docs/ANTIGRAVITY_PROGRESS.md`: touched files, completed capabilities, checks and outputs, remaining dependencies, commit and preview URL. Distinguish **implemented**, **browser-verified**, **backend-verified** and **blocked**. Update `REFERENCE_PARITY_PLAN.md` with evidence as each acceptance criterion is satisfied. Do not rewrite prior history to imply pending work was completed.

## Paste-ready instruction

Continue Oakmere Living from `docs/ANTIGRAVITY_HANDOFF_02.md` and `docs/REFERENCE_PARITY_PLAN.md`. Inspect the latest git status/log first because Codex may have completed some shared UI changes after writing the handoff. Preserve the existing hero assembly, variant mask, reveals, drawers, catalogue IDs/prices, basket and Shop query filters. Implement the remaining reference-parity tasks in the listed order, including the browser-local room planner and catalogue-backed builder, then real service/admin/order persistence. Use installed skills where relevant. Never invent product variants, contact details, reviews, order success or AI replies. Keep explicit operational/provider blockers in the progress log. Test, commit and push coherent milestones; publish a Vercel preview using the existing project and scope.
