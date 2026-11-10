# Oakmere Living — Deployment-Ready Website Prompt and Release Checklist

Last updated: 10 November 2026  
Audience: developers, designers, SEO specialists, QA engineers, and AI implementation agents

## 1. Mission

Prepare Oakmere Living, a UK furniture retailer focused initially on sofas and upholstered seating, for a reliable public launch that earns qualified organic visibility and converts visitors into orders. The experience must feel premium, remain fast on mobile, and make buying a large furniture item feel safe and understandable.

The site is an order-taking and product-showcase platform. Customers pay by cash on delivery or card on delivery. Oakmere Living does not fulfil delivery operations through the website. Product, delivery, payment, warranty, stock, discount, finance, manufacturing-origin, and showroom claims must be published only when supported by current business information.

## 2. Non-negotiable product rules

- Keep the core routes distinct: Home, Shop, Product, Swatches, Room Visualiser, About, Help/FAQs, Basket, Checkout, legal pages, and administrator surfaces.
- Product categories remain filters within `/shop`; do not create visually disconnected catalogue pages. Curated, single-category filter URLs may be indexed when they have unique titles, headings, descriptions, canonicals, and useful inventory.
- Combined filters, on-site searches, sort orders, empty results, basket, checkout, account, admin, API, and preview environments must not enter Google’s index.
- Preserve all working commerce, authentication, administration, basket, checkout, assistant, swatch, and room-visualiser functionality.
- Use GBP, UK spelling, UK delivery language, clear measurements, and touch-friendly quantity `−` and `+` controls that update immediately.
- Do not use a `meta keywords` tag. Google ignores it. Express search intent through helpful content, page titles, headings, internal links, image alternatives, product data, and structured data.
- Do not keyword-stuff, copy competitor prose, fabricate reviews, or use competitor-owned photographs without permission.

## 3. Visual and interaction direction

Use Oakmere Living’s brand and supplied product photography. `cornersofa.online` is the primary functional and visual reference, while the other retailers below establish the minimum UK market standard. Recreate useful interaction patterns, not proprietary branding or copyrighted copy.

- Premium editorial composition, generous spacing, strong product imagery, restrained warm neutrals, and legible contrast.
- Preserve the established motion system: scroll-scrubbed hero assembly, masked typography and product reveals, material-swap morphs, and tactile basket/filter drawers.
- Add meaningful micro-interactions for navigation, buttons, product imagery, swatches, filters, and basket feedback.
- All animation must use transforms, opacity, or masks; avoid layout-shifting animation. Honour `prefers-reduced-motion` and keyboard operation.
- Every long page must finish with a useful next action: browse all sofas, order swatches, use the room visualiser, view delivery help, or contact the team.

## 4. Research references

Primary reference:

