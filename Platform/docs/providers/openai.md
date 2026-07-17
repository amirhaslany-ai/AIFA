# OpenAI

**Status:** Skeleton — pending Phase C verification against official OpenAI sources only.

## AIFA usage (locked portfolio decisions)

- Chat: GPT-5.6 Sol, GPT-5.6 Terra, GPT-5.6 Luna (UNVERIFIED); GPT-5.5 (WATCHLIST) — [`../portfolio/chat.md`](../portfolio/chat.md), ADR-0018
- Image: GPT Image 2 (Premium tier, UNVERIFIED) — [`../portfolio/image.md`](../portfolio/image.md), ADR-0019
- Voice: realtime transcription / Whisper-compatible offering (RESERVE); OpenAI Audio (RESERVE, integrated realtime stack) — [`../portfolio/voice.md`](../portfolio/voice.md), ADR-0021

**Note:** GPT-5 Codex is explicitly excluded from AIFA's consumer chat portfolio (ADR-0018) — not a gap, a locked decision.

## Identity — PENDING

Official model names/IDs for GPT-5.6 Sol/Terra/Luna, GPT-5.5, and GPT Image 2; GA/preview status; region restrictions; required account tier: **UNKNOWN, not yet checked against official OpenAI documentation.**

## Pricing — PENDING

Expected billing dimensions: input/output/cached-token price per million tokens (chat), per-image or per-megapixel price (image), audio input/output token price (realtime voice, if adopted). All: **UNKNOWN.**

## Commercial & legal — PENDING

Commercial-use terms, generated-content ownership, data-retention/training-on-customer-data default, zero-data-retention availability, DPA/EU-processing availability: **UNKNOWN.**

## Related documents

- `../adr/0018-chat-portfolio.md`, `../adr/0019-image-portfolio.md`, `../adr/0021-voice-portfolio.md`
