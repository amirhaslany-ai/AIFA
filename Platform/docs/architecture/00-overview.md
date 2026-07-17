# Architecture Overview

**Status:** Foundation architecture complete; Sprint 1 (Authentication, Wallet, Pricing, Provider Access, Conversation/Chat, Usage Tracking) implemented on top of it. See `CURRENT_IMPLEMENTATION_STATUS.md` at the repo root of `Platform/` for the honest, per-subsystem breakdown of what's built vs. deferred.

## System context

```
                     ┌───────────────────────────┐
                     │        apps/web            │
                     │  Next.js (App Router)      │
                     │  (marketing) + (app) groups│
                     └──────────────┬────────────┘
                                    │ REST (OpenAPI, /v1)
                                    ▼
                     ┌───────────────────────────┐
                     │        apps/api            │
                     │  NestJS — Hexagonal        │
                     │  interfaces → application  │
                     │  → domain ← infrastructure │
                     └───┬───────────┬───────────┘
                         │           │
             ┌───────────┘           └───────────────┐
             ▼                                        ▼
  ┌─────────────────────┐                 ┌──────────────────────────┐
  │ packages/database     │                 │ packages/ai-provider-sdk  │
  │ Prisma + PostgreSQL   │                 │ registry + circuit        │
  └─────────────────────┘                 │ breaker + fallback chain; │
                                            │ apps/api/infrastructure/   │
                                            │ providers/ holds the one   │
                                            │ real adapter (OpenAI-      │
                                            │ compatible HTTP), never   │
                                            │ live-verified against a   │
                                            │ real vendor               │
                                            └──────────────────────────┘
```

Shared, cross-cutting packages (`config`, `logger`, `types`) are consumed by both `apps/api` and `apps/web` and are not shown as separate boxes above — see `package-boundaries.md`.

## Guiding principles (mission-mandated, see repo root `CLAUDE.md`)

Clean Architecture, DDD, SOLID, Hexagonal Architecture, low coupling / high cohesion, testability, security-by-default. Concretely in this repo:

- **Dependency rule:** dependencies point inward. `domain/` never imports `application/`, `infrastructure/`, or a framework. `application/` defines ports (interfaces); `infrastructure/` implements them. `interfaces/` (HTTP controllers etc.) call `application/` use cases only.
- **No hardcoded providers:** anything vendor-specific (AI model providers today; potentially payment/SMS/email providers later) is isolated behind a port in `application/` and an adapter in `infrastructure/`, resolved via `packages/config` at runtime — never a compile-time import of a vendor SDK in application code.
- **Small, cohesive packages over one large shared lib:** each `packages/*` folder has one stated responsibility (see `package-boundaries.md`) — the same architectural value the Content Studio docs enforce for content files (D-002) applies here to code.

## Documents in this folder

| Doc | Covers |
|---|---|
| `backend-architecture.md` | `apps/api` internal layering, module structure |
| `frontend-architecture.md` | `apps/web` routing, rendering strategy, data flow |
| `database-architecture.md` | Schema ownership, migrations, connection pooling |
| `database-standards.md` | ER diagram, naming/migration/index/backup standards, Prisma conventions |
| `api-architecture.md` | REST conventions, versioning, error shape, auth boundary (interface only) |
| `api-standards.md` | Endpoint naming, pagination/filtering/sorting, auth/authz flow design, OpenAPI strategy |
| `domain-boundaries.md` | Bounded contexts and what each owns |
| `ddd-tactical-design.md` | Tactical DDD patterns (aggregates, entities, value objects, repositories) per context |
| `package-boundaries.md` | What each `packages/*` folder is and isn't for |
| `ai-provider-layer.md` | How the provider abstraction is used from `apps/api` (detail beyond ADR-0005), plus design-only extensions (capability matrix, streaming, retry, cost layer) |
| `capability-model-provider.md` | The Capability → Model Family → Variant → Provider → Regional Endpoint routing chain (ADR-0016) that the multi-modal portfolio (`../portfolio/`) is expressed against — design-only, extends `ai-provider-layer.md` beyond chat |
| `smart-routing.md`, `cost-routing.md`, `privacy-routing.md`, `regional-routing.md`, `fallback-routing.md` | The Smart Router and its four routing engines (ADR-0024) — design/direction only, no implementation |
| `wallet-architecture.md` | Implemented (Sprint 1): ledger-based wallet, credit/reservation/settlement/rollback/debit flows |
| `pricing-architecture.md` | Implemented (Sprint 1): base-markup + floor rule pipeline; campaigns/plan tiers still design-only |
| `security-architecture.md` | JWT/session strategy, key rotation, rate limiting, encryption, PII, threat model |
| `coding-standards.md` | Lint rules, import boundaries, TS conventions |
| `naming-conventions.md` | File/package/branch naming rules |
| `testing-architecture.md` | Unit/integration/e2e strategy and tooling |
| `logging-strategy.md` | Structured logging conventions |
| `monitoring-observability.md` | Metrics/tracing strategy (design only — not deployed) |
| `secrets-config-management.md` | How secrets and environment config are handled |
| `ci-cd-pipeline.md` | What CI runs today and what CD deliberately defers |

## What is explicitly deferred (by scope, not forgotten)

Authentication, Wallet, Pricing (base rules), Provider Access, Conversation/Chat, and Usage Tracking are implemented (Sprint 1) — see `CURRENT_IMPLEMENTATION_STATUS.md`. Still deferred: a real product frontend (`apps/web` is a placeholder), campaign/discount pricing and per-plan tiers, a real payment/funding path, streaming and capability-aware provider routing, and any staging/production deployment. Each has an architectural seam already in place (an interface, a module boundary, or a documented extension point) so implementation can start without redesigning this foundation — none of it has been exercised against a live database, a live AI vendor, or real traffic yet.
