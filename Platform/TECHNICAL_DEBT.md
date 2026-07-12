# Technical Debt

Itemized from `ARCHITECTURE_REVIEW.md`. Each item states what it costs to fix now vs. later — the point of writing this down is so "later" is a chosen tradeoff, not a forgotten one.

## 1. `User` model should probably be renamed `Account`

**What:** `packages/database/prisma/schema.prisma`'s `User` model conflicts with `ddd-tactical-design.md`/`database-standards.md`'s recommended domain name `Account`.
**Cost now:** trivial — rename the model, re-run `prisma generate`, no data exists yet, no code reads the model yet.
**Cost later:** a real migration (rename is non-destructive but still needs care), plus updating any code written against `User` in the meantime (the Identity context's implementation, if built against the current name first).
**Recommendation:** rename before implementing Identity, not after. Not done in this pass because it's a naming/product decision (does "account" vs. "user" carry an implication about future org/team support that's worth confirming with the founder first) rather than a pure engineering fix — flagged, not silently changed.

## 2. Import-boundary rules are documented, not enforced

**What:** `coding-standards.md` and ADR-0005 state the rule (no vendor SDK outside `infrastructure/providers/`, no framework import in `domain/`, etc.) but nothing in CI checks it.
**Cost now:** a few hours to configure `eslint-plugin-boundaries` (or `import/no-restricted-paths`) against the existing four-layer structure — the structure itself doesn't need to change, only the lint config needs to be added.
**Cost later:** grows with every new file added to `domain`/`application`/`infrastructure` without the rule — a violation introduced today is invisible until someone manually reviews for it.
**Recommendation:** highest-priority item in `IMPROVEMENT_PLAN.md` — do this before a second bounded context is implemented, while there's still only one module's worth of files to verify the rule against.

## 3. Duplicated `.env` loading logic

**What:** `apps/api/src/main.ts` and `apps/web/next.config.mjs` each hand-roll loading the monorepo-root `.env` via `dotenv` + a relative path from `__dirname`.
**Cost now:** low — extract a `loadRootEnv()` helper into `@aifa/config`, call it from both entrypoints.
**Cost later:** if the folder depth ever changes (e.g. an app moves), both copies need updating in sync; a missed one fails silently (falls back to `process.env` already being populated some other way, or throws a confusing "DATABASE_URL is required" error far from the actual cause).
**Recommendation:** low-urgency but easy — good "first PR" cleanup item.

## 4. `AiProviderConfig` schema doesn't yet match the cost-layer design

**What:** ADR-0007 designs `costPerInputTokenMicros`/`costPerOutputTokenMicros` columns; they don't exist in `schema.prisma` yet.
**Cost now:** N/A — deliberately not added (no code reads them, an unused column is its own smell).
**Cost later:** a normal, expected migration once the cost layer is actually implemented.
**Recommendation:** no action needed now; add the columns in the same PR that implements the cost layer, not before.

## 5. No automated secret-scanning in CI

**What:** `security-architecture.md`'s threat model flags this gap explicitly.
**Cost now:** low — adding a tool like gitleaks to the CI workflow (repo-root `.github/workflows/aifa-platform-ci.yml`) is a small, low-risk addition.
**Cost later:** the risk is a real secret landing in git history, which is expensive (rotation + history-scrubbing) regardless of when it's caught, but earlier is always cheaper than later.
**Recommendation:** worth doing soon since it's cheap and the cost of *not* having it is asymmetric (catches an expensive mistake for a small ongoing CI-time cost) — see `IMPROVEMENT_PLAN.md`.

## 6. Rate limiting, JWT/session, and PII-export flows are design-only

**What:** `security-architecture.md` documents target designs for rate limiting, JWT rotation, and PII handling — none implemented.
**Cost now:** N/A — correctly out of scope (no auth exists yet to rate-limit or issue tokens for).
**Cost later:** normal implementation cost when Identity is built; the design being written now means that cost is "implement the documented design," not "design and implement simultaneously under time pressure."
**Recommendation:** no action needed now; tracked here so it isn't mistaken for an oversight.

## Debt explicitly NOT carried (checked and found not applicable)

- No dead code found (the codebase is small and every file is referenced from somewhere real, verified during Phase 1's build/test pass).
- No circular package dependencies (`package-boundaries.md`'s "packages are leaves" rule holds — verified implicitly by `turbo prune` succeeding cleanly during Phase 1 verification).
