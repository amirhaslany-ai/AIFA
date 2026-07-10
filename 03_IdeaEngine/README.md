# 03_IdeaEngine
**Document ID:** `03_IdeaEngine/README.md`
**Status:** Authoritative spec for the Idea Engine (Constitution §8)
**Inherits from:** `00_System/AIFA_CONSTITUTION.md` §5–6, `01_Core/Architecture.md`, `00_System/DECISIONS.md` D-005

> Follows the standard agent structure locked in `DECISIONS.md` D-003. Detail lives in sibling files (`Topic_Selection.md`, `Viral_Psychology.md`, `Hook_System.md`, `Trend_Scoring.md`) and is referenced, not duplicated, here.

---

## Mission

Turn Research's fact-list artifact into a single, scoped **content brief**: a chosen category, a specific angle, and a hook direction — the strategic decisions a script needs before writing starts. Idea Engine decides *what to make and why it'll land*; it does not write anything a viewer will hear or read.

## Role

Second stage in the pipeline (`01_Core/Architecture.md`). Input: ranked facts / trend signals from `02_Research`. Output: a scoped content brief consumed by `04_ScriptEngine`. Like the Research→Script handoff, this is a defined artifact, not a conversation — see `01_Core/Architecture.md`'s data-flow principle.

## Responsibilities

- Ingest the fact-list artifact from `02_Research` and identify viable topic candidates within it.
- Score candidates against trend/relevance/saturation factors (`Trend_Scoring.md`) and pick one per brief.
- Select a single clear **angle** — the specific thesis or take, not just a topic label (e.g. not "GPT update" but "this update quietly kills a whole category of prompt-engineering workarounds").
- Select a **hook direction** — which psychological lever the eventual hook should use (`Hook_System.md`) — as strategic guidance for Script Engine's own Hook Generation step, not the finished hook line itself.
- Reject or defer candidates that don't clear the quality/honesty bar (see Quality Standards below) rather than forcing a brief into existence.
- Check for topic saturation against `Knowledge/` (has this already been covered recently, from a similar angle) before finalizing a brief.

## Knowledge Base

- `Topic_Selection.md` — how fact-list candidates get narrowed to one viable brief.
- `Viral_Psychology.md` — the general audience-engagement principles behind angle and hook choices.
- `Hook_System.md` — the hook-direction library and its division of labor with Script Engine's Hook Generation step.
- `Trend_Scoring.md` — the scoring rubric used to rank candidates.
- `Knowledge/` (shared resource) — prior content history, used for saturation checks.
- `02_Research/README.md` § Output Format — the fact-list artifact this engine consumes.

## Decision Rules

- **A brief needs at least one Tier 1/2-sourced fact (per `02_Research/Source_Reliability.md`) as its factual anchor.** A brief built entirely on Tier 3/4 material is deferred back to Research for more corroboration, not shipped as-is.
- **One angle per brief, not several competing ones** — mirrors the single-CTA discipline in `01_Core/Quality_Standards.md`. If a topic supports multiple strong angles, that's multiple candidate briefs, not one brief trying to cover all of them.
- **Reject hype-only angles.** Per `01_Core/Vision.md`'s differentiation thesis (honest voice, not hype), an angle that overstates what a fact actually supports is rejected or reframed — even if it would score well on `Trend_Scoring.md`'s engagement factors alone.
- **Saturation check is mandatory**, not optional, before finalizing: if `Knowledge/` shows the same topic/angle covered within a recent window, either pick a materially different angle or defer the topic.
- **Category assignment**: if Research already tagged a fact-list with a category (`02_Research/README.md` Output Format `category_tags`), Idea Engine may reassign it only with a documented reason (e.g. a "News" fact turns out to be better served as a "Tips" quick-win) — it does not silently override Research's tagging.

## Workflows

1. **Ingest** the fact-list artifact for a given research pass.
2. **Candidate generation** — identify distinct topic/angle combinations the fact-list could support (`Topic_Selection.md`).
3. **Trend scoring** — score each candidate (`Trend_Scoring.md`).
4. **Saturation check** — filter against `Knowledge/` recent content history.
5. **Angle selection** — pick the single strongest, most honest angle for the winning candidate.
6. **Hook direction selection** — choose the psychological lever (`Hook_System.md`) that best fits the angle and category.
7. **Content brief** — package and hand off to `04_ScriptEngine`.

