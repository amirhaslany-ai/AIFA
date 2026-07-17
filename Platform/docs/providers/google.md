# Google (AI / Vertex AI)

**Status:** Skeleton — pending Phase C verification against official Google AI / Vertex AI sources only.

## AIFA usage (locked portfolio decisions)

- Chat: Gemini 3.1 Pro Preview, Gemini 3.1 Flash-Lite (UNVERIFIED) — [`../portfolio/chat.md`](../portfolio/chat.md), ADR-0018
- Image: Nano Banana Pro (Premium), Nano Banana 2 (Professional) (UNVERIFIED) — [`../portfolio/image.md`](../portfolio/image.md), ADR-0019
- Video: Veo 3.1 Fast, Veo 3.1 Standard, Veo Lite, Gemini Omni Flash (general launch + editing) (UNVERIFIED) — [`../portfolio/video.md`](../portfolio/video.md), ADR-0020
- Voice: Gemini 3.1 Flash TTS, Chirp 3 HD (UNVERIFIED); Google Instant Custom Voice (RESERVE) — [`../portfolio/voice.md`](../portfolio/voice.md), ADR-0021
- Music: Google Lyria 3 Pro (Full Song), Google Lyria 3 Clip (Preview) (UNVERIFIED); Lyria 2 (RESERVE) — [`../portfolio/music.md`](../portfolio/music.md), ADR-0022

**Note:** this is AIFA's broadest single-provider footprint across the portfolio — a real concentration-risk item to flag once Phase C confirms actual availability and terms (see `../architecture/fallback-routing.md`).

## Identity — PENDING

Official model IDs for every entry above; whether "Preview"-suffixed names (Gemini 3.1 Pro Preview) are officially designated preview/GA; region restrictions; Vertex AI vs. direct Gemini API distinction: **UNKNOWN, not yet checked against official Google documentation.**

## Pricing — PENDING

Expected billing dimensions: input/output/cached token price (chat), per-image price (image), per-second price (video), per-character or per-minute price (TTS), per-song or per-minute price (music). All: **UNKNOWN.**

## Commercial & legal — PENDING

Commercial-use terms, generated-content ownership (notably for image/video/music), data-retention/training-on-customer-data default, zero-data-retention availability, DPA/EU-processing availability: **UNKNOWN.**

## Related documents

- `../adr/0018-chat-portfolio.md`, `../adr/0019-image-portfolio.md`, `../adr/0020-video-portfolio.md`, `../adr/0021-voice-portfolio.md`, `../adr/0022-music-portfolio.md`
