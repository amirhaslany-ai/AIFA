# 05 — Architecture Decisions

All 15 ADRs, in order, with their current implementation status cross-checked against the actual code (not just the ADR's own status header — several headers are accurate, this section verifies them).

## ADR-0001 — Platform lives at `Platform/`, separate from Content Studio

- **Problem:** The aggregator platform (this codebase) needed a home in a repository whose root is governed by a separate, Locked-decision workstream (AIFA Content Studio).
- **Decision:** `Platform/` is a new top-level sibling folder with its own tooling, docs, and ADR log; it never imports or restructures Content Studio's folders.
- **Consequences:** Content Studio's maintainer-directive process governs root docs; `Platform/` uses its own faster-moving cadence.
- **Current status:** **IMPLEMENTED.** True today — `Platform/` is exactly this, and no cross-reference violates the boundary.

## ADR-0002 — pnpm workspaces + Turborepo

- **Problem:** Needed correct dependency ordering, incremental builds, and no duplicated `node_modules` across multiple apps/packages.
- **Decision:** pnpm workspaces + Turborepo; TypeScript everywhere via one shared `tsconfig.base.json`.
- **Consequences:** Every new package must be under `@aifa/` scope and match `pnpm-workspace.yaml`'s glob.
- **Current status:** **IMPLEMENTED.** 5 packages + 2 apps, verified green (27/27 tasks) as of the last pipeline run.

## ADR-0003 — NestJS + Hexagonal/Clean Architecture for `apps/api`

- **Problem:** Needed a backend framework and internal layout that wouldn't block future provider-agnostic routing, auth, and billing.
- **Decision:** NestJS with `domain/application/infrastructure/interfaces` layering; dependency rule enforced by ESLint.
- **Consequences:** Every new capability starts as a use case, not logic inline in a controller.
- **Current status:** **IMPLEMENTED**, and now proven across six real bounded contexts (not just the one `HealthModule` slice the ADR was written against). The dependency rule is machine-enforced (`eslint.config.mjs`), verified to reject a deliberately-introduced violation.

## ADR-0004 — Next.js (App Router) for `apps/web`

- **Problem:** Needed a frontend framework for a marketing site + eventual authenticated product UI, with future RTL support.
- **Decision:** Next.js App Router, Tailwind, Server Components by default.
- **Consequences:** Two route groups (`(marketing)`, `(app)`) from the start.
- **Current status:** **PARTIALLY IMPLEMENTED.** The route-group skeleton exists exactly as decided. **No product UI was ever built on top of it** — see `03_IMPLEMENTATION_STATUS.md`. TanStack Query, mentioned as "the intended choice... not installed yet," is still not installed.

## ADR-0005 — AI Provider Layer: registry + adapter pattern, no hardcoded provider

- **Problem:** The platform's differentiator (multi-model access) requires the application layer to never depend on a specific vendor SDK.
- **Decision:** `packages/ai-provider-sdk` defines `AiProvider`, `ProviderRegistry`, `FallbackChain`, `CircuitBreaker`; vendor adapters live only in `infrastructure/providers/`.
- **Consequences:** No file outside `infrastructure/providers/` may import a vendor SDK — machine-enforced.
- **Current status:** **IMPLEMENTED**, updated during Sprint 1: the ADR's original text said "real provider adapters... explicitly out of scope" — that's now false; `OpenAiCompatibleAdapter` is real (built on `fetch`, not a vendor SDK package, since none was needed to speak the OpenAI-compatible HTTP contract). The ADR file itself was updated to reflect this — verify the "Consequences" section reads the updated version, not a stale copy.

## ADR-0006 — REST + OpenAPI as the primary API contract

- **Problem:** Needed a stable, documentable contract for both `apps/web` and future third-party integrators.
- **Decision:** REST, versioned by URL prefix (`/v1/...`), OpenAPI generated from `@nestjs/swagger` decorators.
- **Consequences:** Every controller method needs Swagger decorators; no deprecation-window policy defined yet for future `/v2/...`.
- **Current status:** **IMPLEMENTED.** All 12 real endpoints are versioned and Swagger-annotated. **Caveat:** `/v1/docs` (the Swagger UI itself) has no auth guard — see `08_SECURITY_REVIEW.md`. The deprecation-policy gap the ADR flagged is still open (no `/v2` has ever been needed).

## ADR-0007 — AI provider layer extensions: capability matrix, streaming, retry, cost

- **Problem:** Phase 2 needed to design (not build) everything a real adapter would eventually need.
- **Decision:** Capability matrix, streaming (`chatStream`), a separate `RetryPolicy` decorator, per-call timeouts, response caching, and a cost-reporting layer — all design-only at the time.
- **Consequences:** Originally: none of it implemented; `AiProviderConfig` would need cost columns added later.
- **Current status:** **PARTIALLY IMPLEMENTED**, updated during Sprint 1. Cost layer (`calculateCostMinorUnits`, `AiProviderConfig.costPerInputTokenMicros`/`costPerOutputTokenMicros`) and a real HTTP adapter are now real. **Still not implemented:** capability matrix, streaming, `RetryPolicy`, response caching — the `AiProvider` interface still has no `capabilities` or `chatStream` field, exactly as the original ADR predicted would remain true until a caller needed them.

## ADR-0008 — Wallet ledger pattern

- **Problem:** Needed a billing model that separates cost, price, and ledger mechanics.
- **Decision:** Append-only `LedgerEntry` (never mutated/deleted), `Wallet.balanceMinorUnits` as a reconcilable cache, five entry types (credit/debit/reservation/reservation_release/rollback), idempotency via `(walletId, referenceId, type)` uniqueness.
- **Consequences:** Settlement can push balance negative if actual cost exceeds a reservation — documented, accepted limitation.
- **Current status:** **IMPLEMENTED.** Real, tested (11 domain tests + a 5-scenario integration-style lifecycle spec covering retry-safety). A sixth ledger operation, `Wallet.debit()` (no prior reservation required), was added during the Chat feature and is now part of this pattern's real vocabulary — the ADR's original four-operation set grew to five plus debit; this isn't documented as an ADR-0008 amendment, only in ADR-0014. A reviewer should treat ADR-0008 + ADR-0014 as the combined current picture of Wallet's real operation set.

## ADR-0009 — Pricing as an ordered rule pipeline

- **Problem:** Needed to turn a raw provider cost into a customer price without conflating cost/price/ledger concerns.
- **Decision:** Ordered pipeline (base markup → campaign/discount rules → floor), every fired rule recorded for audit, rules versioned/immutable.
- **Consequences:** Originally: none of `PricingEngine`/`Campaign`/rule tables existed.
- **Current status:** **PARTIALLY IMPLEMENTED.** `PricingPipeline` is real (`BaseMarkupRule` → `FloorRule`), config-driven multiplier/floor, basis-points integer math with ceiling rounding. **Campaign/discount rules and per-plan multipliers do not exist** — deliberately not invented (no real business requirements exist for them yet). No versioning/immutability mechanism for rule changes exists (there's nothing to version — there's one hardcoded pipeline shape, not a rule table).

## ADR-0010 — Auth token strategy: short-lived JWT + rotating opaque refresh tokens

- **Problem:** Needed a concrete token shape for the already-assumed auth guard seam.
- **Decision:** Ed25519-signed 15-minute access tokens; opaque, hashed, rotating refresh tokens with reuse detection (family revocation).
- **Consequences:** Original design specified httpOnly cookies for refresh tokens.
- **Current status:** **IMPLEMENTED, with a documented deliberate deviation from the original design:** tokens are returned in the JSON response body, not an httpOnly cookie — because ADR-0006 makes this an API-first product, and a cookie is meaningless to non-browser clients. The ADR file itself documents this revision. **Real gap:** since `apps/web` has no auth UI at all (see ADR-0004's current status), the "Backend-for-Frontend sets its own httpOnly cookie" recommendation this ADR makes for the eventual browser client has never been built or even attempted.

## ADR-0011 — OpenTelemetry + structured logging as the observability stack

- **Problem:** A tooling choice (OpenTelemetry) was already assumed in two other docs without its own ADR.
- **Decision:** Pino for structured logs; OpenTelemetry (vendor-neutral) for future metrics/traces, no SaaS vendor hardcoded.
- **Consequences:** Every log call must go through `@aifa/logger`, never `console.log`. OTel SDK instrumentation itself deferred.
- **Current status:** **PARTIALLY IMPLEMENTED.** The logging half is real and the "never `console.log`" rule holds (verified by inspection). The OTel half is **still entirely unimplemented** — no SDK wiring, no spans, no metrics exist anywhere in the codebase, exactly as this ADR's status header ("SDK wiring not yet implemented") already honestly states. This is one ADR whose status header is accurate and did not need updating during Sprint 1.

## ADR-0012 — Expand/contract migrations, no down-migration reliance for rollback

- **Problem:** A migration/rollback discipline was assumed elsewhere without its own ADR.
- **Decision:** Destructive schema changes always ship as an expand step then a later contract step; rollback never depends on a down-migration.
- **Consequences:** A "rename a column" is always two migrations, not one; Prisma doesn't enforce this — code review does.
- **Current status:** **Not yet tested in practice.** All 5 real migrations so far have been purely additive (new tables, new nullable columns) — **no destructive/rename migration has ever been written**, so this ADR's actual discipline has never been exercised. It remains a sound, unviolated policy, but "unviolated because untested" is a materially different claim than "proven to work," and a reviewer should know the difference.

## ADR-0013 — Standard DDD tactical patterns across all bounded contexts

- **Problem:** Without a shared tactical vocabulary, each future bounded context risked inventing its own ad hoc modeling style.
- **Decision:** Entities (identity-based equality), value objects (immutable, value-equal), aggregates (one root, cross-referenced only by id), repositories (one per aggregate root, never per table).
- **Consequences:** Whoever implements each context first should follow `ddd-tactical-design.md`'s sketch or update it, not silently deviate.
- **Current status:** **IMPLEMENTED and consistently followed.** Verified across all six real bounded contexts: `Account`, `Wallet` (owns `LedgerEntry`), `Conversation` (owns `Message`), `UsageEvent` — every one follows the same shape, and every cross-aggregate reference (`Wallet.accountId`, `Conversation.accountId`, `UsageEvent.accountId`/`conversationId`) is a plain id field with no Prisma-level foreign key, exactly as this ADR specifies.

## ADR-0014 — Chat orchestration: debit-after-call, no pre-call reservation

- **Problem:** Chat needed to tie Identity, Provider Access, Pricing, and Wallet together, but Wallet's designed reserve→settle flow (ADR-0008) requires an estimated cost *before* the call — and no honest way exists to estimate LLM token usage ahead of time without guessing.
- **Decision:** Require a strictly-positive wallet balance before calling a provider (a coarse gate, not a sized reservation), then debit the real cost afterward via a new `Wallet.debit()` (no blocking precondition). Client-supplied `messageId` is checked before any provider call or debit, guarding against double-charging on a network retry.
- **Consequences:** An account can go negative from a single expensive call — a documented, accepted limitation, not an oversight. Full request-level idempotent replay (returning the exact prior response on a retried `messageId`) was explicitly scoped out; a retry is rejected (409), not silently replayed.
- **Current status:** **IMPLEMENTED**, and this ADR's own "Consequences" section is the most current statement of Wallet's real behavior — more current than ADR-0008 alone.

## ADR-0015 — Usage Tracking as an append-only fact record, written by Chat

- **Problem:** Every completed exchange's real token/cost/price computation had nowhere durable to live beyond the HTTP response and an ledger amount with no breakdown.
- **Decision:** `UsageEvent`, its own repository (not owned by any other aggregate), recorded once per successful exchange keyed by the same `userMessageId` Chat's idempotency check already guards.
- **Consequences:** No FK to `accounts`/`conversations` (plain fields, matching the established cross-aggregate convention); no separate idempotency check needed for the event write itself.
- **Current status:** **IMPLEMENTED.** `GET /v1/usage` is real, paginated via a simple `limit`+`before` keyset (deliberately not a bigger opaque-cursor scheme).

## Summary table

| ADR | Title | Header says | Actually true today |
|---|---|---|---|
| 0001 | Platform separation | Accepted | Accurate |
| 0002 | Monorepo tooling | Accepted | Accurate |
| 0003 | Backend framework | Accepted | Accurate, now proven across 6 contexts |
| 0004 | Frontend framework | Accepted | Accurate for the skeleton; no product UI exists |
| 0005 | AI provider abstraction | Accepted | Updated during Sprint 1 — file reflects current reality |
| 0006 | API style | Accepted | Accurate |
| 0007 | Provider layer extensions | Partially implemented (header updated) | Accurate — cost+adapter real, streaming/capabilities/retry still not |
| 0008 | Wallet ledger pattern | Accepted | Accurate but incomplete alone — read with ADR-0014 |
| 0009 | Pricing engine pattern | Accepted and implemented | Accurate, campaigns/plans still not built |
| 0010 | Auth token strategy | Accepted and implemented | Accurate, including the documented cookie-vs-body deviation |
| 0011 | Observability stack | Accepted (SDK wiring not yet implemented) | Accurate — one of the few ADRs whose header never needed correction |
| 0012 | Migration expand/contract | Accepted | Policy sound but never yet exercised by a real destructive migration |
| 0013 | DDD tactical patterns | Accepted | Accurate, consistently followed |
| 0014 | Chat orchestration | Accepted and implemented | Accurate |
| 0015 | Usage tracking | Accepted and implemented | Accurate |
