# AIFA_Brain — 02_COMPETITORS / Phase 2: Complete Competitor Profiles

| Field | Value |
|---|---|
| **Title** | Competitor Profiles — Phase 2 (Market Intelligence Foundation) |
| **Created** | 2026-07-14 |
| **Updated** | 2026-07-14 |
| **Owner** | AIFA_Brain maintainers |
| **Status** | Active |
| **Version** | 1.0 |
| **Dependencies** | [`README.md`](README.md) |
| **Related Docs** | [`../../05_Competitors/README.md`](../../05_Competitors/README.md), [`03_Feature_Intelligence.md`](03_Feature_Intelligence.md), [`06_Technology_Intelligence.md`](06_Technology_Intelligence.md) |
| **Tags** | `competitors, suppliers, inference, pricing, market-intelligence` |

**Document:** Market Intelligence Foundation, Phase 2 of 8
**Version:** 1.0 · **Date:** 2026-07-14
**Status:** Extends Version 1 (approved). Does not restate or replace it.
**Purpose:** Expand every competitor left at stub depth or marked *Unavailable* in Version 1 into a full profile. Version 1's Tier-1 profiles (OpenRouter, Poe, Syntx, Hoosha, GapGPT, Higgsfield, ChatGPT, Claude, Gemini, Perplexity) remain authoritative and are **not** repeated here.
**Cross-references:** V1 §03 (Tier 1), V1 §02 (Persian market), V1 §06 (matrices). Phase 3 (Feature Intelligence) consumes this document's feature observations; Phase 5 (Technology Intelligence) consumes its stack observations.

**Labels:** FACT (sourced) · ASSUMPTION · INSIGHT (analysis) · RECOMMENDATION. **Confidence:** High / Medium / Low / Unavailable.

---

## 2.0 — What changed since Version 1

Version 1 flagged the Tier-2 inference providers (Together, Fireworks, Groq) and several creative/builder players as **Unavailable — search budget exhausted; flag for follow-up**. That gap is now closed. Three findings materially change the strategic picture and are stated up front:

**FINDING A — The inference layer has repriced violently upward, and consolidated (FACT, High).** NVIDIA licensed/acquired Groq's LPU technology for ~$20B (Dec 2025); OpenAI acquired Cerebras for ~$20B (Apr 2026); Cloudflare acquired Replicate (closed Dec 1, 2025); Together raised $800M at $8.3B (Jul 1, 2026); Fireworks is in talks at $15B (May 2026, Bloomberg); Fal is in talks at ~$8B (Mar 2026). **INSIGHT:** AIFA's upstream suppliers are now capital-rich, consolidating, and increasingly owned by strategic acquirers. This *raises* supplier power (Porter, V1 §6.2) and *validates* FP-11's exit-path discipline — supplier terms can change on an acquirer's timetable, not a customer's.

**FINDING B — There is a real arbitrage between routing and first-party pricing (FACT, High).** On Llama 3.3 70B: Groq $0.59/$0.79 per 1M tokens, Fireworks ~$0.90 flat, Together $0.88–1.04 — while **OpenRouter routes the same model at $0.10/$0.32, undercutting every first-party provider** (eesel/Morph, June 2026). **INSIGHT:** A router that shops providers per-request can beat any single upstream on price. This is directly transferable to AIFA and is the single most actionable technical finding in Phase 2 (see RECOMMENDATION R-2.1 below).

**FINDING C — The "vibe coding" builder category monetizes on credits and burns users (FACT, High).** Lovable ~$400M ARR (Feb 2026, up from $100M eight months earlier), $6.6B valuation after a $330M Series B; Bolt.new >$40M ARR in 5 months at ~$700M valuation, 5M+ users, profitable; v0 4M+ users, Vercel at $9.3B. All three drew documented user backlash over credit/token metering. **INSIGHT:** credit-metered AI products scale revenue fast *and* generate trust damage — precisely the tension AIFA's Manifesto 7.1 exists to prevent.

---

## 2.1 — INFERENCE & MODEL-ACCESS LAYER (AIFA's potential *suppliers*, not consumer competitors)

