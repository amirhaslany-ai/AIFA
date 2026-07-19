# 15_Roadmap

| Field | Value |
|---|---|
| **Title** | 15_Roadmap — README |
| **Created** | 2026-07-13 |
| **Updated** | 2026-07-19 |
| **Owner** | unassigned |
| **Status** | Active |
| **Version** | 1.2 |
| **Dependencies** | none |
| **Related Docs** | `../MASTER_INDEX.md`, `../../Platform/POST_FREEZE_BACKLOG.md`, `../../Platform/FOUNDER_NEXT_STEP.md`, `../01_Product/README.md`, `../12_Decisions/PRODUCT_DECISION_LOG.md`, `../../Platform/docs/pricing/staging/2026-07-18-chat/README.md` |
| **Tags** | `roadmap, planning` |

## Purpose

The cross-workstream roadmap — what's next for Content Studio, Platform, and the business, in one place, so priority conflicts between workstreams are visible instead of hidden in three separate backlogs. This does not replace each workstream's own detailed backlog:

- **Platform's own near-term backlog already exists and is current**: `Platform/POST_FREEZE_BACKLOG.md`, phased (Verification → Product → Scale → Future), with `Platform/FOUNDER_NEXT_STEP.md` explicitly stating the immediate next move is *not* more engineering but product/business/GTM decision-making.
- **Content Studio's own queue**: `TODO.md` at the repo root — currently showing its documentation build-out complete, blocked on founder input on open `🔶` items (see `OPEN_QUESTIONS.md`).

This folder is where those two, plus whatever `01_Product/` and `02_Business/` produce, get sequenced against each other at the company level — e.g. deciding whether founder attention goes to Content Studio's blocked persona/brand questions or Platform's pricing/payment decisions first.

**Launch scope (2026-07-19):** launch scope is now governed by Locked decision [`P-001`](../12_Decisions/PRODUCT_DECISION_LOG.md#p-001--launch-with-a-broad-value-dense-product-foundation) — a broad multi-capability launch (chat, image, video, voice, music, avatar, Smart Router, wallet, limited Memory/Workflows/Agents), not a chat-only MVP. Model/provider selection and implementation sequencing remain separate, still-open decisions.

**Pricing-audit status (2026-07-18):** the chat-portfolio provider-pricing research/verification/reconciliation cycle (Phase C → C.5 → D → D.5) is complete and staged — see `../../Platform/docs/pricing/staging/2026-07-18-chat/README.md`. No production pricing row was written yet; the batch is blocked on founder/architecture review (source-URL re-confirmation, two schema-gap approval items) before Phase E can populate `Platform/docs/pricing/*.csv`. This sits upstream of the real-pricing decision `Platform/FOUNDER_NEXT_STEP.md` and `Platform/POST_FREEZE_BACKLOG.md` already flag as a founder bottleneck — not a new bottleneck, but this is where its provider-cost evidence now lives.

## Update rules

- This is a living document — revisit whenever a workstream's own backlog changes materially, or when a `12_Decisions/` entry changes priorities.
- Don't duplicate the detail already in `Platform/POST_FREEZE_BACKLOG.md` or `TODO.md` — reference and sequence, don't re-list every item.
- Distinguish "committed" from "under consideration" explicitly — a roadmap that doesn't distinguish the two misleads.

## Ownership

Unassigned — founder-level, per `Platform/FOUNDER_NEXT_STEP.md`'s explicit recommendation that roadmap/priority decisions are the current bottleneck.

## Relationships

- **`Platform/POST_FREEZE_BACKLOG.md`** and **`Platform/FOUNDER_NEXT_STEP.md`** — Platform's own phased backlog and its explicit "stop engineering, do product/business work first" recommendation.
- **`../../TODO.md`** — Content Studio's own build queue and blocked-item list.
- **`01_Product/`, `02_Business/`** — the strategy work whose outputs this roadmap sequences.
