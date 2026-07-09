# AIFA — Open Questions
**Document ID:** 00_System/OPEN_QUESTIONS.md
**Referenced by:** `AIFA_CONSTITUTION.md` §9 (AI Handover Protocol)

> Anything unresolved goes here instead of being silently assumed. When a question is answered, move it to `DECISIONS.md` as a new entry and mark it Resolved here with a pointer to that entry.

---

### OQ-001 — Tool assignments for the multi-model pipeline (D-001)
The original proposal (Claude / ChatGPT / Gemini / Perplexity / ElevenLabs / Hedra-HeyGen / n8n) was never confirmed as the current plan.
**Needed:** Confirm or replace each assignment. Specifically: is ChatGPT still in the pipeline at all, given the entire documentation strategy moved to Claude? What is Gemini's role now versus Claude's own research capability?
**Blocks:** `02_Research/README.md`, `05_Production/README.md`, `08_Automation/README.md`.

### OQ-002 — Avatar & voice tooling
Prior conversations mention Hedra, HeyGen, Higgsfield (all connected as MCP tools in this environment), and ElevenLabs, without a final choice.
**Needed:** Which avatar tool is primary? Which voice tool? Is Persian-language voice quality/accent-naturalness confirmed acceptable in testing, or still a known problem (as stated in the original request)?
**Blocks:** `05_Production/README.md`, `System/Shima_Persona.md`.

### OQ-003 — Monthly tool budget
Referenced early on as a key question ("$50 / $150 / $300+ per month?") but never answered in the material reviewed.
**Needed:** A number, even a rough one — it changes which avatar/voice/automation tools are viable.
**Blocks:** `08_Automation/README.md`, `TOOL_SELECTION.md` (not yet created).

### OQ-004 — Human review checkpoint: how much, and where exactly
Constitution Core Principle 5 states full autonomy is not a v1 requirement, but the exact review gate (script only? final video only? both?) isn't defined.
**Needed:** Founder's preferred review point(s) before publish.
**Blocks:** `09_QA/README.md`.

### OQ-005 — Content cadence targets
`AIFA_CONSTITUTION.md` §6 has a cadence placeholder only for News (every 3 days); Tool Reviews, Courses, and Tips have no target cadence.
**Needed:** Realistic per-category output targets, ideally tied to a weekly total (e.g. "2 long-form + 10 shorts/week" was floated originally but never confirmed).
**Blocks:** `SUCCESS_METRICS.md` (not yet created), `10_Orchestrator/README.md`.

### OQ-006 — Command-interface timing (D-009)
The `/news`, `/course`, `/tool`, etc. slash-command model is Provisional — it assumes an orchestration layer that doesn't exist yet.
**Needed:** Is this a v1 goal or a later-phase goal? Affects how much to invest in `10_Orchestrator` now versus later.
**Blocks:** `10_Orchestrator/README.md`, `08_Automation/README.md`.

### OQ-007 — Multi-language expansion timing
Prior conversation raised English/Arabic as a possible future addition to Persian-only content.
**Needed:** Confirm this is out of scope for now (implied by everything reviewed being Persian-only) — or should the persona/script architecture be built language-agnostic from the start to avoid rework later?
**Blocks:** `04_ScriptEngine/README.md`, `System/Shima_Persona.md` (if voice/persona must support multiple languages, that's a different asset pipeline).

### OQ-008 — Relationship to the AIFA aggregator platform's timeline
Per `AIFA_CONSTITUTION.md` §2, Content Studio and the aggregator platform are separate workstreams. Is Content Studio meant to launch and run independently, or is it explicitly meant to bootstrap distribution for the platform's launch (i.e. is there a target date the platform needs Content Studio's audience by)?
**Needed:** Founder's intended sequencing between the two workstreams.
**Blocks:** Nothing directly in this repo yet, but affects how urgently `06_Marketing`/`07_SEO` should optimize for platform-launch traffic versus general brand-building.

---

## Resolved
*(none yet — resolved questions move here with a link to their DECISIONS.md entry)*
