# Oakmere Living

UK furniture storefront and order-taking platform for Sami's team. **Oakmere Living** is the provisional, changeable brand name. This repository currently contains plans and supplied reference material; application development has not started.

Start with [the project implementation plan](PROJECT_IMPLEMENTATION_PLAN.md), version 0.2. It owns business scope, customer/staff behaviour, SEO priorities, acceptance criteria and the user's recorded decisions.

Then read [the technical implementation plan](TECHNICAL_IMPLEMENTATION_PLAN.md), version 1.0. It specifies architecture, schema, transaction/security contracts, integrations, media tools, tests, deployment/recovery and the two-day execution board.

Selected direction:

- Next.js/React/TypeScript/Tailwind application on Vercel.
- Supabase PostgreSQL, staff authentication and image storage; transactional email through a provider adapter.
- Cash on delivery and card on delivery; Sami's team handles fulfilment and collection.
- Full launch scope, including admin, swatches, appointments, colour previews and room planner.
- Later Hostinger domain connection through DNS; application remains hosted on Vercel.
- Two-day implementation target, with completion determined by acceptance evidence.

Original references:

- `Corner_Sofa_Engineer_Requirements.pdf`
- `sofa-catalogue-for-codex.json`
- Five `Screenshot 2026-10-02 ... .png` files
- `WhatsApp Image 2026-09-15 at 9.03.16 PM.jpeg`

The user confirms Sami supplied the catalogue/images for initial listings. Preserve its third-party provenance, review flags and drafts; do not infer missing prices, dimensions or availability. Keep original files unchanged. PDF review renders under `docs/research/pdf-preview/` are research intermediates, not website assets.

Next implementation task: T01 in the technical plan, followed by schema/security and an early persistent-order test. The application scripts and environment template described in the plan do not exist yet; create them during bootstrap.
