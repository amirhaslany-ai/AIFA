# Repository Manifest

Generated 2026-07-12, against commit `fe80762` on `main`. Every claim below was verified against the actual configuration files, not assumed.

## Complete directory tree

```
Platform/
├── .env.example
├── .editorconfig, .gitignore, .nvmrc
├── eslint.config.mjs
├── package.json, pnpm-lock.yaml, pnpm-workspace.yaml, turbo.json
├── tsconfig.base.json
├── README.md, CONTRIBUTING.md
├── REPOSITORY_MANIFEST.md          this file
├── ARCHITECTURE_SNAPSHOT.md
├── CURRENT_IMPLEMENTATION_STATUS.md
├── REVIEW_NOTES.md
├── HANDOVER/                        14-document CTO handover package (prior deliverable)
├── 01_FINAL_ARCHITECTURE_AUDIT.md … 05_ARCHITECTURE_FREEZE_DECISION.md   STALE — see HANDOVER/06
├── ARCHITECTURE_REVIEW.md, TECHNICAL_DEBT.md, IMPROVEMENT_PLAN.md, PROGRESS_REPORT.md   STALE — see HANDOVER/06
├── apps/
│   ├── api/           NestJS backend — hexagonal architecture, 6 bounded contexts
│   └── web/            Next.js frontend — placeholder pages only
├── packages/
│   ├── types/          Shared DTOs/interfaces
│   ├── config/          Zod-validated env config loader
│   ├── logger/           Pino structured-logging wrapper
│   ├── ai-provider-sdk/  Provider registry, circuit breaker, fallback chain, cost calc
│   └── database/         Prisma schema, migrations, generated-client re-export
├── docs/
│   ├── adr/               15 Architecture Decision Records
│   └── architecture/       ~24 standing architecture/standards documents
├── infra/
│   └── docker/             docker-compose.yml (local dev only)
└── webtest/                 stray, empty, untracked directory — not part of the project
```

`.github/` (workflows, issue templates, PR template) lives at the **true repository root**, one level above `Platform/`, not inside it — GitHub Actions only scans `.github/workflows/` at the repo root, which is why it lives there rather than under `Platform/`.

## Explanation of every top-level folder

| Folder | Purpose |
|---|---|
| `apps/` | The two deployable applications. |
| `packages/` | Five shared, internally-versioned libraries consumed by one or both apps. |
| `docs/` | ADRs and standing architecture documentation — the design contract the code is built against. |
| `infra/` | Local-development infrastructure definition (docker-compose). No staging/production infra exists. |
| `HANDOVER/` | A 14-document handover package prepared for external architecture review (prior deliverable, still current). |
| Root-level numbered/named `.md` audit files | A pre-Sprint-1 internal audit — now stale, superseded by `HANDOVER/`. Left in place for historical record. |

## Explanation of every package

| Package | Purpose | Real logic or pure config? |
|---|---|---|
| `@aifa/types` | Shared TypeScript interfaces (`ChatMessage`, `ChatRequest`, `ChatResult`, `ProviderHealth`, `SystemHealth`, `DependencyHealth`) consumed across the monorepo. | Pure type definitions, no runtime logic, no tests (correctly — nothing to test). |
| `@aifa/config` | `loadConfig()` — parses and validates `process.env` via a zod schema, throws with every violation listed on first failure. | Real logic, tested (6 tests). |
| `@aifa/logger` | `createLogger({ service, logLevel })` — thin wrapper around `pino` producing structured JSON logs. | Real logic, tested (3 tests). |
| `@aifa/ai-provider-sdk` | `AiProvider` interface, `ProviderRegistry`, `CircuitBreaker` (failure-threshold + cooldown), `FallbackChain` (priority-ordered failover), `calculateCostMinorUnits` (pure cost function), `StubAdapter`. | Real logic, tested (11 tests across 3 spec files). No vendor SDK dependency. |
| `@aifa/database` | Prisma schema (single source of truth for the DB shape), 5 migrations, a singleton `PrismaClient` re-export, `isUniqueConstraintViolation()` helper. | Real schema/config; no business logic (that lives in `apps/api`). |

## Explanation of every app

| App | Purpose | Framework | Real product surface? |
|---|---|---|---|
| `apps/api` | The backend — Identity, Wallet, Pricing, Provider Access, Conversation/Chat, Usage Tracking. Hexagonal layering (`domain/application/infrastructure/interfaces`). | NestJS 10 | Yes — 12 real, tested HTTP endpoints. |
| `apps/web` | The frontend. | Next.js 14 (App Router) | No — three static placeholder pages plus a health-check proxy route. No auth/chat/wallet/usage UI exists. |

## Dependency graph

