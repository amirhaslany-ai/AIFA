<!--
Preserved evidentiary artifact. Per AIFA_Brain/00_Index/METADATA_STANDARD.md and
this task's own instruction ("Do not rewrite the raw Phase C or Phase C.5
substance while importing them"), only this metadata block and the horizontal
rule below were added on import (2026-07-18). Everything after the rule is the
supplied file's body, byte-for-byte unchanged.
-->

# Import metadata

| Field | Value |
|---|---|
| **Title** | Phase C.5 — Chat Pricing Audit Official Verification Pass (imported evidentiary artifact) |
| **Created** | 2026-07-18 (original artifact date) |
| **Imported** | 2026-07-18 |
| **Owner** | AIFA_Brain maintainers (import); original authorship is the Phase C.5 verification pass |
| **Status** | Archived — this is the **evidentiary authority** for the chat-provider pricing audit (precedence order: locked ADRs > live repo schemas > **Phase C.5** > Phase D proposals > Phase C raw research). Immutable as imported. |
| **Version** | 1.0 (as supplied) |
| **Dependencies** | [`01_Phase_C_Chat_Pricing_Audit.md`](01_Phase_C_Chat_Pricing_Audit.md) (the raw research this artifact verifies against official sources) |
| **Related Docs** | [`00_Summary.md`](00_Summary.md), [`03_Phase_D_Repository_Ingestion_Plan.md`](03_Phase_D_Repository_Ingestion_Plan.md), [`../../../../Platform/docs/adr/0025-pricing-source-of-truth.md`](../../../../Platform/docs/adr/0025-pricing-source-of-truth.md), [`../../../../Platform/docs/adr/0026-phase-c5-evidence-vocabulary-mapping.md`](../../../../Platform/docs/adr/0026-phase-c5-evidence-vocabulary-mapping.md) |
| **Tags** | `pricing, provider-pricing, chat, phase-c5, evidentiary-authority, immutable-artifact` |

**Important gap surfaced on import (2026-07-18 synchronization pass):** this artifact classifies specific facts `OFFICIAL_VERIFIED`/`OFFICIAL_DERIVED` and states its own §"Repository Eligibility Rule" requires "exact official URL or source ID resolving to it" — **but this artifact's body contains no literal URLs anywhere.** The only URLs available anywhere in the supplied bundle are in [`03_Phase_D_Repository_Ingestion_Plan.md`](03_Phase_D_Repository_Ingestion_Plan.md), which is explicitly lower-precedence and self-describes as "produced without direct read access to the live AIFA repository... works from file names supplied as examples." This means no fact in this batch currently has an **independently-confirmed** URL satisfying this artifact's own eligibility rule — see the Phase E staging package's `sources` section and the synchronization summary for how this is handled (every source's disposition is capped at `PENDING — URL re-confirmation required`, not `ELIGIBLE`, regardless of the evidence class recorded below).

---

# Phase C.5 — Chat Pricing Audit Official Verification Pass

**Verification date:** 2026-07-18  
**Purpose:** Field-level evidentiary gate for repository ingestion.

## Authoritative Rule

Only facts classified as `OFFICIAL_VERIFIED`, and deterministic values classified as `OFFICIAL_DERIVED`, are eligible for production ingestion.

Facts classified as `SECONDARY_ONLY`, `CONFLICTING`, or `UNVERIFIED` must remain outside the production Source of Truth until resolved.

## Evidence Classes

- `OFFICIAL_VERIFIED`: Explicitly confirmed on a first-party provider source.
- `OFFICIAL_DERIVED`: Deterministically calculated from official stated inputs or multipliers; formula must be retained.
- `SECONDARY_ONLY`: Supported only by secondary sources or not captured on the relevant official page.
- `CONFLICTING`: Contradicted by official evidence.
- `UNVERIFIED`: No sufficient evidence was located.

## Executive Findings

Most Phase C identity, pricing, and model-spec claims for OpenAI, Anthropic, Google, xAI, DeepSeek, Zhipu, and OpenRouter were confirmed against first-party documentation.

