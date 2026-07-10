# 10_Orchestrator
**Document ID:** `10_Orchestrator/README.md`
**Status:** Authoritative spec for the Orchestrator (Constitution §8) — coordination layer, not a pipeline stage
**Inherits from:** `01_Core/Architecture.md`, `00_System/DECISIONS.md` D-005, D-009, D-016

> Follows the standard agent structure locked in `DECISIONS.md` D-003, adapted for a coordination role rather than a content-producing one. As `01_Core/Architecture.md` states: this engine doesn't sit *in* the Research→QA sequence, it sits *above* it.

---

## Mission

Make the nine engines behave as one coherent pipeline instead of nine independently-invoked pieces: select the right category workflow, sequence engines in order, move artifacts between them as defined data (never freeform conversation), and route failures back to the correct owning engine. Long-term, expose this coordination as the command interface from `DECISIONS.md` D-009.

## Role

Coordination layer (`01_Core/Architecture.md`), not a stage with its own Research→QA position. Input: a trigger (a topic entering the pipeline via `02_Research`, or eventually a founder command). Output: a completed, published piece of content — Orchestrator doesn't produce content itself; it produces the sequencing that gets content produced.

## Responsibilities

- Select the category workflow variant (news/course/tool_review/tips) based on the `category` field already set by `03_IdeaEngine`'s content brief — Orchestrator routes on that decision, it doesn't re-make it.
- Sequence engine invocations in pipeline order, passing each engine's output artifact as the next engine's input, per `01_Core/Architecture.md`'s defined-artifact data-flow principle.
- Track pipeline state per piece of content (which stage currently owns it, what it's waiting on).
- On any engine's Failure Recovery trigger (a `09_QA` rejection, a `02_Research` "no viable topic," etc.), re-invoke the specific owning engine named in that failure and resume forward from there — never restart the whole pipeline from scratch.
- Hold, rather than force forward, any pipeline instance that hits a genuine dead end (e.g. Research finds nothing corroborated, Idea Engine has no viable brief).

## Knowledge Base

- `01_Core/Architecture.md` — the full pipeline map this engine sequences.
- `DECISIONS.md` D-005 — the category variants that drive workflow selection.
- `DECISIONS.md` D-009 — the future command-interface goal.
- `DECISIONS.md` D-016 — the QA-hold ordering this engine's sequencing must respect (it cannot advance a package past `09_QA` without sign-off).
- Every engine's own `README.md` § Output Format — the artifact schemas this engine passes between stages without altering.
- `OPEN_QUESTIONS.md` OQ-006 — whether the command interface is a v1 or later-phase goal.

## Decision Rules

- **Category is read from the brief, never re-decided by this engine.** If `03_IdeaEngine` tagged a brief `tool_review`, Orchestrator invokes the Tool Review workflow across `04_ScriptEngine` and downstream — it does not second-guess the categorization.
- **Artifacts pass as structured data only** — this engine enforces `01_Core/Architecture.md`'s data-flow principle mechanically: no engine-to-engine handoff happens as a summary or a conversation, only as the schema each engine's own README already defines.
- **On failure routing, resume from the rejected point, not from Research.** A `09_QA` rejection routed to `05_Production` (e.g. persona drift) re-invokes Production specifically; it does not re-run Research, Idea Engine, or Script Engine, which weren't at fault.
- **`08_Automation`'s Publish Execution step is never sequenced ahead of `09_QA` sign-off** (D-016) — Orchestrator's sequencing logic has no path that skips this.
- **🔶 Command-interface timing is open** (`OPEN_QUESTIONS.md` OQ-006). Until resolved, this engine's coordination role is executed via direct/manual invocation of each engine in sequence — not through a command layer. This file documents the coordination logic itself, which holds regardless of how it's eventually triggered.

## Workflows

1. **Trigger** — a piece of content enters the pipeline (typically via `02_Research` monitoring; eventually, possibly via a founder command per D-009/OQ-006).
2. **Category/Workflow Selection** — once `03_IdeaEngine` has produced a brief, read its `category` field and select the matching workflow path through `04_ScriptEngine` onward.
3. **Sequencing** — invoke each engine in pipeline order, passing artifacts per each engine's defined output schema.
4. **State Tracking** — maintain a pipeline-state record per piece of content (§ Output Format).
5. **Failure Routing** — on any Failure Recovery trigger from an engine, re-invoke the named owning engine and resume sequencing forward from that point.
6. **Completion** — mark the content complete once `08_Automation` reports `publish_status: published` for all its platform packages.

## Quality Standards

Inherits `01_Core/Quality_Standards.md`. Orchestrator-specific: no artifact handoff may bypass the sending engine's defined output schema — a handoff that isn't structured data is itself a defect in this engine's operation, independent of whether the content it carries is otherwise fine.

## Examples / Edge Cases

- **A News item needs none of the Course-specific steps:** handled naturally — Orchestrator only invokes the News variant of `04_ScriptEngine` (`News_Workflow.md`) for a News-tagged brief, never all four category workflows.
- **`09_QA` rejects a package for persona drift:** Orchestrator re-invokes `05_Production` specifically (per QA's `routed_to` field), not `04_ScriptEngine` — routing precision matters because re-running the wrong engine wastes the work the correct engines already did successfully.
- **Two pieces of content are in the pipeline at once:** Orchestrator tracks state independently per `content_brief_id` — every engine's artifact schema already carries enough of a reference for this to work without additional design.

## Failure Recovery

- **An engine hits a genuine dead end** (Research finds nothing corroborated, Idea Engine has no viable brief clearing its bar): Orchestrator holds that pipeline instance rather than forcing it forward — this mirrors each engine's own "return nothing rather than something weak" failure mode (`02_Research/README.md`, `03_IdeaEngine/README.md`).
- **No command interface exists yet (OQ-006):** triggering is manual today. This is a known, documented limitation, not a defect in this file's design — the sequencing logic is the same either way.

## Output Format

Pipeline-state record (not a content artifact — Orchestrator doesn't produce content):
```
- content_brief_id: <reference>
  category: news | course | tool_review | tips
  current_stage: research | idea | script | production | marketing | seo | automation | qa
  status: in_progress | held | published | failed
  history: [{ stage, timestamp, outcome }]
```

## Self-Review Checklist

- [ ] Category read from the brief, never re-decided independently.
- [ ] Every handoff passed as the sending engine's defined structured artifact, never a freeform summary.
- [ ] Failure routing re-invokes the specific named engine, not a full pipeline restart.
- [ ] `08_Automation` Publish Execution never sequenced ahead of `09_QA` sign-off.
- [ ] Pipeline state tracked independently per `content_brief_id`.

## KPIs

- Pipeline throughput (briefs entering vs. content published).
- Average time-in-pipeline per category.
- Failure-routing accuracy (does a rejection actually get re-invoked at the correct engine).

## Future Improvements

- The command interface itself (`DECISIONS.md` D-009), once `OPEN_QUESTIONS.md` OQ-006 resolves.
- Concurrency handling for multiple in-flight pieces of content, once publishing volume justifies the added complexity.

## Cross-references
- Full pipeline map this engine sequences: `01_Core/Architecture.md`
- Category variants driving workflow selection: `DECISIONS.md` D-005
- Command-interface goal and its open timing question: `DECISIONS.md` D-009, `OPEN_QUESTIONS.md` OQ-006
- QA-hold ordering this engine must respect: `DECISIONS.md` D-016
