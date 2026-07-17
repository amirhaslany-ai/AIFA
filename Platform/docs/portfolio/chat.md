# Chat

**Decision record:** [`../adr/0018-chat-portfolio.md`](../adr/0018-chat-portfolio.md) (authoritative — this doc is for navigation only).

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

**Excluded:** GPT-5 Codex (not part of the consumer chat portfolio — ADR-0018).

## Packaging

- **Chat Package** — `AIFA_ALIAS` (commercial bundle, not a model)
- **All Access Package** — `AIFA_ALIAS` (commercial bundle, not a model)

## Free tier

Usage-limited, not model-downgraded. See ADR-0018 §Decision drivers.
