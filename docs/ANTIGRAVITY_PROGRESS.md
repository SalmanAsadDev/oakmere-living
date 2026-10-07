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
- Implement protected admin/order flows and checkout page.

## 7 October 2026 - Milestone 2: Service Persistence Foundation

### Completed
- **Database Migrations (`supabase/migrations`)**: Created `20261006160500_commerce_foundation.sql` establishing tables for `contact_requests` and `swatch_requests` with Row Level Security (RLS) enabling public inserts.
- **Backend Services (`lib/server/supabase.ts`)**: Initialized Supabase SSR client for authenticated user queries and service-role queries.
- **Validation Schemas (`lib/validation/services.ts`)**: Created Zod schemas for securely validating incoming API requests.
- **Service Endpoints (`app/api/`)**: Implemented `POST /api/contact` and `POST /api/swatches` handling backend inserts.
- **Re-enabled Forms (`app/contact`, `app/swatches`)**: Replaced Codex's disabled state barriers with actual client-side fetch implementations mapped to the newly created endpoints. Both forms successfully process validation, loading states, and database submission without page reloads.

### Notes
- Service forms are now fully functional and persistent, securely satisfying the blocker from `FRONTEND_PROGRESS.md`.
- No interference with Codex's frontend work. Ownership bounds were strictly maintained.
