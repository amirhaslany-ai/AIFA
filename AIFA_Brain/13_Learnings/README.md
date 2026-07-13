# 13_Learnings

| Field | Value |
|---|---|
| **Title** | 13_Learnings — README |
| **Created** | 2026-07-13 |
| **Updated** | 2026-07-13 |
| **Owner** | unassigned |
| **Status** | Active |
| **Version** | 1.0 |
| **Dependencies** | none |
| **Related Docs** | `../MASTER_INDEX.md`, `../../Platform/FINAL_TECHNICAL_DEBT.md`, `../../Platform/REVIEW_NOTES.md` |
| **Tags** | `learnings, retrospective` |

## Purpose

Retrospectives and postmortems — product, engineering, and go-to-market — the "what actually happened and what should change next time" record that's easy to lose without a dedicated home. This is distinct from `12_Decisions/`, which records *what was decided*; this folder records *what was learned*, often after the fact and sometimes uncomfortably.

Currently structure-only, but Platform's engineering workstream already has real material worth mining for the first entries here: `Platform/REVIEW_NOTES.md` and `Platform/FINAL_TECHNICAL_DEBT.md` both document real bugs found and fixed during development (e.g. a wallet double-counting bug, a circuit-breaker half-open concurrency bug) with enough detail to extract genuine engineering learnings (what class of bug, what caught it, what would prevent the next one) rather than just a debt list.

## Update rules

- A learning entry should say what would be done differently, not just what went wrong — a postmortem without a forward-looking change isn't useful.
- Don't write a learning entry to assign blame — the goal is the same "root cause, not symptom" discipline already established in Platform's own engineering practice (see `Platform/HANDOVER/07_CODE_QUALITY.md`'s testing section for examples of bugs traced to root cause, not patched superficially).
- Link the source event (a decision that didn't work out, a research finding that was wrong, a launch that underperformed) so the learning has context.

## Ownership

Unassigned.

## Relationships

- **`Platform/FINAL_TECHNICAL_DEBT.md`, `Platform/REVIEW_NOTES.md`** — existing engineering material worth extracting learnings from.
- **`12_Decisions/`** — a learning often leads to revisiting a prior decision; link both directions.
- **`15_Roadmap/`** — learnings should inform what's prioritized next.
