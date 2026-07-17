# Voice

**Decision record:** [`../adr/0021-voice-portfolio.md`](../adr/0021-voice-portfolio.md) (authoritative — this doc is for navigation only).

## Text-to-Speech

| Model | Expected provider | Classification |
|---|---|---|
| Eleven v3 | ElevenLabs | UNVERIFIED |
| Eleven Multilingual v2 | ElevenLabs | UNVERIFIED |
| Eleven Flash v2.5 | ElevenLabs | UNVERIFIED |
| Gemini 3.1 Flash TTS | Google | UNVERIFIED |
| Chirp 3 HD | Google | UNVERIFIED |
| Cartesia Sonic 3.5 | Cartesia | RESERVE |

## Speech-to-Text

| Model | Expected provider | Classification |
|---|---|---|
| Scribe v2 | ElevenLabs | UNVERIFIED |
| Scribe v2 Realtime | ElevenLabs | UNVERIFIED |
| Nova-3 | Deepgram | UNVERIFIED |
| Flux | Deepgram | UNVERIFIED |
| OpenAI realtime transcription / Whisper-compatible | OpenAI | RESERVE |

## Voice cloning

| Model | Expected provider | Classification |
|---|---|---|
| Eleven Instant Voice Cloning | ElevenLabs | UNVERIFIED |
| Eleven Professional Voice Cloning | ElevenLabs | UNVERIFIED |
| Google Instant Custom Voice | Google | RESERVE |

## Voice changer & dubbing

| Capability | Model | Expected provider | Classification |
|---|---|---|---|
| Voice changer | ElevenLabs Speech-to-Speech | ElevenLabs | UNVERIFIED |
| Dubbing | ElevenLabs Dubbing | ElevenLabs | UNVERIFIED |

## Realtime voice architecture

```
Audio → STT → LLM → TTS → Audio
```

| Stack | STT | LLM | TTS |
|---|---|---|---|
| Default | Deepgram | selected chat LLM ([`chat.md`](chat.md)) | Eleven Flash |
| Premium | Deepgram | frontier chat LLM | Eleven v3 or Gemini TTS |
| Economy | Deepgram | economy chat LLM | Gemini TTS |

Native OpenAI integrated realtime is a reserve route, not the default architecture — see ADR-0021 for rationale.

## Launch / reserve providers

**Launch:** ElevenLabs, Google, Deepgram. **Reserve:** OpenAI Audio, Cartesia, Google Custom Voice.

Provider docs: [`elevenlabs.md`](../providers/elevenlabs.md), [`google.md`](../providers/google.md), [`deepgram.md`](../providers/deepgram.md).
