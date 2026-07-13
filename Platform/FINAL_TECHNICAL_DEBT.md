# Final Technical Debt

Generated 2026-07-13, after the pre-freeze hardening pass. This supersedes `HANDOVER/06_TECHNICAL_DEBT.md` and `FINAL_REVIEW/02_PRODUCTION_BLOCKERS.md` for **current** status — those documents describe the state before this pass; several items they list as open are now closed (see "Closed by this pass" below). Only real, verified, current debt is listed. Nothing theoretical, nothing "might be an issue."

## Closed by the pre-freeze hardening pass (verify against `HANDOVER/06` and `FINAL_REVIEW/02` — no longer true today)

- No rate limiting → now real (`@nestjs/throttler`, global 100/min + 10/min on auth), live-tested to actually return 429.
- No security headers → now real (`helmet`, live-verified present on a real response).
- Ephemeral JWT keys booted silently in any environment → now fails fast when `NODE_ENV=production` and keys are unset.
- Swagger UI unauthenticated in every environment → now only mounted outside `production`.
- Dependency (DB/Redis) health check uncached, inconsistent with the sibling provider-health cache → now cached (5s TTL, matching the existing pattern).
- Prisma never disconnected, no shutdown hooks → now wired (`app.enableShutdownHooks()` + `PrismaLifecycleService`).
- `CircuitBreaker` half-open admitted unlimited concurrent trials → now gated to a single in-flight probe, regression-tested.
- `@aifa/database` import boundary documented but not machine-enforced → now an ESLint rule, verified to reject a real violation.
- `@aifa/ai-provider-sdk` declared an unused `@aifa/logger` dependency → removed.
- `apps/web` declared unused `@aifa/config`/`@aifa/logger` dependencies → removed.
- Neither Dockerfile ran as non-root → both now use the built-in `node` user (unverified by an actual build — no daemon available, see below).
- No secret-scanning in CI → added (`gitleaks`, warn-only for now).
- Two generations of self-audit documents, one stale and misleading → the stale set was deleted; dangling citations to it in production source comments and currently-maintained docs were fixed.
- Root `README.md`, `docs/architecture/00-overview.md`, `packages/ai-provider-sdk/README.md`, `docs/architecture/security-architecture.md`, `docs/architecture/api-architecture.md`, and `packages/database/README.md` all had genuinely stale claims (e.g. "no business logic built yet," "wiring a real vendor SDK is out of scope") independent of the dead links — all corrected to reflect Sprint 1's actual state.

## Still open — environmental (cannot be closed without infrastructure that has never existed here)

1. **Never run against a real database.** No Postgres instance has ever been available in this codebase's development history. All persistence-layer code is verified only against in-memory test doubles.
2. **The one real AI adapter has never called a real vendor.** No API key has ever been configured in any environment used.
3. **CI has never actually executed.** The workflow is correct and located correctly; nothing has ever been pushed to `origin/main` (currently 11 commits ahead, unpushed).
4. **Docker has never been built.** No Docker daemon has been available in any environment used. Both Dockerfiles' non-root-user fix (above) is therefore also unverified by an actual build.

## Still open — requires a founder decision before it can be built

5. **No payment/funding path exists in the running system.** `CreditWalletUseCase` has no HTTP endpoint. Blocked on the payment-strategy decision (`HANDOVER/12_OPEN_DECISIONS.md`).
6. **No per-call or per-account spend cap.** An account can go meaningfully negative from one expensive chat call. Blocked on a founder-set risk tolerance.
7. **No real AI vendor is configured.** Blocked on which vendor(s) to actually use and their real cost rates.
8. **No frontend exists.** `apps/web` is a placeholder. Blocked on deciding the frontend strategy (keep Next.js, or revisit — `REVIEW_NOTES.md`).
9. **No campaign/discount pricing, no plan tiers.** Blocked on the real business/pricing model.

## Still open — pure engineering, no blocker, just not yet done

10. **Rate limiting is in-process, not Redis-backed.** Bypassable by routing around a specific `apps/api` replica once more than one instance runs. Fine at current (single-instance) scale.
11. **`AiProviderConfig` requires a process restart to take effect** — contradicts `ai-provider-layer.md`'s "operational action, not a deploy" framing. A real, scoped fix (add a periodic/triggered refresh to `ProviderRegistryAdapter`), not done in this pass since it's a feature addition, not a hardening fix.
12. **No RBAC/authorization beyond resource ownership.** Fine for a single-tier product; needs real design work before any admin tooling or team/org accounts.
13. **Zero integration tests against real infrastructure, zero E2E tests, zero frontend tests, no coverage tool.** The unit-test layer is genuinely strong; nothing above it exists.
14. **Duplicated `.env`-loading logic** in `apps/api/src/main.ts` and `apps/web/next.config.mjs`. Low-severity, unresolved, matches the pre-existing item in the earlier debt list.
15. **No dependency-vulnerability scanning** (no Dependabot/Renovate config).
16. **Secret-scanning is warn-only**, not yet blocking — tighten once it's run clean for a while (it has never actually run yet either, per item 3).
17. **No CDN/WAF layer, no encryption-at-rest decision** — both deferred to the hosting decision, which hasn't been made.
18. **`docs/architecture/api-architecture.md`'s health/readiness description still refers to `@nestjs/terminus`'s `HealthIndicator` base class usage pattern accurately, but no `HealthCheckService`/`@HealthCheck()` decorator convention is used** — a deliberate choice (documented in `prisma.health-indicator.ts`), not debt, listed here only so a reviewer doesn't mistake the non-standard Terminus usage for an oversight.
19. **A stray, empty, untracked directory (`Platform/webtest`) was removed** during an earlier review pass — noting it stayed removed, not regenerated, as a closed item for completeness.

## Debt explicitly NOT carried (checked during this pass, found not applicable)

- No unused *package-level* dependencies remain (checked every `package.json` against actual imports in `src/`; two real ones found and removed — see "Closed" above). This pass did not re-run an exhaustive file-level dead-code/unused-export scan across all six Sprint 1 modules; the earlier pre-Sprint-1 audit found none at that point, but that check has not been repeated against the current, larger codebase.
- No circular package dependencies (`turbo prune` succeeds cleanly for both apps).
- No `TODO`/`FIXME`/`HACK`/`@ts-ignore`/`eslint-disable` exists anywhere in production source (verified by grep, zero matches, this pass).
