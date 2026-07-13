# 05_Competitors

| Field | Value |
|---|---|
| **Title** | 05_Competitors — README |
| **Created** | 2026-07-13 |
| **Updated** | 2026-07-13 |
| **Owner** | unassigned |
| **Status** | Active |
| **Version** | 1.0 |
| **Dependencies** | none |
| **Related Docs** | `../MASTER_INDEX.md`, `../04_Research/README.md`, `../01_Product/README.md`, `TEMPLATE_Competitor_Profile.md` |
| **Tags** | `competitors, competitive-intelligence` |

## Purpose

One profile per competitor — OpenRouter, Poe, and any other AI-aggregator or adjacent product AIFA competes with or is positioned against. Kept current on an ongoing basis (unlike `../04_Research/`'s more point-in-time studies) since competitive landscapes shift quickly in this space. Currently structure-only; use `TEMPLATE_Competitor_Profile.md` per competitor.

Already-known context worth starting from: `Platform/README.md` positions AIFA explicitly as "comparable to OpenRouter/Poe/SYNTX for the Persian market," and `Platform/docs/adr/0006-api-style.md` / `Platform/FOUNDER_NEXT_STEP.md` reference OpenRouter directly as the competitive frame AIFA's API-first positioning was chosen against — the first profiles here should probably be OpenRouter and Poe.

## Update rules

- One file per competitor (`TEMPLATE_Competitor_Profile.md` copy), named after the competitor, not one running comparison document — makes individual competitors easy to update independently.
- Revisit each profile whenever that competitor makes a material change (pricing, major feature, funding, positioning) — competitive intelligence that's a year stale is actively misleading, not just incomplete.
- Cite sources for claims about a competitor (their own docs/pricing page, not secondhand assumption).

## Ownership

Unassigned.

## Relationships

- **`04_Research/Pricing_Research/`** — cross-competitor pricing *pattern* synthesis lives there; this folder's per-competitor pricing detail feeds it.
- **`01_Product/`** and **`03_Marketing/`** — competitive positioning directly informs both.
- **`Platform/docs/adr/0006-api-style.md`** — already names the competitive frame AIFA's technical API decision was made against.
