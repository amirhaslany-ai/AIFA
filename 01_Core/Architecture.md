# Architecture
**Document ID:** 01_Core/Architecture.md
**Inherits from:** `00_System/AIFA_CONSTITUTION.md` §8, `00_System/DECISIONS.md` D-002, D-006

## System overview

AIFA Content Studio is an agent pipeline, not a single model call. Each stage below is owned by one repo folder, has one responsibility, and hands off a defined output to the next stage.

```
┌─────────────┐   ┌──────────────┐   ┌───────────────┐   ┌────────────┐
│ 02_Research │ → │ 03_IdeaEngine│ → │ 04_ScriptEngine│ → │05_Production│
└─────────────┘   └──────────────┘   └───────────────┘   └────────────┘
                                                                  │
      ┌──────────────────────────────────────────────────────────┘
      ▼
┌──────────────┐   ┌───────────┐   ┌──────────────┐   ┌────────┐
│ 06_Marketing │ → │  07_SEO   │ → │ 08_Automation │ → │ 09_QA  │
└──────────────┘   └───────────┘   └──────────────┘   └────────┘
                                                              │
                                                              ▼
                                                    ┌─────────────────┐
                                                    │ 10_Orchestrator │
                                                    │ (coordinates all │
                                                    │  of the above)   │
                                                    └─────────────────┘
```

`10_Orchestrator` is not a final pipeline stage — it's the coordination layer that decides which workflow variant runs (news/course/tool-review/tips, per D-005), sequences the other engines, and will eventually expose the command interface from D-009.

## Stage responsibilities

| Stage | Input | Output | Owning decision |
|---|---|---|---|
| Research | Raw sources (RSS, official docs, X, GitHub) | Verified, deduplicated, ranked facts | D-004, D-006 |
| Idea Engine | Ranked facts / trend signals | A scoped content brief (category + angle + hook direction) | — |
| Script Engine | Content brief | Final script in Shima's voice | D-005 |
| Production | Final script | Rendered video (avatar + voice + edit) | D-007, D-008 |
| Marketing | Rendered video | Platform-specific captions, hooks, cross-post assets | — |
| SEO | Video + marketing assets | Titles, descriptions, tags, chapters | — |
| Automation | All finished assets | Scheduled/published posts across platforms | D-009, OQ-001 |
| QA | Any stage output | Pass/fail + review notes | Constitution Core Principle 5 |
| Orchestrator | — | Coordinates all of the above; owns workflow selection | D-009 |

## Shared resources (not owned by one stage)

- `Knowledge/` — accumulated facts, prior scripts, source reliability ratings. Read by Research and Script Engine.
- `Assets/` — persona visual/voice assets, brand assets. Read by Production and Marketing.
- `Prompts/` — reusable prompt fragments referenced by multiple engines, so wording changes happen once, not per-engine.
- `Templates/` — output-format templates (script templates, caption templates, thumbnail templates).

## Tool layer (currently open — see OQ-001, OQ-002)

The architecture above is tool-agnostic by design: any stage can swap its underlying AI model or service without changing the pipeline shape, as long as it produces the same defined output. This is deliberate — see D-002 (small scoped files, easy to update in isolation) applied at the tool level, not just the documentation level. Do not hard-code a specific vendor's behavior into pipeline-shape documents like this one; vendor-specific detail belongs in the owning engine's own files (e.g. which avatar tool belongs in `05_Production`, not here).

## Data flow principle

Every handoff between stages is a **defined artifact**, not a conversation. E.g. Research does not "talk to" Script Engine — Research produces a structured fact-list artifact that Script Engine consumes according to its own rules. This is what makes the pipeline auditable: at any point you can inspect the artifact between two stages to find where a problem was introduced.

## Cross-references
- Per-category workflow variants: `DECISIONS.md` D-005
- Human review gate placement: `09_QA/README.md`
- Command/orchestration model: `DECISIONS.md` D-009, `OPEN_QUESTIONS.md` OQ-006
