# Video Assembly
**Document ID:** `05_Production/Video_Assembly.md`
**Owning decisions:** `01_Core/Quality_Standards.md` (hybrid layout rule), `DECISIONS.md` D-015 (captions)
**Referenced by:** `05_Production/README.md` (Knowledge Base, Workflows step 8)

## The hybrid layout rule

Per `01_Core/Quality_Standards.md`: full-screen avatar for key moments, picture-in-picture (PiP) during demos/tool-walkthroughs. This file maps that rule onto each category's structural sections (`04_ScriptEngine`'s workflow files) so layout selection is a mechanical lookup, not a per-video judgment call.

## Section-to-layout mapping

| Category | Section | Layout | Why |
|---|---|---|---|
| News | Hook, What Happened, Why It Matters, Nuance/What's Next, CTA | Full-screen (default) | No on-screen material to show unless a source graphic/screenshot is referenced — if one is, that moment switches to PiP for its duration |
| Course | Skill Tree, Prerequisites | Full-screen | Orientation, direct address |
| Course | Lessons, Exercises | PiP when demonstrating a tool/UI; full-screen when explaining a concept with no visual aid | Mixed — decided per lesson, not per whole section |
| Course | Quiz, Summary, CTA | Full-screen | Direct address |
| Tool Review | Problem, Tool, Conclusion | Full-screen | Narrative/verdict framing |
| Tool Review | Features, Demo, Comparison, Pricing, Alternatives | PiP | These sections exist specifically to show something |
| Tips | Hook, Problem/Context, CTA | Full-screen | Direct address |
| Tips | The Tip, Quick Proof/Demo | PiP when the tip involves an on-screen action; full-screen if it's purely verbal | Mixed, same logic as Course Lessons |

## Assembly steps

1. **Sync avatar and voice** — the rendered avatar performance (`Avatar_Pipeline.md`) and generated audio (`Voice_SSML_Pipeline.md`) are combined first, before layout work begins.
2. **Apply layout per segment** — using the mapping above and the script's own section tags (carried through from `04_ScriptEngine`'s output artifact), switch between full-screen and PiP at section boundaries.
3. **Sync PiP content** — for any PiP segment, the secondary content (screen capture, comparison graphic, source screenshot) must be time-synced to the avatar's spoken reference to it — not just placed adjacent for the segment's duration.
4. **Captions** — burn in or attach Persian captions for the full video (D-015).
5. **Brand elements** — lower-thirds, intro/outro treatment. `🔶` Blocked pending the visual-identity gaps in `System/Brand_Guidelines.md` (logo/palette/typography still 🔶) and `System/Shima_Persona.md`.
6. **Export** — primary export is the long-form YouTube video (Constitution §7); platform-specific derivations happen in `06_Marketing`, not here — this engine produces one source-of-truth asset, not multiple platform cuts.

## 🔶 Open gaps

- Brand visual elements (lower-thirds, intro/outro) depend on `System/Brand_Guidelines.md`, which is still a stub (see `TODO.md`).
- Persona visual gaps (`System/Shima_Persona.md` §3, §7–10) affect how the avatar actually looks within any layout, independent of the layout logic itself.

## Cross-references
- Hybrid layout rule: `01_Core/Quality_Standards.md`
- Captions default: `DECISIONS.md` D-015
- Section structures being mapped: `04_ScriptEngine/News_Workflow.md`, `Course_Workflow.md`, `ToolReview_Workflow.md`, `Tips_Workflow.md`
- Where this output goes next: `06_Marketing/README.md` (platform-specific derivation)
