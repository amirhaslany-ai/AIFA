# Subscription model — requirements

**Status:** Requirements only. Assigning subscription prices is an explicit human-review gate in the audit mission; **no subscription price is set in this document.**

## What a subscription tier needs to define, once priced

- **Included usage** per tier, per capability (e.g. how many chat tokens, images, video-seconds, avatar-minutes are bundled before overage applies) — must reference `../pricing/assumptions.yaml`'s standardized scenarios so "included usage" is expressed in the same units the cost model uses.
- **Overage pricing** once included usage is exhausted — and whether overage is billed at the same per-unit rate as prepaid credit, or a different (typically higher) rate.
- **Tier-to-model-access mapping**: which portfolio entries (`../portfolio/`) are available at which tier (e.g. Chat Package vs. All Access Package, per ADR-0018's packaging decision) — a real product-scoping question, not just a price question.
- **Free-tier relationship**: the free tier (ADR-0018: usage-limited, not model-downgraded) is presumably the tier below the cheapest paid subscription — this document should state that relationship explicitly once a paid tier is designed, so the two aren't accidentally designed independently.
- **Billing cadence and proration** (monthly, annual-discounted, mid-cycle upgrade/downgrade behavior).
- **Cancellation and refund policy** for unused subscription value.

## Relationship to prepaid credit

`AIFA_Brain/04_Research/Market_Intelligence/01_Executive_Intelligence_Report.md` recommends prepaid credit as AIFA's **core** monetization model (fits the FX/settlement reality for AIFA's target market) with subscription as an **optional tier for heavy users** — a research recommendation, not yet a ratified product decision. Any subscription design here should be built as a layer on top of the prepaid-credit core, not a replacement for it, consistent with that research unless the founder explicitly decides otherwise (recorded in `AIFA_Brain/12_Decisions/PRODUCT_DECISION_LOG.md` if so).

## Related documents

- `margin-policy.md`, `credit-engine-requirements.md`
- ADR-0018 (Chat Package / All Access Package packaging)
- `AIFA_Brain/01_Product/README.md`, `AIFA_Brain/04_Research/Market_Intelligence/01_Executive_Intelligence_Report.md`