- [Corner Sofa Online](https://www.cornersofa.online/)

Secondary project reference:

- [UK Sofa Shop](https://www.uksofashop.co.uk/)

UK category and merchandising benchmarks:

- [DFS sofas](https://www.dfs.co.uk/sofas)
- [Sofology sofas](https://www.sofology.co.uk/sofas)
- [Furniture Village sofas](https://www.furniturevillage.co.uk/sofas-and-armchairs/sofas/)
- [AMC corner sofas](https://www.amcfurniture.co.uk/collections/corner-sofas)
- [Sofa Club corner sofas](https://sofaclub.co.uk/collections/corner-sofas)

Authoritative implementation references:

- [Google ecommerce launch guidance](https://developers.google.com/search/docs/specialty/ecommerce/how-to-launch-an-ecommerce-website)
- [Google SEO starter guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Google ecommerce URL guidance](https://developers.google.com/search/docs/specialty/ecommerce/designing-a-url-structure-for-ecommerce-sites)
- [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Google title-link guidance](https://developers.google.com/search/docs/appearance/title-link)
- [Google image SEO guidance](https://developers.google.com/search/docs/appearance/google-images)
- [Google Product structured data](https://developers.google.com/search/docs/appearance/structured-data/product-snippet)
- [Google Organization structured data](https://developers.google.com/search/docs/appearance/structured-data/organization)
- [Google Search Console ownership verification](https://support.google.com/webmasters/answer/9008080)

## 5. Search-demand map

These clusters are a content and information-architecture map, not guaranteed ranking or traffic figures. Validate exact volumes and difficulty later with Google Keyword Planner and Search Console data.

| Intent | Primary terms | Supporting terms and questions | Best destination |
|---|---|---|---|
| Broad transactional | sofas UK, sofas online UK, sofa shop UK | buy sofa online, living room sofas | Home and Shop |
| Corner layouts | corner sofas, L-shaped sofas | left-hand corner sofa, right-hand corner sofa, small corner sofa, large corner sofa | Single-category shop filter + guide |
| Large layouts | U-shaped sofas | modular U-shaped sofa, family sofa, cinema sofa | Single-category filter + measuring guide |
| Matching sets | sofa sets, 3 and 2 seater sofa sets | matching sofa set, living-room suite | Single-category filter |
| Reclining | recliner sofas, electric recliner sofas | power recliner, manual recliner, cinema seating | Single-category filters + comparison guide |
| Flexible space | sofa beds | corner sofa bed, guest sofa bed, compact sofa bed | Single-category filter + guide |
| Seat count | 2 seater sofas, 3 seater sofas | compact sofa, small-space sofa, family sofa | Single-category filters |
| Materials | fabric sofas, leather sofas | chenille sofa, velvet sofa, teddy sofa, boucle sofa, jumbo cord sofa | Filters, product pages, material guides |
| Complementary | armchairs, accent chairs, footstools | matching footstool, snuggle chair | Single-category filters |
| Colour | beige sofa, cream sofa, green sofa, grey sofa, black sofa | neutral sofa, oatmeal sofa, moss green sofa | Filtered discovery and editorial content |
| Decision support | sofa measuring guide | will a sofa fit through my door, how to measure a corner sofa | Help/guide pages |
| Confidence | sofa swatches, sofa delivery UK | order fabric swatches, delivery lead time, cash on delivery sofa | Swatches, delivery and payment pages |
| Visualisation | room visualiser furniture | see sofa in my room, upload room photo | Room Visualiser |

Research signals from 2026 sources suggest continuing interest in U-shaped, curved, deep-seat, recliner, teddy-texture, chenille, warm-neutral, and green seating. Treat trend terms as editorial opportunities only when matching products actually exist. Do not relabel products merely to capture a phrase.

## 6. Page requirements

### Home

- Unique title, description, canonical URL, social-share image, single descriptive H1, and crawlable links to the main commercial intents.
- A clear value proposition above the fold, featured products, category discovery, trust information, customer-assistance routes, room visualiser, swatches, and a strong closing action.
- `WebSite` and `OnlineStore`/`Organization` JSON-LD containing only verified business data.

### Shop and category-filter URLs

- `/shop` targets broad sofa-shopping intent.
- A single approved category query, such as `/shop?category=corner-sofas`, may be self-canonical and indexable with a unique title, H1, introduction, useful products, and internal links.
- Multiple filters, search terms, sort parameters, unknown filters, or empty combinations must be `noindex,follow` and canonicalise to the nearest useful parent.
- Filter state must remain usable with JavaScript disabled where practical, and selected states must be announced accessibly.

### Product pages

- Stable, readable slug; self-canonical; unique title and description; one H1.
- Accurate price, availability, variants, dimensions, materials, care, delivery, payment, and returns information.
- Product image gallery with descriptive alt text, explicit dimensions/aspect ratios, responsive sizes, modern formats, and no flash during material changes.
- `Product` JSON-LD must match visible content exactly; use `Offer`, `AggregateRating`, or `Review` only when the supporting data is real and visible.
- Breadcrumb UI and `BreadcrumbList` JSON-LD.
- Related products and useful routes to measurements, swatches, delivery, room visualisation, basket, and checkout.

### Guides, FAQs, blog, and policies

- Publish useful first-party guidance answering real buying questions rather than thin keyword pages.
- Start with measuring and access, corner orientation, sofa sizing, material care, fabric versus leather, recliner choices, delivery preparation, and room-planning advice.
- FAQ structured data may be used only for questions and answers visibly rendered on the same page; eligibility for a rich result is not guaranteed.
- Every article needs an author/editor identity, updated date, canonical, useful internal links, and a clear next step.
- Privacy, cookies, terms, delivery, returns, payment, warranty, and contact information must match the actual business process and UK legal advice.

## 7. Technical SEO contract

- Use server-rendered HTML for titles, headings, primary copy, links, products, prices, and structured data.
- Every indexable URL must return `200`, have one canonical, a unique title and description, a useful H1, and be reachable through crawlable links.
- Redirect retired URLs once with permanent redirects; avoid redirect chains and soft 404s.
- `robots.txt`: permit the production storefront; block or exclude admin/API and non-public areas; include the absolute sitemap URL. Preview and local environments must disallow all crawling.
- `sitemap.xml`: include only canonical, indexable, live URLs with accurate modification dates. Include products, curated category filters, guides, policies, and image locations where supported. Exclude basket, checkout, account, admin, APIs, internal search, and faceted combinations.
- Canonical URLs must use the final HTTPS hostname consistently. Never publish preview-host canonicals on production.
- Supply a favicon/app icon, Open Graph image, Twitter image, `og:title`, `og:description`, `og:url`, and representative product images.
- Use semantic landmarks, correct heading hierarchy, descriptive anchor text, keyboard focus, form labels, useful error messages, and WCAG 2.2 AA contrast.
- Target Core Web Vitals at the 75th percentile: LCP ≤ 2.5 seconds, INP ≤ 200 ms, CLS ≤ 0.1. Avoid third-party scripts until needed, optimise fonts, and reserve image/video space.
- Add secure headers, strict input validation, authenticated and authorised admin/API operations, rate limiting where abuse is plausible, and no secrets in client bundles.

## 8. Structured-data matrix

| Surface | Required schema when truthful |
|---|---|
| Site-wide | `WebSite`, `OnlineStore` or `Organization` |
| Shop/category | `ItemList` |
| Product | `Product` + `Offer`; `BreadcrumbList` |
| Editorial article | `Article` or `BlogPosting`; `BreadcrumbList` |
| FAQ page | `FAQPage` only for visible first-party questions/answers |

Validate rendered JSON-LD with Google Rich Results Test and Schema.org Validator. Structured data must never contain claims absent from the page.

## 9. Conversion and trust checklist

- Persistent, understandable navigation; visible Shop, Swatches, Room Visualiser, Help, Basket, and account/admin access where appropriate.
- Clear delivery area, lead time, payment-on-delivery explanation, returns/cancellation process, contact route, and privacy controls.
- Product cards show a useful image, name, current price, relevant variant cues, and an accessible action.
- Basket quantity uses immediate `−` and `+` controls, prevents invalid quantities, preserves state, and gives screen-reader feedback.
- Checkout validates UK contact/address fields, summarises items and total, explains payment method, handles duplicate submission safely, and confirms the order.
- Avoid urgency, scarcity, crossed-out pricing, testimonials, ratings, or guarantees unless verifiable.

## 10. Release sequence

1. Freeze the intended release candidate and document the commit or source snapshot.
2. Validate catalogue data, unique product slugs, image paths, prices, variants, and required dimensions.
3. Run type checking, automated tests, catalogue validation, and a clean production build.
4. Confirm production environment variables without exposing values: Supabase URL/keys, server credentials, site URL, administrator configuration, and optional Google verification token.
5. Confirm Supabase migrations, row-level security, administrator access, storage policies, backups, and checkout/order persistence.
6. Review rendered metadata, canonical rules, robots, sitemap, JSON-LD, status codes, redirects, and error pages.
7. Test the full journey at desktop and mobile sizes: discovery → filter → product → variant → quantity → basket → checkout → order confirmation; test administrator sign-in separately.
8. Test keyboard navigation, visible focus, reduced motion, labels, errors, colour contrast, zoom, and screen-reader announcements.
9. Measure Core Web Vitals and investigate console errors, failed requests, oversized media, hydration warnings, and layout shifts.
10. Deploy a production build to Vercel. Do not expose local handoff archives, development evidence, secrets, or unnecessary source assets.
11. Smoke-test the newly deployed production version, not an older preview.
12. Connect the final custom domain with HTTPS and one preferred hostname; redirect all alternatives to it. Until then, use the Vercel production hostname consistently.
13. Add the site to Google Search Console, verify ownership, submit the sitemap, and inspect a representative home, shop, category, product, and guide URL.
14. Configure privacy-respecting analytics and conversion events only after consent requirements are satisfied.
15. Monitor indexing, crawl errors, orders, failed checkout attempts, server logs, uptime, and Core Web Vitals after launch.

## 11. Google Search Console procedure

1. For the temporary Vercel hostname, add a URL-prefix property using the exact HTTPS URL.
2. Verify using an HTML file or HTML meta tag. Keep the verification artefact in production after verification.
3. Submit `https://<production-host>/sitemap.xml` in Sitemaps.
4. Use URL Inspection to request indexing for the home page, Shop, one curated category-filter URL, one product, and one guide. This is a discovery request, not a ranking guarantee.
5. Confirm the live test sees the intended canonical and permits indexing.
6. When the Hostinger-purchased custom domain is connected, create a Domain property through DNS verification, update canonical/site URLs, redirect the Vercel hostname as appropriate, resubmit the sitemap, and monitor migration signals.

## 12. Acceptance criteria

- All automated checks and the production build pass.
- The public release has no uncaught console errors or failed critical requests in the tested journeys.
- Production pages are indexable; previews and private surfaces are not.
- `robots.txt` and `sitemap.xml` return `200`, use the production host, and agree with canonical/index rules.
- Home, Shop, curated category, product, article, and policy pages have correct metadata and canonicals.
- Product and organisation structured data contain no fabricated fields and validate without critical errors.
- Desktop and mobile navigation, filtering, swatches, room visualiser, basket quantity, checkout, and administrator authentication are usable.
- Images are licensed/supplied, optimised, responsive, and have appropriate alternative text.
- Search Console ownership is verified and the sitemap is accepted, or the single remaining manual account step is documented precisely.
- The final domain, business contact details, delivery terms, returns wording, payment wording, analytics consent, and legal text have an identified business owner before marketing begins.

## 13. Post-launch content priorities

1. Improve product descriptions and measurements using verified product data.
2. Publish the sofa measuring/access guide and link it from product and checkout surfaces.
3. Add orientation, material-care, recliner, and sofa-size guides based on support questions and Search Console queries.
4. Expand only categories supported by real inventory; investigate teddy, deep-seat, curved, chenille, warm-neutral, and green terms without forcing mismatched products.
5. Review Search Console weekly for the first month, then monthly: indexing, queries, landing pages, CTR, rich-result issues, Core Web Vitals, and crawl anomalies.
6. Test titles, merchandising, trust copy, and calls to action based on qualified traffic and completed orders, not vanity traffic alone.
