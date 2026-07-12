# Pricing Architecture (Implemented — Sprint 1)

**Status:** implemented — `apps/api/src/pricing.module.ts`, `domain/pricing/`. No HTTP surface (Pricing is invoked by other use cases, not called directly by a client — see `pricing.module.ts`'s doc comment). No campaign/discount rules exist yet — the pipeline is base markup + floor only; inventing fake campaign data was deliberately avoided.

## Relationship to Wallet and AI Provider Layer

Three distinct concerns, deliberately kept separate (single-responsibility, restated from `ai-provider-layer.md`'s cost-layer note):

```
AI Provider Layer  →  "this call cost us $0.0031"          (raw cost, actual usage × vendor rate)
Pricing Engine     →  "we charge the customer $0.0050"     (raw cost × markup × any applicable rule)
Wallet             →  "debit $0.0050 from this account"    (ledger mechanics, ADR-agnostic to *why* the amount is what it is)
```

Pricing sits between the two: it consumes a cost figure and an account/request context, and produces a price. It never touches the ledger directly (Wallet does that) and never estimates AI usage itself (Provider Access does that).

## Pricing Engine

A `PricingEngine` port (target interface):

```ts
interface PricingRequest {
  accountId: AccountId;
  providerId: ProviderId;
  costMinorUnits: number;   // from AI Provider Layer's cost layer
  requestedAt: Date;
}

interface PricingResult {
  priceMinorUnits: number;
  appliedRules: string[];    // rule ids that fired, for the audit trail / customer-facing receipt
}

interface PricingEngine {
  calculate(request: PricingRequest): Promise<PricingResult>;
}
```

## Rule Engine

Pricing rules are evaluated in a fixed, documented order (not "first match wins" across an unordered set, which becomes unpredictable as rules grow):

1. **Base markup** — always applies. `priceMinorUnits = costMinorUnits * markupMultiplier` (e.g. 1.3x), multiplier sourced from config, not hardcoded (mirrors the AI-provider "no hardcoding" principle applied to business rules).
2. **Campaign/discount rules** — applied after base markup, each rule either multiplies (percentage discount) or subtracts (flat discount) from the running price, evaluated in priority order, first-applicable-per-category wins (e.g. one "new user" discount and one "volume" discount don't both apply if they're in the same category, but a new-user discount and a specific-provider promotion might stack — category definitions are a product decision, flagged not guessed).
3. **Floor** — price is never less than zero, and a configurable minimum-price-per-call floor may apply (prevents a stacked-discount edge case from making calls effectively free in a way that breaks the cost model) — the floor value itself is a product decision.

Every rule that fires is recorded in `PricingResult.appliedRules`, feeding both the customer-facing receipt (transparency) and `wallet-architecture.md`'s ledger entry's context (for support/dispute investigation).

## Cost sources

The engine's input (`costMinorUnits`) always originates from the AI Provider Layer's real, post-call usage report — never a static per-provider table queried independently by Pricing. This avoids the two layers' cost figures drifting apart (e.g. if a vendor's pricing changes, only the Provider Access layer's cost table needs updating, per ADR-0007's cost-layer design).

## Markup layer

Markup multiplier is per-provider (some vendors may warrant a different margin) and per-plan (a future paid-tier account might get a lower multiplier than a free-tier one) — modeled as a lookup: `(providerId, accountPlan) → multiplier`, defaulting to a single global multiplier until multiple plans exist (no plan tiers are designed yet — flagged, not invented here).

## Future discounts / campaign support

A `Campaign` entity (target, not implemented): `id`, `name`, `discountRule` (percentage or flat), `startsAt`/`endsAt`, `eligibility` (e.g. "new accounts only," "specific provider only" — an eligibility predicate, not a hardcoded condition, so new campaign types don't require code changes to the engine itself, only a new eligibility rule implementation registered the same way AI providers are registered in `ProviderRegistry`).

## Versioning

Pricing rules change over time (a markup multiplier update, a new campaign). Every `PricingResult` should be reproducible after the fact for billing disputes — meaning the rule *version* active at calculation time must be recorded (not just which rules fired, but which version of each rule). Target design: rules are immutable once published (a rule change creates a new rule id/version rather than mutating an existing one), mirroring the ledger's own append-only, never-mutate principle — consistency between Wallet and Pricing's approach to auditability is intentional, not coincidental.

## What this document deliberately does not decide

- Actual markup percentages, discount amounts, or plan tiers — business decisions requiring founder input.
- Whether pricing is computed synchronously (blocking the AI response) or asynchronously (response returns first, price/debit settles moments later) — affects perceived latency vs. billing accuracy trade-off; flagged as an open implementation-time decision, not fixed here since it depends on how strict the reservation flow (`wallet-architecture.md`) needs to be, which itself depends on founder risk tolerance for undercharging vs. added latency.
