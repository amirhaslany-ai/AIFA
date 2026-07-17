# Runway

**Status:** Skeleton — pending Phase C verification against official Runway sources only.

## AIFA usage (locked portfolio decisions)

- Image: Runway Image (Professional tier, UNVERIFIED) — [`../portfolio/image.md`](../portfolio/image.md), ADR-0019
- Video: Runway Gen-4.5 (Premium), Runway Gen-4 Turbo (Economy), Runway Aleph 2 (Editing), Runway Act-Two (Character) (all UNVERIFIED) — [`../portfolio/video.md`](../portfolio/video.md), ADR-0020

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
