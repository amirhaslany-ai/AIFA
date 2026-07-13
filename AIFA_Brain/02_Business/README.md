# 02_Business

| Field | Value |
|---|---|
| **Title** | 02_Business — README |
| **Created** | 2026-07-13 |
| **Updated** | 2026-07-13 |
| **Owner** | unassigned |
| **Status** | Active |
| **Version** | 1.0 |
| **Dependencies** | none |
| **Related Docs** | `../11_Pricing/README.md`, `../../Platform/HANDOVER/12_OPEN_DECISIONS.md`, `../../Platform/FOUNDER_NEXT_STEP.md` |
| **Tags** | `business, strategy` |

## Purpose

The business layer for the whole AIFA company: how the business works, how it makes money, how it plans financially, how it goes to market, its legal footing, its risks, and its partnerships. Six sub-areas, each with its own README and a template so a first real document in each area starts from a consistent shape rather than a blank page.

## Sub-areas

| Folder | Covers |
|---|---|
| [`Business_Model/`](Business_Model/README.md) | How AIFA actually makes money — the business model canvas. |
| [`Financial_Planning/`](Financial_Planning/README.md) | Budget, runway, financial projections. |
| [`Go_To_Market/`](Go_To_Market/README.md) | Launch strategy, channel strategy, GTM plans. |
| [`Legal/`](Legal/README.md) | Legal structure, compliance, terms of service, the sanctions-exposure question already flagged in Content Studio's D-011. |
| [`Risk/`](Risk/README.md) | Business risk register — distinct from Platform's own technical risk matrix. |
| [`Partnerships/`](Partnerships/README.md) | Partner relationships, vendor relationships beyond AI providers (which live in `../06_AI/`). |

**Pricing has its own top-level folder** (`../11_Pricing/`), not a `02_Business/` subfolder — see `../00_Index/NAVIGATION.md` for why (it's business-critical enough, and cross-referenced enough with `06_AI/` and Platform's engine, to warrant top-level visibility).

## Update rules

- Every sub-area's first real document should be written against its template, not from scratch, so the six areas stay comparable to each other.
- A business decision made in any sub-area gets logged in `../12_Decisions/BUSINESS_DECISION_LOG.md`, in addition to living in its sub-area's own documents.
- Financial and legal content may be sensitive — if anything here should not be broadly readable, flag it explicitly in the document rather than assuming; this repository has no access-control layer of its own.

## Ownership

Unassigned — founder-level until a business function exists.

## Relationships

- **`11_Pricing/`** — the pricing decisions this folder's business model depends on.
- **`Platform/HANDOVER/12_OPEN_DECISIONS.md`** — several open items there (payment strategy, hosting cost implications) are genuinely business decisions that belong here once resolved.
- **`04_Research/Market_Research/`**, **`05_Competitors/`** — inputs to `Business_Model/` and `Go_To_Market/`.
- **`00_System/DECISIONS.md` D-011** — the sanctions-exposure rationale for keeping Content Studio and Platform separate is itself a legal/risk consideration; `Legal/` and `Risk/` should be aware of it, not re-litigate it.
