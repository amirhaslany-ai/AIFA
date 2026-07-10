# AIFA Constitution
**Document ID:** 00_System/AIFA_CONSTITUTION.md
**Version:** 0.1
**Status:** Draft — first canonical version
**Owner:** Amir Hosein (Founder, sole decision-maker)
**Scope of this document:** Content Studio module only (see §2 Scope Boundary)

> This is the top-level governance document of the AIFA repository. Every other file in this repository — every engine README, every standard, every prompt — must be consistent with this document. If a conflict is found between this document and any other file, this document wins until the conflict is resolved and logged in `00_System/DECISIONS.md`.

---

## 1. Executive Summary

AIFA Content Studio is an AI-native content production system that produces Persian-language educational and news content about artificial intelligence, hosted by a fixed AI presenter persona, and distributed across YouTube, Instagram, TikTok, and Telegram.

It is not a single prompt and not a single AI model. It is a **pipeline of specialized agents** (Research → Idea → Script → Production → Marketing → SEO → Automation → QA → Orchestration), each with its own knowledge base, decision rules, and quality standards, coordinated by a human founder acting as editor-in-chief.

Content Studio is a **module** inside the larger AIFA platform (a multi-model AI aggregator, comparable to OpenRouter/Poe/SYNTX for the Persian market). Content Studio's job is to produce the content that establishes AIFA's brand authority and drives distribution; the aggregator platform is the product AIFA ultimately monetizes. The two are connected but independently deliverable — see §2.

## 2. Scope Boundary

**In scope for Content Studio / this constitution:**
- Research, scripting, production, and publishing of AI-education and AI-news content
- The AI presenter persona (brand, voice, visual identity — canonical file: `System/Shima_Persona.md`)
- The content production pipeline and its agents (folders `01_Core` through `10_Orchestrator`)
- Platform-specific distribution (YouTube, Instagram, TikTok, Telegram)

**Out of scope for this document (governed elsewhere, once written):**
- The AIFA aggregator platform itself (multi-model chat product, billing, Rial payments, provider integrations) — this will get its own constitution/master doc when that workstream resumes
- Any legal/sanctions-exposure analysis of AI provider access — tracked separately in that platform's `RISKS.md` when created

**Open naming question (flagging, not blocking):** earlier discussions referenced the presenter persona as "Aifa" (آیفا); the current repo skeleton has `System/Shima_Persona.md`. This constitution treats **Shima** as the working name of the on-camera persona and **AIFA** as the name of the company/brand/platform, since that's what the repo structure implies. If that's wrong, correct it and I'll propagate the fix — this is exactly the kind of ambiguity `DECISIONS.md` exists to resolve permanently.

## 3. Vision

To become the most trusted Persian-language source for AI news and AI education — the channel Persian speakers default to when they want to understand what's happening in AI or learn how to use it.

## 4. Mission

Produce AI-education and AI-news content at a consistency, accuracy, and production quality that a solo creator cannot sustain manually — by encoding editorial judgment, brand voice, and production standards into a repeatable, auditable agent pipeline, rather than depending on ad hoc prompting.

## 5. Core Principles (non-negotiable, cited by all agents)

1. **Sources provide facts, not voice.** Research agents extract only verifiable facts. Every script is written from scratch in Shima's voice — never lightly reworded from a source. This exists specifically to satisfy YouTube's 2026 authenticity policy and Instagram's Originality Score.
2. **No single-shot generation.** No script, video, or post is produced in one model call. Every content type has a defined multi-step workflow (see `04_ScriptEngine` for script workflows; news, course, and tool-review variants differ — see `02_Research/README.md`).
3. **Persona consistency over speed.** Shima's appearance, voice, gestures, and tone must be identical across every video. Any new visual/vocal asset must be checked against `System/Shima_Persona.md` before use.
4. **Small, specialized files over large generalist prompts.** Each agent gets a scoped knowledge base and a single responsibility. This repository structure *is* the enforcement mechanism for that principle — do not collapse folders back into monolithic docs.
5. **Human review checkpoint before publish.** Full autonomy is a future-state goal, not a v1 requirement. See `09_QA/README.md` for the current review gate.
6. **Every architectural decision is logged.** Nothing gets silently changed. See `00_System/DECISIONS.md`.

