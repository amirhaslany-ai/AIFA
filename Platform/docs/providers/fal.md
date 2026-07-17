# fal.ai

**Status:** Skeleton — pending Phase C verification against official fal.ai sources only.

## AIFA usage (locked portfolio decisions)

- Image: optional fallback route for FLUX.2 Pro (alongside direct Black Forest Labs) — [`../portfolio/image.md`](../portfolio/image.md), ADR-0019
- Video: optional fallback route for Kling 3 (alongside direct Kling) — [`../portfolio/video.md`](../portfolio/video.md), ADR-0020

`fal` is used exclusively as a **fallback/gateway route** in AIFA's current locked decisions, not a primary supplier for any model — see `../architecture/fallback-routing.md`.

## Prior research available (different context)

`AIFA_Brain/04_Research/Market_Intelligence/02_Competitors_Phase2.md` §2.1.5 already profiles fal.ai as a supply-side inference aggregator (funding, GPU-second pricing, per-output pricing for Seedream/Wan/Veo as of mid-2026) in the context of AIFA's broader supplier landscape. That research pre-dates this portfolio's specific FLUX.2 Pro / Kling 3 fallback-routing decisions and should be re-verified against fal's own current official pricing for **these specific models**, not assumed to still be current — per ADR-0025, always re-check rather than reuse a snapshot.

## Identity — PENDING

Whether fal officially hosts FLUX.2 Pro and Kling 3 as of Phase C's research date; region availability: **UNKNOWN, not yet re-verified.**

## Pricing — PENDING

Expected billing dimensions: per-image price (FLUX.2 Pro), per-second price (Kling 3), possibly GPU-second billing. **UNKNOWN — re-verify, do not reuse the Market Intelligence snapshot without a fresh check.**

## Commercial & legal — PENDING

Commercial-use terms, data-retention default: **UNKNOWN.**

## Related documents

- `../adr/0019-image-portfolio.md`, `../adr/0020-video-portfolio.md`, `../architecture/fallback-routing.md`
- `AIFA_Brain/04_Research/Market_Intelligence/02_Competitors_Phase2.md` §2.1.5 (prior, possibly-stale supplier research)
