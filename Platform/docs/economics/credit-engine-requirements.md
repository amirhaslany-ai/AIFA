# Credit Engine — requirements

**Status:** Requirements only. No credit values, conversion rates, or multipliers are assigned here — that is a founder decision (human-review gate) building on top of these requirements once Phase C pricing data exists.

## Purpose

Document what the internal Credit Engine must be able to do, so that whenever it is designed/implemented, it is designed against a complete requirements list rather than discovered incrementally.

## Required capabilities

The engine must support:

- One canonical **internal monetary base** (a single unit of account all provider usage converts into — distinct from customer-facing currency, per `../../AIFA_Brain/04_Research/Market_Intelligence/05_Pricing_Intelligence.md`'s "wallet holds/displays real Toman, not abstract credits" finding, which this internal base must not contradict at the customer-facing layer).
- **Provider-specific usage dimensions** (tokens, images, seconds, minutes, characters, songs — one per capability, per `../providers/README.md`'s field list).
- **Deterministic conversion** from provider usage to internal cost — the same usage always converts to the same cost given the same price version (no randomness, no floating-point drift — mirrors ADR-0009's integer/basis-points discipline).
- **Model multipliers**, **quality multipliers**, **resolution multipliers**, **duration multipliers**, **regional multipliers**, **realtime multipliers** — each a named, documented dimension, not folded into an opaque single number.
- **Plan-based discounts** and **promotional credits** as distinct, auditable adjustments (mirrors `pricing-architecture.md`'s campaign-rule pattern on the customer-price side; the Credit Engine needs the analogous concept on the internal-cost side).
- **Minimum charge** and **rounding** rules, explicit and consistent (ceiling division, never floats — per ADR-0009's existing precedent).
- **Refunds**, **failed requests**, and **partial generations** as first-class cases, not edge cases bolted on later.
- **Retries** and **provider substitutions** reflected accurately in cost (a retried or substituted call must not silently double-count or silently drop cost).
- **Cached-token discounts** and **batch discounts**, where a provider offers them (several already documented as available in `../pricing/provider-pricing.csv` once populated).
- **Price-effective dates** and **versioned pricing** — every price has an `effective_from`/`effective_to` per ADR-0025; **historical invoices must never be mutated when pricing changes.**
- **Auditable usage events** — every usage event traceable to the price version active when it occurred.
- **Cost reconciliation** — the ability to verify, after the fact, that internal cost matches what the provider actually billed AIFA.
- **Gross-margin reporting** — computed from internal cost vs. customer price, per account/plan/provider/capability.

## Explicit non-goals of this document

- No AIFA Credit value, conversion rate, or multiplier is assigned. Assigning final credit values is listed as a human-review gate in the audit mission and is out of scope here.
- No subscription price or margin target is assigned (see `subscription-model-requirements.md`, `margin-policy.md`).

## Related documents

- ADR-0009, `../architecture/pricing-architecture.md`, `../architecture/cost-routing.md`
- `pricing-methodology.md`, `cost-model.md`
- `AIFA_Brain/04_Research/Market_Intelligence/05_Pricing_Intelligence.md`
