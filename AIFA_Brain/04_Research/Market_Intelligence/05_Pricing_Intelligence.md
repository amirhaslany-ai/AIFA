# AIFA_Brain — 05_PRICING_INTELLIGENCE

| Field | Value |
|---|---|
| **Title** | Pricing Intelligence — Phase 5 |
| **Created** | 2026-07-14 |
| **Updated** | 2026-07-14 |
| **Owner** | AIFA_Brain maintainers |
| **Status** | Active |
| **Version** | 1.0 |
| **Dependencies** | [`README.md`](README.md), [`02_Competitors_Phase2.md`](02_Competitors_Phase2.md) |
| **Related Docs** | [`../../11_Pricing/README.md`](../../11_Pricing/README.md), [`../Pricing_Research/README.md`](../Pricing_Research/README.md) |
| **Tags** | `pricing, margin, fx, unit-economics, market-intelligence` |

**Document:** Market Intelligence Foundation, Phase 5 of 8
**Version:** 1.0 · **Date:** 2026-07-14
**Status:** Permanent knowledge base. Extends V1, Phase 2–4; restates none.
**Purpose:** The complete pricing intelligence layer — every pricing architecture in the market, the mechanics of credit systems, and (most importantly) **the full Rial-in/USD-out margin model built on current, sourced exchange rates and supplier prices.** This is the document that determines whether AIFA can make money, and it is the direct input to the Business Model Charter (MEGP-7) and the founder's pricing decisions (Product Blueprint #1 TODOs).
**Cross-references:** Phase 2 (supplier prices) · Phase 3 Domains B, C (payment/pricing features) · Phase 4 §4.5 (pricing psychology) · Business Model Charter BM-01 · V1 §2.3 (payment rails).

**Labels:** FACT (sourced) · INSIGHT · RECOMMENDATION · ASSUMPTION. **Confidence:** High / Medium / Low / Unavailable.

> **CRITICAL CAVEAT (read before using any number).** All Toman figures depend on a **highly volatile exchange rate**. As of **July 15, 2026, the free-market USD ≈ 183,000 Toman** (FACT: bon-bast 187,700 USDT / alanchand 1,830,000 Rial remittance = 183,000 Toman; Rial down ~23–25% over six months, High). **This rate is the single most important variable in AIFA's economics and it moves weekly.** Every Toman price in this document is a *snapshot* and must be recomputed at implementation and re-checked continuously (see the FX-peg recommendation R-5.4). **Do not hardcode any Toman price anywhere in AIFA. Ever.**

---

## 5.0 — THE CENTRAL ECONOMIC PROBLEM (INSIGHT)

AIFA's business is a **currency-mismatch arbitrage under sanctions**: it collects **depreciating Toman** domestically and pays **appreciating USD** to foreign model suppliers. Three structural facts define the whole model:

1. **FACT (High):** the Toman has lost ~23–25% against USD in six months and ~99% over longer horizons (bon-bast/alanchand/tradingeconomics). Revenue is denominated in a melting currency; costs are in a hardening one.
2. **FACT (High, Phase 2):** supplier model prices are USD-denominated and, at the inference layer, *rose* through 2025–26 as the sector consolidated and repriced.
3. **FACT (High, V1 §2.3):** the money must cross the sanctions wall via USDT/forex brokers, adding a settlement spread on top of the domestic payment fee.

**INSIGHT — the margin is squeezed from three sides simultaneously:** FX depreciation between top-up and spend, the USDT settlement spread, and the domestic payment fee. A pricing model that ignores any of the three will silently run at a loss. **This is why AIFA's pricing cannot be a simple "cost + X%." It must be an FX-buffered, prepaid, fast-settling model.** The rest of this document builds that model.

---

## 5.1 — PRICING ARCHITECTURES IN THE MARKET (taxonomy)

**FACT (High, from V1 + Phase 2):** four architectures exist, each with a different risk profile for AIFA's specific problem:

| Architecture | Who uses it | How it works | Fit for AIFA's FX problem |
|---|---|---|---|
| **Subscription + allowance** | ChatGPT ($20/$200), Poe ($5–$250), GapGPT (299K T/mo) | Fixed monthly fee, capped usage | **Poor** — fixed Toman price + variable USD cost + FX drift = margin erodes within the month |
| **Pure prepaid credit** | OpenRouter, Higgsfield, Hoosha, ChatQT, Fal | Buy credits, spend per use | **Best** — money is collected and can be settled *before* FX moves; usage self-limits to balance |
| **Pass-through + fee** | OpenRouter (5.5% credit fee, min $0.80) | Provider cost at cost + a transparent margin | **Best for trust** — the transparency model, but the fee % must cover FX+settlement |
| **Reseller markup** | Iranian proxies | Opaque markup on resold access | **Forbidden** (7.4) — and FX-fragile anyway |

