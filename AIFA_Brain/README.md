# AIFA Brain

The permanent, cross-workstream memory of the AIFA company — product, business, marketing, research, competitive intelligence, decisions, and roadmap, organized so a human or an AI model can find, trust, and extend the right document without re-deriving context from scratch.

**This is not a third product workstream.** AIFA has two governed engineering/content workstreams — **AIFA Content Studio** (`00_System/`–`10_Orchestrator/`, `System/`, governed by `00_System/AIFA_CONSTITUTION.md`) and **AIFA Platform** (`Platform/`, governed by its own ADR log) — and `AIFA_Brain/` does not merge, restructure, move, or duplicate either one. It sits alongside them as the company-wide layer that references both: where the roadmap that spans both workstreams lives, where a business decision that affects both gets recorded once instead of twice, where competitive research informs both a Content Studio positioning choice and a Platform pricing choice. See `00_System/DECISIONS.md` D-021 for the governance record of why this folder exists and how it was scoped to avoid re-opening D-011 (the Content-Studio/Platform separation).

## Start here

1. **`MASTER_INDEX.md`** — the single entry point referencing every major document across `AIFA_Brain/`, Content Studio, and `Platform/`, organized by category. If you don't know where something lives, start there.
2. **`00_Index/`** — the rules this whole system runs on: the required metadata block every document must carry, and how navigation between folders works.
3. **This README's folder map**, below, for a one-line sense of what lives where.
4. **`_templates/DOCUMENT_TEMPLATE.md`** — copy this to start any new document inside `AIFA_Brain/`.

## Folder map

| Folder | What lives here |
|---|---|
| [`00_Index/`](00_Index/README.md) | The metadata standard, navigation rules, and how this whole system stays coherent as it grows. |
| [`01_Product/`](01_Product/README.md) | Product vision, feature specs, product decisions that aren't yet business- or engineering-final. |
| [`02_Business/`](02_Business/README.md) | Business model, financial planning, go-to-market, legal, risk, partnerships. |
| [`03_Marketing/`](03_Marketing/README.md) | Positioning, campaigns, brand strategy at the company level (distinct from Content Studio's own `06_Marketing/`, which is about *promoting Shima's content*, not the company). |
| [`04_Research/`](04_Research/README.md) | Market, user, technology, pricing, and API research — with templates so every research effort produces a comparable artifact. |
| [`05_Competitors/`](05_Competitors/README.md) | Competitive intelligence — one profile per competitor, kept current. |
| [`06_AI/`](06_AI/README.md) | Cross-cutting AI/ML strategy — model selection, capability tracking, vendor relationships (distinct from `Platform/`'s AI provider *implementation*, which lives in code). |
| [`07_Content/`](07_Content/README.md) | Company-level content strategy (distinct from Content Studio's own production pipeline, which owns actual script/video content). |
| [`08_Design/`](08_Design/README.md) | Cross-product design system, brand visual identity, UX principles shared across Platform's future frontend and Content Studio's visual output. |
| [`09_Technology/`](09_Technology/README.md) | Company-level technology strategy and standards that span both engineering workstreams (distinct from `Platform/docs/architecture/`, which is Platform-specific implementation detail). |
| [`10_API/`](10_API/README.md) | Public-facing API strategy and partner/integrator-facing documentation (distinct from `Platform/docs/architecture/api-architecture.md`, which is internal implementation detail). |
| [`11_Pricing/`](11_Pricing/README.md) | The real business pricing model — markup, plans, discounts — the business decisions `Platform/docs/architecture/pricing-architecture.md`'s engine is waiting for. |
| [`12_Decisions/`](12_Decisions/README.md) | Four decision logs: general, architecture, business, product — every future significant decision gets recorded here. |
| [`13_Learnings/`](13_Learnings/README.md) | Retrospectives, postmortems, what-we-learned notes — across product, engineering, and go-to-market. |
| [`14_Meetings/`](14_Meetings/README.md) | Meeting notes, with a template so they're searchable and consistent. |
| [`15_Roadmap/`](15_Roadmap/README.md) | The cross-workstream roadmap — what's next for Content Studio, Platform, and the business, in one place. |
| [`16_Archive/`](16_Archive/README.md) | Superseded documents moved here, never deleted, so history is never lost. |

## How this relates to `Agents/`

`Agents/` (sibling folder, also new under D-021) is the framework for future AI agents that read and write to this knowledge base — standards, communication conventions, shared-memory design, and knowledge-access rules. No agent is implemented yet; `Agents/` and `AIFA_Brain/` are designed together so that when agents are built, they have a coherent, already-documented place to read from and write to, rather than requiring a redesign of this structure.

## Update rules (apply to every folder unless its own README says otherwise)

1. Every document carries the metadata block defined in `00_Index/METADATA_STANDARD.md` — no exceptions.
2. Never fabricate content to fill a gap. An empty or thin folder with an honest README is correct; invented business/product/research content is not. Flag gaps explicitly (the same discipline Content Studio's `OPEN_QUESTIONS.md` and Platform's `HANDOVER/12_OPEN_DECISIONS.md` already use).
3. Never delete a superseded document — move it to `16_Archive/` and update the links that pointed to it.
4. Update `MASTER_INDEX.md` whenever a new document is added anywhere it should be discoverable from.
5. Cross-reference with relative links, never duplicate content. If the same fact needs to appear in two places, one of them links to the other; it doesn't get copy-pasted.
6. Content Studio's and Platform's own documentation stays where it is. `AIFA_Brain/` references it; it does not absorb it.
