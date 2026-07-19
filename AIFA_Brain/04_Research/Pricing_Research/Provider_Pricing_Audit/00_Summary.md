# Provider Pricing Audit — Chat Portfolio (Phase C → C.5 → D → D.5)

| Field | Value |
|---|---|
| **Title** | Provider Pricing Audit — Chat Portfolio Summary |
| **Created** | 2026-07-18 |
| **Updated** | 2026-07-19 |
| **Owner** | AIFA_Brain maintainers (synchronization); Platform maintainers (schema/ADR ownership) |
| **Status** | Active |
| **Version** | 1.1 |
| **Dependencies** | [`01_Phase_C_Chat_Pricing_Audit.md`](01_Phase_C_Chat_Pricing_Audit.md), [`02_Phase_C5_Official_Verification_Pass.md`](02_Phase_C5_Official_Verification_Pass.md), [`03_Phase_D_Repository_Ingestion_Plan.md`](03_Phase_D_Repository_Ingestion_Plan.md) |
| **Related Docs** | [`../README.md`](../README.md), [`../../../11_Pricing/README.md`](../../../11_Pricing/README.md), [`../../../MASTER_INDEX.md`](../../../MASTER_INDEX.md), [`../../../../Platform/docs/adr/0025-pricing-source-of-truth.md`](../../../../Platform/docs/adr/0025-pricing-source-of-truth.md), [`../../../../Platform/docs/adr/0026-phase-c5-evidence-vocabulary-mapping.md`](../../../../Platform/docs/adr/0026-phase-c5-evidence-vocabulary-mapping.md), [`../../../../Platform/docs/pricing/staging/2026-07-18-chat/`](../../../../Platform/docs/pricing/staging/2026-07-18-chat/) |
| **Tags** | `pricing, provider-pricing, chat, phase-c, phase-c5, phase-d, phase-d5, evidence, staging` |

## Summary

**FACT.** Four artifacts were supplied for this chat-portfolio provider-pricing audit: a raw research report (Phase C), a field-level official-source verification pass (Phase C.5), a repository ingestion plan (Phase D, produced without live repository access), and this synchronization task itself (Phase D.5). This document is the canonical entry point; the three source artifacts are preserved verbatim (metadata-header only) in this folder, and the reconciled, deterministic staging package they feed is at [`Platform/docs/pricing/staging/2026-07-18-chat/`](../../../../Platform/docs/pricing/staging/2026-07-18-chat/).

**No production pricing data was changed by this synchronization pass.** `Platform/docs/pricing/model-pricing.csv`, `provider-pricing.csv`, `sources.csv`, `pricing-audit-gaps.csv`, and `scenario-costs.csv` are untouched. This document and its staging package are the reviewable input to a separate, later Phase E.

## What each phase actually is

