# News Script Workflow
**Document ID:** `04_ScriptEngine/News_Workflow.md`
**Owning decision:** `DECISIONS.md` D-014 (Provisional)
**Referenced by:** `04_ScriptEngine/README.md` (Workflows step 5)

> Applies the universal 9-step process in `README.md` to News briefs. This file owns the structural template only — the process steps themselves are not repeated here.

## Structural template

**Hook → What Happened → Why It Matters → Nuance/What's Next → CTA**

| Section | Job | Notes |
|---|---|---|
| **Hook** | Land the brief's `hook_direction` in 5–8 seconds | Usually Curiosity Gap or Bold/Contrarian Claim (`03_IdeaEngine/Hook_System.md`) |
| **What Happened** | The core fact(s), stated plainly and accurately | Pulled directly from the brief's `supporting_facts`; this section is the factual anchor of the whole script — get it right before adding interpretation |
| **Why It Matters** | The angle from the brief — the specific implication for the viewer | This is where the brief's angle (not just the topic) actually shows up; a News script that stops at "what happened" without this section is indistinguishable from a headline rewrite, which is exactly the failure mode `01_Core/Vision.md` positions against |
| **Nuance/What's Next** | Caveats, uncertainty, or what to watch for next | Keeps the script honest when the story is still developing — required whenever the underlying facts include a `confidence: medium` or `low` entry (`02_Research/README.md` Output Format) |
| **CTA** | Single ask | Typically: follow for the next update on this story, or a related video if one exists — not a generic "like and subscribe" |

## Category-specific notes

- **Recency sensitivity:** News scripts are the most time-sensitive category. If the Research/Extract Facts steps (README.md steps 1–2) surface a fact that's changed since the brief was created, escalate per README.md's Failure Recovery rather than writing around stale information.
- **Single-source claims:** if a `low`-confidence, single-source fact is the only thing available for "What Happened," the Nuance section must say so explicitly (e.g. "this hasn't been independently confirmed yet") rather than presenting it with the same certainty as a corroborated fact.
- **Vendor announcements:** when "What Happened" is itself a company's own announcement (e.g. a new model release), keep the factual description of the announcement separate from any evaluation of whether the claims hold up — evaluation belongs in "Why It Matters," clearly framed as analysis, not restated as fact.

## Cross-references
- Owning decision and rationale: `DECISIONS.md` D-014
- Universal process this structure plugs into: `README.md` § Workflows
- Upstream research shape (distinct from this script shape): `02_Research/Workflows.md` § News
