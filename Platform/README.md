# AIFA Platform

The AIFA aggregator platform: a multi-model AI product (comparable to OpenRouter/Poe/SYNTX for the Persian market). This folder is a separate workstream from **AIFA Content Studio** (the repository root's `01_Core`–`10_Orchestrator`) — see [`docs/adr/0001-platform-separation.md`](docs/adr/0001-platform-separation.md) and `00_System/DECISIONS.md` D-011/D-020 for why the two live side by side in one repository.

**Status:** the foundation architecture is complete, and Sprint 1 (Authentication, Wallet, Pricing, Provider Access, Conversation/Chat, Usage Tracking) is implemented — six real bounded contexts, tested, wired end-to-end. This has never run against a live database, a live AI vendor, or real traffic — see `CURRENT_IMPLEMENTATION_STATUS.md` at this folder's root for the honest, per-subsystem breakdown, and `HANDOVER/` / `FINAL_REVIEW/` for the full architecture-review package.

## Start here

1. [`docs/adr/`](docs/adr) — every architectural decision, in order, with rationale and alternatives considered. Read before changing structure.
2. [`docs/architecture/00-overview.md`](docs/architecture/00-overview.md) — how the pieces fit together.
3. This README's [Repository layout](#repository-layout) and [Naming conventions](#naming-conventions) below.
4. [`CONTRIBUTING.md`](CONTRIBUTING.md) — branch/commit/PR/review process, before opening a PR.
5. **Working on the product portfolio, providers, or pricing?** Start at [`docs/portfolio/README.md`](docs/portfolio/README.md) (the locked multi-modal product portfolio: chat/image/video/avatar/voice/music), [`docs/providers/README.md`](docs/providers/README.md) (per-vendor reference — skeletons pending the provider pricing audit's research phase), and [`docs/economics/README.md`](docs/economics/README.md) / [`docs/pricing/README.md`](docs/pricing/README.md) (cost/credit-engine methodology and machine-readable pricing data). ADR-0016 onward records the architecture decisions behind this tree.

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
│   ├── architecture/      # living architecture documentation
│   ├── portfolio/         # locked product portfolio (chat/image/video/avatar/voice/music) — ADR-0018–0023
│   ├── providers/         # per-vendor reference docs — skeletons pending the pricing audit's research phase
│   ├── economics/         # cost/credit-engine/margin methodology (requirements, not final numbers)
│   └── pricing/           # machine-readable pricing datasets (CSV/YAML) — ADR-0025
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