**INSIGHT + RECOMMENDATION R-5.1 — AIFA should combine the two "best" rows: prepaid credit with a transparent, disclosed margin (pass-through + fee), settled to USD fast.** This is BM-01 (Prepaid Credits) as already chartered — Phase 5 confirms it is not just the trust-correct choice but the *only FX-survivable* one. Subscription can exist as an optional convenience tier for heavy users (Phase 3 B-19), but the **prepaid credit wallet is the economic core**, because it lets AIFA convert Toman→USDT quickly and hold value in the hard currency it owes.

---

## 5.2 — THE FULL MARGIN MODEL (the heart of Phase 5)

### 5.2.1 The cost stack on one unit of value (FACT-based model, High inputs)
Every 1 USD of supplier value AIFA delivers carries this stack (built from Phase 2 supplier prices + V1 §2.3 rails + current FX):

| Layer | Cost | Source / confidence |
|---|---|---|
| Supplier model cost | $1.00 (reference unit) | Phase 2, High |
| USDT settlement spread (Toman→USDT→USD to pay supplier) | +1–3% | V1 §2.3, Medium |
| Domestic payment fee (Zarinpal ~0.5–1%, capped 3,000 T) | +0.5–1% | V1 §2.3, High |
| **FX depreciation risk** (Toman held between top-up and settlement) | +0–8% depending on hold time | INSIGHT from ~23–25%/6mo depreciation; **the killer variable** |
| Failed-generation refunds (7.1 debt of honor, B-13) | +1–3% of gross | ASSUMPTION, Medium |
| Free-tier / signup credits (C-13, C-12) | Marketing cost, not per-unit | Phase 3 |
| **Total landed cost of $1 of value** | **~$1.03–1.15** before any margin | INSIGHT |

**INSIGHT — the FX row is the whole game.** If AIFA collects Toman on Monday and settles to USDT on Monday, the FX risk is ~0%. If it holds Toman for 30 days, it can lose 4–8% to depreciation *before delivering anything*. **This means AIFA's operational discipline — how fast it converts Toman to USDT — is a bigger margin lever than its markup percentage.** A well-run 15% markup with same-day settlement beats a 30% markup with 30-day float.

### 5.2.2 The required gross margin (RECOMMENDATION)
To survive the stack above and fund operations, AIFA needs a **transparent markup in the 25–40% range over landed supplier cost** — *provided settlement is fast.* This is comparable to OpenRouter's effective take on small top-ups (5.5% fee, but min $0.80 = ~16% on a $5 top-up) plus the FX/settlement burden OpenRouter doesn't carry.
- **RECOMMENDATION R-5.2:** target a **default disclosed margin of ~30%** over landed cost, shown transparently (7.1), with the explicit framing to users: *"AIFA's price = model cost + a margin that funds Persian access, honest support, and keeping the lights on."* Transparency about the *existence* of a margin is itself a differentiator — resellers hide theirs.

### 5.2.3 Worked examples (FACT inputs, INSIGHT synthesis; all at USD≈183,000 T, July 15 2026)

**Example A — a chat message on an open model (DeepInfra/Together tier):**
- Say a medium chat exchange consumes ~2,000 output tokens on Llama-3.3-70B-class at ~$0.30–0.88/1M output (Phase 2). Cost ≈ **$0.0006–0.0018** (fractions of a cent).
- At 30% margin + stack ≈ **$0.001–0.0025** to the user ≈ **180–460 Toman** per exchange.
- **INSIGHT:** open-model chat is *nearly free to deliver*. This is why D-08/D-09 (open + free model tiers) are economically trivial and should anchor the free daily allowance (C-12). **The free tier costs AIFA almost nothing and acquires users — it is the cheapest marketing in the model.**

