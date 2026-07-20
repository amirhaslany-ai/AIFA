# Alibaba Cloud (Qwen / Wan)

**Status:** Skeleton, updated 2026-07-20 per [`P-002`](../../../AIFA_Brain/12_Decisions/PRODUCT_DECISION_LOG.md#p-002--launch-model-provider-and-activation-matrix) — pending full Phase C verification against official Alibaba Cloud sources.

## AIFA usage (locked portfolio decisions)

- Chat: Qwen3.6 Max Preview (UNVERIFIED) — [`../portfolio/chat.md`](../portfolio/chat.md), ADR-0018
- Video: **Wan 2.7** (model owner: Alibaba; general launch, 720p economy mode, Video Edit / Reference-to-Video) — the prior "2.6 or 2.7" ambiguity is **resolved to 2.7** by `P-002`, subject to exact API-endpoint verification (all UNVERIFIED pending full pricing/commercial pass) — [`../portfolio/video.md`](../portfolio/video.md), ADR-0020, `P-002`.
- **Initial serving gateway (per P-002): `fal`** — confirmed live on fal's own model page (`fal.ai/wan-2.7`, checked 2026-07-20). Alibaba Cloud Model Studio (direct) is a possible future route, not the initial one.

## Identity — partially checked 2026-07-20

fal's own model page confirms a Wan 2.7 endpoint exists (Text-to-Video, Image-to-Video, Reference-to-Video, editing modes, up to 15s, up to 1080p, per public secondary sources — re-verify against fal's own spec page before use). **Not yet checked:** exact official Alibaba model IDs for Qwen3.6 Max Preview and Wan 2.7 independent of the fal listing; GA/preview status; region restrictions (notably whether Alibaba Cloud's own API is accessible from AIFA's target markets): **UNKNOWN, not yet checked against official Alibaba Cloud documentation.**

## Pricing — PENDING

Expected billing dimensions: input/output token price (Qwen chat), per-second price (Wan video). **UNKNOWN.**

## Commercial & legal — PENDING

Commercial-use terms, data-retention default, region-specific access terms: **UNKNOWN.**

## Related documents

- `../adr/0018-chat-portfolio.md`, `../adr/0020-video-portfolio.md`
