# 16_Archive

| Field | Value |
|---|---|
| **Title** | 16_Archive — README |
| **Created** | 2026-07-13 |
| **Updated** | 2026-07-13 |
| **Owner** | AIFA_Brain maintainers |
| **Status** | Active |
| **Version** | 1.0 |
| **Dependencies** | none |
| **Related Docs** | `../MASTER_INDEX.md`, `../00_Index/NAVIGATION.md` |
| **Tags** | `archive, history` |

## Purpose

Where superseded `AIFA_Brain/` documents go instead of being deleted — never a dumping ground, always a deliberate move with a reason. This is scoped to `AIFA_Brain/`'s own documents only: Content Studio's history lives in its own git history and `CHANGELOG.md`; Platform's superseded ADRs stay in `Platform/docs/adr/` marked `Status: Superseded by ADR-XXXX` per its own convention, and Platform's own stale pre-Sprint-1 audit documents were already deleted (not archived) during Platform's own architecture-freeze cleanup, per that decision's own record in `Platform/FINAL_REVIEW/GIT_RELEASE_PLAN.md` — this folder does not retroactively second-guess that already-made, already-logged decision.

Currently empty — nothing in `AIFA_Brain/` has been superseded yet, since the whole structure was just created.

## Update rules

1. When a document elsewhere in `AIFA_Brain/` is superseded, move it here (preserve its original relative folder structure under `16_Archive/`, e.g. a superseded `02_Business/Business_Model/README.md` moves to `16_Archive/02_Business/Business_Model/README.md`), so its archive location still hints at where it came from.
2. Update its `Status` field to `Archived` and add a note in its metadata's `Related Docs` pointing to whatever replaced it.
3. Update every link that pointed to the old location.
4. Never delete — this folder exists specifically so "never delete anything" (the standing rule for this whole restructuring effort) has a real destination, not just a rule with nowhere to put things.

## Ownership

AIFA_Brain maintainers collectively.

## Relationships

Every other `AIFA_Brain/` folder is a potential source; this folder has no outgoing relationships of its own beyond preserving the ones its archived documents already had.
