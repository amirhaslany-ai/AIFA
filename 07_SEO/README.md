# 07_SEO
**Document ID:** `07_SEO/README.md`
**Status:** Authoritative spec for the SEO engine (Constitution §8)
**Inherits from:** `01_Core/Architecture.md` (stage definition), `01_Core/Quality_Standards.md`

> Follows the standard agent structure locked in `DECISIONS.md` D-003. Scope is narrow enough that this engine doesn't need sibling detail files — everything lives in this one document.

---

## Mission

Produce the discoverability metadata — titles, descriptions, tags, chapters — for the source video and its derived assets, without ever overstating what the content actually delivers. SEO is a discoverability layer on top of finished content; it does not change or embellish the underlying claims.

## Role

Sixth stage in the pipeline (`01_Core/Architecture.md`). Input: the rendered video artifact (`05_Production`) and the derived marketing assets (`06_Marketing`). Output: titles, descriptions, tags, and chapters, consumed by `08_Automation` for scheduling/publish.

## Responsibilities

- Write a primary YouTube title that's specific and search/click-optimized without overselling what the video covers.
- Write a full description with genuine keyword coverage, not keyword stuffing.
- Generate chapter markers mapped to the script's own section structure (`04_ScriptEngine`'s category workflows) and the rendered video's actual segment timestamps (`05_Production/README.md` § Output Format `layout_segments`) — chapters are derived from structure that already exists, not invented independently.
- Select tags/keywords genuinely relevant to the content.
- Produce a lighter metadata pass (title, tags) for the short-form platforms (`06_Marketing`'s derived assets) — Telegram is excluded from this, since it isn't a search-indexed platform in the same sense (Constitution §7).

## Knowledge Base

- `04_ScriptEngine`'s category workflow files — the section structure chapters are built from.
- `05_Production/README.md` § Output Format — where segment timestamps come from.
- `06_Marketing/README.md` § Output Format — the derived assets that get their own lighter metadata pass.
- `01_Core/Quality_Standards.md` — the honesty/traceability principle this engine's titles and descriptions must not violate.

## Decision Rules

- **A title may not claim more than the video delivers.** This is the SEO-equivalent of `06_Marketing`'s traceability rule: a title like "this changes everything" for a modest update is not permitted even if it would out-perform an honest one — consistent with the differentiation thesis in `01_Core/Vision.md`.
- **Chapters map to the script's actual section boundaries**, not to an independently-invented outline — News's What Happened/Why It Matters/Nuance sections, Course's Skill Tree/Lessons/Exercises, etc. become chapter markers directly.
- **Tags are chosen for genuine relevance**, including legitimate comparison-search terms (e.g. a competitor tool's name, if the video's own Comparison section actually covers it) — never included speculatively to catch unrelated search traffic.
- **The description does not duplicate `06_Marketing`'s short-form captions verbatim** — it serves a different function (search context for the long-form video) and should be written for that purpose.

## Workflows

1. **Ingest** the rendered video artifact and derived marketing assets.
2. **Title Generation** — draft the primary title (and alternates, if useful for internal review), checked against the honesty rule above.
3. **Description Writing** — write the full description with keyword coverage and relevant links/context.
4. **Chapter Generation** — map the script's section boundaries and the video's segment timestamps into chapter markers.
5. **Tag Selection** — select relevant tags/keywords.
6. **Platform Metadata Variants** — a lighter title/tags pass for `06_Marketing`'s Shorts/Reels/TikTok derivations; no chapters at this stage since short-form assets don't carry them.
7. **Handoff** to `08_Automation`.

## Quality Standards

Inherits `01_Core/Quality_Standards.md` in full. SEO-specific addition: a title or description that oversells relative to the actual video content is a defect, not a growth-hacking tradeoff — it's treated with the same severity as a factual error elsewhere in the pipeline, because it directly damages the trust `01_Core/Vision.md` is built on.

## Thumbnails

Per `DECISIONS.md` D-018, thumbnail generation is owned by this engine, not `05_Production` or `06_Marketing` — thumbnails and titles are a paired click-through decision and belong together. A thumbnail must follow the same honesty rule as titles (§ Decision Rules): it may not depict or imply something the video doesn't actually show or claim. Visual specifics (composition, text overlay style, brand treatment) depend on `System/Brand_Guidelines.md` and the visual gaps still open in `System/Shima_Persona.md` — this section establishes ownership and the honesty constraint; visual execution detail lives in those files once populated.

## Examples / Edge Cases

- **A News video covering an incremental update:** title reflects the actual scope of the update; the temptation to inflate ("this changes everything") is rejected per the Decision Rules above, even when it would likely outperform an honest title.
- **Course video chapters:** map directly and predictably to Skill Tree → Prerequisites → Lessons → Exercises → Quiz → Summary — no reason to deviate from the script's own structure.
- **Tool Review comparison keywords:** including a competitor's name as a tag is legitimate only if the video's Comparison section actually names and discusses that competitor — not included purely to intercept its search traffic.

## Failure Recovery

- **The video's actual content doesn't clearly support a strong title/keyword angle:** this should be rare, since `03_IdeaEngine` already selected a specific angle upstream — if it happens anyway, flag back for review rather than force a misleading title to compensate for a weak angle.

## Output Format

```
- primary_title: <the chosen title>
  alt_titles: [<candidates considered, for internal review>]
  description: <full description text>
  tags: [<relevant keywords>]
  chapters: [{ timestamp, label }]
  platform_metadata: [{ platform, title, tags }]  # for 06_Marketing's derived assets
```

## Self-Review Checklist

- [ ] Title is honest to the video's actual content — no oversell.
- [ ] Chapters map to the script's real section boundaries and correct timestamps.
- [ ] Tags are genuinely relevant, not stuffed or speculative.
- [ ] Description is written for search context, not a copy of a marketing caption.

## KPIs

- Click-through rate vs. retention (once analytics exist) — a title that drives clicks but tanks retention is a title-honesty failure, not a marketing win.
- Title-honesty audit pass rate at the `09_QA` gate.
- Search impression share, once there's enough published volume to measure it.

## Future Improvements

- Keyword research tooling integration once `08_Automation`/analytics exist.
- A/B title testing, once the automation layer supports it.

## Cross-references
- Stage definition: `01_Core/Architecture.md`
- Honesty/traceability principle: `01_Core/Quality_Standards.md`, `01_Core/Vision.md`
- Section structures chapters are derived from: `04_ScriptEngine/News_Workflow.md`, `Course_Workflow.md`, `ToolReview_Workflow.md`, `Tips_Workflow.md`
- Where this output goes next: `08_Automation/README.md`
