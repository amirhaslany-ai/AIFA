# Decision Framework
**Document ID:** 01_Core/Decision_Framework.md
**Inherits from:** `00_System/AIFA_CONSTITUTION.md` §5, §9

## Purpose

This file defines *how* decisions get made and logged — the process behind `00_System/DECISIONS.md`, not the decisions themselves.

## Decision statuses

- **Locked** — settled. Changing it requires an explicit new founder decision, logged as a new entry that supersedes the old one. Never edit a Locked entry's substance in place; add a new one.
- **Provisional** — a working assumption, adopted so work can proceed, but expected to be revisited once missing information (budget, tool testing, etc.) arrives. Safe to build on, but flag dependent work as "built on a Provisional assumption" where it matters.
- **Superseded** — replaced. Kept in the log for history; never deleted.

## Who decides what

- **Founder (Amir Hosein):** sole authority on scope, budget, brand/persona identity, and anything marked Locked. Nothing in this category should be decided autonomously by an AI model, even provisionally — flag it in `OPEN_QUESTIONS.md` instead.
- **AI model executing a task (Claude or otherwise):** may make Provisional decisions when a reasonable default is needed to keep moving (per this repo's own working style — see `00_System/AIFA_CONSTITUTION.md` §9 AI Handover Protocol), but must log every such decision in `DECISIONS.md` immediately, not silently.

## When to open a question vs. make a Provisional decision

Ask (open a question in `OPEN_QUESTIONS.md`) when:
- The choice is expensive or hard to reverse (tool subscriptions, persona identity, brand naming).
- Multiple reasonable defaults exist and picking wrong would mean redoing downstream work.

Make a Provisional decision and proceed when:
- A default is needed to keep a document/pipeline coherent, and choosing wrong just means editing one file later, not redoing multiple dependents.
- The uploaded source material (prior conversations) already leans clearly toward an answer, even if not explicitly confirmed.

## Escalation path

1. AI model identifies a gap or conflict.
2. If it fits "Provisional decision" criteria above → make the call, log it in `DECISIONS.md`, mark Provisional, continue.
3. If it fits "ask" criteria → log it in `OPEN_QUESTIONS.md`, do **not** block unrelated work waiting for an answer — continue with other files and revisit once answered.
4. Founder answers → the question moves from `OPEN_QUESTIONS.md` to a new or upgraded entry in `DECISIONS.md`, marked Locked.

## Anti-patterns this framework exists to prevent

- **Re-litigating closed decisions** without new information (explicitly warned against in Constitution §9).
- **Silent assumption-stacking** — building three files' worth of work on top of an unconfirmed guess without flagging it, so that when the guess turns out wrong, three files need rework instead of one Provisional entry needing an update.
- **Decision paralysis** — treating every uncertainty as blocking. Most uncertainties should become Provisional decisions, not stalled work.

## Cross-references
- The actual decision log: `00_System/DECISIONS.md`
- The actual open-questions log: `00_System/OPEN_QUESTIONS.md`
- AI Handover Protocol (who reads what, in what order): `00_System/AIFA_CONSTITUTION.md` §9
