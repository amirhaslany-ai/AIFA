# 01_Product

| Field | Value |
|---|---|
| **Title** | 01_Product — README |
| **Created** | 2026-07-13 |
| **Updated** | 2026-07-20 |
| **Owner** | unassigned — see Ownership below |
| **Status** | Active |
| **Version** | 1.3 |
| **Dependencies** | none |
| **Related Docs** | [`../MASTER_INDEX.md`](../MASTER_INDEX.md), [`../12_Decisions/PRODUCT_DECISION_LOG.md`](../12_Decisions/PRODUCT_DECISION_LOG.md), [`../04_Research/Market_Intelligence/01_Executive_Intelligence_Report.md`](../04_Research/Market_Intelligence/01_Executive_Intelligence_Report.md), [`../04_Research/Market_Intelligence/03_Feature_Intelligence.md`](../04_Research/Market_Intelligence/03_Feature_Intelligence.md), `../../Platform/HANDOVER/12_OPEN_DECISIONS.md`, `../../Platform/FOUNDER_NEXT_STEP.md`, `../15_Roadmap/README.md` |
| **Tags** | `product, strategy` |

## Purpose

Product vision, feature specs, user-facing product decisions, and product-strategy documents that span or precede either engineering workstream. This is where "what should we build and why" lives, distinct from "how is it built" (which lives in `Platform/` and Content Studio's own docs) and distinct from "what does it cost" (`11_Pricing/`).

**A ratified product-strategy decision now exists: [`P-001`](../12_Decisions/PRODUCT_DECISION_LOG.md#p-001--launch-with-a-broad-value-dense-product-foundation) (Locked, 2026-07-19).** AIFA launches as a broad multi-capability platform (chat, image, video, voice, music, avatar, Smart Router, wallet/quote-before-commit pricing, history/asset library, opt-in basic Memory, curated workflow templates, controlled Agents), not a minimal chat-only product — see the decision log entry for the full scope, constraints, and commercial rationale.

> **Earlier research recommended a narrower MVP; P-001 supersedes it on capability breadth.** The [Executive Intelligence Report](../04_Research/Market_Intelligence/01_Executive_Intelligence_Report.md) sets out a narrow, trust-led MVP (multi-model chat + image, prepaid Toman wallet, quote-before-commit, Persian-quality guidance, four flagship differentiators) — that research conclusion is preserved as-is and is not rewritten by this note; P-001 is the ratified decision that now governs launch scope. [Feature Intelligence (Phase 3)](../04_Research/Market_Intelligence/03_Feature_Intelligence.md) (a 187-feature register with per-feature phase verdicts, an anti-backlog of things to never build, and constitutional-compatibility flags) remains relevant evidence for sequencing within P-001's locked breadth. Model/provider selection for each launch capability is now locked by [`P-002`](../12_Decisions/PRODUCT_DECISION_LOG.md#p-002--launch-model-provider-and-activation-matrix) (Locked, 2026-07-20 — the launch model/provider/activation matrix, including Kimi K3/Moonshot AI added to Chat); implementation sequencing itself remains a separate, still-open decision — see `Platform/HANDOVER/12_OPEN_DECISIONS.md` and `Platform/FOUNDER_NEXT_STEP.md`.

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
