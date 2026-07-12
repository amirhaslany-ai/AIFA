# 11 — Critical Issues

Every blocker that must be resolved before this system could reasonably serve real production traffic. Effort estimates are rough engineer-days, assuming the person doing the work already knows this codebase (i.e., has read this handover package).

## 1. Persistence layer has never been run against a real database

- **Description:** All Prisma migrations and repository code have only ever been verified against in-memory test doubles and by reading generated SQL. No live Postgres instance has ever existed in any environment this codebase was built in.
- **Risk:** Any of the unique-constraint-based idempotency logic (ledger entries, message ids, usage events), transaction boundaries, or migration ordering could behave differently against a real database than the in-memory fakes predict.
- **Impact:** Could silently double-charge a wallet, lose a message, or fail to start entirely on first real deployment.
- **Suggested fix:** Stand up a real Postgres instance (local Docker or a managed instance), run `prisma migrate deploy`, then run the full application against it — register an account, fund a wallet (directly via the use case, since no HTTP endpoint exists — see Issue 4), send a chat message, and verify the resulting database rows by hand.
- **Estimated effort:** 0.5–1 day, assuming Docker or a Postgres instance is available (which it has never been in this project's history to date).

## 2. No rate limiting

- **Description:** No request-rate limiting exists on any endpoint, including login/register and chat.
- **Risk:** Brute-force credential attacks against `/v1/auth/login`; unbounded cost/spend attacks against `/v1/chat` (each call, once a real vendor key is configured, costs real money and consumes real vendor rate-limit budget).
- **Impact:** Financial loss, vendor account suspension, account-takeover risk.
- **Suggested fix:** Add `@nestjs/throttler` (or equivalent), configure per-route limits (stricter on `/v1/auth/*`), tune thresholds based on real expected traffic.
- **Estimated effort:** 0.5–1 day.

## 3. CI has never actually executed

- **Description:** The workflow file is correct and correctly located, but 8 commits have never been pushed to the GitHub remote.
- **Risk:** Every "verified by CI" claim anywhere in this project's history is, strictly, a claim about local command execution, not an independently-run pipeline.
- **Impact:** No independent confirmation that the build is reproducible outside this specific development environment; a hidden environment-specific assumption could be baked into every "green" result so far.
- **Suggested fix:** Push to `origin/main` (or open a PR) and observe an actual GitHub Actions run complete successfully.
- **Estimated effort:** Trivial (minutes) — the blocker is a decision (should this be pushed yet?), not engineering work.

## 4. No payment/funding path exists for a real user

- **Description:** `CreditWalletUseCase` is real and tested but has no HTTP endpoint. There is currently no way for a real end user, or even an operator using only the running system (not direct code access), to add funds to a wallet.
- **Risk:** The product cannot generate revenue or even be manually tested end-to-end by a non-engineer today.
- **Impact:** Blocks any real usage of the Chat feature by anyone who isn't calling internal code directly.
- **Suggested fix:** Decide the payment strategy (a payment gateway webhook, an admin-only credit endpoint, or both) — this is explicitly a founder decision (see `12_OPEN_DECISIONS.md`), not something to build without that decision first.
- **Estimated effort:** Depends entirely on the payment strategy decision — a webhook integration with a real gateway (e.g. Stripe) is likely 3–5 days once the provider is chosen; an admin-only manual-credit endpoint is under a day but doesn't solve real revenue collection.

## 5. Docker has never been built

- **Description:** No Docker daemon has ever been available in any environment this codebase was developed in.
- **Risk:** The Dockerfiles' documented fixes (missing `tsconfig.base.json`, missing `prisma/schema.prisma` at install time) were found and fixed by reasoning about `turbo prune`'s known output shape, not by observing an actual failed build — there could be another, undiscovered issue that only a real build would surface.
- **Impact:** The only currently-designed path to a running container image is unverified; a first real deployment attempt could fail on infrastructure, not on the application code itself.
- **Suggested fix:** Run `docker build -f apps/api/Dockerfile .` and `docker build -f apps/web/Dockerfile .` from `Platform/`, fix whatever surfaces, then run `docker-compose up` against `infra/docker/docker-compose.yml` and hit the running containers over HTTP.
- **Estimated effort:** 0.5 day if nothing new surfaces; add a contingency day if it does.

## 6. Ephemeral JWT signing keys are a silent footgun

- **Description:** If `AUTH_JWT_PRIVATE_KEY_PEM`/`AUTH_JWT_PUBLIC_KEY_PEM` are unset, the process boots successfully with a freshly-generated keypair and only logs a warning.
- **Risk:** A real deployment where an operator forgets to set these environment variables would boot "successfully" and silently invalidate every session on every restart, with no operator-visible failure beyond a log line easy to miss.
- **Impact:** Confusing, hard-to-diagnose mass logout incidents in production.
- **Suggested fix:** Make this a hard failure (refuse to start) whenever `NODE_ENV=production` and the keys are unset, keeping the current ephemeral-with-warning behavior only for `development`/`test`.
- **Estimated effort:** Under half a day.

## 7. No upper bound on a single chat call's cost

- **Description:** Chat requires only a strictly-positive wallet balance before calling a provider; there is no maximum-cost-per-call guard.
- **Risk:** A single unusually large request (very long context, a provider misconfiguration, a client bug that sends the same huge prompt repeatedly) could push an account deeply negative in one call.
- **Impact:** Direct financial exposure with no current safeguard.
- **Suggested fix:** This requires a founder decision first (what's an acceptable per-call cost ceiling, and what should happen if a completion would exceed it — reject before calling the provider, or only after, accepting the current design's "we always pay for a call that already happened" principle). Once decided, add a config-driven per-call cost cap.
- **Estimated effort:** Under a day once the policy is decided; the policy decision itself may take longer.

## 8. `AiProviderConfig` requires a restart to take effect

- **Description:** Provider configuration (which providers are enabled, in what priority, with what cost rates) is read exactly once at application boot.
- **Risk:** An operator trying to disable a misbehaving or over-budget provider in an incident cannot do so without a full application restart.
- **Impact:** Slower incident response than the architecture's own documentation promises ("an operational action, not a deploy").
- **Suggested fix:** Add a periodic refresh (e.g. re-read on a timer, or on an explicit admin-triggered signal) to `ProviderRegistryAdapter`.
- **Estimated effort:** 1–2 days, including tests for the refresh behavior and its interaction with in-flight requests.

## 9. Zero integration/E2E test coverage

- **Description:** No test in the repository has ever run against a real database, real Redis, or a real HTTP server end-to-end.
- **Risk:** A regression that only manifests under real I/O (a transaction isolation issue, a real Prisma error shape the in-memory fake doesn't reproduce, a real network timeout) would not be caught by the existing test suite.
- **Impact:** Reduced confidence that "27/27 green" means the system actually works end-to-end, versus works against its own idealized model of itself.
- **Suggested fix:** Add Testcontainers-based integration tests for at least the Prisma repositories (as `docs/architecture/testing-architecture.md` already specifies), and at least one true E2E test exercising register → login → credit (internal) → chat → usage-history through real HTTP against a real database.
- **Estimated effort:** 2–4 days for a first meaningful integration-test pass; ongoing after that as new features land.
