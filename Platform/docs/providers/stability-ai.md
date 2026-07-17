# Stability AI

**Status:** Skeleton — pending Phase C verification against official Stability AI sources only.

## AIFA usage (locked portfolio decisions)

- Music: Stable Audio 3 (Instrumental, Sound Effects — UNVERIFIED); Stable Audio 2.5 (RESERVE) — [`../portfolio/music.md`](../portfolio/music.md), ADR-0022

> **Shared-model note:** "Stable Audio 3" appears as **two** rows in `../pricing/model-pricing.csv` — `stable-audio-3-instrumental` and `stable-audio-3-sfx` — because AIFA exposes it as two distinct consumer modes (Instrumental and Sound Effects). They are one underlying provider model: when Phase C populates `official_model_id`, **both rows are expected to carry the same Stability AI model ID**. This is intentional, not a duplicate-identity error — the two rows differ by AIFA-facing capability/mode, not by underlying model.

## Identity — PENDING

Official model IDs for Stable Audio 3 / 2.5; GA/preview status; region restrictions: **UNKNOWN, not yet checked against official Stability AI documentation.**

## Pricing — PENDING

Expected billing dimensions: per-minute price or per-generation price for instrumental/SFX output, possibly credit-based. **UNKNOWN.**

## Commercial & legal — PENDING

Commercial-use terms, generated-audio ownership, data-retention default: **UNKNOWN.**

## Related documents

- `../adr/0022-music-portfolio.md`
