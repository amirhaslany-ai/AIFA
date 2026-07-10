# 04_ScriptEngine
**Document ID:** `04_ScriptEngine/README.md`
**Status:** Authoritative spec for the Script Engine — the highest-value engine in the pipeline (Constitution §8)
**Inherits from:** `00_System/AIFA_CONSTITUTION.md` Core Principles 1–2, `00_System/DECISIONS.md` D-004, D-005, D-013, D-014

> Follows the standard agent structure locked in `DECISIONS.md` D-003. The universal writing process lives here; the four category-specific structural templates live in sibling files (`News_Workflow.md`, `Course_Workflow.md`, `ToolReview_Workflow.md`, `Tips_Workflow.md`) and are referenced, not duplicated, here.

---

## Mission

Turn one content brief (from `03_IdeaEngine`) and its supporting facts (from `02_Research`, via the brief) into a final, polished script — written entirely from scratch in Shima's voice, through a mandatory multi-step process, never in a single pass (D-004, D-005). This is the engine where the channel's actual differentiation (`01_Core/Vision.md`) either shows up or doesn't — every other engine exists to feed this one good material or turn its output into a finished asset.

## Role

Third stage in the pipeline (`01_Core/Architecture.md`). Input: content brief artifact (`03_IdeaEngine/README.md` § Output Format). Output: final script artifact consumed by `05_Production` (avatar/voice/edit), and later referenced by `06_Marketing` and `07_SEO`. A defined artifact, not a conversation — per the Architecture's data-flow principle.

## Responsibilities

- Execute the full 9-step writing process (§ Workflows) for every script, regardless of how "simple" the brief looks — no step is optional (D-005 hard rule).
- Apply the correct category-specific structural template (§ Workflows step 5, detailed in the four sibling workflow files).
- Ground every factual claim in the brief's `supporting_facts` references — never invent a statistic, date, name, or quote (D-004, `01_Core/Quality_Standards.md`).
- Write entirely original prose — no sentence may be a light reword of source phrasing, regardless of how well-put the source's phrasing was.
- Execute the brief's `hook_direction` into an actual hook line that lands in the first 5–8 seconds (`01_Core/Quality_Standards.md`).
- Produce exactly one clear CTA per script, matching the category's convention.
- Flag, rather than paper over, any gap inherited from upstream (thin facts, an unclosable curiosity gap, an infeasible course exercise) — see § Failure Recovery.

## Knowledge Base

- `News_Workflow.md`, `Course_Workflow.md`, `ToolReview_Workflow.md`, `Tips_Workflow.md` — the four category structural templates.
- `01_Core/Quality_Standards.md` — the script quality bar every output is checked against.
- `System/Shima_Persona.md` §2 — the tone framework (calm authority, honesty-over-hype) this engine writes against; several sub-sections remain `🔶 NEEDS FOUNDER INPUT` (verbal tics, formality register) — see § Decision Rules for how this engine handles that gap.
- `03_IdeaEngine/README.md` § Output Format — the content brief this engine consumes.
- `03_IdeaEngine/Hook_System.md` — the hook-direction types this engine's Hook Generation step must execute.
- `02_Research/README.md` § Output Format — the fact-list schema referenced by the brief.

## Decision Rules

- **No step in § Workflows may be skipped or silently merged**, even for a short Tips script — a compressed step is still executed and still leaves a trace in the artifact; an omitted step is a defect (D-005).
- **Every sentence is either traceable to a supporting fact or is pure original narration/framing** — never a reworded source sentence. If a sentence could plausibly be traced closely to one source's specific phrasing, it fails Revision (D-004, `01_Core/Quality_Standards.md`).
- **Tone gap handling:** while `System/Shima_Persona.md` §2's verbal tics and formality register remain `🔶`, this engine writes against the documented framework only (calm authority, honest-over-hype, energy varies by category) — it does not invent a catchphrase or pick a formality register unilaterally. Every script written under this gap is tagged `tone_baseline_note: provisional` in its output artifact (§ Output Format) so voice can be normalized retroactively once the persona file is completed.
- **CTA is singular**, chosen per category convention (see each workflow file) — never multiple competing asks in one script.
- **A script that fails any `01_Core/Quality_Standards.md` script-bar checkbox does not proceed to Production** — it returns to Revision (step 8) or, if the gap is upstream, back to Idea Engine/Research.

## Workflows

The universal 9-step process (D-005), applied to every script regardless of category:

1. **Research** — ingest the content brief and its referenced fact-list entries. This is consumption, not re-research: Script Engine does not redo `02_Research`'s job. If the facts are visibly thinner than the brief implies, see § Failure Recovery.
2. **Extract Facts** — select which specific facts from the referenced fact-list will actually appear in this script, given the category's length/format constraints. Not every available fact needs to make it in; over-stuffing a script with facts at the expense of narrative clarity is its own failure mode.
3. **Audience Analysis** — using the brief's `audience_fit_notes`, decide what prior knowledge to assume and what needs explaining, so the script neither over-explains to an informed viewer nor loses a newcomer.
4. **Hook Generation** — write the actual hook line executing the brief's `hook_direction` (`03_IdeaEngine/Hook_System.md`). If the direction can't be honestly executed with the facts at hand, return to step 2/3 rather than force a misleading hook.
5. **Outline** — apply the category-specific structural template (§ below, detailed per category file).
6. **Storytelling** — write the full narrative draft in Shima's voice, following the outline, entirely original per the Decision Rules above.
7. **CTA** — write the single call-to-action per the category's convention.
8. **Revision** — check the full draft against `01_Core/Quality_Standards.md`'s script bar and this file's Decision Rules; rewrite anything that fails, especially D-004 phrasing-proximity issues.
9. **Final Polish** — line-level polish for spoken delivery: rhythm, pacing, natural breath points. This prepares the script for `05_Production`'s SSML/emotion/pause pipeline (D-008) but does not perform that markup itself — that's Production's job, working from this engine's plain final script text.

