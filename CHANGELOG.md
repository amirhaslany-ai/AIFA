# Changelog

All notable changes to the AIFA Content Studio documentation are logged here, newest first.

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