> **INSIGHT — reclassification.** Version 1 listed these as "Tier 2 competitors." Phase 2 research shows this framing is wrong and should be corrected in AIFA's strategy: **Together, Fireworks, Groq, Replicate, Fal, Hyperbolic and DeepInfra are supply-side infrastructure, not demand-side rivals.** They compete for *developers*; AIFA competes for *Persian-speaking end users*. The correct relationship is procurement, not rivalry. This changes the Dependency & Exit-Path Registry (Blueprint Ch. 10): these are candidate registrations behind CAP-C7-001 Intelligence Access.

### 2.1.1 Together AI
- **Company (FACT, High):** San Francisco. Open-model inference cloud. **$800M Series C closed July 1, 2026 at $8.3B post-money**, led by Aramco Ventures with NVIDIA, Vista Equity, General Catalyst, Salesforce Ventures, SentinelOne's S Ventures et al. Annual bookings **>$1.15B**. Secured commitments for **>500 MW** of compute; plans ~50× infrastructure growth over five years. (techtimes/TFN, July 2026)
- **Pricing (FACT, High — as of 2026-07-09):** serverless $0.05–$9.00 per 1M tokens. GPT-OSS 20B $0.05/$0.20 (cheapest). Llama 3.3 70B $0.88 flat. DeepSeek V3.1 $0.60/$1.70; V4 Pro $2.10/$4.40; R1 $3.00/$7.00. Kimi K2.6 $1.20/$4.50. GLM 5.1 $1.40/$4.40. Qwen 3.6 Plus $0.50/$3.00. MiniMax M2.7 $0.30/$1.20. Embeddings from $0.02/M. Dedicated H100 **$6.49/hr**; raw HGX clusters $3.99–5.49/hr. LoRA fine-tune $0.48/M (≤16B) → $2.90/M (70–100B); **fine-tuned weights are downloadable**. Batch API −50%. **$5 free signup credit.** No subscription tier.
- **Strengths:** breadth (33+ models tracked), fine-tuning depth, weight portability, SOC 2 Type II.
- **Weaknesses:** mid-pack per-token price; no consumer product; no free tier beyond $5.
- **Relevance to AIFA (INSIGHT):** best candidate for *open-model* supply (Llama/Qwen/DeepSeek) behind CAP-C7-001 — and the downloadable-weights policy is a genuine FP-11 exit-path asset: weights you can take with you are the strongest form of provider independence available.

### 2.1.2 Fireworks AI
- **Company (FACT, High/Medium):** **$250M Series C, Oct 2025, at $4B post-money** (Lightspeed + Index + Evantic, with Sequoia, NVIDIA, AMD). **In talks at a $15B valuation as of May 27, 2026 (Bloomberg), Index co-leading — 3.75× in seven months.** Total raised >$327M pre-round. Sacra estimates ~$800M annualized revenue (May 2026, up from ~$305M end-2025); ChatForest reports $315M ARR at Feb 2026 (+416% YoY) — **NOTE: these two figures conflict; treat revenue as Medium confidence.** >10,000 customers (Oct 2025). Named customers: Cursor, Perplexity, Notion, Sourcegraph, Uber, DoorDash, Shopify, Upwork. **Gross margin ~50%**, targeting 60%.
- **Pricing (FACT, High):** Kimi K2.6 $0.95/$4.00 ($0.16 cached); DeepSeek V4 Pro $1.74/$3.48 ($0.145 cached); DeepSeek V4 Flash $0.14/$0.28; GLM 5.1 $1.40/$4.40; GPT-OSS 120B $0.15/$0.60. Cached input −50%; batch −50%. H100/H200 **$7.00/hr**, B200 $10/hr, B300 $12/hr. Fine-tune $0.50/M (≤16B) → $10.00/M (>300B); DPO 2× SFT. **Rate limits: 10 RPM without card; fixed 6,000 RPM ceiling with card.** Spend tiers $50 / $500 / $5,000 / $50,000 per month. $1 free credit.
- **Strengths:** FireAttention CUDA kernels (highest GPU-tier throughput; ~5× faster at same price on DeepSeek V4 Pro per Artificial Analysis); 400+ models; SOC 2 Type II, HIPAA, GDPR, ISO; zero data retention on open models by default.
- **Weaknesses:** hard 6,000 RPM ceiling even at top tier; ~50% gross margin implies limited room to discount.
- **Relevance to AIFA (INSIGHT):** the **zero-data-retention default** is directly usable as a Compliance Posture commitment (MEGP-5 data promises) — a Persian-market trust differentiator competitors cannot easily claim, because most Iranian wrappers cannot tell users what happens to their prompts.

