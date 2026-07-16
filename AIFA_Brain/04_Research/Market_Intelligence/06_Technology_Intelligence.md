# AIFA_Brain — 06_TECHNOLOGY_INTELLIGENCE

| Field | Value |
|---|---|
| **Title** | Technology Intelligence — Phase 6 |
| **Created** | 2026-07-14 |
| **Updated** | 2026-07-14 |
| **Owner** | AIFA_Brain maintainers |
| **Status** | Active |
| **Version** | 1.0 |
| **Dependencies** | [`README.md`](README.md), [`02_Competitors_Phase2.md`](02_Competitors_Phase2.md), [`05_Pricing_Intelligence.md`](05_Pricing_Intelligence.md) |
| **Related Docs** | [`../../09_Technology/README.md`](../../09_Technology/README.md), [`../../06_AI/README.md`](../../06_AI/README.md), [`../../10_API/README.md`](../../10_API/README.md) |
| **Tags** | `technology, routing, architecture, latency, market-intelligence` |

**Document:** Market Intelligence Foundation, Phase 6 of 8
**Version:** 1.0 · **Date:** 2026-07-14
**Status:** Permanent knowledge base. Extends V1, Phase 2–5; restates none.
**Purpose:** The technology intelligence layer — how competitors architect routing, caching, fallback, latency, and scaling — translated into **architectural requirements** for AIFA's Intelligence Access boundary (CAP-C7-001) and adjacent capabilities. This document informs *what CAP-C7-001 must be able to do*, so that when the implementation project begins (a separate project, per the constitution) it derives from evidence.
**Cross-references:** Phase 2 (supplier infrastructure) · Phase 5 (settlement/FX) · Capability Map CAP-C7-001, C5-001, C7-003 · Product Blueprint #1 §P1 · Blueprint Ch. 6 (repositories), Ch. 10 (dependencies).

**Labels:** FACT (sourced) · INSIGHT · RECOMMENDATION · ASSUMPTION. **Confidence:** High / Medium / Low / Unavailable.

> **CONSTITUTIONAL BOUNDARY (binding on this document).** Blueprint Ch. 0 and the Product Blueprint Layer Architecture forbid producing implementation, code, schemas, APIs, or software architecture before the Product Blueprint is ratified and the implementation project is opened. **This phase therefore describes *architectural requirements and patterns observed in the market* — what capabilities must exist and why — NOT how to build them.** It stays at the level the Capability Map already occupies (function, boundary, dependency), extended with the market evidence for *why* each requirement exists. Where a reader might mistake a requirement for an implementation instruction, it is reframed as a capability obligation. No technology, vendor lock-in, or code is prescribed.

---

## 6.0 — THE TECHNOLOGY THESIS (INSIGHT)

**The single most important architectural fact for AIFA, restated from Phase 2 Finding B:** OpenRouter routes Llama 3.3 70B at **$0.10/$0.32** while the cheapest first-party provider (Groq) charges **$0.59/$0.79** — *the same model, 5–6× cheaper, purely because a router shops providers per request* (FACT, High). **This means AIFA's core technical value is not "connecting to models" — it is intelligent routing across providers.** CAP-C7-001 (Intelligence Access) is not a connector; it is a **router with a price-shopping, quality-aware, failover-capable brain.** Everything in this phase elaborates that thesis.

**The three architectural jobs CAP-C7-001 must do (all evidenced below):**
1. **Route** — pick the right provider/model per request on price, quality (incl. Persian), and latency.
2. **Survive** — fail over when a provider is down, rate-limited, or sanctioned-off.
3. **Economize** — cache, batch, and use cheap/open models where quality permits, to protect the thin margins of Phase 5.

---

## 6.1 — ROUTING (the core competency)

### 6.1.1 What the market proves about routing (FACT, High)
- **OpenRouter** routes across 60+ providers, 400+ models, 8M+ developers, ~25T tokens/month, and undercuts first-party prices by shopping providers (Phase 2, V1 §3.1). Routing is a *business*, not a feature — it earned a $1.3B valuation.
- **Price dispersion is large and unstable:** the cheapest provider for a given model "shifts week to week" (eesel, Phase 2, High). DeepInfra floors most open models; Groq wins latency; Fireworks/Together trade the lead on frontier-open models by the week.
- **Fal** lets developers "swap from FLUX to Seedream to Kling by changing a single line" (Phase 2, High) — routing across *media* models is equally valuable.

