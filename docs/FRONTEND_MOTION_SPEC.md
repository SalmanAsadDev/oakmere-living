# Frontend direction and motion contract

Updated 7 October 2026. This records the user's latest direction and overrides older category-page assumptions in the original plans.

## Navigation

Home (`/`), Shop (`/shop`), About (`/about`), Cart (`/cart`) and supporting service pages. Categories are filters on Shop, stored in query parameters for sharing and back/forward navigation. Old `/sofas` and `/sofas/[category]` URLs permanently redirect. No separate category landing pages are generated. Shop canonical is `/shop`; do not add filter combinations to the sitemap.

## Tokens

The source of truth is `app/globals.css`: editorial, tactile and micro easing; slow 700ms, calm 450ms, responsive 300ms, snappy 150ms. Material reveal uses an explicit 400ms exception because the user's detailed material specification takes precedence over the general 300ms table entry. Stagger is 60ms, capped at 360ms. No arbitrary timing values belong in page layouts.

## Four signatures

1. `AssemblyHero`: original vector sofa design study with separate feet, frame and cushion SVG layers in one aspect-ratio-controlled stage. It is clearly described as an illustration, not product photography. Scroll over one viewport maps to `--scroll-progress` through requestAnimationFrame; only transforms and opacity animate. The section and sticky viewport establish layout before JavaScript.
2. `MaterialImage`: retained base photo and preloaded incoming variant layer. The incoming photo is revealed only after loading, with a 400ms editorial gradient mask. Rapid input supersedes the previous requested image. Failed alternatives preserve the previous photo and announce the limitation. Only actual supplied variant images are used; no invented fabric option is sold.
3. `Reveal`: IntersectionObserver entrances, overflow-hidden typography and vertical image clip masks, with bounded stagger. Content is visible if JavaScript or IntersectionObserver is unavailable. No scroll handler per product card.
4. Radix `Sheet`: cart and filter panels use open/closed states, tactile translation and exactly 300ms opacity overlays. Escape, focus trap, focus restoration and immediate close remain controlled by Radix. Inputs are never locked for animation.

## Performance and accessibility

Reduced motion disables assembly separation, masks, entrance translations and drawer animation. Real geometry remains static throughout. The requested CSS mask/clip-path animations can cause paint work; the brief's blanket prohibition on repaint conflicts with those explicitly required effects. These two image effects are deliberate bounded exceptions; the hero and sheets animate transform/opacity only. Do not claim every mask effect is GPU-only.

No indefinite global will-change. Promote hero layers only while scroll updates are active, the incoming image only while its animation exists, and sheets during their animation event lifecycle. Clean up observers, media-query listeners and animation frames on unmount.

## Remaining product work

The frontend revision does not mark checkout, admin, services, legal content, real image ownership/availability, database migrations or deployment complete. Track those in IMPLEMENTATION_PROGRESS.md. Real separated product photography may replace the design-study SVG later without changing its motion contract.