The weakest evidence remained:
- Alibaba Qwen3.6-Max-Preview direct pricing and detailed model attributes.
- Several release/effective dates.
- Anthropic DPA and ISO/SOC certification claims.
- GLM-5.2 context/output/license claims not present on the official pricing page.

Two xAI claims were rejected and must be corrected before any downstream use:
1. Grok 4.5 does **not** receive a 50% Batch discount.
2. Grok 4.5 rate limit is **150 requests per second**, not 150 requests per minute.

## Verified Official Data

### OpenAI GPT-5.6 Family

Eligible facts:
- Official IDs: `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`; `gpt-5.6` alias for Sol.
- Context: 1,050,000 tokens.
- Maximum output: 128,000 tokens.
- Knowledge cutoff: 2026-02-16.
- Standard per-1M-token prices:
  - Sol: input $5.00, cached input $0.50, output $30.00.
  - Terra: input $2.50, cached input $0.25, output $15.00.
  - Luna: input $1.00, cached input $0.10, output $6.00.
- Deterministic cache-write values using the official 1.25× multiplier:
  - Sol $6.25; Terra $3.125; Luna $1.25.
- >272K full-request rule: input 2× and output 1.5×.
- Regional-processing/data-residency uplift: +10% for eligible models released on or after 2026-03-05.

Hold outside production:
- Exact GA date where not captured on the verified official page.
- Model-specific Batch 50% rows.
- Priority-tier rows not captured in the official fetch.
- OpenAI web-search tool rows not captured in the official fetch.
- Long-context cached-read multiplier where inferred rather than explicitly stated.

### Anthropic

Eligible facts:
- Claude Fable 5 is an official Mythos-class model; official identity `claude-fable-5`.
- Fable 5 / Mythos 5: input $10 / output $50 per 1M tokens.
- Fable access timeline: export controls applied 2026-06-12, lifted 2026-06-30, global restoration 2026-07-01; Mythos access remained restricted.
- Claude Opus 4.8 ID `claude-opus-4-8`; input $5, output $25; cache write/read and Batch values verified on official pricing documentation.
- Claude Sonnet 5 ID `claude-sonnet-5`; introductory $2/$10 through 2026-08-31; $3/$15 from 2026-09-01.
- Sonnet 5 release date 2026-06-30 was confirmed by first-party announcement context.
- Current audited models: 1M context / 128K max output.
- Prompt-cache multipliers: 5-minute write 1.25×, 1-hour write 2×, read 0.1×.
- Web search: $10 per 1,000 searches.
- Code execution: $0.05 per container-hour after 1,550 free hours/month, subject to documented conditions.
- `inference_geo: "us"` pricing multiplier: 1.1×.
- Covered-Model retention: 30 days, including relevant ZDR caveat.
- ZDR availability for qualifying enterprise arrangements.

Hold outside production:
- Opus 4.8 release date when not found on verified first-party pages.
- General 7-day default-retention effective date.
- DPA auto-incorporation/effective date.
- ISO 27001, ISO 42001, and SOC 2 certification claims until verified at the Trust Center.

### Google AI

Eligible facts:
- `gemini-3.1-pro-preview` and `gemini-3.1-pro-preview-customtools`; paid-only.
- `gemini-3.1-flash-lite`; free and paid tiers.
- Pro Preview standard ≤200K: input $2.00, output $12.00, cached input $0.20.
- Pro Preview >200K: input $4.00, output $18.00, cached input $0.40.
- Cache storage: $4.50 per 1M tokens/hour.
- Flash-Lite: text/image/video input $0.25, audio input $0.50, output $1.50, cached text input $0.025.
- Priority-tier rows confirmed in official pricing.
- Search grounding: 5,000 shared prompts/month free for applicable Gemini 3 models, then $14 per 1,000 queries.
- Paid-tier content not used to improve products; free-tier content may be used under provider policy.

