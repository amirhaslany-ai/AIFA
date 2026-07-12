# Progress Report — AIFA Platform Foundation

## Milestone 2 — Foundation Completion (2026-07-12)

**Scope:** complete every remaining architectural artifact from the Phase 2 checklist — design-only for Wallet/Pricing/AI-layer extensions/Security (no business logic), documentation/standards/ADRs otherwise. Continued from Milestone 1's baseline — nothing regenerated or replaced.

**Added this milestone** (128 files total under `Platform/` now, up from 108):
- `docs/architecture/ddd-tactical-design.md` — aggregates/entities/value objects/repositories per bounded context, context mapping.
- `docs/architecture/database-standards.md` — ER diagram (mermaid), naming/migration/index/backup standards, Prisma conventions.
- `docs/architecture/api-standards.md` — endpoint naming, pagination/filtering/sorting, auth/authz flow design, OpenAPI strategy detail.
- `docs/architecture/ai-provider-layer.md` extended — capability matrix, streaming design, retry/timeout strategy, caching, cost layer, provider-onboarding checklist.
- `docs/architecture/wallet-architecture.md` (**design only**) — ledger-based credit/reservation/settlement/rollback flows, accounting principles.
- `docs/architecture/pricing-architecture.md` (**design only**) — rule-pipeline pricing engine, markup/campaign layers, versioning.
- `docs/architecture/security-architecture.md` — JWT/session strategy, key rotation, rate limiting, encryption, PII, headers, threat model.
- `docs/architecture/ci-cd-pipeline.md` extended — release flow, environment promotion, rollback strategy.
- `CONTRIBUTING.md`, `.github/pull_request_template.md`, `.github/ISSUE_TEMPLATE/*` — branch/commit/PR/review process.
- ADR-0007 through ADR-0013 (7 new ADRs: AI provider extensions, wallet ledger pattern, pricing engine pattern, auth token strategy, observability stack, migration expand/contract, DDD tactical patterns) — 13 ADRs total now.
- README completeness pass — every package/app README now has explicit Dependencies + Public API (+ Example) sections, not just a responsibility paragraph.
- `ARCHITECTURE_REVIEW.md`, `TECHNICAL_DEBT.md`, `IMPROVEMENT_PLAN.md` — honest internal audit (see below).

**Verification:** re-ran the full `pnpm turbo run lint typecheck test build` pipeline after this milestone's changes (docs-only, no source touched) — still 27/27 green, confirming nothing broke.

**Key finding from the audit:** the single highest-priority gap is that the hexagonal import-boundary rule (no framework import in `domain/`, no vendor SDK outside `infrastructure/providers/`) is documented in multiple places but not machine-enforced anywhere. `IMPROVEMENT_PLAN.md` prioritizes fixing this *before* a second bounded context is implemented, while there's still only one module's worth of code to verify the rule against.

**Not done (correctly, by scope):** no Wallet/Pricing/Auth/AI-provider code — every artifact above is either documentation or a design-only architecture doc, per this milestone's explicit constraint.

---

## Milestone 1 — Initial Foundation (2026-07-12)

**Scope:** Foundation architecture only (per mission scope) — no business logic.

## Completed work

1. **Governance resolution.** The mission's request to build a full software monorepo conflicted with this repository's Locked decision D-011 (the AIFA aggregator platform is a separate, not-yet-started workstream from AIFA Content Studio). Resolved with the founder: the platform lives at `Platform/`, a sibling folder to `01_Core`–`10_Orchestrator`, never merging into Content Studio's structure. Logged as `00_System/DECISIONS.md` D-020 and `docs/adr/0001-platform-separation.md`.
2. **Six ADRs** covering every major foundation decision: platform separation (0001), monorepo tooling — pnpm + Turborepo (0002), backend framework — NestJS + hexagonal (0003), frontend framework — Next.js App Router (0004), AI provider abstraction — registry/adapter/fallback-chain/circuit-breaker (0005), API style — REST + OpenAPI (0006).
3. **Fourteen architecture documents** (`docs/architecture/`) covering backend, frontend, database, API, domain boundaries, package boundaries, the AI provider layer in usage detail, coding standards, naming conventions, testing, logging, monitoring/observability, secrets/config management, and CI/CD.
4. **A working monorepo skeleton**: pnpm workspaces + Turborepo, shared `tsconfig.base.json`, root tooling config.
5. **Four shared packages**, each with a real README, package.json, and source:
   - `@aifa/types` — shared DTOs.
   - `@aifa/config` — zod-validated, fail-fast environment config loader (with tests).
   - `@aifa/logger` — structured pino wrapper.
   - `@aifa/ai-provider-sdk` — the provider abstraction: `AiProvider` port, `ProviderRegistry`, `FallbackChain`, `CircuitBreaker` (all with real unit tests, not stubs), plus one illustrative `StubAdapter`.
