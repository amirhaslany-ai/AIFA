# Music

**Decision record:** [`../adr/0022-music-portfolio.md`](../adr/0022-music-portfolio.md) (authoritative for the original tier/mode structure) plus [`P-002`](../../../AIFA_Brain/12_Decisions/PRODUCT_DECISION_LOG.md#p-002--launch-model-provider-and-activation-matrix) (Locked, 2026-07-20 — corrects the Suno relationship on first-party evidence; see `Suno v5.5` row below).

## Catalog

| Category | Model | Expected provider | Classification | Provider doc |
|---|---|---|---|---|
| Full Song | Google Lyria 3 Pro | Google | UNVERIFIED | [`google.md`](../providers/google.md) |
| Full Song | Mureka 9 | Mureka | UNVERIFIED | [`mureka.md`](../providers/mureka.md) |
| Full Song (Locked, not yet activatable) | Suno v5.5 | Suno (model owner) — **no authorized serving provider/gateway currently available** | **INTEGRATION_GATED — NO AUTHORIZED PUBLIC API OR PASS-THROUGH LICENSING FRAMEWORK** | [`suno.md`](../providers/suno.md) |
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

**Suno's API-existence gate is now resolved (2026-07-20): no authorized public API exists** — see [`suno.md`](../providers/suno.md) and `AIFA_Brain/04_Research/API_Research/Suno/2026-07-20-suno-support-api-response.md` (first-party Suno Support response). Suno stays in the Locked Portfolio but is not available for activation until Suno grants explicit written authorization; Music launch continuity is carried by the other rows above regardless. Eleven Music's feature-gate terms remain an open gap for Phase C.
