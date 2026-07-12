# ADR-0001: Platform lives at `Platform/`, separate from Content Studio

**Status:** Accepted
**Date:** 2026-07-12
**Related:** `00_System/DECISIONS.md` D-011 (Locked), D-020 (this decision)

## Context

The repository root (`00_System`, `01_Core`–`10_Orchestrator`, `System/`) governs **AIFA Content Studio**: a documentation-first architecture for a Persian-language AI-education/news content pipeline, hosted by the persona Shima. D-011 locked that this repo covers Content Studio only, and that the **AIFA aggregator platform** (a multi-model AI product) is a separate, related workstream, "not yet started in this repo."

That workstream is starting now: a monorepo software foundation (backend, frontend, database, API, AI provider abstraction, infra, CI/CD — architecture only, no business logic yet).

## Decision

The platform workstream lives at `Platform/`, a new top-level folder alongside (not inside) `01_Core`–`10_Orchestrator`. It has its own:
- Monorepo tooling, package boundaries, and dependency graph
- Architecture docs (`Platform/docs/architecture/`)
- ADR log (`Platform/docs/adr/`, this file is its first entry)
- README hierarchy

It does not import, restructure, or reference Content Studio's engine folders, and nothing in Content Studio changes as a result of its existence. Cross-reference only occurs where it's factually true (e.g., both workstreams are owned by the same founder and share the AIFA brand name) — never structurally.

## Alternatives considered

1. **Separate repository.** Cleanest long-term separation, avoids any risk of the two workstreams' governance rules bleeding into each other. Rejected for now because the founder chose to keep both under one repository root while the platform is still foundation-only; revisiting this is cheap later (a folder can be extracted to its own repo with history preserved via `git filter-repo` or a subtree split — this is not a one-way door).
2. **Merge into `01_Core`–`10_Orchestrator`.** Rejected — this would require formally superseding D-011 (Locked) and would violate `CLAUDE_MASTER_PROMPT.md` §3's scope-discipline rule. The two workstreams have different technical risk surfaces (D-011's rationale: sanctions-access exposure, billing, provider integrations apply to the platform, not Content Studio) and different audiences (engineers vs. content-pipeline documentation).

## Consequences

- Content Studio's `MAINTAINER_DIRECTIVE.md` process (read → audit → present → approve → one change → stop) governs the root-level docs. `Platform/` is free to use a different, faster-moving delivery cadence appropriate to software engineering (this ADR log, conventional commits, CI gates) — see `Platform/docs/architecture/00-overview.md`.
- Any future decision that would make `Platform/` need to move (e.g., extraction to its own repo, or a decision to abandon the aggregator platform) must be logged in `00_System/DECISIONS.md` as a superseding entry to D-020, not silently done.
- `00_System/OPEN_QUESTIONS.md` OQ-008 ("relationship to the AIFA aggregator platform's timeline") remains open — this ADR only fixes *where* the platform's code lives, not the sequencing question OQ-008 asks about.
