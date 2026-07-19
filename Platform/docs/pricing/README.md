# Pricing (machine-readable)

The machine-readable counterpart to `../portfolio/` and `../providers/`. **As of 2026-07-17 (Phase B), only decision data is populated — no pricing data exists yet.** Phase C populates the pricing/commercial columns from official sources only, per `../adr/0025-pricing-source-of-truth.md`.

## Files

| File | Populated in Phase B? | Contents |
|---|---|---|
| [`assumptions.yaml`](assumptions.yaml) | **Yes — fully** | Standardized comparison scenarios (these are fixed inputs from the product decision, not research findings). |
| [`model-pricing.csv`](model-pricing.csv) | **Yes — decision columns only** | One row per routable AIFA model variant (81 rows). `aifa_model_id`, `aifa_display_name`, `category`, `capability`, `portfolio_status`, `primary_provider`, `backup_provider`, `notes` are populated from the locked portfolio ADRs (0018–0023). `official_model_id`, `pricing_record_id`, `pricing_status`, `commercial_status`, `region_status`, `effective_from`, `effective_to`, `verified_at` are blank pending Phase C. |
| [`provider-pricing.csv`](provider-pricing.csv) | Header only | One row per provider billing dimension/plan — populated entirely in Phase C. |
| [`scenario-costs.csv`](scenario-costs.csv) | Header only | One row per computed scenario cost (a model variant costed against an `assumptions.yaml` scenario) — populated entirely in Phase C, once real provider pricing exists. Consumed by [`../economics/cost-model.md`](../economics/cost-model.md). |
| [`sources.csv`](sources.csv) | Header only | Every official source cited, with URL/title/dates — populated entirely in Phase C. |
| [`pricing-audit-gaps.csv`](pricing-audit-gaps.csv) | Header + seed rows | Gaps already known from the locked product decisions themselves (e.g. Suno's API-existence gate) are seeded now; Phase C adds every gap it actually encounters. |

## Column schemas

See `../adr/0025-pricing-source-of-truth.md` for the confidence vocabulary (`OFFICIAL_EXPLICIT`, `OFFICIAL_DERIVED`, `OFFICIAL_AMBIGUOUS`, `CONTRACT_REQUIRED`, `UNVERIFIED`) and `../providers/README.md` for the full field list Phase C populates per provider.

## Validation

`validate_pricing.py` (stdlib-only, run in CI via the `validate-pricing-data` job in `.github/workflows/aifa-platform-ci.yml`) enforces, per the audit mission §12:

- **All six required datasets exist** (`provider-pricing.csv`, `model-pricing.csv`, `scenario-costs.csv`, `sources.csv`, `pricing-audit-gaps.csv`, `assumptions.yaml`) — a missing dataset fails the build, even when it is legitimately header-only in this phase.
- Consistent column count per row across every CSV.
- No duplicate `aifa_model_id` (`model-pricing.csv`), `source_id`, `gap_id`, or `scenario_id`.
- ADR numbers are unique; relative markdown links under `docs/` resolve.
- Required scenario keys are present in `assumptions.yaml`.

Not yet enforced by the script (checked by review until implemented): that every populated pricing row has a resolving `source_id` or is explicitly `UNVERIFIED`; that every `verified_at` is a real date; and that every `OFFICIAL_DERIVED` value states its formula. **`assumptions.yaml` is only structurally checked, not parsed** — no YAML parser is available in the stdlib, so key-presence/tab checks are used; this is not equivalent to a full parse (see the script's module docstring).

## Staging batches (Phase E input, not yet production)

Reconciled, ready-for-review research batches land in `staging/<date>-<scope>/` before any row is written to the CSVs above — never committed directly. Each batch has its own `README.md`, a machine-readable `mapping_manifest.yaml` (schema mapping + founder-approval-required table), a `PHASE_E_RUNBOOK.md` implementation checklist, and atomic-fact YAML files.

| Batch | Scope | Status |
|---|---|---|
| [`staging/2026-07-18-chat/`](staging/2026-07-18-chat/README.md) | Chat portfolio (13 models, 7 providers + OpenRouter) — Phase C research → Phase C.5 verification → Phase D ingestion plan → Phase D.5 synchronization | 130 of 143 staged model/pricing/commercial facts officially verified (90 blocked only by routine source-URL re-confirmation, 40 also need one of 4 founder/architecture decisions); 13 still genuinely unverified; 2 `REJECTED` (xAI corrections). See its `README.md`/`00_Summary.md` for the full breakdown and `PHASE_E_RUNBOOK.md` for what's next. |

## Related documents

- `../portfolio/README.md` (the classification taxonomy `portfolio_status` uses)
- `../adr/0025-pricing-source-of-truth.md`, `../adr/0026-phase-c5-evidence-vocabulary-mapping.md`
- `../economics/cost-model.md` (consumes `scenario-costs.csv` — header-only now, rows added in Phase C)
- `../../../AIFA_Brain/04_Research/Pricing_Research/Provider_Pricing_Audit/00_Summary.md` (the AIFA_Brain knowledge-layer record of the 2026-07-18 chat batch)
