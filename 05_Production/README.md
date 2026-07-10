# 05_Production
**Document ID:** `05_Production/README.md`
**Status:** Authoritative spec for the Production engine (Constitution §8)
**Inherits from:** `00_System/DECISIONS.md` D-007, D-008, D-015

> Follows the standard agent structure locked in `DECISIONS.md` D-003. Detail lives in sibling files (`Avatar_Pipeline.md`, `Voice_SSML_Pipeline.md`, `Video_Assembly.md`) and is referenced, not duplicated, here. This engine is more tool-dependent than any other in the pipeline and has the most open founder-input gaps — see § Knowledge Base for what's blocking full execution today.

---

## Mission

Turn a final script (`04_ScriptEngine`) into a rendered video that matches Shima's persona exactly and never bypasses the mandated voice pipeline — no visual/vocal drift between videos, no raw text sent straight to a TTS engine, ever (D-007, D-008).

## Role

Fourth stage in the pipeline (`01_Core/Architecture.md`). Input: final script artifact (`04_ScriptEngine/README.md` § Output Format). Output: a rendered video artifact consumed by `06_Marketing` (platform derivation), `07_SEO`, and `09_QA` (review gate before publish).

## Responsibilities

- Run every script through Speech Optimization → SSML → Emotion Tags → Pause Tags → Voice Generation before any audio is produced (D-008, hard rule — no exceptions under time pressure).
- Generate avatar visuals that match `System/Shima_Persona.md` exactly, or explicitly flag when a render had to proceed against a still-open `🔶` persona gap rather than silently improvising a visual choice.
- Apply the hybrid layout (full-screen for key moments, PiP for demos/tool-walkthroughs) per `01_Core/Quality_Standards.md` and `Video_Assembly.md`.
- Maintain the audio quality bar: no artifacts, consistent pacing, correctly stressed Persian pronunciation (a hard gate, not a nice-to-have, per `01_Core/Quality_Standards.md`).
- Burn in or attach Persian captions by default (D-015).
- Produce the single long-form source-of-truth video (YouTube primary, Constitution §7) that `06_Marketing` derives all platform-specific cuts from.

## Knowledge Base

- `System/Shima_Persona.md` — the character bible this engine renders against. **Most visual/vocal specifics (§3 character design, §4 voice design, §5 emotion library, §6 gestures, §7 wardrobe, §8 backgrounds, §9 lighting, §10 camera angles) are still `🔶 NEEDS FOUNDER INPUT`.** This is the single largest blocker to this engine actually producing output — see § Failure Recovery for how this engine operates under that gap.
- `Avatar_Pipeline.md`, `Voice_SSML_Pipeline.md`, `Video_Assembly.md` — the three sub-pipelines.
- `01_Core/Quality_Standards.md` — the video/production quality bar.
- `OPEN_QUESTIONS.md` OQ-002 (avatar/voice tooling unconfirmed), OQ-003 (budget unconfirmed) — both block final tool selection; this folder documents pipeline *shape*, not vendor-specific configuration, per the tool-agnostic design principle in `01_Core/Architecture.md`.

## Decision Rules

- **Raw script text is never sent directly to a TTS engine** — every voice asset goes through the full SSML/emotion/pause pipeline (D-008). This is never bypassed, including under deadline pressure; a late video beats an unnaturally flat one.
- **No new visual/vocal asset is used without being checked against `System/Shima_Persona.md`** (Constitution Core Principle 3). Where the persona file itself has a `🔶` gap, this engine documents the pipeline shape and flags the specific render as blocked, rather than inventing an appearance/voice choice to keep moving — persona drift is exactly the failure mode D-007 exists to prevent, and an invented choice made now becomes the (wrong) baseline for every future video.
- **Layout selection follows the script's own section structure** (`04_ScriptEngine`'s category workflow files) — full-screen for narrative/direct-address beats, PiP whenever the segment shows something (tool UI, comparison, screenshot). See `Video_Assembly.md` for the per-category mapping.
- **Tool selection is out of scope for this file** — vendor choice belongs in implementation notes once OQ-002/OQ-003 resolve, not hard-coded into pipeline-shape documents (`01_Core/Architecture.md`).

## Workflows

