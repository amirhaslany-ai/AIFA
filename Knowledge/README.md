# Knowledge
**Document ID:** `Knowledge/README.md`
**Referenced by:** `02_Research/README.md`, `03_IdeaEngine/Topic_Selection.md`, `System/Content_Principles.md`

> A shared resource (`01_Core/Architecture.md`), not owned by one engine. This is the pipeline's long-term memory across content pieces — distinct from any single piece's own artifacts (a fact-list, a brief, a script), which are per-item and don't live here.

## Purpose

Hold accumulated knowledge that's expensive to rebuild per content piece and needs to persist across them: prior published content history, source reliability track record, and the correction log.

## What it holds

- **Prior published content log** — what's been covered, when, from what angle. This is what `03_IdeaEngine/Topic_Selection.md`'s mandatory saturation check queries against before finalizing a brief.
- **Source reliability history** — `02_Research/Source_Reliability.md` defines the tiering *rules*; this folder is where a source's actual track record (has it been reliably corroborated over time) would accumulate as real usage generates it.
- **Correction log** — per `System/Content_Principles.md`'s correction policy: what errors were found post-publish, what was corrected, and what pipeline stage the root cause traced back to.
- **Reusable background facts** — recurring context (e.g. a company's profile, a product's history) that multiple `02_Research` passes would otherwise redundantly rebuild.

## Who reads and writes

- `02_Research` reads for background context and writes newly-established reusable facts.
- `03_IdeaEngine` reads for the saturation check.
- The correction-log entries described in `System/Content_Principles.md` are written here when a post-publish correction happens.

## Structure

Not a rigid schema — this folder grows with usage — but entries should be organized to be queryable by topic, category, and date, since both the saturation check and source-reliability lookups depend on being able to find "what do we already know / already know about this source" quickly rather than reading everything.

## Cross-references
- Saturation check that queries this folder: `03_IdeaEngine/Topic_Selection.md`, `03_IdeaEngine/README.md` § Decision Rules
- Static tiering rules this folder's source-reliability history builds on: `02_Research/Source_Reliability.md`
- Correction policy that populates the correction log: `System/Content_Principles.md`