### xAI

Eligible facts:
- Official ID `grok-4.5`; aliases include `grok-4.5-latest` and `grok-build-latest`.
- Launch: 2026-07-08.
- Context: 500K.
- Standard: input $2.00, cached input $0.50, output $6.00.
- >200K: input $4.00, cached input $1.00, output $12.00.
- Regions: `us-east-1`, `us-west-2`.
- Knowledge cutoff: 2026-02-01.
- Rate limits: 150 requests/second and 50,000,000 tokens/minute.

Rejected/corrected:
- The previous 50% Batch-discount claim is `CONFLICTING`. Official documentation indicates models not listed receive no Batch discount, and Grok 4.5 is not listed.
- The previous 150 requests/minute claim is `CONFLICTING`; correct unit is requests/second.

### DeepSeek

Eligible facts:
- IDs: `deepseek-v4-pro`, `deepseek-v4-flash`.
- Context: 1M; max output: 384K.
- Flash: cache hit $0.0028, cache miss $0.14, output $0.28.
- Pro: cache hit $0.003625, cache miss $0.435, output $0.87.
- Legacy aliases `deepseek-chat` / `deepseek-reasoner` map to V4 Flash modes and deprecate on 2026-07-24 15:59 UTC.
- Concurrency: Flash 2,500; Pro 500.
- No documented Batch discount; represent as confirmed absence/not offered, not as a missing value.

### Alibaba Cloud / Qwen

Eligible fact:
- Official model ID `qwen3.6-max-preview` was located.

Hold outside production:
- Context, modality, model-specific regional scope, and free-quota details not confirmed on an official model page in this pass.
- Singapore token prices supported only by secondary sources in this pass.
- Beijing token prices not verified.

### Zhipu AI / Z.ai

Eligible facts:
- Official ID `glm-5.2`.
- Z.ai pricing: input $1.40, cached input $0.26, output $4.40 per 1M tokens.
- Storage listed as temporarily free.
- No Batch price shown; represent as confirmed absence/not offered.

Hold outside production:
- Context window and maximum output, absent from the verified pricing page.
- MIT license and self-hosting claims until verified on an official model card.

### OpenRouter

Eligible facts with as-of timestamp:
- OpenRouter is a channel/router, not the original model provider.
- Closed-model list-price parity was observed for selected models.
- DeepSeek V4 Flash OpenRouter list price observed around $0.09 input / $0.18 output per 1M tokens versus direct $0.14/$0.28.
- GLM-5.2 OpenRouter list price observed around $0.93 input / $3.00 output versus direct $1.40/$4.40.
- Qwen OpenRouter price may be stored independently, but no direct-price delta may be asserted until the official direct baseline is verified.

OpenRouter values are time-sensitive and must carry `accessed_at`/`verified_at` timestamps.

## Gaps and Required Follow-up

### Secondary-only or pending
- OpenAI Batch, Priority, and web-search rows.
- OpenAI exact GA date where not first-party captured.
- Anthropic Opus 4.8 release date.
- Anthropic default-retention effective date.
- Alibaba direct token pricing, context, modality, scope, and quota.
- GLM-5.2 context/output/license.

### Unverified
- Anthropic DPA details/effective date.
- Anthropic ISO/SOC certifications.
- Alibaba Beijing pricing.

### Conflicting/rejected
- Grok 4.5 50% Batch discount.
- Grok 4.5 150 requests/minute.

## Repository Eligibility Rule

A production fact must have:
- Exact provider and subject/model.
- Exact official URL or source ID resolving to it.
- Verification/access date.
- Evidence classification.
- Explicit/derived method.
- Reproducible formula for derived values.
- No unresolved conflict.

Fields must be evaluated atomically. A model can have a verified ID and an unverified context window at the same time.

## Final Recommendation

Ingest only the verified/derived field-level set. Route all other claims to the audit-gap system. Preserve the xAI corrections explicitly so the rejected values cannot re-enter through a later copy or spreadsheet import.
