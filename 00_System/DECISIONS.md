# AIFA — Decisions Log
**Document ID:** 00_System/DECISIONS.md
**Referenced by:** `AIFA_CONSTITUTION.md` §5, §9

> Every entry here is a decision that has already been made (in prior conversations or in this constitution) and should not be silently re-litigated. To change a decision, add a new entry that supersedes the old one — do not delete history.

Status legend: **Locked** = settled, change requires explicit founder approval · **Provisional** = working assumption, likely to be revisited once tools/budget are confirmed · **Superseded** = replaced by a later entry.

---

### D-001 — Multi-model architecture instead of single-model system
**Status:** Provisional
**Decision:** Claude is not "the whole system." Proposed original division of labor: Claude = project lead / senior scriptwriter, ChatGPT = content strategy & trend rewriting, Gemini = source research, Perplexity = news aggregation, ElevenLabs = voice, Hedra/HeyGen/Higgsfield = avatar & video, n8n = automation, Google Drive/Notion = database.
**Rationale:** No single model reliably performs research, strategy, and long-form writing at production quality simultaneously; splitting by strength avoids forcing one model outside its competence.
**Note:** This was the original proposal before the repository/agent-pipeline architecture (D-002) was adopted. The *tool* assignments are still open (see `OPEN_QUESTIONS.md` OQ-001) — what's locked is the *principle* that this is a multi-tool pipeline, not one model doing everything end-to-end.

### D-002 — Documentation-first, multi-file agent architecture (not a single prompt)
**Status:** Locked
**Decision:** Replace the idea of "one big prompt" with a real documentation repository: ~40–60 small, specialized files organized into numbered engine folders (`01_Core` … `10_Orchestrator`), a `standards/`-equivalent folder for cross-cutting rules (implemented in this repo as `System/`), plus shared `Knowledge/`, `Assets/`, `Prompts/`, `Templates/`.
**Rationale:** Small scoped files are easier for any AI model to load with full context, easier to maintain, easier to update in isolation (e.g. update only SEO rules without touching everything else), and this is the pattern real engineering orgs use.
**Consequence:** No engine's documentation should be collapsed back into a single mega-file. See Core Principle 4 in `AIFA_CONSTITUTION.md`.

### D-003 — Standard structure for every agent/engine file
**Status:** Locked
**Decision:** Every agent-defining document must include: Mission, Role, Responsibilities, Knowledge Base, Decision Rules, Workflows, Quality Standards, Examples/Edge Cases, Failure Recovery, Output Format, Self-Review Checklist, KPIs, Future Improvements.
**Rationale:** Makes each agent behave like a documented specialist rather than an ad hoc prompt; ensures nothing critical (failure handling, KPIs) gets forgotten.
**Reference:** Detailed in `00_System/AGENT_ENGINEERING_STANDARD.md`.

### D-004 — Sources provide facts only; voice is always original
**Status:** Locked
**Decision:** Research agents extract raw, verifiable facts. The script is always written from scratch in the presenter's own voice — never a light rewording of a source.
**Rationale:** Required to pass YouTube's 2026 authenticity policy and Instagram's Originality Score; also a copyright/plagiarism safeguard.
**Reference:** `AIFA_CONSTITUTION.md` Core Principle 1.

### D-005 — No single-shot script generation
**Status:** Locked
**Decision:** Scripts are never produced by one prompt. Standard flow: Research → Extract Facts → Audience Analysis → Hook Generation → Outline → Storytelling → CTA → Revision → Final Polish (≈8–9 steps). Content-type variants:
- **News:** RSS/X/official sources (OpenAI, Anthropic, Google, Meta, GitHub) → Research → Deduplicate → Rank → Script
- **Course/Education:** Skill Tree → Prerequisites → Lessons → Exercises → Quiz → Summary → CTA
- **Tool Review:** Problem → Tool → Features → Demo → Comparison → Pricing → Alternatives → Conclusion
**Rationale:** Single-shot generation was identified as the direct cause of generic, low-quality scripts in earlier attempts.
**Owner engine:** `04_ScriptEngine` (detailed in its four per-category workflow files).

### D-006 — Full production pipeline, agent-per-stage
**Status:** Locked
**Decision:** Canonical pipeline: News/Idea Sources → Research Agent → Topic Ranking Agent → Script Writer Agent → Reviewer Agent → Avatar Generator → Voice Generator → Video Editor → Shorts Generator → Thumbnail Agent → SEO Agent → Publisher.
**Rationale:** Mirrors how professional media-AI operations structure production; each stage has one job, making failures easier to isolate and fix.
**Mapping to repo folders:** `02_Research` → `03_IdeaEngine` → `04_ScriptEngine` → `05_Production` → `06_Marketing`/`07_SEO` → `08_Automation` (publish) → `09_QA`, orchestrated by `10_Orchestrator`.

