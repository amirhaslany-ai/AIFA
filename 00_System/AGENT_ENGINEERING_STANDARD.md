# Agent Engineering Standard
**Document ID:** `00_System/AGENT_ENGINEERING_STANDARD.md`
**Owning decision:** `DECISIONS.md` D-003 (Locked)
**Referenced by:** every `02_Research` through `10_Orchestrator` engine README

> D-003 locked the requirement that every agent/engine document follow a standard structure. This file is the detail that decision pointed to: what each section means, why it's required, and how to write one well. It's written retroactively against the structure already applied consistently across all nine engine folders — this file documents the standard in use, not a new one.

---

## Why a standard structure

An agent defined ad hoc — some responsibilities here, a workflow there, no stated failure behavior — degrades quietly: gaps don't announce themselves until something breaks in production. A fixed structure forces every gap to be visible at authoring time: an engine with no Failure Recovery section is missing one, not silently fine. This is the same logic as D-002 applied at the section level instead of the file level.

## The twelve sections

### Mission
One short paragraph: what this agent exists to do, stated narrowly enough that it's obvious what's *not* its job. A mission that could describe three different engines is too vague — see, e.g., `02_Research/README.md`'s Mission, which explicitly states Research "never writes narrative" to draw the boundary against `04_ScriptEngine`.

### Role
Where this agent sits in the pipeline: its input artifact, its output artifact, and which engines produce/consume them. Always cross-references `01_Core/Architecture.md` rather than restating the pipeline map. If the engine has an ordering subtlety not obvious from the pipeline diagram (e.g. `08_Automation/README.md`'s clarification that it stages before `09_QA` but doesn't execute publish until QA signs off), state it here.

### Responsibilities
A concrete, action-oriented bullet list — each item should be checkable ("did the engine do this or not"), not aspirational language. This is the "what" list that the later Workflows section turns into "how, in order."

### Knowledge Base
What this agent reads: sibling detail files in its own folder, `01_Core` files it inherits from, other engines' output schemas it consumes, and any `OPEN_QUESTIONS.md`/`DECISIONS.md` entries that bound what it can currently do. Every item here should be a real file that exists — this section is a reading list, not a wishlist.

### Decision Rules
The specific, stated judgment calls this agent is trusted to make autonomously — written as concrete rules with a clear trigger and outcome, not vague principles. "Be careful with sources" is not a decision rule; "a claim needs ≥1 Tier 1/2 source or ≥2 Tier 3 sources to be included" (`02_Research/README.md`) is. This section is also where hard, non-negotiable constraints live (e.g. D-004's phrasing-proximity rule, D-008's no-raw-TTS rule) — restated as an operational rule for this specific engine, not just cited.

### Workflows
The actual step-by-step process, numbered, each step named and given one to two sentences on what it does and what it hands to the next step. If a workflow has category/platform variants, the shared README states the shared shape and references sibling files for the variant detail (`04_ScriptEngine/README.md` § Workflows → `News_Workflow.md` etc.) rather than inlining all variants and bloating the file.

### Quality Standards
Always inherits `01_Core/Quality_Standards.md` explicitly by reference — never restates its checklist. This section only adds what's genuinely specific to this engine (e.g. `04_ScriptEngine/README.md`'s addition about the `revision_log` field being evidence the Revision step happened). If an engine has nothing engine-specific to add, say so briefly rather than omitting the section.

### Examples / Edge Cases
Concrete, named scenarios — not generic advice — showing how the Decision Rules resolve a non-obvious situation. Each example should be resolvable by pointing back to a specific rule already stated earlier in the file; if an example requires a *new* rule to resolve, that rule belongs in Decision Rules, not invented ad hoc inside an example.

### Failure Recovery
What happens when something goes wrong, stated as explicit escalation paths: which engine does a problem route back to, and under what condition does the agent hold rather than force output forward. "Return nothing rather than something weak" is a recurring pattern across this repo's engines (`02_Research`, `03_IdeaEngine`) — deliberately, since a forced-through weak artifact costs every downstream engine more than an explicit hold does.

### Output Format
The literal schema of what this agent hands off — a defined artifact, per `01_Core/Architecture.md`'s data-flow principle, never "however the model feels like phrasing it that day." Written as a structured block (this repo uses a YAML-like plain-text shorthand throughout, not a strict formal schema — consistency of *shape*, not a particular serialization, is what matters).

### Self-Review Checklist
A checkbox list the agent runs before considering its own output done — should map closely to the Decision Rules and Quality Standards sections above; nothing new should appear here that wasn't already established earlier in the file.

### KPIs
Measurable signals of whether this agent is doing its job well over time, not per-item pass/fail (that's what Self-Review is for). Where a real metric doesn't exist yet (no analytics, no publish history), say so rather than inventing a fake precise number — several engine files in this repo note "once analytics exist" rather than fabricating a target.

### Future Improvements
Explicitly out-of-current-scope items — automation that doesn't exist yet, tooling blocked on an open question, refinements that need more real usage data first. Keeps the rest of the file honest about what's actually built today versus aspirational.

## What this standard deliberately does not require

- **A fixed length.** `07_SEO/README.md` (narrower scope) is shorter than `04_ScriptEngine/README.md` (highest-value engine) — the structure is the twelve sections, not a page count.
- **Every section to contain founder-confirmed specifics.** `System/Shima_Persona.md` and `05_Production`'s files show the pattern for handling this: document the section's *shape* and flag `🔶 NEEDS FOUNDER INPUT` rather than skip the section or invent a value.
- **A section to restate content owned elsewhere.** Nearly every file in this repo cross-references rather than duplicates (D-002) — the standard structure organizes *pointers* as much as it organizes original content.

## Cross-references
- Owning decision: `DECISIONS.md` D-003
- The file-scoping principle this section-level structure extends: `DECISIONS.md` D-002
- Applied throughout: `02_Research/README.md` through `10_Orchestrator/README.md`
