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
**Note:** This was the original proposal before the repository/agent-pipeline architecture (D-002) was adopted. The *tool* assignments are still open (see `OPEN_QUESTIONS.md`, to be created) — what's locked is the *principle* that this is a multi-tool pipeline, not one model doing everything end-to-end.

### D-002 — Documentation-first, multi-file agent architecture (not a single prompt)
**Status:** Locked
**Decision:** Replace the idea of "one big prompt" with a real documentation repository: ~40–60 small, specialized files organized into numbered engine folders (`01_Core` … `10_Orchestrator`), a `standards/`-equivalent folder for cross-cutting rules (implemented in this repo as `System/`), plus shared `Knowledge/`, `Assets/`, `Prompts/`, `Templates/`.
**Rationale:** Small scoped files are easier for any AI model to load with full context, easier to maintain, easier to update in isolation (e.g. update only SEO rules without touching everything else), and this is the pattern real engineering orgs use.
**Consequence:** No engine's documentation should be collapsed back into a single mega-file. See Core Principle 4 in `AIFA_CONSTITUTION.md`.

### D-003 — Standard structure for every agent/engine file
**Status:** Locked
**Decision:** Every agent-defining document must include: Mission, Role, Responsibilities, Knowledge Base, Decision Rules, Workflows, Quality Standards, Examples/Edge Cases, Failure Recovery, Output Format, Self-Review Checklist, KPIs, Future Improvements.
**Rationale:** Makes each agent behave like a documented specialist rather than an ad hoc prompt; ensures nothing critical (failure handling, KPIs) gets forgotten.
**Reference:** Detailed in `00_System/AGENT_ENGINEERING_STANDARD.md` (not yet populated — next after this file per `TODO.md`).

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
**Owner engine:** `04_ScriptEngine` (detailed workflows to be written there per `TODO.md`).

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

---

## Change History
- **2026-07-09:** Initial log created (D-001 through D-012), extracting decisions implicit in prior conversations and in `AIFA_CONSTITUTION.md` v0.1.