6. **`@aifa/database`** — Prisma schema with two architecture-justified tables (`User`, `AiProviderConfig`), no business-logic tables.
7. **`apps/api`** — NestJS backend, hexagonal layout (`domain/application/infrastructure/interfaces`), with one fully-wired vertical slice (`HealthModule`) demonstrating the pattern end to end: controller → use case → ports → adapters, plus a global request-id middleware and a domain-error-to-HTTP-shape exception filter. Includes unit tests for the use case.
8. **`apps/web`** — Next.js App Router frontend, `(marketing)`/`(app)` route groups (so the future auth boundary has a home), Tailwind configured for RTL-safe logical properties, a health-check route handler proxying `apps/api`.
9. **Infra**: `infra/docker/docker-compose.yml` (Postgres, Redis, both apps, healthchecks), `infra/README.md` documenting the environment ladder (local implemented; CI implemented; staging/production explicitly not implemented, with rationale).
10. **CI**: repo-root `.github/workflows/aifa-platform-ci.yml` (lint → typecheck → test → build, via Turborepo, against ephemeral Postgres/Redis service containers).

**Total: 108 files** under `Platform/` (respecting `.gitignore` — excludes `node_modules/`, `dist/`, `.next/`).

## Verification performed

This was actually installed and run, not just written — "compiles in my head" isn't verification.

- `pnpm install` against the real monorepo (560+ packages resolved), then `pnpm turbo run lint typecheck test build --force` (cache-free) across all 6 packages + 2 apps: **27/27 tasks green** — real ESLint, real `tsc`, real Vitest runs, a real `next build` (produced the actual route manifest: `/`, `/dashboard`, `/api/health`), and a real `nest build`.
- `apps/api` was started for real (`turbo run dev --filter=api`) and hit over HTTP: `GET /v1/health` → `{"status":"ok"}`; `GET /v1/health/ready` → real `ProviderRegistry` output reporting both stub providers healthy; `GET /v1/docs` → 200 (Swagger UI); a request without `X-Request-Id` got one generated and echoed back; a 404 returned the documented error shape (`{"error":{"code":"NOT_FOUND",...,"requestId":...}}`).
- `turbo prune api --docker` was run directly to validate the Dockerfiles' core mechanism (it correctly excluded `@aifa/database` and `web`, confirming `apps/api` doesn't depend on them yet). The Dockerfiles themselves are **not** verified — no Docker daemon was available in this environment; build them yourself before relying on them.

### Bugs this verification pass caught and fixed (would have shipped broken otherwise)

1. **Route collision**: `(marketing)/page.tsx` and `(app)/page.tsx` both resolved to `/` — Next.js route groups don't add a path segment. Moved the app placeholder to `(app)/dashboard/page.tsx`.
2. **`@aifa/config` test bug**: the "missing DATABASE_URL" test asserted the wrong error message — zod's `required_error` wasn't wired for a genuinely-missing (`undefined`) value, only for an empty string. Fixed the schema, not just the test.
3. **`noUncheckedIndexedAccess` TS error** in `FallbackChain.healthCheck()` — array-destructuring a possibly-empty array. Fixed with a justified non-null assertion (constructor guarantees non-empty).
4. **Vitest hard-fails with no test files** — `@aifa/types` (genuinely no runtime logic) and `apps/web` (no product UI yet) needed `passWithNoTests: true`; `@aifa/logger` (has real logic) got an actual test instead of the same escape hatch.
5. **`@aifa/database` typecheck failures**: missing `@types/node`, and the Prisma client had never been generated (needs a `postinstall` hook, now added — also required updating both Dockerfiles to copy `prisma/schema.prisma` before install, or `turbo prune` handles this automatically for apps that actually depend on the package).
6. **No root ESLint config** — `eslint 9` requires a flat `eslint.config.js`/`.mjs`; none existed. Added one; also fixed `apps/web`'s lint script (`next lint` prompts interactively on first run, which hangs in CI — switched to plain `eslint src`).
7. **Real lint findings once lint actually ran**: a `let` that was never reassigned (`prefer-const`), a stale `eslint-disable` comment for a rule that isn't even enabled.
8. **The big one — shared packages were unusable at runtime.** `@aifa/config`, `@aifa/types`, `@aifa/logger`, `@aifa/ai-provider-sdk`, `@aifa/database` all pointed `main`/`types` at raw `src/index.ts` and inherited `module: "ESNext"` from the base tsconfig. That's invisible in typecheck/build (TS resolves source fine) but breaks the moment anything tries to actually `require()` them at runtime — Node's ESM loader rejected the emitted extensionless relative imports. Fixed by having each package compile to CommonJS explicitly (`module: "CommonJS"`, `moduleResolution: "Node10"`, `"type": "commonjs"`) and ship from `dist/`, with `turbo.json`'s `dev` task depending on `^build` so consuming apps always get a built dependency.
9. **Nothing actually loaded `.env`.** Next.js auto-loads `.env` from its own directory, but NestJS doesn't load `.env` files at all, and the shared `.env` lives at the `Platform/` root, not inside `apps/api/` or `apps/web/`. Added explicit `dotenv` loading in `apps/api/src/main.ts` and `apps/web/next.config.mjs`, both resolved relative to `__dirname` so it works identically whether running from source or from a compiled/deployed location.