| Phase | What it produced | Status |
|---|---|---|
| **C** | Raw provider research across 7 chat-model providers (OpenAI, Anthropic, Google, xAI, DeepSeek, Alibaba, Zhipu) + OpenRouter routing observations. Mixed first-party/secondary evidence — **not itself eligible for ingestion**. | Complete, preserved as [`01_Phase_C_Chat_Pricing_Audit.md`](01_Phase_C_Chat_Pricing_Audit.md) |
| **C.5** | Field-level official-source verification of Phase C's claims, using a 5-class evidence vocabulary (`OFFICIAL_VERIFIED`, `OFFICIAL_DERIVED`, `SECONDARY_ONLY`, `CONFLICTING`, `UNVERIFIED`). **The evidentiary authority** — where C and C.5 conflict, C.5 wins. | Complete, preserved as [`02_Phase_C5_Official_Verification_Pass.md`](02_Phase_C5_Official_Verification_Pass.md) |
| **D** | A proposed repository ingestion plan (file destinations, schemas, migration order, a `READY`/`WAIT`/`BLOCKED` gate), explicitly produced **without reading the live repository**. | Complete as a proposal — **not automatically authoritative**; reconciled against the real repository in Phase D.5 (see [`03_Phase_D_Repository_Ingestion_Plan.md`](03_Phase_D_Repository_Ingestion_Plan.md)'s import reconciliation note) |
| **D.5** | This synchronization pass: import the three artifacts above, reconcile Phase D's proposed schemas against the real ones, and produce a deterministic, machine-readable Phase E staging package with atomic field-level dispositions. | Complete — this document + [`Platform/docs/pricing/staging/2026-07-18-chat/`](../../../../Platform/docs/pricing/staging/2026-07-18-chat/) |

## Three different questions, not one — read this before trusting any "0 ELIGIBLE" framing

An earlier pass over this batch collapsed three distinct questions into a single `PENDING` disposition, which made 178 well-evidenced facts look indistinguishable from genuinely unverified ones. They are not the same question:

1. **Is the fact verified by an official source?** — Phase C.5's evidence classification (`OFFICIAL_VERIFIED`/`OFFICIAL_DERIVED` vs. `SECONDARY_ONLY`/`UNVERIFIED`/`CONFLICTING`), mapped per [ADR-0026](../../../../Platform/docs/adr/0026-phase-c5-evidence-vocabulary-mapping.md) §1.
2. **Is the fact structurally compatible with the current production schema?** — whether `model-pricing.csv`/`provider-pricing.csv` already has a column that fits it (`direct`/`transformation`) or genuinely does not (`no-fit`), per [`mapping_manifest.yaml`](../../../../Platform/docs/pricing/staging/2026-07-18-chat/mapping_manifest.yaml).
3. **Is the fact safe to ingest automatically right now?** — no, for every fact in this batch, but **for a specific, stated reason per fact**, not a blanket "unverified."

### The actual numbers (of 143 staged model/pricing/commercial-policy facts)

| | Count | What blocks it |
|---|---|---|
| **Officially verified** (Phase C.5 `OFFICIAL_VERIFIED`/`OFFICIAL_DERIVED`) | **130** | — |
| — of which blocked *only* by routine source-URL re-confirmation (an engineering/research task, not a decision) | **90** | Phase C.5 supplies no literal URLs in its own text; every URL here traces only to Phase D's proposal and needs one independent re-fetch pass per source. Schema destination already exists (direct fit or the existing `billing_dimension`/`unit_price` generic mechanism). |
| — of which additionally blocked by a genuine schema/product decision | **40** | See "Founder/architecture decisions" below — a production column or file does not exist yet, or a specific modeling ambiguity needs sign-off. URL re-confirmation is *also* required for these, but resolving the URL alone would not make them ingestible. |
| **Not yet verified** (Phase C.5 `SECONDARY_ONLY`/`UNVERIFIED`) | **13** | Genuine research gaps — one more official-page fetch pass needed (or, for 2 Anthropic compliance claims, confirmation at a Trust Center specifically). Logged individually in [`audit_gaps.yaml`](../../../../Platform/docs/pricing/staging/2026-07-18-chat/audit_gaps.yaml). |

Plus, tracked separately (not part of the 143): **13** proposed sources (all gated on the same URL re-confirmation task), and **2** xAI claims correctly `REJECTED` (contradicted by official evidence, not merely pending).

**The takeaway: 130 facts are already officially verified — that is not "0 eligible."** What's actually true is that *zero* facts have cleared the additional, independent bar of an independently re-confirmed citation, which is one specific, boundable engineering task (re-fetch 13 URLs), not a referendum on the research quality.

### Founder/architecture decisions (the real bottleneck — 40 facts, 4 decisions)

Reserved for genuine product/commercial/legal/architectural choices, per [`mapping_manifest.yaml`](../../../../Platform/docs/pricing/staging/2026-07-18-chat/mapping_manifest.yaml):

1. **Add model-spec columns to `model-pricing.csv`** (context window, max output, knowledge cutoff, availability status) — no column exists today. Affects 24 verified facts (+ 4 still-unverified ones, moot until researched anyway).
2. **How to represent OpenAI's dual long-context multiplier** (input 2× vs. output 1.5× — one column, two values needed) — a data-modeling decision (two tagged rows vs. a schema extension). Affects 4 verified facts.
3. **Whether an OpenRouter model-slug column is added** (vs. `notes`-only, the current fallback) — affects 4 verified facts.
4. **Whether `commercial-terms.csv` is created** (Phase D's proposal, preserved but not pre-approved) — affects 8 verified + 3 unverified commercial/policy facts with no production destination at all today.

Everything else — URL re-confirmation, the generic `billing_dimension` transformation writes, `sources.csv`/`pricing-audit-gaps.csv` ID and priority/owner assignment, validator rule additions — is ordinary engineering work and does not require founder sign-off. See [`PHASE_E_RUNBOOK.md`](../../../../Platform/docs/pricing/staging/2026-07-18-chat/PHASE_E_RUNBOOK.md) for the ordered task list.

## The verified field-level ingestion policy

Per ADR-0025 (existing, Accepted) and ADR-0026 (new, Accepted — records the Phase C.5 vocabulary mapping without editing ADR-0025):

- Only `OFFICIAL_EXPLICIT` and `OFFICIAL_DERIVED` facts (ADR-0025's vocabulary) are eligible for production `provider-pricing.csv`/`model-pricing.csv` rows — mapped from Phase C.5's `OFFICIAL_VERIFIED`→`OFFICIAL_EXPLICIT` and `OFFICIAL_DERIVED`→`OFFICIAL_DERIVED`.
- `SECONDARY_ONLY` facts map to `UNVERIFIED` for production eligibility (the original Phase C.5 evidence state is retained in staging metadata, not discarded).
- `CONFLICTING` facts are prohibited from production entirely and retained only as an audit-gap reason.
- A **third, independent, staging-only** disposition (`ELIGIBLE` / `PENDING` / `REJECTED`) governs whether a fact is ready for the Phase E runbook to act on — this is not a production CSV column; see ADR-0026 §3.

## Known xAI corrections (must never re-enter through a later copy)

1. **Grok 4.5 does not receive a 50% Batch discount.** The original Phase C claim is `CONFLICTING` — official documentation states unlisted models receive no Batch discount, and Grok 4.5 is unlisted.
2. **Grok 4.5's rate limit is 150 requests per *second*, not per minute.** The original Phase C claim used the wrong unit.

Both are recorded with `disposition: REJECTED` in `audit_gaps.yaml`, explicitly so a future spreadsheet import or copy-paste cannot silently reintroduce them.

## Remaining evidence gaps (the 13 not-yet-verified facts; full detail in `audit_gaps.yaml`)

- OpenAI: Batch/Priority/web-search pricing rows, exact GA date.
- Anthropic: Opus 4.8 release date, general default-retention effective date, DPA incorporation date, ISO 27001/ISO 42001/SOC 2 certification claims (compliance/legal — confirm at a Trust Center specifically, do not infer from a pricing page).
- Alibaba/Qwen: direct token pricing (Singapore secondary-only, Beijing unverified), context/modality/regional scope/free quota.
- Zhipu/GLM-5.2: context window, max output, license/self-hosting claims.

## Real-schema reconciliation — the single most consequential finding

Phase D proposed a **long/row-per-dimension** `provider-pricing.csv` and a `portfolio_model_id`/`context_window_tokens`/... `model-pricing.csv`; the live repository has a **wide** `provider-pricing.csv` (three standard price columns + a generic `billing_dimension`/`unit_price`/`unit_name`/`unit_quantity` escape hatch) and a `model-pricing.csv` with no model-spec columns at all. Reconciling the two:

- **Direct fit** (existing column, no transformation): standard input/cached_input/output prices, `official_model_id`/`official_model_name`, most `audit_gaps.yaml` fields, `sources.csv` columns.
- **Transformation** (existing generic mechanism used non-trivially, no new column needed): cache-write prices, tool pricing (web search, code execution), cache storage, search grounding, via `billing_dimension`/`unit_price`. This resolves most of what looked like schema gaps in Phase D's naive long-format reading.
- **No-fit / founder decision required**: the 4 items listed above.

`assumptions.yaml` and `scenario-costs.csv` are untouched — Phase D's own assessment that they're out of scope matched the live repository's actual state. See [`mapping_manifest.yaml`](../../../../Platform/docs/pricing/staging/2026-07-18-chat/mapping_manifest.yaml) for the full per-record-class table (the authoritative, machine-readable form of this reconciliation).

## The boundary this audit does not cross

Per Phase C's own "Phase Boundary" section (preserved verbatim) and this synchronization task's explicit scope: this audit is **provider-cost research only**. It does not calculate, and this synchronization pass did not calculate:

- AIFA Credit values or conversion rates.
- Customer markup or gross margin.
- Subscription pricing.
- Customer-facing Toman prices.
- Smart-routing economics.

Those remain founder/business-pricing decisions, recorded (once made) in `AIFA_Brain/11_Pricing/` and `AIFA_Brain/12_Decisions/BUSINESS_DECISION_LOG.md` — not in this research folder, and not something a provider-cost audit can determine on its own. See `AIFA_Brain/04_Research/Market_Intelligence/05_Pricing_Intelligence.md` for the related (but distinct) customer-facing pricing research, which this provider-cost audit complements rather than duplicates.

## Scope note: this folder vs. `Pricing_Research/`'s original purpose

`Pricing_Research/README.md` originally scopes this folder to **competitor** pricing (what OpenRouter, Poe, and others charge AIFA's own customers — demand-side market context feeding `11_Pricing/`). Phase C/C.5/D are about **AIFA's own upstream supplier costs** (what OpenAI, Anthropic, Google, etc. charge AIFA — supply-side vendor cost, governed by `Platform/docs/adr/0025-pricing-source-of-truth.md`). These are genuinely different research questions that happen to share the word "pricing." This audit is stored here (per the synchronization task's explicit instruction) in the dedicated `Provider_Pricing_Audit/` subfolder rather than merged into the folder's original competitor-pricing scope — see `../README.md`'s updated Purpose section for how the two are now distinguished.

## Next step

**Founder/architecture review of the 4 decisions above**, in parallel with the ordinary engineering task of re-confirming the 13 source URLs — the two do not block each other. Then Phase E (production dataset implementation) per [`PHASE_E_RUNBOOK.md`](../../../../Platform/docs/pricing/staging/2026-07-18-chat/PHASE_E_RUNBOOK.md).

## Still out of scope / pending (unchanged by this pass)

Credit Engine economics · Margin Engine · Subscription pricing · Scenario costs · Smart-routing economics.
