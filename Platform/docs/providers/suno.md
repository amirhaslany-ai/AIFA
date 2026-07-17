# Suno

**Status:** Skeleton — pending Phase C verification against official Suno sources only. **Added to fill a gap in the original file tree**: Suno v5.5 is a locked (conditional) portfolio entry (ADR-0022) with no provider doc in the task's original structure — created so that entry has somewhere to link to.

## AIFA usage (locked portfolio decisions)

- Music: Suno v5.5 (Full Song, **INTEGRATION_GATED** — locked condition: "official API only") — [`../portfolio/music.md`](../portfolio/music.md), ADR-0022

**This is the single highest-priority open question for the Music portfolio**: whether Suno publishes an official, generally-available API at all. If not, this entry does not launch, per the locked condition — it is not silently relaxed to "use Suno anyway via an unofficial route."

## Identity — PENDING

**Does Suno have an official API product at all, as of Phase C's research date?** This is a yes/no gate, not a detail to fill in — must be resolved before any other field on this provider is meaningful. **UNKNOWN.**

## Pricing — PENDING

Contingent entirely on the identity question above. **UNKNOWN.**

## Commercial & legal — PENDING

Contingent on the identity question above. **UNKNOWN.**

## Related documents

- `../adr/0022-music-portfolio.md`
