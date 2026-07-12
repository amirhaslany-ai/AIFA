# Improvement Plan

Prioritized actions from `ARCHITECTURE_REVIEW.md`/`TECHNICAL_DEBT.md`. Ordered by (value ÷ cost), not by document order.

## Priority 1 — do before implementing the next bounded context

**Configure the import-boundary ESLint rule** (`TECHNICAL_DEBT.md` #2). This is the highest-leverage item in this whole plan: it's cheap right now (one module exists to verify the rule against) and becomes progressively more valuable — and more annoying to retrofit — with every file added after it. Concretely:
1. Add `eslint-plugin-boundaries` (or hand-write `import/no-restricted-paths` zones) to `eslint.config.mjs`.
2. Encode the rule from `backend-architecture.md`: `domain` imports nothing from the other three layers or Nest; `application` imports `domain` + its own `ports`; `infrastructure` implements `application/ports`; `interfaces` imports `application` only.
3. Encode ADR-0005's rule: no vendor AI SDK import outside `apps/api/src/infrastructure/providers/`.
4. Run it against the existing `HealthModule` slice — it should pass with zero changes, proving the rule matches what's actually there before it starts blocking new code.

## Priority 2 — cheap, asymmetric-payoff, do soon

**Add secret-scanning to CI** (`TECHNICAL_DEBT.md` #5). A gitleaks (or equivalent) step in the CI workflow (repo-root `.github/workflows/aifa-platform-ci.yml`), non-blocking (warn-only) initially to avoid false-positive friction, tightened to blocking once tuned. Low cost, protects against a genuinely expensive mistake.

## Priority 3 — before implementing Identity

**Decide and execute the `User` → `Account` rename, or explicitly reject it** (`TECHNICAL_DEBT.md` #1). This is a founder-input decision (does the platform want an org/team concept eventually), not a unilateral engineering call — raise it, get an answer, then either rename now (cheap) or explicitly log a decision to keep `User` (equally valid, just needs to be a decision, not an oversight).

## Priority 4 — small cleanup, any time

**Extract `loadRootEnv()` into `@aifa/config`** (`TECHNICAL_DEBT.md` #3), replacing the duplicated dotenv-loading logic in `apps/api/src/main.ts` and `apps/web/next.config.mjs`. Good candidate for a first-time contributor's first PR — small, well-scoped, low-risk, touches exactly two call sites.

## Explicitly not prioritized (correctly deferred, revisit only when triggered)

- OpenTelemetry SDK wiring — revisit when there's a deployment target to actually export traces/metrics *to* (no value instrumenting for an audience of zero).
- Staging/production environment — revisit when a hosting/cloud provider decision is made (a founder decision, not an engineering one, per `infra/README.md`).
- Real AI provider adapters, auth implementation, wallet/pricing implementation — explicitly out of scope for the foundation mission; revisit when feature development begins, using the design docs already written (`ai-provider-layer.md`, `security-architecture.md`, `wallet-architecture.md`, `pricing-architecture.md`) as the starting contract.
- Rate limiting, JWT signing key rotation cadence — revisit alongside Identity implementation, not before (no real traffic/tokens to protect yet).

## How to use this document

When picking up work on `Platform/`, start here rather than re-deriving priorities from scratch. When an item is completed, move it to `CHANGELOG`-equivalent history (this repo doesn't have a `Platform/CHANGELOG.md` yet — if one is added, log completions there; until then, a completed item can simply be deleted from this file with a note in the closing PR/commit).
