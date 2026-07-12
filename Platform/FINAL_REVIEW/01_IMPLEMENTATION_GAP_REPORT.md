# 01 — Implementation Gap Report

**Method:** This report was produced by reading source code and configuration, then checking documentation claims against it — not the reverse. Every finding below cites the file(s) that prove it. Commit `41a5ad9`, verified 2026-07-12. Pipeline state at audit time: `pnpm turbo run lint typecheck test build --force` → 27/27 green; 28 spec files, 110 test cases; no `TODO`/`FIXME`/`HACK`/`@ts-ignore`/`eslint-disable` present anywhere in production source.

---

## A. Documented but NOT implemented

| # | Claim (where) | Reality (source) |
|---|---|---|
| A1 | `ai-provider-layer.md`: provider enable/disable and priority reordering is "an operational action, not a deploy." | `ProviderRegistryAdapter.onModuleInit()` reads `AiProviderConfig` exactly once at boot. There is no runtime refresh path anywhere in the class. A config change requires a process restart. **Direct contradiction.** |
| A2 | ADR-0007 & `ai-provider-layer.md`: streaming (`chatStream`), capability matrix (`capabilities`), `RetryPolicy` decorator, Redis response cache. | None exist. `AiProvider` (`packages/ai-provider-sdk/src/ai-provider.ts`) has only `id`, `chat()`, `healthCheck()` — no `capabilities`, no `chatStream`. No `retry`/`RetryPolicy` file exists. No response-cache code exists. Correctly labelled design-only in ADR-0007's own status header, but the prose in `ai-provider-layer.md` reads in places as if these are part of the working layer. |
| A3 | ADR-0011 / `monitoring-observability.md`: OpenTelemetry metrics + traces via OTLP. | Zero OTel code. No `@opentelemetry/*` dependency in any `package.json`. `OTEL_EXPORTER_OTLP_ENDPOINT` is accepted by the config schema and read by nothing. Honestly flagged in the ADR header, but the env var's presence implies wiring that does not exist. |
| A4 | `pricing-architecture.md` / ADR-0009: campaign/discount rules, per-plan multipliers, rule versioning/immutability. | `PricingPipeline` runs exactly two rules (`BaseMarkupRule`, `FloorRule`). No `Campaign` entity, no discount rule, no plan-tier lookup, no rule-version table. Scope-cut is stated in the docs, but a reviewer skimming the pricing doc's "Rule Engine" section will see a richer engine described than exists. |
| A5 | ADR-0010: for a browser client, a Backend-for-Frontend sets an httpOnly cookie. | No BFF, no cookie code anywhere. `apps/web` has no auth code at all. Correctly noted as not-yet-built in the ADR, listed here because it is the security property the original design depended on and it is absent. |
| A6 | `testing-architecture.md`: Testcontainers integration tests "for every repository." | Zero integration tests. No `testcontainers`, no `supertest`, no `@nestjs/testing` `createTestingModule` usage anywhere (verified by grep). Every one of the 110 tests is unit-level against in-memory fakes. |
| A7 | `README`/manifest: "12 endpoints." | There are **11** controller route handlers (`@Get`/`@Post` across 5 controllers) plus the Swagger UI at `/v1/docs`. "12" only holds if the docs UI is counted as an endpoint. Not a false claim, but imprecise — the REST surface is 11. |

## B. Implemented but NOT (or under-) documented

| # | Reality (source) | Documentation status |
|---|---|---|
| B1 | `@aifa/ai-provider-sdk` declares a dependency on `@aifa/logger` in its `package.json` but **never imports it** in `src/` (verified by grep). | Not mentioned anywhere. `REPOSITORY_MANIFEST.md`'s dependency graph omitted this edge entirely (it showed ai-provider-sdk depending only on `@aifa/types`). This is both an undocumented dependency AND a declared-but-unused dependency. The manifest's graph is factually wrong on this edge — corrected in this pass. |
| B2 | `Wallet.debit()` (`domain/wallet.entity.ts`) — a sixth wallet mutation with no blocking precondition, added for Chat. | ADR-0008 (the wallet ADR) still describes the four/five-operation set; only ADR-0014 mentions `debit()`. To understand the wallet's full mutation surface you must read two ADRs plus the entity source. |
| B3 | `Message.sequence` — a dedicated autoincrement column for deterministic ordering distinct from the UUID primary key. | Documented in `database-standards.md` ER notes and a schema comment — adequately covered, noted here only because it is a non-obvious design detail a reviewer should not miss. |
| B4 | `GetWalletBalanceUseCase`, `SettleReservationUseCase`, `RollbackReservationUseCase` have **no colocated `.spec.ts`**. Settle/rollback are exercised indirectly by `wallet-lifecycle.spec.ts`; `GetWalletBalanceUseCase` has no direct or indirect behavioral test at all. | Test docs imply uniform use-case coverage. Coverage is not uniform. |

