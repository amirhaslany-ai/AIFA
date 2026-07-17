# ADR-0022: Music and audio-generation portfolio

**Status:** Accepted (portfolio/product decision) — every provider mapping is UNVERIFIED pending Phase C of the provider pricing audit
**Date:** 2026-07-17
**Decision owners:** AIFA founder (product)
**Related:** ADR-0016, ADR-0017, `docs/portfolio/music.md`
**Supersedes:** none
**Superseded by:** none

## Decision

| Category | Entry | Expected provider | Classification | Notes |
|---|---|---|---|---|
| Full Song | Google Lyria 3 Pro | Google | UNVERIFIED | |
| Full Song | Mureka 9 | Mureka | UNVERIFIED | |
| Full Song (conditional) | Suno v5.5 | Suno | **INTEGRATION_GATED** | Locked condition: "official API only" |
| Feature-gated | Eleven Music | ElevenLabs | INTEGRATION_GATED | Feature-gated per product decision |
| Preview | Google Lyria 3 Clip | Google | UNVERIFIED | |
| Instrumental | Stable Audio 3 | Stability AI | UNVERIFIED | |
| Sound effects | ElevenLabs Sound Effects | ElevenLabs | UNVERIFIED | |
| Sound effects | Stable Audio 3 | Stability AI | UNVERIFIED | |
| Reserve | ACE-Step 1.5 | (unresolved) | RESERVE | |
| Reserve | Stable Audio 2.5 | Stability AI | RESERVE | |
| Reserve | Lyria 2 | Google | RESERVE | |
| Reserve | Udio | (unresolved) | RESERVE | |

**Consumer modes:** Create Song, Instrumental, Background Music, Soundtrack, Sound Effects, Remix, Extend, Separate Vocals. Professional users may select engines manually.

## Context

Music is the capability with the most conditional/gated entries (Suno explicitly requires an official API; Eleven Music is explicitly feature-gated) — recorded precisely so neither is silently treated as unconditionally available.

## Decision drivers

- Locking the Suno condition ("official API only") as a formal classification (`INTEGRATION_GATED`) rather than a footnote means Phase C research has an explicit go/no-go check to perform (does Suno publish an official API?) before this entry can move to `VERIFIED_ACTIVE`.
- Stable Audio 3 appearing in two categories (Instrumental and Sound Effects) is intentional — one provider model serving two AIFA-facing modes, an early real example of Model Family → multiple product uses.

## Alternatives considered

- Treating Suno as launch-committed regardless of API status: rejected — directly contradicts the locked "official API only" condition.

## Consequences

- `docs/portfolio/music.md` restates this table.
- `docs/pricing/pricing-audit-gaps.csv` should carry "Suno official API existence" and "Eleven Music feature-gate terms" as named, high-priority gaps once Phase C begins.

## Risks

- If Suno has no official API, Full Song's committed (non-conditional) entries are only Lyria 3 Pro and Mureka 9 — a real category-thinness risk once confirmed.

## Related documents

- `docs/portfolio/music.md`, `docs/providers/google.md`, `docs/providers/mureka.md`, `docs/providers/elevenlabs.md`, `docs/providers/stability-ai.md`
