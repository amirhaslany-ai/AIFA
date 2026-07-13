# Knowledge Synchronization Policy

| Field | Value |
|---|---|
| **Title** | Knowledge Synchronization Policy |
| **Created** | 2026-07-13 |
| **Updated** | 2026-07-13 |
| **Owner** | Founder (policy); AIFA_Brain maintainers (execution) |
| **Status** | Locked |
| **Version** | 1.0 |
| **Dependencies** | `README.md`, `METADATA_STANDARD.md`, `NAVIGATION.md` |
| **Related Docs** | `../12_Decisions/DECISION_LOG.md` (G-001), `../MASTER_INDEX.md`, `../../CLAUDE.md`, `../../Agents/KNOWLEDGE_ACCESS_RULES.md` |
| **Tags** | `policy, governance, workflow, source-of-truth` |

## Summary

**GitHub is the single source of truth for the entire AIFA project.** The local filesystem is never the primary workspace — it is a working copy. Important project knowledge must never live only on a local machine. GitHub (`github.com/amirhaslany-ai/AIFA`) must always remain the latest and complete knowledge base.

This is a **Locked** founder policy (recorded as `G-001` in `../12_Decisions/DECISION_LOG.md`). It is permanent unless the founder explicitly changes it.

## The policy — what "done" means for every task

A task is not complete until its knowledge is in the repository and pushed. Concretely, for every completed task:

1. **Update the appropriate document inside `AIFA_Brain/`** (or the relevant workstream doc — `Platform/docs/` for Platform-internal, Content Studio's own docs for Content-Studio-internal).
2. **If new knowledge is generated:**
   - store it in the correct folder (see `NAVIGATION.md` for which folder owns what),
   - update `../MASTER_INDEX.md` if the document should be discoverable from the index,
   - update related documents,
   - cross-link everything with relative links (`METADATA_STANDARD.md`'s `Related Docs`/`Dependencies`, plus inline links).
3. **If a business decision is made:** record it in `../12_Decisions/` (the right log per `../12_Decisions/README.md`'s scoping rule — company-level/cross-cutting → `DECISION_LOG.md`, business → `BUSINESS_DECISION_LOG.md`, product → `PRODUCT_DECISION_LOG.md`, company-level architecture → `ARCHITECTURE_DECISION_LOG.md`; Content-Studio-internal → `../../00_System/DECISIONS.md`; Platform-internal → `../../Platform/docs/adr/`).
4. **If research is completed:** store the raw research, the summarized findings, and the conclusions — in `../04_Research/` (or `../05_Competitors/` for competitor-specific research), each using the folder's template.
5. **If competitor analysis is created:** create or update that competitor's profile in `../05_Competitors/`.
6. **If architecture changes:** update the architecture documents (`../../Platform/docs/architecture/` + a `../../Platform/docs/adr/` entry for Platform-internal; `../09_Technology/` or `../12_Decisions/ARCHITECTURE_DECISION_LOG.md` for company-level).
7. **If the roadmap changes:** update `../15_Roadmap/`.
8. **Commit** using meaningful [conventional commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, …), one logical change per commit.
9. **Push to GitHub whenever a logical milestone is finished.** Pushing at milestones is standing, durable authorization under this policy — but commits stay clean: stage files deliberately, never `git add -A`/`git add .` blindly (the root `.gitignore` guards against the obvious artifacts, but explicit staging is still the rule).

## What this policy does NOT override

- **Governance gates still apply.** This policy is about *where knowledge lives and when it's pushed*, not about bypassing approval. Content Studio's `MAINTAINER_DIRECTIVE.md` process (audit → present → **founder approval** → one change), the never-touch list in `../../Agents/KNOWLEDGE_ACCESS_RULES.md`, and the "never modify `AIFA_CONSTITUTION.md`/`Shima_Persona.md` substance without explicit approval" rule are all still in force.
- **Honesty over completeness still applies.** Never fabricate content to make a folder look finished before pushing (`README.md`'s update rules). An honest gap committed and pushed is correct; invented content is not.
- **The workstream boundaries (D-011/D-020/D-021) still apply.** Syncing knowledge means referencing across workstreams, never merging or duplicating them.

## Why

A knowledge base is only trustworthy if it is complete and current in one authoritative place. Before this policy, the repository's single biggest real risk (documented in `../../Platform/FINAL_TECHNICAL_DEBT.md` and the pre-push audit) was that work lived in un-pushed local commits — CI had never run, and knowledge sat on one machine. Making "record it in the repo, commit, and push at the milestone" part of the definition of done for every task keeps GitHub authoritative by construction rather than by periodic catch-up.
