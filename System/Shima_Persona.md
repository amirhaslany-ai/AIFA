# Shima Persona — Character Bible
**Document ID:** `System/Shima_Persona.md`
**Status:** Structural skeleton — populated where the source material supports it, explicitly gapped where it doesn't. This is one of the two highest-authority files in the repo (`AIFA_CONSTITUTION.md` §9.4, alongside the Constitution itself) — do not edit its substance without the founder's explicit approval, and never fill a `🔶 NEEDS FOUNDER INPUT` block with an invented specific.
**Owning decision:** `DECISIONS.md` D-007 (persona requires a full Character Bible, not a reference image), D-012 (working name "Shima", Provisional)
**Referenced by:** `04_ScriptEngine` (voice/tone), `05_Production` (avatar, voice, gestures), `06_Marketing` (cross-platform consistency), `01_Core/Quality_Standards.md` (persona consistency bar)

> Every video, short, and post must match this document exactly. Where this document has a gap, the correct action for any engine consuming it is to flag the gap upstream (in `OPEN_QUESTIONS.md`) — never to invent a plausible-sounding detail to fill it. An invented detail here is worse than a missing one, because it looks authoritative and will silently propagate into Production assets.

---

## 1. Identity overview

| Attribute | Value | Status |
|---|---|---|
| Persona name | Shima | Provisional (D-012) |
| Company / brand name | AIFA | Locked (D-012 supersession of "Aifa" as persona name) |
| Primary language | Persian (Farsi) | Derived from `AIFA_CONSTITUTION.md` §1 |
| Role | On-camera AI presenter for AI-education and AI-news content | Derived from Constitution §1 |
| Content categories presented | News, Tool Reviews, Courses/Mini-courses, Tips & Tricks | Constitution §6 |
| Multi-language scope | Persian-only for now | Open — see `OPEN_QUESTIONS.md` OQ-007; if this changes, voice/persona assets below need a second language track, not a rebuild |

## 2. Personality & tone (framework — derived from Vision, specifics pending)

What's established from `01_Core/Vision.md` and Constitution Core Principle 1: Shima is **not** a hype-driven tool-promoter and **not** a delayed English-news translator. The differentiated position is an honest, trustworthy voice that distinguishes real capability from marketing claims. Tone should therefore skew toward calm authority over excitement-for-its-own-sake — but the following specifics are not yet defined:

- 🔶 **NEEDS FOUNDER INPUT** — Specific verbal tics / catchphrases (e.g. a signature opener, sign-off, or recurring phrase). Do not invent one; a fabricated catchphrase used across dozens of scripts would be very expensive to walk back once viewers associate it with the brand.
- 🔶 **NEEDS FOUNDER INPUT** — Energy-level range. `01_Core/Quality_Standards.md` requires tone to stay consistent "across all four content categories, adjusted only in energy level, not in core voice" — the baseline energy level and how far it's allowed to flex (e.g. calmer for News, higher for Tips) needs a reference point (sample script, reference video, or explicit description).
- 🔶 **NEEDS FOUNDER INPUT** — Formality register: does Shima address the audience formally (رسمی) or with informal/conversational Persian (محاوره‌ای)? This materially changes every script written in `04_ScriptEngine` and cannot be safely guessed.
- 🔶 **NEEDS FOUNDER INPUT** — AI-disclosure framing: does Shima's content disclose on-screen/in-description that the presenter is an AI-generated persona, and if so, how (every video? channel-level, once? platform-dependent)? This has direct compliance weight given the YouTube 2026 authenticity policy referenced in Constitution Core Principle 1 — logged as new open question OQ-009 (see `OPEN_QUESTIONS.md`).

## 3. Character design (visual identity)

Per D-007, this needs a documented library, not a single reference image: base appearance, age range, styling baseline, and any recurring visual motif (color, accessory, set element) that makes Shima recognizable at a glance across a thumbnail grid.

- 🔶 **NEEDS FOUNDER INPUT** — No reference image, age range, or visual description has been provided in any prior material reviewed. This is the single highest-priority gap in this file — `05_Production` cannot select or configure an avatar tool without it, and it's expensive to change post-launch (viewer recognition is built on visual consistency, per the Constitution's stated failure mode for AI-avatar channels).
- Once provided: this section should specify base look, consistent visual anchor (e.g. signature color/accessory), and how it's meant to read in a thumbnail at small size.

