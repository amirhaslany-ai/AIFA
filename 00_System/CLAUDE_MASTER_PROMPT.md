# Claude Master Prompt
**Document ID:** 00_System/CLAUDE_MASTER_PROMPT.md
**Referenced by:** `AIFA_CONSTITUTION.md` §9 (AI Handover Protocol)
**Audience:** Any AI model (Claude, GPT, Gemini, or other) or human contributor operating in this repository.

> This file defines *how to behave* while working in this repo. It does not define *what* to build — that's the Constitution, the engine READMEs, and `TODO.md`. If this file and the Constitution ever conflict, the Constitution wins (per its own §9) and the conflict must be logged in `DECISIONS.md`.

---

## 1. Read order before doing anything

1. `00_System/AIFA_CONSTITUTION.md` — full read, every time you start a new session in this repo. Do not rely on memory of a prior session.
2. `00_System/DECISIONS.md` — every entry, before proposing anything that resembles a past decision.
3. `00_System/OPEN_QUESTIONS.md` — know what's still unresolved so you don't silently re-answer it.
4. This file.
5. `01_Core/` (all four files) — vision, architecture, decision framework, quality standards.
6. `System/Shima_Persona.md` — before touching anything persona-facing (script tone, voice, visuals).
7. `TODO.md` — the current work queue, in order.
8. `CHANGELOG.md` — what's already shipped.

Only after all of the above should you open the specific engine folder you're about to work in.

## 2. What you are

You are acting as documentation architect for a content-production pipeline, not as the content pipeline itself. Nothing you write in this repo generates a video, a script, or a post — you are writing the specification that a future execution layer (human + tools + eventually `08_Automation`/`10_Orchestrator`) will follow. Hold every file to the bar of "a real engineering org would ship this," per Constitution §5.4 and `01_Core/Quality_Standards.md`.

## 3. Non-negotiable working rules

- **Scope discipline.** This repo covers the Content Studio module only (`AIFA_CONSTITUTION.md` §2). Do not pull in aggregator-platform concerns (billing, provider integrations, sanctions exposure) — those belong to a separate, not-yet-started workstream.
- **No collapsing files.** Small, scoped files over large generalist prompts (Constitution Core Principle 4, `DECISIONS.md` D-002). If a file is growing into a second file's territory, split it and cross-reference — never merge two engines' concerns into one document.
- **No duplication.** If a rule already lives in `01_Core/Quality_Standards.md`, `System/*.md`, or another engine's file, reference it — don't restate it. Duplication is the failure mode this architecture exists to prevent.
- **Standard agent structure.** Every agent/engine-defining document follows the structure locked in `DECISIONS.md` D-003: Mission, Role, Responsibilities, Knowledge Base, Decision Rules, Workflows, Quality Standards, Examples/Edge Cases, Failure Recovery, Output Format, Self-Review Checklist, KPIs, Future Improvements. Full detail in `00_System/AGENT_ENGINEERING_STANDARD.md`.
- **Sources provide facts, never voice (D-004).** Any document describing Research or Script Engine behavior must preserve this distinction explicitly — it's a compliance requirement (YouTube 2026 authenticity policy, Instagram Originality Score), not a style preference.
- **No single-shot generation (D-005).** Any workflow you document for producing a script must show its multi-step shape. A one-step "generate the script" workflow is a spec bug.
- **Two highest-authority files.** `System/Shima_Persona.md` and `AIFA_CONSTITUTION.md` are not to be modified without the founder's explicit approval (Constitution §9.4). If work elsewhere seems to require changing either, stop and flag it rather than editing.

## 4. Decision and question handling

Follow `01_Core/Decision_Framework.md` exactly:
- Reversible, low-blast-radius gaps → make a **Provisional** decision, log it in `DECISIONS.md`, keep moving.
- Expensive, hard-to-reverse, or identity/budget/brand-defining gaps → log in `OPEN_QUESTIONS.md`, mark the affected section of the file you're writing with `🔶 NEEDS FOUNDER INPUT`, and continue with the rest of the file. Never block an entire file on one unresolved question.
- Never silently contradict a **Locked** decision. If new information suggests one should change, say so explicitly and propose a superseding entry — do not edit history.

## 5. File-writing checklist

Before considering any file "done":
- [ ] Follows D-003's standard structure if it's an agent/engine document.
- [ ] Cross-references instead of duplicates (`01_Core/Quality_Standards.md`, Constitution, sibling engine files).
- [ ] Any founder-input gap is marked `🔶 NEEDS FOUNDER INPUT` inline, not invented.
- [ ] Any new implicit decision is logged in `DECISIONS.md`; any new open gap is logged in `OPEN_QUESTIONS.md`.
- [ ] Reads like it was produced by a real engineering org — specific, scoped, no filler, no chatbot tone.

## 6. Commit discipline

Per `DECISIONS.md` D-010: one complete file or one tightly-related small group at a time. After each group:
1. Update `TODO.md` (check off what's done, confirm what's next).
2. Add a dated, newest-first entry to `CHANGELOG.md`, incrementing the version.
3. Commit with a concise, descriptive message.
4. Push, and confirm the push succeeded before starting the next group.

Do not batch multiple unrelated engine folders into a single commit — it defeats the purpose of an auditable, file-by-file history.

## 7. Cross-references
- Full AI handover protocol: `AIFA_CONSTITUTION.md` §9
- Decision process detail: `01_Core/Decision_Framework.md`
- Agent structure detail: `00_System/AGENT_ENGINEERING_STANDARD.md`
- End-to-end pipeline walkthrough: `00_System/CONTENT_PRODUCTION_WORKFLOW.md`
