# Pricing methodology

**Status:** Framework/requirements only — no final percentages or dollar amounts. Placeholders are marked explicitly where a business decision is still required.

## What must be distinguished

A customer-facing price is never just "vendor cost × markup." This document distinguishes every cost component that a correct model must account for, so none is silently folded into another or forgotten:

- **PAYG variable cost** — the vendor's own metered price for the actual usage (`../pricing/provider-pricing.csv`, once populated).
- **Subscription allocation** — where AIFA itself pays a vendor subscription/plan fee (not pure PAYG), the per-request share of that fixed cost.
- **Committed-use discounts** — where a vendor offers a lower rate for a volume/spend commitment, the effective rate once committed (distinct from list PAYG price).
- **Reseller or aggregator markup** — where AIFA routes through a gateway/aggregator (e.g. `fal` per `../providers/fal.md`) rather than a vendor directly, the aggregator's own markup over the vendor's raw rate.
- **Tax** — sales tax/VAT/equivalent, jurisdiction-dependent.
- **Currency conversion** — FX spread where a vendor bills in a currency AIFA doesn't hold natively.
- **Payment processing** — the fee charged by AIFA's own payment processor for collecting from the customer.
- **Storage** — where a vendor or AIFA itself stores generated assets (images/video/audio) beyond the generation call itself.
- **Bandwidth / egress** — data-transfer cost for serving generated assets to the customer.
- **Retries** — a failed vendor call that AIFA retries may be billed by the vendor more than once for one customer-facing result; this is a real cost, not free.
- **Failed generations** — a vendor call that fails outright (no usable output) may still be billed by the vendor; whether AIFA absorbs this cost or a refund policy applies is a policy decision, not assumed here.
- **Moderation** — where content moderation is a separately billed vendor call (per ADR-0025 §6.2's `moderation_fee`).
- **Support cost** — the amortized cost of supporting a paying customer, not zero.
- **Observability** — logging/monitoring cost attributable to serving AI requests.
- **Fraud** — expected loss rate from fraudulent usage (stolen cards, abuse), amortized into the cost model rather than ignored.
- **Promotional credits** — credits given away (free trial, referral bonus) that consume real vendor cost with no matching revenue.
- **Free-tier consumption** — the same, for standing free-tier usage limits (ADR-0018 policy: usage-limited, not model-downgraded — meaning free-tier usage still costs real vendor money).
- **Provider minimum commitments** — where a vendor requires a minimum monthly spend regardless of actual usage, the amortized cost of any unused commitment.

## Fully Loaded Variable Cost

```
Provider Cost
+ Gateway or Aggregator Cost
+ Retry Allowance
+ Storage and Egress
+ Moderation
+ Payment Processing Allocation
+ Support Allocation
+ Risk Buffer
= Fully Loaded Variable Cost
```

**No arbitrary percentages are assigned to any line above.** Each is a placeholder requiring either (a) real measured data (e.g. actual retry rate, actual fraud rate) or (b) an explicit founder decision (e.g. how much Support Allocation to assume per request) — tracked as an open business input, not guessed.

## Related documents

- `cost-model.md` (how this formula is actually computed per scenario)
- `../pricing/scenario-costs.csv` (where computed values land)
- `../adr/0025-pricing-source-of-truth.md`, `../architecture/pricing-architecture.md`
