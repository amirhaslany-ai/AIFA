# ADR-0004: Next.js (App Router) for `apps/web`

**Status:** Accepted
**Date:** 2026-07-12

## Context

The platform's frontend is the AIFA aggregator's web client — needs SEO-friendly marketing/landing pages, an authenticated chat/product surface, and a Persian (RTL) UI eventually. None of the product UI is being built in this milestone; only the app's architecture skeleton.

## Decision

- **Framework:** Next.js, App Router, TypeScript, React Server Components by default; Client Components opted in only where interactivity requires it (chat UI, forms).
- **Styling:** Tailwind CSS (utility-first, no runtime cost, easy RTL support via logical properties) — configured but not themed in this milestone.
- **State/data:** Server Components + fetch for server data; a client-side query cache (TanStack Query) reserved for client-only interactive state once real features land — not installed yet, documented as the intended choice.

## Rationale

- Next.js is the most-documented, officially-supported React meta-framework; SSR/RSC gives the marketing pages real SEO without a separate static site generator.
- App Router's layout/route-group model maps cleanly onto "public marketing pages" vs. "authenticated product" as two route groups sharing one app, avoiding a second repo/deploy for a marketing site.

## Alternatives considered

- **Remix:** comparable capability; smaller ecosystem overlap with the rest of the intended stack (Vercel-adjacent tooling). Not chosen, no strong reason to deviate from the more widely documented option.
- **Separate marketing site (e.g., Astro) + separate app:** adds a second deploy target and duplicated design system for no clear benefit at this stage; revisit only if marketing content volume grows large enough to need a dedicated CMS-driven site.

## Consequences

- `apps/web` has two route groups from the start: `(marketing)` and `(app)`, so the eventual auth boundary has a natural home instead of being retrofitted.
- No state management library (Redux/Zustand/etc.) is installed until a real feature needs client state beyond form-local state — avoids premature abstraction.
