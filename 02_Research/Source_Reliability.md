# Source Reliability
**Document ID:** `02_Research/Source_Reliability.md`
**Referenced by:** `02_Research/README.md` (Decision Rules, Knowledge Base)

> A living list — update the concrete source sets as new labs/products/outlets become relevant. The tier definitions and inclusion thresholds are the stable part; the named sources under each tier are expected to change over time.

## Tier definitions

| Tier | Definition | Inclusion rule |
|---|---|---|
| **Tier 1 — Primary/Official** | The entity's own official channel: company blog, official docs, official changelog/release notes, official social account of the company (not an employee's personal account) | Sufficient alone to support a fact |
| **Tier 2 — Reputable reporting** | Established tech journalism with editorial standards and a correction record (not aggregator/rewrite sites) | Sufficient alone to support a fact |
| **Tier 3 — Aggregator / individual** | Individual accounts (including verified/notable individuals), forums, aggregator sites, unofficial community sources | Needs ≥2 independent Tier 3 sources, or 1 Tier 3 + partial Tier 1/2 corroboration, to count as corroborated |
| **Tier 4 — Rumor/leak/unconfirmed** | Pre-announcement leaks, unverified claims, speculation presented as fact by the source itself | Never sufficient alone; may be included only as an explicitly flagged "unconfirmed" note, never as a fact-list entry proper |

## Concrete source set (current — expand as needed)

**AI News (Tier 1):** OpenAI blog/changelog, Anthropic blog/changelog, Google DeepMind/Google AI blog, Meta AI blog, GitHub release notes for major AI-adjacent repos, official X/social accounts of the above.

**AI News (Tier 2):** established outlets with dedicated AI beats and a correction record (do not treat a general-news outlet's single AI-adjacent article as Tier 2 without checking it against a Tier 1 source).

**AI News (Tier 3):** X/Twitter posts from notable-but-unofficial AI researchers/practitioners, Hacker News discussion threads, community forums (e.g. subreddits) — useful for surfacing what a topic *is* and how it's landing, not sufficient alone as the factual basis.

**Course/Education research:** official product documentation, official tutorials/guides from the tool/platform vendor (Tier 1 for "how this feature works," but see the Decision Rules note in `README.md` about vendor claims vs. independent facts for anything evaluative).

**Tool Review research:** the tool's own pricing page, docs, and changelog (Tier 1 for factual/feature claims, explicitly vendor-attributed for evaluative claims); independent comparison articles and user discussion (Tier 2/3) for the comparative and real-world-usage angle.

**Tips & Tricks research:** same source set as the relevant tool/platform's Course sources, re-verified for current accuracy at research time (see `Workflows.md` Tips workflow — this category has the highest staleness risk).

## 🔶 Open gap

**NEEDS FOUNDER INPUT** — `OPEN_QUESTIONS.md` OQ-001 (tool assignments) affects *how* this tiering gets applied in practice: whether a dedicated research tool (e.g. Perplexity-style aggregation, or Gemini) does first-pass source discovery before Claude does extraction/verification, or whether one model does the full pipeline. This file documents the tiering logic itself, which holds regardless of that answer.

## Cross-references
- How tiers are used in the verification step: `Methodology.md` step 3
- Inclusion threshold as a Decision Rule: `README.md` § Decision Rules
- Unresolved tool assignment: `OPEN_QUESTIONS.md` OQ-001
