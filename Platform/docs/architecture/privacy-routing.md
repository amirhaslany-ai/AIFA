# Privacy routing

**Status:** Design/direction only (ADR-0024's Privacy Engine). No implementation exists.

## Summary

The Privacy Engine (ADR-0024) is intended to route requests preferring providers with stronger data-retention/privacy postures where the portfolio offers a real choice between providers for the same model or capability. This is currently an **unpopulated dimension** — no provider in `docs/providers/` has yet had its data-retention terms verified against official sources (Phase C work, tracked via ADR-0025's sourcing discipline).

## Precedent already established elsewhere in the repository

`AIFA_Brain/04_Research/Market_Intelligence/02_Competitors_Phase2.md` already documents zero-data-retention as a differentiator among *inference resellers* (Fireworks, DeepInfra) in AIFA's separate market-intelligence research, and `AIFA_Brain/06_AI/README.md` records "prefer zero-data-retention providers" as a candidate vendor-selection posture. This document is the **Platform-engineering counterpart**: where that posture gets implemented as an actual routing input, once real per-provider data-retention terms are captured in `docs/providers/*.md` (Phase C, per ADR-0025 §"commercial and legal fields": `data_retention_policy`, `training_on_customer_data_default`, `zero_data_retention_availability`).

## What Phase C needs to populate

Per provider: data-retention policy, whether customer data trains the vendor's models by default, whether zero-retention is available (and at what tier/cost), DPA availability, EU-processing availability. `UNKNOWN` where public documentation doesn't answer the question — never inferred.

## Related documents

- ADR-0024, ADR-0025
- `capability-model-provider.md`, `regional-routing.md`
- `AIFA_Brain/04_Research/Market_Intelligence/02_Competitors_Phase2.md`, `AIFA_Brain/06_AI/README.md`