### D-007 — Persona requires a full "Character Bible," not just a reference image
**Status:** Locked
**Decision:** The on-camera persona needs documented libraries for: character design, voice design, emotions, gestures, expressions, clothing, backgrounds, lighting, and camera angles — not just a single reference image.
**Rationale:** Visual/vocal inconsistency across videos is identified as one of the most common failure points for AI-avatar channels (breaks viewer trust, tanks retention).
**Owner file:** `System/Shima_Persona.md` (next major file after this Decisions Log and Open Questions per `TODO.md`).

### D-008 — Voice must go through a speech-optimization pipeline, never raw text-to-TTS
**Status:** Locked
**Decision:** Voice pipeline: Script → Speech Optimization → SSML markup → Emotion Tags → Pause Tags → Voice Generation. Raw script text is never sent directly to a TTS engine.
**Rationale:** Natural-sounding Persian speech (correct pacing, emotion, pauses) requires explicit markup; earlier attempts at direct TTS produced flat, unnatural-sounding narration.
**Owner engine:** `05_Production`.

### D-009 — Command-based operating model
**Status:** Provisional
**Decision:** Long-term goal is a slash-command interface (`/news`, `/course`, `/tool`, `/short`, `/review`, `/rewrite`, `/seo`, `/thumbnail`, `/post`) where each command triggers a full pre-defined workflow rather than free-form prompting.
**Rationale:** Removes dependency on the founder re-explaining workflow steps each time; makes the system operable by anyone who knows the command set.
**Status note:** Marked Provisional (not Locked) because it depends on the automation/orchestration layer (`08_Automation`, `10_Orchestrator`) which hasn't been designed yet.

### D-010 — Incremental, file-by-file delivery process
**Status:** Locked (process decision, actively in use)
**Decision:** Documentation is generated one complete file (or a tightly related small group) at a time, delivered as a downloadable file, placed into GitHub by the founder, committed, and only then does work move to the next file. No single mega-document attempts.
**Rationale:** Directly caused by model output-length limits discovered when a single 150–300 page document was attempted and failed; also produces a cleaner git history and easier review per file.
**Reference:** `TODO.md` defines the current build order.

### D-011 — Content Studio is a module, not the whole platform
**Status:** Locked
**Decision:** This repository and this Constitution govern the Content Studio module only. The broader AIFA aggregator platform (multi-model AI access product, Rial payments, Telegram-first distribution of the *platform itself*) is a separate, related workstream with its own documentation, not yet started in this repo.
**Rationale:** Keeps this documentation set scoped and shippable; avoids conflating a content-production system with a SaaS product that has entirely different technical and legal risk surfaces (e.g. sanctions-access exposure, which applies to the platform, not to Content Studio).
**Reference:** `AIFA_CONSTITUTION.md` §2 Scope Boundary.

### D-012 — Working persona name: "Shima"
**Status:** Provisional
**Decision:** Constitution v0.1 adopted "Shima" as the on-camera persona's working name (from `System/Shima_Persona.md`) and "AIFA" as the company/brand name, superseding earlier informal use of "Aifa" (آیفا) as the persona's own name.
**Rationale:** Matches the actual repository skeleton already in place; avoids inventing a third name.
**Status note:** Founder reviewed and did not object when this was flagged — treating as confirmed, but logged as Provisional rather than Locked since no explicit "yes, Shima is correct" was given. Will upgrade to Locked on explicit confirmation, or superseded if corrected.

### D-013 — Tips & Tricks script structure (fills a D-005 gap)
**Status:** Provisional
**Decision:** Tips scripts follow: Hook → Problem/Context → The Tip (step-by-step) → Quick Proof/Demo → CTA.
**Rationale:** D-005 defines script structures for Course/Education and Tool Review, and a research-pipeline shape (not a script shape) for News, but never defines a Tips structure. `04_ScriptEngine` cannot function without one. This mirrors the problem-first framing of the Course/Tool Review shapes while staying appropriately short-form.
**Owner engine:** `04_ScriptEngine`.

