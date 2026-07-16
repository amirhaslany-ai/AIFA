# AIFA

The permanent source of truth for the AIFA company — an AI-first media and software operating system, spanning a content-production studio, a multi-model AI aggregator platform, and the company-wide knowledge base that ties them together.

**New here? Start with [`CLAUDE.md`](CLAUDE.md)** — the entry pointer that routes any AI model (or human) to the right governing documents for whichever part of this repository you're working in.

## Repository map

This repository holds four things, each with its own governance and its own pace of change:

| Area | What it is | Entry point | Governed by |
|---|---|---|---|
| **AIFA Content Studio** | The Persian-language AI-education/news content-production system, hosted by the persona Shima. | [`01_Core/README.md`](01_Core/README.md) → the ten numbered engine folders (`02_Research/` → `10_Orchestrator/`) | [`00_System/AIFA_CONSTITUTION.md`](00_System/AIFA_CONSTITUTION.md), [`00_System/MAINTAINER_DIRECTIVE.md`](00_System/MAINTAINER_DIRECTIVE.md) |
| **AIFA Platform** | The multi-model AI aggregator product — a real, tested NestJS/Next.js monorepo (Auth, Wallet, Pricing, Provider Access, Chat, Usage Tracking implemented; architecture frozen). | [`Platform/README.md`](Platform/README.md) → [`Platform/ARCHITECTURE_FREEZE.md`](Platform/ARCHITECTURE_FREEZE.md) | `Platform/docs/adr/` (its own ADR log) |
| **AIFA Brain** | The company-wide, cross-workstream knowledge base — product, business, marketing, research, competitors, decisions, roadmap. References both workstreams above; owns neither. | [`AIFA_Brain/README.md`](AIFA_Brain/README.md) → [`AIFA_Brain/MASTER_INDEX.md`](AIFA_Brain/MASTER_INDEX.md) | `AIFA_Brain/00_Index/` (its own standards) |
| **Agents** | A framework for future AI agents — standards, communication, shared memory, prompt conventions, access rules. No agent is implemented yet. | [`Agents/README.md`](Agents/README.md) | Same governance as whatever scope an agent operates in (see `Agents/KNOWLEDGE_ACCESS_RULES.md`) |

## Full top-level structure

```
AIFA/
├── CLAUDE.md                    Repo-root entry pointer — read this first
├── 00_System/                   Content Studio governance: Constitution, Decisions Log, Open Questions
├── 01_Core/ … 10_Orchestrator/  Content Studio's ten production engines
├── System/                      Content Studio cross-cutting standards (persona, brand, SEO, etc.)
├── Knowledge/, Prompts/,        Content Studio shared resources
│   Templates/, Assets/
├── Platform/                    AIFA Platform — the software product (its own monorepo, ADRs, freeze docs)
├── AIFA_Brain/                  Company-wide knowledge base (product/business/marketing/research/decisions/roadmap)
├── Agents/                      Future-agent framework (no implementation)
├── CHANGELOG.md, TODO.md        Content Studio's own change history and build queue
└── README.md                    This file
```

## How the pieces relate (read this before assuming two similarly-named things are the same)

- **Content Studio and Platform are deliberately separate** (`00_System/DECISIONS.md` D-011, D-020) — different technical/legal risk surfaces, different governance cadence. Neither restructures the other.
- **`AIFA_Brain/` and `Agents/` are a third, additive layer** (`00_System/DECISIONS.md` D-021) — they reference both workstreams and hold what neither one owns (company business/product/marketing strategy, cross-workstream decisions, and the future-agent framework), without merging, moving, or duplicating either workstream's own governed content.
- Where a folder name looks similar across areas (e.g. `AIFA_Brain/03_Marketing/` vs. Content Studio's `06_Marketing/`, or `AIFA_Brain/12_Decisions/` vs. `00_System/DECISIONS.md` vs. `Platform/docs/adr/`), the scope is genuinely different — see `AIFA_Brain/00_Index/NAVIGATION.md` for the precise distinctions.

## Where to actually start, by role

- **Working on Content Studio content/pipeline:** `00_System/CLAUDE_MASTER_PROMPT.md`, then the relevant engine folder.
- **Working on Platform software:** `Platform/README.md` → `Platform/FINAL_REVIEW/CTO_REVIEW_INDEX.md` for a full architecture review, or `Platform/docs/adr/0001-platform-separation.md` onward for the decision history.
- **Working on business/product/marketing/research:** `AIFA_Brain/README.md` → `AIFA_Brain/MASTER_INDEX.md`.
- **Want the market/strategy picture fast:** [`AIFA_Brain/04_Research/Market_Intelligence/01_Executive_Intelligence_Report.md`](AIFA_Brain/04_Research/Market_Intelligence/01_Executive_Intelligence_Report.md) — the single-document synthesis of the whole Market Intelligence Foundation (opportunities, threats, product/business/technology conclusions, go/no-go). Its evidence base is the 12-document study in [`AIFA_Brain/04_Research/Market_Intelligence/`](AIFA_Brain/04_Research/Market_Intelligence/README.md).
- **Deciding what to work on next:** `AIFA_Brain/15_Roadmap/README.md`, and `Platform/FOUNDER_NEXT_STEP.md`'s explicit recommendation on current priority.
- **Recording a decision:** the right log per `AIFA_Brain/12_Decisions/README.md`'s scoping rule (Content Studio's own → `00_System/DECISIONS.md`; Platform's own → `Platform/docs/adr/`; genuinely company-level or cross-workstream → `AIFA_Brain/12_Decisions/`).