None of these were hypothetical — each one reproduced with a real error message before the fix and a real passing run after.

## Architecture decisions worth your attention

- **AI provider layer is real, adapters are stubs.** The registry, fallback chain, and circuit breaker are genuine, tested logic — not placeholders. Only the vendor-specific adapters (OpenAI, Anthropic, etc.) are stubbed, per the mission's explicit "do not build AI providers implementation" constraint.
- **REST/OpenAPI over GraphQL/tRPC**, because the platform's stated differentiator is being usable like an API product by third parties (ADR-0006) — first-party convenience alone would have favored tRPC.
- **No Kubernetes, no staging/production environment** yet — deliberately deferred (`infra/README.md`) rather than guessed, since neither traffic assumptions nor a cloud-provider choice exist.

## Assumptions made (flagged, not hidden)

- Tech stack: TypeScript everywhere, NestJS, Next.js, PostgreSQL, Prisma, pnpm/Turborepo, Vitest/Playwright, OpenTelemetry — all chosen and justified in ADRs/architecture docs, none previously decided by the founder. These are reversible (each has an "alternatives considered" section) but represent real engineering judgment calls made in your absence, per the mission's "choose the most reasonable engineering solution, document it, continue" instruction.
- Whether `apps/web`'s primary audience is Persian-first (like Content Studio) or multi-locale is unresolved — flagged inline in `docs/architecture/frontend-architecture.md`, not guessed.

## Remaining work (not started, by design — business logic is out of scope this milestone)

- Real authentication implementation (guard interface exists; no identity provider wired).
- Real AI provider adapters (OpenAI/Anthropic/etc. — interface and registry exist; no vendor SDK calls).
- Wallet/billing/pricing logic and schema (no tables exist).
- Conversation/chat domain (depends on the above two).
- ESLint import-boundary enforcement (the dependency rule is documented, not yet machine-enforced).
- Rate limiting (seam documented in `api-architecture.md`, not implemented).
- Staging/production environment and CD pipeline (depends on a cloud-provider/orchestrator decision not yet made).
- OpenTelemetry SDK wiring (strategy documented in `monitoring-observability.md`; instrumentation code not yet written).

## Technical risks

- **Docker builds are unverified.** No Docker daemon was available in this environment. `turbo prune`'s output was validated directly (see Verification above), which is the mechanism the Dockerfiles depend on, but the actual `docker build` for `apps/api`/`apps/web` has not been run. Run it yourself before relying on it in `infra/docker/docker-compose.yml` or any deployment.
- No import-boundary lint rule yet means the hexagonal dependency rule is currently enforced by convention/code review only — a determined contributor could violate it undetected until it's configured.
- The `AiProviderConfig` table's shape is a guess at what provider-selection configuration needs; it will likely need revision once a real adapter and real routing logic exist.
- Prisma's singleton client pattern (`packages/database/src/index.ts`) assumes `apps/api` stays a long-running process; if a serverless deployment target is chosen later, this needs to change to a per-invocation client or a connection pooler (e.g. PgBouncer/Prisma Accelerate).
- The monorepo-wide `dotenv` loading (`apps/api/src/main.ts`, `apps/web/next.config.mjs`) resolves the root `.env` path via a fixed relative `__dirname` offset. It's verified correct for the current folder depth (`apps/*/src` and `apps/*/dist` are both three levels under `Platform/`) but would need updating if that nesting depth ever changes.

## Next milestone entry point

Whoever picks this up next should start at `Platform/README.md` → `docs/adr/` (in order) → `docs/architecture/00-overview.md`, then decide which bounded context (`docs/architecture/domain-boundaries.md`) to implement first — Identity is the natural next step since Provider Access and Conversation both eventually depend on it.
