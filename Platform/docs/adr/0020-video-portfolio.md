# ADR-0020: Video portfolio — locked model tiers, modes, reserve/watchlist

**Status:** Accepted (portfolio/product decision) — every provider mapping is UNVERIFIED pending Phase C of the provider pricing audit
**Date:** 2026-07-17
**Decision owners:** AIFA founder (product)
**Related:** ADR-0016, ADR-0017, `docs/portfolio/video.md`
**Supersedes:** none
**Superseded by:** none

## Decision

| Tier/Mode | Entry | Expected provider family | Classification | Notes |
|---|---|---|---|---|
| General launch | Kling 3 | Kling, optional `fal` fallback | UNVERIFIED | |
| General launch | Seedance 2 | Volcano Engine, optional approved gateway fallback | UNVERIFIED | |
| General launch | Veo 3.1 Fast | Google | UNVERIFIED | |
| General launch | Wan 2.6 or 2.7 | Alibaba | UNVERIFIED | Version not finally fixed ("2.6 or 2.7") — resolve exact version in Phase C |
| General launch | Gemini Omni Flash | Google | UNVERIFIED | |
| Premium | Veo 3.1 Standard | Google | UNVERIFIED | |
| Premium | Seedance 2 Standard | Volcano Engine | UNVERIFIED | |
| Premium | Kling 3 HQ | Kling | UNVERIFIED | |
| Premium | Runway Gen-4.5 | Runway | UNVERIFIED | |
| Economy | Veo Lite | Google | UNVERIFIED | |
| Economy | Hailuo 2.3 Fast | MiniMax | UNVERIFIED | |
| Economy | Runway Gen-4 Turbo | Runway | UNVERIFIED | |
| Economy | Wan 720p | Alibaba | UNVERIFIED | |
| Editing | Gemini Omni Flash | Google | UNVERIFIED | (also listed under General launch — dual-purpose entry) |
| Editing | Runway Aleph 2 | Runway | UNVERIFIED | |
| Editing | Wan Video Edit / Reference-to-Video | Alibaba | UNVERIFIED | |
| Character | Runway Act-Two | Runway | UNVERIFIED | |
| Character | Kling Motion Control | Kling | UNVERIFIED | |
| Character | Wan Reference-to-Video | Alibaba | UNVERIFIED | |
| Reserve/Watchlist | Luma | (unresolved) | RESERVE | Not in launch scope |
| Reserve/Watchlist | Sora | (unresolved) | RESERVE | Not in launch scope |
| Reserve/Watchlist | Grok Video | xAI | RESERVE | Not in launch scope |
| Reserve/Watchlist | Pika | (unresolved) | RESERVE | Not in launch scope |

**Consumer modes:** Smart Video, Cinematic, Fast, Budget, Animate Image, Edit Video, Character Motion.

## Context

Video has the widest provider spread of any capability and the clearest tier-to-provider-family mapping already stated in the product decision (Veo→Google, Kling→official+fal fallback, Seedance→Volcano Engine, Wan→Alibaba, Runway→direct, Hailuo→MiniMax).

## Decision drivers

- Explicit fallback-path decisions (Kling→fal, Seedance→approved gateway) are recorded now, before any code exists, so ADR-0016's "observable, disclosed provider substitution" requirement has a concrete first example to implement against.
- Reserve/Watchlist status for Luma/Sora/Grok Video/Pika keeps them visible as *considered and deliberately deferred*, not silently absent from the record.

## Alternatives considered

- Committing Luma/Sora/Grok Video/Pika to launch scope: rejected for this decision round — kept as reserve/watchlist pending further evaluation, not excluded outright.

## Consequences

- `docs/portfolio/video.md` restates this table; the fallback-path entries (Kling/fal, Seedance/gateway) are the first concrete input to `docs/architecture/fallback-routing.md`.
- The unresolved Wan version number ("2.6 or 2.7") is a named open item, not silently rounded to one or the other.

## Risks

- Video generation is flagged elsewhere (`AIFA_Brain/04_Research/Market_Intelligence/02_Competitors_Phase2.md` §2.4.3, `05_Pricing_Intelligence.md`) as economically difficult at Iran-resident/Toman price points (a single premium clip can cost more than a month's subscription at cost). This ADR records the *product/provider* decision only; it does not itself resolve the pricing viability question — that is `docs/economics/`'s job once Phase C pricing exists, cross-referenced against the existing Market Intelligence finding rather than re-deriving it from scratch.

## Mitigations

- Tiering (Premium/Economy) at least gives a cheaper entry point (Veo Lite, Hailuo 2.3 Fast, Wan 720p) for cost-sensitive routing once real prices are known.

## Related documents

- `docs/portfolio/video.md`, `docs/providers/google.md`, `docs/providers/kling.md`, `docs/providers/fal.md`, `docs/providers/volcano-engine.md`, `docs/providers/alibaba.md`, `docs/providers/runway.md`, `docs/providers/minimax.md`
- `AIFA_Brain/04_Research/Market_Intelligence/02_Competitors_Phase2.md` §2.4 (existing video-economics research — cross-referenced, not restated)

## Note (2026-07-20, non-normative — added, not editing the Decision above)

`AIFA_Brain/12_Decisions/PRODUCT_DECISION_LOG.md`'s **P-002** (Locked) resolves this ADR's open Wan version item (2.6-or-2.7 → **2.7**, pending endpoint verification), fixes exact naming for Kling ("Kling 3" → **Kling Video 3.0**, distinct from Kling Video 3.0 Omni) and Seedance ("Seedance 2" → **Seedance 2.0**), and sets **`fal`** as the *initial* serving gateway (not merely an optional fallback) for Kling Video 3.0, Seedance 2.0, Wan 2.7, and Hailuo 2.3 — correcting this ADR's "optional fallback"/"optional approved gateway" framing for Kling and Seedance. This ADR's own Decision table above is preserved exactly as originally Accepted; see `docs/portfolio/video.md` and P-002 for the current state.
