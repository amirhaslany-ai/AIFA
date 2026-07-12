# Frontend Architecture — `apps/web`

See ADR-0004 for framework choice. This document covers the concrete layout.

## Routing structure

```
apps/web/src/app/
├── (marketing)/         # public, SEO-indexed pages — no auth required
│   └── page.tsx          # landing page placeholder
├── (app)/                # authenticated product surface — auth boundary lands here later
│   ├── layout.tsx        # placeholder layout; will gate on session once auth exists
│   └── dashboard/
│       └── page.tsx      # placeholder — route groups don't add a path segment, so
│                          # every route inside (app) needs its own real segment
│                          # (e.g. /dashboard) to avoid colliding with (marketing)'s "/"
├── api/                  # Next.js route handlers, used only for BFF concerns (e.g. auth callback)
│   └── health/route.ts   # proxies apps/api health check, for uptime checks against the web deploy itself
├── layout.tsx            # root layout (fonts, providers)
└── globals.css
```

Route groups `(marketing)` and `(app)` share the root layout but render independently — this is what lets the auth boundary (not implemented yet) wrap only `(app)` without touching marketing pages.

## Rendering strategy

- **Default:** React Server Components, fetching data server-side via `apps/api`'s REST endpoints (typed via `@aifa/types` DTOs shared from the backend).
- **Client Components:** only where interactivity requires it (forms, the future chat interface) — marked explicitly with `"use client"`, kept as leaf components rather than whole-page opt-outs.
- **Data fetching:** server-side `fetch` with Next.js's built-in caching/revalidation for marketing content; no client data-fetching library installed until a real client-interactive feature needs one (see ADR-0004 consequences).

## Styling

Tailwind CSS, configured for logical properties (`ms-*`/`me-*` over `ml-*`/`mr-*`) from day one so Persian/RTL support (Content Studio's audience is Persian-speaking; the platform's is not yet confirmed to be Persian-only — flagged as an open question below) doesn't require retrofitting the whole component set.

## Open question (flag, not a blocker)

Whether `apps/web`'s primary audience/locale is Persian-first (mirroring Content Studio) or multi-locale from day one is not decided. Tailwind's logical-properties setup is cheap RTL insurance either way, so this doesn't block foundation work, but full i18n routing (`next-intl` or the built-in App Router i18n) is deliberately not set up yet — flagged here rather than guessed.

## Environment/config access

`apps/web` reads only `NEXT_PUBLIC_*`-prefixed variables client-side (Next.js convention); server-side code (route handlers, Server Components) may read the full `packages/config` schema. No secret ever gets a `NEXT_PUBLIC_` prefix — see `secrets-config-management.md`.

## Follow-up work (not this milestone)

- Design system / component library decisions (out of scope — no product UI yet).
- Auth-gated layout for `(app)` once `apps/api` has real authentication.
