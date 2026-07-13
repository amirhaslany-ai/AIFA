# Changelog

All notable changes to the AIFA Content Studio documentation are logged here, newest first. (Changes under `Platform/` — the separate aggregator-platform workstream, see D-011/D-020 — keep their own history via `docs/adr/` and git log, per its own delivery cadence; only the fact that the workstream started is logged here. `AIFA_Brain/` and `Agents/`, see D-021, follow the same convention — only major milestones are logged here, day-to-day additions live in `AIFA_Brain/12_Decisions/` and `AIFA_Brain/13_Learnings/`.)

## [0.21] - 2026-07-13
### Added
- `AIFA_Brain/`: a company-wide, cross-workstream knowledge base — 17 numbered sections (Index, Product, Business, Marketing, Research, Competitors, AI, Content, Design, Technology, API, Pricing, Decisions, Learnings, Meetings, Roadmap, Archive), each with a README stating purpose/update rules/ownership/relationships, plus a `MASTER_INDEX.md` cross-referencing every major document across Content Studio, `Platform/`, and `AIFA_Brain/` itself. Real structure only — no fabricated business/product content; see D-021.
- `Agents/`: a framework (standards, communication conventions, shared-memory design, prompt standards, knowledge-access rules) for future AI agents. No agent is implemented.
- `00_System/DECISIONS.md`: D-021 — records that `AIFA_Brain/` and `Agents/` were added as new top-level sibling folders, following D-020's precedent, without altering Content Studio's or Platform's existing structure.

## [0.20] - 2026-07-12
### Added
- `Platform/`: the AIFA aggregator platform workstream started (previously "not yet started" per D-011). Founder approved keeping it as a sibling folder in this repository rather than a separate repo. Full foundation-architecture milestone: monorepo (pnpm + Turborepo), 6 ADRs, 14 architecture docs, 4 shared packages (`@aifa/types`, `@aifa/config`, `@aifa/logger`, `@aifa/ai-provider-sdk`), `@aifa/database` (Prisma schema), `apps/api` (NestJS, hexagonal, one wired vertical slice), `apps/web` (Next.js), Docker Compose for local dev, GitHub Actions CI. No business logic (auth, wallet, pricing, real provider calls) — see `Platform/PROGRESS_REPORT.md` for full detail and remaining work.
- `00_System/DECISIONS.md`: D-020 — records that D-011's aggregator-platform workstream now has a concrete home at `Platform/`.

## [0.19] - 2026-07-10
### Added (founder uploads, logged retroactively)
- `00_System/MAINTAINER_DIRECTIVE.md` (v3.0): the maintenance-session protocol — read → audit → present findings → founder approval → implement one improvement → update governance docs → stop. Uploaded by the founder via GitHub web UI (commit `3d94b04`).
- `CLAUDE.md` (repo root): auto-loaded entry pointer routing any AI model to the governing documents and the maintenance protocol. Uploaded by the founder via GitHub web UI (commit `dcd5f35`).

### Housekeeping
- `00_System/AIFA_CONSTITUTION.md` §10: added the two new files to the living Document Index (founder-approved in session per §9.4; index-only, no structural change).
- `00_System/CLAUDE_MASTER_PROMPT.md` §7: added a cross-reference to the maintenance-session protocol.
- `TODO.md`: "Next" now points to the maintenance-session mode as the ongoing work model instead of a bare "(none)".

