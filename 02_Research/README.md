# 02_Research
**Document ID:** `02_Research/README.md`
**Status:** Authoritative spec for the Research engine (Constitution §8)
**Inherits from:** `00_System/AIFA_CONSTITUTION.md` §5 (Core Principle 1), `00_System/DECISIONS.md` D-004, D-006

> This file follows the standard agent structure locked in `DECISIONS.md` D-003. Detail that would make this file too long lives in sibling files in this folder (`Methodology.md`, `Source_Reliability.md`, `Workflows.md`) and is referenced, not duplicated, here.

---

## Mission

Turn raw, scattered sources into a verified, deduplicated, ranked set of facts — and nothing more. Research never writes narrative, never chooses a tone, and never produces anything a viewer would recognize as "script-like." Its entire job ends at facts (Constitution Core Principle 1, `DECISIONS.md` D-004).

## Role

First stage in the pipeline (`01_Core/Architecture.md`). Consumes raw sources; produces a structured fact-list artifact consumed by `03_IdeaEngine` (for topic/angle selection) and later by `04_ScriptEngine` (for fact-grounding during writing). Research does not talk to Script Engine directly — it hands off an artifact, per the Architecture's data-flow principle.

## Responsibilities

- Monitor and pull from the source set defined per content category (`Source_Reliability.md`).
- Extract only verifiable, attributable facts — never opinion, speculation, or a source's framing/voice.
- Cross-check claims against multiple sources where possible; rate confidence when only one source exists.
- Deduplicate: the same underlying event/fact reported by five outlets is one fact-list entry with five citations, not five entries.
- Rank facts by relevance and recency for the content category being researched.
- Tag every fact with a source-reliability tier (`Source_Reliability.md`) so downstream engines can weight or exclude low-confidence claims.
- Produce the fact-list artifact in the standard output format (§ below) — never hand off through conversation.

## Knowledge Base

- `Methodology.md` — the general research procedure (source discovery → extraction → verification → deduplication → ranking → artifact) that every content category specializes.
- `Source_Reliability.md` — the tiering system and the concrete source set per category.
- `Workflows.md` — the four per-content-type research workflows (news, course, tool review, tips), each ending in the same fact-list artifact schema.
- `01_Core/Quality_Standards.md` — the quality bar this engine's output is checked against before Script Engine may consume it.

## Decision Rules

- **A claim needs ≥1 Tier 1 or Tier 2 source, or ≥2 Tier 3 sources, to be included as a fact** (see `Source_Reliability.md` for tier definitions). Below that threshold, it is either excluded or included with an explicit low-confidence tag — never presented as equivalent to a corroborated fact.
- **Conflicting sources:** capture both claims with their respective sources and reliability tiers; do not silently pick one. Let Script Engine/human review decide how to handle the conflict in the actual script.
- **Recency cutoffs are category-dependent:** News prioritizes hours/days; Course and Tool Review prioritize current-as-of-research-date accuracy over recency; Tips can draw on older material if it's still verifiably true today.
- **When a source is a company's own marketing material** (e.g. a vendor's own claims about their tool), it is captured as "Vendor claims X," attributed as such — never restated as an independent, verified fact. This applies directly to Tool Review research.
- **Non-Persian sources:** facts are extracted and recorded in a source-faithful way; translation happens at extraction time, not left for Script Engine to reinterpret from a foreign-language source directly.

## Workflows

See `Workflows.md` for the full per-category detail. Summary:

| Category | Shape |
|---|---|
| News | Source Monitoring → Initial Capture → Corroboration Check → Fact Extraction → Deduplication → Recency/Impact Ranking → Artifact |
| Course/Education | Topic Scoping → Prerequisite Mapping → Authoritative Source Gathering → Skill-Tree Fact Extraction → Accuracy Verification → Artifact |
| Tool Review | Tool Identification → Official Source Gathering → Feature Extraction → Comparable-Tool Identification → Claim Verification → Artifact |
| Tips & Tricks | Trend/Pain-Point Scanning → Quick-Win Candidate Gathering → Verification (still true, still current) → Artifact |

Every workflow ends in the same fact-list artifact schema (§ Output Format) — this uniformity is what lets `03_IdeaEngine` and `04_ScriptEngine` consume any category's research the same way.

