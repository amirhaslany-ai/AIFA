# 01_Product

| Field | Value |
|---|---|
| **Title** | 01_Product — README |
| **Created** | 2026-07-13 |
| **Updated** | 2026-07-16 |
| **Owner** | unassigned — see Ownership below |
| **Status** | Active |
| **Version** | 1.1 |
| **Dependencies** | none |
| **Related Docs** | [`../MASTER_INDEX.md`](../MASTER_INDEX.md), [`../04_Research/Market_Intelligence/01_Executive_Intelligence_Report.md`](../04_Research/Market_Intelligence/01_Executive_Intelligence_Report.md), [`../04_Research/Market_Intelligence/03_Feature_Intelligence.md`](../04_Research/Market_Intelligence/03_Feature_Intelligence.md), `../../Platform/HANDOVER/12_OPEN_DECISIONS.md`, `../../Platform/FOUNDER_NEXT_STEP.md`, `../15_Roadmap/README.md` |
| **Tags** | `product, strategy` |

## Purpose

Product vision, feature specs, user-facing product decisions, and product-strategy documents that span or precede either engineering workstream. This is where "what should we build and why" lives, distinct from "how is it built" (which lives in `Platform/` and Content Studio's own docs) and distinct from "what does it cost" (`11_Pricing/`).

No ratified product-strategy document has been written yet. That's an honest gap, not an oversight: `Platform/FOUNDER_NEXT_STEP.md` (written at the end of the Platform architecture freeze) explicitly identifies product strategy as the next real bottleneck, ahead of more engineering work.

> **The research to inform it now exists.** The [Executive Intelligence Report](../04_Research/Market_Intelligence/01_Executive_Intelligence_Report.md) sets out product conclusions (a narrow, trust-led MVP: multi-model chat + image, prepaid Toman wallet, quote-before-commit, Persian-quality guidance, four flagship differentiators), and [Feature Intelligence (Phase 3)](../04_Research/Market_Intelligence/03_Feature_Intelligence.md) is a 187-feature register with per-feature phase verdicts, an anti-backlog of things to never build, and constitutional-compatibility flags. These are *evidence and recommendations*; a ratified product decision still gets recorded in `../12_Decisions/PRODUCT_DECISION_LOG.md`. The first documents that belong here are the ones that answer `Platform/HANDOVER/12_OPEN_DECISIONS.md`'s product-shaped open questions: who the first real user is, what they need to be able to do that they can't do anywhere else, and whether the current API-first, aggregator-platform product framing (ADR-0006 in `Platform/docs/adr/`) is still the right one.

## Update rules

- A product document should state what problem it's solving and for whom before it states a solution — the "why" is what makes a product doc distinct from a spec.
- When a product decision is made (not just proposed), record it in `../12_Decisions/PRODUCT_DECISION_LOG.md`, not only here — this folder holds the reasoning/artifacts, the decision log holds the fact that a decision was made and when.
- Don't write a feature spec for something that doesn't yet have a business/pricing answer in `02_Business/`/`11_Pricing/` — link to the open question there instead of guessing at monetization.

## Ownership

Unassigned. This is the founder's domain until a product function exists — see `../../Platform/FOUNDER_NEXT_STEP.md` for the explicit recommendation that this is where attention should go next.

## Relationships

- **`Platform/HANDOVER/12_OPEN_DECISIONS.md`** — the concrete list of product-shaped questions Platform's architecture is waiting on.
- **`04_Research/User_Research/`** — product decisions should be grounded in user research, not made in isolation.
- **`05_Competitors/`** — product positioning depends on knowing what alternatives (OpenRouter, Poe, etc.) already do.
- **`15_Roadmap/`** — once product direction exists, it feeds the cross-workstream roadmap.
- **`12_Decisions/PRODUCT_DECISION_LOG.md`** — where product decisions get formally recorded once made.
