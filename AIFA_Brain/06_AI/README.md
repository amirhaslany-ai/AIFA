# 06_AI

| Field | Value |
|---|---|
| **Title** | 06_AI — README |
| **Created** | 2026-07-13 |
| **Updated** | 2026-07-16 |
| **Owner** | unassigned |
| **Status** | Active |
| **Version** | 1.1 |
| **Dependencies** | none |
| **Related Docs** | [`../04_Research/Market_Intelligence/06_Technology_Intelligence.md`](../04_Research/Market_Intelligence/06_Technology_Intelligence.md), [`../04_Research/Market_Intelligence/02_Competitors_Phase2.md`](../04_Research/Market_Intelligence/02_Competitors_Phase2.md), `../../Platform/docs/adr/0005-ai-provider-abstraction.md`, `../../Platform/docs/architecture/ai-provider-layer.md`, `../04_Research/Technology_Research/README.md` |
| **Tags** | `ai, strategy, vendors` |

## Purpose

Company-level AI/ML strategy: which vendors to actually use and why, model-capability tracking as the field moves, vendor relationship/contract notes, and the real cost-rate data that feeds Platform's pricing engine. This is a **business/strategy** scope, distinct from `Platform/`'s AI provider **implementation** (the registry/circuit-breaker/adapter code, and ADR-0005's technical decision to never hardcode a vendor).

Platform's `OpenAiCompatibleAdapter` has never been configured against a real vendor (see `Platform/CURRENT_IMPLEMENTATION_STATUS.md`) — the first real document here is the one that decides which vendor(s) to actually turn on first, per `Platform/HANDOVER/12_OPEN_DECISIONS.md`'s "Provider selection" section.

> **Candidate suppliers are already researched.** [`../04_Research/Market_Intelligence/02_Competitors_Phase2.md`](../04_Research/Market_Intelligence/02_Competitors_Phase2.md) profiles the inference-supply layer (Together, Fireworks, Groq, Fal, DeepInfra, Replicate) with sourced per-token/per-image prices and data-retention posture, and [`../04_Research/Market_Intelligence/06_Technology_Intelligence.md`](../04_Research/Market_Intelligence/06_Technology_Intelligence.md) translates those into the routing/failover/latency requirements for AIFA's Intelligence Access boundary (CAP-C7-001). The recommended posture: asset-light, ≥2 suppliers per modality with documented exit paths, and preference for zero-data-retention providers. Those are *research recommendations* — the ratified vendor selection still gets recorded here and in `12_Decisions/BUSINESS_DECISION_LOG.md`.

## Update rules

- A vendor decision here should record: why this vendor over alternatives, real negotiated pricing (feeds `11_Pricing/` and `Platform/`'s `AiProviderConfig.costPerInputTokenMicros`/`costPerOutputTokenMicros`), and any contractual constraints.
- Model-capability notes should be dated (models change fast) — use the metadata block's `Updated` field honestly rather than letting a capability note silently go stale.
- Don't duplicate Platform's technical adapter documentation here — link to it.

## Ownership

Unassigned.

## Relationships

- **`Platform/docs/adr/0005-ai-provider-abstraction.md`** and **`Platform/docs/architecture/ai-provider-layer.md`** — the technical side of the same subject; this folder is the business side.
- **`11_Pricing/`** — real vendor cost rates decided here directly feed the pricing model there.
- **`04_Research/Technology_Research/`** — broader technology research; AI-vendor-specific decisions live here instead of being buried in a general research doc.
- **`12_Decisions/BUSINESS_DECISION_LOG.md`** — a vendor selection is a business decision worth recording there too.
