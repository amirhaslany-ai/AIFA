# ADR-0025: Pricing source-of-truth methodology — official sources only, confidence-labeled, versioned

**Status:** Accepted
**Date:** 2026-07-17
**Decision owners:** AIFA founder (product/architecture/finance)
**Related:** ADR-0009 (pricing engine — internal rule pipeline mechanism), `docs/architecture/pricing-architecture.md`, `docs/economics/pricing-methodology.md`, `docs/pricing/sources.csv`
**Supersedes:** none
**Superseded by:** none

## Context

ADR-0009 and `pricing-architecture.md` decide how AIFA computes a *customer* price from a *known* cost (`PricingPipeline`: base markup → campaign rules → floor). They do not decide how AIFA determines what a *vendor* actually charges in the first place — the raw cost input to that pipeline. As the portfolio expands to ~20 providers across six capabilities (ADR-0018–0023), sourcing that raw cost reliably, without fabrication, and in a way that survives an audit, is its own decision this ADR fixes.

## Problem

Vendor pricing pages are inconsistent in clarity, some prices require deriving a per-unit rate from a bundled subscription (risky — see Decision), some require a sales contract, and using low-quality secondary sources (blogs, comparison sites, reseller marketing) as if they were primary risks building a cost model on invented or stale numbers — a failure mode explicitly forbidden by the audit mission.

## Decision

1. **Only official sources are primary evidence**: a provider's own pricing page, API documentation, model documentation, cloud marketplace listing, developer announcement, or terms/commercial documentation. Blogs, comparison sites, social posts, search snippets, and reseller marketing pages are never a primary source; they may be noted as corroborating color only, never as the cited price.
2. **Every pricing row carries a confidence label** from a fixed vocabulary (`docs/economics/pricing-methodology.md` §Confidence): `OFFICIAL_EXPLICIT`, `OFFICIAL_DERIVED` (with the derivation formula stated), `OFFICIAL_AMBIGUOUS`, `CONTRACT_REQUIRED`, `UNVERIFIED`. A derived value is never presented in the same field as an explicit PAYG price without being labeled as derived.
3. **Consumer subscription pricing is never treated as API/PAYG pricing.** A bundled subscription allowance is never silently converted into a definitive per-unit PAYG rate; if a per-unit rate must be derived from a plan, it is labeled `OFFICIAL_DERIVED` with the formula shown.
4. **Every verified row carries a verification timestamp** (`verified_at`) and a `source_id` resolving to `docs/pricing/sources.csv` (url, title, publication/update date, access date).
5. **Missing data is recorded as a gap, never invented.** `docs/pricing/pricing-audit-gaps.csv` is the explicit, ranked backlog of what remains unresolved — an empty or `UNVERIFIED` field is correct; a guessed field is not.
6. **Pricing is versioned, never mutated retroactively.** A vendor price change is a new row with a new `effective_from` date; historical rows (and any invoice/scenario computed against them) are never edited after the fact — mirroring ADR-0009's own append-only/immutable-rule principle applied to the vendor-cost side of the same problem.

## Decision drivers

- The audit mission explicitly forbids fabricating prices, model IDs, or commercial terms — a fixed sourcing hierarchy and confidence vocabulary is what makes "did not fabricate" a checkable property of the dataset rather than a promise.
- ADR-0009's pricing engine already treats its own rules as versioned and auditable; the vendor-cost side of the same billing-critical path deserves the same discipline, or a billing dispute could be traced back to a rule version but not to *why* the underlying cost figure was believed correct at the time.
- Distinguishing subscription pricing from PAYG/API pricing prevents a specific, easy-to-make analytical error (treating "$20/mo for 100 generations" as "$0.20/generation" without accounting for unused allowance, rate limits, or plan-only terms) that would silently poison the cost model.

## Alternatives considered

- **Best-effort sourcing without a formal confidence vocabulary**: faster to produce, but makes it impossible to later distinguish "we know this precisely" from "we guessed" once the dataset has more than a handful of rows — rejected, since the entire purpose of this audit is to be a durable, trustworthy foundation.
- **Treating all secondary/aggregator sources as usable primary evidence** (as AIFA_Brain's Market Intelligence Foundation does for competitive intelligence, e.g. Sacra/Similarweb estimates): appropriate for *market* research where an estimate is the best available evidence, but rejected here — vendor pricing that funds AIFA's own billing-critical cost model needs a stricter bar than competitive-intelligence estimates.

## Consequences

- `docs/pricing/provider-pricing.csv`, `model-pricing.csv`, and `sources.csv` are structured to carry confidence, source, and verification-date fields on every row (schemas defined in Phase C of this audit).
- Any pricing figure appearing in `docs/economics/` narrative documents must be traceable to a `source_id`; a number with no traceable source does not belong in those documents.
- This ADR does not itself contain any prices — it is a methodology decision. Actual provider pricing research and population of the CSVs is separate work (tracked in `docs/pricing/pricing-audit-gaps.csv` until complete).

## Risks

- A provider's official page can itself be ambiguous, region-dependent, or silently change without a visible update date — `OFFICIAL_AMBIGUOUS` exists precisely to make this visible rather than forcing a false-precision `OFFICIAL_EXPLICIT` label.
- FX-denominated or region-varying prices (relevant to several providers in `docs/providers/`) compound the staleness risk already documented in AIFA_Brain's pricing research (`AIFA_Brain/04_Research/Market_Intelligence/05_Pricing_Intelligence.md`'s FX caveat) — the same "never hardcode, always re-verify" discipline applies here to vendor cost, not just customer-facing Toman price.

## Mitigations

- `verified_at` timestamps make staleness detectable (an old date is a visible signal to re-check, not a silent trust).
- The update-cadence table in `AIFA_Brain/04_Research/Market_Intelligence/00_Master_Index.md` Part 5 is the model for a similar cadence table this audit's economics docs should adopt once populated.

## Implementation implications

- The Credit Engine (`docs/economics/credit-engine-requirements.md`) must consume `effective_from`/`effective_to` versioned pricing and must never mutate a historical usage event's cost after the fact when a price changes.

## Related documents

- `docs/economics/pricing-methodology.md`, `docs/pricing/README.md`, `docs/pricing/sources.csv`
- ADR-0009, `docs/architecture/pricing-architecture.md`
- `AIFA_Brain/04_Research/Market_Intelligence/05_Pricing_Intelligence.md` (the analogous discipline already applied to customer-facing Toman pricing)
