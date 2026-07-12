# ADR-0009: Pricing as an ordered rule pipeline, separate from cost and ledger

**Status:** Accepted (design-only — not implemented)
**Date:** 2026-07-12
**Related:** `docs/architecture/pricing-architecture.md`, ADR-0007 (AI provider cost layer), ADR-0008 (wallet ledger)

## Context

Charging customers for metered AI usage requires turning a raw provider cost into a customer-facing price, potentially adjusted by markup, plan tier, and promotional campaigns — and that computation needs to be auditable (reproducible after the fact for billing disputes) and extensible (new campaign types without rewriting the engine).

## Decision

Pricing is a separate concern from both the AI Provider Layer (which only reports raw cost) and Wallet (which only records ledger entries) — implemented as an ordered rule pipeline: base markup → campaign/discount rules (priority-ordered) → floor. Every rule that fires on a given calculation is recorded, and rules are versioned/immutable (a rule change publishes a new version rather than mutating the active one).

## Rationale

- Separating cost (Provider Access), price (Pricing), and ledger mechanics (Wallet) means a change to any one — a vendor's pricing, a new campaign, a wallet-implementation detail — doesn't ripple into the others. This is the same single-responsibility argument already applied to the AI provider abstraction (ADR-0005) extended to the money side of the system.
- An ordered, recorded rule pipeline (vs. an unordered "first match wins" rule set) keeps pricing predictable as the number of rules grows — a common failure mode in ad hoc discount systems is rules interacting in ways nobody intended because evaluation order was implicit.
- Immutable/versioned rules mirror the ledger's own append-only principle (ADR-0008) — a billing dispute needs to reconstruct "what rule was active when this charge happened," which a mutable rule table can't answer after the fact.

## Alternatives considered

- **Compute price inline wherever cost is known** (no separate engine): rejected — makes campaigns/discounts a scattered, hard-to-audit set of if-statements rather than a single reviewable pipeline.
- **Third-party pricing/billing platform:** same build-vs-buy consideration as ADR-0008 — not decided here, this ADR only fixes the internal model if built in-house.

## Consequences

- No `PricingEngine`, `Campaign`, or rule tables exist yet — this is the target shape for whenever Billing is implemented.
- Any future implementation that computes a customer price without going through this pipeline (e.g. a hardcoded multiplier in a controller) violates this ADR.
