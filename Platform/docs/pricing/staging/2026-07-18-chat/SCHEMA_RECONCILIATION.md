# Schema Reconciliation — Phase D proposal vs. actual repository schemas

**Batch:** 2026-07-18 chat provider-pricing audit (Phase C → C.5 → D → D.5)
**Purpose:** Compare Phase D's proposed file/column schemas against the real, live repository schemas, so a future Phase E implementation agent does not need to rediscover this — every gap below was found by opening the real files, not assumed.

## Precedence (per the Phase D.5 synchronization task)

1. Locked founder policies and accepted repository ADRs (ADR-0025, ADR-0026).
2. Actual live repository schemas and naming conventions (this document's subject).
3. Phase C.5 field-level verification outcomes.
4. Phase D architectural proposals — only after reconciliation with #2.
5. Phase C raw research.

## File-by-file reconciliation

### `assumptions.yaml`

| | Phase D proposed | Actual repository |
|---|---|---|
| Purpose | Currency/billing-unit conventions, derivation methodology notes, missing-date policy | Standardized usage-scenario definitions (`chat_standard`, `chat_cached`, `image_standard`, `video_standard`, `video_premium`, `avatar_standard`, `avatar_conversational`, `tts_standard`, `stt_standard`, `music_standard`, `sfx_standard`) |
| Decision | — | **Not touched.** This file already serves a settled, different purpose (per its own header comment: "Do not add a user-volume or revenue assumption here"). Phase D's proposed content (currency defaults, derivation methodology, missing-date policy) has no destination in this file and is **not represented anywhere in production** as a result — see the mapping manifest's approval-required entries for where derivation formulas actually live (inline in `pricing_facts.yaml`'s `notes`, for now). |
| Mapping type | — | **No-fit** (by design — the file's existing purpose is authoritative and is not repurposed) |

### `sources.csv`

| | Phase D proposed | Actual repository |
|---|---|---|
| Columns | `source_id, provider, url, source_type, verification_date, last_checked, confidence, verification_method, notes` | `source_id, provider, source_type, title, url, published_at, updated_at, accessed_at, official, scope, notes` |
| Decision | — | **Direct/rename mapping**, not a redesign: `verification_date`≈`accessed_at`, `last_checked`≈`updated_at` (approximately — not an exact semantic match, see below), `confidence`/`verification_method` have **no destination column** in the real schema. `title`, `official`, `scope`, `published_at` exist in the real schema but were not in Phase D's proposal at all. |
| Mapping type | — | **Transformation** for the columns that exist; **no-fit** for `confidence` and `verification_method` (Phase C.5's per-source confidence/method are retained only in the staging package's `evidence_status_c5` field, not written to any production column) |

### `provider-pricing.csv`

| | Phase D proposed | Actual repository |
|---|---|---|
| Shape | **Long/row-per-dimension**: one row per (model, channel, pricing_dimension), with a `pricing_dimension` enum (input/cached_input/cache_write_5m/cache_write_1h/output/batch_input/batch_output/long_context_*/web_search/code_execution/cache_storage/search_grounding) | **Wide**: one row typically holds `input_price_per_million`, `cached_input_price_per_million`, `output_price_per_million` together, plus `batch_discount_percent`, `long_context_threshold`, `long_context_multiplier` as their own columns, plus a generic `billing_dimension` + `unit_quantity` + `unit_name` + `unit_price` mechanism for anything else |
| `channel` / `openrouter_model_slug` | Proposed as dedicated columns | **Do not exist.** OpenRouter rows can use the existing `provider_id`/`provider_name` columns with value `openrouter` as the channel distinguisher (a workable transformation), but the OpenRouter-specific model slug (e.g. `z-ai/glm-5.2`) has no structured destination — only `notes`. |
| Decision | — | **This was the single most consequential finding of this reconciliation.** Phase D's naive long-format proposal does not match the real wide-format schema. However, most facts still have a legitimate destination via one of two paths: (a) the three wide columns for standard input/cached/output pricing (**direct fit**, the majority of facts), or (b) the generic `billing_dimension`/`unit_price`/`unit_name`/`unit_quantity` row mechanism for anything else — cache writes, tool pricing, cache storage, search grounding (**transformation**, workable without new columns). A genuine **no-fit** remains only for: the OpenAI long-context rule (one `long_context_multiplier` column cannot hold two different values — input 2× vs. output 1.5× — needs two tagged rows or a schema extension) and the OpenRouter model-slug (no structured column). |
| Mapping type | — | **Direct** (majority) / **transformation** (generic-dimension facts, OpenRouter channel) / **no-fit, approval-required** (long-context dual-multiplier, OpenRouter slug) |

### `model-pricing.csv`

| | Phase D proposed | Actual repository |
|---|---|---|
| Columns | `portfolio_model_id, aifa_display_name, provider, official_model_id, context_window_tokens, max_output_tokens, knowledge_cutoff, availability_status, account_requirements, source_id, repository_status` | `aifa_model_id, aifa_display_name, category, capability, portfolio_status, official_model_name, official_model_id, primary_provider, backup_provider, pricing_record_id, pricing_status, commercial_status, region_status, effective_from, effective_to, verified_at, notes` |
| Decision | — | `aifa_display_name`, `official_model_id`, `provider`(≈`primary_provider`) exist and map **directly**. **`context_window_tokens`, `max_output_tokens`, `knowledge_cutoff`, `availability_status`, and `account_requirements` do not exist as columns at all** — a genuine schema gap, not a naming difference. `portfolio_model_id` vs. the real `aifa_model_id`: the real column already exists with 81 populated rows (13 of which are this batch's chat models) — no rename needed, Phase D's proposed name was simply wrong. |
| Mapping type | — | **Direct** (name/provider/official ID) / **no-fit, approval-required** (context window, max output, knowledge cutoff, availability status, account requirements) |

### `commercial-terms.csv` (Phase D's proposed new file)

| | Phase D proposed | Actual repository |
|---|---|---|
| Status | New file, justified in Phase D §2.2 (retention/ZDR/training-policy/DPA/regional-restriction/SLA facts don't fit a per-pricing-dimension table without duplication and drift risk) | **Does not exist.** No column anywhere in the five production CSVs represents these facts. |
| Decision | — | **Not created in this pass**, per this synchronization task's explicit instruction. The justification in Phase D §2.2 is sound reasoning (preserved, not dismissed) but creating a new production file is a founder/architecture decision, not something a documentation-synchronization pass makes unilaterally. All 11 commercial/policy facts from this batch are staged in `commercial_policy_facts.yaml` regardless — staging is schema-agnostic — flagged `approval-required`. |
| Mapping type | — | **No-fit, approval-required** (whole file) |

### `pricing-audit-gaps.csv`

| | Phase D proposed | Actual repository |
|---|---|---|
| Columns | `gap_id, provider, field_description, claimed_value, status, reason, action_required, date_logged` | `gap_id, priority, provider, model, category, missing_information, reason, required_action, blocks_credit_engine, owner, status` |
| Decision | — | Substantial overlap (`gap_id`, `provider`, `reason`≈`reason`, `action_required`≈`required_action`, `status`≈`status`). Real schema additionally has `priority`, `model`, `category`, `blocks_credit_engine`, `owner` — richer than Phase D's proposal, not poorer. `date_logged` has no direct column (closest: none — could be inferred from a future commit date, not stored inline). |
| Mapping type | — | **Direct**, with `priority` and `owner` requiring human assignment (not invented in this pass) |

### `scenario-costs.csv`

Untouched, exactly as Phase D itself recommended (§2.1) and as this synchronization task's own explicit instruction requires ("Do not populate it"). No reconciliation needed — Phase D's reasoning here matched the live repository's actual state.

## Consolidated mapping-type summary

| Mapping type | Count (record classes, not individual facts) | Meaning |
|---|---|---|
| **Direct** | 4 | Existing column(s) fit the fact with no transformation needed |
| **Transformation** | 3 | An existing generic mechanism (`billing_dimension`/`unit_price`, or `provider_name='OpenRouter'`) can represent the fact, non-trivially |
| **No-fit / approval-required** | 4 | No production destination exists; requires a founder/architecture decision before Phase E can write these to production |

See [`mapping_manifest.yaml`](mapping_manifest.yaml) for the full per-class detail, including the exact validator rule each mapping requires.

## The one finding that overrides all of the above

**Every fact in this batch, regardless of its mapping type, is additionally capped at staging disposition `PENDING` by the source-URL provenance gap** (Phase C.5 supplies no literal URLs; every URL in this batch traces only to Phase D's unverified proposal). See [`00_Summary.md`](../../../../../AIFA_Brain/04_Research/Pricing_Research/Provider_Pricing_Audit/00_Summary.md) and [`PHASE_E_RUNBOOK.md`](PHASE_E_RUNBOOK.md)'s stop conditions. A perfect schema mapping does not make a fact production-ready if its source cannot be independently confirmed.

## Related documents

- [`README.md`](README.md) (this staging package's index)
- [`mapping_manifest.yaml`](mapping_manifest.yaml) (machine-readable form of this document)
- `../../adr/0025-pricing-source-of-truth.md`, `../../adr/0026-phase-c5-evidence-vocabulary-mapping.md`
- `AIFA_Brain/04_Research/Pricing_Research/Provider_Pricing_Audit/03_Phase_D_Repository_Ingestion_Plan.md` (the proposal this document reconciles)
