# 04 — Patch List

Every issue from `01_FINAL_ARCHITECTURE_AUDIT.md`, classified, with the concrete fix. Effort is a rough engineer estimate. Nothing here is a redesign.

## P0 — must fix before any implementation begins

| ID | Issue | Fix | Effort |
|---|---|---|---|
| P0-1 | CI workflow at `Platform/.github/workflows/ci.yml` is never discovered by GitHub Actions (only root `.github/workflows/` is scanned). CI does not run. | Move the workflow to repo-root `.github/workflows/aifa-platform-ci.yml`. Keep the `paths: Platform/**` filter and `working-directory: Platform`. Do the same for `pull_request_template.md` and `ISSUE_TEMPLATE/` (root `.github/`), or accept they won't render. Verify by opening a PR and seeing the check run. | 30 min |
| P0-2 | `pnpm-lock.yaml` untracked; `--frozen-lockfile` (CI + both Dockerfiles + `turbo prune`) will fail. | `git add Platform/pnpm-lock.yaml` and commit it. Verify the first real CI run installs from it. | 5 min |

## P1 — fix before large development

| ID | Issue | Fix | Effort |
|---|---|---|---|
| P1-1 | Docs describe a nonexistent `application/ports/auth-guard.port.ts` as "already present," and `AiProviderConfig` as "consumed via ProviderRegistryAdapter" (it is never read). | Either (a) create the `auth-guard.port.ts` interface stub so the doc becomes true, or (b) correct `api-architecture.md` / `api-standards.md` / `adr-0010` to say "to be created." Correct `packages/database/README.md` to state `AiProviderConfig` is **not yet consumed**. Prefer (a) for the port (it's a genuine, cheap seam) and correction for the README. | 1–2 h |
| P1-2 | `CircuitBreaker`/`FallbackChain` are never wired into `apps/api`; `ProviderRegistryAdapter` hardcodes two `StubAdapter`s and consults no config. | Wrap registered adapters in `CircuitBreaker` and expose provider calls through a `FallbackChain` inside `ProviderRegistryAdapter` (even with stubs), so at least one real path exercises the resilience layer. Read the enabled/priority set from `AiProviderConfig` (or explicitly document that config-driven loading is deferred and stop claiming it works). | 3–4 h |
| P1-3 | Readiness ignores DB/Redis; `@nestjs/terminus` installed but unused; docs claim it checks both. | Wire `@nestjs/terminus` with a Prisma health indicator and a Redis ping in `/v1/health/ready`, OR correct the docs to match the hand-rolled check. Wiring is preferred — an orchestration-facing readiness probe that ignores the database is unsafe. | 2–3 h |
| P1-4 | No CORS; two-origin architecture means client-side web→api calls will fail. | `app.enableCors({ origin: <configured allowlist from @aifa/config>, credentials: true })` in `main.ts`. Add the allowlist to the config schema. | 1 h |
| P1-5 | Readiness live-calls every provider's `healthCheck()` on every request → cost/rate-limit amplification with real providers. | Serve readiness from cached health (circuit-breaker state, or a short-TTL cache), not a live fan-out. Refresh health on a background interval, not per-probe. | 2–3 h |

## P2 — improvements (schedule before the system carries real load)

| ID | Issue | Fix | Effort |
|---|---|---|---|
| P2-1 | No global `ValidationPipe`; `class-validator` inert. | `app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))`. | 30 min |
| P2-2 | `apps/web` reads `process.env` directly; depends on `@aifa/config`/`@aifa/logger` but uses neither. | Route web env access through `@aifa/config` (add a web-safe accessor), or drop the unused deps and document that web reads `NEXT_PUBLIC_*` per Next convention. Pick one and make the rule true. | 1 h |
| P2-3 | Prisma never disconnected; no shutdown hooks. | `app.enableShutdownHooks()` + a Nest `OnModuleDestroy` calling `prisma.$disconnect()`, wired when persistence is first used. | 1 h |
| P2-4 | Circuit-breaker half-open admits unlimited concurrent trials. | Add a single-flight gate: in half-open, allow one probe; queue/reject others until it resolves. Update the test to assert the single-probe behavior. | 1–2 h |
| P2-5 | Logger not in DI; successful requests not correlated. | Provide a `LoggerModule` exposing the `@aifa/logger` instance via DI; add a logging interceptor that logs each request with its `requestId`. | 2–3 h |
| P2-6 | Zero integration/e2e tests; CI provisions Postgres/Redis for nothing. | Add one Testcontainers integration test against the first real repository when it lands; until then, either remove the unused CI service containers or leave them with a comment. | tracks feature work |
| P2-7 | Bare `ProviderUnavailableError` → 500 instead of 4xx/503. | Add it to `DomainErrorFilter`'s mapping. | 15 min |

## P3 — optional

| ID | Issue | Fix |
|---|---|---|
| P3-1 | `FallbackChain.id` magic string | Use a reserved/symbol id or exclude the chain from the `ProviderId` space. |
| P3-2 | `SystemHealth` inline type import | Convert to a top-level import. |
| P3-3 | No CI secret-scanning | Add gitleaks (warn-only first) — already `TECHNICAL_DEBT.md` #5. |
| P3-4 | Thin diagram coverage | Container + AI-lifecycle diagrams supplied in `01_FINAL_ARCHITECTURE_AUDIT.md` §6; add a deployment diagram once hosting is chosen. |

## Pre-existing debt already tracked (not re-litigated here)

`TECHNICAL_DEBT.md` already carries: `User`→`Account` rename (#1), unenforced import boundaries (#2, the single highest-value non-P0 item — an ESLint boundary rule), duplicated dotenv loading (#3), `AiProviderConfig` cost columns (#4), secret-scanning (#5). These remain valid; the import-boundary rule (#2) should be done in the same pass as P1-2, since wiring the resilience layer is exactly when a boundary violation could sneak in.

## Suggested order

1. P0-1, P0-2 (make CI real — everything else is unverifiable without it).
2. P1-1, P1-3 (stop the docs from lying; make readiness safe).
3. P1-2 + `TECHNICAL_DEBT.md` #2 (wire resilience, add the boundary lint in the same pass).
4. P1-4, P1-5 (CORS + health caching).
5. P2 batch as development ramps.

Total P0+P1: **~1.5–2 engineer-days.**
