<!--
Preserved planning artifact. Per AIFA_Brain/00_Index/METADATA_STANDARD.md and
this task's own instruction ("Preserve the original plan as an audit artifact.
Add a clear repository-reconciliation note..."), only this metadata block,
the reconciliation note, and the horizontal rule below were added on import
(2026-07-18). Everything after the rule is the supplied file's body,
byte-for-byte unchanged.
-->

# Import metadata

| Field | Value |
|---|---|
| **Title** | AIFA Phase D Repository Ingestion Plan (imported planning artifact) |
| **Created** | 2026-07-18 (original artifact date) |
| **Imported** | 2026-07-18 |
| **Owner** | AIFA_Brain maintainers (import); original authorship is the Phase D planning pass |
| **Status** | Archived — planning proposal only, **not automatically authoritative** (see reconciliation note below). Superseded in practice by the actual schema reconciliation performed in the Phase D.5 synchronization pass. |
| **Version** | 1.0 (as supplied) |
| **Dependencies** | [`01_Phase_C_Chat_Pricing_Audit.md`](01_Phase_C_Chat_Pricing_Audit.md), [`02_Phase_C5_Official_Verification_Pass.md`](02_Phase_C5_Official_Verification_Pass.md) |
| **Related Docs** | [`00_Summary.md`](00_Summary.md), [`../../../../Platform/docs/pricing/staging/2026-07-18-chat/SCHEMA_RECONCILIATION.md`](../../../../Platform/docs/pricing/staging/2026-07-18-chat/SCHEMA_RECONCILIATION.md), [`../../../../Platform/docs/adr/0025-pricing-source-of-truth.md`](../../../../Platform/docs/adr/0025-pricing-source-of-truth.md) |
| **Tags** | `pricing, provider-pricing, chat, phase-d, ingestion-plan, proposal, not-authoritative` |

## Repository-reconciliation note (added on import, 2026-07-18)

This plan's own §0 "Scope Disclaimer" already states it: **"This plan was produced without direct read access to the live AIFA repository in this conversation... It works from the file names the founder supplied as examples... and treats those as the real, current structure."** That assumption does not hold. The actual repository schemas differ from this plan's proposed schemas in several material ways:

- **`assumptions.yaml`** is **not** a currency/billing-convention file as §3.1 proposes — it is a fully-populated set of standardized usage scenarios (`chat_standard`, `image_standard`, etc.), already serving a different, already-settled purpose. It is **not** repurposed or replaced.
- **`model-pricing.csv`**'s real columns are `aifa_model_id, aifa_display_name, category, capability, portfolio_status, official_model_name, official_model_id, primary_provider, backup_provider, pricing_record_id, pricing_status, commercial_status, region_status, effective_from, effective_to, verified_at, notes` — not §3.4's proposed `portfolio_model_id, context_window_tokens, max_output_tokens, knowledge_cutoff, availability_status, account_requirements` columns, none of which exist.
- **`provider-pricing.csv`**'s real schema is a 33-column **wide** format (`input_price_per_million`, `cached_input_price_per_million`, `output_price_per_million`, `billing_dimension`, `unit_price`, etc.) — not §3.3's proposed **long/row-per-dimension** format with a `pricing_dimension` enum, `channel`, or `openrouter_model_slug` columns, none of which exist.
- **`sources.csv`**'s real columns are `source_id, provider, source_type, title, url, published_at, updated_at, accessed_at, official, scope, notes` — not §3.2's proposed `verification_date, last_checked, confidence, verification_method` columns.
- **`pricing-audit-gaps.csv`**'s real columns are `gap_id, priority, provider, model, category, missing_information, reason, required_action, blocks_credit_engine, owner, status` — not §3.6's proposed `field_description, claimed_value, status, reason, action_required, date_logged` columns (some overlap, not identical).
- **`scenario-costs.csv`** exists as a header-only stub (13 columns), consistent with this plan's own §2.1 ("not touched this phase") — the one part of this plan's file-role map that matches reality.
- **The `repository_status` enum this plan proposes throughout (`READY` / `WAIT` / `BLOCKED`) does not exist anywhere in the live repository.** The actual, already-Accepted taxonomy (`Platform/docs/portfolio/README.md`, `Platform/docs/adr/0025-pricing-source-of-truth.md`) uses `VERIFIED_ACTIVE / VERIFIED_PREVIEW / AIFA_ALIAS / PLANNED / RESERVE / WATCHLIST / INTEGRATION_GATED / UNVERIFIED` for portfolio lifecycle and `OFFICIAL_EXPLICIT / OFFICIAL_DERIVED / OFFICIAL_AMBIGUOUS / CONTRACT_REQUIRED / UNVERIFIED` for pricing confidence — two independent, already-governed dimensions this plan's single `READY/WAIT/BLOCKED` axis does not map onto directly. See the synchronization summary and `Platform/docs/adr/0026-phase-c5-evidence-vocabulary-mapping.md` for how this plan's vocabulary is reconciled (as a **staging-only, package-level disposition** — `ELIGIBLE / PENDING / REJECTED` — never added to production CSV schemas).
- **`commercial-terms.csv` was not created automatically** on this import, per the synchronization task's explicit instruction. This plan's §2.2 justification is preserved and forwarded as a founder/architecture approval item, not treated as pre-approved.

