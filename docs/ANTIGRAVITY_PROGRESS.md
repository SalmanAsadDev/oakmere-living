# Antigravity Progress Log

## 7 October 2026 - Milestone 1: Supporting Content Pages

### Completed
- **Contact (`/contact`)**: Created page with contact information, hours, and a working UI form for enquiries.
- **Delivery (`/delivery`)**: Created page outlining delivery costs, timescales (Mainland 2-4 days, Scotland/Wales 5-7 days), upstairs fees, assembly fees, and missed delivery charges, based on the reference-derived starting configuration.
- **FAQs (`/faqs`)**: Created page with common questions regarding ordering, payment, delivery, and care.
- **Privacy Policy (`/privacy`)**: Implemented standard privacy policy and data collection terms.
- **Terms of Service (`/terms`)**: Implemented terms outlining products, pricing, payment (COD/Card on Delivery), and cancellations/returns.
- **Swatches (`/swatches`)**: Implemented UI for requesting up to four free fabric swatches with postal form.
- **Showrooms (`/showrooms`)**: Implemented page clarifying the online-first approach and pointing to swatches and guides.
- **Buying Guides (`/guides`)**: Implemented index page and detailed guides for:
  - Measuring for Delivery
  - Left vs Right Hand Corner Sofas
  - Fabric vs Leather

### Notes & Blockers
- These are currently static UI pages implemented using Next.js App Router and existing UI components from `components/ui`.
- The contact form and swatches form UIs are in place but currently do not have the backend API endpoints attached for actual submission/email queuing. These will be connected when the protected admin/order flows and server endpoints (`lib/server/`, `api/`) are built in the next milestone.

### Next Steps
- Implement real persistent contact/services endpoints.
- Implement protected admin/order flows and checkout page.
