# Vision
**Document ID:** 01_Core/Vision.md
**Inherits from:** `00_System/AIFA_CONSTITUTION.md` §3

## Why this exists

Persian-language AI content today is dominated by two failure modes: (1) channels that translate/rehash English-language AI news with a delay and no original analysis, and (2) tool-promotion content that's really just affiliate marketing dressed as education. Neither builds durable trust. AIFA Content Studio exists to fill the gap: a consistent, recognizable, original voice that a Persian-speaking audience can rely on to understand AI honestly — what's real, what's hype, and how to actually use it.

## What winning looks like

**Year 1:** Shima is a recognizable, consistent presence across YouTube, Instagram, TikTok, and Telegram. The content pipeline runs with defined workflows (not ad hoc prompting) for all four content categories. Publishing cadence is whatever `SUCCESS_METRICS.md` locks in (see `OPEN_QUESTIONS.md` OQ-005) — the point of Year 1 is proving the pipeline works end-to-end, not maximizing volume prematurely.

**Year 3:** AIFA is a name Persian-speaking AI learners recognize unprompted. Content Studio's audience is large and warm enough to be a meaningful distribution channel for the AIFA aggregator platform (see Constitution §2 on the relationship between the two, and OQ-008 on sequencing). The production pipeline is largely automated (`08_Automation`, `10_Orchestrator`) with human review concentrated at high-leverage checkpoints only.

**Year 5:** AIFA is the default reference — the channel people mean when they say "check what AIFA said about it." The pipeline architecture built for Persian AI content is proven enough to extend to adjacent verticals or languages if that path is chosen (see OQ-007).

## What this is not

- Not a news-aggregation channel that just repeats headlines — see Constitution Core Principle 1 (sources provide facts, never voice).
- Not an affiliate-marketing channel disguised as reviews — tool reviews follow the honest Problem→Tool→Features→Demo→Comparison→Pricing→Alternatives→Conclusion structure (`DECISIONS.md` D-005), not a sales script.
- Not dependent on any single AI vendor, video tool, or platform algorithm — see Architecture.md for why the pipeline is built in swappable stages.

## Differentiation thesis

The bet is not "better prompts." It's that a documented, agent-per-stage production system with strict source-facts/original-voice discipline (D-004) and a consistent, carefully designed persona (D-007) will consistently outproduce and outlast solo creators improvising with a single chat window — both in volume and in the kind of trust that survives platform authenticity policies (YouTube 2026, Instagram Originality Score) that increasingly penalize the "improvised AI content" approach.

## Cross-references
- Content categories and platform roles: `00_System/AIFA_CONSTITUTION.md` §6–7
- Full pipeline: `Architecture.md` (this folder)
- Open strategic questions that affect this vision: `00_System/OPEN_QUESTIONS.md` OQ-005, OQ-007, OQ-008
