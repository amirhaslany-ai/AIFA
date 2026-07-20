# Kling AI

**Status:** Skeleton, updated 2026-07-20 per [`P-002`](../../../AIFA_Brain/12_Decisions/PRODUCT_DECISION_LOG.md#p-002--launch-model-provider-and-activation-matrix) — pending full Phase C verification against official Kling AI sources.

**Naming:** the official product family, as of Kuaishou's own 2026 launch materials, is **Kling Video 3.0** (with separate siblings **Kling Video 3.0 Omni** and **Kling Image 3.0** / **Kling Image 3.0 Omni**). **Kling Video 3.0 and Kling Video 3.0 Omni are distinct families and must not be conflated** unless official documentation explicitly maps them together. Do not use the informal shorthand "K3" as a production API identifier — it is also used elsewhere in this repository for the unrelated Chat model **Kimi K3** (Moonshot AI, see `moonshot.md`); the two must never be confused.

## AIFA usage (locked portfolio decisions)

- Video: Kling Video 3.0 Standard (general launch), Kling Video 3.0 Pro (Premium), Kling Video 3.0 Turbo (Economy, where commercially useful), Kling Video 3.0 Motion Control (Character) — Text-to-Video, Image-to-Video, Motion Control, Native Audio, Multi-shot where supported (all UNVERIFIED pending full Phase C pricing/commercial pass) — [`../portfolio/video.md`](../portfolio/video.md), ADR-0020, `P-002`.
- **Initial serving gateway (per P-002): `fal`** — not a fallback, the initial route. Confirmed 2026-07-20 that `fal` hosts Seedance 2.0 as an "Official... API by ByteDance" arrangement (see `fal.md`); an equivalent official-partnership confirmation specifically for Kling on `fal` has not yet been separately verified — do this before Phase E. Future direct route: KlingAI Open Platform (see below).

## Prior research available (different context)

`AIFA_Brain/04_Research/Market_Intelligence/02_Competitors_Phase2.md` §2.4.1 records Kling 3 with a consumer subscription price (from $7.99/mo) and its free-tier credit allowance (~66 credits/day), operated by Kuaishou. Per ADR-0025, this is consumer subscription pricing, not API/PAYG pricing, and must not be treated as a definitive per-second API rate.

## Identity — partially checked 2026-07-20, still PENDING for API specifics

Kuaishou's own investor-relations announcement (`ir.kuaishou.com`) confirms the **Video 3.0 / Video 3.0 Omni / Image 3.0 / Image 3.0 Omni** family launch and a **Kling 3.0 Turbo** speed-optimized variant. **Not yet confirmed:** the exact API identifier(s) `fal` and/or a future KlingAI Open Platform route use for each variant (third-party aggregator sites show unofficial-looking slugs like `kling-3.0/standard` that have not been checked against `fal`'s or Kuaishou's own official API reference); whether a KlingAI direct API product exists distinct from the consumer app; region restrictions (Kuaishou is a Chinese company — access/terms for AIFA's target markets is an open question): **UNKNOWN, requires a dedicated official-API-reference check before Phase E.**

## Pricing — PENDING

Expected billing dimensions: per-second price. **UNKNOWN (API/PAYG) — do not substitute the consumer subscription figures above.**

## Commercial & legal — PENDING

Commercial-use terms, generated-content ownership, data-retention default, region/export restrictions: **UNKNOWN.**

## Related documents

- `../adr/0020-video-portfolio.md`, `AIFA_Brain/12_Decisions/PRODUCT_DECISION_LOG.md` (`P-002`)
- [`fal.md`](fal.md) (initial serving gateway), [`moonshot.md`](moonshot.md) (unrelated Kimi K3 — name-collision warning only)
- `AIFA_Brain/04_Research/Market_Intelligence/02_Competitors_Phase2.md` §2.4.1 (consumer subscription pricing only)
