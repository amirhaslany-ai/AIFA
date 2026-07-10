# Topic Selection
**Document ID:** `03_IdeaEngine/Topic_Selection.md`
**Referenced by:** `03_IdeaEngine/README.md` (Knowledge Base, Workflows step 2)

> How a Research fact-list becomes a short list of viable topic/angle candidates, before scoring (`Trend_Scoring.md`) narrows it to one.

## From facts to candidates

A single fact-list artifact often supports more than one possible video. Candidate generation means explicitly listing the distinct topic/angle combinations available, not defaulting to the first or most obvious one. For each fact-list entry (or cluster of related entries), ask:

1. **What's the most obvious angle?** (Usually the surface-level "what happened" framing — necessary to identify, rarely the strongest choice on its own.)
2. **What's the non-obvious angle?** (The implication, the "why this actually matters" reading, the contrarian read if the facts support one.) This is usually where the differentiation from generic AI-news channels (`01_Core/Vision.md`) actually happens.
3. **Does this fact set serve a category other than the one it was tagged?** (E.g. a News fact might be a better Tips item; a cluster of related facts might actually be Course material if there's a teachable skill underneath.)

## Filters applied before scoring

- **Audience fit** — does this serve a Persian-speaking AI learner trying to understand what's real vs. hype (`01_Core/Vision.md`)? A topic can be objectively "big news" and still be a poor fit if it has no relevance to that audience's actual decisions or understanding.
- **Effort-to-impact ratio** — a Course brief implies significantly more downstream production effort (full skill tree, exercises, quiz per D-005) than a Tips brief. A marginal topic isn't worth that investment; a strong topic might be worth it even if it's more work.
- **Factual sufficiency** — per `README.md` Decision Rules, does the candidate have a Tier 1/2 factual anchor? Candidates that fail this are noted but not advanced to scoring — they're either deferred to Research or dropped.

## Output of this step

A short list (typically 2–5) of candidate `{category, angle}` pairs, each with its supporting fact-list references, ready for `Trend_Scoring.md`. This is an intermediate artifact, not the final brief — only the winning candidate becomes a content brief per `README.md` § Output Format.

## Cross-references
- Scoring that narrows candidates to one: `Trend_Scoring.md`
- Hook direction assignment (happens after angle is chosen): `Hook_System.md`
- Saturation check against prior coverage: `Knowledge/README.md`, `README.md` § Decision Rules
