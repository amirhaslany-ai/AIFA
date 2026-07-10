# Avatar Pipeline
**Document ID:** `05_Production/Avatar_Pipeline.md`
**Referenced by:** `05_Production/README.md` (Knowledge Base, Workflows step 7)

> Documents the pipeline *shape* only — tool-agnostic per `01_Core/Architecture.md`. Vendor selection is blocked on `OPEN_QUESTIONS.md` OQ-002 and OQ-003; this file does not name or assume a specific tool.

## Pipeline shape

1. **Persona Spec Input** — `System/Shima_Persona.md` §3 (character design), §6 (gestures/expressions), §7 (wardrobe), §8 (backgrounds), §9 (lighting), §10 (camera angles). **All currently `🔶 NEEDS FOUNDER INPUT`** — this pipeline cannot produce a real render until at least a base appearance exists.
2. **Asset/Model Configuration** — one-time (or infrequently-updated) setup of the chosen avatar tool with the persona spec: base appearance, default wardrobe, default background/lighting/camera setup. This step happens once per persona-spec version, not per video.
3. **Per-Script Performance Generation** — for each video, the avatar tool is driven by the script's emotion tags and layout segments (`05_Production/README.md` § Workflows steps 4, 8) to produce the actual performance: which gesture/expression at which line, full-screen vs. PiP framing per segment.
4. **Render** — output the avatar video segments for assembly.
5. **Persona-Consistency Check** — before handoff to `Video_Assembly.md`, the render is checked against the current persona-spec version (once one exists) for appearance/gesture drift.

## Why configuration is separated from per-video generation

Step 2 (configuration) happening once and step 3 (performance) happening per-video is what keeps visual consistency enforceable — if every video re-derived the avatar's appearance from scratch, drift would be the default outcome rather than an exception. This mirrors the "defined artifact between stages" principle in `01_Core/Architecture.md`: the persona-spec-to-asset-config step produces a stable artifact that every subsequent render reuses.

## 🔶 Open gaps blocking this pipeline

- No base appearance defined (`System/Shima_Persona.md` §3) — the single highest-priority gap.
- No gesture/expression set defined (§6) — without it, step 3 has no vocabulary to select from.
- No avatar tool selected (`OPEN_QUESTIONS.md` OQ-002) — step 2 cannot begin.
- No budget confirmed (OQ-003) — affects which tools are even viable candidates.

Until these resolve, this pipeline exists as a specification for what needs to happen, not a running process.

## Cross-references
- Owning persona sections: `System/Shima_Persona.md` §3, §6, §7, §8, §9, §10
- Where avatar segments get combined with voice and layout: `Video_Assembly.md`
- Blocking open questions: `OPEN_QUESTIONS.md` OQ-002, OQ-003
