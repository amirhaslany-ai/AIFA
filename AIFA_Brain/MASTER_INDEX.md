# Master Index

| Field | Value |
|---|---|
| **Title** | Master Index |
| **Created** | 2026-07-13 |
| **Updated** | 2026-07-13 |
| **Owner** | AIFA_Brain maintainers (see `00_Index/README.md`) |
| **Status** | Active |
| **Version** | 1.1 |
| **Dependencies** | none |
| **Related Docs** | `README.md`, `00_Index/NAVIGATION.md`, `00_Index/KNOWLEDGE_SYNC_POLICY.md` |
| **Tags** | `index, navigation, governance` |

The single entry point to every major document in this repository, organized by category. Rebuilt/extended whenever a document is added anywhere it should be discoverable from (see `README.md`'s update rules). Links are relative to this file's location (`AIFA_Brain/`).

---

## Governance (repository-wide)

| Doc | What it is |
|---|---|
| [`00_Index/KNOWLEDGE_SYNC_POLICY.md`](00_Index/KNOWLEDGE_SYNC_POLICY.md) | **Locked founder policy** — GitHub is the single source of truth; what "done" means for every task (record → cross-link → commit → push at milestones). Decision `G-001`. |
| [`../CLAUDE.md`](../CLAUDE.md) | Repo-root entry pointer — routes any AI model to the right governing documents for whichever workstream it's working in. |
| [`../00_System/AIFA_CONSTITUTION.md`](../00_System/AIFA_CONSTITUTION.md) | Highest-authority governance document — Content Studio scope, principles, core rules. |
| [`../00_System/DECISIONS.md`](../00_System/DECISIONS.md) | The company's Decisions Log — every settled decision since the repository began, including D-011 (Content Studio/Platform separation), D-020 (Platform's placement), D-021 (this folder's placement). |
| [`../00_System/OPEN_QUESTIONS.md`](../00_System/OPEN_QUESTIONS.md) | What's still unresolved, repository-wide. |
| [`../00_System/MAINTAINER_DIRECTIVE.md`](../00_System/MAINTAINER_DIRECTIVE.md) | How to run a Content Studio maintenance/audit session. |
| [`../00_System/CLAUDE_MASTER_PROMPT.md`](../00_System/CLAUDE_MASTER_PROMPT.md) | Operating instructions for any AI model working in Content Studio. |

## AIFA Content Studio (the content-production workstream)

| Doc | What it is |
|---|---|
| [`../01_Core/Vision.md`](../01_Core/Vision.md), [`Architecture.md`](../01_Core/Architecture.md), [`Decision_Framework.md`](../01_Core/Decision_Framework.md), [`Quality_Standards.md`](../01_Core/Quality_Standards.md) | Foundational Content Studio docs. |
| [`../System/Shima_Persona.md`](../System/Shima_Persona.md) | The on-camera persona's character bible — highest authority alongside the Constitution. |
| [`../02_Research/`](../02_Research/README.md) → [`../10_Orchestrator/`](../10_Orchestrator/README.md) | The ten numbered engine folders — research, idea generation, scripting, production, marketing, SEO, automation, QA, orchestration. Each has its own `README.md` as its entry point. |
| [`../System/`](../System/Brand_Guidelines.md) | Cross-cutting standards: brand, content principles, marketing principles, production standards, quality standards, SEO principles, token optimization. |
| [`../Knowledge/README.md`](../Knowledge/README.md), [`../Prompts/README.md`](../Prompts/README.md), [`../Templates/README.md`](../Templates/README.md), [`../Assets/README.md`](../Assets/README.md) | Shared resources: cross-content memory, reusable prompts, templates, brand assets. |
| [`../00_System/AGENT_ENGINEERING_STANDARD.md`](../00_System/AGENT_ENGINEERING_STANDARD.md) | The spec behind every engine document's standard 12-section structure. |
| [`../00_System/CONTENT_PRODUCTION_WORKFLOW.md`](../00_System/CONTENT_PRODUCTION_WORKFLOW.md) | End-to-end walkthrough of one piece of content from trigger to publish. |
| [`../CHANGELOG.md`](../CHANGELOG.md), [`../TODO.md`](../TODO.md) | Content Studio's change history and build queue. |

## AIFA Platform (the software/aggregator-product workstream)

| Doc | What it is |
|---|---|
| [`../Platform/README.md`](../Platform/README.md) | Platform's own entry point. |
| [`../Platform/docs/adr/`](../Platform/docs/adr/0001-platform-separation.md) | 15 Architecture Decision Records — start at `0001`. |
| [`../Platform/docs/architecture/`](../Platform/docs/architecture/00-overview.md) | ~24 standing architecture/standards documents — start at `00-overview.md`. |
| [`../Platform/ARCHITECTURE_FREEZE.md`](../Platform/ARCHITECTURE_FREEZE.md) | The frozen architecture record — version, frozen ADR list, non-goals, immutable decisions, technical completion score. |
| [`../Platform/FINAL_TECHNICAL_DEBT.md`](../Platform/FINAL_TECHNICAL_DEBT.md) | Current, ranked technical debt. |
| [`../Platform/POST_FREEZE_BACKLOG.md`](../Platform/POST_FREEZE_BACKLOG.md) | What's next for Platform, phased. |
| [`../Platform/FOUNDER_NEXT_STEP.md`](../Platform/FOUNDER_NEXT_STEP.md) | The recommended next move after the freeze — directly relevant to `01_Product/`, `02_Business/`, and `15_Roadmap/` below. |
| [`../Platform/HANDOVER/14_EXECUTIVE_SUMMARY.md`](../Platform/HANDOVER/14_EXECUTIVE_SUMMARY.md) | 3-page architecture-review summary for a first-time reader. |
| [`../Platform/CURRENT_IMPLEMENTATION_STATUS.md`](../Platform/CURRENT_IMPLEMENTATION_STATUS.md) | Per-subsystem implementation status with honest percentages. |
| [`../Platform/REPOSITORY_MANIFEST.md`](../Platform/REPOSITORY_MANIFEST.md) | Platform's own complete directory/dependency manifest. |

## Product

| Doc | What it is |
|---|---|
| [`01_Product/README.md`](01_Product/README.md) | Product section entry point — currently structure-only; see `Platform/HANDOVER/12_OPEN_DECISIONS.md` for the open product questions awaiting founder input. |

## Business

| Doc | What it is |
|---|---|
| [`02_Business/README.md`](02_Business/README.md) | Business section entry point. |
| [`02_Business/Business_Model/`](02_Business/Business_Model/README.md), [`Financial_Planning/`](02_Business/Financial_Planning/README.md), [`Go_To_Market/`](02_Business/Go_To_Market/README.md), [`Legal/`](02_Business/Legal/README.md), [`Risk/`](02_Business/Risk/README.md), [`Partnerships/`](02_Business/Partnerships/README.md) | Six business sub-areas, each with a template. |

## Marketing

| Doc | What it is |
|---|---|
| [`03_Marketing/README.md`](03_Marketing/README.md) | Company-level marketing (distinct from Content Studio's `06_Marketing/`, which is about promoting Shima's content specifically). |

## Research

| Doc | What it is |
|---|---|
| [`04_Research/README.md`](04_Research/README.md) | Research section entry point. |
| [`04_Research/Market_Research/`](04_Research/Market_Research/README.md), [`User_Research/`](04_Research/User_Research/README.md), [`Technology_Research/`](04_Research/Technology_Research/README.md), [`Pricing_Research/`](04_Research/Pricing_Research/README.md), [`API_Research/`](04_Research/API_Research/README.md) | Five research sub-areas, each with a template. Competitor research lives in `05_Competitors/` instead (see below), not duplicated here. |

## Competitors

| Doc | What it is |
|---|---|
| [`05_Competitors/README.md`](05_Competitors/README.md) | Competitive intelligence entry point, with `TEMPLATE_Competitor_Profile.md`. |

## AI Strategy

| Doc | What it is |
|---|---|
| [`06_AI/README.md`](06_AI/README.md) | Cross-cutting AI/ML strategy (distinct from `Platform/`'s AI provider code and `Platform/docs/adr/0005-ai-provider-abstraction.md`'s implementation decision). |

## Content Strategy

| Doc | What it is |
|---|---|
| [`07_Content/README.md`](07_Content/README.md) | Company-level content strategy (distinct from Content Studio's production pipeline, which owns actual content). |

## Design

| Doc | What it is |
|---|---|
| [`08_Design/README.md`](08_Design/README.md) | Cross-product design system and visual identity. |

## Technology Strategy

| Doc | What it is |
|---|---|
| [`09_Technology/README.md`](09_Technology/README.md) | Company-level technology strategy (distinct from `Platform/docs/architecture/`, which is Platform-specific implementation). |

## API Strategy

| Doc | What it is |
|---|---|
| [`10_API/README.md`](10_API/README.md) | Public/partner-facing API strategy (distinct from `Platform/docs/architecture/api-architecture.md`, which is internal implementation). |

## Pricing

| Doc | What it is |
|---|---|
| [`11_Pricing/README.md`](11_Pricing/README.md) | The real business pricing model — the decisions `Platform/docs/architecture/pricing-architecture.md`'s engine is waiting for. |

## Decisions

| Doc | What it is |
|---|---|
| [`12_Decisions/README.md`](12_Decisions/README.md) | How the four decision logs relate to each other and to `00_System/DECISIONS.md` / `Platform/docs/adr/`. |
| [`12_Decisions/DECISION_LOG.md`](12_Decisions/DECISION_LOG.md) | General/cross-cutting decisions that aren't purely architecture, business, or product. |
| [`12_Decisions/ARCHITECTURE_DECISION_LOG.md`](12_Decisions/ARCHITECTURE_DECISION_LOG.md) | Company-level architecture decisions spanning both workstreams (each workstream's own internal ADRs stay in `Platform/docs/adr/` and Content Studio's own docs). |
| [`12_Decisions/BUSINESS_DECISION_LOG.md`](12_Decisions/BUSINESS_DECISION_LOG.md) | Business decisions. |
| [`12_Decisions/PRODUCT_DECISION_LOG.md`](12_Decisions/PRODUCT_DECISION_LOG.md) | Product decisions. |

## Learnings

| Doc | What it is |
|---|---|
| [`13_Learnings/README.md`](13_Learnings/README.md) | Retrospectives and postmortems. |

## Meetings

| Doc | What it is |
|---|---|
| [`14_Meetings/README.md`](14_Meetings/README.md) | Meeting notes entry point, with `TEMPLATE_Meeting_Notes.md`. |

## Roadmap

| Doc | What it is |
|---|---|
| [`15_Roadmap/README.md`](15_Roadmap/README.md) | The cross-workstream roadmap. |

## Archive

| Doc | What it is |
|---|---|
| [`16_Archive/README.md`](16_Archive/README.md) | Superseded documents, never deleted. |

## Agents (future framework, not yet implemented)

| Doc | What it is |
|---|---|
| [`../Agents/README.md`](../Agents/README.md) | Entry point. |
| [`../Agents/AGENT_STANDARDS.md`](../Agents/AGENT_STANDARDS.md), [`AGENT_COMMUNICATION.md`](../Agents/AGENT_COMMUNICATION.md), [`SHARED_MEMORY.md`](../Agents/SHARED_MEMORY.md), [`PROMPT_STANDARDS.md`](../Agents/PROMPT_STANDARDS.md), [`KNOWLEDGE_ACCESS_RULES.md`](../Agents/KNOWLEDGE_ACCESS_RULES.md) | The framework — no agent is implemented against it yet. |