**Example B — a premium chat message (GPT/Claude/Gemini-class):**
- A frontier-model exchange at ~$5–15/1M output, ~2,000 tokens ≈ **$0.01–0.03** supplier cost.
- Landed + 30% ≈ **$0.013–0.04** ≈ **2,400–7,300 Toman** per exchange.
- **INSIGHT:** still cheap in absolute terms, but ~10–20× the open-model cost. **This is exactly why quote-before-commit (C-01) matters and why model choice must be transparent — a user firing frontier-model queries unknowingly could spend 20× more than they realize.** The transparency isn't just ethical; it prevents the bill-shock that drives churn (Phase 2 §2.2.5).

**Example C — an image (Fal Seedream V4 tier):**
- Supplier: **$0.03/image** (Phase 2, High). Landed + 30% ≈ **$0.04** ≈ **~7,300 Toman/image**.
- **INSIGHT:** at ~7,000 T/image, a user with a 50,000 T balance gets ~7 images. Hoosha charges **6 credits/image** (Phase 3) — the market has already anchored image pricing at roughly this level. AIFA is competitive here **and** can show the per-image cost before generating (C-01).

**Example D — video (why it's excluded from Phase 1, now quantified):**
- Veo 3 at **$0.40/sec** (Phase 2) → an 8-sec clip = **$3.20** supplier cost → landed + 30% ≈ **$4.16** ≈ **~760,000 Toman per clip.**
- **INSIGHT (confirms Phase 2 R-2.5 and Phase 3 G-01):** a single premium video clip costs **~2.5× the entire monthly GapGPT subscription (299,000 T).** At Iranian purchasing power this is unsellable as anything but an explicit premium add-on. Even cheap video (Wan at $0.05/sec) is ~95,000 T for an 8-sec clip — still a meaningful fraction of a monthly budget.
- **This is the quantified, sourced proof that video is a diaspora/business product (USD pricing), not an Iran-resident consumer feature.**

### 5.2.4 The diaspora inversion (INSIGHT — high strategic value)
Everything above assumes Toman collection. **For the diaspora paying in USD (Phase 3 B-07, B-17 Gift Credits), the entire FX/settlement problem disappears:**
- No Toman depreciation risk. No USDT settlement spread. Standard card fees (~3%) instead of the ~3–12% Iranian stack.
- The diaspora user pays USD, AIFA pays USD suppliers — **a clean, ~30%-margin, low-risk transaction.**
- **INSIGHT:** the diaspora isn't just a bigger-ARPU segment (V1 §2.1); it is a **structurally higher-margin and lower-risk** segment because it removes the currency mismatch entirely. **Gift Credits (B-17) let a diaspora user fund an Iran-resident user with hard currency — collapsing AIFA's hardest economic problem for that transaction.** This strengthens the Phase 3 R-3.1 recommendation: Gift Credits is not just a growth feature, it is a **margin-and-risk-mitigation instrument.**
- **→ UPDATE FLAGGED: Business Model Charter (MEGP-7) should model the diaspora/Gift-Credit channel as a distinct, higher-margin revenue line with its own (much simpler) unit economics — currently BM-01 treats all credit purchases identically.**

---

## 5.3 — CREDIT SYSTEM MECHANICS (design decisions)

**FACT (Phase 3):** the market's credit mechanics range from honest (OpenRouter's transparent $ balance) to forbidden (opaque points, expiry). AIFA's credit design decisions, each with a constitutional constraint:

