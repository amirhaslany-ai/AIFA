# 01 — Project Overview

**Prepared:** 2026-07-12. This entire package describes the repository at commit `81a7297` on branch `main`, in the state it exists on disk right now. Nothing in this package is aspirational; where something is planned but not built, it is marked **NOT IMPLEMENTED**.

## What this project is

`Platform/` is the AIFA aggregator platform — a multi-model AI provider aggregator with its own accounts, wallet/billing, and chat surface. It is a separate workstream from "AIFA Content Studio" (the persona/content-production system governed by `00_System/AIFA_CONSTITUTION.md` at the repository root). That separation is a Locked decision (`00_System/DECISIONS.md` D-020, `docs/adr/0001-platform-separation.md`) — the Constitution does not govern this codebase.

## High-level architecture

- **Monorepo**: pnpm workspaces + Turborepo, two apps (`apps/api`, `apps/web`) and five shared packages (`packages/{types,config,logger,ai-provider-sdk,database}`).
- **Backend** (`apps/api`): NestJS, hexagonal/ports-and-adapters architecture — `domain/` → `application/` (use cases + ports) → `infrastructure/` (adapters) → `interfaces/http/` (controllers/DTOs), with a machine-enforced (ESLint) import-boundary rule between the layers.
- **Frontend** (`apps/web`): Next.js 14 App Router. **This is a placeholder, not a product.** See `03_IMPLEMENTATION_STATUS.md`.
- **Database**: PostgreSQL via Prisma, one schema (`packages/database/prisma/schema.prisma`), 5 migrations, never applied against a live database in any environment this was built in (no Postgres server has ever been available in the sandbox this code was written in — see `10_PRODUCTION_READINESS.md`).
- **AI Provider layer**: a real registry/circuit-breaker/fallback-chain, one real HTTP adapter (`OpenAiCompatibleAdapter`, OpenAI-compatible Chat Completions wire format via `fetch`), no vendor SDK dependency. No real vendor API key has ever been used against it.
- **Domain**: six implemented bounded contexts — Identity, Provider Access, Billing (Wallet + Pricing), Conversation, Usage Tracking, Platform/System (health).

## Folder structure (top level of `Platform/`)

```
Platform/
├── apps/
│   ├── api/            NestJS backend (see 04_CODEBASE_INDEX.md)
│   └── web/             Next.js frontend — placeholder pages only
├── packages/
│   ├── types/            Shared DTOs/interfaces (ChatMessage, SystemHealth, etc.)
│   ├── config/            Zod-validated, fail-fast environment config loader
│   ├── logger/            Pino structured-logging wrapper
│   ├── ai-provider-sdk/   Provider registry, circuit breaker, fallback chain, cost calc
│   └── database/          Prisma schema, migrations, generated-client re-export
├── docs/
│   ├── adr/               15 Architecture Decision Records
│   └── architecture/      ~24 standing architecture/standards documents
├── infra/
│   └── docker/             docker-compose.yml (local dev only — never staging/prod)
├── HANDOVER/               This package
├── 01_FINAL_ARCHITECTURE_AUDIT.md … 05_ARCHITECTURE_FREEZE_DECISION.md
│                           A prior, now-STALE internal audit — see the note below
├── ARCHITECTURE_REVIEW.md, TECHNICAL_DEBT.md, IMPROVEMENT_PLAN.md, PROGRESS_REPORT.md
│                           Also STALE — see the note below
├── eslint.config.mjs      Root flat-config ESLint — hosts the import-boundary rule
├── turbo.json, tsconfig.base.json, pnpm-workspace.yaml, package.json
└── .env.example
```

