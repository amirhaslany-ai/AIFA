# Pricing (machine-readable)

The machine-readable counterpart to `../portfolio/` and `../providers/`. **As of 2026-07-17 (Phase B), only decision data is populated — no pricing data exists yet.** Phase C populates the pricing/commercial columns from official sources only, per `../adr/0025-pricing-source-of-truth.md`.

## Files

| File | Populated in Phase B? | Contents |
|---|---|---|
| [`assumptions.yaml`](assumptions.yaml) | **Yes — fully** | Standardized comparison scenarios (these are fixed inputs from the product decision, not research findings). |
| [`model-pricing.csv`](model-pricing.csv) | **Yes — decision columns only** | One row per routable AIFA model variant (81 rows). `aifa_model_id`, `aifa_display_name`, `category`, `capability`, `portfolio_status`, `primary_provider`, `backup_provider`, `notes` are populated from the locked portfolio ADRs (0018–0023). `official_model_id`, `pricing_record_id`, `pricing_status`, `commercial_status`, `region_status`, `effective_from`, `effective_to`, `verified_at` are blank pending Phase C. |
| [`provider-pricing.csv`](provider-pricing.csv) | Header only | One row per provider billing dimension/plan — populated entirely in Phase C. |
| [`sources.csv`](sources.csv) | Header only | Every official source cited, with URL/title/dates — populated entirely in Phase C. |
| [`pricing-audit-gaps.csv`](pricing-audit-gaps.csv) | Header + seed rows | Gaps already known from the locked product decisions themselves (e.g. Suno's API-existence gate) are seeded now; Phase C adds every gap it actually encounters. |

## Column schemas

See `../adr/0025-pricing-source-of-truth.md` for the confidence vocabulary (`OFFICIAL_EXPLICIT`, `OFFICIAL_DERIVED`, `OFFICIAL_AMBIGUOUS`, `CONTRACT_REQUIRED`, `UNVERIFIED`) and `../providers/README.md` for the full field list Phase C populates per provider.

## Validation

Every CSV in this folder must satisfy (checked by the validation script added in Phase C, per the audit mission §12):

- Consistent column count per row.
- No duplicate `aifa_model_id` within `model-pricing.csv`.
- Every populated pricing row has a `source_id` resolving to a row in `sources.csv`, or is explicitly `UNVERIFIED`.
- Every `verified_at` timestamp is a real date, not a placeholder.
- Every `OFFICIAL_DERIVED` value states its derivation formula (in `notes` or a dedicated `formula` field, per the consuming document).

## Related documents

- `../portfolio/README.md` (the classification taxonomy `portfolio_status` uses)
- `../adr/0025-pricing-source-of-truth.md`
- `../economics/cost-model.md` (consumes `scenario-costs.csv`, added in Phase C)
