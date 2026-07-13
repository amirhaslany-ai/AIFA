# Architecture Freeze — AIFA Platform

## Architecture Version

**v1.0 — "Sprint 1 + Pre-Freeze Hardening"**

Covers: foundation architecture (monorepo, hexagonal layering, DDD tactical patterns, AI provider abstraction) + Sprint 1 (Authentication, Wallet, Pricing, Provider Access, Conversation/Chat, Usage Tracking) + a pre-freeze technical hardening pass (rate limiting, security headers, graceful shutdown, health-check consistency, circuit-breaker correctness, machine-enforced `@aifa/database` boundary, dependency cleanup, CI secret-scanning, documentation-vs-code consistency).

## Freeze date

2026-07-13.

## Scope of this freeze

This freezes the **architecture** — the layering, the bounded-context boundaries, the tactical patterns, the technology choices, and the six implemented feature slices' internal design. It does **not** freeze:
- Specific business values (pricing markup, rate-limit thresholds, spend caps) — these are engineering defaults awaiting founder decisions (see `HANDOVER/12_OPEN_DECISIONS.md`).
- The frontend, which doesn't exist yet in any real form.
- Anything explicitly listed under Non-goals below.

## Frozen ADR list

All 15 ADRs are frozen as the architecture's decision record. Superseding any of them requires a new ADR, not a silent code change — this is itself ADR-0013's own convention, applied to itself.

| ADR | Title | Frozen status |
|---|---|---|
| 0001 | Platform lives at `Platform/`, separate from Content Studio | Locked (governance-level, not just this freeze) |
| 0002 | pnpm workspaces + Turborepo | Frozen |
| 0003 | NestJS + Hexagonal Architecture (`apps/api`) | Frozen — the load-bearing decision of this entire freeze |
| 0004 | Next.js (App Router) for `apps/web` | Frozen as the current default; explicitly flagged in `REVIEW_NOTES.md` as worth revisiting once real frontend work begins, since it was chosen before any real feature existed to build a UI for |
| 0005 | AI Provider Layer — registry + adapter, no hardcoded provider | Frozen |
| 0006 | REST + OpenAPI as the primary API contract | Frozen |
| 0007 | AI provider layer extensions (capability matrix, streaming, retry, cost) | Frozen for the implemented part (cost layer, real adapter); the unimplemented part (streaming, capabilities, retry policy) remains open design, not yet built |
| 0008 | Wallet ledger pattern | Frozen — read together with ADR-0014 |
| 0009 | Pricing as an ordered rule pipeline | Frozen for base markup + floor; campaign/discount rules remain unbuilt, no ADR amendment needed until a real design exists |
| 0010 | Auth token strategy (short-lived JWT + rotating refresh) | Frozen, including the documented cookie-vs-body transport revision |
| 0011 | OpenTelemetry + structured logging | Frozen strategy; SDK wiring still not implemented |
| 0012 | Expand/contract migrations | Frozen policy; still unexercised by a real destructive migration |
| 0013 | Standard DDD tactical patterns | Frozen |
| 0014 | Chat orchestration — debit-after-call, no pre-call reservation | Frozen — the single most consequential business-risk-bearing technical decision in the freeze; see Business assumptions below |
| 0015 | Usage Tracking as an append-only fact record | Frozen |

## Frozen folder structure

See `REPOSITORY_MANIFEST.md` for the complete, verified directory tree. Summary: `apps/{api,web}`, `packages/{types,config,logger,ai-provider-sdk,database}`, `docs/{adr,architecture}`, `infra/docker`, plus the review-package folders (`HANDOVER/`, `FINAL_REVIEW/`). The hexagonal internal layout of `apps/api/src/{domain,application,infrastructure,interfaces}` is frozen and machine-enforced (`eslint.config.mjs`).

## Frozen dependency graph

See `REPOSITORY_MANIFEST.md`'s "Dependency graph" section for the verified, current graph (corrected during this pass to show the real `@aifa/ai-provider-sdk → @aifa/logger` edge, since removed as unused). No package depends on another package that depends back on it. `apps/web` depends only on `@aifa/types`; `apps/api` depends on all five packages.

## Known limitations

See `FINAL_TECHNICAL_DEBT.md` for the complete, ranked, current list. Headline items: never run against a real database, real Redis, or a real AI vendor; CI has never actually executed (never pushed to the remote); Docker has never actually been built (no daemon in any development environment used); no payment/funding path exists in the running system; no per-call spend cap; rate limiting is in-process, not yet Redis-backed for multi-replica correctness; no RBAC/authorization beyond resource ownership; `apps/web` has no real product surface.

## Known future work

See `POST_FREEZE_BACKLOG.md` for the full, phased backlog.

## Non-goals (explicitly out of scope for this architecture, not oversights)

- **Memory, Knowledge (RAG), Workflow, Agents** — no design exists, not scoped, not hinted at anywhere in the codebase. Any future work here is a new set of bounded contexts, not an extension of an existing one.
- **Content** — belongs to the separate AIFA Content Studio workstream (ADR-0001), never part of this Platform.
- **Multi-region, horizontal database scaling, event bus** — not needed at any traffic level this system has ever seen (none); revisit only when real load demands it.
- **A specific hosting/cloud provider** — deliberately undecided (`infra/README.md`); the architecture doesn't presuppose one.
- **Streaming chat responses, provider capability matrix, retry policy, response caching** — designed in ADR-0007, deliberately not built ahead of a caller that needs them.

## Immutable decisions (do not casually revisit without a new ADR)

