# Providers

Per-provider reference docs. **Every doc in this folder is a skeleton as of 2026-07-17** — no official pricing or commercial-terms research has been performed yet (that is Phase C of the provider pricing audit, ADR-0025). Each doc records what AIFA's locked portfolio decisions (`../portfolio/`) already say about the provider, plus the exact fields Phase C must populate from official sources only.

## Scope

The 20 providers explicitly named in the docs structure, plus **Suno** and **Cartesia** (both appear in locked portfolio decisions — ADR-0022, ADR-0021 — but were not in the original file tree; added here so every portfolio entry has a provider doc to link to):

| Provider | Primary capability in AIFA's portfolio |
|---|---|
| [`openai.md`](openai.md) | Chat, Image, Voice (reserve) |
| [`anthropic.md`](anthropic.md) | Chat |
| [`google.md`](google.md) | Chat, Image, Video, Voice, Music |
| [`xai.md`](xai.md) | Chat, Video (reserve) |
| [`deepseek.md`](deepseek.md) | Chat |
| [`moonshot.md`](moonshot.md) | Chat, Coding, Agentic (Kimi K3 — model owner) |
| [`openrouter.md`](openrouter.md) | Chat (Kimi K3 — initial serving gateway only, not a model owner) |
| [`alibaba.md`](alibaba.md) | Chat, Video |
| [`zhipu.md`](zhipu.md) | Chat |
| [`black-forest-labs.md`](black-forest-labs.md) | Image |
| [`fal.md`](fal.md) | Image (fallback route), Video (fallback route) |
| [`ideogram.md`](ideogram.md) | Image |
| [`recraft.md`](recraft.md) | Image |
| [`runway.md`](runway.md) | Image, Video |
| [`kling.md`](kling.md) | Video |
| [`volcano-engine.md`](volcano-engine.md) | Video |
| [`minimax.md`](minimax.md) | Video |
| [`elevenlabs.md`](elevenlabs.md) | Voice, Music |
| [`deepgram.md`](deepgram.md) | Voice |
| [`heygen.md`](heygen.md) | Avatar |
| [`tavus.md`](tavus.md) | Avatar |
| [`mureka.md`](mureka.md) | Music |
| [`stability-ai.md`](stability-ai.md) | Music |
| [`suno.md`](suno.md) | Music (integration-gated) |
| [`cartesia.md`](cartesia.md) | Voice (reserve) |

**OpenRouter — no longer excluded.** [`P-002`](../../../AIFA_Brain/12_Decisions/PRODUCT_DECISION_LOG.md#p-002--launch-model-provider-and-activation-matrix) (Locked, 2026-07-20) selects OpenRouter as the initial serving gateway for one specific, explicitly-decided route: Kimi K3 (Moonshot AI). This corrects the prior blanket statement that "AIFA's locked portfolio decisions do not use it as a supplier" — that statement is no longer true for this one route; OpenRouter is still not a general-purpose supplier, and remains additionally documented as a **competitive reference** (the routing-arbitrage evidence motivating `../architecture/cost-routing.md`) in `AIFA_Brain/04_Research/Market_Intelligence/02_Competitors_Phase2.md` and `01_Executive_Intelligence_Report.md` — that research is unchanged and not restated here. See [`openrouter.md`](openrouter.md).

## Fields Phase C must populate per provider (ADR-0025)

**Identity:** category, capability, AIFA product alias, official provider model name, official API model ID, model family, model variant, provider, official endpoint/API product, availability status, preview/GA status, region restrictions, official API availability, required account tier, minimum spend/subscription requirement, enterprise-only status.

**Pricing:** currency, billing unit, and whichever of input/output/cached-token, per-image, per-second, per-minute, per-character, per-song, per-credit, batch/cache discount, long-context multiplier, regional multiplier, subscription fee, included usage, overage price, concurrency fee, replica/avatar creation fee, storage/bandwidth fee, moderation/tool-use fee, minimum billing increment, and rounding rule apply to that provider's actual billing model.

**Commercial & legal:** commercial-use terms, resale/white-label terms, generated-content ownership, attribution/watermark requirements, voice-cloning/avatar-consent requirements, data-retention policy, training-on-customer-data default, zero-data-retention availability, DPA/EU-processing availability, geographic restrictions, enterprise-agreement requirement, source URL/title/date, verification timestamp, confidence label (`../adr/0025-pricing-source-of-truth.md`).

**Never interpret silence as permission — use `UNKNOWN` where public documentation doesn't answer a commercial question.**

## Related documents

- `../portfolio/` (which AIFA models map to each provider)
- `../adr/0025-pricing-source-of-truth.md` (the sourcing/confidence discipline every populated field must follow)
- `../pricing/provider-pricing.csv`, `../pricing/sources.csv` (the machine-readable form of what these docs describe, populated in Phase C)
