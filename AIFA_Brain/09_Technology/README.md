# 09_Technology

| Field | Value |
|---|---|
| **Title** | 09_Technology — README |
| **Created** | 2026-07-13 |
| **Updated** | 2026-07-16 |
| **Owner** | unassigned |
| **Status** | Active |
| **Version** | 1.1 |
| **Dependencies** | none |
| **Related Docs** | [`../04_Research/Market_Intelligence/06_Technology_Intelligence.md`](../04_Research/Market_Intelligence/06_Technology_Intelligence.md), `../../Platform/docs/architecture/00-overview.md`, `../../Platform/REPOSITORY_MANIFEST.md`, `../06_AI/README.md` |
| **Tags** | `technology, strategy, infrastructure` |

## Purpose

Company-level technology strategy that spans or precedes engineering decisions: build-vs-buy calls, hosting/infrastructure strategy (currently undecided — `Platform/HANDOVER/12_OPEN_DECISIONS.md`), technology-vendor relationships, and cross-workstream technical standards. This is the strategy layer; `Platform/docs/architecture/` is the implementation layer for the Platform workstream specifically, and Content Studio's own tooling choices (documented inline in its engine docs) are that workstream's implementation layer.

The most immediately relevant open item is Platform's hosting/cloud-provider decision, which `Platform/ARCHITECTURE_FREEZE.md` explicitly left undecided and which blocks several other Platform workstream items.

> **Cross-workstream technical requirements are researched.** [`../04_Research/Market_Intelligence/06_Technology_Intelligence.md`](../04_Research/Market_Intelligence/06_Technology_Intelligence.md) derives the architectural requirements for the multi-provider router (price/quality/latency routing, provider failover, caching, no silent substitution) and the asset-light / open-model self-host reserve posture — the "why, for the business" framing this folder exists to hold, grounded in the competitive and supplier evidence.

## Update rules

- A technology strategy document should state the business reason for a technical choice, not just the technical merits — that's what distinguishes this folder from `Platform/docs/architecture/`.
- Don't restate Platform's or Content Studio's existing technical documentation — link to it and add the strategic "why this, for the business" framing that their own docs don't need to carry.

## Ownership

Unassigned.

## Relationships

- **`Platform/docs/architecture/`** — the technical implementation this folder's strategy decisions should inform, not duplicate.
- **`Platform/HANDOVER/12_OPEN_DECISIONS.md`** — hosting/infrastructure is the most concrete open item here right now.
- **`06_AI/`** — AI-vendor strategy is a sibling concern, split out because it's large enough and different enough (model capabilities, not infrastructure) to warrant its own folder.
- **`12_Decisions/ARCHITECTURE_DECISION_LOG.md`** — a company-level technology decision (e.g. the hosting provider) belongs there once made.
