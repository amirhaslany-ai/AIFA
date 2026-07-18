# ADR-0026: Mapping an external evidence vocabulary onto ADR-0025, and a staging-only disposition axis

**Status:** Accepted
**Date:** 2026-07-18
**Decision owners:** AIFA founder / Platform maintainers
**Related:** ADR-0025 (pricing source-of-truth methodology — the vocabulary this ADR maps onto, not edits)
**Supersedes:** none
**Superseded by:** none

## Context

A supplied provider-pricing audit (chat portfolio — "Phase C" raw research, "Phase C.5" official verification pass, "Phase D" proposed ingestion plan) uses its own evidence-classification vocabulary (`OFFICIAL_VERIFIED`, `OFFICIAL_DERIVED`, `SECONDARY_ONLY`, `CONFLICTING`, `UNVERIFIED`) and its own ingestion-readiness gate (`READY`/`WAIT`/`BLOCKED`). ADR-0025 already defines a confidence vocabulary (`OFFICIAL_EXPLICIT`, `OFFICIAL_DERIVED`, `OFFICIAL_AMBIGUOUS`, `CONTRACT_REQUIRED`, `UNVERIFIED`) for the same general purpose. Per `Agents/KNOWLEDGE_ACCESS_RULES.md`, `Platform/docs/adr/` is append-only — an Accepted ADR is superseded by a new entry, never edited in place. This ADR is that new entry: it does not alter ADR-0025's text, but records how an externally-vocabularied evidence source maps onto it, so future imports of similarly-vocabularied research don't each invent their own ad hoc mapping.

## Problem

Without a recorded mapping, every future research pass that arrives with its own confidence/readiness vocabulary (as this one did) would either (a) silently overwrite ADR-0025's vocabulary with a new one each time, fragmenting the schema across imports, or (b) require re-deciding the same mapping question from scratch.

## Decision

1. **Phase C.5's evidence classes map onto ADR-0025's confidence vocabulary as follows**, for any field intended for production ingestion:

   | Phase C.5 (external) | ADR-0025 (production) | Effect |
   |---|---|---|
   | `OFFICIAL_VERIFIED` | `OFFICIAL_EXPLICIT` | Eligible, pending source re-confirmation (see §3) |
   | `OFFICIAL_DERIVED` | `OFFICIAL_DERIVED` | Eligible if the derivation formula is retained, pending source re-confirmation |
   | `SECONDARY_ONLY` | `UNVERIFIED` (for production eligibility) | Not eligible; original Phase C.5 state retained in staging/audit metadata, not discarded |
   | `CONFLICTING` | *(no production mapping — prohibited)* | Never enters production; retained only as an audit-gap reason |
   | `UNVERIFIED` | `UNVERIFIED` | Not eligible |

   This mapping pattern — reduce an external vocabulary onto ADR-0025's five values, never silently invent a sixth production value — is the general rule for any future externally-vocabularied import, not specific to this one audit.

2. **Three independent dimensions must never be conflated**, each already established or introduced here:
   - **Portfolio lifecycle status** (`Platform/docs/portfolio/README.md`'s existing taxonomy: `VERIFIED_ACTIVE`, `VERIFIED_PREVIEW`, `AIFA_ALIAS`, `PLANNED`, `RESERVE`, `WATCHLIST`, `INTEGRATION_GATED`, `UNVERIFIED`) — is this AIFA product decision live, planned, reserved, etc.
   - **Pricing/evidence confidence** (ADR-0025's vocabulary, extended by the mapping in §1) — how well-sourced is this specific fact.
   - **Staging/ingestion disposition** (new, this ADR): `ELIGIBLE` / `PENDING` / `REJECTED` — is this fact ready for a human/Phase-E process to act on right now.

   A `model-pricing.csv` row's `portfolio_status` and a `provider-pricing.csv` row's `confidence` already exist as production columns. **The staging disposition is new and is explicitly NOT added to any production CSV schema by this ADR** — it exists only in staging/audit packages (e.g. `Platform/docs/pricing/staging/`) as a package-level field, because it answers "is this ready to become a production row," a question that is meaningless once a fact *is* a production row.

3. **Staging disposition values, defined:**
   - `ELIGIBLE` — meets ADR-0025's full eligibility bar (exact provider/subject, exact official URL or source_id, verification/access date, evidence classification, explicit/derived method with formula if derived, no unresolved conflict) from evidence *internal to the supplied research bundle itself* — not inherited from a lower-precedence, self-described-as-unverified proposal.
   - `PENDING` — otherwise well-evidenced but missing one element of the eligibility bar (commonly: an independently-confirmed source URL, or a not-yet-fetched follow-up page). Resolvable by more research, not a policy decision.
   - `REJECTED` — actively contradicted by official evidence (`CONFLICTING`), or a business/legal/architecture decision explicitly declines to ingest it.

## Decision drivers

- ADR-0025 already anticipated exactly this situation ("official sources only... confidence-labeled, versioned") but did not anticipate that an *external* audit would arrive with its *own* vocabulary — this ADR closes that gap without reopening ADR-0025's text.
- Keeping the append-only ADR discipline (per `Agents/KNOWLEDGE_ACCESS_RULES.md`) means every future reconciliation of this kind gets its own numbered record, preserving the full history of how the vocabulary evolved.
- Explicitly forbidding the staging disposition from entering production schemas prevents scope creep — a future contributor should not need to ask "why does `model-pricing.csv` have both `pricing_status` and `staging_disposition` columns that mean almost the same thing."

## Alternatives considered

- **Edit ADR-0025 directly** to add the new vocabulary: rejected — violates the repository's append-only ADR convention (`Agents/KNOWLEDGE_ACCESS_RULES.md`), and would erase the historical record of what ADR-0025 originally specified before this mapping need arose.
- **Add the external vocabulary's values directly to production CSV `confidence` columns** (e.g. allow `OFFICIAL_VERIFIED` as a literal value in `provider-pricing.csv.confidence`): rejected — fragments the confidence vocabulary across every future import instead of normalizing to one production standard (ADR-0025's), which is the entire reason ADR-0025 exists.
- **Add a `staging_disposition` column to the production CSVs now, defaulted to `PENDING`**: rejected — conflates "is this row good enough to exist in the Source of Truth" (a precondition for the row existing at all) with "did we finish evaluating it" (a workflow state that has no meaning once the row exists); a production row's mere presence already implies disposition was resolved.

## Consequences

- Any future audit with its own evidence/readiness vocabulary should produce a mapping table in this same shape (external → ADR-0025) rather than inventing new production-facing terms.
- `Platform/docs/pricing/staging/2026-07-18-chat/` is the first user of the `ELIGIBLE`/`PENDING`/`REJECTED` disposition defined here.
- No production CSV schema changes as a result of this ADR.

## Risks

- If a future contributor skips reading this ADR, they may re-litigate the mapping question or add a competing vocabulary. Mitigated by cross-linking from every relevant document (staging package, schema-reconciliation manifest, `Platform/docs/pricing/README.md`).

## Implementation implications

- The Phase E runbook (`Platform/docs/pricing/staging/2026-07-18-chat/PHASE_E_RUNBOOK.md`) references this ADR's mapping table directly rather than restating it.

## Related documents

- `Platform/docs/adr/0025-pricing-source-of-truth.md`
- `Platform/docs/portfolio/README.md` (the portfolio lifecycle taxonomy, dimension 1)
- `Platform/docs/pricing/staging/2026-07-18-chat/` (first application of this ADR)
- `AIFA_Brain/04_Research/Pricing_Research/Provider_Pricing_Audit/00_Summary.md`
