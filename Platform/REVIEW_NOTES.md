# Review Notes

Generated 2026-07-12, against commit `fe80762` on `main`. Written for an external Chief Architect who has never seen this project before. Read this after `HANDOVER/14_EXECUTIVE_SUMMARY.md` and before diving into source.

## Things to pay attention to first

1. **This has never run against real infrastructure.** No live Postgres, no live Redis, no live AI vendor, no live CI run, no Docker build, no browser session against a real UI (because there is no real UI). Every "it works" claim in this project's history is local-development-only. Treat every claim of correctness as "proven against a model of the real thing," not "proven against the real thing."
2. **8 commits have never been pushed to GitHub.** `git rev-list --left-right --count origin/main...main` returns `0 8`. CI has literally never executed, despite the workflow file being correct and correctly located.
3. **The repository root contains two generations of self-audit documents** — the stale pre-Sprint-1 set (`01_FINAL_ARCHITECTURE_AUDIT.md` through `05_ARCHITECTURE_FREEZE_DECISION.md`, `ARCHITECTURE_REVIEW.md`, `TECHNICAL_DEBT.md`, `IMPROVEMENT_PLAN.md`, `PROGRESS_REPORT.md`) and the current set (`HANDOVER/`, plus this file and its three siblings). The stale set says things like "no Wallet/Pricing/Auth/AI-provider code exists" — all now false. Don't cite them for current state.

## Known weaknesses

- No rate limiting on any endpoint, including login and chat.
- No security headers (no helmet or equivalent).
- Swagger UI (`/v1/docs`) is unauthenticated and ungated by environment.
- No secret-scanning, no dependency-vulnerability scanning.
- No role/permission model — every authorization decision is "do you own this resource," nothing finer.
- The database health check (`DependencyHealthAdapter`) makes a live, uncached query on every readiness probe — its sibling (provider health) is cached; this one isn't, and nobody has noticed it in production because nothing has ever run in anything resembling production.
- `AiProviderConfig` is read once at application boot; changing it requires a restart, contradicting the architecture's own documentation.
- Prisma is never explicitly disconnected (no shutdown hooks); neither Dockerfile runs as non-root.
- Zero integration tests, zero E2E tests, zero frontend tests, no coverage tool.

## Known shortcuts (deliberate, documented — not hidden, but worth knowing)

- **Chat does not pre-reserve an estimated cost before calling a provider.** It only checks the balance is positive, then debits the real cost afterward. This was a deliberate choice (ADR-0014) to avoid inventing a fake token-count estimate, not an oversight — but it means an account can go meaningfully negative from one expensive call, with no cap.
- **No `DebitWalletUseCase` class exists** — `SendChatMessageUseCase` composes the wallet repository port and `Wallet.debit()` directly, to avoid a wrapper class with exactly one caller. A reasonable call, but it means Wallet's "public API" (the five use cases in `wallet.module.ts`) doesn't fully describe every way the wallet can be mutated — you have to also read `send-chat-message.use-case.ts` to see the sixth path.
- **Chat's idempotency guard rejects a retried `messageId` (409) rather than replaying the original response.** A client that retries a timed-out request will get an error, not the answer it already paid for — it must fetch the conversation separately to see what happened. Deliberate scope cut (full request replay is a materially bigger feature), not a bug.
- **The refresh-token design changed mid-implementation** from the originally-specified httpOnly cookie to a JSON response body, because the API-first product framing (ADR-0006) makes a cookie meaningless to non-browser clients. Documented in ADR-0010, but it means `apps/web` (which has no auth UI yet anyway) will need its own Backend-for-Frontend layer to get cookie-based session security for a real browser client later — that work hasn't started.

## Technical debt (see `HANDOVER/06_TECHNICAL_DEBT.md` for the full ranked list)

The three highest-value items not yet closed: (1) the persistence layer has never touched a real database, (2) no rate limiting exists anywhere, (3) CI has never actually run. Everything else in that document is real but lower-severity.

## Open decisions belonging to the Founder

See `HANDOVER/12_OPEN_DECISIONS.md` for the full list. The ones most likely to change the architecture if decided differently than assumed: **real pricing/markup values, how money actually enters a wallet (payment gateway vs. manual), which AI vendor(s) to actually configure, and the hosting/infrastructure provider.** None of these have been guessed at in code — where a value was needed to make something runnable (e.g. the 1.3x markup default), it's clearly marked as an engineering default, not a business decision.

## Potential redesign candidates

These are not recommendations to redesign — they're places a reviewer might reasonably propose a different approach, flagged so the discussion starts from an informed place:

1. **Chat's debit-after-call model.** If the business needs precise, guaranteed pre-call cost control (e.g. a hard per-request cost ceiling that must never be exceeded), the current design cannot provide that without a token-estimation strategy the codebase deliberately avoided building. This is the single most consequential design decision in the codebase to revisit if the risk tolerance for negative balances turns out to be lower than currently assumed.
2. **`AiProviderConfig`'s boot-only read.** If operational flexibility (disabling a provider mid-incident without a restart) matters before a bigger admin-tooling investment is justified, this is a small, contained fix, not a redesign.
3. **Wallet's mutation use cases having no HTTP surface at all.** This was a deliberate security choice given no payment gateway exists yet — but it means literally nothing can happen with money in a running system today. Whatever the real payment strategy turns out to be, it will likely need at least one new authenticated (probably webhook-driven, not user-driven) endpoint here.
4. **Authorization model.** Fine today; will need real design work (not just an incremental addition) the moment team/org accounts or admin tooling enter scope — retrofitting authorization onto an authorization-less system is harder than building it in.
5. **`apps/web`'s framework choice.** Chosen (ADR-0004) before any real feature existed to build a UI for. Worth a fresh look now that the full, real API surface is known — not because Next.js is wrong, but because the original decision was made with zero information about what the UI would actually need to do.

## Anything that could surprise a reviewer

- **A file named `HANDOVER.rar` exists inside `Platform/HANDOVER/`.** This was not generated by the automated documentation process — it appears to be a manually created archive (by the founder, outside this tool's actions) of the handover folder's contents at some point after the markdown files were written, and it was committed alongside them. It is redundant with the markdown files it presumably contains a copy of. Not a security concern (no secrets are in the handover documents), but a reviewer opening the repo for the first time may reasonably ask why it's there — the honest answer is: an artifact of how this handover package was shared, not a designed part of the project.
- **An empty, untracked directory (`Platform/webtest`) exists on disk** with no git history and no content. Harmless, but similarly likely to prompt a "what is this" question — it isn't anything.
- **The two generations of self-audit documents** (see "Things to pay attention to first," #3) will look, at a glance, like the project contradicts itself about its own completeness. It doesn't — one set is simply older than the other. This is flagged three times across this document set (here, `HANDOVER/06`, `HANDOVER/01`) deliberately, because it's the single most likely thing to cause real confusion for a first-time reviewer.
- **Every ADR claims "Accepted"/"Implemented" status headers that are, on inspection, mostly accurate** — but ADR-0005 and ADR-0007 in particular were updated mid-project as Sprint 1 landed, and a reviewer diffing them against git history will see their "Consequences" sections rewritten partway through, not written once and left alone. This is intentional discipline (keep the ADR true, don't leave it stale), not documentation churn to be suspicious of.
