# 12_Decisions

| Field | Value |
|---|---|
| **Title** | 12_Decisions — README |
| **Created** | 2026-07-13 |
| **Updated** | 2026-07-13 |
| **Owner** | AIFA_Brain maintainers |
| **Status** | Active |
| **Version** | 1.0 |
| **Dependencies** | none |
| **Related Docs** | `../MASTER_INDEX.md`, `../../00_System/DECISIONS.md`, `../../Platform/docs/adr/` |
| **Tags** | `decisions, governance` |

## Purpose

Four decision logs, scoped so nothing is decided twice and nothing important goes unrecorded:

| Log | Scope |
|---|---|
| [`DECISION_LOG.md`](DECISION_LOG.md) | General/cross-cutting decisions that aren't purely architecture, business, or product. |
| [`ARCHITECTURE_DECISION_LOG.md`](ARCHITECTURE_DECISION_LOG.md) | Company-level architecture decisions that span both engineering workstreams. |
| [`BUSINESS_DECISION_LOG.md`](BUSINESS_DECISION_LOG.md) | Business decisions (pricing, GTM, financial, legal, partnerships). |
| [`PRODUCT_DECISION_LOG.md`](PRODUCT_DECISION_LOG.md) | Product decisions (what to build, for whom, in what order). |

## How this relates to the two existing decision logs (read this before adding an entry anywhere)

This repository already has two governed, workstream-specific decision logs that predate `AIFA_Brain/` and are **not replaced or duplicated** by it:

- **`00_System/DECISIONS.md`** — Content Studio's own Decisions Log, referenced by `AIFA_CONSTITUTION.md`, containing D-001 through D-021 (as of this writing). Content Studio's own internal decisions (script structure, pipeline ordering, persona naming) stay there. D-011, D-020, and D-021 — which concern the *boundary* between Content Studio and everything else — are also there, since they're Content-Studio-governance decisions about scope, even though their subject matter (Platform, AIFA_Brain) is cross-cutting.
- **`Platform/docs/adr/`** — Platform's own Architecture Decision Records (0001–0015 as of this writing), governing Platform's internal technical architecture.

**The rule:** if a decision is internal to how Content Studio's content pipeline works, it goes in `00_System/DECISIONS.md`. If a decision is internal to how Platform's software architecture works, it becomes an ADR in `Platform/docs/adr/`. If a decision is genuinely company-level — spans both workstreams, or concerns something neither workstream's own log has a natural home for (a business model choice, a product-direction choice, a hiring decision) — it goes in one of this folder's four logs instead. When in doubt, check whether the decision would make sense read in isolation by someone who only cares about Content Studio, or only about Platform — if yes to either, it probably belongs in that workstream's own log, not here.

## Update rules

- Every future decision of real consequence gets an entry in the appropriate log — this is a "no exceptions" rule per the founder's explicit request, mirroring the discipline `00_System/DECISIONS.md` and `Platform/docs/adr/` already model.
- Never delete a decision entry, even a reversed one — add a new entry that supersedes it (exactly `00_System/DECISIONS.md`'s own convention, reused here deliberately rather than inventing a different one).
- Each log uses the same entry format — see each log file's own header for the exact fields.

## Ownership

AIFA_Brain maintainers collectively, same as `00_Index/`.

## Relationships

Every other folder in `AIFA_Brain/` should link back here when it records that a decision was made (not just proposed) — see each folder's own "Update rules" section for the specific pointer.
