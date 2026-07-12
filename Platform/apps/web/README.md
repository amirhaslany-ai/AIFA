# apps/web

The AIFA platform frontend — Next.js App Router. See `docs/architecture/frontend-architecture.md` and `docs/adr/0004-frontend-framework.md`.

## Layout

```
src/app/
├── (marketing)/     # public, SEO-indexed pages
├── (app)/            # authenticated product surface (auth boundary lands here later)
├── api/health/       # route handler proxying apps/api's health check
├── layout.tsx
└── globals.css
```

## Running locally

```bash
pnpm --filter web dev
```

Requires `.env` at the `Platform/` root with `NEXT_PUBLIC_API_BASE_URL` pointing at a running `apps/api`.

## Dependencies

`@aifa/types`, `@aifa/config`, `@aifa/logger` (workspace packages) — Next.js, React, Tailwind CSS, `dotenv`.

## Public API (routes)

| Route | Purpose |
|---|---|
| `/` | Marketing placeholder home page |
| `/dashboard` | Authenticated product surface placeholder (no auth gate wired yet) |
| `/api/health` | Route handler proxying `apps/api`'s `/v1/health/ready`, for this deploy's own uptime monitor |

## Example

```bash
$ curl http://localhost:3000/api/health
{"status":"ok","providers":[...],"checkedAt":"..."}
```
