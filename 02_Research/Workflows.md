# Research Workflows (per content category)
**Document ID:** `02_Research/Workflows.md`
**Referenced by:** `02_Research/README.md` (Workflows)

> Each workflow below specializes the general procedure in `Methodology.md`. All four end in the same fact-list artifact schema (`README.md` § Output Format) — the steps differ, the output shape does not.

## News

**Shape:** Source Monitoring → Initial Capture → Corroboration Check → Fact Extraction → Deduplication → Recency/Impact Ranking → Artifact

1. **Source Monitoring** — scan Tier 1 sources (official blogs/changelogs) and Tier 2/3 sources for anything new since the last research pass.
2. **Initial Capture** — log candidate stories with source and timestamp before deep verification, so nothing is lost while corroboration is pending.
3. **Corroboration Check** — for each candidate, actively check whether other sources are reporting it (`Methodology.md` step 3). This is where Tier 4 rumors either get corroborated into Tier 3/2 territory or stay flagged unconfirmed.
4. **Fact Extraction** — pull discrete claims per story (what happened, who, when, stated capability/impact) per `Methodology.md` step 2.
5. **Deduplication** — collapse the same story across multiple outlets into one artifact entry with multiple citations.
6. **Recency/Impact Ranking** — order by how time-sensitive and how significant each story is; News research has the shortest useful shelf-life of any category, so ranking must weight recency heavily.
7. **Artifact** — hand off to `03_IdeaEngine` for topic/angle selection against the News cadence target (`OPEN_QUESTIONS.md` OQ-005).

**Category-specific note:** a story that's purely speculative (Tier 4, no corroboration found) should still be logged if it's likely to develop — but explicitly marked so Idea Engine doesn't select it as a confirmed-fact news item.

## Course / Education

**Shape:** Topic Scoping → Prerequisite Mapping → Authoritative Source Gathering → Skill-Tree Fact Extraction → Accuracy Verification → Artifact

1. **Topic Scoping** — define the specific skill/capability the course content will teach (this typically comes from the content brief, not invented by Research).
2. **Prerequisite Mapping** — identify what a viewer needs to already know or have set up; this becomes structural fact-list content, not just topic facts (feeds the "Prerequisites" step of the Course script workflow, `DECISIONS.md` D-005).
3. **Authoritative Source Gathering** — official docs/tutorials for the tool or concept being taught (Tier 1).
4. **Skill-Tree Fact Extraction** — break the topic into ordered, checkable steps/claims ("to do X you need Y," "step A produces result B") rather than one big explanation.
5. **Accuracy Verification** — where feasible, verify that documented steps actually produce the claimed result as of the research date (tools/UIs change; stale documentation is a real risk here).
6. **Artifact** — hand off with explicit ordering preserved, since Course scripts follow a strict Skill Tree → Lessons → Exercises → Quiz → Summary structure (D-005) that depends on this ordering.

## Tool Review

**Shape:** Tool Identification → Official Source Gathering → Feature Extraction → Comparable-Tool Identification → Claim Verification → Artifact

1. **Tool Identification** — confirm exactly which tool/version is in scope (version drift between research and publish is a real risk for fast-moving tools).
2. **Official Source Gathering** — pricing page, docs, changelog (Tier 1, vendor-attributed for evaluative claims per `README.md` Decision Rules).
3. **Feature Extraction** — discrete, checkable feature/pricing/limitation claims.
4. **Comparable-Tool Identification** — identify the 2–4 tools a viewer would actually be choosing between, so the eventual script's Comparison and Alternatives steps (D-005) have real material rather than a token mention.
5. **Claim Verification** — flag any vendor capability claim that hasn't been independently corroborated or hands-on tested; this becomes the "vendor claims X" note pattern from `README.md` Decision Rules, and should be resolved by human hands-on testing before Script Engine treats it as confirmed (see `09_QA/README.md` for where hallucination/unverified-claim checks are enforced).
6. **Artifact** — hand off with the vendor-claim flags intact; Script Engine and QA must be able to see which claims are independently verified vs. vendor-only.

## Tips & Tricks

**Shape:** Trend/Pain-Point Scanning → Quick-Win Candidate Gathering → Verification (still true, still current) → Artifact

1. **Trend/Pain-Point Scanning** — identify what people are actually getting stuck on or asking about (Tier 3 sources — forums, community discussion — are more useful here than for News).
2. **Quick-Win Candidate Gathering** — pull specific, actionable tips tied to a real feature or workflow, not generic advice.
3. **Verification (highest staleness risk of any category)** — explicitly re-check that the tip still works as described today; a tip sourced from six-month-old material must be re-verified against current tool behavior before inclusion, not assumed still valid.
4. **Artifact** — hand off; Tips research typically produces several small, independent fact-list entries rather than one deep topic, since a single Tips video may cover multiple unrelated quick wins.

## Cross-references
- General procedure these specialize: `Methodology.md`
- Source tiers referenced above: `Source_Reliability.md`
- Output schema: `README.md` § Output Format
- Where these hand off to: `03_IdeaEngine` (topic/angle selection), `04_ScriptEngine` (per-category script workflows, `DECISIONS.md` D-005)
