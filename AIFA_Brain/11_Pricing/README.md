# 11_Pricing

| Field | Value |
|---|---|
| **Title** | 11_Pricing — README |
| **Created** | 2026-07-13 |
| **Updated** | 2026-07-16 |
| **Owner** | unassigned |
| **Status** | Active |
| **Version** | 1.1 |
| **Dependencies** | none |
| **Related Docs** | [`../04_Research/Market_Intelligence/05_Pricing_Intelligence.md`](../04_Research/Market_Intelligence/05_Pricing_Intelligence.md), `../../Platform/docs/architecture/pricing-architecture.md`, `../../Platform/docs/adr/0009-pricing-engine-pattern.md`, `../../Platform/HANDOVER/12_OPEN_DECISIONS.md`, `../06_AI/README.md` |
| **Tags** | `pricing, business-model, revenue` |

## Purpose

The **real** business pricing model: actual markup percentage, plan tiers, discount/campaign structure, and free-tier decisions (if any). This is the business decision layer that Platform's pricing engine is built to execute, not duplicate — Platform's `PricingPipeline` (`Platform/docs/adr/0009-pricing-engine-pattern.md`) is real, tested code that currently runs on engineering defaults (1.3x markup, no floor, explicitly marked as placeholders awaiting exactly the decision this folder exists to hold).

This is one of the most concrete, highest-leverage gaps identified across the whole repository: `Platform/HANDOVER/12_OPEN_DECISIONS.md` and `Platform/ARCHITECTURE_FREEZE.md` both flag real pricing as a founder decision blocking real monetization, and `Platform/FOUNDER_NEXT_STEP.md` names "Pricing" explicitly as one of the areas to resolve before more implementation work.

> **The evidence base now exists.** [`../04_Research/Market_Intelligence/05_Pricing_Intelligence.md`](../04_Research/Market_Intelligence/05_Pricing_Intelligence.md) contains the full Rial-in/USD-out margin model, credit mechanics, unit economics, and a ~30% disclosed-margin recommendation built on sourced supplier prices and the current FX rate. It is *research* (evidence), not the ratified pricing decision — this folder is where the founder's ratified numbers (markup, tiers, floors, FX-peg buffer) get recorded so an engineer can implement them. Treat every Toman figure in the research as a snapshot: **never hardcode a Toman price; price off an internal FX peg** (see that document's caveat and R-5.4).

## Update rules

- A pricing decision recorded here should map directly to Platform's real config keys once decided (`PRICING_BASE_MARKUP_BASIS_POINTS`, `PRICING_MINIMUM_PRICE_MINOR_UNITS`, and the not-yet-built campaign/plan-tier schema) — write the decision so an engineer could implement it without re-asking what was meant.
- Real vendor cost rates from `06_AI/` are an input to this folder's markup decisions, not something this folder re-derives independently.
- Any change to the real, live pricing model should be logged in `../12_Decisions/BUSINESS_DECISION_LOG.md`.

## Ownership

Unassigned — founder-level per `Platform/FOUNDER_NEXT_STEP.md`.

## Relationships

- **`Platform/docs/architecture/pricing-architecture.md`** and **`Platform/docs/adr/0009-pricing-engine-pattern.md`** — the engine this folder's decisions feed.
- **`06_AI/`** — real vendor cost rates, the input side of the markup calculation.
- **`02_Business/Business_Model/`** and **`02_Business/Financial_Planning/`** — pricing is one input to the broader business model and financial plan, not decided in isolation.
- **`04_Research/Pricing_Research/`** — competitive/market pricing research that should inform the real number, not just engineering convenience.
