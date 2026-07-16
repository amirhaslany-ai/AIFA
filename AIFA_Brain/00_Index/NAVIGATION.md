# Navigation

| Field | Value |
|---|---|
| **Title** | Navigation |
| **Created** | 2026-07-13 |
| **Updated** | 2026-07-16 |
| **Owner** | AIFA_Brain maintainers |
| **Status** | Active |
| **Version** | 1.1 |
| **Dependencies** | `METADATA_STANDARD.md` |
| **Related Docs** | `README.md`, `../MASTER_INDEX.md`, `../04_Research/Market_Intelligence/README.md` |
| **Tags** | `index, navigation` |

## Summary

How to find things, how folders relate to each other, and the linking convention that keeps `AIFA_Brain/` from accumulating duplicate or contradictory copies of the same fact.

## The three ways to find something

1. **`../MASTER_INDEX.md`** — the complete, category-organized list. Start here if you don't know which folder something lives in.
2. **A folder's own `README.md`** — if you know the category (e.g. "this is a business question"), go straight to `02_Business/README.md` and follow its links.
3. **Tags** (see `METADATA_STANDARD.md`) — for finding documents by topic across folders, e.g. everything tagged `pricing` regardless of whether it's in `02_Business/`, `04_Research/Pricing_Research/`, or `11_Pricing/`.

## Linking convention

- **Always use relative links**, never absolute paths or URLs, so the repository stays portable (works identically cloned anywhere, works in GitHub's web UI, works in an editor).
- **Link, don't duplicate.** If a fact belongs in one place (e.g. the real pricing markup belongs in `11_Pricing/`), every other document that needs it links there rather than restating it. When the fact changes, it changes in exactly one place.
- **Cross-workstream links go up and over**: from anywhere in `AIFA_Brain/`, a link to Content Studio is `../../{path}` or `../{path}` depending on depth (e.g. `01_Product/README.md` linking to `../../00_System/DECISIONS.md`), and a link to Platform is the same pattern (`../../Platform/{path}`). Verify the relative depth when linking — a broken link is worse than no link.

## How the 17 sections relate to each other (the parts that aren't obvious from the names alone)

- **`04_Research/Market_Intelligence/` (the cohesive foundation) vs. the five template sub-areas**: the Market Intelligence Foundation is a completed, internally cross-referenced 12-document study kept together as one unit (its documents cite each other by phase — splitting them would break those references). The five template-driven sub-areas (`Market_Research/`, `User_Research/`, `Technology_Research/`, `Pricing_Research/`, `API_Research/`) are for *new, point-in-time* studies. Findings in the foundation that belong to another section (UX → `User_Research/`, pricing/margin → `11_Pricing/`, competitors → `05_Competitors/`, routing → `09_Technology/`/`06_AI/`) are **cross-linked, not copied**.
- **`04_Research/` vs. `05_Competitors/`**: competitor-specific intelligence lives in `05_Competitors/`, not duplicated as a sixth "Competitor Research" subfolder inside `04_Research/` — the two are cross-referenced, not merged, because competitive intelligence tends to be maintained on a different cadence (continuously updated per-competitor) than the other research types (point-in-time studies). The per-competitor profiles in `05_Competitors/` are distilled from the foundation's Phase 2 and Phase 7 documents.
- **`02_Business/` vs. `11_Pricing/`**: pricing is business-critical enough to get its own top-level folder rather than being buried as a `02_Business/` subfolder. `02_Business/Business_Model/` should link to `11_Pricing/` rather than restating pricing decisions.
- **`03_Marketing/` (company-level) vs. Content Studio's `06_Marketing/` (content-promotion-level)**: these are genuinely different scopes wearing similar names — company positioning/campaigns vs. how to promote Shima's individual videos. Cross-reference, don't confuse.
- **`06_AI/`, `09_Technology/`, `10_API/` (strategy) vs. `Platform/docs/architecture/` (implementation)**: the `AIFA_Brain/` versions are about *what the company decides*, the `Platform/` versions are about *how the code implements it*. A pricing/business decision in `06_AI/` might drive an ADR in `Platform/docs/adr/`; the two should link to each other, not merge.
- **`12_Decisions/` vs. `00_System/DECISIONS.md` vs. `Platform/docs/adr/`**: three decision logs for three scopes. `00_System/DECISIONS.md` is Content Studio's own (governed by the Constitution). `Platform/docs/adr/` is Platform's own (governed by its ADR convention). `12_Decisions/` is for decisions that are genuinely company-level or cross-workstream — it does not duplicate the other two, and its own `ARCHITECTURE_DECISION_LOG.md` explicitly says so.
- **`16_Archive/`**: the destination for anything superseded anywhere in `AIFA_Brain/` — not a dumping ground for Content Studio or Platform's own history, which each already have their own (git history, `CHANGELOG.md`, superseded-ADR conventions).

## When you add a new document

1. Give it the metadata block (`METADATA_STANDARD.md`).
2. Add it to `../MASTER_INDEX.md` under the right category.
3. Link it from its folder's `README.md` if that README maintains a document list.
4. If it supersedes an existing document, move the old one to `16_Archive/`, mark it `Status: Superseded`, and update every link that pointed to it.
