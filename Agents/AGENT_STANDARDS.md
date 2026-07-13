# Agent Standards

| Field | Value |
|---|---|
| **Title** | Agent Standards |
| **Created** | 2026-07-13 |
| **Updated** | 2026-07-13 |
| **Owner** | AIFA_Brain maintainers |
| **Status** | Active |
| **Version** | 1.0 |
| **Dependencies** | `README.md` |
| **Related Docs** | `../00_System/DECISIONS.md` (D-003, D-006), `../00_System/AGENT_ENGINEERING_STANDARD.md`, `PROMPT_STANDARDS.md`, `KNOWLEDGE_ACCESS_RULES.md` |
| **Tags** | `agents, standards` |

## Summary

What every future agent definition must specify before it's considered ready to build, generalizing Content Studio's own D-003/`AGENT_ENGINEERING_STANDARD.md` structure (originally written for content-production agents) to any agent — including future Platform automation and cross-workstream orchestration agents. No agent currently exists against this standard; it exists so the first one that's built has a real bar to meet.

## The required sections (every agent definition needs all of these)

Directly adapted from D-003's twelve-section pattern:

1. **Mission** — the one-sentence reason this agent exists.
2. **Role** — where it sits relative to other agents and humans (upstream/downstream handoffs — see `AGENT_COMMUNICATION.md`).
3. **Responsibilities** — precisely what it does and, as importantly, what it explicitly does not do.
4. **Knowledge Base** — which parts of `AIFA_Brain/`, Content Studio, or Platform it reads from, scoped per `KNOWLEDGE_ACCESS_RULES.md`.
5. **Decision Rules** — how it decides between options when its task isn't fully deterministic.
6. **Workflows** — the actual step-by-step process it follows.
7. **Quality Standards** — how its output is judged acceptable, ideally tied to an existing standard (e.g. Content Studio's `01_Core/Quality_Standards.md`, Platform's own testing/review discipline) rather than a new one invented per-agent.
8. **Examples / Edge Cases** — worked examples, and known tricky inputs.
9. **Failure Recovery** — what happens when it fails partway, or produces output that fails a quality check.
10. **Output Format** — the exact shape of what it produces, machine-checkable where possible.
11. **Self-Review Checklist** — what the agent checks about its own output before handing it off.
12. **KPIs** — how its performance is measured over time.

Plus one addition beyond D-003's original set, specific to a multi-agent (not single-content-pipeline) context:

13. **Communication Contract** — which other agents or humans it hands off to/from, and in what format (see `AGENT_COMMUNICATION.md`) — not needed for a single isolated agent, but required the moment more than one agent exists, which is the whole premise of this framework.

## What this standard deliberately does not mandate

- A fixed document length, matching D-003's own explicit position (per `00_System/AGENT_ENGINEERING_STANDARD.md`).
- Any specific AI model or framework choice — this is a documentation standard for what an agent must specify, not an implementation technology choice.
- That every future agent be content-production-related — this generalizes D-006's agent-per-pipeline-stage pattern beyond Content Studio's ten engines to any future automation, including Platform's.

## Relationship to Content Studio's existing standard

`00_System/AGENT_ENGINEERING_STANDARD.md` remains the authoritative, detailed version for Content Studio's own ten engines specifically — this document does not replace it, it generalizes its pattern for agents that aren't part of that specific pipeline. If the two ever diverge in a way that matters, Content Studio's own agents follow its own standard; anything outside that pipeline follows this one.
