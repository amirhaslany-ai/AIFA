# Margin policy

**Status:** Placeholder — requires founder approval. Assigning a target gross margin is an explicit human-review gate in the audit mission; **no margin value is set in this document.**

## What a margin policy needs to define, once decided

- A **target gross margin** (or margin range), and whether it is uniform across capabilities or varies (e.g. a thinner margin on commodity chat vs. a richer margin on differentiated avatar/voice work).
- Whether margin is measured against raw Provider Cost or against Fully Loaded Variable Cost (`pricing-methodology.md`) — these produce materially different numbers and the policy must say which.
- How margin interacts with `../architecture/pricing-architecture.md`'s existing `PricingPipeline` (ADR-0009) — specifically, whether the "base markup" rule there is meant to *implement* this margin policy directly, or whether a separate translation step exists.
- Whether margin floors/ceilings apply per provider (some vendors may warrant a different margin, per `pricing-architecture.md`'s existing per-provider markup lookup design) or per plan tier.

## Existing related research (not itself a decision)

`AIFA_Brain/04_Research/Market_Intelligence/05_Pricing_Intelligence.md` §5 already proposes a **~30% transparent, disclosed default margin** for AIFA's customer-facing (Toman) pricing, as a research recommendation — not a ratified decision. This document's provider-cost-side margin question is related but distinct: that research concerns the customer-facing markup over landed cost; this document concerns whether/how the underlying vendor-cost side of the ledger factors into setting that number. If the founder ratifies a margin decision, it belongs in `AIFA_Brain/11_Pricing/` and `AIFA_Brain/12_Decisions/BUSINESS_DECISION_LOG.md`, cross-linked from here — not decided in this docs-only pass.

## Related documents

- `pricing-methodology.md`, `credit-engine-requirements.md`
- `../architecture/pricing-architecture.md`, ADR-0009
- `AIFA_Brain/11_Pricing/README.md`, `AIFA_Brain/04_Research/Market_Intelligence/05_Pricing_Intelligence.md`
