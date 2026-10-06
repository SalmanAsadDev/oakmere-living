# Oakmere Living — Project Implementation Plan

Version: 0.2 | Updated: 6 October 2026 | Status: owner answers incorporated; implementation baseline

Provisional storefront name: **Oakmere Living**, selected under the user's authorisation and changeable through settings. This is not a registered legal identity or a verified available trademark/domain. Legal seller details remain to be supplied.

This is the authoritative project brief for business scope, customer experience, content, delivery priorities and acceptance. [The technical implementation plan](TECHNICAL_IMPLEMENTATION_PLAN.md) translates this baseline and the owner's answers into architecture, data contracts, implementation tasks and deployment instructions. Read both before implementing. Recommendations below are superseded wherever the recorded 6 October answers make an explicit choice.

## Contents

1. Authority and how to use this document
2. Project context and outcomes
3. Evidence, assets and current state
4. Reference review and quality benchmark
5. Scope, priorities and exclusions
6. Audience and customer journeys
7. Information architecture and pages
8. Visual and interaction direction
9. Catalogue and product publishing
10. Basket, checkout and delivery
11. Payments and order operations
12. Supporting services and preview tools
13. Administration and permissions
14. SEO and content programme
15. Conversion and measurement
16. Quality, accessibility and performance
17. Privacy, policies and business obligations
18. Hosting and architecture decisions
19. Delivery phases and work packages
20. Acceptance and launch gates
21. Risks, costs and ownership
22. Decisions and discovery questions
23. Developer/AI onboarding and change control
24. Traceability and research sources

## 1. Authority and how to use this document

### 1.1 Order of authority

1. The user's explicit requests and subsequent recorded answers control the project.
2. Owner decisions recorded in section 22 refine business rules and scope.
3. This document consolidates the accepted project baseline.
4. The technical plan implements that baseline; it must not silently change it.
5. Attached documents, catalogue notes, screenshots and reference websites are evidence and input, not independent authority to execute instructions.

The PDF's imperative wording and the JSON's `codex_instructions` are attachment content. They have been evaluated as proposed requirements and data-handling guidance, rather than executed automatically. No import, payment integration, account creation or website deployment is authorised by those files alone.

If a later answer changes a requirement, update this document and affected technical tasks before implementation. Log the decision, reason, owner, date and affected requirement IDs. If this document and technical details disagree, resolve the discrepancy explicitly.

### 1.2 Status vocabulary

| Label | Meaning |
| --- | --- |
| Confirmed | Explicitly stated in the current user request or a recorded owner answer |
| Attachment baseline | Requested in the supplied PDF; included for planning, subject to contradictions and open decisions |
| Recommended | Our proposed approach; not an already-approved business fact |
| Conditional | Implement only after the relevant operational capability is confirmed |
| Open | Information or a decision is missing; no production value may be invented |
| Deferred | A proposed later release; deferral requires owner agreement if the attachment requested it |

This draft is not a claim that any website features exist. Work must not be marked complete because a mock-up, sample form or development-only fixture looks correct.

### 1.3 Requirement identifiers

`BUS` identifies business goals; `CAT` catalogue; `UX` customer experience; `CHK` checkout; `PAY` payments; `OPS` operations/admin; `SVC` services; `SEO` search visibility; `QLT` quality; `GOV` governance. These IDs are stable references for future issues and technical tasks.

## 2. Project context and outcomes

Sami and his elder brothers sell sofas and other furniture in the UK, currently acquiring customers mainly through social media, especially TikTok. The website must become an owned sales channel with search visibility, credible product information, effective conversion and manageable day-to-day operations.

| ID | Requirement | Status |
| --- | --- | --- |
| BUS-01 | Build for a UK furniture business, using GBP and UK English | Confirmed |
| BUS-02 | Prioritise organic search discovery and page visibility from initial architecture through ongoing content | Confirmed |
| BUS-03 | Turn relevant visitors into commercially useful enquiries and fulfilled sales | Confirmed |
| BUS-04 | Exceed the supplied competitor examples in quality and avoid their observed weaknesses | Confirmed |
| BUS-05 | Use supplied listings/images for demonstration; maintain real listings through an admin panel | Confirmed |
| BUS-06 | Host application on Vercel; later connect a Hostinger-purchased domain through DNS | Confirmed; no application migration required |
| GOV-01 | Enable a new developer or AI to understand scope, decisions and next steps quickly | Confirmed |

### 2.1 What success means

The site should help someone find the right sofa, understand exactly what is included, check fit and delivery, place an order confidently, and receive what they ordered. Staff must be able to manage that order and catalogue without editing code.

Website launch is a technical milestone. SEO growth and conversion are ongoing commercial outcomes. No first-page ranking, sales volume or fixed conversion rate is promised. Establish an evidence-based baseline before agreeing improvement targets.

Recommended reporting:

| Outcome | Measurement | Review |
| --- | --- | --- |
| Discoverability | Search Console coverage, non-brand impressions/clicks, relevant queries and landing pages | Weekly initially; monthly trends |
| Product engagement | Product views, variant selection, basket additions, delivery-check usage | Weekly |
| Conversion | Orders placed per eligible session, checkout completion and qualified enquiry rate, segmented by channel/device | Weekly with sample-size caveats |
| Commercial value | Collected revenue, fulfilled orders, margin where available, average order value, cancellations/refunds | Monthly |
| Reliability | Checkout errors, payment failures, notification failures, oversells and support complaints | Daily exceptions |

An unpaid cash-on-delivery order is not collected revenue. Clicks on WhatsApp are not confirmed leads or sales. Reporting must distinguish these events.

## 3. Evidence, assets and current state

### 3.1 Workspace inventory

Workspace: `D:\Furniture website`.

At initial review, the directory contained the eight supplied reference files and no application source, package manifest, database migrations or existing `AGENTS.md`. The user has confirmed this is a fresh build. The PDF's references to earlier code/README are historical context, not a dependency. Planning documents and research renders have since been added.

| Source | What it contributes | Limitation |
| --- | --- | --- |
| `Corner_Sofa_Engineer_Requirements.pdf` | Twelve-page feature/engineering handover, dated 15 September 2026 | Uses “Corner Sofa”, assumes existing code and specifies Vercel; these are not current confirmed facts |
| `sofa-catalogue-for-codex.json` | Structured demo product catalogue, extracted 30 September 2026 | Third-party source data, not Sami's verified inventory; image URLs only |
| Five `Screenshot 2026-10-02 ... .png` files | Homepage, reviews, service benefits, collection panels and footer inspiration | Desktop screenshots of a local BenchMade Modern clone; not Sami branding or product assets |
| `WhatsApp Image 2026-09-15 at 9.03.16 PM.jpeg` | Hero/navigation/promotional layout inspiration | Includes US sale/currency language and another brand |
| `https://www.cornersofa.online/` | Intended minimum competitor benchmark | Both www and non-www URLs were inaccessible through the research tool; no live defect claims made |
| `https://www.uksofashop.co.uk/` | Accessible competitor content/navigation benchmark | Text retrieval only; no measured visual, accessibility, speed or checkout audit |

PDF text was extracted across all twelve pages and rendered pages were visually reviewed. Review images in `docs/research/pdf-preview/` are research intermediates, not website media. Screenshots were reviewed as supplied in the conversation.

### 3.2 Catalogue audit

Counts computed from the JSON, rather than assumed from reference websites:

| Item | Count/detail |
| --- | --- |
| Total product records / unique import IDs | 108 / 108 per file validation |
| UK Sofa Shop source | 64 records: 63 `ready`, 1 `draft` |
| Furnishings Hub source | 44 records: 10 `ready`, 34 `draft` |
| Source import status | 73 `ready`, 35 `draft` |
| Categories | 13; memberships overlap |
| Source fabric catalogue | 6 collections / 70 fabric entries; reference only |
| Product image entries | 335 URL entries; not necessarily unique images |
| Variant entries | 122; not necessarily 122 verified sellable SKUs |
| Price types | 64 `base`, 40 `fixed`, 4 `from` |
| Records lacking `specifications.Dimensions` | 45; this field check is not proof that other 63 have complete, correct measurements |
| Duplicate-candidate groups | 3; all require manual review |

