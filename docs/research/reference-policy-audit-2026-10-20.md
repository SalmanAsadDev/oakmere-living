# Reference requirements audit — 20 October 2026

Authority: owner instructed us to derive missing details from https://www.cornersofa.online/ and designated `salmanasad561@gmail.com` as initial administrator. Staff invitations are deferred. Existing cash/card-on-delivery instructions take precedence over conflicting reference content.

Evidence: public HTML and the public catalogue endpoint fetched successfully over HTTPS. Raw snapshots stay in ignored `.local/reference-audit/`; no customer data or authenticated competitor endpoint was accessed. The public catalogue audit records its SHA-256 and exact missing-dimension matches in `reference-catalogue-audit-2026-10-20.json`.

| Source | Observed facts | Oakmere treatment |
| --- | --- | --- |
| [Delivery](https://www.cornersofa.online/delivery-info/) | Standard mainland service £0, 5–7 working days; express £29.99, 2–3 days; removal £49.99. Separate made-to-order production range 2–4 weeks. | Shared indicative estimates; dispatch time is separate from production. Special areas and service/access requests require confirmation. No automated slot or extras booking yet. |
| [FAQ](https://www.cornersofa.online/faq/) | Delivery/assembly wording differs from delivery page. Lists online processors, finance and showroom/warranty claims. | Do not copy conflicting payment methods, guarantees, factory or showroom claims. Delivery page is the primary reference for estimate figures. |
| [Terms](https://www.cornersofa.online/terms/) | Describes acceptance, delivery, returns, VAT and warranty; legal identity/domain differs from current storefront. | Research input only. Does not prove Oakmere identity, VAT status or manufacturer warranty. Existing public terms need business/legal review before launch. |
| [Privacy](https://www.cornersofa.online/privacy/) | Lists processors and data practices belonging to the reference business. | Oakmere disclosure must describe our actual Vercel/Supabase, local-photo and future provider flows. Do not copy its company/contact identity or claim an unconfigured analytics/payment provider. |
| [Appointment](https://www.cornersofa.online/appointment/) | Form includes day/time and two showroom addresses. | Implement consultation requests; do not claim these addresses belong to Sami. |
| [About](https://www.cornersofa.online/about/) | UK positioning and cash-on-delivery messaging. | Maintain Sami's supplied family-business story, delivery-payment methods and original Oakmere presentation. No copied testimonials. |
| [Swatches](https://www.cornersofa.online/swatches/) | Client-loaded material collection; links describe samples as free. | Catalogue sample selection and team-confirmed availability; do not invent fabric stock/dispatch. |
| [Public catalogue](https://www.cornersofa.online/api/products/) | 108 records, exact source slugs. Selected reference product is Lily 3+2 Seater High Back. Extra colour variants and stock values differ from supplied source. | Preserve original sellable variant IDs/prices. None of the 12 ready products missing dimensions gained a usable measurement from the exact match. Do not infer stock, colour availability or dimensions. |

Implementation: shared delivery policy/checker on Delivery and product detail; consistent FAQ and Recliners links; idempotent server-only administrator bootstrap and first-access email-link path. The administrator email is not published as a customer-service address.

Resolved dependency: the owner restored Supabase on 20 October after the initial DNS failure. Secure migrations, source catalogue import and owner account provisioning have since succeeded. Database RLS and atomic catalogue saves are verified with disposable transaction fixtures. User email ownership verification, redirect allowlisting, browser publishing and transactional checkout remain outstanding. No credentials were changed and no email was sent by the agent.

No additional paid provider has been purchased or enabled. A competitor website cannot supply Oakmere's credentials, sender-domain verification or an authorised AI budget. Continue with provider-independent implementation; remote room processing and generative assistance remain dependent on provider configuration and cost limits.
