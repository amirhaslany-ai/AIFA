# CLAUDE.md — Repository Entry Point

This file is auto-loaded by Claude Code at the start of every session. It is a **pointer**, not a source of truth — it exists to route any AI model or human contributor to the real governing documents.

**This repository has grown beyond Content Studio alone.** The reading order and "How to operate" process below govern **Content Studio** (`00_System/`–`10_Orchestrator/`, `System/`) specifically. If your task is in **`Platform/`** (the software product), start at `Platform/README.md` instead — it has its own governance (`Platform/docs/adr/`). If your task is business/product/marketing/research/decisions spanning either or both workstreams, start at `AIFA_Brain/README.md`. See the root [`README.md`](README.md) for the full repository map. See `00_System/DECISIONS.md` D-011/D-020/D-021 for why these areas are structured as separate, non-merging workstreams.

**Permanent policy — GitHub is the single source of truth** (`AIFA_Brain/00_Index/KNOWLEDGE_SYNC_POLICY.md`, decision `G-001`, Locked). The local filesystem is never the primary workspace. For every completed task: record the knowledge in the repo (update the right `AIFA_Brain/` doc, cross-link, update `MASTER_INDEX.md`, log decisions in `AIFA_Brain/12_Decisions/`), commit with conventional commits, and **push at every logical milestone** so GitHub stays the latest and complete knowledge base. Never leave important project knowledge only on the local machine.

## Read these first, in order (Content Studio)

1. `00_System/AIFA_CONSTITUTION.md` — top-level governance. Highest authority.
2. `00_System/DECISIONS.md` — every decision already made. Never re-litigate a Locked entry.
3. `00_System/OPEN_QUESTIONS.md` — what's still unresolved. Don't silently re-answer it.
4. `00_System/CLAUDE_MASTER_PROMPT.md` — how to behave while working in this repo (full required reading order is in §1).
5. `00_System/MAINTAINER_DIRECTIVE.md` — how to run a maintenance/audit session.
6. `01_Core/` — Vision, Architecture, Decision_Framework, Quality_Standards.
7. `System/Shima_Persona.md` — persona bible (highest authority alongside the Constitution).
8. `TODO.md` and `CHANGELOG.md` — current work queue and history.

## How to operate

Follow `00_System/MAINTAINER_DIRECTIVE.md` for every session: read → audit → present findings → **stop and wait for founder approval** → implement one approved improvement → update `TODO.md`/`CHANGELOG.md` (and `DECISIONS.md`/`OPEN_QUESTIONS.md` if needed) → commit, push, confirm → stop.

## Non-negotiables

- **GitHub is the single source of truth** (`AIFA_Brain/00_Index/KNOWLEDGE_SYNC_POLICY.md`, `G-001`). Sync knowledge to the repo, commit with conventional commits, and push at every logical milestone. Never leave important knowledge only on the local machine.
- The repository is the source of truth. If this file or the directive conflicts with the Constitution or a Locked decision, the repository wins.
- Persona is **Shima**; brand is **AIFA**.
- Never modify `AIFA_CONSTITUTION.md` or `System/Shima_Persona.md` substance without explicit founder approval.
- Never make architectural changes before completing the audit and getting approval.
