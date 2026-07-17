# Cost model

**Status:** Framework only. No provider pricing exists yet to compute against (Phase C).

## What this document is

`pricing-methodology.md` defines *what* Fully Loaded Variable Cost consists of. This document defines *how* it gets computed for a concrete scenario, and where the result lives.

## Computation flow

```
1. Take a scenario definition (../pricing/assumptions.yaml — e.g. "100 chat requests, 2000 input / 1000 output tokens each")
2. Look up the relevant model-pricing row (../pricing/model-pricing.csv) and its provider-pricing row (../pricing/provider-pricing.csv)
3. Compute raw Provider Cost from the scenario's usage × the provider's unit price
4. Add Gateway/Aggregator Cost only if the model's provider mapping is a gateway route (e.g. fal, per ../providers/fal.md), not a direct vendor call
5. Add Retry Allowance, Storage/Egress, Moderation, Payment Processing Allocation, Support Allocation, Risk Buffer per pricing-methodology.md — each sourced from a real measured rate or an explicit placeholder assumption, never invented silently
6. Record the result, its formula, its confidence, and its source ids in ../pricing/scenario-costs.csv
```

## What this document deliberately does not decide

- The actual numeric value of any allowance/allocation/buffer in step 5 — those are business inputs, not derived here.
- Whether pricing is computed synchronously or asynchronously relative to the AI call itself — that is `../architecture/pricing-architecture.md`'s open question (see its own "What this document deliberately does not decide" section), not duplicated here.

## Related documents

- `pricing-methodology.md`, `credit-engine-requirements.md`
- `../pricing/assumptions.yaml`, `../pricing/model-pricing.csv`, `../pricing/provider-pricing.csv`, `../pricing/scenario-costs.csv`
