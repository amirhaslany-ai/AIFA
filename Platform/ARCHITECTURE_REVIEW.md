# Architecture Review

**Date:** 2026-07-12
**Scope:** Internal audit of `Platform/` after the Phase 2 foundation-completion pass. Honest self-assessment, not a sales pitch — see `TECHNICAL_DEBT.md` for the itemized debt this review surfaces and `IMPROVEMENT_PLAN.md` for what to do about it.

## What's genuinely solid

- **The hexagonal dependency rule is real, not aspirational, in the one slice that exists.** `HealthModule` demonstrates controller → use case → port → adapter cleanly, and it's verified to actually run (see `PROGRESS_REPORT.md`) — not just typecheck.
- **The AI provider abstraction (ADR-0005) is the strongest piece of this foundation.** Registry, fallback chain, and circuit breaker are real, unit-tested logic, not stubs — only the vendor adapters are stubbed, which is exactly the right thing to stub per the mission's scope.
- **The ledger-based Wallet design (ADR-0008) and rule-pipeline Pricing design (ADR-0009)** correctly separate three concerns (cost, price, ledger mechanics) that are commonly conflated in ad hoc billing implementations — this separation will pay for itself the first time a pricing rule needs to change without touching money-movement code.
- **Every non-trivial decision has a citable ADR** with alternatives considered, not just a decision — this was a deliberate, now largely satisfied goal of Phase 2.

## Architecture smells found

1. **`User` vs. `Account` naming mismatch.** The Prisma model is `User`; `ddd-tactical-design.md` and `database-standards.md` both recommend `Account` as the domain concept name (an account can later mean org/team, not just an individual). This is a real smell — two documents disagreeing with the actual schema — left unresolved deliberately (renaming a table that's not yet used by any real code is cheap now, expensive once Identity is implemented against the current name). See `TECHNICAL_DEBT.md` item 1.
2. **The import-boundary rule (no vendor SDK outside `infrastructure/providers/`, no framework import in `domain/`) is documented but not machine-enforced.** Every foundation document says "this is the rule" — none of them can currently *prove* it, since no ESLint boundary rule exists. This is the single highest-leverage piece of missing tooling: as soon as a second bounded context is implemented, an accidental violation becomes possible and currently only code review would catch it.
3. **`AiProviderConfig` currently has no cost-related columns**, even though ADR-0007's cost layer design assumes they'll exist (`costPerInputTokenMicros` etc.). This is intentional (documented: "not added since no code reads them yet") but means the schema and the design docs are already slightly out of sync with each other by design — worth a second look if that gap grows.
4. **Two different dotenv-loading implementations** (`apps/api/src/main.ts` and `apps/web/next.config.mjs`) solve the same problem (load the monorepo-root `.env`) with near-identical but not shared code. A `packages/config` helper (`loadRootEnv()`) would remove the duplication — not done during Phase 1 because the bug was found and fixed under time pressure; worth consolidating now that it's understood. See `IMPROVEMENT_PLAN.md`.

## Tight coupling check

- No cross-bounded-context coupling exists yet because only one context (`Platform/System`) is implemented — this check is genuinely inconclusive until Identity/Provider Access/Conversation have real code. Flagging this as a check to *re-run*, not a check that passed.
- `apps/web` depends on `@aifa/config`/`@aifa/logger` but doesn't yet use them anywhere in actual route code (`next.config.mjs`'s dotenv loading is the only touchpoint) — not a smell yet, but worth confirming these are still the right dependencies once `apps/web` has real server-side logic.

## Missing abstractions (intentional gaps, not oversights)

- No `RetryPolicy` implementation (ADR-0007 designs it, doesn't build it) — correctly deferred, since no real adapter exists yet to retry against.
- No `PermissionPort` implementation (`api-standards.md`'s authorization design) — correctly deferred, no role model exists yet to check against.

## Future scalability concerns (flagged, not fixed — no premature optimization)

- `packages/database`'s Prisma singleton assumes a long-running process (`PROGRESS_REPORT.md` already flagged this) — revisit only if a serverless deployment target is chosen.
- No connection pooling (PgBouncer or equivalent) — irrelevant at zero real traffic; revisit when `infra/README.md`'s staging/production gap is resolved and real load exists.
- Redis is provisioned (docker-compose) but has exactly one designed consumer so far (the future response cache in `ai-provider-layer.md`) — not a concern, just noting it's currently infrastructure-ahead-of-usage, which is normal at foundation stage.

## Over-engineering check

- Nothing found. The foundation consistently defers real implementation (auth, billing, real providers) rather than building speculative versions — the opposite failure mode from over-engineering, and the one this review actively watched for given the temptation to "fill in" a design document with code.

## Under-engineering check

- The one place this review flags as under-engineered *relative to what's documented*: the import-boundary rule (smell #2 above). Every other gap found is a deliberately-scoped deferral with a paper trail, not a shortcut.

## Verdict

The foundation is coherent and, where implemented, verified working — not just written. The main real risk is smell #2 (unenforced import boundaries) becoming a compounding problem as more bounded contexts are added without the lint rule ever getting built. See `IMPROVEMENT_PLAN.md` for the recommended next action.
