# Voice / SSML Pipeline
**Document ID:** `05_Production/Voice_SSML_Pipeline.md`
**Owning decision:** `DECISIONS.md` D-008 (Locked)
**Referenced by:** `05_Production/README.md` (Knowledge Base, Workflows steps 2–6)

> D-008 is a Locked, hard rule: raw script text is never sent directly to a TTS engine. This file details each stage between script and rendered audio.

## Pipeline stages

### 1. Speech Optimization
Adapt the script's written-for-reading text into spoken-delivery text:
- Numbers, dates, and units expanded into how they're actually said aloud, not left in written shorthand.
- Ambiguous abbreviations resolved (spelled out or replaced) so the voice tool doesn't mispronounce them.
- Overly long sentences broken into shorter spoken units — a sentence that reads fine can still land awkwardly spoken aloud.
- Distinct from `04_ScriptEngine`'s Final Polish step (rhythm/pacing at the script level) — this step is the TTS-readiness pass, done in Production, after the script is already finalized.

### 2. SSML Markup
Wrap the optimized text in SSML: prosody (rate/pitch/volume adjustments), break tags, emphasis tags, and phoneme guidance for pronunciation-sensitive terms (technical AI terminology, English loanwords in Persian).

### 3. Emotion Tagging
Apply emotion tags per segment, referencing `System/Shima_Persona.md`'s Emotion Library. While that library remains `🔶 NEEDS FOUNDER INPUT`, use the provisional tone framework established in the persona file (calm authority as baseline; honest concern for cautionary beats; genuine enthusiasm for genuinely useful findings) rather than inventing new emotional categories.

### 4. Pause Tagging
Insert explicit pause markers at natural breath points. This refines, rather than replaces, the breath-point notes `04_ScriptEngine`'s Final Polish step already leaves in the script — Production is tuning those notes against the actual voice tool's behavior, not deciding pacing from scratch.

### 5. Voice Generation
Render audio from the fully-marked-up SSML. Tool selection: `🔶` blocked on `OPEN_QUESTIONS.md` OQ-002 — no voice engine is confirmed, and Persian-language naturalness/accent quality is an explicitly flagged open risk, not a solved problem. This stage documents that generation happens from marked-up SSML, regardless of which tool ends up performing it.

## Hard rule

Stage 5 never receives input directly from a script or from Stage 1's plain optimized text — only from Stage 2–4's fully marked-up SSML. This holds even under deadline pressure; per `05_Production/README.md` § Failure Recovery, a late video is preferable to one produced by bypassing this pipeline.

## 🔶 Open gaps

- `System/Shima_Persona.md` §4 (voice design) and §5 (emotion library) are not yet defined — Stage 3 currently runs on the provisional framework only.
- Voice tool selection and Persian-naturalness validation: `OPEN_QUESTIONS.md` OQ-002.

## Cross-references
- Owning decision: `DECISIONS.md` D-008
- Emotion library this stage references: `System/Shima_Persona.md` §4–5
- Where the script's own pacing notes originate: `04_ScriptEngine/README.md` § Workflows step 9 (Final Polish)