### D-014 — News script structure (fills a D-005 gap)
**Status:** Provisional
**Decision:** News scripts follow: Hook → What Happened → Why It Matters → Nuance/What's Next → CTA.
**Rationale:** D-005's News variant ("RSS/X/official sources → Research → Deduplicate → Rank → Script") describes the upstream research pipeline, which `DECISIONS.md`/`02_Research` now owns — it does not describe the final script's section structure, unlike the Course and Tool Review variants which do. A News-specific script shape is needed for `04_ScriptEngine` to function symmetrically with the other three categories.
**Owner engine:** `04_ScriptEngine`.

### D-015 — Every video includes Persian captions
**Status:** Provisional
**Decision:** Every rendered video carries Persian captions (burned-in or platform-native, per platform) by default.
**Rationale:** Standard practice for accessibility and for silent/autoplay viewing on social platforms (Instagram, TikTok); no prior material argues against it, and it's cheap to reverse if the founder wants otherwise.
**Owner engine:** `05_Production`.

### D-016 — Automation stages/queues; publish execution holds for QA sign-off
**Status:** Provisional
**Decision:** `08_Automation` assembles and schedules publish packages (video/asset + metadata per platform), but actual publish execution holds until `09_QA` signs off. Automation does not fire a publish on schedule alone.
**Rationale:** Reconciles `01_Core/Architecture.md`'s pipeline diagram (which places `08_Automation` before `09_QA`) with Constitution Core Principle 5 ("human review checkpoint before publish"). Without this clarification the two documents would appear to contradict each other on ordering.
**Owner engines:** `08_Automation`, `09_QA`.
**Note:** The exact review-gate placement (script only? final video only? both?) is still open — `OPEN_QUESTIONS.md` OQ-004. This decision only fixes that *some* QA gate exists before Automation's publish step, not which artifact(s) it reviews.

### D-017 — Minimum QA gate content (fills a D-016 gap)
**Status:** Provisional
**Decision:** At minimum, the QA gate established by D-016 checks the assembled publish package for: factual traceability (every claim traces to a `02_Research` fact-list entry), persona consistency (against `System/Shima_Persona.md`, where defined), category-structural compliance (against the relevant `04_ScriptEngine` workflow template), and the full `01_Core/Quality_Standards.md` checklist, independently re-verified rather than trusted from upstream self-reviews.
**Rationale:** D-016 established that a QA gate exists before publish but not what it checks. `09_QA` cannot function without a defined minimum scope. This does not resolve `OPEN_QUESTIONS.md` OQ-004 (whether additional, earlier checkpoints — e.g. script-stage — are also wanted); it only fixes what the one mandatory pre-publish gate covers.
**Owner engine:** `09_QA`.

### D-018 — Thumbnail generation is owned by 07_SEO
**Status:** Provisional
**Decision:** Thumbnail creation is owned by `07_SEO`, not a separate engine or `06_Marketing`.
**Rationale:** D-006's full pipeline names a "Thumbnail Agent" between Shorts Generator and SEO Agent, but no engine folder in the actual 10-folder structure claims it — a real gap found while writing `System/SEO_Principles.md`. Thumbnails are fundamentally a click-through/discoverability lever paired tightly with the title (both are what a viewer sees before clicking), which is `07_SEO`'s existing domain. Cheap to reassign later if it proves better owned by Production (visual asset creation) or Marketing.
**Owner engine:** `07_SEO`.

### D-019 — Default technical export specs
**Status:** Provisional
**Decision:** Default long-form export: 1080p minimum (4K if source/tooling supports it without added cost), 30fps, stereo audio AAC 192kbps or better, Persian burned-in or platform-native captions (D-015).
**Rationale:** A technical default is needed for `System/Production_Standards.md` to be useful; these are industry-standard baseline values, not brand-identity choices, so the cost of being wrong is low and easy to revise once real tooling/budget (OQ-002, OQ-003) is confirmed.
**Owner engine:** `05_Production`.

---

## Change History
- **2026-07-10 (maintenance):** Refreshed stale pointer-notes in D-001, D-003, and D-005 that still described `OPEN_QUESTIONS.md`, `AGENT_ENGINEERING_STANDARD.md`, and the `04_ScriptEngine` workflow files as not yet written. Non-substantive — no decision's status or content changed.
- **2026-07-10:** D-013 through D-019 added incrementally during the engine and `System/` build-out (see `CHANGELOG.md` v0.8–v0.15 for per-entry context).
- **2026-07-09:** Initial log created (D-001 through D-012), extracting decisions implicit in prior conversations and in `AIFA_CONSTITUTION.md` v0.1.
