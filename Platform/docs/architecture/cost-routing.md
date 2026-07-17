# Cost routing

**Status:** Design/direction only (ADR-0024's Smart Cost Engine). No implementation exists.

## Summary

The Smart Cost Engine (ADR-0024) is intended to route requests toward the lowest-cost provider/variant capable of serving a given capability at an acceptable quality bar. It consumes the same per-provider cost data the Credit Engine needs (`docs/economics/credit-engine-requirements.md`) and the same pricing dataset ADR-0025/`docs/pricing/` builds — this document does not define a separate cost source; it is a routing policy layered on top of one dataset.

## Relationship to the Pricing Engine (ADR-0009)

Do not confuse this with `pricing-architecture.md`'s `PricingPipeline` (ADR-0009). That pipeline computes the **customer-facing price** from a known cost. Cost routing (this document) is a **provider-selection policy** that runs *before* a call is made, choosing which provider/variant to call based on its known cost — the two are sequential, not overlapping: cost routing picks the provider, the provider call produces a real cost, the Pricing Engine turns that cost into a price.

## Precedent already established elsewhere

`AIFA_Brain/04_Research/Market_Intelligence/02_Competitors_Phase2.md` Finding B documents a directly analogous real-world result: OpenRouter's per-request price-shopping router beats every first-party provider price by routing the same model across suppliers (5–6× cheaper than first-party in the cited example). That finding is the market evidence motivating AIFA's own Smart Cost Engine; this document is where that gets implemented for AIFA's own portfolio once real per-provider costs exist (Phase C).

## What Phase C needs to populate

`docs/pricing/provider-pricing.csv` and `model-pricing.csv` — see `docs/pricing/README.md`. Cost routing cannot be implemented meaningfully until at least two real providers exist for the same model family with comparable pricing.

## Related documents

- ADR-0009, ADR-0024, ADR-0025
- `pricing-architecture.md`, `docs/economics/credit-engine-requirements.md`, `docs/pricing/README.md`
- `AIFA_Brain/04_Research/Market_Intelligence/02_Competitors_Phase2.md` (Finding B)