## [0.18] - 2026-07-10
### Housekeeping (maintenance session)
- Repo-wide staleness audit after the v0.17 build-out milestone. Refreshed every "(to be written / to be created / not yet populated)" marker that pointed at a file that now exists: `00_System/CLAUDE_MASTER_PROMPT.md` §7, `01_Core/Architecture.md`, `01_Core/Quality_Standards.md` (×2, including the hallucination-prevention pointer now aimed at `09_QA/README.md`'s actual section), `08_Automation/README.md`, `05_Production/Video_Assembly.md` (Brand_Guidelines is written; its 🔶 is the visual-identity content, not the file).
- `00_System/DECISIONS.md`: refreshed stale pointer-notes in D-001/D-003/D-005 (non-substantive) and backfilled the Change History with the 2026-07-10 D-013–D-019 additions, which had never been logged there.
- `00_System/AIFA_CONSTITUTION.md`: updated the §10 living Document Index (still claimed DECISIONS/OPEN_QUESTIONS were "not yet created" and everything else "empty skeleton") and the §5.6 "(to be created next)" parenthetical — founder-approved in session per §9.4; no structural change, so no version bump per §11.
- Audit also verified all cross-file references resolve (the bare-filename shorthand convention is consistent repo-wide; the only unresolvable references — `SUCCESS_METRICS.md`, `TOOL_SELECTION.md`, `RISKS.md` — are all explicitly flagged as not-yet-created where they appear).

## [0.17] - 2026-07-10
### Added
- `00_System/AGENT_ENGINEERING_STANDARD.md`: the detailed spec behind D-003's locked standard structure, written retroactively against the twelve-section pattern already applied consistently across all nine engine READMEs — what each section means, why it's required, and what the standard deliberately does not mandate (fixed length, founder-confirmed specifics everywhere, restating content owned elsewhere).
- `00_System/CONTENT_PRODUCTION_WORKFLOW.md`: end-to-end walkthrough of one News item from trigger to publish, naming the actual artifacts and fields each stage produces/consumes, plus a worked example of the QA-rejection routing loop and a note on exactly where the four content categories diverge from each other.

### Housekeeping
- Fixed a bug in `TODO.md`: every prior commit in this session rewrote only the single "Next" line after "Done," leaving the original stale bottom block (a duplicate, already-completed "Next"/"Blocked" list from the file's very first version) untouched and unnoticed since. Removed the stale duplicate block and refreshed "Blocked / needs founder input" to reflect the actual current set of open `🔶`/`OPEN_QUESTIONS.md` gaps.

### Milestone
- Full documentation build-out per the original `TODO.md` queue is complete: all `00_System` and `01_Core` foundational files, all ten engine folders, all `System/` cross-cutting standards, and all shared-resource READMEs are written. Remaining work is founder input on the logged `🔶`/`OPEN_QUESTIONS.md` gaps, not further unprompted documentation.

## [0.16] - 2026-07-10
### Added
- `Knowledge/README.md`: the pipeline's cross-content long-term memory — prior published content log (source of `03_IdeaEngine`'s saturation check), source reliability history, and correction log (source of `System/Content_Principles.md`'s correction policy).
- `Prompts/README.md`: reusable cross-engine instruction fragments, kept separate from engine-specific workflow instructions; flags that any tone-invoking fragment is bound by `Shima_Persona.md`'s still-open `🔶` sections.
- `Templates/README.md`: fillable skeletons implementing (not redefining) the structures already locked in `04_ScriptEngine`'s workflow files and `06_Marketing/Platform_Derivation.md`; owning workflow file is always authoritative over its template.
- `Assets/README.md`: where persona/brand binary assets would live once populated; explicitly documents that it's empty for the same reason `Shima_Persona.md` and `Brand_Guidelines.md` have open gaps, not as a separate problem.

## [0.15] - 2026-07-10
### Added
- `DECISIONS.md` D-018 (Provisional): thumbnail generation owned by `07_SEO` — fills a gap where D-006's pipeline names a "Thumbnail Agent" but no engine folder claimed it.
- `DECISIONS.md` D-019 (Provisional): default technical export specs (1080p+/30fps/AAC 192kbps+/Persian captions) as a cheap, reversible baseline pending OQ-002/OQ-003.
- `07_SEO/README.md`: added a Thumbnails section reflecting D-018 (ownership + honesty constraint).
- `System/Brand_Guidelines.md`: channel visual identity (logo, palette, typography), distinct from `Shima_Persona.md`'s on-camera character bible. Core visual identity flagged `🔶 NEEDS FOUNDER INPUT` — no logo or colors exist in any prior material.
- `System/Content_Principles.md`: editorial policy — independence from vendor/sponsorship influence, a correction policy (new — not previously specified anywhere), and controversial-topic handling (alarmism/dismissiveness both ruled out).
- `System/Marketing_Principles.md`: growth-vs-trust priority order and named anti-patterns (engagement bait, misleading previews, manufactured urgency).
- `System/Production_Standards.md`: technical export spec (D-019) and file naming/versioning conventions, distinct from `05_Production/README.md`'s process spec.
- `System/Quality_Standards.md`: explicitly scoped as the *technical/deliverable* quality axis (file integrity, spec compliance) — a different file from `01_Core/Quality_Standards.md`'s *editorial/content* axis, with the relationship spelled out to prevent confusion between the two.
- `System/SEO_Principles.md`: retention-over-clicks and viewer-first keyword philosophy underlying `07_SEO`'s process.
- `System/Token_Optimization.md`: AI-operational context/token efficiency guidance — the only `System/` file about process rather than content.

## [0.14] - 2026-07-10
### Added
- `10_Orchestrator/README.md`: full agent spec (D-003 structure, adapted for a coordination role) for the Orchestrator — category-driven workflow selection, artifact-passing sequencing, failure routing that resumes from the rejected point rather than restarting the pipeline, and pipeline-state tracking. Documents the coordination logic independent of whether it's triggered manually or (once OQ-006 resolves) via the D-009 command interface.

### Milestone
- All ten engine folders (`01_Core` through `10_Orchestrator`) now have complete specs. Remaining work: `System/` cross-cutting files, shared resource (`Knowledge/`, `Prompts/`, `Templates/`, `Assets/`) README expansions, and the two remaining `00_System` stubs (`AGENT_ENGINEERING_STANDARD.md`, `CONTENT_PRODUCTION_WORKFLOW.md`).

## [0.13] - 2026-07-10
### Added
- `DECISIONS.md` D-017 (Provisional): fixes the minimum content of the QA gate D-016 established (traceability, persona consistency, structural compliance, full Quality Standards checklist, independently re-verified) without resolving OQ-004 (how many checkpoints, exactly).
- `09_QA/README.md`: full agent spec (D-003 structure) for QA. Leads with an explicit `🔶 NEEDS FOUNDER INPUT` on review-gate scope (OQ-004) rather than inventing a placement, then builds the process around the one structurally-required gate. Includes a dedicated AI Hallucination Prevention section (numbers/statistics, direct quotes, Tool Review comparative claims, vendor-claim labeling, Course exercise verification).

## [0.12] - 2026-07-10
### Added
- `DECISIONS.md` D-016 (Provisional): Automation stages/queues publish packages, but publish execution holds for `09_QA` sign-off — reconciles `01_Core/Architecture.md`'s pipeline diagram (Automation before QA) with Constitution Core Principle 5 (human review before publish).
- `08_Automation/README.md`: full agent spec (D-003 structure) for Automation — documents pipeline shape (package assembly → scheduling → QA hold → publish execution → status logging) without assuming a specific tool, since OQ-001 (tool assignment) and OQ-003 (budget) remain unresolved. Explicitly a specification, not a running system, at this stage.

## [0.11] - 2026-07-10
### Added
- `07_SEO/README.md`: full agent spec (D-003 structure) for SEO — titles, descriptions, tags, and chapters. Chapters are derived mechanically from the script's own section structure rather than invented; title/description honesty is enforced as a hard quality gate, not a growth-hacking tradeoff.

## [0.10] - 2026-07-10
### Added
- `06_Marketing/README.md`: full agent spec (D-003 structure) for Marketing — repackages the source video into platform-specific derived assets without ever adding to or reframing away from what the video says; traceability-to-source is a hard gate.
- `06_Marketing/Platform_Derivation.md`: per-platform format/framing/tone rules for YouTube Shorts, Instagram Reels, TikTok, and Telegram — Telegram treated as a distinct text-forward format rather than a reused video caption, per its "highest-trust distribution" role in the Constitution.

## [0.9] - 2026-07-10
### Added
- `DECISIONS.md` D-015 (Provisional): every video includes Persian captions by default.
- `05_Production/README.md`: full agent spec (D-003 structure) for Production — the most tool-dependent, most gapped engine in the pipeline. Documents the 9-step workflow (ingest → Speech Optimization → SSML → Emotion Tagging → Pause Tagging → Voice Generation → Avatar Generation → Video Assembly → QA Handoff) and explicitly flags that most persona-specific content is blocked on `System/Shima_Persona.md`'s open `🔶` sections.
- `05_Production/Avatar_Pipeline.md`: tool-agnostic avatar pipeline shape; documents why configuration and per-video generation are separated, and lists exactly which gaps (persona spec, tool choice, budget) block it from running today.
- `05_Production/Voice_SSML_Pipeline.md`: the D-008 pipeline in full detail (Speech Optimization → SSML → Emotion → Pause → Voice Generation), restating the hard rule that raw script text never reaches a TTS engine directly.
- `05_Production/Video_Assembly.md`: hybrid full-screen/PiP layout, with an explicit section-to-layout mapping table for all four script categories; captions and brand-element handling.

## [0.8] - 2026-07-10
### Added
- `DECISIONS.md` D-013 (Provisional): Tips & Tricks script structure — Hook → Problem/Context → The Tip → Quick Proof/Demo → CTA. Fills a gap D-005 left open.
- `DECISIONS.md` D-014 (Provisional): News script structure — Hook → What Happened → Why It Matters → Nuance/What's Next → CTA. Clarifies that D-005's News variant describes the upstream research pipeline (owned by `02_Research`), not the script's own section structure.
- `04_ScriptEngine/README.md`: full agent spec (D-003 structure) for the highest-value engine — the universal 9-step writing process (Research → Extract Facts → Audience Analysis → Hook Generation → Outline → Storytelling → CTA → Revision → Final Polish), decision rules (no skipped steps, D-004 phrasing-proximity rule, tone-gap handling against `Shima_Persona.md`'s open sections), final script output schema.
- `04_ScriptEngine/News_Workflow.md`, `Course_Workflow.md`, `ToolReview_Workflow.md`, `Tips_Workflow.md`: the four category-specific structural templates, each cross-referencing its owning decision and the matching `02_Research` workflow it builds on.

## [0.7] - 2026-07-10
### Added
- `03_IdeaEngine/README.md`: full agent spec (D-003 structure) for the Idea Engine — mission, role, responsibilities, decision rules (factual-anchor minimum, single-angle rule, no hype-only angles, mandatory saturation check), content-brief output schema, KPIs.
- `03_IdeaEngine/Topic_Selection.md`: how Research's fact-list becomes candidate topic/angle pairs before scoring.
- `03_IdeaEngine/Viral_Psychology.md`: general engagement principles (curiosity gap, pattern interrupt, stakes/relevance, specificity, social proof, contrarian framing) subordinated to the honesty mandate.
- `03_IdeaEngine/Hook_System.md`: hook-direction type library; explicitly splits "choosing the lever" (Idea Engine) from "writing the hook line" (Script Engine's future Hook Generation step) to avoid duplicating with `04_ScriptEngine`.
- `03_IdeaEngine/Trend_Scoring.md`: scoring rubric for ranking candidates; flags cadence-fit factor as provisional pending OQ-005.

## [0.6] - 2026-07-10
### Added
- `02_Research/README.md`: full agent spec (D-003 structure) for the Research engine — mission, role, responsibilities, decision rules (corroboration thresholds, conflicting-source handling, vendor-claim labeling), fact-list output schema, KPIs.
- `02_Research/Methodology.md`: the general five-step research procedure (source discovery → extraction → verification → deduplication → ranking) that every content category specializes.
- `02_Research/Source_Reliability.md`: four-tier source reliability system with concrete source sets per category; flags OQ-001 as affecting tool assignment, not the tiering logic itself.
- `02_Research/Workflows.md`: the four per-content-type research workflows (news, course, tool review, tips), each ending in the shared fact-list artifact schema.

## [0.5] - 2026-07-10
### Added
- `00_System/CLAUDE_MASTER_PROMPT.md`: operating instructions for any AI model working in this repo — read order, non-negotiable working rules, decision/question handling, file-writing checklist, commit discipline.
- `System/Shima_Persona.md`: character bible skeleton per D-007 (identity overview, personality/tone framework, character design, voice design, emotion library, gesture/expression library, wardrobe, backgrounds, lighting, camera angles). Most sections are explicitly gapped `🔶 NEEDS FOUNDER INPUT` rather than filled with invented specifics — no reference image, voice tool, verbal tics, or visual identity exists in any prior material reviewed.
- `00_System/OPEN_QUESTIONS.md`: OQ-009 — AI-disclosure framing for Shima (new gap surfaced while writing the persona file).

## [0.4] - 2026-07-09
### Added
- `01_Core/README.md`, `Vision.md`, `Architecture.md`, `Decision_Framework.md`, `Quality_Standards.md`: foundational reference material inherited by every engine — vision/differentiation thesis, full pipeline architecture and stage responsibilities, the meta-rules behind `DECISIONS.md`, and the general quality bar for scripts/video/brand/platform exports.

### Housekeeping
- Backfilled this file and `TODO.md` to reflect work completed in commits `962b7a4` and `55b8c5e` (DECISIONS.md, OPEN_QUESTIONS.md) that had not been logged here at the time.

## [0.3] - 2026-07-09
### Added
- `00_System/OPEN_QUESTIONS.md`: OQ-001 through OQ-008 — tool assignments, avatar/voice tooling, budget, human review gate scope, cadence targets, command-interface timing, multi-language timing, platform-sequencing.
### Note
- Commit `55b8c5e` message says "Lock D-012," but `DECISIONS.md` D-012 is still recorded as **Provisional** (founder reviewed and did not object, but gave no explicit "yes, Shima is correct"). Leaving as Provisional since the file is the source of truth over the commit message; will upgrade to Locked on explicit confirmation.

## [0.2] - 2026-07-09
### Added
- `00_System/DECISIONS.md`: D-001 through D-012, extracting decisions already implicit in prior conversations and in `AIFA_CONSTITUTION.md` v0.1.

## [0.1] - 2026-07-09
### Added
- `00_System/AIFA_CONSTITUTION.md` (v0.1): first canonical governance document. Defines scope boundary (Content Studio module vs. the larger AIFA aggregator platform), core principles, content categories, platform roles, high-level architecture map, AI handover protocol, and living document index.
- `TODO.md`: build order for remaining repository documentation.
- `CHANGELOG.md`: this file.

### Flagged for resolution
- Persona naming discrepancy: prior conversations used "Aifa," repo skeleton uses `Shima_Persona.md`. Constitution treats "Shima" as the on-camera persona name and "AIFA" as the company/brand name pending confirmation. See `TODO.md` blocked items.