**None of this invalidates the plan's genuine value**: its field-level ingestion table (§4), migration ordering logic (§7), and risk analysis (§8) were used as a starting map for the actual reconciliation and staging package — see `Platform/docs/pricing/staging/2026-07-18-chat/` for the result. Where this plan's proposals conflict with the accepted repository architecture, the accepted architecture was preserved and the conflict was documented, per this plan's own §9 instruction: *"If they don't match, that's a data-entry correction to this plan, not grounds to re-architect it."*

---

# AIFA Phase D Repository Ingestion Plan

**Status:** Planning document only. No repository files were read, created, edited, or committed in the production of this plan.
**Author role:** Repository Data Architect (planning capacity)
**Input:** Phase C (Chat Pricing Audit) and Phase C.5 (Official Source Verification Audit)
**Date:** July 18, 2026

---

## 0. Scope Disclaimer

This plan was produced without direct read access to the live AIFA repository in this conversation — no `git clone`, `Google Drive` fetch, or file-browsing of the actual repo occurred. It works from the file names the founder supplied as examples (`model-pricing.csv`, `provider-pricing.csv`, `scenario-costs.csv`, `pricing-audit-gaps.csv`, `assumptions.yaml`, `sources.csv`) and treats those as the real, current structure, per the instruction "assume the current repository structure is correct."

**Before execution, the implementation agent must:**
1. Open each named file and confirm its actual column headers against the schemas below.
2. Reconcile any mismatch (rename mapping, not architectural redesign) before writing a single row.
3. Confirm the existing validation framework's rule definitions before extending them (Section 6 describes required rule *changes*, not the current rule *implementation*, which was not available to inspect here).

If any named file does not exist, or its actual schema conflicts irreconcilably with what's below, the implementation agent should stop and escalate to the founder rather than improvise — that is an architectural decision, not an execution one.

---

## 1. Objective

Take every field classified `OFFICIAL_VERIFIED` or `OFFICIAL_DERIVED` in Phase C.5 and give it exactly one destination, one schema position, and one traceable source. Every field that was classified `SECONDARY_ONLY`, `CONFLICTING`, or `UNVERIFIED` gets routed to the gaps log instead of the pricing tables — it does not enter the Source of Truth silently, and it does not get dropped silently either.

---

## 2. Repository File Map

| File | Role | Status |
|---|---|---|
| `assumptions.yaml` | Documents the conventions used to interpret every other file (currency default, billing-unit convention, how derived values were computed, how missing effective dates are handled) | Existing — update |
| `sources.csv` | Registry of every official URL used as evidence, one row per source, referenced by ID from all other files | Existing — update |
| `provider-pricing.csv` | Raw, model-level pricing facts as documented by the provider or by OpenRouter, one row per (model, channel, pricing dimension) | Existing — update |
| `model-pricing.csv` | AIFA's portfolio/alias layer: maps an internal AIFA model reference to the verified official model ID, and carries model-level, non-price specs (context window, max output, cutoff, availability status) | Existing — update |
| `commercial-terms.csv` | Legal/policy facts (retention, ZDR, training policy, DPA, regional restriction, SLA, account requirements) | **New file — justified below** |
| `pricing-audit-gaps.csv` | Every field that is NOT going into the Source of Truth this phase, with the reason and the action needed to unblock it | Existing — update |
| `scenario-costs.csv` | Computed usage-scenario costs | Existing — **not touched this phase** (see §2.1) |

### 2.1 Why `scenario-costs.csv` is untouched

`scenario-costs.csv` is a derived/computed table — it exists to answer "what would N messages of model X cost." Computing it requires margin logic, AIFA Credit conversion, or subscription-tier assumptions. The founder's Phase C and Phase D instructions both explicitly exclude those calculations ("Do not calculate AIFA Credits," "Do not calculate margins," "Do not calculate subscription pricing"). This plan therefore stops one layer short of `scenario-costs.csv` by design — it is out of scope for this ingestion, not overlooked. It re-enters scope once a separate, founder-approved pricing/credit-conversion decision exists.

### 2.2 New file justification: `commercial-terms.csv`

The founder's instruction is "do NOT invent new files unless absolutely necessary." One new file is proposed, for a structural reason rather than a convenience reason:

