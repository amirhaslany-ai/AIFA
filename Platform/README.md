# AIFA Platform

The AIFA aggregator platform: a multi-model AI product (comparable to OpenRouter/Poe/SYNTX for the Persian market). This folder is a separate workstream from **AIFA Content Studio** (the repository root's `01_Core`–`10_Orchestrator`) — see [`docs/adr/0001-platform-separation.md`](docs/adr/0001-platform-separation.md) and `00_System/DECISIONS.md` D-011/D-020 for why the two live side by side in one repository.

**Scope of this milestone:** foundation architecture only. No business logic (auth, wallet, pricing, real AI provider implementations) is built yet — this is the structure those systems will be built into. See `PROGRESS_REPORT.md` for what exists today versus what's deliberately deferred.

## Start here

1. [`docs/adr/`](docs/adr) — every architectural decision, in order, with rationale and alternatives considered. Read before changing structure.
2. [`docs/architecture/00-overview.md`](docs/architecture/00-overview.md) — how the pieces fit together.
3. This README's [Repository layout](#repository-layout) and [Naming conventions](#naming-conventions) below.
4. [`CONTRIBUTING.md`](CONTRIBUTING.md) — branch/commit/PR/review process, before opening a PR.

## Repository layout

```
Platform/
├── apps/
│   ├── api/            # NestJS backend (hexagonal architecture) — ADR-0003
│   └── web/             # Next.js frontend (App Router) — ADR-0004
├── packages/
│   ├── config/          # typed environment/config loader, shared by apps
│   ├── logger/           # structured logging wrapper (pino) — shared contract
│   ├── types/            # shared DTOs/domain types with no runtime logic
│   ├── ai-provider-sdk/  # provider-agnostic AI abstraction — ADR-0005
│   └── database/         # Prisma schema + generated client — architecture only
├── infra/
│   └── docker/           # local dev docker-compose + per-app Dockerfiles
├── docs/
│   ├── adr/               # architectural decision records
│   └── architecture/      # living architecture documentation
└── CONTRIBUTING.md        # branch/commit/PR/review process
```

**CI/GitHub config note:** the CI workflow and PR/issue templates live at the true repository root — `.github/workflows/aifa-platform-ci.yml`, `.github/pull_request_template.md`, `.github/ISSUE_TEMPLATE/` — not under `Platform/`. GitHub Actions only discovers workflows at the repo root, even though this repo's actual root is shared with AIFA Content Studio; the workflow is scoped to this folder via `paths: ["Platform/**"]`, not by physical location.

## Naming conventions

- **Packages:** npm-scoped as `@aifa/<name>` (e.g. `@aifa/logger`), folder name matches the unscoped part.
- **Files:** `kebab-case.ts` for all source files; one exported concept per file where reasonable (a class, a use case, a controller).
- **NestJS layers** (`apps/api/src/*`): `*.entity.ts` (domain), `*.use-case.ts` (application), `*.repository.ts` / `*.adapter.ts` (infrastructure), `*.controller.ts` / `*.resolver.ts` (interfaces). See `docs/architecture/backend-architecture.md`.
- **ADRs:** `NNNN-kebab-case-title.md`, sequential, never renumbered or deleted — superseded ADRs stay in place with a `Status: Superseded by ADR-XXXX` line.
- **Branches/commits:** conventional commits (`feat:`, `fix:`, `docs:`, `chore:`) recommended for this folder; not shared with the Content Studio's commit conventions.

## Coding standards (summary — full detail in `docs/architecture/coding-standards.md`)

- TypeScript strict mode everywhere (`tsconfig.base.json`); no `any` without an inline comment explaining why.
- Dependency direction is inward: `interfaces` → `application` → `domain`, and `infrastructure` → `application`'s ports. Nothing in `domain` imports a framework.
- No vendor AI SDK may be imported outside `apps/api/src/infrastructure/providers/` — see ADR-0005.
- Every package/app ships its own `README.md` stating its responsibility in the first paragraph.

## Local development

```bash
pnpm install
cp .env.example .env      # fill in local values
pnpm turbo run dev
```

`infra/docker/docker-compose.yml` brings up Postgres and Redis for local development — see `infra/README.md`.

## Governance note

This folder follows its own engineering delivery cadence (ADRs + CI gates), distinct from the repository root's `MAINTAINER_DIRECTIVE.md` process. It still respects the repository-wide non-negotiables: `AIFA_CONSTITUTION.md` and `System/Shima_Persona.md` are never modified from here, and any decision that would affect Content Studio's scope (D-011) must be logged in `00_System/DECISIONS.md`, not decided silently inside this folder.
