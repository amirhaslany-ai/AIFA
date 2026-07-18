<!--
Preserved raw research artifact. Per AIFA_Brain/00_Index/METADATA_STANDARD.md and
this task's own instruction ("Do not rewrite the raw Phase C or Phase C.5
substance while importing them"), only this metadata block and the horizontal
rule below were added on import (2026-07-18). Everything after the rule is the
supplied file's body, byte-for-byte unchanged.
-->

# Import metadata

| Field | Value |
|---|---|
| **Title** | Phase C Chat Pricing Audit — Provider Research Report (imported raw artifact) |
| **Created** | 2026-07-18 (original artifact date) |
| **Imported** | 2026-07-18 |
| **Owner** | AIFA_Brain maintainers (import); original authorship is the Phase C research pass |
| **Status** | Archived — raw research artifact, immutable. Not itself production Source of Truth (see the artifact's own Executive Summary and Supersession Rule). |
| **Version** | 1.0 (as supplied) |
| **Dependencies** | none |
| **Related Docs** | [`00_Summary.md`](00_Summary.md), [`02_Phase_C5_Official_Verification_Pass.md`](02_Phase_C5_Official_Verification_Pass.md), [`03_Phase_D_Repository_Ingestion_Plan.md`](03_Phase_D_Repository_Ingestion_Plan.md), [`../../../../Platform/docs/adr/0025-pricing-source-of-truth.md`](../../../../Platform/docs/adr/0025-pricing-source-of-truth.md) |
| **Tags** | `pricing, provider-pricing, chat, phase-c, raw-research, immutable-artifact` |

**Precedence note (added on import, per the Phase D.5 synchronization task's authority order):** this is raw research — a mixture of first-party and secondary discovery evidence. Where this report conflicts with [`02_Phase_C5_Official_Verification_Pass.md`](02_Phase_C5_Official_Verification_Pass.md), Phase C.5 wins (the artifact's own Supersession Rule, restated here for navigation). No value from this report alone is eligible for production ingestion.

---

# Phase C Chat Pricing Audit — Provider Research Report

**Audit date:** 2026-07-18  
**Scope:** Chat portfolio candidates only  
**Purpose:** Research artifact. This report is not itself production Source of Truth. Phase C.5 verification decisions supersede any conflicting or weakly sourced statement in this document.

## Executive Summary

Thirteen candidate chat-portfolio entries were researched across OpenAI, Anthropic, Google, xAI, DeepSeek, Alibaba Cloud, Zhipu AI, and OpenRouter. Most candidate names mapped cleanly to official API model identifiers. The notable naming caveat was Claude Fable 5, which is a real Anthropic Mythos-class model rather than a numbered Claude tier.

The report collected model identity, availability, context/output limits, token pricing, caching, long-context behavior, batch/priority pricing where found, provider/tool charges, regional and commercial constraints, OpenRouter routing prices, and unresolved evidence gaps.

This Phase C report includes a mixture of first-party and secondary discovery evidence. Therefore, no value from this report is eligible for production ingestion solely because it appears here. Phase C.5 is the authoritative evidentiary gate.

## Providers and Candidate Models

### OpenAI
- GPT-5.6 Sol — `gpt-5.6-sol` (`gpt-5.6` alias)
- GPT-5.6 Terra — `gpt-5.6-terra`
- GPT-5.6 Luna — `gpt-5.6-luna`

Research findings:
- Context: 1,050,000 tokens.
- Maximum output: 128,000 tokens.
- Knowledge cutoff reported as 2026-02-16.
- Standard prices per 1M tokens:
  - Sol: input $5.00, cached input $0.50, output $30.00.
  - Terra: input $2.50, cached input $0.25, output $15.00.
  - Luna: input $1.00, cached input $0.10, output $6.00.
- Cache writes were reported as 1.25× uncached input.
- Requests over 272K input tokens were reported to use higher rates for the entire request: input 2× and output 1.5×.
- Regional/data-residency processing was reported with a 10% uplift for eligible newer models.
- Batch, Priority, exact GA date, and web-search tool rows required a first-party verification pass.

### Anthropic
- Claude Fable 5 — `claude-fable-5`
- Claude Opus 4.8 — `claude-opus-4-8`
- Claude Sonnet 5 — `claude-sonnet-5`

Research findings:
- Fable 5 is a Mythos-class model and is not merely an AIFA alias.
- Fable 5 / Mythos 5 headline price: $10 input / $50 output per 1M tokens.
- Opus 4.8 headline price: $5 input / $25 output.
- Sonnet 5 introductory price through 2026-08-31: $2 input / $10 output; standard price from 2026-09-01: $3 / $15.
- Prompt cache multipliers: 5-minute write 1.25×, 1-hour write 2×, cache read 0.1×.
- Web search reported at $10 per 1,000 searches.
- Code execution reported at $0.05 per container-hour after 1,550 free hours/month, with provider-specific conditions.
- `inference_geo: "us"` reported as a 1.1× pricing multiplier.
- Context/output limits reported as 1M / 128K for audited current models.
- Commercial findings included ZDR availability, Covered-Model retention, and Fable export-control history.
- DPA details, compliance certifications, and some release/default-retention dates required first-party verification.

### Google AI
- Gemini 3.1 Pro Preview — `gemini-3.1-pro-preview` and `gemini-3.1-pro-preview-customtools`
- Gemini 3.1 Flash-Lite — `gemini-3.1-flash-lite`

Research findings:
- Pro Preview standard ≤200K: input $2.00, output $12.00, cached input $0.20.
- Pro Preview >200K: input $4.00, output $18.00, cached input $0.40.
- Pro cache storage: $4.50 per 1M tokens/hour.
- Flash-Lite: text/image/video input $0.25; audio input $0.50; output $1.50; cached text input $0.025.
- Priority and Batch tiers were identified.
- Google Search grounding: 5,000 prompts/month free for the relevant family, then $14 per 1,000 queries.
- Paid-tier content not used to improve products; free-tier content may be used, subject to provider terms.

### xAI
- Grok 4.5 — `grok-4.5` with aliases such as `grok-4.5-latest`.

Research findings:
- Context: 500K.
- Standard price: input $2.00, cached input $0.50, output $6.00.
- >200K price: input $4.00, cached input $1.00, output $12.00.
- Regions reported: `us-east-1`, `us-west-2`.
- Knowledge cutoff reported as 2026-02-01.
- Rate limits were initially recorded with an incorrect requests-per-minute unit.
- A 50% Batch discount was initially claimed but required official verification.

### DeepSeek
- DeepSeek V4 Pro — `deepseek-v4-pro`
- DeepSeek V4 Flash — `deepseek-v4-flash`

Research findings:
- Context / maximum output: 1M / 384K.
- Flash: cache hit $0.0028, cache miss $0.14, output $0.28 per 1M tokens.
- Pro: cache hit $0.003625, cache miss $0.435, output $0.87 per 1M tokens.
- Legacy aliases `deepseek-chat` and `deepseek-reasoner` were reported to map to V4 Flash modes and to be deprecated on 2026-07-24 15:59 UTC.
- Concurrency reported as 2,500 for Flash and 500 for Pro.
- No Batch pricing was identified.

### Alibaba Cloud / Qwen
- Qwen3.6-Max-Preview — `qwen3.6-max-preview`

Research findings:
- Official model identity was located.
- Preview status, context, modality, regional scope, free quota, and direct token-pricing details were not consistently available on the first-party pages reviewed.
- Singapore and Beijing pricing values found through secondary sources were treated as provisional and required first-party confirmation.

### Zhipu AI / Z.ai
- GLM-5.2 — `glm-5.2`

Research findings:
- Direct Z.ai price reported as input $1.40, cached input $0.26, output $4.40 per 1M tokens.
- Storage was reported as temporarily free.
- Context window, maximum output, license, and self-hosting claims required verification from a first-party model card.

### OpenRouter
Research findings:
- OpenRouter was treated as a routing/distribution channel, not the original model provider.
- Closed-model list prices often matched direct-provider list prices.
- Open-weight model prices could differ by active host and needed an as-of timestamp.
- Reported examples included lower OpenRouter list prices for DeepSeek V4 Flash and GLM-5.2.
- Qwen direct-vs-OpenRouter deltas could not be considered definitive without an official direct baseline.

## Commercial and Policy Research

The research also explored:
- Data retention and ZDR.
- Training-use policies.
- Data residency and regional restrictions.
- DPA and compliance claims.
- Public API availability and account requirements.
- SLA/public uptime commitments.

These facts have a different scope and update cadence than token-pricing facts and must not be silently duplicated across every pricing row.

## Initial Implementation Classification

### High-confidence candidates before verification
- GPT-5.6 Sol, Terra, Luna.
- Claude Opus 4.8 and Sonnet 5.
- Gemini 3.1 Pro Preview and Flash-Lite.
- Grok 4.5 core identity and standard pricing.
- DeepSeek V4 Pro and Flash.
- GLM-5.2 core identity and pricing.

### Needed manual review
- Claude Fable 5 naming/access/retention details.
- OpenAI Batch, Priority, web-search rates, and some dates.
- xAI Batch discount and rate-limit unit.
- Alibaba pricing/context/modality/scope.
- GLM-5.2 context/output/license.
- Anthropic DPA, certifications, and certain retention/release dates.

## Phase Boundary

This report intentionally did not calculate:
- AIFA Credits.
- Customer markup or gross margin.
- Subscription pricing.
- Customer-facing Toman prices.
- Smart-routing economics.

Those calculations must consume verified and versioned provider-cost data only.

## Supersession Rule

Where this report conflicts with **Phase C.5 — Official Verification Pass**, Phase C.5 wins. The known corrections include:
- Grok 4.5 does not receive the previously claimed 50% Batch discount.
- Grok 4.5 rate limit is 150 requests per second, not per minute.
