# fal.ai

**Status:** Skeleton, updated 2026-07-20 per [`P-002`](../../../AIFA_Brain/12_Decisions/PRODUCT_DECISION_LOG.md#p-002--launch-model-provider-and-activation-matrix) — pending full Phase C verification against official fal.ai sources.

**Role correction (2026-07-20):** `fal` is now the **initial serving gateway** (not merely an optional fallback) for four Video model families — Kling Video 3.0, Seedance 2.0, Wan 2.7, and Hailuo 2.3 — per P-002. This corrects the prior framing below (and ADR-0020's "optional fallback"/"optional approved gateway" language for Kling and Seedance), which is preserved as the historical starting point, not silently erased.

## AIFA usage (locked portfolio decisions)

- Image: optional fallback route for FLUX.2 Pro (alongside direct Black Forest Labs) — [`../portfolio/image.md`](../portfolio/image.md), ADR-0019. *(Unchanged by P-002.)*
- Video: **initial serving gateway** for Kling Video 3.0 (all tiers), Seedance 2.0 (all tiers), Wan 2.7 (all modes), and Hailuo 2.3 (all tiers) — [`../portfolio/video.md`](../portfolio/video.md), ADR-0020, `P-002`. Direct-provider adapters (KlingAI Open Platform, ByteDance/Volcano Engine, Alibaba Cloud Model Studio, MiniMax API) remain future optimization options, not part of initial launch.

`fal` officially hosts **Seedance 2.0** as a ByteDance-partnered API — confirmed via fal's own GitHub repository description, "Official text-to-video and image-to-video API by ByteDance, available on fal.ai" (`github.com/fal-ai/seedance-2.0-api`, checked 2026-07-20) and fal's own model pages (`fal.ai/models/bytedance/seedance-2.0/*`). Wan 2.7 (`fal.ai/wan-2.7`) and Hailuo 2.3 (`fal.ai/models/fal-ai/minimax/hailuo-2.3/*`) model pages are also live on fal as of 2026-07-20. An equivalent official-partnership confirmation for **Kling Video 3.0** on `fal` specifically has not yet been separately verified — see `kling.md`.

## Prior research available (different context)

`AIFA_Brain/04_Research/Market_Intelligence/02_Competitors_Phase2.md` §2.1.5 already profiles fal.ai as a supply-side inference aggregator (funding, GPU-second pricing, per-output pricing for Seedream/Wan/Veo as of mid-2026) in the context of AIFA's broader supplier landscape. That research pre-dates this portfolio's specific model-routing decisions and should be re-verified against fal's own current official pricing for **these specific models**, not assumed to still be current — per ADR-0025, always re-check rather than reuse a snapshot.

## Identity — partially checked 2026-07-20, still PENDING for full detail

fal's own model pages confirm it hosts Seedance 2.0, Wan 2.7, and Hailuo 2.3 model endpoints as of 2026-07-20 (URLs above). **Not yet re-verified:** FLUX.2 Pro's current fal listing; Kling Video 3.0's fal listing specifically; region availability for any of these; exact endpoint/model-ID strings each `fal` route expects (needed before any implementation work, per the activation gates).

## Pricing — PENDING

Expected billing dimensions: per-image price (FLUX.2 Pro), per-second price (Kling/Seedance/Wan/Hailuo), possibly GPU-second billing. Public secondary sources (not fal's own pricing page) cite Wan 2.7 figures around $0.0664/second (720p) and $0.1096/second (1080p) as of 2026 — **UNKNOWN/unconfirmed against fal's own official pricing page — re-verify, do not treat a secondary citation as an official source per ADR-0025.**

## Commercial & legal — PENDING

Commercial-use terms, data-retention default: **UNKNOWN.**

## Related documents

- `../adr/0019-image-portfolio.md`, `../adr/0020-video-portfolio.md`, `../architecture/fallback-routing.md`, `AIFA_Brain/12_Decisions/PRODUCT_DECISION_LOG.md` (`P-002`)
- [`kling.md`](kling.md), [`volcano-engine.md`](volcano-engine.md), [`alibaba.md`](alibaba.md), [`minimax.md`](minimax.md)
- `AIFA_Brain/04_Research/Market_Intelligence/02_Competitors_Phase2.md` §2.1.5 (prior, possibly-stale supplier research)
