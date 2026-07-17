# ElevenLabs

**Status:** Skeleton — pending Phase C verification against official ElevenLabs sources only.

## AIFA usage (locked portfolio decisions)

- Voice (TTS): Eleven v3, Eleven Multilingual v2, Eleven Flash v2.5 (all UNVERIFIED) — [`../portfolio/voice.md`](../portfolio/voice.md), ADR-0021
- Voice (STT): Scribe v2, Scribe v2 Realtime (UNVERIFIED) — ADR-0021
- Voice (cloning): Eleven Instant Voice Cloning, Eleven Professional Voice Cloning (UNVERIFIED) — ADR-0021
- Voice (changer/dubbing): ElevenLabs Speech-to-Speech, ElevenLabs Dubbing (UNVERIFIED) — ADR-0021
- Voice (realtime stack): Eleven Flash (default TTS leg), Eleven v3 (Premium TTS leg) — ADR-0021
- Music: Eleven Music (INTEGRATION_GATED — feature-gated), ElevenLabs Sound Effects (UNVERIFIED) — [`../portfolio/music.md`](../portfolio/music.md), ADR-0022

**Note:** ElevenLabs is AIFA's broadest single-provider footprint in Voice and a meaningful Music footprint — a real concentration-risk item once Phase C confirms terms (mirrors the Google concentration noted in `google.md`).

## Identity — PENDING

Official model/product IDs for every entry above; which require which account tier; Eleven Music's exact feature-gate condition: **UNKNOWN, not yet checked against official ElevenLabs documentation.**

## Pricing — PENDING

Expected billing dimensions: per-character or per-minute price (TTS), per-minute price (STT), voice-cloning setup/usage fee, per-second price (sound effects/music), subscription tiers with included-minutes allowances. **UNKNOWN.**

## Commercial & legal — PENDING

Voice-cloning consent requirements (high legal sensitivity), generated-audio ownership, data-retention default, zero-data-retention availability, DPA/EU-processing availability: **UNKNOWN.**

## Related documents

- `../adr/0021-voice-portfolio.md`, `../adr/0022-music-portfolio.md`
