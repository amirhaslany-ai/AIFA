# 00_Index

| Field | Value |
|---|---|
| **Title** | 00_Index — README |
| **Created** | 2026-07-13 |
| **Updated** | 2026-07-13 |
| **Owner** | AIFA_Brain maintainers |
| **Status** | Active |
| **Version** | 1.0 |
| **Dependencies** | none |
| **Related Docs** | `../README.md`, `../MASTER_INDEX.md`, `KNOWLEDGE_SYNC_POLICY.md` |
| **Tags** | `index, governance, standards` |

## Purpose

The rules this knowledge base runs on: the metadata every document must carry, how navigation between the 17 sections works, and the standing policy that keeps GitHub the single source of truth. This folder doesn't hold product/business/research content itself — it holds the system that keeps the content in the other 16 folders coherent, current, and pushed as they grow.

## What's here

- **`METADATA_STANDARD.md`** — the required metadata block (Title/Created/Updated/Owner/Status/Version/Dependencies/Related Docs/Tags), what each field means, and how to fill it correctly.
- **`NAVIGATION.md`** — how the folders relate to each other, and the cross-referencing convention (relative links, no duplication).
- **`KNOWLEDGE_SYNC_POLICY.md`** — the **Locked** founder policy that GitHub is the single source of truth: what "done" means for every task (record → cross-link → commit → push at milestones). Recorded as decision `G-001` in `../12_Decisions/DECISION_LOG.md`.

## Update rules

This folder changes rarely and deliberately — it's the constitution of `AIFA_Brain/`, not a place for day-to-day content. A change here (e.g. adding a required metadata field, changing the navigation convention) affects every other folder's documents, so:

1. Propose the change with a rationale (why the current standard is insufficient), not just the change itself.
2. Once adopted, the change applies going forward — existing documents are not required to be retroactively rewritten, but should be updated to the new standard the next time they're substantively edited.
3. Log the change in `../12_Decisions/DECISION_LOG.md` — a metadata-standard change is itself a decision worth recording.

## Ownership

AIFA_Brain maintainers collectively — this is infrastructure for everyone who writes into `AIFA_Brain/`, not owned by any one functional area (unlike `01_Product/` through `11_Pricing/`, which each have a natural owning function).

## Relationships

- Every other folder in `AIFA_Brain/` depends on this one (the metadata standard applies everywhere).
- `../MASTER_INDEX.md` is this folder's sibling in spirit — `00_Index/` defines the rules, `MASTER_INDEX.md` is the artifact those rules make possible (a trustworthy, current index only works if every document actually carries its metadata).
