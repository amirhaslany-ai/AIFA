# Agent Communication

| Field | Value |
|---|---|
| **Title** | Agent Communication |
| **Created** | 2026-07-13 |
| **Updated** | 2026-07-13 |
| **Owner** | AIFA_Brain maintainers |
| **Status** | Active |
| **Version** | 1.0 |
| **Dependencies** | `README.md`, `AGENT_STANDARDS.md` |
| **Related Docs** | `SHARED_MEMORY.md`, `../00_System/DECISIONS.md` (D-006) |
| **Tags** | `agents, communication, handoffs` |

## Summary

How future agents would hand work to each other and to humans — the framework Content Studio's D-006 pipeline (News/Idea Sources → Research → Topic Ranking → Script Writer → Reviewer → Avatar Generator → Voice Generator → Video Editor → Shorts Generator → Thumbnail → SEO → Publisher) already implies but has never had to formalize, since it's currently executed by documentation-guided human/AI collaboration rather than autonomous agent-to-agent handoff.

## Handoff principles

1. **Every handoff is an artifact, not a conversation.** An agent finishing its stage produces a defined output (per `AGENT_STANDARDS.md`'s Output Format section) that the next stage consumes — not a free-form message the next agent has to interpret. This mirrors Content Studio's own pipeline, where each engine folder's workflow docs define concrete artifacts (a fact-list, a script draft, a QA verdict) passed stage to stage.
2. **A handoff includes provenance.** The receiving agent (or human) should be able to trace an artifact back to what produced it and when — directly enabling `12_Decisions/`-style accountability and `13_Learnings/`-style postmortems if something goes wrong downstream.
3. **Failure propagates explicitly, never silently.** If a stage fails or produces low-confidence output, the handoff artifact says so — the next stage (or a human) decides whether to proceed, retry, or halt, rather than an agent silently passing along something it isn't confident in. This mirrors D-016/D-017's QA-gate discipline (a publish hold until sign-off) generalized beyond content publishing.
4. **Human-in-the-loop checkpoints are first-class, not an afterthought.** Content Studio's D-016 (`00_System/DECISIONS.md`) already establishes that automation stages/queues but holds for QA sign-off before publish — any future agent pipeline (Content Studio's own eventual automation, or a new one) should treat a human checkpoint as a normal handoff target, not a special case bolted on later.

## What a handoff artifact should carry (minimum)

- What produced it (which agent, what version/config).
- When it was produced.
- What it is (matches one of `AGENT_STANDARDS.md`'s defined Output Formats).
- A confidence/status signal (complete and confident / complete but flagged / failed).
- A link back to its inputs, for traceability.

## Agent-to-agent vs. agent-to-human handoffs

- **Agent-to-agent**: the receiving agent should be able to consume the artifact without needing to ask a clarifying question — if it can't, the sending agent's Output Format (per `AGENT_STANDARDS.md`) is underspecified, and that's a standards gap to fix, not a one-off exception to work around.
- **Agent-to-human**: should surface exactly what a human needs to decide, not the agent's full working state — the same "the artifact is the interface" principle, adjusted for a human reader rather than a downstream agent.

## What this document does not yet define

- A concrete message format/protocol (JSON schema, event bus, etc.) — that's an implementation choice for whenever the first real multi-agent system is actually built, not something to guess at ahead of a real need.
- Real-time/synchronous agent coordination — everything above assumes asynchronous, artifact-based handoff, matching how Content Studio's pipeline already works; if a future need requires synchronous coordination, that's a real design extension, not an assumption already baked in here.