### 2.1.3 Groq
- **Company (FACT, High):** **NVIDIA licensed/acquired Groq's LPU technology for ~$20B (Dec 2025)**; Groq subsequently **raised $650M (June 2026)** to rebuild as an inference cloud. Partnership with Meta to accelerate the official Llama API.
- **Pricing/performance (FACT, High):** cheapest first-party on Llama 3.3 70B at **$0.59/$0.79 per 1M**. GPT-OSS 120B at $0.15/$0.60 class. Published throughput: **500 tok/s (GPT-OSS 120B), 1,000 tok/s (GPT-OSS 20B), 840 tok/s (Llama 3.1 8B)** — 5–10× faster than GPU hosts on the same models. Batch −50% (24h–7d window). SOC 2 Type II; BAA available (excludes preview features).
- **Weaknesses:** narrow catalog (~20 models).
- **Relevance to AIFA (INSIGHT + RECOMMENDATION):** **latency is a trust feature in Iran.** Iranian users experience high-latency, filtered, VPN-degraded internet; a sub-second first-token response is a *perceptible* quality difference that no Persian competitor currently advertises. **R-2.2: register Groq behind CAP-C7-001 as the low-latency route for open models, and make "fastest Persian AI" a measurable marketing claim** (M-P3 candidate metric: median time-to-first-token).

### 2.1.4 Replicate
- **Company (FACT, High):** **acquired by Cloudflare — announced Nov 2025, closed Dec 1, 2025.** As of May 2026 no Cloudflare-specific pricing tiers exist; Workers AI integration promised without a published timeline.
- **Pricing (FACT, High):** per-GPU-second billing (1.4–2.9× higher than Fal/Modal); H100 **$5.49/hr** (vs Fal $1.89/hr). "Official Models" (FLUX, Claude, DeepSeek, video) use predictable per-unit pricing. **50,000+ model catalog** (largest). Cold-start tax on private deployments (a 2-min H100 cold start ≈ $0.183 before inference).
- **Strengths:** catalog breadth, docs, speed-to-production.
- **Weaknesses:** most expensive GPU-second rates in class; cold-start cost; **acquisition-driven strategic uncertainty**.
- **Relevance to AIFA (INSIGHT):** a live case study for FP-11. A supplier can be acquired mid-relationship and have its roadmap frozen. **Do not make Replicate a single point of dependency for any capability.**

### 2.1.5 Fal.ai
- **Company (FACT, High):** generative-media inference platform, ~600–1,000+ models (image, video, audio, 3D). **Series C $125M July 2025 at $1.5B (Meritech); Series D Dec 2025 led by Sequoia at ~$4.5B; in talks Mar 2026 for $300–350M at ~$8B in two tranches.** Total raised ~$337M–$587M depending on source (**conflict — Medium**). Annualized revenue reached **~$400M (Mar 2026, up from $200M in Oct)**. **3 million developers**; customers include Adobe, Canva, Shopify. 101–250 employees.
- **Pricing (FACT, High):** no subscription. GPU-second (**H100 $1.89/hr, A100 $0.99/hr**) or per-output: **Seedream V4 $0.03/image; Wan 2.5 video $0.05/sec; Veo 3 $0.4/sec.** Starter credits on signup. SOC 2.
- **Strengths:** proprietary runtime (claims 2–10× diffusion speedup); near-zero cold starts; single-line model swapping (FLUX → Seedream → Kling).
- **Weaknesses:** model versions/params "sometimes change without notice" (a real FP-11 hazard); media-only.
- **Relevance to AIFA (RECOMMENDATION):** **R-2.3 — Fal is the strongest single supplier candidate for AIFA's Phase-1 image generation** (CAP-C7-001 boundary): cheapest per-image, fastest, and it aggregates the exact models Persian competitors advertise (Nano Banana, Flux, Seedream, Kling). Register with a documented exit path to Replicate/Together as alternates.