**Important, explicit inconsistency to flag up front** (per this handover's mandate to list every doc/implementation mismatch): the files `01_FINAL_ARCHITECTURE_AUDIT.md` through `05_ARCHITECTURE_FREEZE_DECISION.md`, plus `ARCHITECTURE_REVIEW.md`, `TECHNICAL_DEBT.md`, `IMPROVEMENT_PLAN.md`, and `PROGRESS_REPORT.md` at the `Platform/` root, all describe the repository **as it existed before Sprint 1** (before Authentication, Wallet, Pricing, Provider Integration, Chat, and Usage Tracking were implemented). They are dated the same day but were written first. They still say things like "no Wallet/Pricing/Auth/AI-provider code" and list `AiProviderConfig`'s missing cost columns as an open item — both now false; those features exist. **Do not trust those files for current implementation status.** This `HANDOVER/` package supersedes them. They are left in place because they are an accurate historical record of an earlier state and the audit reasoning in them (e.g. the scalability/security analysis method) is still valid methodology — only their "current state" claims are stale. See `06_TECHNICAL_DEBT.md` for the full list of what in them is now wrong.

## Technology stack

| Layer | Choice | Version (as pinned in `package.json`) |
|---|---|---|
| Language | TypeScript | ^5.6.0, `strict` mode, `exactOptionalPropertyTypes: true` |
| Backend framework | NestJS | ^10.4.0 |
| Frontend framework | Next.js (App Router) | ^14.2.0, React ^18.3.0 |
| ORM | Prisma | ^5.22.0 |
| Database | PostgreSQL | 16-alpine (docker-compose image; no managed instance ever provisioned) |
| Cache/queue | Redis (ioredis client) | 7-alpine image; only consumer today is the readiness health check — no caching, sessions, or queues use it |
| Password hashing | `@node-rs/argon2` | ^1.8.3 |
| JWT | `jose` (Ed25519) | ^5.9.6 |
| Validation | `class-validator` / `class-transformer` | ^0.14.1 / ^0.5.1 |
| Config validation | `zod` (inside `@aifa/config`) | via `packages/config` |
| Logging | `pino` (via `@aifa/logger`) | structured JSON logs |
| Monorepo tooling | pnpm workspaces + Turborepo | pnpm 9.12.0, turbo ^2.1.0 |
| Test runner | Vitest | ^2.1.0, unit-level only |
| Lint | ESLint 9 (flat config) + typescript-eslint | ^9.11.0 / ^8.8.0 |

## Runtime stack

- `apps/api` is designed as a **long-running Node.js process** (the Prisma client is a module-level singleton — `packages/database/src/index.ts` — which is only correct for a long-running process, not serverless).
- `apps/web` runs as a standard Next.js server (SSR + one API route handler).
- No message queue, no background worker process, no cron/scheduler exists anywhere in the codebase.

## Package manager & build tools

- **pnpm** 9.12.0 (workspace protocol `workspace:*` for internal packages).
- **Turborepo** 2.1 orchestrates `lint`/`typecheck`/`test`/`build` across all 7 workspace projects (5 packages + 2 apps), with a dependency graph (`turbo.json`) ensuring packages build before the apps that consume them.

## Testing stack

- **Vitest** for all unit tests (`*.spec.ts` colocated with source).
- **No coverage tool is configured** (no `vitest.config.ts` in any package sets `coverage`, no `c8`/`istanbul` dependency exists). Test coverage percentage is **unknown** — see `10_PRODUCTION_READINESS.md`.
- **No integration tests against a real database.** Every repository-layer test uses an in-memory fake (`apps/api/src/test-support/*`), not a real Postgres instance (no Testcontainers, no test database was ever available).
- **No end-to-end tests.** No Playwright/Cypress config exists despite `testing-architecture.md` documenting a target E2E strategy.
- **No frontend tests.** `apps/web` has a `vitest.config.ts` but zero `*.spec.ts` files.

## Deployment assumptions

- **No staging or production environment exists or has been decided.** `infra/README.md` explicitly defers this to a founder decision.
- **Local development only**: `infra/docker/docker-compose.yml` runs Postgres + Redis + both apps.
- **Dockerfiles exist for both apps but have never been built.** No Docker daemon has been available in any environment this codebase was developed in. `turbo prune --docker`'s underlying mechanism was validated directly (its file-selection output was inspected), but `docker build` itself has never run. **Treat both Dockerfiles as unverified.**
- **CI workflow exists at the correct location** (`.github/workflows/aifa-platform-ci.yml`, repository root) but **has never executed even once**: the local `main` branch is 8 commits ahead of `origin/main` (verified via `git rev-list`) — nothing has ever been pushed to the GitHub remote (`github.com/amirhaslany-ai/AIFA.git`). GitHub Actions has never scanned this workflow. "CI passes" has only ever been verified by running the equivalent commands (`pnpm turbo run lint typecheck test build`) locally.

## Current implementation status (one-paragraph summary — see `03_IMPLEMENTATION_STATUS.md` for the full table)

Six backend bounded contexts are implemented with real domain logic, real tests, and real HTTP endpoints: **Authentication** (argon2id + Ed25519 JWT), **Wallet** (ledger-based credit/reserve/settle/rollback/debit), **Pricing** (rule pipeline), **Provider Access** (registry/circuit-breaker/fallback-chain + one real HTTP adapter), **Conversation/Chat** (the use case tying all of the above together), and **Usage Tracking**. The frontend (`apps/web`) has **no product surface at all** — three placeholder pages and a health-check proxy route. No feature has ever been exercised against a live database, a live Redis instance, or a real AI vendor. CI has never run on GitHub. Docker has never been built. This is a backend-complete-for-Sprint-1, everything-else-absent state.

## Repository verification

| Metric | Value | How measured |
|---|---:|---|
| Total files tracked by git under `Platform/` | 244 | `git ls-files Platform/ \| wc -l` |
| `.ts` source files (incl. `.spec.ts`, excl. generated `dist/`) | 147 | `git ls-files Platform/ \| grep -c '\.ts$'` |
| `.spec.ts` test files | 28 | `git ls-files Platform/ \| grep -c '\.spec\.ts$'` |
| Markdown files | 55 | `git ls-files Platform/ \| grep -c '\.md$'` |
| ADRs | 15 | `docs/adr/0001` … `0015` |
| Workspace packages | 5 | `packages/{types,config,logger,ai-provider-sdk,database}` |
| Applications | 2 | `apps/{api,web}` |
| Shared libraries | 5 | same as packages (no separate "library" tier exists) |
| Prisma migrations | 5 | `packages/database/prisma/migrations/` |
| Total Vitest test cases (last full run) | 90 in `apps/api` + 14 in `packages/*` (3 ai-provider-sdk suites, config, logger) = **~104** | last `pnpm turbo run test` output |
| Test coverage | **Unknown — no coverage tool configured** | n/a |
| Build status | **PASSING** (27/27 Turborepo tasks) | `pnpm turbo run lint typecheck test build --force`, run immediately before this package was written |
| Lint status | **PASSING** | same run |
| Typecheck status | **PASSING** | same run |
| CI (GitHub Actions) status | **NEVER RUN** — 8 local commits never pushed to `origin/main` | `git rev-list --left-right --count origin/main...main` → `0 8` |
| Docker build status | **NEVER RUN** — no Docker daemon available in any development environment used | `docker --version` fails in this sandbox |

A stray, empty, untracked directory named `webtest` exists at `Platform/webtest` — it is not part of git history, contains nothing, and appears to be a leftover filesystem artifact, not a real part of the project. Harmless; flagged here only for completeness.
