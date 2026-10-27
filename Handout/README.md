# Oakmere Living handout

This folder is a self-contained onboarding pack for another developer or AI working on the Oakmere Living furniture website.

Start with [handoff.md](handoff.md). It explains the business goal, product decisions, architecture, implementation history, verified state, unresolved work and safe continuation order. Then read the two source-of-truth plans under `03-project-docs/`.

## Folder map

| Folder/file | Contents |
| --- | --- |
| `handoff.md` | A–Z project handoff and continuation instructions |
| `reference-links.md` | Authorised visual references, research URLs and current project links |
| `01-original-inputs/` | The user's PDF, screenshots, WhatsApp images and detailed motion prompt |
| `02-catalogue/` | Original 108-product JSON, media manifest and resolved furniture/hero images |
| `03-project-docs/` | Business plan, technical plan, motion contract, parity plan and progress history |
| `04-research/` | Reference audits, media provenance/recovery evidence and PDF review renders |
| `05-technical-snapshot/` | Dependency manifest, safe environment template, agent rule and applied SQL migrations |

## Safety and provenance

- No `.env.local`, access token, API key, password, session cookie or customer record is included.
- The original catalogue and user-supplied files are copied without modification.
- Product media is included because it is part of the implemented catalogue. Retain its provenance records and do not infer new sellable variants from an image.
- Reference websites are design/research evidence. Their business identity, addresses, telephone numbers, social handles, reviews, warranties and unverified claims do not belong to Oakmere Living.
- Historical handoff/progress files preserve chronology. The latest state in `handoff.md` and `IMPLEMENTATION_PROGRESS.md` supersedes stale “not yet implemented” statements in older sections.

Prepared on 27 October 2026 from repository commit `516bd72` plus this handout addition.
