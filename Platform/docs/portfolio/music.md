# Music

**Decision record:** [`../adr/0022-music-portfolio.md`](../adr/0022-music-portfolio.md) (authoritative — this doc is for navigation only).

## Catalog

| Category | Model | Expected provider | Classification | Provider doc |
|---|---|---|---|---|
| Full Song | Google Lyria 3 Pro | Google | UNVERIFIED | [`google.md`](../providers/google.md) |
| Full Song | Mureka 9 | Mureka | UNVERIFIED | [`mureka.md`](../providers/mureka.md) |
| Full Song (conditional) | Suno v5.5 | Suno | **INTEGRATION_GATED** — official API only | — |
| Feature-gated | Eleven Music | ElevenLabs | INTEGRATION_GATED | [`elevenlabs.md`](../providers/elevenlabs.md) |
| Preview | Google Lyria 3 Clip | Google | UNVERIFIED | [`google.md`](../providers/google.md) |
| Instrumental | Stable Audio 3 | Stability AI | UNVERIFIED | [`stability-ai.md`](../providers/stability-ai.md) |
| Sound effects | ElevenLabs Sound Effects | ElevenLabs | UNVERIFIED | [`elevenlabs.md`](../providers/elevenlabs.md) |
| Sound effects | Stable Audio 3 | Stability AI | UNVERIFIED | [`stability-ai.md`](../providers/stability-ai.md) |
| Reserve | ACE-Step 1.5 | *(unresolved)* | RESERVE | — |
| Reserve | Stable Audio 2.5 | Stability AI | RESERVE | [`stability-ai.md`](../providers/stability-ai.md) |
| Reserve | Lyria 2 | Google | RESERVE | [`google.md`](../providers/google.md) |
| Reserve | Udio | *(unresolved)* | RESERVE | — |

## Consumer modes

Create Song · Instrumental · Background Music · Soundtrack · Sound Effects · Remix · Extend · Separate Vocals. Professional users may select engines manually.

## Known open items

Suno official API existence and Eleven Music feature-gate terms are named gaps for Phase C (see ADR-0022).
