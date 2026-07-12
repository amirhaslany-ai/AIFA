# 02 — Production Blockers

Every blocker between the current state and serving real production traffic. Classification:

- **P0** — the system cannot run in production at all, or would cause loss/harm on day one.
- **P1** — must be fixed before real users/money, but the system can technically boot without it.
- **P2** — must be fixed before scaling or before it becomes an incident; not launch-blocking for a controlled beta.
- **P3** — should be fixed, low urgency, no near-term harm.

Effort estimates assume an engineer who has read this review package.

## P0 — Cannot go to production

| ID | Blocker | Evidence | Why P0 | Suggested fix | Effort |
|---|---|---|---|---|---|
| P0-1 | Persistence layer never run against a real database. | All 5 `prisma-*.repository.ts` have zero tests; migrations never `deploy`ed; no Postgres ever available. | Correctness of every money-handling and idempotency path is unproven against the real engine that enforces the constraints they depend on. | Provision Postgres, `prisma migrate deploy`, run every flow end-to-end incl. concurrent writes to the ledger/message/usage unique constraints. | 0.5–1 d |
| P0-2 | No way for a real user to fund a wallet. | `CreditWalletUseCase` has no HTTP route and no non-test caller (`FINAL_REVIEW/01` D3). | Chat's positive-balance gate can never pass for a real account → the product's core loop is non-functional end-to-end. Requires a founder decision on payment strategy first (`HANDOVER/12`). | Decide payment path (gateway webhook vs. admin credit endpoint), then build it. | Depends on decision: 1 d (admin endpoint) to 3–5 d (gateway) |
| P0-3 | No rate limiting on any endpoint. | No `@nestjs/throttler`/equivalent in `apps/api/package.json`; no throttle guard in source. | `/v1/auth/login` is an open brute-force target; `/v1/chat` is an unbounded cost/spend target once a real vendor key exists. | Add per-route throttling (strict on auth), tune to expected traffic. | 0.5–1 d |
| P0-4 | Ephemeral JWT signing keys boot silently. | `JwtKeyProvider` generates a per-process keypair with only a warning if `AUTH_JWT_*_PEM` unset. | A production instance that forgets the keys "works," then invalidates all sessions on every restart — a silent, recurring mass-logout. | Fail-fast (refuse to boot) when `NODE_ENV=production` and keys unset. | <0.5 d |

## P1 — Before real users / real money

| ID | Blocker | Evidence | Suggested fix | Effort |
|---|---|---|---|---|
| P1-1 | CI has never executed. | Branch 10 commits ahead of `origin/main`, nothing pushed. | Push / open a PR; observe a real green run before trusting any "verified" claim. | Minutes (gated on a founder decision to push) |
| P1-2 | Docker images never built. | No daemon ever available; `docker build` never run. | Build both images, run `docker-compose up`, hit over HTTP, fix what surfaces. | 0.5 d (+contingency) |
| P1-3 | No per-call / per-account spend cap. | Chat debits real cost after the fact with no ceiling (ADR-0014). | Founder decides the policy; add a config-driven cap + pre-call rejection path. | <1 d after decision |
| P1-4 | Swagger UI unauthenticated & ungated. | `SwaggerModule.setup('v1/docs', …)` in `main.ts`, no guard, no env gate. | Gate behind auth or disable when `NODE_ENV=production`. | <0.5 d |
| P1-5 | No security headers. | No `helmet`/equivalent installed or configured. | Add `helmet` with a reviewed CSP/HSTS/etc. policy. | <0.5 d |
| P1-6 | Zero integration/E2E tests. | No testcontainers/supertest/Nest-DI tests (grep-verified). | Add Testcontainers repo tests + one full register→credit→chat→usage E2E. | 2–4 d |

## P2 — Before scaling / before it becomes an incident

| ID | Blocker | Evidence | Suggested fix | Effort |
|---|---|---|---|---|
| P2-1 | Readiness DB/Redis check is uncached. | `DependencyHealthAdapter.checkAll()` issues live `SELECT 1` + Redis `ping()` every probe; sibling provider check caches 5s (`FINAL_REVIEW/01` C1). | Add a short-TTL cache mirroring the provider-health pattern. | <0.5 d |
| P2-2 | `AiProviderConfig` requires a restart to take effect. | `onModuleInit()` reads it once; no refresh (`FINAL_REVIEW/01` A1). | Add periodic/triggered re-read. | 1–2 d |
| P2-3 | Prisma never disconnected; no shutdown hooks. | No `app.enableShutdownHooks()`; no `OnModuleDestroy` on the Prisma client (Redis indicator does have one). | Add shutdown hooks + `$disconnect()`. | <0.5 d |
| P2-4 | Logging not in DI; no request-level correlation log. | Only `DomainErrorFilter` holds a logger; no success-path interceptor. | Provide a logger module + a logging interceptor keyed on `requestId`. | 1 d |
| P2-5 | Dockerfiles run as root. | No `USER` directive in either Dockerfile. | Add a non-root `USER`. | <0.5 d |
| P2-6 | No secret-scanning / dependency-vuln scanning in CI. | No gitleaks step; no Dependabot/Renovate config. | Add gitleaks (warn-first) + Dependabot. | <0.5 d |
| P2-7 | No backup/restore or connection-pooling strategy. | Nothing in `infra/`; Prisma singleton assumes one long-running process. | Decide managed-DB + pooling (PgBouncer/Accelerate) with the hosting decision. | Gated on hosting decision |

## P3 — Low urgency

| ID | Blocker | Evidence | Fix |
|---|---|---|---|
| P3-1 | `@aifa/ai-provider-sdk` declares unused `@aifa/logger` dep. | grep: not imported in `src/`. | Remove the dependency or use it. |
| P3-2 | `apps/web` declares unused `@aifa/config`/`@aifa/logger`. | grep: not imported in `apps/web/src/`. | Remove or use. |
| P3-3 | Duplicated `.env` loading in two entrypoints. | `main.ts` + `next.config.mjs` hand-roll it. | Extract `loadRootEnv()` into `@aifa/config`. |
| P3-4 | `@aifa/database` import boundary not ESLint-enforced. | No rule in `eslint.config.mjs` for it (`FINAL_REVIEW/01` C2). | Add an `import/no-restricted-paths` rule. |
| P3-5 | `CircuitBreaker` half-open admits unlimited concurrent trials. | `circuit-breaker.ts` gates only on `state === 'open'`. | Single-flight the half-open probe. |
| P3-6 | No pagination on `GET /v1/chat/conversations/:id`. | Returns full message history. | Add limit/cursor if conversations can grow large. |
| P3-7 | `HANDOVER/HANDOVER.rar` — a redundant binary duplicate of the handover markdown committed into the source tree. | Committed in `fe80762`; user-created. | Remove from git (excluded from the clean review package; not deleted from history here — see `GIT_RELEASE_PLAN.md`). |

## Summary counts

- **P0: 4** — none are "the code is wrong"; all are "unverified against reality" (DB, payment path, rate limiting, key handling).
- **P1: 6**, **P2: 7**, **P3: 7**.

The shape of this list is the most important takeaway: the blockers are overwhelmingly about **verification, hardening, and missing operational pieces**, not about defective business logic. The implemented code is sound where it exists; it has simply never met the real world.
