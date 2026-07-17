# ADR-0021: Voice portfolio — TTS, STT, cloning, changer, dubbing, realtime architecture

**Status:** Accepted (portfolio/product decision) — every provider mapping is UNVERIFIED pending Phase C of the provider pricing audit
**Date:** 2026-07-17
**Decision owners:** AIFA founder (product)
**Related:** ADR-0016, ADR-0017, `docs/portfolio/voice.md`
**Supersedes:** none
**Superseded by:** none

## Decision

**Capabilities in scope:** Text-to-Speech, Speech-to-Text, Voice Cloning, Voice Changer, Dubbing and Translation, Realtime Voice.

| Sub-capability | Entry | Expected provider | Classification |
|---|---|---|---|
| TTS | Eleven v3 | ElevenLabs | UNVERIFIED |
| TTS | Eleven Multilingual v2 | ElevenLabs | UNVERIFIED |
| TTS | Eleven Flash v2.5 | ElevenLabs | UNVERIFIED |
| TTS | Gemini 3.1 Flash TTS | Google | UNVERIFIED |
| TTS | Chirp 3 HD | Google | UNVERIFIED |
| TTS (reserve) | Cartesia Sonic 3.5 | Cartesia | RESERVE |
| STT | Scribe v2 | ElevenLabs | UNVERIFIED |
| STT | Scribe v2 Realtime | ElevenLabs | UNVERIFIED |
| STT | Nova-3 | Deepgram | UNVERIFIED |
| STT | Flux | Deepgram | UNVERIFIED |
| STT (reserve) | OpenAI realtime transcription / Whisper-compatible offering | OpenAI | RESERVE |
| Voice cloning | Eleven Instant Voice Cloning | ElevenLabs | UNVERIFIED |
| Voice cloning | Eleven Professional Voice Cloning | ElevenLabs | UNVERIFIED |
| Voice cloning (reserve) | Google Instant Custom Voice | Google | RESERVE |
| Voice changer | ElevenLabs Speech-to-Speech | ElevenLabs | UNVERIFIED |
| Dubbing | ElevenLabs Dubbing | ElevenLabs | UNVERIFIED |

**Realtime voice architecture (locked pipeline):**

```
Audio → STT → LLM → TTS → Audio
```

| Stack | STT | LLM | TTS |
|---|---|---|---|
| Default | Deepgram | (selected chat LLM, ADR-0018) | Eleven Flash |
| Premium | Deepgram | (frontier chat LLM) | Eleven v3 or Gemini TTS |
| Economy | Deepgram | (economy chat LLM) | Gemini TTS |

Native OpenAI realtime (single-vendor, integrated STT+LLM+TTS) remains a **reserve** route, not the default architecture.

**Launch providers:** ElevenLabs, Google, Deepgram.
**Reserve providers:** OpenAI Audio, Cartesia, Google Custom Voice.

## Context

Voice is the only capability with an explicit multi-stage pipeline decision (STT→LLM→TTS) rather than a single-call model, because Realtime Voice composes three sub-capabilities (transcription, chat, speech synthesis) that already exist as separate AIFA capabilities.

## Decision drivers

- Composing Realtime Voice from existing STT/LLM/TTS building blocks (rather than adopting one vendor's integrated realtime API by default) keeps AIFA's routing/fallback/cost machinery uniform across the whole pipeline (each stage is independently swappable per ADR-0016/0017), rather than opaque inside a single vendor's realtime black box.
- Deepgram as the fixed STT choice across all three realtime tiers (only the LLM and TTS vary by tier) reflects a decision to standardize the transcription leg and vary quality/cost only on the generation and synthesis legs.

## Alternatives considered

- **OpenAI's integrated realtime voice API as the default stack**: rejected as default (kept as reserve) — an integrated vendor pipeline is simpler to wire up but reintroduces the single-provider dependency ADR-0016/0017 are designed to avoid, and doesn't let AIFA independently swap the LLM stage to match its chat portfolio (ADR-0018).

## Consequences

- `docs/portfolio/voice.md` restates this table; `docs/architecture/capability-model-provider.md` should reference Realtime Voice as the concrete example of a capability whose "model" is actually a composed pipeline of three provider calls, not one.

## Risks

- Three-stage pipelines multiply latency and failure surface (three provider calls instead of one) — a real product/UX risk (perceived response time) that Smart Router's Speed Engine (ADR-0024) should account for once implemented.

## Mitigations

- Standardizing STT (Deepgram, all tiers) reduces the number of independent moving pieces to two (LLM, TTS) rather than three, simplifying tier-to-cost reasoning.

## Related documents

- `docs/portfolio/voice.md`, `docs/providers/elevenlabs.md`, `docs/providers/google.md`, `docs/providers/deepgram.md`
- ADR-0018 (chat/LLM portfolio, referenced by the realtime stack)
