# Black Forest Labs

**Status:** Skeleton — pending Phase C verification against official Black Forest Labs sources only.

## AIFA usage (locked portfolio decisions)

- Image: FLUX.2 Max (Premium), FLUX.2 Pro (Professional, direct or via `fal` fallback — [`fal.md`](fal.md)), FLUX Dev (Economy, WATCHLIST) — [`../portfolio/image.md`](../portfolio/image.md), ADR-0019

> **Name-collision warning:** Black Forest Labs' **"FLUX"** image family is unrelated to **Deepgram's "Flux"** speech-to-text model (`deepgram.md`) — different providers, different capabilities, shared name only. In the datasets these are kept distinct by `aifa_model_id` (`flux-2-pro` / `flux-2-max` / `flux-dev` here vs. `flux-stt`).

## Identity — PENDING

Official model IDs for FLUX.2 Max/Pro/Dev; GA/preview status; whether a direct API exists distinct from third-party gateways (`fal`, Replicate, etc.): **UNKNOWN, not yet checked against official Black Forest Labs documentation.**

## Pricing — PENDING

Expected billing dimensions: per-image or per-megapixel price, possibly resolution-tiered. **UNKNOWN.**

## Commercial & legal — PENDING

Commercial-use terms, generated-content ownership, data-retention default: **UNKNOWN.**

## Related documents

- `../adr/0019-image-portfolio.md`
