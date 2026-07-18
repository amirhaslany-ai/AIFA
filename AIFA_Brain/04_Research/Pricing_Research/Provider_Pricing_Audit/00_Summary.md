# Provider Pricing Audit — Chat Portfolio (Phase C → C.5 → D → D.5)

| Field | Value |
|---|---|
| **Title** | Provider Pricing Audit — Chat Portfolio Summary |
| **Created** | 2026-07-18 |
| **Updated** | 2026-07-18 |
| **Owner** | AIFA_Brain maintainers (synchronization); Platform maintainers (schema/ADR ownership) |
| **Status** | Active |
| **Version** | 1.0 |
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

## INSIGHT — the single most consequential finding of this synchronization pass

**Phase C.5 supplies zero literal source URLs anywhere in its own text**, despite its own "Repository Eligibility Rule" requiring "exact official URL or source ID resolving to it" for a fact to be production-eligible. The only URLs anywhere in the supplied bundle appear in Phase D — the lowest-precedence document, which self-describes as "produced without direct read access to the live AIFA repository... works from file names supplied as examples" (i.e., Phase D's own scope disclaimer is about repository structure, but its citation URLs carry the same "not independently confirmed" character).

**Consequence:** no fact in this batch currently satisfies Phase C.5's own eligibility rule from evidence internal to the supplied bundle alone. Every source in the Phase E staging package is therefore capped at staging disposition `PENDING — URL re-confirmation required`, never `ELIGIBLE`, regardless of how strong the underlying evidence classification (`OFFICIAL_VERIFIED`, etc.) otherwise is. This is not a rejection of the research — the evidence classifications themselves are retained and used to prioritize the eventual re-confirmation pass — but it means **Phase E cannot auto-ingest anything from this batch without a human (or a fresh, URL-citing fetch pass) re-confirming that Phase D's proposed URLs are the actual pages Phase C.5 verified against.** See [`Platform/docs/pricing/staging/2026-07-18-chat/sources.yaml`](../../../../Platform/docs/pricing/staging/2026-07-18-chat/sources.yaml) and the mapping manifest for the full accounting.

## The verified field-level ingestion policy

Per ADR-0025 (existing, Accepted) and ADR-0026 (new, Accepted — records the Phase C.5 vocabulary mapping without editing ADR-0025):

- Only `OFFICIAL_EXPLICIT` and `OFFICIAL_DERIVED` facts (ADR-0025's vocabulary) are eligible for production `provider-pricing.csv`/`model-pricing.csv` rows — mapped from Phase C.5's `OFFICIAL_VERIFIED`→`OFFICIAL_EXPLICIT` and `OFFICIAL_DERIVED`→`OFFICIAL_DERIVED`.
- `SECONDARY_ONLY` facts map to `UNVERIFIED` for production eligibility (the original Phase C.5 evidence state is retained in staging metadata, not discarded).
- `CONFLICTING` facts are prohibited from production entirely and retained only as an audit-gap reason.
- A **third, independent, staging-only** disposition (`ELIGIBLE` / `PENDING` / `REJECTED`) governs whether a fact is ready for the Phase E runbook to act on — this is not a production CSV column; see the taxonomy note below.

## Known xAI corrections (must never re-enter through a later copy)

1. **Grok 4.5 does not receive a 50% Batch discount.** The original Phase C claim is `CONFLICTING` — official documentation states unlisted models receive no Batch discount, and Grok 4.5 is unlisted.
2. **Grok 4.5's rate limit is 150 requests per *second*, not per minute.** The original Phase C claim used the wrong unit.

Both are recorded with `disposition: REJECTED` in the staging package's `audit_gaps` section, explicitly so a future spreadsheet import or copy-paste cannot silently reintroduce them.

## Remaining evidence gaps (headline items; full list in the staging package and preserved Phase C.5 artifact)

- OpenAI: Batch/Priority/web-search pricing rows, exact GA date.
- Anthropic: Opus 4.8 release date, general default-retention effective date, DPA incorporation date, ISO 27001/ISO 42001/SOC 2 certification claims.
- Alibaba/Qwen: direct token pricing (Singapore secondary-only, Beijing unverified), context/modality/regional scope/free quota.
- Zhipu/GLM-5.2: context window, max output, license/self-hosting claims.
- **All of the above, plus every otherwise-`OFFICIAL_VERIFIED` fact**, are additionally capped at `PENDING` by the URL-provenance gap described above.

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

**Founder/architecture review of the schema-reconciliation and approval-required items**, then Phase E (production dataset implementation), gated on:
1. Independent re-confirmation of source URLs (the headline finding above).
2. A founder/architecture decision on the two approval-required schema gaps: whether `model-pricing.csv` gains new columns for model specs (context window, max output, knowledge cutoff, availability status, account requirements), and whether a new `commercial-terms.csv` file is created (Phase D's proposal, preserved but not pre-approved).
3. The validator extensions identified in the schema-reconciliation manifest.

See [`Platform/docs/pricing/staging/2026-07-18-chat/PHASE_E_RUNBOOK.md`](../../../../Platform/docs/pricing/staging/2026-07-18-chat/PHASE_E_RUNBOOK.md) for the exact, ordered execution plan a future implementation agent should follow once these are resolved.

## Still out of scope / pending (unchanged by this pass)

Credit Engine economics · Margin Engine · Subscription pricing · Scenario costs · Smart-routing economics · Unverified/pending provider facts (see gaps above).