- `provider-pricing.csv` is **row-per-pricing-dimension** and will churn frequently (prices change often; each model already produces 6–10 rows).
- Commercial/legal terms (retention days, ZDR, DPA, training policy, SLA) are **provider- or model-scoped, not dimension-scoped**, and change rarely (they're contractual, not pricing data).
- Folding legal terms into `provider-pricing.csv` would mean repeating the same DPA/retention values on every one of a model's 6–10 pricing rows, which (a) bloats the file, (b) invites drift if one copy is updated and the sibling rows are not, and (c) conflates two update cadences (frequent pricing edits vs. rare legal edits) inside one diff history, which is exactly the kind of duplicated-knowledge the founder's design philosophy explicitly warns against.

A single `commercial-terms.csv`, one row per (provider, scope, model-if-applicable), avoids that duplication cleanly. This is the only new file proposed. OpenRouter data is **not** given its own file — it's folded into `provider-pricing.csv` via a `channel` column, since it's the same shape of data (model × pricing dimension) just sourced through a different channel, and a separate file would duplicate the whole schema for no structural reason.

---

## 3. Complete CSV / YAML Schemas

### 3.1 `assumptions.yaml`

| Key | Purpose | Example Value | Validation | Dependencies |
|---|---|---|---|---|
| `default_currency` | Currency assumed when a source doesn't restate it per row | `USD` | Must equal the `currency` value used in every `provider-pricing.csv` row | None |
| `default_billing_unit` | Token-pricing convention | `per_1M_tokens` | Must match `billing_unit` enum in `provider-pricing.csv` | None |
| `derived_value_methodology` | Explains how `value_type: derived` rows were computed, so a reviewer doesn't need to re-derive them | `"cache_write_5m = 1.25 × input; cache_read = 0.1 × input, per OpenAI's stated multiplier rule"` | Free text, one entry per provider where derivation was used | Referenced by `provider-pricing.csv` rows with `value_type = derived` |
| `missing_effective_date_policy` | How to treat a verified price with no stated effective date | `"effective_date left null; treat verification_date in sources.csv as the as-of date"` | Free text | Referenced wherever `effective_date` is null |
| `out_of_scope_calculations` | Explicit list of what this ingestion does NOT compute | `["AIFA Credit conversion", "margin", "subscription pricing"]` | List | Explains why `scenario-costs.csv` stays empty |

### 3.2 `sources.csv`

| Column | Purpose | Example Value | Validation | Dependencies |
|---|---|---|---|---|
| `source_id` | Primary key, referenced by every other file | `SRC-0001` | Unique, non-null, pattern `SRC-####` | Referenced by `provider-pricing.csv`, `model-pricing.csv`, `commercial-terms.csv` |
| `provider` | Which provider this source documents | `OpenAI` | Enum: OpenAI, Anthropic, Google, xAI, DeepSeek, Alibaba, Zhipu, OpenRouter | — |
| `url` | The exact official URL | `https://developers.openai.com/api/docs/models/gpt-5.6-sol` | Must resolve to an allowed official domain per provider (see Phase C.5 allowed-source list) | — |
| `source_type` | What kind of page it is | `model_page` | Enum: pricing_page, model_page, announcement, docs, trust_center | — |
| `verification_date` | When this audit confirmed the value on the page | `2026-07-18` | ISO date | — |
| `last_checked` | Most recent recheck (same as verification_date until a recheck occurs) | `2026-07-18` | ISO date, ≥ verification_date | — |
| `confidence` | Confidence from Phase C.5 | `high` | Enum: high, medium, low | — |
| `verification_method` | How the value was confirmed | `direct_fetch` | Enum: direct_fetch, derived_from_official_statement, secondary_corroboration | Drives `value_type` in `provider-pricing.csv` |
| `notes` | Free-text caveats | `"Batch/priority rows on this page were not captured in this fetch"` | Free text | — |

### 3.3 `provider-pricing.csv`

| Column | Purpose | Example Value | Validation | Dependencies |
|---|---|---|---|---|
| `pricing_id` | Primary key | `PP-0001` | Unique, pattern `PP-####` | — |
| `source_id` | FK to `sources.csv` | `SRC-0001` | Must exist in `sources.csv` | `sources.csv` must be ingested first |
| `provider` | Provider name | `OpenAI` | Same enum as `sources.csv.provider` | — |
| `official_model_id` | Exact API model ID | `gpt-5.6-sol` | Non-null; must match a row in `model-pricing.csv.official_model_id` once that file is ingested | `model-pricing.csv` (soft dependency — see §5) |
| `channel` | Where this price is charged | `direct` | Enum: direct, openrouter | — |
| `openrouter_model_slug` | OpenRouter's own model ID, only if channel = openrouter | `z-ai/glm-5.2` | Required if `channel = openrouter`, else null | — |
| `pricing_dimension` | Which price this row represents | `output` | Enum: input, cached_input, cache_write_5m, cache_write_1h, output, batch_input, batch_output, long_context_input, long_context_output, long_context_cached_input, web_search, code_execution, cache_storage, search_grounding | — |
| `price_value` | The numeric price | `30.00` | Decimal, ≥ 0 | — |
| `billing_unit` | Unit the price is quoted in | `per_1M_tokens` | Enum: per_1M_tokens, per_1000_calls, per_hour, per_session_hour | Must match `assumptions.yaml.default_billing_unit` unless a row-specific override is documented |
| `currency` | Currency | `USD` | Enum (currently USD only) | — |
| `context_tier` | Which context-length band this price applies to, if tiered | `>272K` | Free text tag, nullable; must match a documented tier boundary from the source | — |
| `effective_date` | Date this price took effect, if stated | `2026-07-01` | ISO date, nullable | If null, `assumptions.yaml.missing_effective_date_policy` applies |
| `value_type` | Whether this was stated verbatim or computed from a stated rule | `derived` | Enum: stated, derived | If `derived`, must have a matching entry in `assumptions.yaml.derived_value_methodology` |
| `confidence` | Carried from `sources.csv` | `high` | Enum: high, medium, low | Should equal the linked source's confidence unless downgraded |
| `repository_status` | Ingestion gate | `READY` | Enum: READY, WAIT, BLOCKED | See §7 |

### 3.4 `model-pricing.csv`

| Column | Purpose | Example Value | Validation | Dependencies |
|---|---|---|---|---|
| `portfolio_model_id` | AIFA-internal identifier | `aifa-gpt-5.6-sol` | Unique, non-null | — |
| `aifa_display_name` | Human-readable name used in AIFA's own catalog | `GPT-5.6 Sol` | Non-null | — |
| `provider` | Provider | `OpenAI` | Same enum as above | — |
| `official_model_id` | The verified official API ID this alias maps to | `gpt-5.6-sol` | Must have at least one matching row in `provider-pricing.csv.official_model_id` | `provider-pricing.csv` should be ingested first for FK integrity (see §5) |
| `context_window_tokens` | Max context | `1050000` | Integer > 0 | — |
| `max_output_tokens` | Max output | `128000` | Integer > 0, nullable if not documented | — |
| `knowledge_cutoff` | Training cutoff date, if documented | `2026-02-16` | ISO date, nullable | — |
| `availability_status` | GA/Preview/etc. | `GA` | Enum: GA, Preview, Experimental, Restricted | — |
| `account_requirements` | Access gating, if any | `"Paid tier only, no free tier"` | Free text, nullable | — |
| `source_id` | FK to `sources.csv` for the identity claim specifically | `SRC-0002` | Must exist in `sources.csv` | — |
| `repository_status` | Ingestion gate | `READY` | Enum: READY, WAIT, BLOCKED | See §7 |

### 3.5 `commercial-terms.csv` (NEW)

| Column | Purpose | Example Value | Validation | Dependencies |
|---|---|---|---|---|
| `terms_id` | Primary key | `CT-0001` | Unique | — |
| `provider` | Provider | `Anthropic` | Same enum | — |
| `scope` | Whether this row applies to the whole provider or one model | `model_specific` | Enum: provider_wide, model_specific | — |
| `official_model_id` | Which model, if scope = model_specific | `claude-fable-5` | Required if scope = model_specific, else null | Should match `model-pricing.csv.official_model_id` |
| `data_retention_days` | Default log retention | `30` | Integer ≥ 0, nullable if not documented | — |
| `zdr_availability` | Zero Data Retention status | `enterprise_only` | Enum: yes, no, enterprise_only, not_documented | — |
| `training_policy` | Whether inputs/outputs train the model | `not_used` | Enum: not_used, used_free_tier_only, opt_in, not_documented | — |
| `dpa_availability` | Whether a DPA is offered | `not_documented` | Enum: yes, no, not_documented | — |
| `regional_restrictions` | Free-text region notes | `"Suspended globally Jun 12–Jun 30, 2026 under export control; restored Jul 1"` | Free text, nullable | — |
| `sla` | SLA commitment, if published | (blank) | Free text, nullable | Currently expected null for all rows — see Phase C.5 §4 |
| `source_id` | FK to `sources.csv` | `SRC-0012` | Must exist | — |
| `repository_status` | Ingestion gate | `READY` | Enum: READY, WAIT, BLOCKED | See §7 |

### 3.6 `pricing-audit-gaps.csv`

| Column | Purpose | Example Value | Validation | Dependencies |
|---|---|---|---|---|
| `gap_id` | Primary key | `GAP-0001` | Unique | — |
| `provider` | Provider | `xAI` | Same enum | — |
| `field_description` | What the field would have been | `"Grok 4.5 Batch API discount"` | Free text | — |
| `claimed_value` | What Phase C originally reported, if any | `"50% off standard"` | Free text, nullable | — |
| `status` | Why it's excluded | `CONFLICTING` | Enum: SECONDARY_ONLY, CONFLICTING, UNVERIFIED | — |
| `reason` | The evidentiary reason | `"docs.x.ai states models not listed receive no batch discount; grok-4.5 is not listed"` | Free text | — |
| `action_required` | What would resolve it | `"None — treat as confirmed-absent, not pending"` | Free text | — |
| `date_logged` | When logged | `2026-07-18` | ISO date | — |

---

## 4. Field-Level Ingestion Table

Grouped by destination file. "Value Type" = stated (verbatim on the official page) or derived (computed from a stated rule). All rows below carry `confidence: high` unless noted.

### 4.1 → `provider-pricing.csv`

| Field | Model(s) | Column(s) | Data Type | Req/Opt | Value Type | Primary Source | Repository Status |
|---|---|---|---|---|---|---|---|
| Standard input price | GPT-5.6 Sol/Terra/Luna | `price_value` (pricing_dimension=input) | decimal | Required | stated | developers.openai.com compare page | READY |
| Standard output price | GPT-5.6 Sol/Terra/Luna | `price_value` (output) | decimal | Required | stated | developers.openai.com compare page | READY |
| Cached input (0.1×) | GPT-5.6 Sol/Terra/Luna | `price_value` (cached_input) | decimal | Required | **derived** | developers.openai.com model pages (multiplier rule) | READY |
| Cache write (1.25×) | GPT-5.6 Sol/Terra/Luna | `price_value` (cache_write_5m) | decimal | Required | **derived** | developers.openai.com model pages (multiplier rule) | READY |
| Long-context input (2×), output (1.5×), >272K | GPT-5.6 Sol/Terra/Luna | `price_value` (long_context_input/output), `context_tier` = `>272K` | decimal | Required | stated | developers.openai.com/api/docs/models/gpt-5.6-sol | READY |
| Data-residency uplift +10% | GPT-5.6 (models ≥ Mar 5 2026) | note in `context_tier` or separate row tagged `residency_uplift` | decimal (percent) | Optional | stated | developers.openai.com/api/docs/pricing | READY |
| Fable 5 / Mythos 5 input/output | Claude Fable 5 | `price_value` (input=$10, output=$50) | decimal | Required | stated | platform.claude.com pricing | READY |
| Opus 4.8 full pricing (input/output/cache tiers/batch) | Claude Opus 4.8 | `price_value` × 6 dimension rows | decimal | Required | stated | platform.claude.com pricing | READY |
| Sonnet 5 intro pricing (thru Aug 31) | Claude Sonnet 5 | `price_value`, `effective_date` range flagged in notes | decimal | Required | stated | platform.claude.com pricing / anthropic.com/news | READY |
| Sonnet 5 standard pricing (from Sep 1) | Claude Sonnet 5 | separate row, `effective_date = 2026-09-01` | decimal | Required | stated | platform.claude.com pricing | READY |
| Cache multipliers 1.25×/2×/0.1× | All Claude models | `price_value` (cache_write_5m/1h, cached_input) | decimal | Required | stated | platform.claude.com pricing | READY |
| Web search $10/1k | Claude models | `price_value` (web_search), `billing_unit = per_1000_calls` | decimal | Required | stated | platform.claude.com pricing | READY |
| Code execution $0.05/hr after 1550 free hrs | Claude models | `price_value` (code_execution), `billing_unit = per_hour` | decimal | Required | stated | platform.claude.com pricing | READY |
| Gemini 3.1 Pro Preview standard/long-context/priority/cache/storage | Gemini 3.1 Pro Preview | 8 dimension rows | decimal | Required | stated | ai.google.dev/gemini-api/docs/pricing | READY |
| Gemini 3.1 Flash-Lite standard/priority/cache | Gemini 3.1 Flash-Lite | 5 dimension rows | decimal | Required | stated | ai.google.dev/gemini-api/docs/pricing | READY |
| Search grounding $14/1000 after 5000 free | Gemini 3 family | `price_value` (search_grounding) | decimal | Required | stated | ai.google.dev pricing | READY |
| Grok 4.5 standard ($2/$0.50/$6) | Grok 4.5 | 3 dimension rows | decimal | Required | stated | docs.x.ai/developers/pricing | READY |
| Grok 4.5 long-context >200K ($4/$1/$12) | Grok 4.5 | 3 dimension rows, `context_tier = >200K` | decimal | Required | stated | docs.x.ai/developers/pricing | READY |
| DeepSeek V4 Pro/Flash cache-hit/miss/output | V4 Pro, V4 Flash | 6 dimension rows | decimal | Required | stated | api-docs.deepseek.com/quick_start/pricing | READY |
| GLM-5.2 input/cached/output/storage | GLM-5.2 | 4 dimension rows | decimal | Required | stated | docs.z.ai/guides/overview/pricing | READY |
| OpenRouter parity prices (closed models) | GPT-5.6 Terra, Sonnet 5, Gemini 3.1 Pro, Grok 4.5 | `channel = openrouter`, `openrouter_model_slug` | decimal | Required | stated | openrouter.ai model pages | READY |
| OpenRouter deltas (open-weight models) | DeepSeek V4 Flash, GLM-5.2, Qwen3.6-Max-Preview | `channel = openrouter`, `openrouter_model_slug` | decimal | Required | stated (OR side); provider-side baseline for Qwen is WAIT | openrouter.ai model pages | READY (OR price) / WAIT (Qwen direct baseline) |

### 4.2 → `model-pricing.csv`

| Field | Model(s) | Column(s) | Data Type | Req/Opt | Primary Source | Repository Status |
|---|---|---|---|---|---|---|
| Official model IDs + aliases | GPT-5.6 Sol/Terra/Luna | `official_model_id` | string | Required | developers.openai.com | READY |
| Context 1.05M / max output 128K | GPT-5.6 family | `context_window_tokens`, `max_output_tokens` | integer | Required | developers.openai.com | READY |
| Knowledge cutoff Feb 16, 2026 | GPT-5.6 family | `knowledge_cutoff` | date | Optional | developers.openai.com | READY |
| Fable 5 identity (Mythos-class, not numbered tier) | Claude Fable 5 | `aifa_display_name` note + `availability_status` | string | Required | anthropic.com/news/claude-fable-5-mythos-5 | READY |
| Access-control timeline | Fable 5 / Mythos 5 | `account_requirements` free text | string | Required | anthropic.com/news/redeploying-fable-5 | READY |
| Opus 4.8 / Sonnet 5 official IDs | Opus 4.8, Sonnet 5 | `official_model_id` | string | Required | platform.claude.com | READY |
| Context 1M / max output 128K | All current Claude models | `context_window_tokens`, `max_output_tokens` | integer | Required | platform.claude.com | READY |
| Gemini 3.1 Pro Preview IDs, paid-only | Gemini 3.1 Pro Preview | `official_model_id`, `account_requirements` | string | Required | ai.google.dev | READY |
| Gemini 3.1 Flash-Lite ID, free+paid | Gemini 3.1 Flash-Lite | `official_model_id`, `account_requirements` | string | Required | ai.google.dev | READY |
| grok-4.5 ID + aliases, 500K context | Grok 4.5 | `official_model_id`, `context_window_tokens` | string/int | Required | docs.x.ai | READY |
| Grok 4.5 knowledge cutoff, launch date | Grok 4.5 | `knowledge_cutoff` | date | Optional | docs.x.ai / x.ai/news | READY |
| DeepSeek V4 IDs, 1M/384K | V4 Pro, V4 Flash | `official_model_id`, context/output columns | string/int | Required | api-docs.deepseek.com | READY |
| Legacy alias deprecation Jul 24, 2026 | V4 Flash | `account_requirements` note | string | Optional | api-docs.deepseek.com | READY |
| GLM-5.2 ID, GA | GLM-5.2 | `official_model_id`, `availability_status` | string | Required | docs.z.ai | READY |
| GLM-5.2 context/max output | GLM-5.2 | `context_window_tokens`, `max_output_tokens` | integer | Optional | *not on official pricing page* | **WAIT** |
| Qwen3.6-Max-Preview ID, Preview status | Qwen3.6-Max-Preview | `official_model_id`, `availability_status` | string | Required | alibabacloud.com Model Studio | READY (ID) |
| Qwen3.6-Max-Preview context/modality/scope | Qwen3.6-Max-Preview | `context_window_tokens`, notes | integer/string | Optional | *not confirmed on official page this pass* | **WAIT** |

### 4.3 → `commercial-terms.csv`

| Field | Scope | Column(s) | Primary Source | Repository Status |
|---|---|---|---|---|
| Covered-Model 30-day retention even under ZDR | Fable 5, Mythos 5 (model_specific) | `data_retention_days=30`, `zdr_availability=enterprise_only` w/ note | platform.claude.com api-and-data-retention | READY |
| ZDR available for qualifying enterprise | Anthropic (provider_wide) | `zdr_availability=enterprise_only` | platform.claude.com | READY |
| inference_geo "us" 1.1× uplift | Anthropic (provider_wide, pricing-adjacent but policy-triggered) | `regional_restrictions` note | platform.claude.com pricing | READY |
| Fable 5 export-control suspension/restoration | Fable 5 (model_specific) | `regional_restrictions` | anthropic.com/news/redeploying-fable-5 | READY |
| Google: paid tier not used to train, free tier is | Google (provider_wide) | `training_policy` | ai.google.dev | READY |
| Anthropic default 7-day retention, Sept 14 2025 effective | Anthropic (provider_wide) | `data_retention_days`, note | *not confirmed on official page this pass* | **WAIT** |
| Anthropic DPA auto-incorporation, Jan 1 2026 | Anthropic (provider_wide) | `dpa_availability` | *not located* | **BLOCKED** |
| Anthropic ISO 27001:2022 / ISO 42001 / SOC 2 | Anthropic (provider_wide) | not modeled — no column fits certification lists cleanly; recommend free-text note only if added | *not verified this pass* | **BLOCKED** |
| xAI data-sharing/training opt-in program | xAI (provider_wide) | `training_policy=opt_in` | docs.x.ai/developers/faq/security | READY |
| Zhipu Entity List compliance flag | Zhipu (provider_wide) | `regional_restrictions` | *procurement/compliance note, not a provider doc claim* | **WAIT** — route to legal review, not silent ingestion |

### 4.4 → `pricing-audit-gaps.csv`

| Gap | Provider | Status | Reason |
|---|---|---|---|
| Grok 4.5 "50% batch discount" | xAI | CONFLICTING → corrected | docs.x.ai states unlisted models get no batch discount; grok-4.5 is unlisted |
| Grok 4.5 "150 requests/minute" | xAI | CONFLICTING → corrected | Official value is 150 requests/**second**; TPM 50M is correct as stated |
| OpenAI GPT-5.6 Batch (50%) / Priority tier rows | OpenAI | SECONDARY_ONLY | Not captured on the specific pages fetched this pass |
| OpenAI GA date (Jul 9) | OpenAI | SECONDARY_ONLY | Preview date confirmed; GA date not on model pages |
| OpenAI web-search tool pricing ($10/1k, $25/1k) | OpenAI | SECONDARY_ONLY | Tool pricing rows not captured this pass |
| Anthropic Opus 4.8 release date (May 28, 2026) | Anthropic | SECONDARY_ONLY | Not on official pages fetched |
| Anthropic 7-day default retention / Sept 14 2025 date | Anthropic | SECONDARY_ONLY | Covered-Model 30-day rule confirmed; general default date not confirmed |
| Anthropic DPA incorporation / Jan 1 2026 effective date | Anthropic | UNVERIFIED | Not located |
| Anthropic ISO/SOC certifications | Anthropic | UNVERIFIED | Not verified at Trust Center this pass |
| Qwen3.6-Max-Preview Singapore/Beijing per-token pricing | Alibaba | SECONDARY_ONLY / UNVERIFIED (Beijing) | Not confirmed on alibabacloud.com pricing page this pass |
| Qwen3.6-Max-Preview context/modality/scope/free quota | Alibaba | SECONDARY_ONLY | Not confirmed on official model page this pass |
| GLM-5.2 context window / max output | Zhipu | UNVERIFIED | Confirmed absent from official pricing page |
| GLM-5.2 MIT license / self-hosting claim | Zhipu | SECONDARY_ONLY | From secondary sources; verify on model card |

---

## 5. Source Traceability

Every row in `provider-pricing.csv`, `model-pricing.csv`, and `commercial-terms.csv` must carry, directly or via `source_id` join:

- **Official URL** — from `sources.csv.url`
- **Provider** — from `sources.csv.provider`
- **Verification Date** — from `sources.csv.verification_date` (2026-07-18 for this batch)
- **Last Checked** — from `sources.csv.last_checked`
- **Confidence Level** — from `sources.csv.confidence`
- **Verification Method** — from `sources.csv.verification_method`

No row may be ingested into `provider-pricing.csv`, `model-pricing.csv`, or `commercial-terms.csv` without a valid `source_id` join. This is the mechanism that keeps `pricing-audit-gaps.csv` honest — a row can only be marked READY if it resolves to a source row with `verification_method != secondary_corroboration` (secondary corroboration alone routes to the gaps file, not the Source of Truth).

---

## 6. Validation Impact

The founder's earlier note that "the AIFA repository already contains ... the validation framework" means the actual rule implementations were not available for inspection here. What follows is what **must** change, described at the rule level, for the implementation agent to locate and update the corresponding validator code.

| Validator | Will it change? | What's required |
|---|---|---|
| Model-ID validator (checks `official_model_id` is well-formed / known) | **Yes** | Must accept the newly verified IDs (`gpt-5.6-sol/terra/luna`, `claude-fable-5`, `claude-opus-4-8`, `claude-sonnet-5`, `gemini-3.1-pro-preview[-customtools]`, `gemini-3.1-flash-lite`, `grok-4.5[-latest]`, `deepseek-v4-pro/flash`, `qwen3.6-max-preview`, `glm-5.2`) as a known set. |
| Pricing-completeness validator (flags a model with missing dimensions) | **Yes** | New rule needed: a model may legitimately have **no** batch dimension (DeepSeek, GLM-5.2, xAI Grok 4.5) — the validator must not flag "missing batch price" as an error for these; it should distinguish "not offered" (confirmed absent, `value_type` not applicable) from "not yet ingested" (WAIT/BLOCKED). |
| Currency/unit validator | No structural change | Continue enforcing `currency=USD`, `billing_unit` enum — the new rows conform. |
| Tier/context-boundary validator | **Yes** | New rule needed to check that `context_tier` boundaries per model don't overlap or gap (e.g., OpenAI's `≤272K` / `>272K` split; Google's `≤200K` / `>200K`; xAI's `≤200K` / `>200K`; Alibaba's `≤128K` / `128K–256K`). |
| Derived-value validator | **New validator required** | Nothing currently checks `value_type=derived` rows against the stated multiplier in `assumptions.yaml`. Add a rule: for any row where `value_type=derived`, recompute from the linked multiplier rule and confirm it matches `price_value` within rounding tolerance. |
| FK-integrity validator (source_id, official_model_id joins) | **Yes** | Extend to cover the new `commercial-terms.csv` file and the `channel=openrouter` rows in `provider-pricing.csv` (which join to `openrouter_model_slug` rather than requiring a second `official_model_id`-only join). |
| Repository-status gate validator (blocks READY rows from downstream use if not truly READY) | **Yes** | Must reject any row where `repository_status != READY` from being read by anything downstream of the raw tables (e.g., a future scenario-cost calculator). This is the enforcement mechanism for keeping WAIT/BLOCKED data out of production use even though it physically sits in the same repo. |
| Effective-date validator | No structural change, one new case | Must allow `effective_date=null` combined with a non-null `verification_date` on the linked source — currently unclear whether the existing validator permits this combination; the implementation agent should confirm. |

---

## 7. Migration Plan

**Step 1 — `assumptions.yaml`**
Update first because every other file's interpretation (derived values, missing-date handling, currency/unit defaults) depends on these conventions being defined before anyone reads a number out of the pricing tables.

**Step 2 — `sources.csv`**
Update second because every row in every subsequent file requires a valid `source_id`. Registering all ~20 official URLs from Phase C.5 in one batch avoids partial-FK states.

**Step 3 — `provider-pricing.csv`**
Update third: this is the largest table and the core deliverable of the pricing audit. It only requires `sources.csv` to exist (Step 2) — it does not strictly require `model-pricing.csv` to exist first, since `official_model_id` is a plain string match, not an enforced FK in this file itself.

**Step 4 — `model-pricing.csv`**
Update fourth: this is where the AIFA-internal alias layer is built, and it's cleanest to build it once the *official* model IDs it references are already sitting in `provider-pricing.csv` — that way a typo in an alias mapping is caught immediately by cross-referencing, rather than being written first and validated later.

**Step 5 — `commercial-terms.csv`**
Update fifth: independent of the pricing tables in content, but logically sequenced after the model identity layer exists, since several rows are `scope=model_specific` (e.g., Fable 5's Covered-Model retention rule) and need `official_model_id` to already be a known value.

**Step 6 — `pricing-audit-gaps.csv`**
Update last, as a reconciliation step: once Steps 1–5 are done, everything that did NOT get a READY row should be enumerated here. This ordering makes the gaps file a checksum — if a field from Phase C.5 doesn't appear in either the Source of Truth tables or the gaps file, that's a sign something was dropped and Steps 1–5 need review before closing this phase.

**Not scheduled this phase:** `scenario-costs.csv` — remains untouched pending a separate founder decision on credit/margin methodology (§2.1).

---

## 8. Risk Analysis

### Safe to ingest immediately (READY)
The ~59 fields marked `OFFICIAL_VERIFIED` in Phase C.5, plus the ~5 `OFFICIAL_DERIVED` OpenAI cache figures (computed from a stated multiplier rule, not guessed). These carry a direct or one-hop-derived citation to a first-party page fetched on 2026-07-18. Ingesting them now is low-risk because each has a `source_id` that a reviewer can independently re-open.

### Requires manual review (WAIT)
- OpenAI batch/priority/web-search rows, GA date — plausible and internally consistent, but not confirmed on the specific pages fetched. Needs one more fetch pass, not a policy decision.
- Anthropic Opus 4.8 release date, 7-day default retention date — same category: likely correct, not yet first-party confirmed.
- Zhipu GLM-5.2 and Alibaba Qwen3.6-Max-Preview context/output/scope specs — the pricing page doesn't carry these; they likely live on a separate model-card page not yet fetched.
These are WAIT, not BLOCKED, because the fix is "fetch one more official page," not "resolve a conflict" or "wait on the founder."

### Must remain outside the repository (BLOCKED)
- **xAI Grok 4.5 batch discount claim** — actively contradicted by the official page. This isn't missing evidence, it's wrong evidence, and ingesting it would put an incorrect number in the Source of Truth. Corrected value ("no batch discount for grok-4.5") is what should be recorded, not the original claim.
- **xAI rate-limit unit** — same category: the original "150/minute" is wrong; official is 150/second.
- **Anthropic DPA incorporation date and ISO/SOC certifications** — these are compliance/legal claims. Getting them wrong has downstream contractual consequences (the founder's own manifesto treats "legal legitimacy" as a core differentiator), so per the founder's own "no price war, ever"-style discipline around not cutting corners on trust claims, these should stay BLOCKED until confirmed at trust.anthropic.com specifically, not inferred from a pricing or product page.
- **Alibaba China Beijing pricing** — no first-party confirmation at all this pass; treated as BLOCKED rather than WAIT because unlike the WAIT items above, no fetch of the pricing page located this row, so there's genuine uncertainty whether it's documented publicly at all.

---

## 9. Final Note for the Implementation Agent

This plan resolves every architectural choice: file destinations, new-file justification, column schemas, data types, enums, FK relationships, migration order, and the READY/WAIT/BLOCKED gate for every field audited in Phase C.5. Executing it should not require inventing a column, choosing a file, or deciding whether a field is trustworthy enough to ingest — those decisions are made above.

The one thing the implementation agent must still do before writing anything is the Section 0 reconciliation: confirm the real repository's file and column names match what's assumed here, since this plan was built without live repository access. If they don't match, that's a data-entry correction to this plan, not grounds to re-architect it.