### 6.1.2 Routing requirements for CAP-C7-001 (RECOMMENDATION — capability obligations)
CAP-C7-001's "normalized consumption" and "available-intelligence catalog" facets (already in the Capability Map) must, per this evidence, encompass:
- **Multi-provider-per-model routing** — the same model may be available from several suppliers at different prices/latencies; the boundary must choose. (Phase 2 Finding B)
- **Route selection on three axes: price, quality-for-task (including Persian, D-04), and latency.** No competitor routes on *Persian* quality — this is AIFA's differentiated routing dimension (Phase 3 flagship D-04).
- **Per-request cost knowability** — routing must produce a cost the Pricing capability (C2-003) can quote *before* commit (C-01). Routing and quote-before-commit are coupled: you cannot quote what you cannot cost, and you cannot cost what you have not routed.
- **Transparent provenance** — the chosen model/provider is disclosed to the user (Phase 3 I-12; Manifesto 7.2/7.3).
- **Policy-constrained routing** — never silently substitute a different model than the user chose (D-20 is NEVER); substitution, if ever offered, is explicit and consented.

**INSIGHT — routing is where three constitutional principles converge in one function:** FP-2 (build once), FP-11 (independence — routing *is* multi-provider independence in action), and 7.1 (quote-before-commit needs routing to produce the quote). This is why CAP-C7-001 is the architectural heart of the whole product.

---

## 6.2 — FALLBACK & RESILIENCE (survival)

### 6.2.1 What the market proves (FACT)
- **OpenRouter** provides automatic provider failover — if one provider errors, the request retries on another (Phase 3 D-07, High). This is why aggregators are *more* reliable than any single provider.
- **Fireworks** hard-caps at 6,000 RPM even at top tier; **providers impose rate limits that a single-provider product hits and a multi-provider router routes around** (Phase 2, High).
- **Replicate's** cold-start tax shows that provider selection affects not just price but availability latency (Phase 2, High).

### 6.2.2 Resilience requirements — doubly critical for the Iran context (RECOMMENDATION)
Standard aggregator resilience **plus** Iran-specific failure modes (Phase 4 §4.4, Risk Register R-P1/R-P2/R-P3):
- **Provider failover** — the boundary must route around a downed/rate-limited/newly-sanctioned provider without user-visible failure (FP-11 in action).
- **Sanctions-resilience** — a provider that geo-blocks or cuts access (the defining Iran risk, V1 §2.2) is a *fallback trigger*, not a catastrophe. This is failover with a political cause. **Open-model suppliers (Together/DeepInfra) and downloadable open weights (Together, Phase 2) are the ultimate fallback** — a model AIFA can run itself cannot be sanctioned away.
- **Payment-rail failover** (Phase 5 R-5.5, B-05) — the same failover discipline applies to the Payment capability (C2-004): a downed gateway routes to a second.
- **Graceful degradation under connectivity loss** (Phase 4 K-08/09/10) — a Workflow capability (C5-001) concern: queue and retry when the user's own connection is throttled.

**INSIGHT — resilience is a Persian-market feature, not just an SRE concern (restating Phase 4).** In a market with frequent provider blocks, rail failures, and internet throttling, the product that *survives adversity gracefully* wins trust no competitor advertises. AIFA's multi-provider architecture isn't only about price — **it's about being the product that still works when others don't.**

---

## 6.3 — CACHING & ECONOMY (protecting the margin)

### 6.3.1 What the market proves (FACT, High)
- **Fireworks and Together cache input tokens at a −50% discount** (Phase 2). **Fireworks/Together/Groq offer batch at −50%** (Phase 2).
- **Nobody passes these discounts to consumers** (Phase 3 C-10, C-11 — "None pass it on").

