# Git Release Plan

**Scope of this document:** a *recommended* plan, updated after the pre-freeze technical hardening pass. Per this phase's brief: no push, no remote creation, no publish, no new staging. It records the current git state and the recommended path so the founder can execute the freeze deliberately.

## Current git state (verified 2026-07-13)

- Branch: `main`. Remote `origin` = `github.com/amirhaslany-ai/AIFA.git` exists but **`main` is 11 commits ahead of `origin/main` — nothing has ever been pushed.**
- Tags: **none.**
- `.gitignore`: correct and comprehensive (`node_modules/`, `dist/`, `.next/`, `.turbo/`, `out/`, `coverage/`, `*.log`, `.env*` except example, `*.tsbuildinfo`). **No build artifact is tracked** (verified).
- **10 file deletions are staged** (`git rm`, not a new action of this phase — carried over from the immediately-preceding repository-cleanup step, which this mission's own Phase 3 explicitly authorized: "delete obsolete documentation"): the 9 stale pre-Sprint-1 audit docs (`01_FINAL_ARCHITECTURE_AUDIT.md` through `05_ARCHITECTURE_FREEZE_DECISION.md`, `ARCHITECTURE_REVIEW.md`, `TECHNICAL_DEBT.md`, `IMPROVEMENT_PLAN.md`, `PROGRESS_REPORT.md`) and `HANDOVER/HANDOVER.rar` (a redundant binary archive).
- **A large set of unstaged modifications** exists from the pre-freeze hardening pass — real code changes (rate limiting, security headers, graceful shutdown, health-check caching, circuit-breaker fix, ESLint boundary rule, dependency cleanup, Docker non-root user, CI secret-scanning) plus the documentation-consistency fixes that came with them. Full list: `git status` in `Platform/`. None of this has been staged by this phase — that's deliberate, per this phase's "stage nothing" instruction.
- **Four new untracked freeze documents** exist at the `Platform/` root: `ARCHITECTURE_FREEZE.md`, `FINAL_TECHNICAL_DEBT.md`, `POST_FREEZE_BACKLOG.md`, `FOUNDER_NEXT_STEP.md`.
- Three files *outside* `Platform/` remain modified-uncommitted: `00_System/DECISIONS.md`, `CHANGELOG.md`, `TODO.md` — pre-existing Content Studio governance entries (D-020), out of scope for this Platform freeze, deliberately untouched again this pass. `.github/workflows/aifa-platform-ci.yml` is also modified (the new gitleaks job) — this one *is* in scope (CI belongs to Platform even though the file lives at the true repo root for GitHub's benefit) and should be committed alongside the Platform hardening changes.

## Platform commit history to date (clean, conventional — unchanged by this pass)

```
1fd2fb4 docs(review): final pre-review audit pass + manifest dependency-graph fix
41a5ad9 docs: add repository manifest, architecture snapshot, status, and review notes
fe80762 docs(handover): add CTO architecture-review handover package
81a7297 feat(usage): record and expose per-call usage history (Sprint 1, Feature 6)
62c55a9 feat(chat): implement Conversation aggregate and Sprint 1's first cross-context use case
6ada5eb feat(provider-access): real OpenAI-compatible adapter + cost layer (Sprint 1, Feature 4)
b637a00 feat(pricing): implement rule-based pricing engine (Sprint 1, Feature 3)
a1758ef feat(platform): implement Wallet — Sprint 1 feature 2
2ddd0d5 feat(platform): implement Authentication (Identity) — Sprint 1 feature 1
79abc6a fix(platform): patch sprint — close P0/P1 findings from architecture audit
13282ad feat(platform): initial commit of AIFA Platform foundation
```

The history is clean, conventional-commit style, one logical change per commit. **No rebase or history rewrite is recommended** — it is review-ready as-is, and everything below only *adds* commits.

## Recommended commit sequence (for the founder to execute — not done by this pass)

The working tree currently mixes several logically distinct changes. Recommend splitting into 2–3 commits rather than one giant one, matching this project's established one-logical-change-per-commit discipline:

1. **The hardening pass itself** (all code changes — rate limiting, security headers, graceful shutdown, health-check caching, circuit-breaker fix, ESLint database boundary, dependency cleanup, Docker non-root user):
   `git add Platform/apps Platform/packages Platform/eslint.config.mjs Platform/pnpm-lock.yaml Platform/README.md`
   `git commit -m "feat(platform): pre-freeze hardening — rate limiting, security headers, graceful shutdown, boundary enforcement"`
2. **CI + the stale-doc cleanup** (the gitleaks job + the 10 staged deletions + the resulting dangling-reference fixes across docs):
   `git add .github/workflows/aifa-platform-ci.yml Platform/docs Platform/HANDOVER Platform/apps/api/README.md Platform/apps/ai-provider-sdk/README.md Platform/packages/database/README.md Platform/REPOSITORY_MANIFEST.md Platform/REVIEW_NOTES.md`
   (the 10 deletions are already staged; this step adds the rest)
   `git commit -m "docs(platform): remove superseded pre-Sprint-1 audit docs, fix dangling references"`
3. **The freeze documents**:
   `git add Platform/ARCHITECTURE_FREEZE.md Platform/FINAL_TECHNICAL_DEBT.md Platform/POST_FREEZE_BACKLOG.md Platform/FOUNDER_NEXT_STEP.md`
   `git commit -m "docs(platform): architecture freeze v1.0 — final technical debt, backlog, founder next step"`
4. **Commit the Content Studio governance files separately**, under the maintainer-directive process, not as part of a Platform commit (they are a different workstream's concern) — unchanged recommendation from before this pass.

(A single combined commit is also reasonable if the founder prefers fewer, larger commits — the split above is a recommendation for reviewability, not a requirement.)

## Recommended tags

Apply after the founder is satisfied with the review pass and has executed the commit sequence above:

| Tag | Points at | Meaning |
|---|---|---|
| `platform-foundation-v0.1.0` | `13282ad` (retroactively) | The foundation-architecture milestone (pre-Sprint-1). |
| `platform-sprint1-v0.2.0` | `81a7297` | Sprint 1 feature-complete (Auth/Wallet/Pricing/Provider/Chat/Usage), backend only. |
| `platform-architecture-freeze-v1.0.0` | the freeze-documents commit (step 3 above) | **The frozen artifact.** This is `ARCHITECTURE_FREEZE.md`'s "v1.0 — Sprint 1 + Pre-Freeze Hardening." |

Use annotated tags (`git tag -a`) with a message pointing at `ARCHITECTURE_FREEZE.md`. Tag only after the commit sequence above is applied — a tag pointing at an uncommitted working tree state is not meaningful.

## Recommended milestones

| Milestone | Definition of done | Gates on |
|---|---|---|
| **M0 — Architecture Freeze** | Reached with this pass — `ARCHITECTURE_FREEZE.md` exists, the architecture is judged sound to build on. | This review package + hardening pass. |
| **M1 — Verified Foundation** | `POST_FREEZE_BACKLOG.md` Phase 2 closed: real DB run, CI actually executes (first push), Docker actually builds, integration/E2E tests added. | Founder go-ahead to push + provision infra — no other decision needed. |
| **M2 — Transactable Beta** | `POST_FREEZE_BACKLOG.md` Phase 3 closed: funding path, spend cap, a real AI vendor live, a minimal real UI or documented API-only access. | Founder decisions in `HANDOVER/12_OPEN_DECISIONS.md` (pricing, payment, provider, hosting, frontend strategy). |
| **M3 — Scale Hardening** | `POST_FREEZE_BACKLOG.md` Phase 4 closed: Redis-backed rate limiting, connection pooling, OpenTelemetry, RBAC, blocking secret-scan. | M2 + real traffic or a real second replica. |

## Recommended branching strategy

Unchanged from the prior recommendation — still correct after this pass:

- **Now → M1 (still effectively solo):** keep trunk-based `main`. Push `main` to `origin` so CI finally runs (M1's gate) — this is the single highest-leverage git action available, and it's a decision, not engineering work.
- **Once CI runs and a second contributor exists:** short-lived feature branches → PR → required green CI check → squash-merge to `main`. The workflow file already supports this; it has simply never been triggered.
- **At M2/M3 / first real deploy:** introduce a `release`/`production` pointer once a CD pipeline and environment exist.

Do **not** adopt Gitflow at this stage.

## What this pass explicitly did NOT do

- Did not push, tag, create a remote, or publish anything.
- Did not stage any *new* file (the 10 staged deletions predate this phase, from an explicitly-authorized cleanup step earlier in the same session).
- Did not rewrite history.
- Did not touch the three out-of-scope Content Studio governance files.
- Did not commit the hardening pass, the doc-consistency fixes, or the freeze documents — all left for the founder to review and commit per the sequence above.
