# Agents

| Field | Value |
|---|---|
| **Title** | Agents — README |
| **Created** | 2026-07-13 |
| **Updated** | 2026-07-13 |
| **Owner** | AIFA_Brain maintainers |
| **Status** | Active |
| **Version** | 1.0 |
| **Dependencies** | none |
| **Related Docs** | `../AIFA_Brain/README.md`, `AGENT_STANDARDS.md`, `AGENT_COMMUNICATION.md`, `SHARED_MEMORY.md`, `PROMPT_STANDARDS.md`, `KNOWLEDGE_ACCESS_RULES.md` |
| **Tags** | `agents, framework, future` |

## What this is — and what it explicitly is not

**This is a framework, not an implementation.** No AI agent is built, configured, or run against this folder. Every document here defines *how a future agent would work* — its standards, how it would talk to other agents, how it would use shared memory, how its prompts would be structured, and what it would be allowed to read or write — so that when agents are actually built (for Content Studio automation, for Platform's own tooling, for cross-workstream orchestration, or for MCP servers), they have a coherent, already-thought-through place to plug into, rather than each being designed from scratch with incompatible conventions.

This mirrors Content Studio's own D-009 (`00_System/DECISIONS.md`) — a command-based/agent-driven operating model was already identified as a long-term goal there, marked Provisional specifically because it depends on automation/orchestration layers that don't exist yet. `Agents/` is the company-wide version of that same "designed ahead of, not instead of, implementation" discipline.

## Why this exists now, before any agent does

Two systems already imply agents will eventually exist: Content Studio's ten-engine pipeline (`01_Core/` through `10_Orchestrator/`) is explicitly agent-per-stage (D-006), and `AIFA_Brain/` itself was designed (per `00_System/DECISIONS.md` D-021) so that "Claude Code can continuously update it" — i.e., an AI agent reading/writing this knowledge base is already the intended future user, not a hypothetical one. Defining the rules now, honestly and without pretending an agent exists yet, means the eventual first real agent doesn't have to reverse-engineer conventions from inconsistent examples.

## What's here

| Doc | Covers |
|---|---|
| [`AGENT_STANDARDS.md`](AGENT_STANDARDS.md) | What every future agent definition must specify — mirrors Content Studio's own D-003 standard structure, generalized beyond content-production agents. |
| [`AGENT_COMMUNICATION.md`](AGENT_COMMUNICATION.md) | How agents would hand off work to each other and to humans. |
| [`SHARED_MEMORY.md`](SHARED_MEMORY.md) | How agents would read and write persistent knowledge — directly tied to `AIFA_Brain/`'s structure. |
| [`PROMPT_STANDARDS.md`](PROMPT_STANDARDS.md) | Conventions for how agent prompts/instructions would be written and versioned. |
| [`KNOWLEDGE_ACCESS_RULES.md`](KNOWLEDGE_ACCESS_RULES.md) | What an agent may read, write, and never touch — including the same D-011/D-021 workstream-separation boundaries that govern human contributors. |

## Update rules

- No document here should describe a specific agent's implementation — that's a future, separate deliverable, built against this framework, not inside it.
- If Content Studio's own future agent work (its ten engines eventually becoming real automated agents, per D-006/D-009) or Platform's own future automation reveals this framework is wrong in some way, fix the framework here rather than letting each concrete agent invent its own incompatible convention.
- Future MCP servers, when built, should be documented as a specific *implementation* of this framework's `KNOWLEDGE_ACCESS_RULES.md` and `AGENT_COMMUNICATION.md`, not a parallel, undocumented access path into `AIFA_Brain/` or either workstream.

## Ownership

AIFA_Brain maintainers, until an actual agent-engineering function exists.

## Relationships

- **`AIFA_Brain/`** — the knowledge base this framework's `SHARED_MEMORY.md` and `KNOWLEDGE_ACCESS_RULES.md` are designed around.
- **`00_System/DECISIONS.md` D-003, D-006, D-009** — Content Studio's own prior agent-related decisions, which this framework generalizes rather than contradicts.
- **`00_System/AGENT_ENGINEERING_STANDARD.md`** — Content Studio's existing agent-document standard, the direct precedent `AGENT_STANDARDS.md` draws from.