### 2.1.6 Hyperbolic / DeepInfra / Baseten / Modal (brief)
- **DeepInfra (FACT, High):** the **per-token floor** on most open models — Kimi K2.6 $0.75/$3.50 (vs Fireworks $0.95/$4.00); DeepSeek V4 Pro $1.30/$2.60 (vs $1.74/$3.48); **H100 $1.79/hr** (vs Fireworks $7.00/hr). Zero retention on inference; SOC 2 Type II + ISO 27001. **INSIGHT: DeepInfra was not on the original research list but is now the cheapest credible open-model supplier found — it belongs in the Dependency Registry candidate set.**
- **Baseten (FACT, High):** $300M Series E at $5B (Feb 2026); valued up to $13B in a June 2026 round; ~3× annualized revenue in one quarter. VPC/self-hosted deployment — relevant only if AIFA ever needs in-country/private inference.
- **Modal:** $30/month free credits; Python-centric serverless. **Hyperbolic:** listed in V1; **pricing/funding remain Unavailable (Low)** — deprioritized, since DeepInfra now occupies its price position.

---

## 2.2 — AI APP BUILDERS ("vibe coding" — adjacent category, strategic lesson only)

> **These are not AIFA competitors.** They are included because their **credit-metering trust failures** are the clearest available evidence for AIFA's Manifesto 7.1 design constraints, and because they represent a possible far-future AIFA product (an "AIFA Agents/Builder" product, currently a Phase-1 non-goal per Product Blueprint #1 §P0.4).

### 2.2.1 Lovable
- **FACT (High):** ex-GPT Engineer, rebranded late 2024. **$20M ARR in 2 months** (fastest in European startup history), **$400M ARR by Feb 2026** (from $100M eight months earlier), **$6.6B valuation after a $330M Series B.** Full-stack React + Supabase + auth + one-click deploy; two-way GitHub sync. Pricing ~$25/mo Pro; free tier ~30 credits/mo; ~50% student discount; $25/mo free cloud usage (through Q1 2026). One credit = one AI interaction.
- **User complaints (FACT, Medium-High):** credits burn fast on iteration; quality degrades on complex projects; Supabase lock-in; security incidents reported.

### 2.2.2 Bolt.new (StackBlitz)
- **FACT (High):** **$40M ARR in 5 months, ~$700M valuation, profitable, 5M+ registered users.** Browser-native WebContainers (no VM spin-up). Multi-model (Claude, GPT, Gemini). Free tier ~1M tokens/month — the most generous in category.
- **User complaints (FACT, Medium-High):** token burn (reports of 1.3M tokens in a day); "$1,000+ spent fixing issues" on complex projects; context degradation past ~15–20 components.

### 2.2.3 v0 (Vercel)
- **FACT (High):** **4M+ users (Feb 2026)**; Vercel raised a **$300M Series F at $9.3B**. Free $0 with $5 monthly credits + daily message cap; Team $30/user/mo; Business $100/user/mo; separate token pricing across v0 Mini/Pro/Max/Max Fast. Feb 2026 added Git integration, code editor, DB connectivity.
- **User complaints (FACT, High):** **the May 2025 shift from an unlimited plan to metered pricing caused documented developer backlash**; Vercel ecosystem lock-in; frontend-only until recently.

### 2.2.4 Category-wide safety finding (FACT, High)
Veracode's 2025 GenAI Code Security Report: **45% of AI-generated code samples failed basic security tests.** Georgia Tech's tracker recorded **35 CVEs traced to AI-generated code in March 2026 alone.**
- **INSIGHT for AIFA:** if AIFA ever builds an agent/builder product, security review is a *product requirement*, not a nicety — and per Blueprint Ch. 9 rule 4 it would be an owned duty, not an optional feature.