Review flags include missing/template descriptions, absent source categories, ambiguous dimensions/set contents, unconfirmed leather type, numeric colour values and an unusual minimum price. Product gallery colours must not be turned into purchasable variants merely because photographs exist.

`ready` means source extraction is relatively complete. The user confirms Sami provided the JSON for initial listings, so it is authorised catalogue input rather than discarded research. This does not resolve missing option labels, dimensions or flags. Import records without inventing facts, retain the 35 draft records for review, and let Sami manage replacements through admin. Reference media is authorised for this development use by the supplied instruction; permanent rights and exact live availability still need business verification. Preserve originals for provenance.

### 3.3 Conflicts to resolve

| Conflict | Planning treatment |
| --- | --- |
| PDF names Corner Sofa; user describes Sami's business | Working project name only; owner must confirm trading/legal name |
| Earlier Hostinger ambiguity | Resolved: application stays on Vercel; Hostinger is the planned registrar/DNS provider |
| PDF assumes existing Next.js code; none is present | Resolved by user: fresh build |
| Screenshot uses BenchMade Modern, US offers and reviews | Adopt composition cues, create original brand/copy, confirm media rights |
| PDF asks several payment methods but marks ambiguity | Resolved: cash on delivery and card on delivery; online card, bank transfer and BNPL excluded from current launch |
| PDF asks sophisticated previews alongside core commerce | Resolved by user: previews are included in the full launch |
| JSON has third-party provenance; user says Sami supplied it | Use supplied records as initial catalogue input; preserve review flags/provenance and editable owner-managed replacements |

## 4. Reference review and quality benchmark

### 4.1 Observed evidence