## C. Architecture drift

| # | Finding |
|---|---|
| C1 | **Health-check caching is inconsistent between two siblings.** `ProviderRegistryAdapter.checkAll()` caches results for 5s; `DependencyHealthAdapter.checkAll()` (DB + Redis) has no cache and issues a live `SELECT 1` + Redis `ping()` on every `/v1/health/ready` call. Same architectural role, opposite caching behavior — drift introduced when the dependency-health check was added after the provider-health cache. |
| C2 | **The `@aifa/database` import boundary is documented but not machine-enforced.** `package-boundaries.md` says only `infrastructure/persistence/*` (and `infrastructure/providers/*` for config reads) may import `@aifa/database`; the ESLint config enforces the domain/application/interfaces layering and the vendor-SDK rule, but has **no rule** restricting `@aifa/database`. The other boundaries are enforced; this one is on the honor system. |
| C3 | **A concrete infrastructure class is exported across module boundaries for DI.** `HealthModule` exports `ProviderRegistryAdapter` (the concrete class, not only a port token) so `ChatModule` can call `getFallbackChain()`. This is a real NestJS DI necessity, but it means one consuming module's wiring depends on a concrete adapter type rather than a narrow port — a small, localized deviation from the otherwise-strict ports-only rule. |

## D. Fake completeness (things that look done but are not verifiable / not reachable)

| # | Finding |
|---|---|
| D1 | **The entire persistence layer has never executed against a real database.** All 5 Prisma repositories (`prisma-*.repository.ts`) have zero tests and have never run a real query — every test substitutes an in-memory fake. Migrations were generated by `prisma migrate diff` (schema-to-schema, no DB) and never applied via `migrate deploy`. "Wallet works," "Chat works" are proven against fakes, not Postgres. |
| D2 | **The one real AI adapter has never called a real vendor.** `OpenAiCompatibleAdapter` is tested only with an injected `fetch` double. No real API key has ever been configured in any environment. Real vendor latency, error shapes, and rate-limit behavior are unverified. |
| D3 | **Money can enter a wallet, but not through any running-system path.** `CreditWalletUseCase` is real and DI-wired but has **no HTTP endpoint** and no non-test caller. In the running system as built, no wallet can be funded — so the Chat balance gate can never pass for a real user today. "Wallet + Chat complete" is true at the code level and non-functional end-to-end. |
| D4 | **Docker has never been built.** Both Dockerfiles contain fixes for real bugs found by inspection, but no `docker build` has ever run (no daemon available). "Dockerfiles exist" ≠ "images build." |
| D5 | **CI has never run.** The workflow is correct and correctly located, but the branch is 10 commits ahead of `origin/main` with nothing ever pushed. Every green result is local-only. |

## E. TODOs still affecting production

**None found.** A full grep of `apps/api/src`, `apps/web/src`, and `packages/*/src` for `TODO`, `FIXME`, `HACK`, `XXX`, `@ts-ignore`, `@ts-nocheck`, and `eslint-disable` returned zero matches in production source. This is a genuine positive: there are no code-level deferral markers hiding unfinished work inside otherwise-shipped files. The unfinished work in this project is absent whole subsystems (documented in `CURRENT_IMPLEMENTATION_STATUS.md`), not half-done code with TODO breadcrumbs.

---

## Corrections applied to previously-generated docs during this pass

- `REPOSITORY_MANIFEST.md` dependency graph corrected to show `@aifa/ai-provider-sdk` → `@aifa/logger` (declared) with a note that the dependency is unused in source (finding B1). No other previously-generated document made a claim this audit found to be false; all other stale-vs-current issues were already disclosed in `HANDOVER/06_TECHNICAL_DEBT.md` and `REVIEW_NOTES.md`.
