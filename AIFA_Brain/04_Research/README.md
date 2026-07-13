# 04_Research

| Field | Value |
|---|---|
| **Title** | 04_Research — README |
| **Created** | 2026-07-13 |
| **Updated** | 2026-07-13 |
| **Owner** | unassigned |
| **Status** | Active |
| **Version** | 1.0 |
| **Dependencies** | none |
| **Related Docs** | `../MASTER_INDEX.md`, `../05_Competitors/README.md`, `../../02_Research/README.md` (Content Studio) |
| **Tags** | `research` |

## Purpose

Structured research across five areas, each with a template so every research effort produces a comparable, reusable artifact instead of an ad hoc note. This folder is about the **business/product/technology** research the company needs — distinct from Content Studio's own `02_Research/`, which is the research pipeline for individual video/content topics (a different scope entirely, governed by its own methodology docs).

Competitor-specific research lives in `../05_Competitors/`, not as a sixth subfolder here — see `../00_Index/NAVIGATION.md` for why (different maintenance cadence: competitor profiles are continuously updated, these five are more often point-in-time studies).

## Sub-areas

| Folder | Covers |
|---|---|
| [`Market_Research/`](Market_Research/README.md) | Market size, trends, opportunity assessment. |
| [`User_Research/`](User_Research/README.md) | Who the users are, their needs, interviews/surveys. |
| [`Technology_Research/`](Technology_Research/README.md) | Technology landscape evaluation — broader than the AI-vendor-specific research in `../06_AI/`. |
| [`Pricing_Research/`](Pricing_Research/README.md) | What comparable products charge and why. |
| [`API_Research/`](API_Research/README.md) | How comparable API products structure their offering, docs, and partner experience. |

## Update rules

- Every research artifact uses its sub-area's template — a research document without a clear question it's answering isn't useful later.
- Findings that should influence a decision get linked from the relevant decision (`../12_Decisions/`) or strategy folder (`../01_Product/`, `../02_Business/`, etc.) — research sitting unused here isn't doing its job.
- Mark research `Status: Archived` (move to `../16_Archive/`) once its findings are stale enough to mislead rather than inform (markets and competitor landscapes move).

## Ownership

Unassigned.

## Relationships

- **`05_Competitors/`** — the competitor-specific sibling to this general research folder.
- **Content Studio's `02_Research/`** — a different scope (content-topic research), not to be confused despite the similar name.
- **`01_Product/`, `02_Business/`, `06_AI/`, `10_API/`, `11_Pricing/`** — the strategy folders this research should feed.