| Decision | Options | RECOMMENDATION | Constitutional driver |
|---|---|---|---|
| **Unit of account** | $ / Toman / abstract "credits"/"points" | **Show real Toman cost**, not abstract points | 7.1 (Poe's points confusion is the anti-pattern, C-14) |
| **Denomination** | fixed packs / any amount | Offer common packs **and** custom top-up | User control |
| **Expiry** | expire / never | **Never expire** (Product Blueprint #1 P3 TODO → resolve to "no expiry") | 7.1 (B-20 is NEVER) |
| **Refunds** | none / on-failure / on-request | **Auto-refund on failure (B-13) + self-serve request (B-14)** | 7.1 debt of honor |
| **Reservation** | none / hold-and-settle | **Hold-and-settle** to prevent negative balance | Financial correctness (B-12) |
| **Low-balance UX** | hard cutoff / warning | **Warn before cutoff, never mid-generation surprise** | 7.1 |
| **Bonus credits** | expiring-pressure / plain | **Plain, non-expiring bonuses** (gain-framed, not loss-framed) | 7.1 (J-17 is NEVER) |

**INSIGHT — the credit unit is a constitutional choice, not a UX preference.** Showing "۷٬۳۰۰ تومان" for an image is honest; showing "6 credits" (like Hoosha) or abstract "points" (like Poe) obscures the real price and invites the 7.1 violation. **AIFA should show real Toman throughout, with the model cost visible** — the credit wallet holds Toman, not a proprietary currency. This is a subtle but decisive differentiator: AIFA is the platform where you always know what things cost *in money you understand.*

---

## 5.4 — PAYMENT FLOW & SETTLEMENT (the operational moat)

**FACT (V1 §2.3, Phase 3 B-03/B-04/B-05):** the flow is Rial-in (Zarinpal/Snapp Pay/IDPay/Jibit) → hold as Toman → convert to USDT via broker → pay supplier in USD.

**INSIGHT — settlement speed is the hidden margin lever (restating §5.2.1 as an operational mandate).** Because FX depreciation is the largest cost-stack variable, **the treasury operation — how fast and cheaply AIFA converts collected Toman to USDT — is a core competency, not a back-office chore.** A competitor with a better markup but slower settlement earns less. This is genuinely hard to do well and genuinely hard to copy → **it is one of AIFA's few real operational moats** (consistent with V1 §2.3's conclusion that the payment pipeline is the durable moat).

**RECOMMENDATION R-5.4 — Adopt an internal FX peg with a buffer.** Price user-facing Toman off a *conservative* internal USD rate (e.g., the market rate + a 3–5% buffer), refreshed frequently, so that normal daily FX moves don't push individual transactions underwater. Show users Toman prices; recompute the peg continuously; never let the displayed Toman price lag the market so far that AIFA sells value below landed cost. **This peg is the mechanism that operationalizes "never hardcode a Toman price."**

**RECOMMENDATION R-5.5 — Prioritize Snapp Pay (B-04) for basket size and Zarinpal (B-03) for reliability, with a mandatory second gateway (B-05) live before launch** (FP-11: exit path before first use). Rail failure is frequent (Phase 4 §4.4); the second gateway converts a lost sale into a retry.

---

## 5.5 — PERSIAN-MARKET PRICE ANCHORING (FACT + INSIGHT)

**FACT (V1 + Phase 3):** the market's visible anchors:
- GapGPT subscription: **from 299,000 Toman/month** (~$1.63 at current FX).
- Hoosha: **free 25 credits/day**, then credit purchase (exact Toman Unavailable); image = 6 credits, music = 15, chat = 1 credit/1000 words.
- Free daily allowances are the norm (Hoosha 25/day; GapGPT ~25 messages free).

**INSIGHT — the anchors reveal three things:**
1. **The psychological monthly price point is ~200,000–400,000 Toman** (~$1.10–2.20). AIFA's subscription tier, if offered, must land near here or feel expensive.
2. **Free daily allowance is table-stakes**, not a differentiator — everyone offers it; AIFA must too (C-12), but can't win on it alone.
3. **~$1.63/month for "unlimited-ish" access is astonishingly cheap by global standards** ($20 ChatGPT = ~3.66M Toman = unaffordable). This is the access gap AIFA monetizes — but it also means **absolute margins per Iranian user are tiny**, reinforcing that (a) open-model/free tiers must be near-zero cost, (b) volume and retention matter more than ARPU domestically, and (c) the diaspora/business segments carry the profit (§5.2.4).

**INSIGHT — the pricing-psychology trap.** Because domestic prices are so low in USD terms, there is constant temptation to boost margin with the forbidden mechanics (expiry, opaque points, urgency) that Phase 3/4 catalogued. **The low absolute price point is exactly what makes the dark patterns tempting and exactly why the constitution forbids them.** AIFA's answer is volume + trust + diaspora margin, not squeezing the cash-poor domestic user.

---

## 5.6 — PRICING PSYCHOLOGY: HONEST vs. FORBIDDEN (consolidates Phase 4 §4.5)

| Honest pattern (USE) | Forbidden pattern (NEVER) | Why the line is here |
|---|---|---|
| Quote-before-commit (C-01) | Post-hoc surprise billing | 7.1 test Q1 |
| Real-Toman pricing | Opaque points/credits (C-14) | 7.1 — user must know real cost |
| Non-expiring credits | Credit expiry (B-20) | 7.1 — stored value is a debt |
| Gain-framed bonus ("earned 3 days") | Loss-framed urgency ("2h left!") (J-16) | 7.1 — inform vs. pressure |
| Transparent disclosed margin | Hidden markup / silent model swap (D-20) | 7.4 / 7.2 |
| Cheaper-model recommendation (C-08) | Always-route-to-expensive | 7.2 — default must benefit user |
| Volume discount shown upfront | "Unlimited" with hidden throttle (B-22) | 7.1/7.3 — Higgsfield's error |
| Free tier as genuine gift | Free tier as bait-and-switch | 7.1 |

**RECOMMENDATION R-5.6 — Every one of these becomes a line in the Business Model Charter's written 7.1/7.4 test (MEGP-7), so that each pricing mechanism is pre-cleared or pre-forbidden before any implementation.**

---

## 5.7 — API & ENTERPRISE PRICING (Phase 2+ preview)

**FACT (Phase 3 L-01):** ChatQT and AvalAI already sell OpenAI-compatible API access to Iranian developers, PAYG on Rial credit. **INSIGHT:** the API pricing model is the *same* prepaid-credit engine with a different surface — no new economic model needed, just a developer UX and usage dashboard (L-03). Enterprise (Phase 3 M-05/M-07) adds Iranian-tax-compliant invoicing and (eventually) data-residency, both of which command a premium the domestic consumer can't. **API and enterprise are where domestic Toman revenue can carry real margin, because businesses are less price-sensitive than individuals and value reliability/compliance over lowest price.**

---

## 5.8 — PHASE-5 SYNTHESIS & FLAGGED UPDATES

### The pricing model for AIFA, in one paragraph
Prepaid Toman credit wallet showing **real Toman prices** (never abstract points), quote-before-commit on every paid action, **~30% transparent disclosed margin** over landed cost, **fast Toman→USDT settlement** as a core competency, an **internal FX peg with a 3–5% buffer** refreshed continuously, **no expiry, auto-refund on failure**, a near-free open-model/free-daily tier for acquisition, and a **structurally higher-margin diaspora/Gift-Credit channel in USD** that carries the profit while the domestic side wins volume and trust. Optional subscription (~200–400K T) for heavy users. Video priced (later) only as an explicit USD premium add-on because it is margin-negative at Toman price points.

### Findings that update prior documents (per founder rule 7)
| Finding | Prior document | Update |
|---|---|---|
| FX depreciation is the largest cost variable; settlement speed > markup % | Business Model Charter (MEGP-7) | Add FX-peg + fast-settlement as a chartered operating assumption; add A-BM3: "settlement within N hours" |
| Diaspora/Gift-Credit is a structurally higher-margin, lower-risk revenue line | Business Model Charter; Strategy Dossier | Model it as a distinct unit-economics line, not identical to domestic credit |
| Video quantified as margin-negative (~760K T/clip vs 299K T/mo sub) | Strategy Dossier §Sequencing; Product Blueprint #1 §P0.4 | Attach the sourced number to the video-exclusion rationale |
| Real-Toman credit unit (not points) is a constitutional choice | Product Blueprint #1 §P2.5 (credit purchase); BM-01 | Specify the wallet holds/displays Toman, not abstract credits |
| Never hardcode Toman prices; use an FX peg | Product Blueprint #1 §P3 (pricing TODOs); CAP-C2-003 lineage | Add as an explicit implementation constraint |
| ~30% disclosed margin as the default | Business Model Charter BM-01 | Set as the chartered default, shown transparently |

### Confidence register
- Current FX (USD≈183,000 T, 2026-07-15): **High** but **volatile** — recompute at implementation.
- Supplier per-unit costs: **High** (Phase 2), but model versions/prices move weekly.
- USDT settlement spread (1–3%): **Medium** — intermediary-sourced; verify with an actual broker at implementation.
- Failed-generation refund rate (1–3%): **ASSUMPTION, Medium** — no operating data yet.
- Hoosha exact Toman prices: **Unavailable** (carried from V1).
- 30% margin recommendation: **INSIGHT/RECOMMENDATION**, not a sourced fact — validate against real settlement costs in the first operating month.

---

**END OF PHASE 5.** Full margin model built on current FX · four worked unit-economics examples · video quantified as margin-negative · credit mechanics decided · settlement identified as the operational moat · honest/forbidden pricing psychology tabulated · 6 prior-document updates flagged.

**Next (Phase 6): Technology Intelligence** — infrastructure, routing, caching, fallback, latency optimization, scaling, and architecture patterns of the major competitors, translated into what AIFA's Intelligence Access boundary (CAP-C7-001) must actually do. Purely architectural, no implementation — consistent with the constitution's execution boundaries.

Send **CONTINUE**.
