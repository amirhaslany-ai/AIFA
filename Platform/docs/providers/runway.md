# Runway

**Status:** Skeleton, updated 2026-07-20 per [`P-002`](../../../AIFA_Brain/12_Decisions/PRODUCT_DECISION_LOG.md#p-002--launch-model-provider-and-activation-matrix) — pending full Phase C verification against official Runway sources.

**P-002 instruction:** use the **current verified** Runway flagship, faster/economy, and editing models via Runway's own direct API — do not preserve a deprecated or unavailable Runway name merely because an older document names it. As of a 2026-07-20 check, Runway's own materials (`runwayml.com/research/introducing-runway-gen-4.5`, `docs.dev.runwayml.com`) describe **Gen-4.5** (released 2025-12-01) as the current flagship text-to-video model, accessible via Runway's own SDKs/API; this has not been independently re-confirmed as still current at implementation time, nor have the current faster/economy and editing model names been freshly re-verified — treat the table below as the prior product intent, not a confirmed-current spec.

## AIFA usage (locked portfolio decisions)

- Image: Runway Image (Professional tier, UNVERIFIED) — [`../portfolio/image.md`](../portfolio/image.md), ADR-0019
- Video: current verified Runway flagship (product intent: Gen-4.5), current verified faster/economy model (product intent: Gen-4 Turbo), current verified editing model where API-accessible (product intent: Aleph-family) — every exact model name and endpoint must be freshly re-verified against Runway's own docs before Phase E, not assumed from this or any older document (all UNVERIFIED) — [`../portfolio/video.md`](../portfolio/video.md), ADR-0020, `P-002`.

## Prior research available (different context)

`AIFA_Brain/04_Research/Market_Intelligence/02_Competitors_Phase2.md` §2.4.1 records Runway Gen-4.5 as the video-generation leaderboard leader (~1,247 Elo) with subscription pricing (Standard $12 / Pro $28 / Unlimited $76) **as of mid-2026, and explicitly flagged there as consumer subscription pricing, not API/PAYG pricing.** Per ADR-0025, that figure must never be treated as a definitive per-second API rate — Phase C must find Runway's actual API pricing (if one exists) independently.

## Identity — PENDING

Official model IDs; whether an API product exists distinct from the consumer subscription app; GA/preview status: **UNKNOWN, not yet checked.**

## Pricing — PENDING

Expected billing dimensions: per-image price (Runway Image), per-second price (video models). **UNKNOWN (API/PAYG) — do not substitute the consumer subscription figures above.**

## Commercial & legal — PENDING

Commercial-use terms, generated-content ownership, data-retention default: **UNKNOWN.**

## Related documents

- `../adr/0019-image-portfolio.md`, `../adr/0020-video-portfolio.md`
- `AIFA_Brain/04_Research/Market_Intelligence/02_Competitors_Phase2.md` §2.4.1 (consumer subscription pricing only — not API pricing)
