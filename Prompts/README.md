# Prompts
**Document ID:** `Prompts/README.md`
**Referenced by:** all engine folders (shared resource, `01_Core/Architecture.md`)

> Distinct from each engine's own `README.md`: an engine README defines *process and rules* (what steps happen, what's allowed and forbidden). This folder holds the actual reusable prompt *fragments* — wording an AI model would be given to execute a specific recurring step — so that wording changes happen once here, not separately inside every engine that needs it.

## Purpose

Prevent the same instruction from being independently (and inconsistently) reworded across multiple engines. If `02_Research` and `04_ScriptEngine` both need to instruct a model "extract the fact, don't restate the source's phrasing" (D-004), that instruction is written once here and referenced by both, rather than drifting into two slightly different versions over time.

## What belongs here

- Cross-engine instruction fragments: D-004 fact-extraction-not-phrasing, D-003's standard-structure reminder, quality-checklist invocation fragments used at every engine's Self-Review step.
- Persona-voice-application fragments — reused wherever a model needs to write or adapt something in Shima's voice.

## What does not belong here

- Category-specific script instructions (those are `04_ScriptEngine`'s workflow files, not reusable fragments — News/Course/Tool Review/Tips instructions are each used by exactly one workflow, so there's no duplication risk to solve by extracting them here).
- Anything that would need to restate an engine's Decision Rules rather than just invoke them — link to the engine file instead of copying its logic into a prompt fragment.

## 🔶 Open dependency

Any fragment that invokes Shima's tone (persona-voice-application fragments above) can currently only draw on the provisional tone framework in `System/Shima_Persona.md` §2 — verbal tics and formality register remain `🔶 NEEDS FOUNDER INPUT`. A fragment written today must not invent those specifics; it should reference the provisional framework explicitly, the same constraint `04_ScriptEngine/README.md` § Decision Rules already places on script-writing itself.

## Versioning note

Where a fragment depends on a **Provisional** decision (`DECISIONS.md`), note the decision ID in the fragment so it can be found and updated when that decision resolves or is superseded — an orphaned fragment built on a since-changed Provisional decision is a silent-drift risk.

## Cross-references
- The rule this folder exists to keep consistent: `DECISIONS.md` D-002 (small scoped files over duplicated wording)
- Fact-extraction fragment source: `DECISIONS.md` D-004
- Tone fragment constraint: `System/Shima_Persona.md` §2, `04_ScriptEngine/README.md` § Decision Rules
