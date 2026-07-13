# Metadata Standard

| Field | Value |
|---|---|
| **Title** | Metadata Standard |
| **Created** | 2026-07-13 |
| **Updated** | 2026-07-13 |
| **Owner** | AIFA_Brain maintainers |
| **Status** | Active |
| **Version** | 1.0 |
| **Dependencies** | none |
| **Related Docs** | `README.md`, `NAVIGATION.md`, `../_templates/DOCUMENT_TEMPLATE.md` |
| **Tags** | `index, standard, metadata` |

## Summary

Every document inside `AIFA_Brain/` (and, where practical, `Agents/`) carries this metadata block as a table immediately after its H1 title. This is what makes `MASTER_INDEX.md` trustworthy, makes staleness visible (an `Updated` date that never moves is a signal), and makes ownership unambiguous.

## The required fields

| Field | Meaning | Rules |
|---|---|---|
| **Title** | The document's name, matching its H1. | Must match the actual filename's intent — don't let the title drift from the file's purpose. |
| **Created** | The date the document first existed. | `YYYY-MM-DD`. Never changes after creation. |
| **Updated** | The date of the most recent substantive edit. | `YYYY-MM-DD`. Update on every substantive change (content, not typo fixes). A stale `Updated` date on a document that's clearly out of date is worse than an honest "this hasn't been revisited" — update it or mark the document `Superseded`/`Archived`, don't let it silently rot. |
| **Owner** | Who (person, role, or team) is responsible for this document being correct. | One owner, not a list — shared ownership diffuses into no ownership. If genuinely unowned, say so explicitly (`Owner: unassigned`) rather than guessing. |
| **Status** | Where this document is in its lifecycle. | One of: `Draft`, `Active`, `Under Review`, `Approved`, `Superseded`, `Archived`. See below for what each means. |
| **Version** | A simple version number. | Increment the minor version (1.0 → 1.1) for a substantive edit; increment the major version (1.x → 2.0) for a rewrite that changes the document's conclusions, not just its detail. |
| **Dependencies** | Other documents this one assumes or requires to make sense. | Relative links. If none, write `none` — don't omit the row. |
| **Related Docs** | Other documents worth reading alongside this one, without a strict dependency. | Relative links. If none, write `none`. |
| **Tags** | Lowercase, comma-separated keywords for search/filtering. | Reuse existing tags where they fit rather than inventing near-duplicates (e.g. use `pricing`, not both `pricing` and `price`). |

## Status values, precisely

- **Draft** — being written, not yet ready to be relied on by anyone but the author.
- **Active** — the current, correct, relied-upon version.
- **Under Review** — complete but awaiting approval/feedback before being treated as `Active`.
- **Approved** — reviewed and formally signed off (used for documents that need an explicit approval step — e.g. a business decision, a legal document — not required for every document).
- **Superseded** — replaced by a newer document. The newer document should be linked in this one's `Related Docs`, and this document should be moved to `16_Archive/` (see `NAVIGATION.md`).
- **Archived** — historical, kept for reference, not actively maintained. Lives in `16_Archive/`.

## What this standard deliberately does not require

- A fixed document length or section structure beyond the metadata block itself — `_templates/DOCUMENT_TEMPLATE.md`'s body sections are a starting suggestion, not a mandate.
- Retroactively rewriting existing documents the moment this standard changes — see `README.md`'s update rules.
- Metadata on files that aren't standalone knowledge documents (code, config, templates-as-forms where the template itself is the content) — use judgment; a `TEMPLATE_*.md` file's own metadata block describes the template, not each future document created from it.
