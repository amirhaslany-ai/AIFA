# Prompt Standards

| Field | Value |
|---|---|
| **Title** | Prompt Standards |
| **Created** | 2026-07-13 |
| **Updated** | 2026-07-13 |
| **Owner** | AIFA_Brain maintainers |
| **Status** | Active |
| **Version** | 1.0 |
| **Dependencies** | `README.md`, `AGENT_STANDARDS.md` |
| **Related Docs** | `../Prompts/README.md` (Content Studio), `../00_System/CLAUDE_MASTER_PROMPT.md`, `../00_System/CONTENT_PRODUCTION_WORKFLOW.md` |
| **Tags** | `agents, prompts, standards` |

## Summary

Conventions for how a future agent's instructions/prompts would be written, versioned, and kept from silently drifting out of sync with the standards they're supposed to implement — generalizing the discipline already visible in Content Studio's own `Prompts/` folder and `00_System/CLAUDE_MASTER_PROMPT.md` beyond content-production prompts specifically.

## Principles

1. **A prompt is a versioned artifact, not a one-off message.** Every agent prompt lives as a file (following `AIFA_Brain/00_Index/METADATA_STANDARD.md`'s metadata block where the prompt is substantial enough to warrant one), with a version number that changes when the prompt's behavior-affecting content changes — not just when wording is polished.
2. **A prompt references its standards, it doesn't restate them inline.** If an agent's prompt needs to enforce `AGENT_STANDARDS.md`'s twelve-section output requirement, or `KNOWLEDGE_ACCESS_RULES.md`'s boundaries, the prompt links/points to those documents as the source of truth rather than copy-pasting them — so a standards update doesn't require hunting down every prompt that quoted the old version.
3. **A prompt states its failure mode.** What should the agent do when it's uncertain, when its input is malformed, or when it can't complete its task — explicitly, not left implicit. This mirrors `AGENT_STANDARDS.md`'s "Failure Recovery" section; a prompt without this is an incomplete agent definition, not just a terse one.
4. **Prompts are tested against real edge cases before being trusted**, the same "verify, don't assume" discipline this whole repository already practices (see e.g. Platform's engineering discipline of live-verifying claims rather than trusting them by inspection alone). A prompt that "looks right" is not the same as a prompt that's been run against its documented edge cases.

## Prompt document structure (suggested, not mandatory beyond the metadata block)

```
# {Agent Name} — Prompt

{metadata block}

## Role
{one paragraph — what this agent is, tied to its AGENT_STANDARDS.md definition}

## Instructions
{the actual prompt content}

## Input format
{what this prompt expects to receive}

## Output format
{must match the agent's AGENT_STANDARDS.md Output Format section exactly}

## Known limitations
{honest, current — not aspirational}
```

## Relationship to existing prompt material

Content Studio's `Prompts/README.md` and `00_System/CLAUDE_MASTER_PROMPT.md` already contain real, in-use prompt material and operating instructions for Content Studio specifically — this document does not replace or restate them. Any future Content-Studio-specific agent prompt should still live under Content Studio's own structure and follow its own established conventions; this document's standards apply to agents that don't already have a more specific home, and should not be read as inviting a duplicate, competing prompt library for work Content Studio's `Prompts/` folder already owns.

## What this document does not yet define

Model-specific prompt-engineering techniques (few-shot examples, chain-of-thought scaffolding, etc.) — those are implementation detail for whichever model a future agent actually uses, not a cross-cutting standard to fix ahead of time.
