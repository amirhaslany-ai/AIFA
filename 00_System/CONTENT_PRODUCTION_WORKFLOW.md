# Content Production Workflow
**Document ID:** `00_System/CONTENT_PRODUCTION_WORKFLOW.md`
**Referenced by:** `00_System/CLAUDE_MASTER_PROMPT.md`

> Distinct from `01_Core/Architecture.md`: that file is the structural map (stages, inputs/outputs, owning decisions). This file is the concrete, end-to-end walkthrough — what actually happens, in order, artifact by artifact, for one real piece of content moving from trigger to publish. Read `01_Core/Architecture.md` first if the pipeline shape itself is unfamiliar; read this file for how it plays out in practice.

---

## The full sequence

| # | Stage | One-line job |
|---|---|---|
| 1 | `02_Research` | Turn raw sources into a verified, deduplicated, ranked fact-list |
| 2 | `03_IdeaEngine` | Turn the fact-list into one scoped content brief (category + angle + hook direction) |
| 3 | `04_ScriptEngine` | Turn the brief into a final script via the mandatory 9-step process |
| 4 | `05_Production` | Turn the script into a rendered video (SSML voice pipeline + avatar + hybrid layout) |
| 5 | `06_Marketing` | Derive platform-specific clips/captions from the rendered video |
| 6 | `07_SEO` | Produce titles, descriptions, tags, chapters, and the thumbnail |
| 7 | `08_Automation` | Assemble and schedule publish packages per platform |
| 8 | `09_QA` | Independently verify the assembled package; gate the actual publish |
| 9 | `08_Automation` (resumed) | Execute publish once `09_QA` approves (D-016) |
| — | `10_Orchestrator` | Coordinates all of the above; not a stage with its own position |

## Worked walkthrough: a News item, trigger to publish

1. **Trigger.** `02_Research`'s News workflow (`02_Research/Workflows.md` § News) picks up a new development from its Tier 1 source monitoring.
2. **Research.** The story is corroborated, facts extracted, deduplicated against other outlets covering the same story, and ranked. Output: a fact-list artifact (`02_Research/README.md` § Output Format) with `category_tags: [news]`.
3. **Idea Engine.** `03_IdeaEngine` ingests the fact-list, generates candidate angles (`Topic_Selection.md`), scores them (`Trend_Scoring.md`), runs the mandatory saturation check against `Knowledge/`, and picks a hook direction (`Hook_System.md`). Output: a content brief (`03_IdeaEngine/README.md` § Output Format) with `category: news`.
4. **Script Engine.** `04_ScriptEngine` runs the full 9-step process (`04_ScriptEngine/README.md` § Workflows), applying the News structural template (`News_Workflow.md`: Hook → What Happened → Why It Matters → Nuance/What's Next → CTA, per D-014). Output: a final script artifact with `fact_references` traceable back to step 2's fact-list.
5. **Production.** `05_Production` runs Speech Optimization → SSML → Emotion Tags → Pause Tags → Voice Generation (D-008, `Voice_SSML_Pipeline.md`), generates the avatar performance (`Avatar_Pipeline.md`), and assembles the video with the hybrid layout (`Video_Assembly.md` — News defaults full-screen throughout). Captions are included by default (D-015). Output: a rendered video artifact.
6. **Marketing.** `06_Marketing` identifies the strongest short-form segment (likely the hook or the Why It Matters beat), re-frames it per platform (`Platform_Derivation.md`), and writes a text-forward Telegram post carrying the full Nuance/What's Next context that a 60-second caption can't. Output: derived platform assets, each traceability-checked against the source video.
7. **SEO.** `07_SEO` writes the title (checked against the no-oversell rule), description, tags, and chapters (mapped directly to the script's own section boundaries), and produces the thumbnail (owned here per D-018, honesty-constrained the same way the title is).
8. **Automation (stage).** `08_Automation` assembles one publish package per platform (video/derived asset + metadata) and assigns scheduled times, then holds every package in a pending-approval state (D-016) — it does not publish yet.
9. **QA.** `09_QA` independently re-verifies: every claim in the package traces to the original fact-list (§ AI Hallucination Prevention), persona consistency (or explicitly marks `n/a` while `Shima_Persona.md` gaps remain open), structural compliance against `News_Workflow.md`, and the full `01_Core/Quality_Standards.md` checklist. Produces `qa_status: approved` or `rejected` with notes.
10. **Automation (resumed).** Only on `approved` does `08_Automation` execute publish via each platform's integration and log status back to `Knowledge/`.

Throughout, `10_Orchestrator` is what actually invokes each stage in order, passes each artifact as structured data (never a summary), and tracks where this particular piece of content currently sits.

## The rejection loop (illustrated)

Suppose step 9 fails: `09_QA` finds a statistic in the script with no traceable fact-list reference. `qa_status: rejected`, `routed_to: 04_ScriptEngine`. `10_Orchestrator` re-invokes `04_ScriptEngine` specifically — not Research, not Idea Engine, which weren't at fault — the script is revised (with the offending claim either sourced or removed), and the pipeline resumes forward from step 4, re-running steps 5–9 with the corrected script. Nothing before step 4 is redone.

## Where categories diverge

Steps 3–4 (Idea Engine's category tag, Script Engine's structural template) and step 6 (which segment Marketing selects) are the points where News, Course, Tool Review, and Tips genuinely diverge. Everything else in the sequence above — the 9-step script process, the SSML voice pipeline, the QA gate's four checks, the publish-hold ordering — applies identically regardless of category. See `04_ScriptEngine`'s four workflow files and `02_Research/Workflows.md` for the category-specific detail this walkthrough doesn't repeat.

## Cross-references
- Structural pipeline map: `01_Core/Architecture.md`
- QA-hold ordering: `DECISIONS.md` D-016, D-017
- Coordination logic: `10_Orchestrator/README.md`
- Category-specific divergence points: `02_Research/Workflows.md`, `04_ScriptEngine`'s four workflow files, `06_Marketing/Platform_Derivation.md`
