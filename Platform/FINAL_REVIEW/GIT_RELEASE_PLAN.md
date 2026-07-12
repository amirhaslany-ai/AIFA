# Git Release Plan

**Scope of this document:** a *recommended* plan. Per the Release Manager brief, this pass does **not** push, does **not** create a remote, does **not** publish, and stages nothing. It records the current git state and the recommended path so the founder can execute the freeze deliberately.

## Current git state (verified)

- Branch: `main`. Remote `origin` = `github.com/amirhaslany-ai/AIFA.git` exists but **`main` is 10 commits ahead of `origin/main` — nothing has ever been pushed.**
- Tags: **none.**
- `.gitignore`: correct and comprehensive (`node_modules/`, `dist/`, `.next/`, `.turbo/`, `out/`, `coverage/`, `*.log`, `.env*` except example, `*.tsbuildinfo`). **No build artifact is tracked** (verified).
- Working tree: clean **within `Platform/`**. Three files *outside* `Platform/` are modified-uncommitted: `00_System/DECISIONS.md`, `CHANGELOG.md`, `TODO.md` — these are Content Studio governance entries recording that the Platform workstream started (D-020). They belong to the founder-governed Content Studio docs (maintainer-directive process), are **out of scope for this Platform freeze**, and were deliberately left untouched. The founder should commit them under the Content Studio process separately.
- New review documents generated this pass (`FINAL_REVIEW/*`, updated `REPOSITORY_MANIFEST.md`) are **untracked/unstaged** by design — see "Recommended commit sequence" below.

## Platform commit history to date (clean, conventional)

```
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

The history is already clean, conventional-commit style, one logical change per commit. **No rebase or history rewrite is recommended** — it is review-ready as-is.

## Recommended commit sequence (for the founder to execute — not done here)

1. **Commit this review pass** as a single docs commit (once the founder has read it):
   `docs(review): final pre-review audit reports + manifest correction`
   Contents: `Platform/FINAL_REVIEW/*`, the corrected `Platform/REPOSITORY_MANIFEST.md`, and this plan. (Deletion of the untracked old zip and empty `webtest/` dir needs no commit — they were never tracked.)
2. **Optionally** remove the redundant binary `Platform/HANDOVER/HANDOVER.rar` from tracking in the same commit:
   `git rm Platform/HANDOVER/HANDOVER.rar` — its content is fully preserved as the sibling markdown files; it only bloats the tree. Left in place by this pass because it is user-created committed content and destructive git surgery was out of scope for an unattended review-prep run.
3. **Commit the Content Studio governance files separately**, under the maintainer-directive process, not as part of a Platform commit (they are a different workstream's concern).

## Recommended tags

Apply after the founder is satisfied with the review pass:

| Tag | Points at | Meaning |
|---|---|---|
| `platform-foundation-v0.1.0` | `13282ad` (retroactively) or a note | The foundation-architecture milestone (pre-Sprint-1). |
| `platform-sprint1-v0.2.0` | `81a7297` | Sprint 1 feature-complete (Auth/Wallet/Pricing/Provider/Chat/Usage), backend only. |
| `platform-architecture-freeze-v0.2.0-review` | the review-pass commit (step 1 above) | **The artifact handed to the external architect.** This is the tag the review is performed against. |

Use annotated tags (`git tag -a`) with a message pointing at `FINAL_REVIEW/CTO_REVIEW_INDEX.md`. Do **not** tag before the external review, unless the founder wants a fixed reference point for the reviewer — in which case tag only `platform-architecture-freeze-v0.2.0-review` and leave the rest until after review feedback.

## Recommended milestones

| Milestone | Definition of done | Gates on |
|---|---|---|
| **M0 — Architecture Freeze (now)** | External architect review complete; freeze/redesign decision made. | This review package. |
| **M1 — Verified Foundation** | P0-1 (real DB), P1-1 (CI actually runs), P1-2 (Docker builds) closed. | Founder go-ahead to push + provision infra. |
| **M2 — Transactable Beta** | P0-2 (funding path), P0-3 (rate limiting), P0-4 (key handling), P1-3 (spend cap) closed; a minimal real UI or documented API-only access. | Founder decisions in `HANDOVER/12` (pricing, payment, provider, hosting). |
| **M3 — Production Hardening** | Remaining P1/P2 (security headers, integration tests, observability, pooling, backups) closed. | M2 + hosting decision. |

## Recommended branching strategy

Current: single `main`, direct commits — appropriate for a solo-founder foundation phase, and it has produced a clean history. Recommended going forward, in order of the team's growth:

- **Now → M1 (still effectively solo):** keep trunk-based `main`. The existing discipline (one logical change per commit, conventional messages, green pipeline before commit) is sufficient. Push `main` to `origin` so CI finally runs (M1's gate).
- **Once CI runs and a second contributor exists:** switch to short-lived feature branches → PR → required green CI check → squash-merge to `main`. Protect `main` (no direct pushes, require the CI check). The workflow file already exists for this; it has simply never been triggered.
- **At M3 / first real deploy:** introduce a `release`/`production` pointer (branch or tag-driven deploy) once a CD pipeline and environment exist — deferred until the hosting decision (`HANDOVER/12`) is made, since the branching model for releases depends on how deploys are triggered.

Do **not** adopt Gitflow (long-lived `develop`/`release`/`hotfix` branches) at this stage — it is overhead disproportionate to a pre-launch, near-solo codebase, and nothing in the current workflow needs it.

## What this pass explicitly did NOT do

- Did not push, tag, create a remote, or publish anything.
- Did not stage or commit any file.
- Did not rewrite history.
- Did not touch the three out-of-scope Content Studio governance files.
- Did not delete `HANDOVER.rar` from git history (only recommended it, and excluded it from the clean review zip).
