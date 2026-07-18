# Phase E Implementation Runbook — 2026-07-18 chat provider-pricing batch

**Audience:** a future implementation agent with no access to the conversation history that produced this package. Everything needed to execute (or correctly decline to execute) Phase E for this batch is in this document and the six YAML files beside it.

**This runbook does not authorize any unresolved schema change.** Every item marked `no-fit / approval-required` in [`SCHEMA_RECONCILIATION.md`](SCHEMA_RECONCILIATION.md) and [`mapping_manifest.yaml`](mapping_manifest.yaml) stays out of production until a founder/architecture decision is recorded — this runbook tells you where those decisions need to be made, not what they should be.

## 0. Read first

- [`../../../../../AIFA_Brain/04_Research/Pricing_Research/Provider_Pricing_Audit/00_Summary.md`](../../../../../AIFA_Brain/04_Research/Pricing_Research/Provider_Pricing_Audit/00_Summary.md) — what this batch is and its headline finding.
- [`SCHEMA_RECONCILIATION.md`](SCHEMA_RECONCILIATION.md) — why the mappings below are what they are.
- `../../adr/0025-pricing-source-of-truth.md`, `../../adr/0026-phase-c5-evidence-vocabulary-mapping.md` — the governing methodology and vocabulary mapping.

## 1. Mandatory pre-condition — do not skip

**Before writing a single production row from this batch**, independently re-confirm every URL in [`sources.yaml`](sources.yaml) against the specific claim it's cited for. Every source in this batch is `staging_disposition: PENDING` for exactly this reason: Phase C.5 (the evidentiary authority) supplies no literal URLs anywhere in its own text; every URL here traces only to Phase D's proposal, which self-describes as produced without live repository access.

**Do not treat a `PENDING` disposition as "safe to promote to production because the underlying evidence class is `OFFICIAL_VERIFIED`."** The evidence class describes how well Phase C.5 believes the fact is sourced; the disposition describes whether *this package* has independently confirmed that sourcing. They are different questions. Re-confirming a URL and updating its `sources.yaml` record's `staging_disposition` to `ELIGIBLE` (or logging why it can't be confirmed, moving it to `REJECTED`) is itself the first real step of Phase E — it is not optional groundwork to skip.

## 2. Exact files to update (once §1 is satisfied for a given source)

| File | What changes |
|---|---|
| `../sources.csv` | Add one row per re-confirmed `sources.yaml` record, using that record's real (not `STAGE-SRC-####`) `source_id` — see §3 for ID assignment. |
| `../provider-pricing.csv` | Add one row per `pricing_facts.yaml` record whose `mapping_type` is `direct` or `transformation` (per `mapping_manifest.yaml`) and whose linked source is now re-confirmed. |
| `../model-pricing.csv` | **Update existing rows** (13 chat models already exist — do not insert duplicates) with `official_model_name`, `official_model_id`, and `verified_at`/`source_id`-equivalent fields per `model_facts.yaml`'s identity records, for facts with an existing destination column only (see §6). |
| `../pricing-audit-gaps.csv` | Add one row per `audit_gaps.yaml` record, assigning `priority` and `owner` (not pre-assigned in staging — a human/process decision). |
| `../scenario-costs.csv` | **Do not touch.** Out of scope for this batch (unchanged from Phase D's own correct assessment). |
| `../commercial-terms.csv` | **Do not create** unless a founder/architecture decision (tracked as an open item in `mapping_manifest.yaml`) has approved it. |

## 3. Exact package files to consume

`sources.yaml` → `model_facts.yaml` → `pricing_facts.yaml` → `audit_gaps.yaml`, in that order (see §4). `commercial_policy_facts.yaml` is consumed only if/when `commercial-terms.csv` (or an equivalent destination) is approved — otherwise its facts remain staged, unconsumed, pending that decision. `mapping_manifest.yaml` is the reference table for every column decision below; `SCHEMA_RECONCILIATION.md` is the human-readable explanation of the same.

## 4. Insertion/update order

1. **`sources.csv`** first — every other file's rows should carry a source reference. (Same ordering logic Phase D itself proposed, and it still holds.)
2. **`provider-pricing.csv`** second — the core pricing deliverable; only needs `sources.csv` to exist.
3. **`model-pricing.csv`** third — update the 13 existing rows' identity columns once the official IDs they reference are already confirmed via step 2's sourcing.
4. **`pricing-audit-gaps.csv`** last, as a reconciliation checksum — every `audit_gaps.yaml` record should land here if it didn't land in steps 1–3. If a fact from the staging package appears in neither place, that's a sign something was dropped; review before closing the batch.

## 5. Which records are automatically eligible / pending / rejected

**None of the 180 staged records in this batch are `ELIGIBLE` as delivered.** All are `PENDING` (source-URL re-confirmation required) except the two xAI corrections and the URL-provenance meta-gap, which are `REJECTED`/logged-as-gap by design:

| Disposition | Count | What it means here |
|---|---|---|
| `PENDING` | 178 | Otherwise well-evidenced (mostly `OFFICIAL_VERIFIED`/`OFFICIAL_DERIVED` per Phase C.5), blocked only by the source-URL gap (§1) or, for the model-spec/commercial-terms no-fit items, also blocked on a schema decision |
| `REJECTED` | 2 | `GAP-STAGE-0001` (xAI 50% batch discount claim), `GAP-STAGE-0002` (xAI rate-limit unit) — actively contradicted by official evidence per Phase C.5; must never be written to production as originally claimed |
| (meta) | 1 | `GAP-STAGE-0014` — not a single fact but the provenance gap itself; resolving it is what turns the other 178 from `PENDING` toward `ELIGIBLE` |

After §1's re-confirmation work, re-derive each record's disposition per ADR-0026 §3's definitions rather than bulk-promoting everything — some sources may fail re-confirmation even if most succeed.

## 6. How to map to existing CSV columns

See `mapping_manifest.yaml` for the authoritative per-class table and `SCHEMA_RECONCILIATION.md` for the reasoning. Summary:

- **Direct fit** (write as-is once sourced): standard input/cached_input/output prices → `provider-pricing.csv`'s three wide price columns; `official_model_id`/`official_model_name` → `model-pricing.csv`; most `audit_gaps.yaml` fields → `pricing-audit-gaps.csv`.
- **Transformation** (write via the existing generic mechanism, not a new column): cache-write prices, tool pricing (web search, code execution), cache storage, search grounding → one `provider-pricing.csv` row each using `billing_dimension`/`unit_price`/`unit_name`/`unit_quantity`. OpenRouter rows → `provider_name = 'OpenRouter'` as the channel distinguisher; the OpenRouter-specific model slug goes in `notes` (no structured column exists).
- **No-fit, approval-required** (do not write until decided): `context_window_tokens`, `max_output_tokens`, `knowledge_cutoff`, `availability_status`, `account_requirements` (no `model-pricing.csv` columns exist); the whole `commercial_policy_facts.yaml` set (no `commercial-terms.csv` exists); OpenAI's dual long-context multiplier (one column, two needed values — needs either two tagged rows or a schema extension, itself a small approval-required decision even though no *new* column is strictly required).

## 7. How historical/effective-dated rows are handled under ADR-0025

Per ADR-0025's versioning principle: a price with a stated `effective_date` (e.g. Claude Sonnet 5's introductory $2/$10 through 2026-08-31, standard $3/$15 from 2026-09-01) becomes **two separate `provider-pricing.csv` rows**, not one row with a note — this batch's `pricing_facts.yaml` already models it this way (`plan: introductory` vs. `plan: standard-from-2026-09-01`). **Never overwrite a historical row when a price changes** — insert a new row with a new `effective_from`; the old row's `effective_to` may be set, but its `price_value` is never mutated after the fact.

