# Trend Scoring
**Document ID:** `03_IdeaEngine/Trend_Scoring.md`
**Referenced by:** `03_IdeaEngine/README.md` (Knowledge Base, Workflows step 3)

> The rubric used to rank candidate topic/angle pairs (from `Topic_Selection.md`) so Idea Engine can pick one winner per brief. This is a judgment aid, not a formula precise enough to fully automate yet — treat scores as directional, not exact.

## Scoring factors

Score each candidate 1–5 on each factor:

| Factor | What it measures | Notes |
|---|---|---|
| **Recency/urgency** | How time-sensitive the underlying facts are | Weighted heavily for News; largely irrelevant for Course, low weight for Tool Review/Tips |
| **Factual strength** | Corroboration level of the anchoring fact(s), per `02_Research`'s `confidence` field | A candidate anchored on a `low` confidence fact should score low here regardless of how exciting the topic is |
| **Audience relevance** | Fit with the Persian AI-learner audience and honest-education mission (`01_Core/Vision.md`) | Not the same as "broadly popular" — a niche-but-genuinely-useful topic can outscore a broad-but-shallow one |
| **Engagement potential** | How strong an honest hook direction is available (`Viral_Psychology.md`, `Hook_System.md`) | Scored only on levers the facts actually support — an inflated score here for a weak factual base should be caught by the Factual Strength factor instead |
| **Saturation / freshness** | How recently this topic/angle (or a close one) was covered, per `Knowledge/` | Heavily penalize near-duplicates; a genuinely new angle on an old topic scores fine |
| **Category cadence fit** | Whether this category currently needs output | 🔶 Weight depends on `OPEN_QUESTIONS.md` OQ-005 (cadence targets not yet locked) — until resolved, treat this factor as informative only, not a hard gate |

## Using the rubric

There is no single numeric cutoff prescribed here — this is deliberate. A candidate with a perfect Engagement score and a weak Factual Strength score should generally lose to a candidate with the reverse profile, because factual strength is closer to this system's core differentiator (`01_Core/Vision.md`). When candidates are close, prefer the one with better Audience Relevance and Saturation/Freshness — those two factors most directly protect long-term trust and channel identity.

## What this rubric does not do

- It does not replace the hard filters in `README.md` § Decision Rules (factual-anchor minimum, no hype-only angles, mandatory saturation check) — those are pass/fail gates applied *before* scoring, not factors traded off within it.
- It does not currently pull real trend/search data — see `README.md` § Future Improvements for automated trend-signal ingestion, not yet built.

## Cross-references
- Candidates being scored: `Topic_Selection.md`
- Engagement potential grounding: `Viral_Psychology.md`, `Hook_System.md`
- Hard pre-scoring filters: `README.md` § Decision Rules
- Cadence targets affecting the last factor: `OPEN_QUESTIONS.md` OQ-005