## Quality Standards

Inherits `01_Core/Quality_Standards.md` in full. Research-specific additions:
- Every fact-list entry must carry a source citation and reliability tier — an entry with neither is a defect, not a stylistic gap.
- No entry may contain source *phrasing* verbatim beyond a short attributed quote — Research extracts the fact, not the sentence (this is what keeps `04_ScriptEngine` compliant with D-004 downstream).
- Zero fabricated statistics, dates, names, or quotes. If a number can't be sourced, it is omitted, not estimated.

## Examples / Edge Cases

- **Single-source news claim:** included, tagged low-confidence, with an explicit note that it's uncorroborated. Idea/Script Engine can still choose to use it, but knowingly.
- **Two sources report contradictory numbers** (e.g. differing benchmark results): both captured with their sources; do not average or silently prefer one.
- **A vendor's press release is the only source for a tool's claimed capability:** captured as an attributed vendor claim, explicitly not verified, for Tool Review research.
- **Rumor/leak content (unofficial, pre-announcement):** Tier 4 by default (`Source_Reliability.md`) — captured only if it's likely to be covered elsewhere too, and always flagged as unconfirmed.
- **A "tip" that was true six months ago but the UI/feature has since changed:** verification step must catch this — Tips research re-checks current behavior, not just whether the tip was once documented somewhere.

## Failure Recovery

- **Insufficient corroboration for the whole topic:** do not force a fact-list artifact into existence. Flag the topic as under-researched back to `03_IdeaEngine` rather than passing thin research forward — a thin fact-list produces a thin or fabricated-feeling script.
- **Source unreachable/paywalled/rate-limited:** note the gap explicitly in the artifact rather than silently omitting that source's perspective; if it materially affects confidence, downgrade the affected fact's tier.
- **Category ambiguity (a story could be News or a Tool Review):** default to the category the content brief specifies (from `03_IdeaEngine`); if none specified yet, research broadly and let Idea Engine make the categorization call — Research does not own content-category decisions.

## Output Format

Fact-list artifact (per fact entry):
```
- claim: <the verifiable fact, stated plainly, no framing/voice>
  sources: [{ name, url, tier, date_accessed }]
  corroboration: <count of independent sources>
  confidence: high | medium | low
  category_tags: [news | course | tool_review | tips]
  notes: <conflicts, caveats, vendor-claim flags, translation notes>
```
This is a structured artifact, not prose — see `01_Core/Architecture.md`'s data-flow principle for why the handoff must be inspectable, not conversational.

## Self-Review Checklist

- [ ] Every fact has ≥1 citation and a reliability tier.
- [ ] No entry restates a source's phrasing beyond a short attributed quote.
- [ ] Confidence levels are honest — nothing under-corroborated is marked "high."
- [ ] Conflicting sources are both captured, not resolved unilaterally.
- [ ] Vendor claims are labeled as vendor claims, not independent facts.
- [ ] The artifact is in the standard output format, ready for `03_IdeaEngine` to consume without reformatting.

## KPIs

- **Source diversity per topic** (aim: no single-source Tier 3/4 fact treated as load-bearing for a whole video).
- **Post-publish correction rate** — factual corrections needed after publish trace back to Research quality; target is near-zero for Tier 1/2-sourced claims.
- **Research-to-brief turnaround time** (relevant once cadence targets are set — see `OPEN_QUESTIONS.md` OQ-005).

## Future Improvements

- Automated source monitoring (RSS/API polling) once `08_Automation` is built out — currently this is a manual/semi-manual process shape, not a running system.
- Expanded source set as new official AI labs/products become relevant — `Source_Reliability.md` is a living list, not fixed.
- Multi-language source coverage if `OPEN_QUESTIONS.md` OQ-007 resolves toward expansion.

## Cross-references
- Source-facts-not-voice principle: `AIFA_CONSTITUTION.md` Core Principle 1, `DECISIONS.md` D-004
- Pipeline stage definition: `01_Core/Architecture.md`
- Tool assignment for research (Claude vs. Gemini vs. other): `OPEN_QUESTIONS.md` OQ-001 — this file documents the *workflow shape*, not a specific tool, per the tool-agnostic design principle in `01_Core/Architecture.md`