```
@aifa/types  ◄───────────────┐
     ▲                        │
     │                        │
@aifa/config  ◄──────┐         │
     ▲                │         │
     │                │         │
@aifa/logger  ◄───┐    │         │
     ▲             │    │         │
     │             │    │         │
@aifa/database ────┘    │         │
     ▲                   │         │
     │                   │         │
@aifa/ai-provider-sdk ───┴─────────┤
     ▲                              │
     │                              │
   apps/api  ◄──── depends on all five packages above
     ▲
     │ (HTTP only — no code-level dependency)
   apps/web  ◄──── depends on @aifa/types, @aifa/config, @aifa/logger only (NOT @aifa/database or @aifa/ai-provider-sdk)
```

No package depends on another package that depends back on it (verified: `turbo prune` succeeds cleanly for both apps, which requires an acyclic graph). `apps/web` does not depend on `@aifa/database` or `@aifa/ai-provider-sdk` — it has no direct database or AI-provider access, by design (all data access goes through `apps/api`'s HTTP API, though no such calls are actually implemented yet — see `CURRENT_IMPLEMENTATION_STATUS.md`).

## Build order

Determined by `turbo.json`'s `dependsOn: ["^build"]` (build every upstream workspace dependency first):

1. `@aifa/types` (no internal deps)
2. `@aifa/config`, `@aifa/logger` (depend only on `@aifa/types`, build in parallel)
3. `@aifa/database` (depends on `@aifa/types`)
4. `@aifa/ai-provider-sdk` (depends on `@aifa/types`)
5. `apps/api` (depends on all five packages above)
6. `apps/web` (depends on `@aifa/types`, `@aifa/config`, `@aifa/logger` only)

`apps/api` and `apps/web` can build in parallel once step 4 completes, since neither depends on the other.

## Startup order

For local development (`infra/docker/docker-compose.yml`):

1. `postgres` (healthcheck: `pg_isready`)
2. `redis` (healthcheck: `redis-cli ping`)
3. `api` — waits for both `postgres` and `redis` to report healthy (`depends_on: condition: service_healthy`), then boots. `apps/api`'s own boot sequence: load `.env` → `loadConfig()` (fails fast on invalid config) → construct Nest app → wire global filter/pipes/CORS → `ProviderRegistryAdapter.onModuleInit()` (reads `AiProviderConfig`, degrades to bootstrap defaults on DB failure) → listen.
4. `web` — waits only for `api` to be starting (`depends_on: [api]`, no healthcheck condition), not for it to be healthy.

Outside Docker (plain `pnpm dev`), Turborepo's `dev` task depends on `^build`, so every package is built once before either app's dev server starts — this was a real fix made earlier in the project's history (a package pointing at unbuilt `src/` broke at runtime otherwise).

## Runtime dependencies (production `dependencies`, not `devDependencies`)

**`apps/api`:** `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`, `@nestjs/swagger`, `@nestjs/terminus`, `@node-rs/argon2`, `class-transformer`, `class-validator`, `dotenv`, `ioredis`, `jose`, `reflect-metadata`, `rxjs`, plus the five internal `@aifa/*` packages.

**`apps/web`:** `next`, `react`, `react-dom`, `dotenv`, plus `@aifa/types`, `@aifa/config`, `@aifa/logger`.

**`packages/database`:** `@prisma/client`, `@aifa/types`.

## Development dependencies

Root: `turbo`, `typescript`, `prettier`, `typescript-eslint`, `@eslint/js`, `eslint`.
`apps/api`: `@nestjs/cli`, `@nestjs/testing`, `@types/express`, `@types/node`, `typescript`, `vitest`.
`apps/web`: `@types/node`, `@types/react`, `@types/react-dom`, `autoprefixer`, `postcss`, `tailwindcss`, `typescript`, `vitest`.
`packages/database`: `prisma` (CLI).

## Deployment dependencies

- Node.js `>=20.11.0` (root `package.json` `engines`), pinned to `20.11-slim` in both Dockerfiles.
- pnpm `9.12.0` (`packageManager` field, `corepack enable` in Dockerfiles).
- A reachable PostgreSQL 16-compatible database (`DATABASE_URL`).
- A reachable Redis 7-compatible instance (`REDIS_URL`) — currently used only for the readiness health check.
- **No deployment target has ever been used** — no staging/production environment exists; both Dockerfiles have never been built (no Docker daemon available in any environment this project has been developed in).

## All environment variables

| Variable | Required? | Default | Purpose |
|---|---|---|---|
| `NODE_ENV` | No | `development` | `development` / `test` / `production` |
| `API_PORT` | No | `3001` | `apps/api` listen port |
| `API_BASE_URL` | No | `http://localhost:3001` | Self-referential base URL (Swagger, etc.) |
| `CORS_ALLOWED_ORIGINS` | No | `http://localhost:3000` | Comma-separated CORS allowlist |
| `WEB_PORT` | No | `3000` | `apps/web` listen port |
| `NEXT_PUBLIC_API_BASE_URL` | No | `http://localhost:3001` | Client-visible API base URL |
| `AUTH_JWT_PRIVATE_KEY_PEM` | No (but see risk) | unset → ephemeral keypair generated at boot | Ed25519 private key, PKCS8 PEM |
| `AUTH_JWT_PUBLIC_KEY_PEM` | No (but see risk) | unset → ephemeral keypair generated at boot | Ed25519 public key, SPKI PEM |
| `AUTH_ACCESS_TOKEN_TTL_SECONDS` | No | `900` (15 min) | Access-token lifetime |
| `PRICING_BASE_MARKUP_BASIS_POINTS` | No | `13000` (1.30x) | Pricing markup multiplier |
| `PRICING_MINIMUM_PRICE_MINOR_UNITS` | No | `0` | Pricing floor |
| `DATABASE_URL` | **Yes** | none — boot fails without it | PostgreSQL connection string |
| `REDIS_URL` | **Yes** | none — boot fails without it | Redis connection string |
| `LOG_LEVEL` | No | `info` | pino log level |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | No | unset | Reserved — OpenTelemetry SDK is not actually wired yet (see `ARCHITECTURE_SNAPSHOT.md`) |
| `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GOOGLE_AI_API_KEY` | No | unset | **Not read by the config schema at all** — each `AiProviderConfig` database row names its own env var via `apiKeyEnvVar`; these three are illustrative examples in `.env.example`, not fixed schema keys. |

## Every external service

| Service | Role | Status |
|---|---|---|
| PostgreSQL | Primary datastore, all six bounded contexts | Never run against in any real environment — see `CURRENT_IMPLEMENTATION_STATUS.md` |
| Redis | Health-check ping target only | Provisioned, one consumer, no caching/session/queue use yet |
| An OpenAI-compatible AI vendor endpoint | Real chat completions via `OpenAiCompatibleAdapter` | Never actually called with a real API key in this project's history |
| GitHub (remote: `github.com/amirhaslany-ai/AIFA.git`) | Source hosting, intended CI trigger | 8 local commits never pushed — CI has never executed |

## Every AI provider

Exactly one adapter type exists in code: **`OpenAiCompatibleAdapter`** — speaks the OpenAI Chat Completions HTTP wire format (`POST {baseUrl}/chat/completions`), usable against any vendor that implements that same contract (OpenAI itself, and various OpenAI-compatible gateways/self-hosted servers). No vendor-specific SDK (`openai`, `@anthropic-ai/*`, `@google/generative-ai`, etc.) is a dependency anywhere. Which actual vendor(s) are configured is entirely data-driven via the `AiProviderConfig` database table (`providerId`, `baseUrl`, `model`, `apiKeyEnvVar`, cost rates) — no vendor is hardcoded. Two bootstrap-default stub providers (`stub-primary`, `stub-secondary`, using `StubAdapter` — a deterministic, no-network placeholder) are used automatically if the table has no enabled rows or the database is unreachable at boot.

## Every Docker service

Defined in `infra/docker/docker-compose.yml` (local development only — never used against staging/production because neither exists):

| Service | Image / build | Port | Healthcheck |
|---|---|---|---|
| `postgres` | `postgres:16-alpine` | 5432 | `pg_isready` |
| `redis` | `redis:7-alpine` | 6379 | `redis-cli ping` |
| `api` | built from `apps/api/Dockerfile` | 3001 | `wget --spider http://localhost:3001/v1/health` |
| `web` | built from `apps/web/Dockerfile` | 3000 | none defined |

Neither `api` nor `web`'s Dockerfile has ever actually been built (no Docker daemon has been available in any development environment used).

## Every npm (pnpm) workspace

Matched by `pnpm-workspace.yaml`'s two globs (`apps/*`, `packages/*`) — 7 total workspace packages:

`api`, `web`, `@aifa/types`, `@aifa/config`, `@aifa/logger`, `@aifa/ai-provider-sdk`, `@aifa/database`.

## Every Turbo pipeline

Defined in `turbo.json`:

| Task | `dependsOn` | Cached? | Notes |
|---|---|---|---|
| `build` | `^build` (upstream packages only) | Yes (`dist/**`, `.next/**`) | |
| `dev` | `^build` | No (`cache: false`) | `persistent: true` — long-running dev servers |
| `lint` | `^build` | Yes (default) | |
| `typecheck` | `^build` | Yes (default) | |
| `web#typecheck` (override) | `^build` **and** `build` (this package's own build, not just upstream) | Yes | Fixes a real race: `apps/web`'s `tsconfig.json` includes Next.js's generated `.next/types/**`, so `typecheck` and `build` running concurrently for `web` race on `.next/` unless `typecheck` explicitly waits for `web`'s own `build` too. |
| `test` | `^build` | Yes (`coverage/**` declared, but no coverage tool is actually configured — see `CURRENT_IMPLEMENTATION_STATUS.md`) | |

All four tasks (`lint typecheck test build`) were re-verified green (27/27) immediately before this manifest was generated.
