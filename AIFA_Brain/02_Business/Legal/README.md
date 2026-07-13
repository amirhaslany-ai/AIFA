# Legal

| Field | Value |
|---|---|
| **Title** | Legal — README |
| **Created** | 2026-07-13 |
| **Updated** | 2026-07-13 |
| **Owner** | unassigned |
| **Status** | Active |
| **Version** | 1.0 |
| **Dependencies** | none |
| **Related Docs** | `../README.md`, `../../../00_System/DECISIONS.md`, `../Risk/README.md`, `TEMPLATE_Legal_Review.md` |
| **Tags** | `legal, compliance` |

## Purpose

Legal structure, compliance obligations, terms of service, privacy policy, and the jurisdiction/sanctions-exposure questions already flagged elsewhere in this repository. Currently structure-only; use `TEMPLATE_Legal_Review.md` for the first real review.

The most important existing context: `00_System/DECISIONS.md` D-011 already documents that AIFA Platform (not Content Studio) carries "sanctions-access exposure" as part of the original rationale for keeping the two workstreams separate. This folder is where that exposure should actually be assessed properly (with real legal input), not just referenced as a rationale for a structural decision.

## Update rules

Legal review documents should be dated and versioned precisely (the metadata block's `Updated` field matters more here than almost anywhere in `AIFA_Brain/` — a stale legal review is actively dangerous, not just inconvenient). Anything genuinely sensitive should be flagged explicitly, since this repository has no access-control layer of its own.

## Ownership

Unassigned — should involve actual legal counsel once engaged, not be treated as a document any AI model or engineer should author the substance of.

## Relationships

- **`00_System/DECISIONS.md` D-011** — the sanctions-exposure rationale this folder should properly assess.
- **`../Risk/`** — legal risk is a subset of the broader risk register; cross-reference rather than duplicate.
- **`../../02_Business/Partnerships/`** — partnership agreements have legal dimensions that belong here too.