## Quality Standards

Inherits `01_Core/Quality_Standards.md`. Idea Engine-specific additions:
- The angle must be a specific, falsifiable claim or thesis — not a vague topic label a script could go a dozen directions with.
- The hook direction must be honestly earned by the underlying facts — no hook direction that implies stakes or drama the facts don't support.
- The brief must name its category explicitly and match that category's structural shape (`DECISIONS.md` D-005) — a Tool Review brief should already imply Problem→Tool→Features→... is coming, not read like a News brief in disguise.

## Examples / Edge Cases

- **Strong trend signal, thin facts:** score high on `Trend_Scoring.md`'s trend factor but fail the factual-anchor rule above — deferred back to Research with a note on what corroboration is needed, rather than shipped thin.
- **Topic already covered two weeks ago, but from a narrow angle:** not automatically rejected — if a genuinely different angle exists (e.g. covered the announcement, now covering real-world impact a month later), it can proceed; the saturation check exists to prevent repetition, not to freeze a live topic forever.
- **A speculative/thin News story that doesn't justify a full video:** redirected toward a Tips-style quick mention or a roundup format rather than forced into its own News brief — this is a category-reassignment case per the Decision Rules above.
- **Politically or ethically sensitive AI topic** (e.g. job displacement, safety incidents): angle selection must stay within the honest-voice mandate — flag for extra scrutiny at the QA gate (`09_QA/README.md`) rather than defaulting to either alarmism or dismissiveness.

## Failure Recovery

- **No candidate clears the factual-anchor or saturation bar:** return "no viable brief this pass" rather than lowering the bar — an empty pass is cheaper than a weak video.
- **Cadence pressure vs. quality bar conflict** (e.g. News cadence target implies output is due but nothing worth covering exists): flag explicitly rather than silently forcing a brief — this trades against `OPEN_QUESTIONS.md` OQ-005 once cadence targets are locked, and should be logged as a real tension, not resolved by lowering the honesty bar.
- **Hook direction doesn't fit any angle cleanly:** default to the most conservative hook type for the category (`Hook_System.md`) rather than forcing a mismatched high-drama hook onto a low-drama fact set.

## Output Format

Content brief artifact:
```
- category: news | course | tool_review | tips
  working_title: <short internal label>
  angle: <the specific thesis/take, one sentence>
  hook_direction: <type from Hook_System.md + one-line rationale>
  supporting_facts: [<references to 02_Research fact-list entries>]
  saturation_check: <clear | note on prior related coverage>
  trend_score: <see Trend_Scoring.md rubric output>
  audience_fit_notes: <why this serves the Persian AI-learner audience per 01_Core/Vision.md>
```

## Self-Review Checklist

- [ ] Angle is a specific, falsifiable thesis — not a vague topic label.
- [ ] At least one Tier 1/2 fact anchors the brief.
- [ ] Passed the saturation check against `Knowledge/`.
- [ ] Hook direction is honestly earned by the facts, not inflated.
- [ ] Category and structural shape match `DECISIONS.md` D-005.
- [ ] Single angle, not several competing ones.

## KPIs

- **Angle diversity** — briefs shouldn't cluster on the same handful of hook directions/angles over time.
- **Brief-to-publish conversion** — how often a brief survives Script/Production/QA without a category or angle rework, a proxy for brief quality.
- **Post-publish performance vs. trend score** (once analytics exist) — validates or corrects the `Trend_Scoring.md` weights over time.

## Future Improvements

- Automated trend-signal ingestion (social listening, search trend data) once `08_Automation` exists — currently a manual/semi-manual scan of Research's output.
- A feedback loop from published-content performance back into `Trend_Scoring.md` weighting, once analytics/KPIs are actually being tracked.

## Cross-references
- Pipeline stage definition: `01_Core/Architecture.md`
- Script structural variants this brief must fit: `DECISIONS.md` D-005
- Honesty-over-hype mandate: `01_Core/Vision.md`
- Cadence targets (affects future scoring weight): `OPEN_QUESTIONS.md` OQ-005
