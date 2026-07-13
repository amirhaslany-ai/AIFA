# Shared Memory

| Field | Value |
|---|---|
| **Title** | Shared Memory |
| **Created** | 2026-07-13 |
| **Updated** | 2026-07-13 |
| **Owner** | AIFA_Brain maintainers |
| **Status** | Active |
| **Version** | 1.0 |
| **Dependencies** | `README.md`, `../AIFA_Brain/00_Index/NAVIGATION.md` |
| **Related Docs** | `KNOWLEDGE_ACCESS_RULES.md`, `AGENT_COMMUNICATION.md`, `../Knowledge/README.md` (Content Studio) |
| **Tags** | `agents, memory, knowledge` |

## Summary

How a future agent would read and write persistent knowledge — designed directly around `AIFA_Brain/`'s existing structure rather than inventing a separate memory store, so an agent's "memory" and a human's knowledge base are the same system, not two things that can drift apart.

## The core principle: `AIFA_Brain/` *is* the shared memory

There is no separate agent-memory database implied by this framework. `AIFA_Brain/`'s 17 sections, its metadata standard (`00_Index/METADATA_STANDARD.md`), and its `MASTER_INDEX.md` together are what a future agent would read from and write to. This is a deliberate choice: a memory system only humans can read, or only agents can read, inevitably drifts out of sync with the other; one system read/written by both stays honest by construction.

This mirrors, and is explicitly compatible with, Content Studio's own `Knowledge/README.md` — its "cross-content long-term memory" (prior published content log, source reliability history, correction log) is the same pattern already in production use for Content Studio specifically. `AIFA_Brain/` generalizes that pattern company-wide; it does not replace Content Studio's own `Knowledge/` folder, which keeps serving its existing, narrower purpose.

## What "reading shared memory" means for an agent

An agent's knowledge lookup is a scoped read against `AIFA_Brain/` (and, per `KNOWLEDGE_ACCESS_RULES.md`, potentially Content Studio's or Platform's own docs) — using `MASTER_INDEX.md` and tags (`00_Index/METADATA_STANDARD.md`) the same way a human would navigate, not a separate vector store or agent-only index maintained in parallel. If a future implementation adds a vector/embedding index for faster agent retrieval, that index should be a derived, rebuildable cache of `AIFA_Brain/`'s actual files — never the source of truth itself, and never allowed to diverge from what a human reading the same files would see.

## What "writing to shared memory" means for an agent

An agent producing a document that belongs in `AIFA_Brain/` writes it following the same rules a human would: the metadata block (`00_Index/METADATA_STANDARD.md`), the right folder (`00_Index/NAVIGATION.md`), an update to `MASTER_INDEX.md`, and — critically — the same "never fabricate to fill a gap" discipline `AIFA_Brain/README.md`'s update rules already establish for humans. An agent is held to the identical honesty standard, not a looser one because it's automated.

## Memory scope boundaries

- An agent's shared-memory access respects the same D-011/D-021 workstream boundaries a human contributor respects (detailed in `KNOWLEDGE_ACCESS_RULES.md`) — an agent working on a Content-Studio task doesn't silently rewrite Platform's architecture docs, and vice versa.
- Memory writes that constitute a real decision (not just a note) still go through `12_Decisions/`'s logs — an agent doesn't get to make a business or architecture decision "in memory" without it being visible in the same decision log a human decision would be.

## What this document does not yet define

- A conflict-resolution rule for two agents (or an agent and a human) writing to the same document concurrently — git's own merge/conflict mechanics are the fallback until a real need for something more sophisticated is demonstrated.
- Any caching/performance layer — deliberately deferred until a real agent implementation shows it's needed, per this whole framework's "design ahead of, not instead of, a real need" principle.