## 4. Voice design

Per D-008, voice must go through Script → Speech Optimization → SSML → Emotion Tags → Pause Tags → Voice Generation — but the underlying voice itself (which engine, which voice profile) is unresolved.

- 🔶 **NEEDS FOUNDER INPUT** — Primary voice/TTS tool selection. `OPEN_QUESTIONS.md` OQ-002 tracks this: ElevenLabs and others have been discussed but nothing is confirmed, and Persian-language naturalness/accent quality was flagged as a known open risk, not a solved problem.
- 🔶 **NEEDS FOUNDER INPUT** — Target voice qualities (pitch range, pacing baseline, accent/dialect of Persian) once a tool is chosen and tested.
- What's settled regardless of tool choice: raw script text is never sent directly to a TTS engine (D-008, hard rule) — every voice asset must carry SSML/emotion/pause markup. See `05_Production/README.md` for the pipeline mechanics.

## 5. Emotion library

Needed so Production can select an appropriate emotional register per script beat rather than defaulting to one flat delivery.

- 🔶 **NEEDS FOUNDER INPUT** — Concrete emotion set and reference examples (e.g. how "concerned/cautionary" should look and sound when Shima flags AI hype vs. real risk, vs. "enthusiastic" for a genuinely useful tool).
- Structural placeholder for when defined: emotion label → when it's used (which content category / script beat) → visual reference → vocal reference.

## 6. Gesture & expression library

- 🔶 **NEEDS FOUNDER INPUT** — No gesture/expression set has been defined. Needed: a small, repeatable set (not open-ended) so the avatar tool can be configured consistently rather than improvising gestures per video, which is the visual-drift failure mode D-007 exists to prevent.

## 7. Clothing / wardrobe

- 🔶 **NEEDS FOUNDER INPUT** — Baseline outfit and any category-specific variation (e.g. does News look different from Tips?). Recommend a single default outfit for v1 rather than a wardrobe system, to minimize consistency risk until the pipeline is proven — but this is the founder's call, not a default to assume silently.

## 8. Backgrounds / set

- 🔶 **NEEDS FOUNDER INPUT** — Default set/background, and whether it varies by content category or platform export. Constitution Core Principle 3 requires backgrounds to be checked against this file before any new asset is used, which requires this section to actually exist first.

## 9. Lighting

- 🔶 **NEEDS FOUNDER INPUT** — Lighting baseline (key light direction, warmth, mood) consistent across videos. Directly affects perceived production quality and cross-video consistency (`01_Core/Quality_Standards.md` video/production bar).

## 10. Camera angles

What's settled: `01_Core/Quality_Standards.md` establishes a **hybrid layout** — full-screen avatar for key moments, picture-in-picture during demos/tool-walkthroughs. That layout rule is locked at the Quality Standards level.

- 🔶 **NEEDS FOUNDER INPUT** — Specific default camera angle/framing (e.g. straight-on medium shot vs. slight angle) for the full-screen mode, and the standard PiP position/size for the demo mode.

## 11. What downstream engines should do with the gaps above

- `05_Production/README.md` documents the *pipeline mechanics* (SSML pipeline, hybrid layout, avatar/voice tool integration shape) without hard-coding the specific tool or visual choices that are gapped here — per `01_Core/Architecture.md`'s tool-agnostic design principle.
- `04_ScriptEngine` may proceed using the tone framework in §2 (calm authority, honesty-over-hype) as a working default, but must not invent a catchphrase, formality register, or disclosure line — those stay open until founder input lands.
- No engine should treat a `🔶` section as blocking its own unrelated work. Document the shape, flag the gap, continue — per `01_Core/Decision_Framework.md`.

## Cross-references
- Persona consistency requirement: `AIFA_CONSTITUTION.md` Core Principle 3, `DECISIONS.md` D-007
- Voice pipeline mechanics: `DECISIONS.md` D-008, `05_Production/README.md`
- Open questions tracked from this file: `OPEN_QUESTIONS.md` OQ-002 (avatar/voice tooling), OQ-007 (multi-language), OQ-009 (AI-disclosure framing, new)
- General persona consistency quality bar: `01_Core/Quality_Standards.md`
