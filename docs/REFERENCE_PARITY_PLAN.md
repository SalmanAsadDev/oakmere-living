# Corner Sofa parity and frontend extension

Authority: user's 7 October 2026 instruction. This is additive to the four-signature motion brief. Corner Sofa (https://www.cornersofa.online/) is now the primary visual and interaction reference. Preserve Oakmere identity, existing animations, real catalogue/variant semantics, basket and filter URLs. Do not replace the existing animated hero because the reference uses a different composition.

## Evidence and comparison

Inspected the live homepage, product detail, seven-step builder, room planner and assistant on 7 October. The reference has stronger discovery and continuation paths: prominent service navigation, a Products menu, room-preview buttons on cards, fabric actions on product detail, builder/planner homepage sections, a final catalogue CTA and a large grouped service footer. Oakmere's original footer and navigation underexposed these services. Oakmere already has scroll assembly, typography/image reveals, variant image masks and tactile drawers; these are retained.

The reference assistant offers suggested prompts, chat, cancellation, chat export/clear and photo/document attachment. A payment question returned a server filesystem error, so successful AI responses were not verified. Its room planner describes browser-only photos, four steps (room, sofa, space, placement) and a 15 MB JPEG/PNG/WebP limit. Its builder has shape, design, colour, fabric, piping, extras and summary, with custom-size quote handling and product comparison. These are requirements to implement carefully, not evidence of our completion.

## Route and capability map

| Reference | Oakmere destination | Required behaviour / constraint |
| --- | --- | --- |
| Home | `/` | Keep hero; add service discovery, visible image/button feedback and final See all sofas CTA |
| Products + category queries | `/shop` + existing filters | Expanded navigation menu; no new category landing pages |
| Product detail | `/products/[slug]` | Actual variant selection, room/build/swatches links and related products |
| Swatches | `/swatches` | First-class top navigation; select up to four, postal request persisted before success |
| Build | `/build` | Seven-step catalogue-backed design; standard variants can enter basket; custom requests require a quotation, never fabricated prices |
| Room planner | `/room-planner` | Browser-local photo, sofa selection, scale/position/rotation, reset and export; no geometric-fit guarantee from a photo |
| Delivery availability / delivery info | `/delivery` | Address/postcode policy lookup must use approved configured coverage; unknown cases need team review |
| Size guide | `/guides/measuring-for-delivery` | Existing guide, also discoverable from footer/product tools |
| FAQ | `/faqs` | Existing content and a clear shopping/help path |
| Contact | `/contact` | Persisted validated request, spam protection, truthful response state |
| About | `/about` | Oakmere/Sami story; no copied competitor business claims |
| Reviews | `/reviews` | Genuine approved reviews only; moderated submissions and verified-order proof in backend milestone |
| Appointment | `/appointment` | Request an appointment; no invented showroom address, availability or confirmed booking |
| Blog | `/blog` and article routes | Original furniture guidance, linked catalogue and next actions |
| My orders | `/my-orders` | Private order lookup through ownership verification; never expose another buyer's order |
| Basket / checkout | `/cart`, `/checkout` | Preserve cash/card on delivery and authoritative server quote/order transaction |
| Privacy / Terms | Existing routes | Update for actual services/data flows before launch |
| Assistant | Floating Oakmere sofa guide | Useful catalogue search, budget/shape recommendations, payment/delivery/measurement guidance and direct actions. Clearly distinguish local guided replies from a future generative AI service |
| Social/WhatsApp/phone/QR links | Configured Oakmere channels | Add only when Sami supplies the actual destination; never reuse the competitor's accounts |

## Implementation contracts

- Micro-interactions: use existing tokens. Navigation receives a moving underline and subtle lift; CTAs translate their arrow and lift on hover/focus; cards reveal a secondary actual photo and room action. Touch controls remain visible. Reduced motion disables transitions. Avoid blanket transforms on form fields or layout changes.
- Preserve all four existing signatures. Existing hero heading load animation remains; add no competing hero timeline. New sections reuse `Reveal`.
- New client tools receive a small serializable public catalogue projection. Do not import server-only catalogue into client code or duplicate its normalization.
- Builder state is local; changing an upstream choice invalidates incompatible downstream choices. Only an exact supplied variant at its catalogue price is purchasable. Piping/extras/custom dimensions are a design brief, not approved inventory. Export is explicitly a saved brief, not an order or submitted quotation.
- Planner rejects invalid type, oversized and undecodable files; revokes object URLs; never posts room photos or stores them in localStorage. Use pointer and keyboard/range controls. Supplied photos may retain their backgrounds: no false AR or exact-fit claim. Export catches canvas/image failures and explains them.
- Assistant must not invent stock, delivery dates, guarantees, order status or custom pricing. Read-only local guidance can work immediately without provider credentials. Generative chat/file understanding additionally needs a configured AI provider, explicit upload disclosure, request limits, server validation and grounded catalogue retrieval; do not label a rules engine as AI.
- Recover missing photos only when product/configuration/colour match. Record the reference product URL, original URL and replacement asset. Image availability never creates a sellable variant.
- Existing backend ownership remains with Antigravity for order/admin/service persistence; Codex now owns the added shared frontend planner/builder/assistant and parity routes. Check status before edits; this document supersedes older ownership for these newly requested frontend surfaces.

## Acceptance and release

NAV-01: desktop and mobile expose Shop, Swatches, Build, Plan Room, About, Contact and Reviews; footer exposes all mapped service destinations without broken links.
MOTION-05: hover/focus/touch and reduced-motion behaviour remain usable; no existing animation is removed.
BUILD-01: complete a real standard variant through seven steps and add the exact price/ID to basket; custom requests cannot masquerade as standard orders.
ROOM-01: upload a local photo, choose a product, adjust placement with pointer and keyboard, reset and export; no upload network request occurs.
HELP-01: shopper can find actual matching products and policy actions; unsupported questions receive a truthful path to the team.
CONTENT-01: no copied reviews, competitor contacts, invented inventory or false successful form states.
PARITY-01: each row above has implementation and verification evidence; unavailable backend/provider/operational dependencies remain explicit launch blockers. A page's presence alone does not establish functional parity.

Run catalogue tests, focused planner/builder/assistant logic tests, TypeScript, production build and browser journeys. Commit/push tested milestones and publish preview builds. Full commercial launch remains gated by backend, approved policies, genuine images and accessibility/performance verification.