### Category-specific structural templates (step 5, detailed elsewhere)

| Category | Structure | Owning decision |
|---|---|---|
| News | Hook → What Happened → Why It Matters → Nuance/What's Next → CTA | D-014 |
| Course/Education | Skill Tree → Prerequisites → Lessons → Exercises → Quiz → Summary → CTA | D-005 |
| Tool Review | Problem → Tool → Features → Demo → Comparison → Pricing → Alternatives → Conclusion | D-005 |
| Tips & Tricks | Hook → Problem/Context → The Tip (step-by-step) → Quick Proof/Demo → CTA | D-013 |

## Quality Standards

Inherits `01_Core/Quality_Standards.md` in full — this file does not restate the script quality bar checklist. Script Engine-specific addition: every script's `revision_log` (§ Output Format) must show evidence that step 8 (Revision) actually happened — an empty or missing revision log is itself a quality defect, since it suggests the step was skipped rather than clean.

## Examples / Edge Cases

- **Hook direction can't be honestly closed:** e.g. the brief called for a Curiosity Gap hook, but during Storytelling it's clear the "answer" is less interesting than the gap implied — return to step 4/5 and pick a different, honestly-earned hook rather than shipping a bait-and-switch.
- **Fast-moving News story develops between brief and script:** flag for a quick re-check with `02_Research`/`03_IdeaEngine` rather than writing around facts that may already be stale by publish time.
- **Course exercise infeasible within the video's time budget:** escalate back to `03_IdeaEngine` to rescope the brief (split into a mini-series, or narrow the skill) rather than cramming or silently dropping the exercise step.
- **Tool Review demo reveals a vendor claim doesn't hold up:** this becomes the actual editorial angle — per the honesty mandate, the discrepancy is reported plainly, not suppressed to protect a "positive review" framing.
- **Tips script where the tip needs a caveat** (works only in certain conditions): the caveat is stated plainly in the script rather than omitted for cleanliness — omitting it would produce a factually misleading tip.

## Failure Recovery

- **Facts thinner than the brief implied:** escalate back to `02_Research`/`03_IdeaEngine` rather than filling the gap with invented specifics — this is a hard stop, not a judgment call, per D-004.
- **Draft drifts into reworded-source territory during Storytelling:** Revision (step 8) must catch and rewrite from scratch, not lightly edit — a lightly-edited reworded sentence is still a D-004 violation.
- **Persona tone gap makes a script feel generic:** ship against the provisional tone baseline (§ Decision Rules), tag it, and move on — do not block the script on an unresolved founder-input gap.

## Output Format

Final script artifact:
```
- category: news | course | tool_review | tips
  title: <working title>
  hook_line: <the written hook, executing the brief's hook_direction>
  outline: <section-tagged outline per the category's structural template>
  script_body: <full script text, section-tagged>
  cta: <the single call to action>
  runtime_estimate: <rough spoken-length estimate>
  fact_references: [<02_Research fact-list entries actually used, per step 2>]
  tone_baseline_note: <"provisional" if written against Shima_Persona.md's open tone gaps, else omitted>
  revision_log: <what changed during step 8, and why>
```

## Self-Review Checklist

- [ ] All 9 process steps executed and traceable in the artifact — none skipped or silently merged.
- [ ] Category-specific structural template followed exactly (see the relevant workflow file).
- [ ] No sentence reworded from a single source's phrasing beyond a short attributed quote (D-004).
- [ ] Every factual claim traces to a `fact_references` entry.
- [ ] Hook line executes the brief's hook direction and fits the 5–8 second window.
- [ ] Exactly one CTA.
- [ ] Passes every box in `01_Core/Quality_Standards.md`'s script quality bar.

## KPIs

- **Script-to-brief fidelity** — does the finished script actually deliver the brief's angle, or drift from it during Storytelling.
- **Revision cycles needed** — a proxy for how well upstream briefs/facts set this engine up to succeed.
- **Post-publish factual-correction rate** — shared KPI with `02_Research`; a correction traces back to either thin research or a Script Engine fact-extraction error, and the artifact's `fact_references` field is what makes that traceable.
- **Runtime-estimate accuracy** vs. actual produced runtime, once `05_Production` is generating real output.

## Future Improvements

- Automated D-004 phrasing-proximity checking (flagging sentences too close to source phrasing) as a Revision-step aid, once tooling exists.
- Closed-loop tone calibration once `System/Shima_Persona.md`'s open gaps are filled — retroactively reviewing `tone_baseline_note: provisional` scripts against the finalized voice.
- Category template refinement based on `09_QA` review-gate patterns once enough scripts have gone through it.

## Cross-references
- Sources-facts-not-voice / no-single-shot mandates: `AIFA_CONSTITUTION.md` Core Principles 1–2, `DECISIONS.md` D-004, D-005
- Category structure decisions: `DECISIONS.md` D-005 (Course, Tool Review), D-013 (Tips), D-014 (News)
- General script quality bar: `01_Core/Quality_Standards.md`
- Where the finished script goes next: `05_Production/README.md` (avatar/voice/SSML pipeline)
