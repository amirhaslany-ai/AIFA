# 01_Core

**Purpose:** Foundational reference material that every other engine (`02_Research` through `10_Orchestrator`) reads before doing anything else. This folder does not produce content — it defines the rules everything else operates under.

## Files in this folder

| File | Purpose |
|---|---|
| `Vision.md` | Why AIFA Content Studio exists, market context, and what winning looks like at 1/3/5 years |
| `Architecture.md` | Full system architecture — agent pipeline, data flow, folder-to-function mapping |
| `Decision_Framework.md` | How decisions get made, logged, and escalated — the meta-rules behind `DECISIONS.md` |
| `Quality_Standards.md` | What "good" means for scripts, video, and brand consistency — the bar every output is checked against |

## Relationship to other documents
- Everything here inherits from `00_System/AIFA_CONSTITUTION.md`. If anything here appears to conflict with the Constitution, the Constitution wins — flag the conflict in `00_System/DECISIONS.md` rather than resolving it silently.
- `Quality_Standards.md` here is the *general* standard. Engine-specific quality bars (e.g. SEO quality, thumbnail quality) live in their own engine folders and reference this file rather than duplicate it.
