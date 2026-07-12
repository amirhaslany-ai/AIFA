# Improvement Plan

Prioritized actions from `ARCHITECTURE_REVIEW.md`/`TECHNICAL_DEBT.md`. Ordered by (value ÷ cost), not by document order.

## Done

- ~~Configure the import-boundary ESLint rule~~ — done (`eslint.config.mjs`), verified to both pass on existing code and reject a deliberately-introduced violation.
- ~~`User` → `Account` rename~~ — done as part of implementing Identity.

## Priority 1 — cheap, asymmetric-payoff, do soon

**Add secret-scanning to CI** (`TECHNICAL_DEBT.md` #5). A gitleaks (or equivalent) step in the CI workflow (repo-root `.github/workflows/aifa-platform-ci.yml`), non-blocking (warn-only) initially to avoid false-positive friction, tightened to blocking once tuned. Low cost, protects against a genuinely expensive mistake.

## Priority 2 — small cleanup, any time

**Extract `loadRootEnv()` into `@aifa/config`** (`TECHNICAL_DEBT.md` #3), replacing the duplicated dotenv-loading logic in `apps/api/src/main.ts` and `apps/web/next.config.mjs`. Good candidate for a first-time contributor's first PR — small, well-scoped, low-risk, touches exactly two call sites.

## Explicitly not prioritized (correctly deferred, revisit only when triggered)

- OpenTelemetry SDK wiring — revisit when there's a deployment target to actually export traces/metrics *to* (no value instrumenting for an audience of zero).
- Staging/production environment — revisit when a hosting/cloud provider decision is made (a founder decision, not an engineering one, per `infra/README.md`).
- Real AI provider adapters, wallet/pricing implementation — Sprint 1 features not yet built; use the design docs already written (`ai-provider-layer.md`, `wallet-architecture.md`, `pricing-architecture.md`) as the starting contract.
- Rate limiting, JWT signing key rotation cadence — Identity (auth) is now implemented (register/login/refresh/logout, real argon2id + Ed25519 JWTs), but these two hardening items weren't part of that pass — revisit once there's real traffic/token volume to justify them.

## How to use this document

When picking up work on `Platform/`, start here rather than re-deriving priorities from scratch. When an item is completed, move it to `CHANGELOG`-equivalent history (this repo doesn't have a `Platform/CHANGELOG.md` yet — if one is added, log completions there; until then, a completed item can simply be deleted from this file with a note in the closing PR/commit).
