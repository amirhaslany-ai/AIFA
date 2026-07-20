# Chat

**Decision record:** [`../adr/0018-chat-portfolio.md`](../adr/0018-chat-portfolio.md) (authoritative — this doc is for navigation only) plus [`P-002`](../../../AIFA_Brain/12_Decisions/PRODUCT_DECISION_LOG.md#p-002--launch-model-provider-and-activation-matrix) (Locked, 2026-07-20 — adds Kimi K3, distinguishes model owner from serving provider/gateway).

## Models

| Model | Expected provider | Classification | Provider doc |
|---|---|---|---|
| GPT-5.6 Sol | OpenAI | UNVERIFIED | [`openai.md`](../providers/openai.md) |
| GPT-5.6 Terra | OpenAI | UNVERIFIED | [`openai.md`](../providers/openai.md) |
| GPT-5.6 Luna | OpenAI | UNVERIFIED | [`openai.md`](../providers/openai.md) |
| GPT-5.5 | OpenAI | WATCHLIST | [`openai.md`](../providers/openai.md) |
| Claude Fable 5 | Anthropic | UNVERIFIED | [`anthropic.md`](../providers/anthropic.md) |
| Claude Opus 4.8 | Anthropic | UNVERIFIED | [`anthropic.md`](../providers/anthropic.md) |
| Claude Sonnet 5 | Anthropic | UNVERIFIED | [`anthropic.md`](../providers/anthropic.md) |
| Gemini 3.1 Pro Preview | Google | UNVERIFIED | [`google.md`](../providers/google.md) |
| Gemini 3.1 Flash-Lite | Google | UNVERIFIED | [`google.md`](../providers/google.md) |
| Grok 4.5 | xAI | UNVERIFIED | [`xai.md`](../providers/xai.md) |
| DeepSeek V4 Pro | DeepSeek | UNVERIFIED | [`deepseek.md`](../providers/deepseek.md) |
| DeepSeek V4 Flash | DeepSeek | UNVERIFIED | [`deepseek.md`](../providers/deepseek.md) |
| Qwen3.6 Max Preview | Alibaba | UNVERIFIED | [`alibaba.md`](../providers/alibaba.md) |
| GLM-5.2 | Zhipu | UNVERIFIED | [`zhipu.md`](../providers/zhipu.md) |
| Kimi K3 | Moonshot AI (via OpenRouter, initial gateway) | VERIFIED_ACTIVE (identity only — see note) | [`moonshot.md`](../providers/moonshot.md), [`openrouter.md`](../providers/openrouter.md) |

**Kimi K3 note:** model owner is **Moonshot AI**, not OpenRouter — OpenRouter is the initial serving gateway (pinned slug `moonshotai/kimi-k3`; never the moving `~moonshotai/kimi-latest` alias). `VERIFIED_ACTIVE` here reflects identity/availability confirmed against Moonshot's own docs (2026-07-20); it does **not** mean Kimi K3 has passed P-002's Universal activation gates or is in the public Active Catalog yet. Product-role tags: general Chat, advanced Coding, large-repository analysis, long-context work, tool use, Agentic execution. See `P-002` for the full routing/pricing-observation record.

**Excluded:** GPT-5 Codex (not part of the consumer chat portfolio — ADR-0018).

## Packaging

- **Chat Package** — `AIFA_ALIAS` (commercial bundle, not a model)
- **All Access Package** — `AIFA_ALIAS` (commercial bundle, not a model)

## Free tier

Usage-limited, not model-downgraded. See ADR-0018 §Decision drivers.
