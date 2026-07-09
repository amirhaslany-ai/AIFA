# Quality Standards
**Document ID:** 01_Core/Quality_Standards.md
**Inherits from:** `00_System/AIFA_CONSTITUTION.md` §5 (Core Principles)

## Purpose

This is the general quality bar every pipeline output is checked against before it counts as "done." Engine-specific standards (SEO quality, thumbnail psychology, etc.) live in their own folders and must not contradict this file.

## Script quality bar (checked before a script moves to Production)

A script passes only if all of the following are true:
- [ ] Written from scratch in Shima's voice — not a reworded source (D-004). If any sentence could be traced closely to a single source's phrasing, it fails.
- [ ] Went through the full multi-step workflow for its content type (D-005) — not generated in one pass.
- [ ] Every factual claim traces back to a source captured during Research — no invented statistics, dates, or quotes. See `AI_Hallucination_Prevention` guidance (to be detailed in `09_QA`).
- [ ] Has a clear hook in the first 5–8 seconds appropriate to the platform it's primarily built for.
- [ ] Has a clear, single CTA — not three competing asks.
- [ ] Matches the category's structure exactly (news / course / tool-review / tips, per D-005) — no structural drift.

## Video/production quality bar

- [ ] Avatar appearance, voice, and gestures match `System/Shima_Persona.md` exactly — no visual or vocal drift between videos (D-007).
- [ ] Voice went through the full SSML/emotion/pause pipeline — never raw TTS output (D-008).
- [ ] Audio is clean: no artifacts, consistent pacing, correctly stressed Persian pronunciation (this was flagged as a known failure point in early attempts — treat as a hard gate, not a nice-to-have).
- [ ] Full-screen avatar for key moments, PiP layout during demos/tool-walkthroughs (established hybrid layout from prior planning).

## Brand consistency bar

- [ ] Tone matches Shima's defined personality and verbal tics — consistent across all four content categories, adjusted only in energy level, not in core voice.
- [ ] Visual identity (colors, lower-thirds, intro/outro treatment) is consistent across every platform export, not just the primary YouTube video.

## Platform-export quality bar

- [ ] Every derived asset (Shorts, Reels, TikTok, Telegram post) traces back to the same source video/script — no derived asset introduces a claim that wasn't in the original.
- [ ] Derived assets are re-cut/re-framed appropriately per platform, not a naive center-crop (per hybrid layout planning).

## Forbidden practices (hard rules, not judgment calls)

- Never present a source's phrasing as Shima's original words (D-004).
- Never fabricate a statistic, quote, or claim not present in Research's fact-list artifact.
- Never publish without passing through whatever review gate is currently defined in `09_QA/README.md` (Constitution Core Principle 5) — full autonomy is not yet in effect.
- Never alter `System/Shima_Persona.md`'s locked attributes (voice, core visual identity) without a founder-approved decision logged in `DECISIONS.md`.

## Self-review checklist template

Every engine's own documentation should eventually reference this file and add only what's specific to that engine — do not duplicate the checklist above inside each engine's README. Link to it instead: `See 01_Core/Quality_Standards.md for the general quality bar; the checks below are specific to this engine.`

## Cross-references
- Source discipline: `DECISIONS.md` D-004
- Persona consistency: `DECISIONS.md` D-007, `System/Shima_Persona.md`
- Review gate: `09_QA/README.md` (to be written), `OPEN_QUESTIONS.md` OQ-004