1. Hexagonal/ports-and-adapters layering in `apps/api`, machine-enforced.
2. DDD tactical patterns (aggregate roots, value objects, repository-per-aggregate, cross-aggregate references by id only) — consistently applied across all six bounded contexts.
3. Ledger-based, append-only accounting for Wallet — never mutate or delete a `LedgerEntry`.
4. No vendor AI SDK dependency anywhere — vendor adapters speak the vendor's documented HTTP contract directly.
5. REST + OpenAPI as the primary API contract.
6. Integer minor-currency-unit (`bigint`) money representation everywhere — never a float.
7. Config validated once, fail-fast, via `@aifa/config`'s zod schema — including the new production-only fail-fast rule for JWT signing keys.

## Business assumptions baked into the frozen architecture

- **Debit-after-call, not pre-call reservation, for Chat** (ADR-0014). This assumes the business accepts the risk of a negative wallet balance from a single expensive call, in exchange for not having to invent a token-cost-estimation model. If the real risk tolerance is lower than this, ADR-0014 needs a genuine amendment (a redesign), not a patch — flagged here explicitly so it isn't discovered as a surprise later.
- **Single currency per wallet**, no multi-currency conversion logic anywhere.
- **Email + password is sufficient for launch-scale authentication** — no OAuth, no MFA. A reversible assumption, not an architectural constraint.
- **A single global markup + floor pricing rule, no plan tiers or campaigns** — the real business model (pricing, discounts) has not been decided; the pipeline is extensible when it is.

## Technical assumptions baked into the frozen architecture

- **`apps/api` runs as one long-running Node.js process** — the Prisma client singleton pattern assumes this; a serverless deployment target would require revisiting `packages/database/src/index.ts`.
- **A single PostgreSQL instance**, no read replica, no connection pooler configured yet.
- **In-process rate-limit counters** — correct for a single `apps/api` replica; bypassable across multiple replicas until Redis-backed.
- **Node.js ≥20.11**, pnpm 9.12, as pinned in `package.json`/`.nvmrc`/both Dockerfiles.

---

## Final Architecture Freeze Report

### Verification performed before this freeze

`pnpm turbo run lint typecheck test build --force` → **27/27 tasks green**, 117 tests across 29 spec files, immediately before this document was written. Prisma schema structurally valid. No `TODO`/`FIXME`/`@ts-ignore`/`eslint-disable` in production source. The `@aifa/database` ESLint boundary rule was verified to reject a deliberately-introduced violation. Rate limiting was live-tested (11 concurrent requests to a 10/min-limited endpoint → the 11th received `429`). Security headers were live-verified present on a real response. Swagger UI was confirmed reachable and its self-hosted JS assets confirmed loadable under the new `helmet` CSP. Graceful-shutdown DI wiring was confirmed correct by successful boot (a DI resolution failure would have prevented boot entirely); live SIGTERM signal delivery could not be verified through this session's Windows shell environment — a testing-tool limitation of this environment, not a gap in the code, since `app.enableShutdownHooks()` and `OnApplicationShutdown` are standard, well-documented NestJS mechanisms. Docker builds and a real GitHub Actions CI run remain unverified for the same reason they've been unverified throughout this project's history: no Docker daemon has ever been available, and nothing has ever been pushed to the remote.

### Technical Completion Score: **66 / 100**

Not a formula — a judgment call, stated as a number so it's falsifiable. Breakdown of the reasoning:

- **Architecture & design quality (strong, ~85/100 on its own):** real, machine-enforced hexagonal layering; consistent DDD tactical patterns across six genuine bounded contexts; sound money/ledger/pricing separation; a demonstrated discipline of choosing honest simplicity (ADR-0014's debit-after-call) over fabricated completeness.
- **Backend implementation completion (strong, ~80/100):** all six Sprint 1 features are real, tested, and wired end-to-end within the application. The pre-freeze hardening pass closed real, verifiable gaps (rate limiting, security headers, graceful shutdown, a genuine circuit-breaker correctness bug, machine-enforced database boundary).
- **Production verification (weak, ~25/100):** nothing has ever touched a real Postgres, a real Redis, or a real AI vendor. CI has never executed. Docker has never been built. Every "it works" claim in this project's history is local-development-only.
- **Frontend / shippable product (near-zero, ~5/100):** `apps/web` is three placeholder pages. Nobody can use this product today without direct API access.
- **Security posture (moderate, ~60/100, up from ~35 before this pass):** authentication, hashing, token rotation, input validation, CORS, rate limiting, and security headers are all real. RBAC, Redis-backed distributed rate limiting, a real secret-scanning gate (currently warn-only), and dependency-vulnerability scanning remain open.
- **Testing depth (moderate, ~55/100):** strong unit-test discipline with genuine regression guards for real bugs found during development; zero integration tests against real infrastructure, zero E2E tests, zero frontend tests, no coverage measurement.

The blended 66 reflects a genuinely solid, honestly-documented backend foundation that has simply never been exposed to anything outside its own development sandbox, with no product-facing surface built on top of it yet.

### Would I, as CTO, approve this repository?

**I would approve freezing the architecture. I would not approve deploying it to production.**

The architecture itself — the layering, the boundaries, the domain modeling, the money-handling discipline — is sound enough to keep building on without a redesign. That's a real, defensible "freeze and move forward" decision, not a hedge. But this is not a system I would put in front of real users or real money today: the persistence layer has never seen a real database, the one AI adapter has never seen a real vendor, there is no way for a user to fund a wallet, there is no per-call spend cap, and there is no frontend for anyone to use. Every one of those is closeable — most are days, not weeks, of work (see `FINAL_TECHNICAL_DEBT.md` and `POST_FREEZE_BACKLOG.md`) — but none of them are closed yet, and pretending otherwise would be the exact kind of overclaiming this entire review process was built to catch.

**Recommendation: freeze this architecture now, and read `FOUNDER_NEXT_STEP.md` before writing any more code.**