The accessible [UK Sofa Shop homepage](https://www.uksofashop.co.uk/) exposes category links, product prices, COD positioning, delivery information and service links. Its extracted content also shows a “Loading…” placeholder, repeated delivery/promotional text and delivery caveats in different sections. These are useful prompts to test rendered content and policy consistency; extraction alone does not establish customer-visible defects.

The supplied screenshots favour spacious layouts, large room photography, a restrained header, collection panels and review cards. They provide no evidence of mobile checkout quality or actual SEO performance.

### 4.2 Our benchmark

Compare the future site against both examples using a recorded rubric, not subjective statements about being “better”. The unavailable example remains an outstanding research task.

| Dimension | Project standard | Evidence to capture |
| --- | --- | --- |
| Discovery | Clear categories, working search/filters, crawlable category/product pages | Task recordings and crawl report |
| Product confidence | Exact contents, variant photos/prices, dimensions and delivery eligibility | Representative product checklist |
| Checkout | Guest flow, clear payable total, recoverable errors, accurate due-on-delivery amount | Mobile/desktop end-to-end results |
| Trust | Real seller details, accurate policies, substantiated reviews | Content approval record |
| Visual quality | Coherent original design; useful imagery; readable mobile layout | Screenshots at agreed widths |
| Performance | Meets section 16 targets on representative pages | Lab reports and later field data |
| Admin usability | Staff can publish a product and process an order unaided | Owner trial and timing/feedback |
| Reliability | Repeated submissions, outages and concurrent orders handled | Failure-path test evidence |

Perform a deeper manual audit during discovery of home, category, product, basket and policies at mobile/desktop sizes. Inspect only public behaviour; do not place real competitor orders. Record date, page, observed issue, impact and proposed improvement. Do not infer keyword volumes, traffic, conversion rates or security flaws from appearance.

## 5. Scope, priorities and exclusions

### 5.1 Proposed release structure

The owner has requested the complete PDF scope at launch. The priorities below identify internal build order, not separate reduced releases. No feature is deferred simply to hit the two-day target. Inapplicable payment methods are excluded by the explicit payment answer.

| Priority | Scope | Launch implication |
| --- | --- | --- |
| P0 — foundation and sales | SEO-ready storefront; catalogue/variants; admin; basket; guest checkout; postcode delivery; cash/card on delivery; orders/notifications; policies; security; backups | Required at launch |
| P1 — services/content | Reviews with honest empty state, guides/blog, swatches, appointments, exports and consent-aware measurement | Required at launch; real venue/fabric configuration must be supplied |
| P2 — advanced previews | Admin colour-generation workflow and browser-only room planner, cutouts, export and basket handoff | Required at launch; prototype/test early inside the same release |

All P0/P1/P2 acceptance checks apply to the one launch. Unavailable business information is represented honestly; no fictitious showroom, confirmation or fulfilment guarantee. The site records orders and requests; Sami's team performs fulfilment and customer service. No fleet routing, live driver tracking, terminal processing integration or multitenant architecture is required.

### 5.2 Exclusions and boundaries

Attachment baseline excludes AI agents, chatbots, Alashi and agent-specific integrations. Customer/shop preview tools remain within the attached scope. Using an AI-assisted development workflow does not imply a customer-facing AI feature.

Recommended exclusions for the initial release: marketplace/vendor management, native mobile app, international selling, customer accounts as a checkout prerequisite, loyalty programme, finance/BNPL without provider eligibility, AR/3D guarantees, automated supplier integrations and complex CRM/ERP integration. Revisit only if owner answers establish a need.

Other furniture can be accommodated in taxonomy and templates; do not invent beds/tables inventory. A generic extensible product model should support these categories later without making sofa-specific orientation fields mandatory for every item.

## 6. Audience and customer journeys

Audience assumptions to validate: mobile TikTok visitors seeking familiar products; search visitors comparing sofa shape/size/material/price; hesitant buyers needing delivery/fit guidance; existing customers seeking order help. No demographic research has yet been supplied.

| Journey | Required experience | Business outcome |
| --- | --- | --- |
| Social visitor | Land on the exact promoted product or curated campaign page, select options and proceed without account registration | Reduce friction from social traffic |
| Search visitor | Relevant category/guide, useful comparison criteria, accessible products and clear delivery/price information | Qualified organic traffic |
| Confident buyer | Product → exact variant → basket → eligible delivery → payment choice → review → recorded order | Sale with correct specification |
| Hesitant buyer | Dimensions/access guide, swatches or contact with product context; return to basket | Qualified enquiry and eventual order |
| Unsupported postcode | Clear coverage result and contact/quote route | Avoid false delivery promises |
| Returning visitor | Same-browser basket persists; current prices/availability rechecked | Recover purchase intent |
| Customer after ordering | Confirmation and secure assistance/status access without exposing others' orders | Confidence and lower support burden |
| Staff member | Publish products, review incoming orders, confirm delivery and reconcile payment separately | Reliable fulfilment |

Guest ordering is attachment baseline. Order-status access is recommended via a secure token or verified email flow; an order number plus a guessable URL must not expose customer data. Cross-device baskets and accounts are later decisions.

## 7. Information architecture and pages

Routes below are proposed stable conventions, to be finalised in the technical plan before building links or importing slugs. Every enabled page needs useful loading, empty, success and error states.

| Page / proposed route | Content and behaviour | Search treatment |
| --- | --- | --- |
| Home `/` | Approved value proposition, original hero, category entry points, selected products, real benefits, social proof if available, guides/contact | Index; unique brand title/description |
| Shop `/sofas` | All approved sofa products; filters/sort; visible selected filters; result counts; pagination | Index canonical base |
| Category `/sofas/[category]` | Useful intro, relevant products, filters, buying advice and links to related categories | Index meaningful populated categories |
| Product `/products/[slug]` | Gallery, variants, price, availability, dimensions, set contents, lead time, postcode check, delivery/returns, add to basket | Index published approved products |
| Collections `/collections/[slug]` | Curated matching ranges with accurate piece/set pricing | Index only with meaningful distinct content |
| Search `/search?q=...` | Relevant results, spelling/empty guidance, keyboard accessible selection | Noindex; outside sitemap |
| Basket `/basket` | Exact variant line items, quantities, current totals, delivery cost state, checkout action | Noindex |
| Checkout `/checkout` | Contact/address/access/delivery/payment/review steps | Noindex; private customer data |
| Confirmation/status | Correct order/payment summary and support options | Noindex; securely authorised |
| About `/about` | Real family business story, photos, location/service area, contacts | Index |
| Contact `/contact` | Verified contact channels/hours, configured working form, relevant response expectation | Index |
| Delivery `/delivery` | Coverage, services, charges, estimates, access/failed-delivery rules | Index |
| Returns `/returns` | Approved cancellation, return and faulty-goods process | Index |
| Guides `/guides/[slug]` | Measurement, corner orientation, materials, care and access guidance | Index original useful content |
| Journal `/journal/[slug]` | Owner-reviewed articles with product/category links | Index published articles |
| FAQs `/faqs` | Real pre/post-purchase questions and precise answers | Index; do not assume FAQ rich-result eligibility |
| Reviews `/reviews` | Genuine reviews with provenance/moderation policy; honest empty state | Index if useful; no fabricated ratings |
| Swatches `/swatches` | Available fabrics, limit of four, request form and confirmation | Conditional service; index useful public page |
| Showrooms `/showrooms`, booking | Verified locations/hours; appointment process if supported | Conditional; location pages only for real locations |
| Room tool `/try-in-your-room` | Browser-local photo and placement tool; privacy/fit explanation | Public explainer may index; personal preview state never indexes |
| Legal `/privacy`, `/terms`, `/cookies` | Approved policies, version/date and cookie controls | Public; no private data |
| Administration `/admin/...` | Authorised staff workflows | Authentication plus noindex; robots alone is not protection |

Navigation: keep primary category access, search and basket visible; use short labels and a manageable mobile menu. Footer links group shop, help and business information. Do not expose every overlapping category as a top-level navigation item.

Catalogue categories available in the seed: corner sofas; 3 & 2 seater sets; U-shaped; sofa beds; recliners; electric recliners; fabric; leather; armchairs; footstools; 2-seater; 3-seater; sofa sets. Confirm live assortment before promoting these. Armchairs/footstools are accessories, not sofas. “Leather” must distinguish genuine leather, bonded leather and leather-look materials accurately.

## 8. Visual and interaction direction

UX-01: develop an original premium, approachable UK furniture identity. Use the screenshots for layout inspiration rather than copying brand assets, reviews or offers.

Recommended design direction: warm neutral backgrounds, restrained dark text, generous but purposeful spacing, large product/lifestyle photography, consistent cards and clear primary actions. The PDF proposes cream `#F7F1DE`, sage `#B0BA99`, terracotta `#9D6638`, espresso `#4E220F`, muted gold `#C5A880`, Assistant typography and restrained glass/shadow effects. Treat these as a starting palette pending brand approval; test contrast before assigning text/button roles. Display typography may be explored, but final font licensing and loading must be documented.

Build a reusable design system: colour/text tokens, type scale, spacing, containers, grids, buttons, inputs, validation messages, dialogs, product cards, swatches, badges, tables, skeletons and empty states. Specify focus, hover, disabled, busy and error states. Use reduced-motion support; animations must not delay shopping.

Homepage should prioritise a clear promise and a route to shopping, followed by categories/products and justified reassurance. Avoid a desktop-inspired giant hero or repeated promotion bars pushing useful information far below the fold on mobile.

Product photography should have consistent crops/aspect ratios, zoom/detail views and dimensions diagrams where supplied. Colour chips need names, not colour alone. Show the currently selected variant explicitly. A mobile sticky add-to-basket control is recommended only if it preserves access to required selectors, price and delivery information and does not cover content.

UX-02: use UK terms, GBP formatting, centimetres/millimetres with consistent units, “basket”, “postcode” and UK dates. Store appointment rules in UK local time (`Europe/London`), with daylight-saving handled. Developer timezone is not customer appointment timezone.

## 9. Catalogue and product publishing

### 9.1 Minimum publishable record

| Field group | Required information |
| --- | --- |
| Identity | Stable internal ID, SKU where applicable, approved name, unique slug and product state |
| Classification | Primary category plus additional categories; material/shape attributes appropriate to item |
| Commercial | Actual sell price in GBP, tax treatment, availability/stock model, approved delivery lead time |
| Description | Original owner-reviewed description, accurate features and explicit included pieces |
| Dimensions | Labelled width/depth/height and units; sectional/component/access measurements where relevant |
| Variants | Real supported colour/material/size/orientation combinations with stable IDs and exact prices |
| Media | Rights-approved images, ordering, alt text, variant mapping and preview/actual-photo designation |
| Operational | Fulfilment source, service restrictions, owner review of outstanding flags |
| Search | Title/meta description, useful content, canonical slug and redirects if renamed |

CAT-01: a variant is a sellable combination, not merely a fabric chip. A family/range can connect separate sizes or pieces without implying that all are variants of one identical product.

CAT-02: orientation must state the viewing convention and show a diagram or labelled photo. Do not infer “left” from an unlabelled gallery image. Include set contents precisely: sofa only, 3+2 set, chair, footstool or other pieces.

CAT-03: prices must represent the chosen configuration. “From” prices refer to an actual available minimum configuration and must be labelled; a full pictured set must not silently use an armchair's entry price. Genuine discounts need approved comparison-price evidence and dates.

CAT-04: draft → content/data review → business approval → published → archived. Review flags and unknown required data block live publication. A missing measurement must show as unknown in drafts, not become an invented number. Archived/deleted products preserve historic order snapshots.

### 9.2 Demo import process

1. Keep the supplied JSON unchanged as source evidence; schema version is `1.0`.
2. Validate structure, unique source keys, categories, prices, variant linkage and unresolved fields. Produce a report before modifying a target catalogue.
3. Upsert using `(source_site, source_product_id)` to support repeatable imports; do not merge similar names across sources.
4. Keep source IDs, URLs, original attributes and flags in internal provenance. Create demo records separately from production data.
5. Preserve `from`/fixed/base semantics and unknown values. Resolve the three duplicate groups manually; retain a documented link or merge decision.
6. Do not convert `in_stock_source` or `custom_made_source_claim` into Sami's stock or manufacturing promise.
7. Use the supplied product media for development and transfer it into owned durable storage, recording source/provenance and failures. Do not scrape additional unrelated media. Live media rights remain a business verification task.
8. Source fabric catalogue remains unattached reference data until availability, pricing and swatch operations are confirmed.
9. Source-ready records may enter the initial visible catalogue after product-level validation; source drafts stay private until reviewed. A preview/test environment uses the supplied data openly as demo inventory. Production must identify which records have verified prices/availability; unknown configurations use an enquiry/review state rather than a fabricated purchasable variant. Remove test-only records from search, feeds and live checkout.

Import report: total/readiness/category counts, duplicate candidates, missing fields, variant/pricing inconsistencies, media successes/failures and skipped records. No destructive import or existing product deletion by default.

### 9.3 Content production workflow

Owner supplies supplier specifications, product/room images, exact option matrix, pricing and operations. Editor creates original descriptions and fit/care guidance. A business reviewer confirms accuracy and publication. Version history identifies who approved what. An AI-generated description is a draft requiring review, not a verification source.

## 10. Basket, checkout and delivery

### 10.1 Basket contract

CHK-01: same-browser persistence across refresh/return; different variants remain different lines. Show name, chosen image, colour/material/size/orientation, unit price, quantity and line total. Permit positive whole-number quantities within available limits and a clear remove action. Preserve valid entries through recoverable errors.

CHK-02: recheck current products, stock and pricing before checkout and submission. Explain changes and request acceptance; never substitute another item. The server computes authoritative product prices, discounts, delivery and total.

CHK-03: before postcode/service is known, delivery displays “Calculated after postcode”, not an assumed free amount. Show subtotal, applied discount, delivery/access charges, tax presentation and full total, plus due now and due on delivery. No implicit deposit.

### 10.2 Checkout fields

| Field | Rule |
| --- | --- |
| Full name | Required; supports realistic names, apostrophes and hyphens |
| Email | Required for updates; sensible format and trimming |
| Phone | Required for delivery coordination; accept international prefixes |
| Postcode | Required; normalise lowercase/missing space; distinguish syntax/address/coverage |
| Address line 1 | Required; support named buildings |
| Flat/unit and line 2 | Required when applicable; clear instruction for flats |
| Town/city | Required; editable after lookup/manual entry |
| County | Optional |
| Country | UK preset for initial market; separate coverage rules still apply |
| Property type | House, flat or other; attachment baseline requires selection |
| Floor/lift | Conditional for flats/upper floors; relevant suitability information |
| Access restrictions | Yes/no with notes when yes; stairs/entrances/parking as relevant |
| Delivery notes | Optional; discourage payment/sensitive information |
| Service/slot | Eligible service required; slot only if scheduling really supports it |
| Payment method | Enabled, eligible methods with clear amounts |
| Billing address | Conditional on payment method; defaults to delivery address |
| Terms acceptance | Required with policy link/version; optional marketing separate |

Balance delivery-planning needs against mobile form friction. Conditional fields should appear only when relevant, with clear explanations. Any simplification of attachment-required fields needs a recorded decision.

### 10.3 Postcode and delivery contract

CHK-04: postcode format, address existence and shop coverage are separate checks. Use a licensed address provider if selected; a public postcode finder is not a free production API. Manual address entry remains available for outages/new builds/missing results.

CHK-05: manually entered addresses still pass delivery coverage rules. Do not describe a lookup outage as an invalid postcode. Editing postcode/address/access/service must trigger recalculation and invalidate any stale delivery quote. If coverage is uncertain, offer enquiry/pending review rather than a false confirmed price/date.

CHK-06: delivery rules must define eligible areas, explicit exclusions, charge precedence, product restrictions, services, lead times, surcharges, capacity and failed-delivery process. Do not assume all UK postcodes, UK mainland, Northern Ireland, islands or Highlands are supported. A postcode-prefix table alone may not model every exception: the technical plan must define exact matching and exceptions.

Owner supplies a delivery matrix with: area/postcodes, included/excluded rules, service, base charge, quantity/order conditions, floor/lift/access rules, dispatch/arrival estimate and manual-review triggers. Test boundary cases. Standard/express/room-of-choice labels appear only if actually offered.

**6 October answer — reference-derived starting configuration:** the user authorises using the reference sources until specific rules are supplied. The [UK Sofa Shop delivery page](https://www.uksofashop.co.uk/delivery-returns) describes free mainland ground-floor delivery, typical mainland estimates of 2–4 working days and longer Wales/Scotland estimates of 5–7; islands/Northern Ireland require contact. It lists upstairs from £20 per flight, assembly £20, removal £10 per seat and missed-slot redelivery £50. These are reference facts, not verified Sami operations. Store them as editable provisional configuration with source/date. Enable a tentative mainland ground-floor quote; flag upper-floor, remote/uncertain coverage and made-to-order timing for team review. Keep optional assembly/removal services disabled until supported. Display estimates as subject to confirmation, and do not promise dispatch/date or charge an undisclosed later fee. Do not copy the retailer's warranty or legal cancellation wording.

Checkout sequence: contact → postcode/address → access → eligible delivery → payment → final review → order. Review includes editable summaries of items, selections, contact/address, service, all charges and balances. Submission label must match the method and contractual action; it must not misrepresent an enquiry as a completed purchase.

## 11. Payments and order operations

### 11.1 Enabled methods

| Method | Status and behaviour |
| --- | --- |
| Cash on delivery | Confirmed. Order saves unpaid; no deposit by planning default; full balance due at delivery |
| Card on delivery | Confirmed. No card entry online; Sami's team uses its terminal and records successful collection manually |
| Online card | Out of current scope; no gateway/online checkout card fields |
| Bank transfer | Out of current scope; no receiving bank details collected or displayed |
| Klarna/finance | Out of current scope; no finance logos or decorative payment badges |

PAY-01: do not gather customer bank account numbers, PINs or card data in delivery fields. No sample bank details on production. The owner supplies receiving details through an appropriate private channel once transfer is approved; this planning interview does not require account numbers.

PAY-02: customer claims, transfer screenshots or a browser success redirect do not prove payment. Payment success comes from verified provider state or authorised receipt reconciliation. Payment secrets remain server-side.

### 11.2 Independent operational states

| Record | Baseline states |
| --- | --- |
| Fulfilment | Pending confirmation, confirmed, processing, dispatched, delivered; cancelled/delivery failed as needed |
| Payment | Unpaid/due on delivery, pending verification, paid; failed, partially refunded, refunded as appropriate |

OPS-01: delivered does not mean paid; paid does not mean delivered. Show outstanding balance and actual collected/refunded amounts independently. If deposits are later enabled, add part-paid behaviour and a balance ledger; do not force it into an inaccurate single “paid” flag.

OPS-02: create unique order numbers and immutable snapshots of products, selections, prices, tax, delivery, approved policy version and customer details. A catalogue edit must not rewrite an existing purchase.

OPS-03: repeated clicks, network retries and provider callbacks must not duplicate orders/receipts. Agree stock reservation timing for COD, online pending payments and cancellations; concurrent purchases of limited stock must not oversell.

OPS-04: save order reliably, show confirmation, send configured customer/admin notifications. Notification failure must not erase or fail a valid order; log, retry and allow resend. Include outstanding payment accurately.

Staff process: review new order/contact/access/coverage → confirm fulfilment → reserve/allocate according to agreed policy → schedule/dispatch → record actual payment receipt → mark delivery result separately → send accurate receipt/update. Define alternative methods and failed-delivery escalation before offering delivery payment.

Cancellations/refunds preserve history, reason, staff identity, timestamps and financial effects. Stock is restored only under agreed physical/operational conditions. Cash collection/reconciliation and refund procedures need named staff owners.

## 12. Supporting services and preview tools

| ID | Feature | Required behaviour and dependency |
| --- | --- | --- |
| SVC-01 | Swatches | Up to four available fabrics; name/email/full postal address; phone only if needed; persistent request/confirmation; pending/processing/shipped/delivered admin states |
| SVC-02 | Appointments | Real showrooms/slots/capacity; name/email/phone/location/time/notes; requested vs confirmed distinguished; no overbooking; UK local time; admin confirm/complete/cancel |
| SVC-03 | Colour previews | Admin uploads actual variant photo or generates draft preview; reviews/retries/replaces and explicitly saves; durable media; removable colour; visible “Colour preview” label |
| SVC-04 | Try in your room | JPG/PNG/WebP room photo; four placement points; full sofa cutout including cushions; saved catalogue colour; front-facing level placement; size/position/coverage/gap/floor controls; PNG export and correct basket handoff |

Swatch availability, postage/charges, request limits and fulfilment staffing are open. No showroom is assumed to exist; if there is none, obtain approval to omit booking rather than create a fictitious venue.

Room photos remain in the browser and are cleared on leaving/refreshing. Explain that the composition is illustrative and cannot prove physical fit, doorway clearance or exact colour. Do not upload personal room photos to a generation service without changing and approving that privacy requirement. Product cutouts and saved admin previews are different assets and need durable storage.

For SVC-03/SVC-04, run an early feasibility prototype with representative light/dark sofas, loose cushions, complex backgrounds and mobile memory limits. Compare original geometry/texture/shading and exported output. Agree acceptance examples before promising fully automatic results. Generated images cannot establish that a colour is supplied by the business.

Generation implementation/provider/cost are unresolved. A manual cutout/photo production workflow may be needed for quality even with automated tools. Failures need meaningful retry guidance; required tools must not be delivered as inert placeholders.

## 13. Administration and permissions

OPS-05: catalogue management must work through an admin panel, not developer-only JSON editing. Staff need workflows for categories, descriptions, dimensions, galleries, variant combinations, price/discounts, availability and publication. Preview unpublished changes privately before publishing.

Recommended permission separation:

| Role | Scope |
| --- | --- |
| Owner/admin | Staff access, settings, payment/delivery configuration, publication and financial actions |
| Catalogue editor | Product/media/content drafts and edits; publication permission as agreed |
| Operations | Orders, swatches, appointments, delivery updates and approved payment receipt recording |
| Read-only/reporting | Necessary business reporting without mutation rights |

Small team may initially use fewer roles, but server permissions must remain explicit. Confirm who can issue refunds, change bank details, publish products and view/export customer data. Recommended multi-factor authentication for privileged users, secure session expiry and an account recovery process.

Admin areas:

1. Dashboard: actionable counts for new orders, outstanding payments, draft products/review issues, notification failures, swatches and appointments. Avoid decorative statistics with no defined source.
2. Catalogue: searchable list, draft/published/archived filters, image uploads, variant editor, validation checklist and publication history.
3. Orders: number/date/customer search and separate payment/fulfilment filters; complete line/address/access detail and balance; controlled state changes and timeline.
4. Service requests: swatches and appointment capacity/statuses when enabled.
5. Content: categories/guides/blog/help/policies; approved legal content with version/date; metadata and redirects.
6. Settings: verified business details, delivery matrix, eligible payment methods, notification destinations and operational configuration.
7. Audit/reporting: important product/publication, payment/refund, permission and bank-detail changes; access-controlled exports.

OPS-06: authenticate and authorise every private page, data read, upload and mutation on the server. Hiding a menu is insufficient. Restrict upload types/size, verify file contents and prevent public execution or arbitrary remote fetches. Archive used products/variants instead of breaking historical orders. Require clear confirmation for destructive actions.

Document one full staff exercise: create product → add variants/media → resolve validation → publish → receive test order → dispatch → record payment/delivery → handle cancellation/refund → locate audit record. Owner must complete it with the guide before launch.

## 14. SEO and content programme

### 14.1 Search foundations

SEO-01: choose server-rendered or prerendered public pages with meaningful product/category content in initial HTML. Customer interactions may use client JavaScript; product discovery cannot depend on a loading-only shell. Exact framework/rendering/cache design belongs in the technical plan.

SEO-02: define clean stable URLs and consistent canonical URLs, internal links and sitemap entries. A recommended single product page can use `?variant=...` to share a selection while retaining the base canonical. Independently index variants only if they merit distinct content and the technical SEO approach is deliberate. [Google ecommerce URL guidance](https://developers.google.com/search/docs/specialty/ecommerce/designing-a-url-structure-for-ecommerce-sites).

SEO-03: establish a URL indexation matrix before building filters:

| URL class | Proposed rule |
| --- | --- |
| Published product, meaningful category/collection/guide | Index, correct canonical, sitemap inclusion |
| Approved high-demand landing page | Index only after useful unique content and real matching inventory exist |
| Sort/filter combinations and internal search | Do not generate an unlimited indexed URL space; apply explicit canonical/noindex/crawl design |
| Paginated category pages | Crawlable links, distinct page URLs; do not blindly canonicalise all pages to page one |
| Drafts/previews/staging | Authenticated where possible and noindex; outside public sitemap/feed |
| Basket/checkout/admin/personal status | Noindex plus appropriate data security |
| Temporarily unavailable product | Useful page and truthful availability; retain where customer/search value exists |
| Permanently removed product | Relevant replacement redirect only where justified; otherwise meaningful 404/410, remove from sitemap |
| Renamed slug/domain | Permanent redirect map without chains; update internal links/canonicals |

Do not block a URL in robots.txt and assume a crawler can still read its noindex tag. Canonicalisation is not a privacy control. The technical plan must choose coordinated rules and demonstrate them in a crawl test.

SEO-04: unique descriptive titles, concise page summaries, coherent headings, image alt text and breadcrumb navigation. Templates need editable overrides and safe defaults. Avoid mass keyword stuffing or generic identical descriptions.

SEO-05: machine-readable product offers must match visible selected/default prices, availability and approved policies. Use `Product`/`Offer`; `ProductGroup` only for genuine related variants with accurate identifiers and variant URLs. Use appropriate business/breadcrumb markup; ratings only from eligible real review data. Validate representative pages before launch. Rich results are eligibility, not guaranteed display. [Google product variants guidance](https://developers.google.com/search/docs/appearance/structured-data/product-variants).

SEO-06: generate sitemap(s) from published canonical pages; use accurate modification dates, not a timestamp changed on every request. Configure production robots and a preferred HTTPS domain. Feed and page updates must follow product publication, stock and pricing changes.

SEO-07: establish owner-controlled Search Console. Evaluate Merchant Center/free listings only when real approved products and policies qualify; feed values must agree with the site. Add verified Google Business Profile/local information only for eligible real operations. [Google product data guidance](https://developers.google.com/search/docs/specialty/ecommerce/share-your-product-data-with-google).

### 14.2 Research and editorial work

Before choosing landing pages, research UK demand and intent with a licensed keyword tool/Search Console where available. No keyword volumes or rankings have been measured for this project. Candidate themes are hypotheses: corner sofas, U-shaped sofas, sofa sets, small-room seating, fabric/recliner options and sofa measurement/access guidance.

For each chosen page record: target customer problem/search intent, inventory match, primary phrase, supporting topics, competing pages, original value, internal links, editor and review date. Do not create many near-identical town pages without real delivery/local value. Do not claim a showroom/local presence where none exists.

Recommended initial editorial set: how to measure a sofa and delivery route; left/right corner orientation with diagrams; fabric/material comparison grounded in actual products; delivery coverage/access guide; care instructions from reliable supplied specifications. Launch only completed helpful guides, not empty blog categories.

Month one: publish approved core category/product/help pages, validate crawlability, submit sitemap and inspect key URLs. Months two/three: use actual query/landing-page data to improve titles, useful content, imagery and links; expand categories/guides where inventory and demand justify it. Review product availability and stale content monthly. SEO ownership continues after engineering handover.

## 15. Conversion and measurement

UX-03: place exact price, selected options, trustworthy delivery information and primary action where customers can find them. Let customers estimate postcode eligibility/cost before a long checkout. Reduce ambiguity about set contents and room fit. Explain returns and seller contact details near purchasing decisions without overwhelming the page.

Real trust signals: owner-approved business story/photos, reachable support, substantiated reviews, accurate payments and clear delivery/returns. Avoid invented five-star reviews, stock countdowns, unsupported savings, fake scarcity, copied trust badges and newsletter discounts that the business has not approved.

Recommended funnel events:

| Event | Definition |
| --- | --- |
| Product view / variant selection | Approved product/variant identifiers and category; no customer personal details |
| Delivery check | Outcome class, not raw full address |
| Add/remove basket | Correct variant, quantity, currency and value |
| Begin checkout | Eligible basket enters checkout |
| Delivery/payment selection | Approved service/method identifiers |
| Order placed | One server-confirmed order; distinguish payment method and pending balance |
| Payment collected / refund | Verified financial event, kept distinct from COD order creation |
| Enquiry/contact click | Channel/product context; click alone is not a qualified lead |
| Swatch/appointment | Successfully saved request, not just form submission click |

Agree analytics destinations and consent behaviour before tags are installed. Do not send email, phone, delivery notes, full address or room-photo data to analytics. Use product identifiers and appropriate attribution rather than personal data. TikTok pixels/embeds and remarketing need deliberate consent/configuration decisions.

Use campaign UTM conventions for TikTok/social links and preserve exact product deep links. Reconcile tracked orders with operational records and deduplicate purchase events. Consent and ad blockers mean analytics totals may differ from business totals; report that limitation.

Initial improvement queue: mobile product action visibility, delivery cost clarity, product photography, required form fields and checkout error recovery. Run experiments only with enough traffic to interpret them; otherwise use customer/staff usability sessions and funnel diagnostics. Define a baseline period, denominator and guardrail metrics before setting numerical conversion targets.

## 16. Quality, accessibility and performance

QLT-01: recommended accessibility target WCAG 2.2 AA for public/admin journeys, verified with automated checks and manual keyboard/screen-reader tasks. Include labelled fields, clear errors linked to fields, visible focus, sensible dialog focus, touch targets, adequate contrast and reduced motion. Colour names and disabled states cannot rely on colour alone.

Responsive verification widths: 360/390 px phones, 768 px tablet, 1280/1440 px desktop, plus browser zoom/reflow. Test current Safari/iOS and Chrome/Android alongside desktop browsers chosen during discovery. Large-screen screenshots alone are insufficient.

QLT-02: target field Core Web Vitals at the 75th percentile, separately assessed for mobile/desktop: LCP ≤ 2.5 seconds, INP ≤ 200 ms and CLS ≤ 0.1. At launch there may be insufficient field data: use reproducible lab checks and later verify real-user results. Lab scores do not prove field compliance. [Web Vitals reference](https://web.dev/articles/vitals).

Recommended performance controls: responsive compressed images with dimensions; correct hero priority; lazy-load below-fold galleries/videos; small client bundles; self-hosted/appropriately loaded fonts; stable skeletons; deferred social embeds; load room-preview/generation interfaces only on demand. Define per-template budgets after a real prototype, not arbitrary numbers without measurement.

QLT-03: server validation, secure sessions/permissions, protected mutations, rate limiting for login/forms/order attempts, upload limits, safe content rendering, secret separation and abuse controls. Payment/order state updates require transactional/concurrency protection. Track dependencies and apply security updates with rollback capacity.

QLT-04: test important business behaviours rather than duplicating UI implementation. Minimum automated coverage: price/delivery calculation, permissions, variant validation, idempotency, stock concurrency, payment verification and service capacity. End-to-end coverage: browse → choose variant → basket → checkout → admin fulfilment, plus negative/error paths. Manual usability/accessibility checks complement automation.

QLT-05: business records and media survive restart/redeploy. Configure database and media backups, retention, restore drills, monitoring and support ownership. Recommended initial recovery objectives, subject to owner/provider budget: recovery point ≤ 24 hours and restoration ≤ 4 business hours. Do not claim these objectives are met until a timed restore demonstrates them.

## 17. Privacy, policies and business obligations

This section specifies implementation/discovery tasks; it does not supply the business's final legal wording. Owner approval and suitable professional review are needed for the actual policies and product obligations.

Confirm legal/trading identity, address, contact details, VAT status/tax display, cancellation/returns process, delivery/access/failed-delivery terms and guarantees before trading. Explain total charges and ordering obligations clearly and provide order information in a durable confirmation. [GOV.UK distance-selling guidance](https://www.gov.uk/online-and-distance-selling-for-businesses/distance-selling).

Do not assume every made-to-order sofa loses cancellation rights. Product-specific circumstances and genuinely personalised specifications need appropriate review. Statutory faulty-goods rights and any voluntary warranty must be represented accurately. A commercial returns policy cannot simply copy a competitor's wording.

Collect only data needed for the approved processes. Document purposes, service processors, retention periods, access rights and deletion/export handling. A request to delete personal data must account for legitimate required business records; it must not indiscriminately destroy transaction history. Protect admin exports and private notifications.

Create an inventory of cookies/storage, analytics, pixels and embeds. Configure necessary basket/session storage separately from optional tracking, give usable choice/withdrawal controls and test that optional tools respect the approved rules. ICO published updated storage/access guidance in April 2026; implementation must use current guidance rather than assume old blanket rules. A conservative consent-first setting for optional analytics/marketing is a recommendation pending review, not a claim that every analytics technology has identical legal treatment. [ICO update](https://ico.org.uk/about-the-ico/media-centre/news-and-blogs/2026/04/final-storage-and-access-technologies-guidance-published/).

Owner must also confirm supplier/product safety and relevant upholstered-furniture compliance documentation. Build an internal approval/evidence field if needed; developers must not generate compliance labels or guarantees from assumptions.

## 18. Hosting and architecture decisions

The owner confirms Vercel application hosting now and a Hostinger-purchased domain later. Connecting DNS keeps the application on Vercel. Domain registration, DNS, application hosting and database/media location remain separate. There is no selected application migration to Hostinger hosting and no confirmed UK-only data residency requirement.

Selected planning architecture: one Next.js/React/TypeScript/Tailwind application on Vercel; Supabase PostgreSQL, staff authentication and durable object storage; Resend transactional email; browser Canvas for room composition and mask-based admin colour previews. This is a single-store order-taking platform with managed services, not a marketplace or microservice system. Detailed contracts and setup belong to [the technical plan](TECHNICAL_IMPLEMENTATION_PLAN.md).

Use owner-controlled accounts and delegated developer access. Exact package patch versions are pinned at project bootstrap after compatibility checks. External credentials/verified email sender and production business data are implementation prerequisites, not additional scope questions.

[Vercel domain guidance](https://vercel.com/docs/domains/working-with-domains/add-a-domain) supports connecting registrar DNS to the project. Use the project's displayed DNS values, preserve email records and redirect to one canonical hostname. [Vercel Hobby guidance](https://vercel.com/docs/plans/hobby) restricts Hobby to personal non-commercial use; commercial deployment needs an eligible paid plan. This is a provider requirement to record even though the user does not need a budget interview now.

## 19. Delivery phases and work packages

### 19.1 Gates and deliverables

| Phase | Work packages | Deliverable and exit gate | Dependencies |
| --- | --- | --- | --- |
| 0 — Decisions and inventory | Incorporate supplied answers; catalogue review; reference delivery defaults; fresh-build inventory | Revised baseline + decision log; full launch scope recorded | Completed planning decisions |
| 1 — Technical plan and feasibility | Selected Vercel/Supabase design; persistent order proof; colour-mask/room-tool proof | Technical plan and functioning vertical slice | Service setup |
| 2 — Brand, UX and content model | Mobile-first wireframes; home/category/product/checkout/admin flows; design system; taxonomy and product fields | Approved representative screens and content checklist | Brand/content owner |
| 3 — Catalogue and admin foundation | Persistent product/category/variant/media management; draft/publication; demo import reporting; search/filter baseline | Staff can publish a validated product; public pages render meaningful content | Phase 1 data/runtime decisions |
| 4 — Commerce and operations | Basket; address/delivery; enabled payments; orders/reservations; emails; staff payment/fulfilment tools | Complete persistent sale/fulfilment flow including failure paths | Delivery/payment policies/accounts |
| 5 — SEO, content and services | Metadata/canonicals/schema/sitemaps/redirects; approved guides/policies/reviews; swatches/appointments where agreed | Populated crawlable site, accurate services and consent-controlled measurement | Real content and service capability |
| 6 — Advanced previews | Admin preview generation and approvals; sofa cutouts; room placement/export/handoff; privacy/mobile QA | SVC-03/SVC-04 acceptance examples pass within full launch | Valid product media/masks; early feasibility checks |
| 7 — Hardening and launch | Functional/security/accessibility/device/performance review; owner UAT; restore; production rehearsal/rollback | Launch gates passed; owner operational handover | Every launch-scoped feature complete |
| 8 — Growth and maintenance | Query/funnel review, content improvements, operational bug fixes, updates/backups | Ongoing prioritised improvement backlog | Real traffic and named support owner |

SEO is designed during phases 1–3, not retrofitted in phase 5. All phases contribute to the one full-scope release. Internal increments and early tests are engineering steps, not a reduced public launch. Real content collection continues alongside development; unsupported facts remain clearly unconfirmed.

### 19.2 Provisional schedule

The user sets a **two-day target** for a satisfactory complete product. Treat this as an aggressive 48-hour implementation/verification sprint beginning when implementation starts, not a guarantee that all requirements or external account setup will pass in that window. Do not substitute the old long-range estimate for the requested target, and do not silently omit features to claim completion. No scheduled automation or active goal has been created by this planning document.

Day 1: initialise stack/design system/schema; prove authenticated admin and transactional order persistence; import supplied catalogue; build storefront/product/basket/checkout; test delivery and variant correctness. Day 2: finish admin operations, notifications, swatches/appointments, colour previews/room planner, guides/policies/SEO; run critical tests, production rehearsal and handover. Exact hour blocks and dependencies are in the technical plan.

Single-store architecture reduces infrastructure work, but it does not eliminate risks in concurrency, permissions, image processing or persistence. Include short feasibility checks for order creation and preview quality early inside the sprint. If a feature or launch-critical check fails at 48 hours, report the concrete remaining work; a deadline does not redefine acceptance. SEO growth can improve after launch, while crawlability/metadata/content fundamentals must be present from the start.

Critical path: managed service access → schema/permissions → catalogue/variants → delivery quote/order transaction → full UI/services/tools → acceptance → deployment. Use implementation increments without withholding the requested complete launch scope.

### 19.3 Work item format

Every implementation issue must include: linked requirement IDs, customer/staff outcome, scope, dependencies, decision status, acceptance criteria, relevant pages/data, failure cases, verification evidence and owner. Use a working vertical slice early rather than implementing all static pages before proving a real order.

The technical plan must split these phases into reviewable tasks, specifying what can proceed while other answers are pending. Provider-dependent work cannot be completed with invented credentials/rules.

## 20. Acceptance and launch gates

### 20.1 Behavioural acceptance matrix

| Check | Passing evidence | Related IDs |
| --- | --- | --- |
| AC-01 Product publication | Owner-approved record publishes from admin; drafts/review-blocked products remain private | CAT-01–04, OPS-05 |
| AC-02 Variants | Colour/size/orientation/image/price consistent through basket/order/admin; unsupported combinations blocked | CAT-01–03, CHK-01 |
| AC-03 Basket | Refresh persistence, distinct variants, quantity/remove, current price/stock checks, honest delivery-cost state | CHK-01–03 |
| AC-04 Checkout | Guest flow, appropriate UK fields, recoverable errors, full review, correct due-now/balance | CHK-01–06 |
| AC-05 Address/coverage | Lowercase/spaceless postcodes; multiple addresses; lookup outage/manual entry; excluded/uncertain zones; quote invalidation on edit | CHK-04–06 |
| AC-06 COD | Persistent unpaid order without card fields; accurate outstanding amount; authorised collection record | PAY-01–02, OPS-01–04 |
| AC-07 Other payments | If enabled: online success/authentication/decline/cancel/retry; repeated callbacks; terminal/transfer receipt rules | PAY-01–02, OPS-03 |
| AC-08 Order history | Independent payment/delivery states, immutable selections/prices, cancellation/refund trail | OPS-01–04 |
| AC-09 Concurrency | Two buyers for last stock, duplicate order submissions, expired reservations and duplicate callbacks handled without oversell/double charge | OPS-03, QLT-03 |
| AC-10 Notifications | Correct confirmations/updates; failed email preserves order; retry/resend works | OPS-04 |
| AC-11 Admin security | Signed-out/underprivileged requests cannot read customer data or mutate catalogue/orders; private export/upload checks | OPS-06, QLT-03 |
| AC-12 Services | Up-to-four swatches persist; actual appointment capacity/timezones/statuses work when enabled | SVC-01–02 |
| AC-13 Preview tools | Approved preview saved/labelled; browser-local room photo; complete cutout and adjustments; PNG export and exact basket variant | SVC-03–04 |
| AC-14 Search readiness | Public initial HTML, unique metadata, route/indexation matrix, correct sitemap/robots/schema, no demo/private feed records | SEO-01–07 |
| AC-15 Customer quality | Phone/desktop/keyboard journeys; contrast/focus/errors; representative lab performance and field monitoring configured | UX-01–03, QLT-01–02 |
| AC-16 Durability/recovery | Orders/media/settings survive redeploy; a backup restores in an isolated environment; rollback rehearsal recorded | QLT-05 |
| AC-17 Ownership | Approved business/policies/products, service account access, support responsibilities and cost register | BUS-05–06, GOV-01 |
| AC-18 Measurement | Consent behaviour and event definitions tested; COD order/collected revenue distinct; personal data absent from analytics | Section 15, section 17 |

For every check, retain scenario, date, environment/build, tester, result and evidence link. “If enabled” excludes an unapproved method, not an implemented feature with failing tests. A deferred attachment feature needs an explicit recorded exception.

### 20.2 Launch gate

Public trading requires all P0 and agreed first-launch P1/P2 checks passed; zero unresolved defects that can expose private data, misprice orders, lose orders, double-charge, oversell or falsely promise delivery. Maintain a severity-ranked issue register. Minor agreed cosmetic issues may be documented with an owner/date; missing contractual/payment/coverage rules cannot be waived by a demo screenshot.

Before launch: owner signs off real catalogue/prices/media/claims, policies and enabled services; test/staging segregated; production keys/settings verified privately; HTTPS/domain/canonicals correct; demo products and sample secrets removed; emails/support destinations work; backups/monitoring/rollback tested; initial crawl and owner staff trial passed.

Soft launch with a controlled owner-agreed audience and real operational readiness. Check first orders promptly. Indexation submission follows successful production verification. Recheck production payment/delivery calculations with test facilities or an owner-controlled reconciled test; never use invented customer details to create unreconciled real orders.

## 21. Risks, costs and ownership

| Risk | Mitigation and responsible party |
| --- | --- |
| Demo source data mistaken for inventory | Separate environments/states; owner approval on every live listing |
| Media rights/third-party hotlinks | Owner/supplier authorisation, original photography and owned media storage |
| Hosting doesn't fit selected stack | Developer deployment spike before implementation commitment |
| Delivery/price ambiguity | Owner matrix; server calculation; boundary/failure tests |
| Advanced tools delay launch | Early feasibility work and explicit first-launch decision |
| COD cancellations/payment loss | Owner confirmation/reservation/collection/reconciliation procedure |
| Duplicate orders or oversells | Transaction/idempotency/concurrency design and tests |
| Thin/copycat content undermines search value | Original descriptions/guides and accurate taxonomy |
| Low traffic creates misleading conversion claims | Baselines, segmentation and sample-size-aware review |
| No named maintenance owner | Handover responsibility, service budget and incident process |
| Expanding to other furniture destabilises data | Extensible categories/attributes; no sofa-only mandatory fields globally |

### 21.1 Costs to budget

No third-party prices are fixed here; obtain current quotations and record renewals/usage limits. Budget categories: domain/hosting; database/backups; media/CDN; transactional email; licensed address lookup; payment processing/refunds; image processing/generation; paid theme/extensions if platform requires them; analytics/SEO tools; product photography/copy; professional policy review; ongoing development/support.

Maintain a cost register: provider, owner account, purpose, setup cost, recurring/renewal rate, usage model/limits, expected volume, billing alert/ceiling, cancellation/export terms and responsible person. Distinguish introductory from renewal prices. Prefer owner-controlled billing with documented delegated developer access.

### 21.2 Responsibilities

Owner/Sami: business identity, assortment/prices, supply/stock model, delivery rules, payments, showroom/swatch capability, policies, media approval, accounts/budget and final operational acceptance.

Developer: technical plan, design implementation, security, reliable data/order handling, QA, deployment/recovery documentation and maintainable handover.

Content/SEO owner: original content, metadata, factual review, Search Console/query review, update calendar and conversion investigation. If the developer performs this role, record that responsibility and ongoing time budget explicitly.

Operations lead: daily orders/notifications, delivery planning, payment reconciliation, cancellations/refunds and customer support. Roles can be held by the same person but cannot remain unnamed at launch.

## 22. Decisions and discovery questions

The 6 October answers below resolve the major design choices. Remaining facts are operational configuration tasks and do not require another broad interview before technical planning. Reference-derived defaults are permitted as editable provisional settings; they must not become unsupported guarantees.

| Decision | Question to resolve | Blocks / next action |
| --- | --- | --- |
| D-01 Identity | Resolved: developer may choose a changeable name; selected Oakmere Living | Legal identity/domain/logo still configuration tasks |
| D-02 Existing work | Resolved: fresh build; no earlier code | Build in this workspace |
| D-03 Hosting | Resolved: Vercel app, later Hostinger domain connected through DNS | Use Vercel custom-domain runbook |
| D-04 Launch scope | Resolved: full PDF at launch; internal critical testing permitted | All P0/P1/P2 checks required |
| D-05 Payments | Resolved: cash on delivery and card on delivery | No online gateway, transfer or BNPL; no deposit assumed |
| D-06 Collection | Staff confirms terminal readiness, cash/change rules, failed collection and refund authority | Manual delivery collection; transfers excluded from current scope |
| D-07 Delivery | Resolved for planning: use reference/document defaults and make them editable | Provisional mainland/ground-floor policy; team confirms exceptions/timing |
| D-08 Inventory | Resolved: mixed model | Per-variant stocked/supplier/made-to-order modes; unknowns require review |
| D-09 Catalogue | Resolved: Sami supplied JSON/images for initial data; admin manages listings | Import provenance/flags; drafts need resolution |
| D-10 Assortment | Sofas only initially? What other furniture is planned and when? | Taxonomy/content/model scope |
| D-11 Showrooms/swatches | Team handles operations; actual venues/slots and fabric availability remain to configure | SVC-01–02 stay in scope; do not invent public venue details |
| D-12 Preview tools | Resolved: included in complete launch | Mask-based colour generation and browser room planner; quality checks inside sprint |
| D-13 People | Resolved: Sami's team handles operations; site takes orders and showcases products | Owner/operations/catalogue roles; no logistics automation |
| D-14 Accounts | Configure owner-controlled Vercel/Supabase/email/lookup accounts during implementation | Service setup; no online payment provider required |
| D-15 Commercial plan | Resolved: no budget interview now; aim for two days with satisfactory quality | Track provider prerequisites/usage; never claim failed work complete |
| D-16 Policies/tax | VAT status, legal address, returns/cancellations/warranty and furniture compliance evidence? | Display/checkout/policies |
| D-17 Social/search | TikTok handles, current enquiries/orders, best sellers, target areas, real reviews and analytics access? | Landing pages, measurement/content priorities |
| D-18 Support | Preferred phone/email/WhatsApp, support hours and incident/maintenance owner? | Contact flows and handover |

No bank account numbers, API keys, passwords or private customer records are needed in the interview. Obtain secrets through approved private configuration mechanisms during implementation.

Record each answer as: decision ID; answer/status; person/date; business rationale; affected requirements; required document/task changes. Partial answers can unblock independent work, while provider-dependent tasks remain pending.

## 23. Developer/AI onboarding and change control

### 23.1 First-session checklist

1. Read this document's status, sections 1–5, decision register and launch scope before coding.
2. Read the technical plan; check its decisions/version agree with this baseline.
3. Inspect actual repository files and applicable `AGENTS.md`; do not assume the PDF's old README/framework exists.
4. Locate work backlog/current milestone, approved design/content and previous verification evidence.
5. During bootstrap, create local setup instructions and example environment variables from the technical plan; thereafter follow the actual setup guide and obtain delegated credentials privately where needed.
6. Use isolated demo/test data; never import the 108 records directly into a live sellable catalogue without approval.
7. Pick the next unblocked task; link requirement IDs; verify behaviour/failure cases; update evidence/progress.

### 23.2 Planned documentation responsibilities

| Document | Purpose | Status |
| --- | --- | --- |
| `PROJECT_IMPLEMENTATION_PLAN.md` | Authoritative scope, behaviour, sequencing, owner decisions and acceptance | This draft |
| `TECHNICAL_IMPLEMENTATION_PLAN.md` | Architecture decisions, data/API contracts, rendering/security, dependency graph and technical tasks | Created from the recorded answers |
| `README.md` | Repository entry point and document navigation; later local setup | Created alongside this plan |
| Future operational guide | Product publishing, order/payment/delivery/service workflows | Required before launch |
| Future deployment/recovery guide | Environments, migrations, release/rollback, backup/restore, service ownership | Required before launch |
| Future QA/progress register | Acceptance evidence, outstanding issues and milestone status | Required during development |

Supporting runbooks must reference this baseline rather than introduce contradictory requirements. Do not duplicate authoritative facts in many documents without clear ownership.

### 23.3 Change rules

Use version control once the project is initialised. Keep original supplied files unchanged. Separate source assets from public approved media and test from production records. No secrets in code, screenshots, commits or plan documents.

For a scope change: record the answer/change → update requirement/decision → assess affected data/UI/SEO/operations/tests → adjust milestone/cost → implement and verify. Do not rename public slugs without redirects, edit an order snapshot through a catalogue change, change receiving bank details without authorised audit, or mark a task done with a disconnected form.

Definition of done for a work item: correct customer/staff outcome, persistence and permissions verified, important failures tested, relevant documentation current and evidence recorded. Definition of done for the project additionally requires the agreed launch gates and operational handover.

## 24. Traceability and research sources

### 24.1 Attachment-to-plan map

| PDF page | Subject | Plan sections / acceptance |
| --- | --- | --- |
| 1 | Scope/payment ambiguity | 1–5, 11, 22; AC-06–07 |
| 2 | Design/navigation/pages/content truth | 7–8, 15; AC-14–15 |
| 3 | Products/variants/colour previews | 9, 12; AC-01–02, AC-13 |
| 4 | Basket/totals/persistence | 10; AC-03–04 |
| 5 | Customer fields | 10; AC-04 |
| 6 | Postcodes/addresses/coverage | 10; AC-05 |
| 7 | Payment methods/details | 11, 17; AC-06–07 |
| 8 | Orders/statuses/delivery | 11, 13; AC-08–10 |
| 9 | Swatches/appointments/room tool | 12; AC-12–13 |
| 10 | Admin/stack/persistence/security/SEO | 13–18; AC-11, AC-14–18 |
| 11 | Acceptance/handover | 19–23; AC-01–18 |
| 12 | Owner decisions/source references | 22; unresolved decision register |

Current user request maps to BUS-01–06 and GOV-01. JSON maps to section 3.2/9.2; screenshots to section 4/8. Vercel is now explicitly selected by the user's latest answer. No customer-facing BenchMade branding/US offers or copied retailer reviews are approved.

### 24.2 Research register

Reviewed 6 October 2026. Vendor/documentation behaviour can change: recheck before implementing the affected integration. Evidence distinguishes fetched official guidance from our project recommendations. No live competitor performance/checkout audit or keyword-volume study was completed.

| Source | Purpose / evidence boundary |
| --- | --- |
| [UK Sofa Shop](https://www.uksofashop.co.uk/) | Public text/content benchmark only; no speed/conversion conclusions |
| [Corner Sofa](https://www.cornersofa.online/) | User-provided benchmark; unavailable via research tool, deeper audit outstanding |
| [Hostinger Node.js hosting](https://www.hostinger.com/uk/nodejs-hosting) | Hosting options exist; actual purchased plan/runtime/region still need proof |
| [Google ecommerce URL structure](https://developers.google.com/search/docs/specialty/ecommerce/designing-a-url-structure-for-ecommerce-sites) | Canonical/variant URL planning |
| [Google product variants](https://developers.google.com/search/docs/appearance/structured-data/product-variants) | Accurate ProductGroup/Product variant markup and validation |
| [Google product data sharing](https://developers.google.com/search/docs/specialty/ecommerce/share-your-product-data-with-google) | Structured data and Merchant Center planning; eligibility must be checked |
| [Web Vitals](https://web.dev/articles/vitals) | Field performance metrics and thresholds |
| [GOV.UK distance selling](https://www.gov.uk/online-and-distance-selling-for-businesses/distance-selling) | Business policy/checkout discovery tasks; not final legal text |
| [ICO April 2026 update](https://ico.org.uk/about-the-ico/media-centre/news-and-blogs/2026/04/final-storage-and-access-technologies-guidance-published/) | Current storage/consent guidance changed; check exact tools/rules before launch |

The PDF also cites ONS address-entry guidance, Royal Mail Postcode Finder and PCI SSC FAQ 1319, reportedly checked 15 September 2026. Those inherited citations were read as part of the attachment but not independently revalidated in this planning pass; revalidate relevant provider/payment guidance during technical implementation.

### 24.3 Current handoff state

Completed: reference inventory, twelve-page brief review, catalogue count/flag assessment, screenshot review, limited web research and this project baseline.

Completed next step: owner answers incorporated and technical implementation plan created. Next: implement its first unblocked work package. No application code, catalogue import, account setup or deployment has yet been performed.

### Revision history

| Version/date | Change | Approval state |
| --- | --- | --- |
| 0.1 / 6 October 2026 | Initial consolidated plan based on current user request, attachments and research | Awaiting owner answers; recommendations remain provisional |
| 0.2 / 6 October 2026 | Owner answers: Oakmere Living, fresh build, Vercel/Hostinger DNS, full scope, COD/card on delivery, reference defaults, mixed inventory and two-day target | Technical planning baseline; unresolved operational facts retained explicitly |
