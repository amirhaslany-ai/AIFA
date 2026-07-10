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

## Next (in order)
- [ ] `10_Orchestrator/README.md` expansion — engine handoffs, workflow selection, future command interface (D-009)
- [ ] `03_IdeaEngine/README.md` expansion
- [ ] `04_ScriptEngine/README.md` expansion — per-category script workflows (news / course / tool-review / tips)
- [ ] `05_Production/README.md` expansion — avatar, voice (SSML), video assembly
- [ ] `06_Marketing/README.md`, `07_SEO/README.md` expansion
- [ ] `08_Automation/README.md` expansion — n8n / pipeline wiring
- [ ] `09_QA/README.md` expansion — human review gate, KPIs
- [ ] `10_Orchestrator/README.md` expansion — how engines hand off to each other
- [ ] `System/` files: Brand_Guidelines, Content_Principles, Marketing_Principles, Production_Standards, Quality_Standards, SEO_Principles, Token_Optimization
- [ ] `Knowledge/`, `Prompts/`, `Templates/`, `Assets/` README expansions

## Blocked / needs founder input before writing
- Success metrics targets (§6 of Constitution has placeholder cadences only)
- Budget for tools (avatar/voice/automation stack)
- Confirm persona name: "Shima" vs "Aifa" (see Constitution §2)
