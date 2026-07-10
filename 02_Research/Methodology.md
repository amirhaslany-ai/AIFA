# Research Methodology
**Document ID:** `02_Research/Methodology.md`
**Referenced by:** `02_Research/README.md` (Knowledge Base)

> This is the general procedure every category-specific workflow in `Workflows.md` specializes. Read this first; `Workflows.md` assumes it.

## The five-step procedure

### 1. Source discovery
Identify which sources are relevant to the topic at hand, scoped by category (`Source_Reliability.md` has the concrete source set per category). Discovery is bounded — Research does not open-endedly crawl the web per topic; it works from the maintained source set plus, when a topic requires it, a targeted search for sources specifically about that topic.

### 2. Fact extraction
From each source, extract discrete, verifiable claims — not summaries, not paraphrased narrative. A claim is a single checkable statement ("Model X was released on date Y with capability Z"), not a paragraph. Extraction records the source's own words only as a short attributed quote when the exact phrasing itself matters (e.g. an official statement); otherwise the fact is restated plainly and attributed.

### 3. Verification / cross-check
For each extracted claim, actively look for a second independent source before treating it as corroborated. This is not passive — if only one source has been found so far, a verification pass specifically searches for a second. The result of this step is the `confidence` and `corroboration` fields in the output artifact (see `README.md` Output Format).

### 4. Deduplication
Multiple sources reporting the same underlying fact collapse into one artifact entry with multiple citations — never multiple near-identical entries. This keeps the fact-list dense with signal rather than repetitive.

### 5. Ranking
Order the fact-list by relevance to the content brief and, for time-sensitive categories, recency. Ranking is what lets `03_IdeaEngine` and `04_ScriptEngine` quickly identify the strongest material without re-deriving importance themselves.

## What this procedure deliberately excludes

- **No angle-finding.** Deciding *why a fact matters* or *what hook it supports* is `03_IdeaEngine`'s job, not Research's. Research's ranking is about factual relevance/recency, not narrative potential.
- **No tone or framing.** A fact extracted here reads the same regardless of which content category it ends up serving — News, Course, Tool Review, and Tips research all use this same procedure; only the *source set* and *verification bar* (see `Workflows.md`) differ per category.
- **No writing.** Nothing produced by this procedure should read like a sentence from a finished script. If it does, it's drifted into Script Engine's territory (D-004, D-005) and should be pulled back to a plain factual statement.

## Cross-references
- Source tiers used in step 3: `Source_Reliability.md`
- Per-category specialization of this procedure: `Workflows.md`
- Output artifact schema: `README.md` § Output Format
