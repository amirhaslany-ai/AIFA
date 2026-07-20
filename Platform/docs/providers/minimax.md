# MiniMax

**Status:** Skeleton, updated 2026-07-20 per [`P-002`](../../../AIFA_Brain/12_Decisions/PRODUCT_DECISION_LOG.md#p-002--launch-model-provider-and-activation-matrix) — pending full Phase C verification against official MiniMax sources.

## AIFA usage (locked portfolio decisions)

- Video: **Hailuo 2.3 Standard and Fast** (model owner: MiniMax; Standard is general-launch tier, Fast is Economy tier — both UNVERIFIED pending full pricing/commercial pass) — [`../portfolio/video.md`](../portfolio/video.md), ADR-0020, `P-002`.
- **Initial serving gateway (per P-002): `fal`** — confirmed live on fal's own model pages (`fal.ai/models/fal-ai/minimax/hailuo-2.3/*` and `hailuo-2.3-fast/*`, checked 2026-07-20) with Pro/Standard/Fast endpoints for both text-to-video and image-to-video. MiniMax's own direct API is a possible future route, not the initial one.

## Identity — partially checked 2026-07-20

fal's own model pages confirm Hailuo 2.3 Standard/Pro/Fast endpoints exist on `fal`. **Not yet checked:** MiniMax's own official model documentation/naming (independent of the fal listing), GA/preview status, region restrictions, or a direct-API route: **UNKNOWN.**

## Pricing — PENDING

Expected billing dimensions: per-second price. **UNKNOWN.**

## Commercial & legal — PENDING

Commercial-use terms, generated-content ownership, data-retention default: **UNKNOWN.**

## Related documents

- `../adr/0020-video-portfolio.md`
