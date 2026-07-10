# Token Optimization
**Document ID:** `System/Token_Optimization.md`
**Referenced by:** `00_System/CLAUDE_MASTER_PROMPT.md`

> Unlike the other `System/` files, this one isn't about content — it's operational guidance for the AI models running this pipeline, on keeping context/token usage efficient without sacrificing the quality bar defined elsewhere.

## Why this matters here specifically

The repository's core architectural bet (`DECISIONS.md` D-002: small, scoped files over large generalist prompts) is itself a token-optimization strategy — a model working `04_ScriptEngine`'s News workflow only needs to load `04_ScriptEngine/README.md` and `04_ScriptEngine/News_Workflow.md`, not all nine engines' full detail. This file states the practices that keep that architecture actually efficient in use, not just in theory.

## Practices

- **Load only what the active task needs.** Per `00_System/CLAUDE_MASTER_PROMPT.md`'s read order, the full orientation read (Constitution, Decisions, Open Questions, Core, persona) happens once per session — subsequent work within that session references specific files by path rather than re-reading the whole repo.
- **Pass structured artifacts, not full context, between engines.** This is already `01_Core/Architecture.md`'s data-flow principle for a different reason (auditability) — it has the side effect of keeping each engine's actual working context small: `04_ScriptEngine` needs `03_IdeaEngine`'s brief and the specific referenced fact-list entries, not `02_Research`'s entire fact-list history.
- **Don't re-derive what's already decided.** Re-reading `DECISIONS.md` in full at the start of a session is correct; re-litigating a Locked decision's reasoning mid-task because it wasn't cached in context is wasted effort — cite it by ID (e.g. "per D-004") instead of restating its rationale.
- **Keep fact-lists and briefs dense, not exhaustive.** `02_Research/README.md`'s deduplication step and `04_ScriptEngine/README.md`'s Extract Facts step (selecting which facts actually appear, not all available ones) both exist partly for output quality and partly because a bloated artifact costs every downstream engine more context to process.

## What this file does not cover

Model/vendor selection for cost reasons is a budget question, not a token-optimization-practice question — see `OPEN_QUESTIONS.md` OQ-003.

## Cross-references
- The architectural principle this file operationalizes: `DECISIONS.md` D-002
- Read order this applies to: `00_System/CLAUDE_MASTER_PROMPT.md`
- Artifact-passing principle: `01_Core/Architecture.md`
