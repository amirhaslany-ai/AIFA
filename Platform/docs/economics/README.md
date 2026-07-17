# Economics

The business/financial framework layer sitting above `../pricing/`'s raw provider-cost data and below AIFA's actual pricing/billing decisions. **Every document here is methodology and requirements, not final numbers** — actual markup percentages, subscription prices, and target margins are founder decisions requiring explicit approval (see the audit mission's human-review gates) and are not set in this docs-only pass.

## Contents

| Doc | What it defines |
|---|---|
| [`pricing-methodology.md`](pricing-methodology.md) | What counts as cost beyond raw provider price — tax, FX, payment processing, storage, retries, moderation, support, fraud, and the Fully Loaded Variable Cost formula. |
| [`cost-model.md`](cost-model.md) | How Fully Loaded Variable Cost is computed per request/scenario, and how it feeds `../pricing/scenario-costs.csv`. |
| [`credit-engine-requirements.md`](credit-engine-requirements.md) | Functional requirements for the internal Credit Engine — no credit values assigned. |
| [`margin-policy.md`](margin-policy.md) | The structure a margin policy needs — no target margin assigned (founder decision, human-review gate). |
| [`subscription-model-requirements.md`](subscription-model-requirements.md) | What a subscription tier needs to define — no subscription prices assigned (founder decision, human-review gate). |
| [`budget-scenarios.md`](budget-scenarios.md) | The scenario framework (best/base/worst-case, high-usage, price-increase, failover) — no user-volume assumptions invented. |

## Relationship to existing Platform pricing docs

This folder is about **vendor cost and the internal cost model** feeding pricing decisions. `../architecture/pricing-architecture.md` and ADR-0009 are about the **separate, already-implemented** customer-facing `PricingPipeline` (cost → price via markup/campaign/floor rules). The two meet at exactly one point: this folder's Fully Loaded Variable Cost is the `costMinorUnits` input `PricingPipeline` already expects — nothing here changes or duplicates that pipeline's own design.

## Relationship to AIFA_Brain

`AIFA_Brain/11_Pricing/` and `AIFA_Brain/02_Business/Financial_Planning/` hold the **ratified business decision** (once the founder actually sets a margin, subscription price, etc.); this folder holds the **requirements/framework** that decision needs to be expressed against. Cross-link, don't duplicate — see `AIFA_Brain/11_Pricing/README.md`'s existing pointer to `AIFA_Brain/04_Research/Market_Intelligence/05_Pricing_Intelligence.md` for the analogous customer-facing (Toman) margin research this folder's *vendor-cost* side complements.

## Related documents

- `../pricing/README.md` (the raw data these methodologies consume)
- `../adr/0025-pricing-source-of-truth.md` (how the underlying vendor prices are sourced)
- `AIFA_Brain/11_Pricing/README.md`, `AIFA_Brain/04_Research/Market_Intelligence/05_Pricing_Intelligence.md`