### 6.3.2 Economy requirements (RECOMMENDATION)
Given Phase 5's thin domestic margins, CAP-C7-001 (and the Measurement capability C7-003) should enable:
- **Prompt/response caching where safe** — repeated or near-identical requests served from cache cut supplier cost. Constrained by privacy (a cache must never leak one user's data to another — Ch. 9 rule 4) and by correctness (cache only where staleness is acceptable).
- **Cached-input discounts captured and optionally passed to users** (C-10) — a transparency/loyalty play no competitor makes.
- **Batch routing for non-urgent work** (C-11) — e.g., a user's queued/scheduled generation can take the −50% batch path.
- **Open/cheap-model default where quality suffices** (C-08, D-08) — the Persian model-quality research (D-04) tells AIFA *when* a cheap model is good enough, turning research into margin.

**INSIGHT — the Persian-quality research (D-04) is also a cost-optimization asset.** Knowing that Gemini Flash (cheap) beats GPT-5 (expensive) on Persian medical questions (V1 §2.4) means AIFA can route Persian factual queries to the *cheaper, better* model — improving quality and margin simultaneously. **Quality-aware routing and cost-optimization are the same function when you have the benchmark data nobody else has.**

---

## 6.4 — LATENCY (a felt trust signal)

### 6.4.1 What the market proves (FACT, High)
- **Groq: 500–1,000 tok/s, 5–10× faster than GPU hosts** on the same models (Phase 2).
- **Fal's** proprietary runtime claims 2–10× diffusion speedup; near-zero cold starts (Phase 2).
- **Streaming (token-by-token) is universal** and is a perceived-speed technique (Phase 3 D-12).

### 6.4.2 Latency requirements (RECOMMENDATION)
- **Latency-aware routing** (Phase 3 D-13) — for interactive chat, route to the fastest acceptable provider (Groq-class for open models); for batch, optimize cost instead.
- **Streaming always** (D-12) — perceived speed matters as much as actual speed, especially on Iran's slow/filtered connections.
- **Time-to-first-token as a measured metric** (Phase 2 R-2.2, Metrics Charter) — "fastest Persian AI" is a marketable, measurable claim.
- **Edge/regional considerations** — Iran's international routing is degraded and sometimes throttled (V1 §2.2); latency optimization must account for the *user's* network reality, not just supplier speed. This may argue for regional/domestic caching or hosting (Phase 3 K-10) as a Phase-2+ resilience investment.

**INSIGHT — latency is trust you can feel.** A Persian user on a throttled connection experiences a fast first token as *"this one actually works."* Given that the whole market runs on the same upstream models, **speed is one of the few felt differentiators available** — and it's uncontested in the Persian market's marketing.

---

## 6.5 — SCALING & INFRASTRUCTURE POSTURE

### 6.5.1 What the market proves (FACT)
- The inference layer is **consolidating and capital-intensive** (Phase 2 Finding A): NVIDIA-Groq ~$20B, OpenAI-Cerebras ~$20B, Cloudflare-Replicate, Together $8.3B, Fireworks ~$15B talks. **INSIGHT: AIFA must NOT try to own inference infrastructure** — it is a capital game AIFA cannot and should not play (FP-1: the company is not its infrastructure; Manifesto §6: model-agnostic, "nobody's reseller" but also nobody's data-center).
- **Cloudflare-Replicate** signals inference moving to the edge/CDN layer (Phase 2). **INSIGHT:** edge inference could eventually help Iran-latency — a trend to watch, not act on now.
- Open-weight usage is surging (McKinsey: ~3 in 4 orgs expect to increase open-source AI use; Together tripled open-model usage — Phase 2, High).

### 6.5.2 Scaling posture for AIFA (RECOMMENDATION)
- **Asset-light: AIFA is a routing/experience/payment layer, not an infrastructure owner.** It buys inference (CAP-C7-001 boundary), never builds it — until/unless a specific sovereignty need justifies domestic hosting of an open model (a Phase-3 resilience question, Phase 3 K-10/D-19).
- **Scale the stateless routing layer horizontally; scale the stateful layers (wallet, ledger, identity) carefully** — the money layers (C2) are where correctness matters most and where scaling bugs are unforgivable (FP-12).
- **The open-model self-host option is a strategic reserve** (§6.2.2) — not a Phase-1 build, but the ultimate FP-11 hedge against total sanctions cut-off.

---

## 6.6 — SECURITY & DATA POSTURE (architectural requirements)

### 6.6.1 What the market proves (FACT, High)
- **Zero-data-retention is available today** from Fireworks and DeepInfra (prompts/completions not logged without opt-in) — Phase 2. **No Persian competitor can currently claim this** (Phase 3 N-02, D-18).
- SOC 2 Type II is standard across the serious inference providers (Phase 2).
- AI-generated-code vulnerability rates are high (45%, Phase 2 §2.2.4) — relevant if AIFA ever builds an agent/builder product.

### 6.6.2 Security/data requirements (RECOMMENDATION — feed the Compliance Posture)
- **Supplier selection on data-retention terms** — prefer zero-retention suppliers so AIFA can make the data promise no Persian competitor can (Phase 2 R-2.7, Phase 3 N-02). This is a *procurement* requirement on CAP-C7-001's boundary (Ch. 10).
- **Encryption of user-entrusted data at rest and in transit** (Phase 3 N-03; Blueprint Ch. 9 rule 4).
- **No-training-on-user-data guarantee** — achievable via supplier selection (Phase 3 N-04); a promise AIFA can only keep if its suppliers allow it, so it's a boundary-registration constraint.
- **Political-content/logging policy** (Phase 3 N-11) — the architecture must be able to *honor whatever the founder decides* here (e.g., if the policy is minimal logging for user safety, the system must be built to log minimally). **This is why N-11 must be decided before architecture is finalized** — it's a design input, not a later toggle.

**INSIGHT — data posture is a procurement decision as much as an engineering one.** AIFA's strongest data-trust promises (zero retention, no training on user data) are only keepable if its *suppliers* permit them. This makes CAP-C7-001's supplier selection (Ch. 10 registration) a **trust-critical decision, not just a cost/quality one.** The Dependency & Exit-Path Registry should record data-retention terms as a first-class selection criterion.

---

## 6.7 — THE API ECOSYSTEM (Phase 2+ architectural note)

**FACT (Phase 3 L-01, High):** ChatQT/AvalAI expose OpenAI-compatible APIs to Iranian developers. **INSIGHT:** OpenAI-compatibility is the de-facto standard — any AIFA developer API (Phase 2) should speak it, because it lets Iranian developers point existing tools at AIFA by changing a base URL. This is the same CAP-C7-001 routing engine with a developer surface (Phase 5 §5.7) — no new architecture, a new consumer.

---

## 6.8 — PHASE-6 SYNTHESIS: WHAT CAP-C7-001 MUST ARCHITECTURALLY BE

Consolidated architectural requirements (all traceable to market evidence; none prescribing implementation):

| Requirement | Evidence | Capability home |
|---|---|---|
| Multi-provider, multi-model routing | OpenRouter $0.10 vs Groq $0.59 (Phase 2) | CAP-C7-001 |
| Route on price + Persian-quality + latency | D-04 flagship; Groq latency; price dispersion | CAP-C7-001 |
| Per-request costing that feeds quote-before-commit | C-01; Phase 5 | CAP-C7-001 → C2-003 |
| Provider failover (incl. sanctions-triggered) | OpenRouter D-07; V1 §2.2 | CAP-C7-001 (FP-11) |
| Open-model + self-host reserve as ultimate fallback | Together weights; V1 §2.2 | CAP-C7-001; Ch. 10 |
| Caching + batch + cheap-model economy | Fireworks/Together −50%; Phase 5 margins | CAP-C7-001; C7-003 |
| Streaming + latency-aware routing | Groq; D-12/D-13 | CAP-C7-001 |
| Transparent provenance + no silent substitution | I-12; D-20 NEVER; 7.2/7.3 | CAP-C7-001 |
| Zero-retention supplier selection | Fireworks/DeepInfra; N-02 | Ch. 10 registration |
| Data encryption + no-training guarantee | N-03/N-04; Ch. 9 | CAP-C7-001; Compliance Posture |
| Asset-light (buy inference, don't build) | Phase 2 consolidation; FP-1 | Strategy Dossier |
| Payment-rail failover (parallel pattern) | Phase 5 R-5.5 | CAP-C2-004 (FP-11) |
| Connectivity-loss graceful degradation | Phase 4 K-08/09/10 | CAP-C5-001 |

### Findings that update prior documents (per founder rule 7)
| Finding | Prior document | Update |
|---|---|---|
| CAP-C7-001 is fundamentally a *router*, not a connector; routing on Persian-quality is the differentiated axis | Product Blueprint #1 §P1 (CAP-C7-001 usage); CAP-C7-001 implementation lineage (future) | Note the routing-on-three-axes requirement so implementation derives it |
| Zero-retention supplier selection is a trust-critical procurement criterion | Dependency & Exit-Path Registry (Ch. 10); Compliance Posture | Record data-retention terms as a first-class supplier selection criterion |
| Open-weight self-host is the ultimate sanctions fallback (strategic reserve) | Strategy Dossier §Risk; Risk Register R-P1 | Add as the ultimate-fallback contingency for provider-loss |
| N-11 (political-content/logging) is an architecture *input*, not a later toggle | Compliance Posture (MEGP-5); Product Blueprint sequencing | Decide N-11 before architecture is finalized |
| Asset-light posture (never own inference) | Strategy Dossier §Business Strategy | State explicitly as a permanent strategic constraint |

### Confidence register
- Routing price-advantage (OpenRouter vs first-party): **High** (Phase 2, multiple sources).
- Provider caching/batch discounts: **High**.
- Zero-retention availability: **High**.
- Edge-inference-helps-Iran-latency: **ASSUMPTION, Low** — plausible, unverified; watch the Cloudflare-Replicate trend.
- Domestic-hosting feasibility for open models in Iran: **Unavailable** — a Phase-3 research question (infrastructure, legality, hardware access all unknown).
- All architectural requirements are **derived from market evidence**, not tested in AIFA's context — validate during the implementation project.

---

**END OF PHASE 6.** CAP-C7-001 characterized as a price/quality/latency router with failover and economy · resilience framed as a Persian-market feature · asset-light posture set · data-trust framed as procurement · 5 prior-document updates flagged. No implementation, code, or technology prescribed — constitutional boundary respected.

**Next (Phase 7): Strategic Intelligence** — per-competitor CEO-perspective analysis: what each will build next, how they'd react to AIFA's launch, how dangerous each is, how hard to beat, and the strategic recommendation against each. Plus the market-gap synthesis (the G-series gaps referenced in earlier phases).

Send **CONTINUE**.
