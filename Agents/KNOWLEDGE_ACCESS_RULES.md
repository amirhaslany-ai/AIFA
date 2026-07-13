# Knowledge Access Rules

| Field | Value |
|---|---|
| **Title** | Knowledge Access Rules |
| **Created** | 2026-07-13 |
| **Updated** | 2026-07-13 |
| **Owner** | AIFA_Brain maintainers |
| **Status** | Active |
| **Version** | 1.0 |
| **Dependencies** | `README.md`, `SHARED_MEMORY.md` |
| **Related Docs** | `../00_System/DECISIONS.md` (D-011, D-020, D-021), `../CLAUDE.md`, `../Platform/docs/architecture/security-architecture.md` |
| **Tags** | `agents, access-control, governance` |

## Summary

What a future agent may read, what it may write, and what it must never touch — the same governance boundaries that already apply to any human or AI contributor working in this repository (per `../CLAUDE.md`'s routing and D-011's workstream separation), made explicit for an autonomous agent rather than assumed.

## The governing principle

**An agent gets no more authority than the most restrictive human process governing the area it's touching.** If a human contributor working in Content Studio must follow `00_System/MAINTAINER_DIRECTIVE.md`'s read → audit → present → wait-for-approval process before an architectural change, an agent operating in that same scope follows the identical process — it does not get to skip the approval gate just because it's automated. This is the single rule everything below elaborates.

## Read access

An agent may read anything in the repository relevant to its defined task (per `../Agents/AGENT_STANDARDS.md`'s "Knowledge Base" section) — there is no blanket read restriction, since the whole premise of `AIFA_Brain/` and `SHARED_MEMORY.md` is a shared, not siloed, knowledge base.

## Write access — by scope

| Scope | Who may write, and under what condition |
|---|---|
| **`AIFA_Brain/`, `Agents/`** | An agent may write here directly, following `00_Index/METADATA_STANDARD.md` and `SHARED_MEMORY.md`'s rules — this is the knowledge layer these two folders were explicitly designed for continuous agent updating (D-021). |
| **Content Studio (`00_System/`–`10_Orchestrator/`, `System/`)** | Governed by `00_System/AIFA_CONSTITUTION.md` and `00_System/MAINTAINER_DIRECTIVE.md`. An agent proposing a change here follows the same audit → present → **wait for explicit founder approval** → implement gate a human process follows — an agent must never write directly to `AIFA_CONSTITUTION.md` or `System/Shima_Persona.md` substance without that same explicit approval `../CLAUDE.md` already requires of any contributor. |
| **`Platform/`** | Governed by its own ADR/engineering discipline. An agent proposing a Platform change follows Platform's own established practice (verify before claiming, real tests, honest documentation of what's unverified) — the same standard this entire repository's Platform work has been held to throughout its history. |
| **`00_System/DECISIONS.md`** | Append-only for any contributor, human or agent — new entries only, never edits to settled history (superseding entries instead, exactly as the file's own header states). |
| **`Platform/docs/adr/`** | Same append-only, supersede-don't-edit discipline, per Platform's own ADR convention. |

## Never-touch list (no agent may write to these without explicit founder approval, regardless of task)

- `00_System/AIFA_CONSTITUTION.md` substance.
- `System/Shima_Persona.md` substance.
- Any Locked entry in `00_System/DECISIONS.md` (may only be superseded by a new entry, never edited in place).
- Anything that would merge, restructure, or move Content Studio's and Platform's own governed folders into each other — the exact boundary D-011 and D-021 both protect.
- Git history rewriting, force-pushes, or destructive operations of any kind — matching the same standing rule that governs this entire repository's human-driven sessions.

## What "explicit founder approval" means for an agent, concretely

An agent does not infer approval from silence, from a prior approval of a *different* change, or from a broad instruction that didn't specifically authorize the action in question — the same scoping discipline already required of every AI contributor to this repository (see `../CLAUDE.md`'s "Executive actions with care" framing, generalized here to agents specifically). If an agent is uncertain whether an action needs approval, it asks rather than proceeding.

## Cross-workstream reads are always fine; cross-workstream writes never are without going through §Write access above

An agent may freely *read* both Content Studio and Platform to inform a decision recorded in `AIFA_Brain/12_Decisions/` — that's the entire point of the shared knowledge layer. It may not *write* into one workstream's governed structure based on logic that actually belongs to the other, without that workstream's own approval process. Reading across the boundary is how `AIFA_Brain/` stays useful; writing across it without permission is exactly what D-011 and D-021 exist to prevent.
