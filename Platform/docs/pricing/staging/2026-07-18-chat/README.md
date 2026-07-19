# Staging: 2026-07-18 chat provider-pricing batch

**Status:** Staging only. No production `Platform/docs/pricing/*.csv` row has been written by this package.

The reconciled, deterministic Phase E input package for the chat-portfolio provider-pricing audit (Phase C raw research → Phase C.5 official verification → Phase D proposed ingestion plan → Phase D.5 synchronization). Full narrative, the corrected verified/schema-fit/ingestion-safe breakdown, and real counts: [`AIFA_Brain/04_Research/Pricing_Research/Provider_Pricing_Audit/00_Summary.md`](../../../../../AIFA_Brain/04_Research/Pricing_Research/Provider_Pricing_Audit/00_Summary.md).

## Files

| File | Records | Destination |
|---|---|---|
| [`sources.yaml`](sources.yaml) | 13 | `sources.csv` |
| [`model_facts.yaml`](model_facts.yaml) | 68 | `model-pricing.csv` |
| [`pricing_facts.yaml`](pricing_facts.yaml) | 64 | `provider-pricing.csv` |
| [`commercial_policy_facts.yaml`](commercial_policy_facts.yaml) | 11 | `commercial-terms.csv` (does not exist yet — founder decision pending) |
| [`audit_gaps.yaml`](audit_gaps.yaml) | 14 | `pricing-audit-gaps.csv` (includes the 2 `REJECTED` xAI corrections) |
| [`mapping_manifest.yaml`](mapping_manifest.yaml) | 10 record classes | Machine-readable schema-mapping + founder-approval-required table |
| [`PHASE_E_RUNBOOK.md`](PHASE_E_RUNBOOK.md) | — | Ordered implementation checklist |

## Disposition

130 of 143 staged model/pricing/commercial facts are officially verified (Phase C.5 `OFFICIAL_VERIFIED`/`OFFICIAL_DERIVED`); of those, 90 are blocked only by routine source-URL re-confirmation and 40 also need one of 4 founder/architecture decisions. 13 facts are still genuinely unverified (research gap, not a decision). 2 xAI claims are `REJECTED` (contradicted by official evidence). See `00_Summary.md` for the full breakdown — do not infer "0 eligible" as "nothing verified."

## Related documents

- `../../README.md` (the production pricing folder this package feeds)
- `../../../adr/0025-pricing-source-of-truth.md`, `../../../adr/0026-phase-c5-evidence-vocabulary-mapping.md`
