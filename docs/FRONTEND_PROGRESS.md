# Shared frontend progress — 7 October 2026

## Integrated checkpoint

Antigravity milestone `9febf8b` is retained. Codex changes remain in the shared storefront, presentation helpers, media and configuration, with one narrow integration exception: disabled the unwired Contact/Swatches forms to prevent native GET submission of personal details, and removed an unverified contact email link. Supporting page design and backend ownership remain with Antigravity.

- Replaced the flat SVG hero with an original generated, textured sofa design study. Three static image crops share one coordinate system and assemble through transforms. The artwork is explicitly an illustration, never a saleable SKU. Mobile text and artwork have separate space; short viewports retain a full viewport of assembly travel. The deployed WebP is 360,086 bytes with transparency.
- Drawer movement now uses CSS transitions so changing direction continues from the current visual position. Radix Presence gets a separate exit-lifecycle animation; it still owns focus containment, Escape and focus restoration. Overlay timing is 300ms; promotion is removed when transitions finish or cancel.
- Reveals assign 60ms delays in content order, capped at 360ms. Nested cards own their observer state. Keyboard focus immediately reveals otherwise waiting content.
- Product swatches include colour indicators. Alternatives preload using Next 16's supported `preload` prop. A previously failed alternative now shows the failure notice when subsequently selected; the previous image remains visible.
- Shop renders on the server for initial request HTML. Search text follows URL changes and Clear filters updates the optimistic state immediately.
- Retried the supplied first-two-image URLs for ready products: 100 attempted, 66 newly recovered, 86 now local, 14 HTTP 404 responses. Source-to-file mapping remains in `lib/data/media-manifest.json`; no SKU substitutes were made. The report covers these 100 URLs, not the entire catalogue gallery.
- Deployment metadata uses the configured domain, or Vercel's supplied URL, before falling back to localhost for local development. Indexing remains gated by the existing environment setting.

## Verification

- `npm run check`: catalogue validation, all four catalogue tests and TypeScript passed.
- Production build passed against the integrated supporting pages and final hero height adjustment; `/shop` and product routes render dynamically. The subsequent form guards are covered by the final typecheck and deployment build.
- Browser: checked hero at 390 × 844 and 1440 × 1000, with no horizontal overflow at 390px; inspected separated and near-assembled sofa geometry.
- Browser: basket opens, closes with Escape, unmounts after its exit and restores focus to its trigger. Computed drawer/overlay durations are 0.3s; idle `will-change` is `auto`.
- Browser: category radio selection changes `/shop?category=electric-recliners`, retains the single Shop page and updates products. Rapid Black → Grey → Black selection on the Oxford sofa ends with Black selected and its actual image displayed.

These checks do not establish field Core Web Vitals or a full accessibility audit. Reduced-motion CSS and preference listeners are implemented, but system preference emulation and slow-network simulation were not available in the current browser controls. Mid-transition reversal uses the browser transition mechanism; no frame-by-frame continuity measurement has been performed.

## Remaining dependencies and launch blockers

1. Replace the 14 source URLs returning 404, and audit the remaining gallery/variant URLs. The supplied Lily photo URLs account for the current transfer failures.
2. Aligned product cutouts with the same camera/background are needed for a silhouette-only fabric morph. Current legitimate variant photos use a whole-photo mask; do not invent fabrics or substitute generated product photography.
3. Complete reduced-motion device checks, slow-image recovery tests, representative mobile performance/CLS measurement and assistive-technology review.
4. Contact and Swatches forms are now explicitly unavailable and disabled, pending a validated persistent POST endpoint. Antigravity should enable them only when genuine success/failure handling works. Do not describe these as working submissions.
5. The unverified `support@oakmereliving.co.uk` link was removed. Hours and a response target have not been supplied by Sami. Treat these as provisional configuration, alongside delivery prices/times, swatch dispatch promises and legal policies. Verify before launch.
6. Checkout, admin, persistent service requests and backend security remain Antigravity's milestones. This checkpoint is a frontend preview, not approval to open ordering or indexing.

See `ANTIGRAVITY_HANDOFF.md` for ownership, and `research/HERO_ASSET.md` for artwork provenance and generation prompt.