1. **Ingest** the final script artifact from `04_ScriptEngine`.
2. **Speech Optimization** — adapt the written-for-reading script into spoken-delivery text (natural handling of numbers/dates, breaking up long sentences, resolving ambiguous abbreviations) — see `Voice_SSML_Pipeline.md`. Distinct from Script Engine's own Final Polish step, which handles rhythm at the script level; this step goes further into TTS-ready adaptation.
3. **SSML Markup** — wrap the optimized text in SSML (prosody, breaks, emphasis, phoneme guidance for tricky pronunciation).
4. **Emotion Tagging** — apply emotion tags per segment, referencing `System/Shima_Persona.md`'s Emotion Library where defined, and the provisional tone framework (calm authority / honest concern / genuine enthusiasm) where it isn't yet.
5. **Pause Tagging** — insert pause tags at natural breath points, refining the breath-point notes already present from Script Engine's Final Polish step.
6. **Voice Generation** — render audio via the selected voice tool (`Voice_SSML_Pipeline.md`; tool TBD per OQ-002).
7. **Avatar Generation** — render the visual avatar performance matching the persona and the script's emotion/layout tags (`Avatar_Pipeline.md`; tool TBD per OQ-002).
8. **Video Assembly** — combine avatar and voice, apply the hybrid full-screen/PiP layout, add captions (D-015) and any brand elements (`Video_Assembly.md`).
9. **QA Handoff** — pass the rendered video to `09_QA` for the review gate; Production does not self-approve for publish (Constitution Core Principle 5).

## Quality Standards

Inherits `01_Core/Quality_Standards.md`'s video/production quality bar in full — not restated here.

## Examples / Edge Cases

- **A script's Nuance section (News) calls for a "concerned/cautionary" emotional register that isn't yet defined in `Shima_Persona.md`'s Emotion Library:** use the closest general tone from the provisional framework (§ Decision Rules) and flag the render, rather than inventing a specific expression/vocal choice.
- **Tool Review Demo section needs PiP with synced screen capture:** avatar reaction shots must be timed against the screen-capture footage, not just placed adjacent to it — see `Video_Assembly.md`.
- **A technical term or English loanword has an ambiguous Persian pronunciation:** flag for a pronunciation-guide entry (§ Future Improvements) rather than guessing per-video, which would itself create inconsistency.
- **SSML markup produces unnatural pacing on a long technical sentence:** fix at the Speech Optimization step (simplify/break the sentence) rather than patching with excessive pause tags at the SSML step.

## Failure Recovery

- **A render is blocked by an open `Shima_Persona.md` gap:** do not improvise. Document what's needed, flag it, and hold that video rather than shipping an inconsistent asset — see `OPEN_QUESTIONS.md` OQ-002.
- **Avatar/voice tool unavailable or rate-limited:** hold and retry; never fall back to raw TTS or a placeholder visual to hit a deadline (D-008 is a hard rule, not a target).
- **Rendered output drifts from the established persona baseline once one exists:** reject and regenerate — `01_Core/Quality_Standards.md`'s persona-consistency check is a hard gate, not a judgment call.
- **A script-level issue only becomes visible when read aloud** (awkward phrasing, a line that doesn't land vocally): bounce back to `04_ScriptEngine` — Production does not rewrite script content itself, since it doesn't own script quality.

## Output Format

Rendered video artifact:
```
- category, title: <inherited from the script artifact>
  video_file: <reference/path>
  runtime_actual: <measured runtime>
  ssml_script: <the marked-up text actually used for voice generation, retained for audit>
  avatar_asset_version: <which persona asset/config version was used>
  layout_segments: [{ segment, layout: full_screen | pip, timestamp_range }]
  emotion_tags_used: [...]
  captions: included (D-015)
  persona_gap_flags: [<any Shima_Persona.md 🔶 gap this render had to proceed against>]
  qa_status: pending
```

## Self-Review Checklist

- [ ] Raw script never sent directly to TTS — full SSML/emotion/pause pipeline used (D-008).
- [ ] Avatar appearance/voice/gestures checked against `System/Shima_Persona.md`, or the gap is explicitly flagged in `persona_gap_flags`.
- [ ] Hybrid layout applied per `Video_Assembly.md`'s section mapping.
- [ ] Audio is clean, with correctly stressed Persian pronunciation.
- [ ] Captions included (D-015).
- [ ] No unflagged drift from the prior video's persona baseline.

## KPIs

- Render turnaround time per video.
- Audio-artifact rate (target: zero for shipped videos).
- Persona-consistency pass rate at the `09_QA` gate.
- Avatar/voice cost per video, once tooling and budget (OQ-002, OQ-003) are confirmed — currently untracked.

## Future Improvements

- A Persian pronunciation guide/glossary for recurring technical terms and English loanwords, to remove per-video guessing (§ Examples/Edge Cases).
- An automated persona-consistency checker, once enough rendered videos exist to define "consistent" concretely.
- Batch/queued rendering once `08_Automation` exists.

## Cross-references
- Persona requirement and voice pipeline: `DECISIONS.md` D-007, D-008
- Captions default: `DECISIONS.md` D-015
- The character bible this engine renders against: `System/Shima_Persona.md`
- Blocking open questions: `OPEN_QUESTIONS.md` OQ-002, OQ-003
- Review gate before publish: `09_QA/README.md`
