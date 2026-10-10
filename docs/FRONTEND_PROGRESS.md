# Shared frontend progress — 10 October 2026

Authority: the project plan, technical plan and reference parity contract. This checkpoint supersedes the 7 October progress report. Antigravity commits through `7bef57f` and its pending admin-product route moves are retained. No new handoff is required.

## Frontend release scope

- Preserved the four signature animations: scroll assembly illustration, 400ms variant wipe, capped 60ms stagger reveals and tactile Radix drawers. Added token-based navigation underline, button/arrow feedback, photo hover/focus crossfade and Shop menu disclosure. Reduced-motion fallbacks remain in global CSS. Hero artwork is clearly an illustration, not saleable product imagery.
- Desktop Shop menu opens categories as `/shop` query filters. Mobile service navigation includes Swatches, Build, Plan room, About, Reviews and Contact. The homepage now continues through builder/planner discovery and a final catalogue action; the grouped footer exposes service and content routes.
- Basket drawer and `/cart`/`/basket` share immediate +/− buttons, a live count, boundary checks and functional state updates. Product quantities contain no dropdown.
- Product cards and detail pages link the selected product to room planning, swatches and design tools. Detail pages show related actual products.
- Seven-step `/build` uses exact supplied variants/prices for standard basket items. Custom piping/extras become an enquiry, with no fabricated price or purchasable configuration. Contact receives the design brief.
- `/swatches` selects up to four actual catalogue samples across products and sends their names in request notes to the inherited POST endpoint. Success requires an OK response. The team must confirm availability and dispatch; no dispatch time or sample-stock promise is invented.
- Global sofa guide provides local catalogue/budget matching and truthful service actions. It is explicitly guided assistance, not generative AI/live chat. Conversation clear/export are available; no provider credentials or file understanding is implemented.
- Added `/reviews`, `/appointment`, `/my-orders`, `/blog` and three original articles. Reviews are an honest empty state; consultation and order-help pages lead to enquiries. Confirmed appointments, moderated reviews and private self-service order lookup remain backend work.
- Recovered 23 exact Lily product/colour photos from the reference, resolving the earlier reported Lily transfer failures. The manifest contains 109 local image mappings. Provenance: `docs/research/lily-media-recovery.json`. This is not a full gallery audit.
- `/room-planner` selects real local product/variant photos, supports local photo upload, pointer and keyboard placement, size/rotation/mirroring/reset, removal and JPEG export. `/try-in-your-room` redirects, preserving selected product. Photos stay in browser memory. It is explicitly a moodboard: product photos retain backgrounds. It does not meet the owner's newer natural room-integration requirement.

## Verification evidence

Story: customers discover a sofa through Home/Shop, choose a real configuration, manage a persistent basket and reach useful service/design tools; unsafe ordering remains unavailable.

- `npm run check`: catalogue audit, seven domain tests and TypeScript passed. Catalogue: 108 records, 73 ready and 35 draft.
- `npm run build`: Next.js 16.3.8 production build passed, 43 generated pages plus dynamic routes/proxy.
- Browser against `next start` on port 3001: Shop menu navigates to `/shop?category=corner-sofas` and reports 30 sofas. Category pages are not introduced.
- Basket: +, +, − changes Lily quantity 1→2 with £1,498 total. Full cart increments to 3/£2,247 and retains this after reload. No lost increments or dropdown selection.
- Sofa guide returns three real product links for 'Corner sofa under £900'.
- Swatches: four actual Lily finishes selected; status reads '4 of 4 samples selected'. No real customer request was submitted during this check.
- Consultation: frontend link navigates to Contact and prefills the requested consultation text.
- Mobile 390×844: homepage content width 375px, no horizontal overflow. Mobile drawer navigates to Plan room and closes.
- Room prototype: public test photo opened locally, keyboard placement changed horizontal position to 51, JPEG exported successfully. No console errors in the tested session. Pointer/touch dragging and pixel fidelity still need device review.
- HTTP boundary checks: checkout POST 503, invalid Contact/Swatches POST 422, unauthenticated `/admin` 307 to `/admin/login`.
- Earlier 7 October builder check: standard Grey Lily completes seven steps into basket at £749; custom footstool request routes to an enquiry, not an order.

These checks do not establish field Core Web Vitals, a complete accessibility audit, reduced-motion device behaviour, slow-network resilience or successful persistent service submissions. Token CSS and preference listeners are implemented; device verification remains necessary.

## Integration and next work

Staff reads/actions now verify Auth identity and staff role before privileged work. Dashboard reads use the user-scoped RLS client. Next 16 `proxy.ts` scopes session checks to admin/auth rather than every public page. These guards do not establish that the full database schema, RLS policies or staff roles are configured correctly.

Ordering is gated by both environment configuration and `checkoutImplementationReady=false`. The inherited checkout displays mock items, trusts submitted prices and writes orders/items separately. Replace it with authoritative variant/delivery quotes, atomic order creation and idempotency before enabling it.

Next development milestone: ROOM-02 natural furniture integration. Need faithful product cutouts, room-aware floor/perspective placement and lighting/contact shadows, plus a visually verified implementation. Choose local compositing or a configured image-editing provider after a feasibility test; never call the current rectangular overlay complete.

Remaining launch work: persistent service/admin journeys and schema/RLS proof; safe checkout; appointments/reviews/private order lookup; actual business contacts, delivery/returns/legal policies and operational settings; remaining gallery audit; mobile/accessibility/performance verification and recovery checks. Preview deployment is not commercial launch approval.