## 8. Validator changes required after data insertion

Per `SCHEMA_RECONCILIATION.md` and `mapping_manifest.yaml`'s `required_validator_rule` fields, before or immediately after this batch lands in production:

1. Extend the model-ID recognition to accept the 13 newly-verified `official_model_id` values (listed in `model_facts.yaml`).
2. Add a rule distinguishing "confirmed not offered" (`batch_discount_percent = 0` with an explicit official statement, or `null` with a confirmed-absent note) from "not yet ingested" (`WAIT`/`PENDING`-equivalent) — a completeness validator must not flag the former as an error.
3. Add a rule validating `billing_dimension` free-text values against a documented (not yet formally enumerated — this batch is the first real user of the mechanism) accepted set, so the generic-row escape hatch doesn't become an uncontrolled dumping ground.
4. Extend source-integrity checking to require every `provider-pricing.csv`/`model-pricing.csv` row's `source_id` to resolve to a `sources.csv` row with a *re-confirmed* (not merely proposed) URL.

**Do not implement these validator changes as part of consuming this package** unless separately instructed — this runbook identifies what's needed; implementing validator logic is its own reviewable change (see §11, commit 6).

## 9. Validation commands

After every stage of production data insertion:

```bash
cd Platform
python3 docs/pricing/validate_pricing.py
```

This must pass (all required datasets present, no ragged CSV rows, no duplicate `aifa_model_id`/ADR numbers, no broken doc links) before proceeding to the next insertion step. If it fails, fix the failure before continuing — do not insert further rows on top of a failing validation state.

## 10. Stop conditions

Stop and escalate rather than improvising if, during Phase E execution:

- A source URL in `sources.yaml` cannot be independently re-confirmed as the exact page the associated claim traces to (this is the expected common case for this batch — see §1; it's a stop-and-log-as-gap condition, not a blocker for the whole batch).
- A re-confirmed source contradicts the value staged here (treat as a new `CONFLICTING` finding — route to `pricing-audit-gaps.csv`, do not silently overwrite the staged value or the destination row).
- Any `no-fit / approval-required` item (§6) is about to be force-fit into an existing column instead of waiting for the founder/architecture decision.
- The validator (§9) fails and the cause isn't immediately obvious from its own error output.

## 11. Expected logical commits (when Phase E for this batch actually executes)

Following the same discipline as this synchronization pass's own commits:

1. `data: register re-confirmed chat-pricing sources (2026-07-18 batch)` — `sources.csv`
2. `data: ingest verified chat provider pricing (2026-07-18 batch)` — `provider-pricing.csv`
3. `data: update chat model identity fields (2026-07-18 batch)` — `model-pricing.csv`
4. `data: log unresolved chat-pricing gaps (2026-07-18 batch)` — `pricing-audit-gaps.csv`
5. `chore: retire 2026-07-18-chat staging package` — remove or archive this staging directory once fully consumed
6. `tooling: extend validate_pricing.py for chat-pricing batch rules` — the §8 validator changes, as its own reviewable change

Do not compress these into one commit — each is independently reviewable and independently revertible.

## Related documents

- [`README.md`](README.md), [`SCHEMA_RECONCILIATION.md`](SCHEMA_RECONCILIATION.md), [`mapping_manifest.yaml`](mapping_manifest.yaml)
- `../../adr/0025-pricing-source-of-truth.md`, `../../adr/0026-phase-c5-evidence-vocabulary-mapping.md`
- `AIFA_Brain/04_Research/Pricing_Research/Provider_Pricing_Audit/00_Summary.md`
