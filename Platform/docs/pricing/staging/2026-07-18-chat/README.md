# Staging: 2026-07-18 chat provider-pricing batch

**Status:** Staging only. No production `Platform/docs/pricing/*.csv` row was written by this package. All 180 staged records are `PENDING` or `REJECTED` — see below.

## What this is

The reconciled, deterministic Phase E input package for the chat-portfolio provider-pricing audit (Phase C raw research → Phase C.5 official verification → Phase D proposed ingestion plan → this Phase D.5 synchronization). Produced by importing and reconciling three supplied artifacts, preserved at [`AIFA_Brain/04_Research/Pricing_Research/Provider_Pricing_Audit/`](../../../../../AIFA_Brain/04_Research/Pricing_Research/Provider_Pricing_Audit/00_Summary.md), against this repository's actual, live schemas.

## Start here

1. [`../../../../../AIFA_Brain/04_Research/Pricing_Research/Provider_Pricing_Audit/00_Summary.md`](../../../../../AIFA_Brain/04_Research/Pricing_Research/Provider_Pricing_Audit/00_Summary.md) — the full narrative, including the headline finding (source-URL provenance gap) that caps every record in this package at `PENDING`.
2. [`SCHEMA_RECONCILIATION.md`](SCHEMA_RECONCILIATION.md) — how Phase D's proposed schemas compare to this repository's real ones.
3. [`PHASE_E_RUNBOOK.md`](PHASE_E_RUNBOOK.md) — the exact, ordered execution plan for a future implementation agent.

## Package contents

| File | Records | Section |
|---|---|---|
| [`sources.yaml`](sources.yaml) | 13 | A — proposed source registry entries |
| [`model_facts.yaml`](model_facts.yaml) | 68 | B — atomic model identity/spec facts |
| [`pricing_facts.yaml`](pricing_facts.yaml) | 64 | C — atomic pricing facts |
| [`commercial_policy_facts.yaml`](commercial_policy_facts.yaml) | 11 | D — staging-only commercial/legal facts (no production destination exists yet) |
| [`audit_gaps.yaml`](audit_gaps.yaml) | 14 | E — every held, conflicting, or unverified claim, including the 2 rejected xAI corrections and the 1 URL-provenance meta-gap |
| [`mapping_manifest.yaml`](mapping_manifest.yaml) | 10 | F — per-record-class mapping type, eligibility, and required approvals |
| [`SCHEMA_RECONCILIATION.md`](SCHEMA_RECONCILIATION.md) | — | Human-readable reconciliation narrative |
| [`PHASE_E_RUNBOOK.md`](PHASE_E_RUNBOOK.md) | — | Ordered execution plan, stop conditions, expected commits |

## Disposition summary

- **`ELIGIBLE`: 0.** No fact in this batch is automatically ready for production.
- **`PENDING`: 178.** Otherwise well-evidenced (mostly Phase C.5 `OFFICIAL_VERIFIED`/`OFFICIAL_DERIVED`), blocked by the source-URL re-confirmation requirement (see the summary's headline finding) and, for a subset, also by an unresolved schema gap (`mapping_manifest.yaml`'s `no-fit / approval-required` entries).
- **`REJECTED`: 2.** The two xAI corrections (batch-discount claim, rate-limit unit) — actively contradicted by official evidence per Phase C.5, preserved explicitly so they cannot silently re-enter production through a later copy or import.

## What this package does not do

Per this synchronization task's explicit scope: no production pricing row was written, no runtime code or validator behavior was changed, no `commercial-terms.csv` was created, no AIFA Credit/margin/subscription/scenario-cost calculation was performed. See [`PHASE_E_RUNBOOK.md`](PHASE_E_RUNBOOK.md) for what happens next and under what conditions.

## Related documents

- `../../README.md` (the production pricing folder this package feeds)
- `../../../adr/0025-pricing-source-of-truth.md`, `../../../adr/0026-phase-c5-evidence-vocabulary-mapping.md`
- `AIFA_Brain/04_Research/Pricing_Research/Provider_Pricing_Audit/00_Summary.md`
