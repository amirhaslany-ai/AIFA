# Volcano Engine (ByteDance)

**Status:** Skeleton, updated 2026-07-20 per [`P-002`](../../../AIFA_Brain/12_Decisions/PRODUCT_DECISION_LOG.md#p-002--launch-model-provider-and-activation-matrix) — pending full Phase C verification against official Volcano Engine sources.

**Role correction (2026-07-20):** Seedance 2.0's **initial serving gateway is now `fal`** (confirmed as an official ByteDance-partnered route — see `fal.md`), not Volcano Engine direct. Volcano Engine remains ByteDance's own cloud platform and a **possible future direct route**, tracked as a future optimization if it offers better cost, limits, or reliability than the `fal` gateway — this is the corrected relationship; ADR-0020's prior "direct or via an approved gateway fallback" framing is preserved as the historical starting point, not silently erased.

## AIFA usage (locked portfolio decisions)

- Video: Seedance 2.0 Standard/Fast (model owner: ByteDance) — initial serving gateway: `fal` (all UNVERIFIED pending full pricing/commercial pass) — [`../portfolio/video.md`](../portfolio/video.md), ADR-0020, `P-002`. Volcano Engine direct is a possible future route, not the initial one.

## Identity — PENDING

Official model IDs for Seedance 2.0 Standard/Fast on a Volcano Engine **direct** route (if AIFA ever integrates one); region/export restrictions for a direct route: **UNKNOWN, not yet checked.** (For the initial `fal`-gateway route, see `fal.md` — `fal`'s own GitHub repository already describes an official ByteDance partnership for Seedance 2.0.)

## Pricing — PENDING

Expected billing dimensions: per-second price. **UNKNOWN.**

## Commercial & legal — PENDING

Commercial-use terms, generated-content ownership, data-retention default, region/export restrictions (a ByteDance-owned platform carries the same category of jurisdiction questions AIFA_Brain's Market Intelligence flags for other providers): **UNKNOWN.**

## Related documents

- `../adr/0020-video-portfolio.md`