### 2.2.5 THE CENTRAL LESSON (INSIGHT — highest-value finding in §2.2)
All three leaders monetize by **metering an unpredictable unit** (tokens/credits consumed by an AI whose consumption the user cannot forecast). All three grew explosively. **All three generated trust damage on exactly that axis** — v0's metering backlash, Bolt's "$1,000+ to fix an app," Lovable's credit burn. Higgsfield's Trustpilot 3.2/5 over hidden "unlimited" throttles (V1 §3.6) is the same failure in the creative category.
> **RECOMMENDATION R-2.4 — This is empirical validation of Manifesto 7.1's test question 1 ("could a reasonable user state what something costs before paying for it?"). AIFA's quote-before-commit invariant (Product Blueprint #1, P2.4/P3) is not merely constitutional compliance — it is the single clearest competitive differentiator available in the entire AI product landscape, because every fast-growing credit-based competitor is currently failing it.**

---

## 2.3 — IMAGE & CREATIVE PLATFORMS (Tier 2)

### 2.3.1 Leonardo AI
- **FACT (Medium):** consumer/prosumer image platform; credit-based ("tokens"); free daily allowance; paid tiers roughly $10–$48/mo; acquired by Canva (2024). Strong community/model-gallery motion.
- **Relevance:** its **daily free-credit allowance** is the mechanic Hoosha copies (25 credits/day, V1 §2.5) — evidence the mechanic works in the Persian market too.

### 2.3.2 OpenArt
- **FACT (Medium):** image-generation hub; credit-based; template/style library; heavy SEO + template-gallery growth motion.
- **INSIGHT:** OpenArt's growth is almost entirely **template-and-preset SEO** — a low-cost growth channel directly transferable to Persian (there is currently **no significant Persian-language AI prompt/preset library** — see Gap G-7 in Phase 7).

### 2.3.3 HuggingChat & You.com
- **HuggingChat (FACT, Medium):** free, open-model chat from Hugging Face; no consumer monetization; effectively a shop window for open models.
- **You.com (FACT, Medium):** AI search/answer engine pivoted to enterprise/agents; consumer traction well behind Perplexity.
- **Relevance to AIFA:** low. Neither serves Persian, neither has a payment story, neither is a threat. **Deprioritize from further research** (RECOMMENDATION).

---

## 2.4 — VIDEO / CREATIVE AI (full depth — strategic intelligence for AIFA Phases 2–3, per founder instruction)

> **Scope note (constitutional):** Product Blueprint #1 §P0.4 lists video generation as an explicit Phase-1 **non-goal**. Nothing below authorizes Phase-1 work. This is future-optionality intelligence feeding the Strategy Dossier's sequencing section (Blueprint Ch. 11).

### 2.4.1 The 2026 video model landscape (FACT, Medium-High)
| Player | Model/position | Pricing | Notable |
|---|---|---|---|
| **Runway** | Gen-4.5; leaderboard leader (~1,247 Elo) | Standard $12 / Pro $28 / Unlimited $76 | Professional/filmmaker positioning; deepest editing suite |
| **Kling AI** | Kling 3.0; native 4K, storyboard | from $7.99/mo; **best free tier (~66 credits/day)** | Chinese (Kuaishou); most generous free allowance |
| **Luma** | Dream Machine / Ray3 | Lite $9.99 / Plus $29.99 / Unlimited $94.99 | Cinematic quality focus |
| **Pika** | Pika 2.5 | from $8/mo | Social-first, effects-driven, lowest entry price |
| **HeyGen** | Avatar/lip-sync (not generative film) | subscription | Business/marketing avatars; different job-to-be-done |
| **Higgsfield** | *Aggregator* of the above (see V1 §3.6) | $15–$99/mo credits | ~$500M annualized (Sacra, Medium); Trustpilot 3.2/5 |
| **Syntx** | *Aggregator*, Telegram-native (see V1 §3.3) | ~$8.46–14.45/mo | 90+ tools / 40+ models |

### 2.4.2 The structural insight (INSIGHT — high value)
**The two aggregators (Higgsfield, Syntx) are worth more attention than the model labs.** Higgsfield reached ~$500M annualized revenue and a ~$1.3B valuation **without training a single video model** — purely by aggregating Sora/Veo/Kling/WAN/Seedance behind one credit wallet and a better creative UX (V1 §3.6, FACT, Medium). Syntx did the same for creative tools via Telegram.
> **This is the exact business model AIFA is building — proven, at scale, in an adjacent vertical.** Higgsfield is not a competitor to AIFA; it is *proof of AIFA's thesis in a market AIFA does not yet serve.*

### 2.4.3 Video economics — the warning (INSIGHT + ASSUMPTION)
- FACT: Fal charges **$0.05/sec (Wan 2.5)** and **$0.40/sec (Veo 3)** for video generation. A single 8-second Veo 3 clip ≈ **$3.20 of raw supplier cost**.
- ASSUMPTION (Medium): at Iranian purchasing power, a user paying ~150,000–400,000 Toman/month (V1 §2.1) could exhaust a month's spend on **fewer than ten premium video clips** at cost, before AIFA's margin, payment fees (~1%), and FX/USDT settlement spread (~1–3%).
- **RECOMMENDATION R-2.5 — CONFIRM the Phase-1 exclusion of video.** Video generation at Persian-market price points is structurally margin-negative unless AIFA (a) restricts to cheap models (Wan/Seedance at $0.05/sec), (b) prices video as an explicit premium add-on, or (c) targets the diaspora/business segments at USD. **Video is a Phase-3 product for the diaspora and business segments, not a Phase-1 feature for Iran-resident consumers.** This is a *stronger* justification than the Strategy Dossier currently carries, and should be added to it at the next amendment.

---

## 2.5 — CONSOLIDATED PHASE-2 RECOMMENDATIONS (for founder ratification into governed artifacts)

| ID | Recommendation | Receiving artifact | Constitutional path |
|---|---|---|---|
| **R-2.1** | Build AIFA's Intelligence Access boundary as a **price-shopping router**, not a fixed provider integration — routing can beat every first-party price (Finding B) | Dependency & Exit-Path Registry; CAP-C7-001 implementation lineage | Ch. 10 rule 1 |
| **R-2.2** | Register **Groq** as the low-latency open-model route; make median time-to-first-token a published metric | Dependency Registry; Metrics Charter | Ch. 10; Ch. 14 rule 1 |
| **R-2.3** | Register **Fal.ai** as primary Phase-1 image supplier; **DeepInfra** or **Together** as primary open-model text supplier; each with a documented exit path *before first use* | Dependency & Exit-Path Registry | Ch. 10 rule 1 (FP-11) |
| **R-2.4** | Elevate **quote-before-commit** from a compliance invariant to AIFA's **primary public differentiator** — every scaled credit-based competitor is currently failing Manifesto 7.1's test 1 | Growth Doctrine; Product Blueprint #1 P2/P3 | Ch. 13 rule 1 |
| **R-2.5** | Formally record the **economic** (not merely strategic) justification for excluding video from Phase 1 | Strategy Dossier §Sequencing | Ch. 11 rule 3 |
| **R-2.6** | Reclassify Together/Fireworks/Groq/Replicate/Fal/DeepInfra from "competitors" to **suppliers** in all AIFA strategy documents | Strategy Dossier §Competition | Ch. 11 rule 2 |
| **R-2.7** | Adopt **zero-data-retention** supplier selection as a Compliance Posture data promise (available today from Fireworks/DeepInfra) — a trust claim no Persian competitor can currently make | Compliance Posture | Ch. 9 rule 3 |

---

## 2.6 — PHASE-2 CONFIDENCE REGISTER

| Item | Status |
|---|---|
| Fireworks revenue ($800M Sacra vs $315M ChatForest) | **CONFLICT — Medium.** Both cited; do not rely on either for modeling |
| Fal total raised ($337M Clay vs $587M Sacra) | **CONFLICT — Medium** |
| Hyperbolic pricing/funding | **Unavailable — Low.** Deprioritized (DeepInfra occupies its niche) |
| Leonardo/OpenArt exact 2026 pricing tiers | **Medium** — approximate ranges only |
| Higgsfield revenue (~$500M annualized) | **Medium** — Sacra estimate, not company-reported |
| Video model Elo scores / rankings | **Medium** — secondary aggregator sources |
| All 2026 model version numbers (GPT-5.x, DeepSeek V4, Kimi K2.6, GLM 5.1) | **Medium** — fast-moving; verify at implementation |
| Nothing in this document is fabricated | Gaps are marked, not filled |

---

**END OF PHASE 2.**

**Next phase (Phase 3): Feature Intelligence — minimum 150 product features across all competitors, structured as a feature-by-competitor matrix with adoption signals, effort estimates, and constitutional compatibility flags (does the feature violate Manifesto 7.1/7.3/7.4?).**

Send **CONTINUE** to proceed to Phase 3.
