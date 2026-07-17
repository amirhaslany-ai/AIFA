# ADR-0018: Chat portfolio — locked model list, packaging, and free-tier policy

**Status:** Accepted (portfolio/product decision) — every provider mapping is UNVERIFIED pending Phase C of the provider pricing audit
**Date:** 2026-07-17
**Decision owners:** AIFA founder (product)
**Related:** ADR-0016, ADR-0017, `docs/portfolio/chat.md`, `docs/providers/README.md`
**Supersedes:** none
**Superseded by:** none

## Context

Chat is AIFA's first capability (the only one with real, if stub-only, implementation — ADR-0005/0007). The portfolio needs a locked model list so downstream work (routing, pricing, Smart Router) has a fixed target rather than an open-ended "whatever's available" scope.

## Problem

Fix which chat models AIFA offers, which are AIFA-facing names versus literal provider model IDs, and how the free tier is designed — without asserting unverified official-provider facts as settled.

## Decision

| Entry | Expected provider | Classification | Notes |
|---|---|---|---|
| GPT-5.6 Sol | OpenAI | UNVERIFIED | Official model ID/availability not yet verified (Phase C) |
| GPT-5.6 Terra | OpenAI | UNVERIFIED | " |
| GPT-5.6 Luna | OpenAI | UNVERIFIED | " |
| GPT-5.5 | OpenAI | WATCHLIST | "Optional / under consideration" per product decision — not committed |
| Claude Fable 5 | Anthropic | UNVERIFIED | Provider mapping not yet verified against official Anthropic model docs |
| Claude Opus 4.8 | Anthropic | UNVERIFIED | " |
| Claude Sonnet 5 | Anthropic | UNVERIFIED | " |
| Gemini 3.1 Pro Preview | Google | UNVERIFIED | "Preview" in the name suggests `VERIFIED_PREVIEW` once confirmed against Google's own docs; treated as UNVERIFIED until then |
| Gemini 3.1 Flash-Lite | Google | UNVERIFIED | |
| Grok 4.5 | xAI | UNVERIFIED | |
| DeepSeek V4 Pro | DeepSeek | UNVERIFIED | |
| DeepSeek V4 Flash | DeepSeek | UNVERIFIED | |
| Qwen3.6 Max Preview | Alibaba | UNVERIFIED | |
| GLM-5.2 | Zhipu | UNVERIFIED | |

**Explicit exclusion:** GPT-5 Codex is **not** included in the consumer chat portfolio (a locked product decision, not an oversight).

**Packaging** (these are AIFA commercial bundles, not models — classified separately, not against the model taxonomy):

- **Chat Package** — AIFA_ALIAS (commercial package name)
- **All Access Package** — AIFA_ALIAS (commercial package name)

**Free tier policy:** the free tier uses **usage limits**, not intentionally weaker models. No free-tier-specific "downgraded" model exists in this portfolio.

## Decision drivers

- A fixed, named model list lets Smart Router (ADR-0024), the Credit Engine, and provider docs all reference the same set instead of drifting.
- Excluding GPT-5 Codex from consumer chat keeps the developer/coding-agent use case out of scope for this portfolio (consistent with AIFA_Brain's Market Intelligence finding that developer tooling is a distinct, later-phase segment — `AIFA_Brain/04_Research/Market_Intelligence/01_Executive_Intelligence_Report.md`).
- Usage-limited (not model-downgraded) free tier avoids the "free tier is worse AI" perception risk and matches the honesty-first positioning documented in that same research.

## Alternatives considered

- Including GPT-5 Codex in the consumer surface as a "power user" chat option: rejected as a scope decision — developer/coding use cases are a distinct segment, not part of this portfolio.
- A weaker free-tier model: rejected — usage-limiting preserves quality perception; explicitly a product decision here, not a technical default.

## Consequences

- Every row above needs Phase C verification against each provider's own model documentation before `PLANNED`/`WATCHLIST`/`UNVERIFIED` entries can become `VERIFIED_ACTIVE` or `VERIFIED_PREVIEW`.
- `docs/portfolio/chat.md` restates this table for the portfolio section's own navigation; this ADR is the decision record, that doc is the living reference.

## Risks

- Model names given here may not be the provider's literal official naming (e.g. could be internal AIFA aliases layered over an official ID) — this is exactly why every row is UNVERIFIED rather than asserted, per the mission's "distinguish AIFA aliases from real provider model IDs" rule.

## Mitigations

- `docs/pricing/model-pricing.csv`'s `aifa_model_id` vs. `official_model_id` columns keep this distinction structurally explicit once Phase C populates them.

## Implementation implications

- `packages/types/src/ai-provider.ts`'s `ChatRequest.model` will need to resolve one of these AIFA-facing names to an official model ID per ADR-0016's routing chain once implementation begins — out of scope for this docs-only ADR.

## Related documents

- `docs/portfolio/chat.md`, `docs/providers/openai.md`, `docs/providers/anthropic.md`, `docs/providers/google.md`, `docs/providers/xai.md`, `docs/providers/deepseek.md`, `docs/providers/alibaba.md`, `docs/providers/zhipu.md`