## 6. Content Categories

| Category | Cadence (target) | Core question it answers |
|---|---|---|
| News | Every 3 days | "What happened in AI recently and why does it matter?" |
| Tool Reviews | TBD | "Should I use this tool, and how?" |
| Courses / Mini-courses | TBD | "How do I actually do X with AI?" |
| Tips & Tricks | TBD | "What's a fast win I didn't know about?" |

Cadence targets are placeholders pending `SUCCESS_METRICS.md` — do not treat as committed until that file exists.

## 7. Platform Roles

| Platform | Role |
|---|---|
| YouTube | Primary long-form home; source of truth video |
| YouTube Shorts | Derived from long-form; top-of-funnel discovery |
| Instagram Reels | Derived; discovery + brand presence |
| TikTok | Derived; discovery, younger audience |
| Telegram | Owned-audience channel; text + derived assets; highest-trust distribution, least platform-algorithm risk |

## 8. High-Level Architecture

```
02_Research → 03_IdeaEngine → 04_ScriptEngine → 05_Production → 06_Marketing → 07_SEO → 08_Automation → 09_QA → 10_Orchestrator
```
`01_Core` holds architecture, decision framework, and quality standards referenced by all engines. `Knowledge/`, `Assets/`, `Prompts/`, `Templates/` are shared resources pulled by multiple engines rather than owned by one.

Each engine folder's own `README.md` is the authoritative spec for that engine and must reference this constitution rather than restate it.

## 9. AI Handover Protocol

Any AI model (Claude, GPT, Gemini, or other) or human contributor picking up this repository must:
1. Read this file first, in full.
2. Read `00_System/CLAUDE_MASTER_PROMPT.md` for operating instructions.
3. Read `00_System/DECISIONS.md` before proposing anything that resembles a past decision — do not re-litigate a closed decision without flagging it explicitly as a proposed change and stating what new information justifies revisiting it.
4. Not modify `System/Shima_Persona.md` or this file without the founder's explicit approval — these two are the highest-authority documents in the repo.
5. Add unresolved questions to `00_System/OPEN_QUESTIONS.md` rather than silently assuming an answer.

## 10. Document Index (living — update when new files land)

| File | Status |
|---|---|
| `00_System/AIFA_CONSTITUTION.md` | v0.1 — this file |
| `00_System/DECISIONS.md` | Active — D-001 through D-019 |
| `00_System/OPEN_QUESTIONS.md` | Active — OQ-001 through OQ-009, none yet resolved |
| `00_System/CLAUDE_MASTER_PROMPT.md` | Written |
| `00_System/CONTENT_PRODUCTION_WORKFLOW.md` | Written |
| `00_System/AGENT_ENGINEERING_STANDARD.md` | Written |
| `00_System/MAINTAINER_DIRECTIVE.md` | v3.0 — maintenance-session protocol |
| `CLAUDE.md` (repo root) | Written — entry pointer routing to the governing documents |
| `System/Shima_Persona.md` | Written — multiple sections 🔶 NEEDS FOUNDER INPUT (OQ-002, OQ-007, OQ-009) |
| `System/Brand_Guidelines.md`, `Content_Principles.md`, `Marketing_Principles.md`, `Production_Standards.md`, `Quality_Standards.md`, `SEO_Principles.md`, `Token_Optimization.md` | Written — `Brand_Guidelines.md` visual identity 🔶 NEEDS FOUNDER INPUT |
| `01_Core` – `10_Orchestrator` (READMEs + supporting files) | Written — tool-dependent sections in `05_Production`/`08_Automation` gapped 🔶 pending OQ-001/OQ-002/OQ-003 |
| `Knowledge/`, `Prompts/`, `Templates/`, `Assets/` READMEs | Written |

## 11. Versioning

This document changes version on any structural change (scope, principles, architecture). Content additions to lower-level files do not require bumping this version. Log every version bump as a line in `00_System/DECISIONS.md`.

---
*Next recommended file: `00_System/DECISIONS.md`, to capture the assumptions and decisions already implicit in this constitution and in prior conversations, followed by `00_System/OPEN_QUESTIONS.md`.*
