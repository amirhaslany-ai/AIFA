# ADR-0019: Image portfolio — locked model tiers, consumer modes, exclusions

**Status:** Accepted (portfolio/product decision) — every provider mapping is UNVERIFIED pending Phase C of the provider pricing audit
**Date:** 2026-07-17
**Decision owners:** AIFA founder (product)
**Related:** ADR-0016, ADR-0017, `docs/portfolio/image.md`
**Supersedes:** none
**Superseded by:** none

## Context

Image generation is AIFA's first non-chat capability decision, establishing the tiering pattern (Premium/Professional/Economy) other capabilities reuse.

## Decision

| Tier | Entry | Expected provider family | Classification | Notes |
|---|---|---|---|---|
| Premium | GPT Image 2 | OpenAI | UNVERIFIED | |
| Premium | Nano Banana Pro | Google | UNVERIFIED | |
| Premium | FLUX.2 Max | Black Forest Labs | UNVERIFIED | |
| Professional | Nano Banana 2 | Google | UNVERIFIED | |
| Professional | FLUX.2 Pro | Black Forest Labs, optional `fal` route | UNVERIFIED | Two possible provider paths — direct BFL or the `fal` aggregator; resolved in Phase C |
| Professional | Ideogram 4 | Ideogram | UNVERIFIED | |
| Professional | Recraft V4 | Recraft | UNVERIFIED | |
| Professional | Runway Image | Runway | UNVERIFIED | |
| Economy | Seedream 5 Lite | (unresolved) | **INTEGRATION_GATED** | Locked condition: "only if an official or approved API is available" — not launching otherwise |
| Economy | FLUX Dev | Black Forest Labs | WATCHLIST | Marked "optional" in the product decision — not committed |

**Not launching (explicit exclusions):** Midjourney, Adobe Firefly, Stable Diffusion family. These are locked non-goals, not gaps to fill later without a new decision.

**Consumer modes:** Photoreal, Poster, Graphic Design, Editing, Fast Draft. Professional users may select engines manually (mode abstraction is default UX; manual engine selection is an explicit professional-tier override, not the default surface).

## Decision drivers

- Tiering by quality/cost (Premium/Professional/Economy) gives Smart Cost Engine (ADR-0024) a structural hook rather than a flat, undifferentiated model list.
- The Seedream 5 Lite gate reflects a real, named uncertainty (API availability) rather than silently assuming it will exist — tracked as an `INTEGRATION_GATED` classification and, once Phase C confirms/denies API availability, as a gap in `docs/pricing/pricing-audit-gaps.csv`.
- Excluding Midjourney/Firefly/Stable Diffusion is a locked scope decision (likely no suitable official API terms, commercial-use clarity, or product fit) — recorded so it isn't silently re-litigated by a future contributor.

## Alternatives considered

- Launching Seedream 5 Lite unconditionally: rejected — the product decision itself is conditional; asserting it as committed would misrepresent an explicitly gated decision.
- Including Midjourney: rejected as a locked non-goal — no API-first commercial offering suitable for aggregation as of the product decision.

## Consequences

- `docs/portfolio/image.md` restates this table for navigation; Phase C resolves every `UNVERIFIED`/`INTEGRATION_GATED`/`WATCHLIST` entry against official sources.
- The FLUX.2 Pro dual-path (direct BFL vs. `fal`) is exactly the kind of provider-substitution ADR-0016 requires to be observable, not silently one-or-the-other.

## Risks

- If Seedream 5 Lite has no official/approved API, the Economy tier has only one committed entry (FLUX Dev, itself only "optional") — a real tier-thinness risk to flag once Phase C confirms.

## Mitigations

- Tracked explicitly in `docs/pricing/pricing-audit-gaps.csv` as a priority item once Phase C begins, rather than left as an implicit assumption.

## Implementation implications

- None yet — no image adapter exists (ADR-0017 establishes the pattern to follow when one is built).

## Related documents

- `docs/portfolio/image.md`, `docs/providers/openai.md`, `docs/providers/google.md`, `docs/providers/black-forest-labs.md`, `docs/providers/fal.md`, `docs/providers/ideogram.md`, `docs/providers/recraft.md`, `docs/providers/runway.md`
