# AIFA — Documentation Build TODO

Tracks the incremental build-out of the Content Studio documentation repository. One file (or tightly related small group) is completed per session before moving to the next. Do not skip ahead or regenerate completed files without a logged reason in `CHANGELOG.md`.

## Done
- [x] `00_System/AIFA_CONSTITUTION.md` — v0.1 foundational governance document
- [x] `00_System/DECISIONS.md` — D-001 through D-012 logged
- [x] `00_System/OPEN_QUESTIONS.md` — OQ-001 through OQ-008 logged
- [x] `01_Core/README.md`, `Vision.md`, `Architecture.md`, `Decision_Framework.md`, `Quality_Standards.md`
- [x] `00_System/CLAUDE_MASTER_PROMPT.md` — operating instructions for any AI model working in this repo
- [x] `System/Shima_Persona.md` — character bible skeleton; most sections flagged 🔶 NEEDS FOUNDER INPUT (see OQ-002, OQ-007, OQ-009)
- [x] `02_Research/README.md`, `Methodology.md`, `Source_Reliability.md`, `Workflows.md`
- [x] `03_IdeaEngine/README.md`, `Topic_Selection.md`, `Viral_Psychology.md`, `Hook_System.md`, `Trend_Scoring.md`
- [x] `04_ScriptEngine/README.md`, `News_Workflow.md`, `Course_Workflow.md`, `ToolReview_Workflow.md`, `Tips_Workflow.md`
- [x] `05_Production/README.md`, `Avatar_Pipeline.md`, `Voice_SSML_Pipeline.md`, `Video_Assembly.md` — most content gapped 🔶 pending OQ-002/OQ-003
- [x] `06_Marketing/README.md`, `Platform_Derivation.md`
- [x] `07_SEO/README.md`
- [x] `08_Automation/README.md` — pipeline shape only; blocked on OQ-001/OQ-003; adds D-016 (QA-hold ordering)
- [x] `09_QA/README.md` — review gate + hallucination prevention; scope of gate flagged 🔶 pending OQ-004 (D-017 fixes minimum gate content)
- [x] `10_Orchestrator/README.md` — engine handoffs, workflow selection, future command interface (D-009); all 10 engine folders (01_Core–10_Orchestrator) now complete
- [x] `System/` files: `Brand_Guidelines.md` (🔶 no logo/colors ever specified), `Content_Principles.md`, `Marketing_Principles.md`, `Production_Standards.md` (D-019), `Quality_Standards.md` (technical/deliverable axis, distinct from `01_Core/Quality_Standards.md`), `SEO_Principles.md`, `Token_Optimization.md`. Also: D-018 assigns thumbnail ownership to `07_SEO` (gap found while writing `SEO_Principles.md`).
- [x] `Knowledge/`, `Prompts/`, `Templates/`, `Assets/` README expansions
- [x] `00_System/AGENT_ENGINEERING_STANDARD.md` and `00_System/CONTENT_PRODUCTION_WORKFLOW.md`

## Next (in order)
*(none — full documentation build-out per the original TODO queue is complete; remaining work is founder input on open 🔶 gaps — see `OPEN_QUESTIONS.md` — and any future refinement)*

## Blocked / needs founder input before writing
- Success metrics / cadence targets (`OPEN_QUESTIONS.md` OQ-005; §6 of the Constitution has a placeholder for News only)
- Budget for tools — avatar/voice/automation stack (OQ-003)
- Avatar & voice tooling selection, Persian voice-naturalness validation (OQ-002)
- Shima's visual identity, verbal tics, formality register (`System/Shima_Persona.md` — multiple 🔶 sections)
- Brand visual identity — logo, palette, typography (`System/Brand_Guidelines.md` — 🔶)
- AI-disclosure framing (OQ-009)
- Persona name "Shima" — Provisional per D-012, not yet explicitly Locked
- Review-gate exact scope (OQ-004 — D-016/D-017 fix a minimum, but don't resolve whether additional earlier gates are wanted)
- Command-interface timing (OQ-006), multi-language timing (OQ-007), tool assignments (OQ-001), platform-sequencing relative to the aggregator platform (OQ-008)
