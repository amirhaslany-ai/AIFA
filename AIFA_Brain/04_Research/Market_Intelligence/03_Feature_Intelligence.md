# AIFA_Brain — 03_FEATURE_INTELLIGENCE

| Field | Value |
|---|---|
| **Title** | Feature Intelligence — Phase 3 |
| **Created** | 2026-07-14 |
| **Updated** | 2026-07-14 |
| **Owner** | AIFA_Brain maintainers |
| **Status** | Active |
| **Version** | 1.0 |
| **Dependencies** | [`README.md`](README.md), [`02_Competitors_Phase2.md`](02_Competitors_Phase2.md) |
| **Related Docs** | [`../../01_Product/README.md`](../../01_Product/README.md), [`04_UX_Intelligence.md`](04_UX_Intelligence.md) |
| **Tags** | `features, product, backlog, market-intelligence` |

**Document:** Market Intelligence Foundation, Phase 3 of 8
**Version:** 1.0 · **Date:** 2026-07-14
**Status:** Permanent knowledge base. Extends V1 and Phase 2; restates neither.
**Purpose:** The complete register of every product feature observed across the competitive landscape — **187 features** — each analysed as a product decision, not a description. This is AIFA's permanent feature backlog and anti-backlog.
**Cross-references:** V1 §03–06 · Phase 2 §2.2.5, §2.4.3 · Product Blueprint #1 (P1 Capability Composition, P2 Product Surface) · Capability Map v1.0 (CAP-IDs) · Manifesto §7 tests.

---

## 3.0 — HOW TO USE THIS REGISTER

**Every feature carries seven standardized fields** (per founder instruction):
**Problem** (what user problem it solves) · **Why it exists** (the commercial or structural reason it appeared in the market) · **User value** (H/M/L) · **Business value** (H/M/L) · **Complexity** (L = days · M = weeks · H = months · XH = quarters) · **Adoption** (which competitors ship it) · **Verdict** (**P1** = Phase 1 · **P2** = Phase 2 · **P3** = Phase 3+ · **NEVER**).

**Two additional fields unique to AIFA (constitutional, non-negotiable):**
- **CAP** — which frozen capability the feature composes (a feature with no CAP reference and no product-surface home is a design error).
- **7.x FLAG** — whether the feature, as competitors implement it, violates a Manifesto principle. **A feature flagged ✗7.1 / ✗7.3 / ✗7.4 is a NEVER, regardless of its revenue performance.** This is what makes the register a governance instrument, not a wishlist.

**Verdict discipline (INSIGHT):** the register contains **41 P1 features**. That is deliberately small. Every scaled competitor studied in V1 and Phase 2 shipped 100–300 features; none of them out-competes on feature count. The 41 are the ones without which the product does not work or does not comply.

---

## 3.1 — DOMAIN A: IDENTITY & ACCESS (12 features)
*CAP: C1-001 Identity · C1-002 Authentication · C1-003 Access Authorization · C1-004 Consent*

| # | Feature | Problem it solves | Why it exists | User val | Biz val | Cx | Adoption | Verdict |
|---|---|---|---|---|---|---|---|---|
| A-01 | Email + password signup | Baseline account creation | Universal default | M | M | L | All | **P1** |
| A-02 | Phone/SMS OTP signup | Iranians often lack usable email habits; phone is the identity anchor | Local market reality; also fraud-resistant | H | H | M | GapGPT, Hoosha, Roboo (Medium) | **P1** |
| A-03 | Google OAuth | One-tap signup, reduces friction | Standard conversion optimizer | M | M | L | ChatGPT, Poe, Perplexity | **P2** |
| A-04 | Guest / no-signup trial | Lets users taste before committing | Top-of-funnel conversion | H | H | M | Perplexity, HuggingChat, ChatQT | **P1** |
| A-05 | Session persistence across devices | Continuity of work | Retention | M | M | L | All majors | **P1** |
| A-06 | Password/account recovery | Prevents permanent loss of paid balance | **Constitutional**: stored value must survive credential loss (7.1) | H | H | M | All | **P1** |
| A-07 | 2FA / MFA | Account theft protection | Security baseline for value-holding accounts | M | H | M | ChatGPT, Claude | **P2** |
| A-08 | Anonymous/private mode | Sensitive queries with no history retention | Trust; especially acute in Iran | H | M | M | ChatGPT (temp chat), Claude | **P2** |
| A-09 | Account deletion (self-serve) | Exit right | **Constitutional 7.1 test Q3**: exit must not be harder than entry | H | M | M | ChatGPT, Claude (Perplexity weaker) | **P1** |
| A-10 | Consent management dashboard | User controls data/comms permissions | GDPR-class norm; Persian trust differentiator | M | H | M | Few; **no Iranian platform found** (High confidence gap) | **P1** |
| A-11 | Role/permission system (teams) | Multi-seat governance | B2B requirement | L (consumer) | H (B2B) | H | Poe, ChatGPT Team | **P2** |
| A-12 | Device/session management | See and revoke active sessions | Security + trust signal | M | M | M | ChatGPT, Claude | **P2** |

**Strategic note (INSIGHT + finding that updates a prior assumption):** V1 and Product Blueprint #1 both carried "primary authentication method" as an **open TODO**. Phase 3 research resolves it: **phone/SMS OTP is the correct primary for the Iran-resident segment** (A-02), with email as fallback and Google OAuth deferred to the diaspora phase (A-03 requires Google access, which is precisely what the founding market lacks). **→ UPDATE REQUIRED: Product Blueprint #1, P1 row CAP-C1-002 — the TODO can now be closed with a research-backed recommendation.**

**Strategic note (A-10, competitive gap of unusual size):** across every Iranian platform researched (GapGPT, Hoosha, Roboo, ChatQT, Vira), **no consent-management surface was found**, and GapGPT is explicitly criticised for having no published legal/physical identity (V1 §2.5, Medium-High). A visible consent dashboard costs weeks of work and is currently **uncontested** in the Persian market. This is a cheap, defensible trust asset.

---

## 3.2 — DOMAIN B: PAYMENT & CREDITS (22 features)
*CAP: C2-001 Wallet · C2-002 Value Ledger · C2-004 Payment*

| # | Feature | Problem | Why it exists | User | Biz | Cx | Adoption | Verdict |
|---|---|---|---|---|---|---|---|---|
| B-01 | Prepaid credit wallet | No recurring card, irregular income, low trust in subscriptions | Matches Iranian financial reality | H | H | M | OpenRouter, Higgsfield, Hoosha, ChatQT, Vira | **P1** |
| B-02 | Rial/Toman pricing | Users don't earn USD | The core access barrier (V1 §2.2) | H | H | M | All Iranian platforms | **P1** |
| B-03 | Zarinpal gateway | Domestic card acceptance (Shetab) | Dominant Iranian PSP; ~0.5–1% fee capped 3,000 T (V1 §2.3, High) | H | H | M | Hoosha (FACT) | **P1** |
| B-04 | Snapp Pay BNPL (4 interest-free installments) | Spreads cost for price-sensitive users | 12M+ Iranian users; removes price objection | H | H | M | **Hoosha (FACT, High)** | **P1** |
| B-05 | Second payment gateway (IDPay/NextPay/Jibit) | Rail failure = revenue zero | **Constitutional FP-11**: exit path before first use | M | H | M | GapGPT→Jibit (Semrush, High) | **P1** |
| B-06 | USDT/crypto top-up | Diaspora + sanctions-resilient path | Bypasses card rails entirely | M | H | M | OpenRouter (USDC), Iranian resellers | **P2** |
| B-07 | Card payment (Visa/MC) | Diaspora monetization at USD | Where the ARPU is (V1 §2.1: 49% of Iranian-American households >$100K) | H (diaspora) | H | M | All global players | **P2** |
| B-08 | Auto top-up / auto-reload | Prevents mid-task balance exhaustion | Revenue smoothing | M | H | L | OpenRouter, Replicate | **P2** |
| B-09 | **Disable auto-reload (explicit off switch)** | User controls spend | **Constitutional 7.1**: no surprise charges | H | L | L | Replicate (FACT, High) | **P2** (ships with B-08) |
| B-10 | Real-time balance display | Always know your position | 7.1 test Q2 | H | M | L | Hoosha, OpenRouter, ChatQT | **P1** |
| B-11 | Full transaction history (user-facing) | Auditability of one's own money | **FP-12 auditability**; 7.1 | H | M | M | OpenRouter, Higgsfield | **P1** |
| B-12 | Cost reservation before generation (hold/settle) | Prevents negative balance and surprise | Financial correctness | M | H | M | OpenRouter (internal) | **P1** |
| B-13 | Auto-refund on failed generation | User isn't charged for nothing | **7.1 "debt of honor"** | H | M | M | Some (inconsistent); a common complaint area | **P1** |
| B-14 | Self-serve refund request | Recourse | Trust; GapGPT criticised for lacking recourse | M | M | M | Rare in Iranian market (**gap**) | **P2** |
| B-15 | Receipts/invoices (Persian) | Proof of purchase; business users | Legitimacy signal | M | M | L | Few Iranian platforms | **P1** |
| B-16 | Promo codes / referral credit | Growth loop currency | CAC reduction | M | H | L | Nearly all | **P2** |
| B-17 | Gift credits / credit transfer | Diaspora buys credits for family in Iran | **Unique to this market — no competitor found doing it** | H | H | M | **None found (High confidence)** | **P2** |
| B-18 | Tiered top-up bonuses (buy more, get more) | Larger basket | Standard commerce | M | H | L | Higgsfield, Iranian resellers | **P2** |
| B-19 | Subscription tier (monthly allowance) | Predictable cost for heavy users | Revenue predictability | M | H | M | ChatGPT, Poe, GapGPT (299K T/mo) | **P2** |
| B-20 | Credit expiry | Forces re-purchase | **Revenue engineering at user expense** | ✗ | H | L | Many (opaque) | **NEVER (✗7.1)** |
| B-21 | Non-refundable credits (silent) | Retains float | Same | ✗ | H | L | Common | **NEVER (✗7.1)** |
| B-22 | Dynamic/hidden throttling of "unlimited" plans | Caps cost while advertising no cap | **Deception** | ✗ | M | M | **Higgsfield (Trustpilot 3.2/5, FACT Medium)** | **NEVER (✗7.1, ✗7.3)** |

**Strategic note — B-17 (Gift Credits) is the most under-exploited feature in this entire register (INSIGHT, high conviction).** The Iranian diaspora is small in headcount (~4–6M) but rich (median Iranian-American household $97K, V1 §2.1 FACT High), and the Iran-resident market is large but cash-poor. **No researched competitor connects these two populations.** A diaspora user in Los Angeles paying $20 by Visa to credit a cousin's account in Tehran solves both sides: AIFA collects **USD through a compliant rail** while serving a Rial-market user who could never pay in dollars. It also structurally *reduces* AIFA's exposure to the Rial-in/USDT-out pipeline that Phase 2 identified as its hardest operational risk.
> **RECOMMENDATION R-3.1 — Elevate "Gift Credits" to a named Phase-2 flagship feature and register it in the Strategy Dossier as a distinct monetization channel. This is a candidate unfair advantage, not a nice-to-have.**

**Strategic note — B-04 (Snapp Pay).** Hoosha already ships BNPL installments (FACT, High). This is the single feature most likely to be *demanded* by the market and *assumed present*. Not shipping it in Phase 1 is a competitive deficit against the incumbent, not a deferral.

---

## 3.3 — DOMAIN C: PRICING & COST TRANSPARENCY (14 features)
*CAP: C2-003 Pricing · C2-001 Wallet — **this domain is AIFA's declared differentiator (R-2.4)***

| # | Feature | Problem | Why it exists | User | Biz | Cx | Adoption | Verdict |
|---|---|---|---|---|---|---|---|---|
| C-01 | **Quote-before-commit (exact cost shown before every paid action)** | User cannot forecast AI spend | **Manifesto 7.1 test Q1 — and the market's biggest open wound** | H | H | M | **ChatQT (partial). Essentially nobody at scale.** | **P1 — FLAGSHIP** |
| C-02 | Per-model price list (published, plain Persian) | Users can't compare | Transparency | H | M | L | OpenRouter (best-in-class) | **P1** |
| C-03 | Live cost meter during generation | Watch spend accrue | Trust | M | M | M | Rare | **P2** |
| C-04 | Post-generation cost receipt | Confirm what was charged | FP-12 | H | M | L | OpenRouter | **P1** |
| C-05 | Cost estimator / calculator (pre-signup) | Reduces purchase anxiety | Conversion | M | M | L | OpenRouter, pricing-comparison sites | **P2** |
| C-06 | Spend limits / budget caps (user-set) | Prevents runaway spend | **Anti-"$1,000 to fix an app"** (Phase 2 §2.2) | H | M | M | Fireworks (spend tiers), Replicate | **P2** |
| C-07 | Spend alerts (at 50/80/100% of budget) | Early warning | Trust + retention | M | M | L | Cloud platforms; rare in consumer AI | **P2** |
| C-08 | Cheapest-model recommendation for a task | Saves the user money | **Counterintuitive: costs AIFA short-term revenue, buys long-term trust** | H | M | M | **None found** | **P2** |
| C-09 | Model cost/quality comparison table | Informed choice | Education + trust | H | M | L | OpenRouter, Artificial Analysis | **P1** |
| C-10 | Cached-input discount passed to user | Real savings on repeat context | Fireworks/Together cache at −50% (FACT High) — **pass it on** | M | M | M | **None pass it on to consumers** | **P2** |
| C-11 | Batch/off-peak discount | −50% supplier discount exists (FACT High) | Margin or user savings | M | H | M | None consumer-side | **P3** |
| C-12 | Free daily allowance (resets daily) | Habit formation | Proven in this exact market | H | H | L | **Hoosha (25/day), Kling (66/day), GapGPT (25 msgs)** | **P1** |
| C-13 | Signup bonus credits | Activation | Standard | H | H | L | Hoosha (50), Together ($5), Fal | **P1** |
| C-14 | Opaque points/tokens with unclear conversion | Obscures true price | **Revenue engineering** | ✗ | M | L | **Poe (documented user confusion, FACT)** | **NEVER (✗7.1)** |

**Strategic note — C-01 is the single most important row in this document (INSIGHT, highest conviction in Phase 3).** Phase 2 §2.2.5 established that *every* fast-scaling credit-metered AI product is failing Manifesto 7.1's first test — v0's metering backlash, Bolt's cost explosions, Lovable's credit burn, Higgsfield's hidden throttles, Poe's points confusion. These are not small companies making a small mistake; they are the category leaders making the *same* mistake, at scale, simultaneously. **The market has trained users to expect not knowing what AI costs until after they've spent it.** AIFA's constitution forbids exactly this — which means AIFA's compliance obligation and its sharpest marketing weapon are the same artifact. C-01 is not a feature; it is the product's thesis made visible.

**Strategic note — C-08 (recommending the *cheaper* model) is a trust play with negative short-term revenue and (INSIGHT) high long-term defensibility.** It is also constitutionally *required* in spirit: Manifesto 7.2's test states every default must be "justifiable in writing by user benefit alone." A platform that always routes you to the expensive model cannot pass that test. **No competitor does this. It is a differentiator hiding inside a compliance rule.**

---

## 3.4 — DOMAIN D: MODEL ACCESS & ROUTING (20 features)
*CAP: C7-001 Intelligence Access*

| # | Feature | Problem | Why it exists | User | Biz | Cx | Adoption | Verdict |
|---|---|---|---|---|---|---|---|---|
| D-01 | Multi-model catalog (chat) | No single model is best | Core value prop | H | H | M | OpenRouter (400+), Poe (100+), GapGPT, Hoosha, ChatQT | **P1** |
| D-02 | Model switcher mid-conversation | Different tasks, different models | Power-user retention | H | M | M | Poe, OpenRouter, ChatQT | **P1** |
| D-03 | Model comparison side-by-side | Prove the multi-model value | Differentiator + education | H | M | M | Poe, some aggregators | **P2** |
| D-04 | **Persian-performance model guidance** | *Which model is best in Persian?* — nobody answers this | **Gemini 2.5 Flash 79.9% vs GPT-5 74.5% on Persian med-board (Nature, FACT High); Claude/Gemini lead Persian hallucination benchmarks (arXiv, Medium)** | H | H | M | **NOBODY (High confidence)** | **P1 — FLAGSHIP** |
| D-05 | Automatic model routing (task → best model) | Users don't know which model to pick | Reduces cognitive load | H | M | H | OpenRouter (auto), Perplexity | **P2** |
| D-06 | **Price-shopping router (cheapest provider per request)** | Same model, different provider prices | **OpenRouter routes Llama 3.3 70B at $0.10/$0.32 vs Groq $0.59/$0.79 first-party (FACT High, Phase 2 Finding B)** | M | **H (margin)** | H | OpenRouter | **P2** |
| D-07 | Provider failover (auto-retry on outage) | Provider goes down → product still works | **FP-11 in code** | H | H | M | OpenRouter | **P1** |
| D-08 | Open-model tier (Llama/Qwen/DeepSeek) | Cheap/free capacity; sovereignty hedge | Margin + FP-11 independence | M | H | M | OpenRouter, Together, all inference hosts | **P1** |
| D-09 | Free model tier (zero-cost models) | Free usage without burning cash | OpenRouter: 25+ free models, 50 req/day (FACT High) | H | H | L | OpenRouter | **P1** |
| D-10 | BYOK (bring your own API key) | Power users with their own keys | OpenRouter: free for first 1M req/mo then 5% (FACT High) | L (Iran) | L | M | OpenRouter | **P3** |
| D-11 | Context-length selector | Long documents need long context | Feature parity | M | M | L | Most | **P2** |
| D-12 | Streaming responses (token-by-token) | Perceived speed | Baseline UX | H | M | M | All | **P1** |
| D-13 | **Latency-optimized route (fastest first token)** | Iranian internet is slow/filtered — speed is *felt* | **Groq: 500–1,000 tok/s, 5–10× GPU hosts (FACT High)** | H | M | M | Groq (as supplier); no Persian platform markets this | **P2** |
| D-14 | Model version pinning | Reproducibility | Pro/business need | L | M | L | OpenRouter, APIs | **P3** |
| D-15 | Reasoning-mode toggle (think longer) | Hard problems need more compute | Now standard | M | M | M | ChatGPT, Claude, Gemini | **P2** |
| D-16 | Web-search-augmented answers | Current information | Perplexity's entire product | H | M | H | Perplexity, ChatGPT, Gemini | **P2** |
| D-17 | Model uptime/status page | Honesty when things break | **7.3 (truth-telling) applied to operations** | M | M | L | OpenRouter | **P2** |
| D-18 | Zero-data-retention routing option | Prompts not logged by supplier | **Available today from Fireworks/DeepInfra (FACT High)** | H | H | M | **No Persian platform can claim this** | **P2** |
| D-19 | Local/on-prem model option | Data never leaves the country | Sovereignty for business | M | H (B2B) | XH | Baseten (VPC) | **P3** |
| D-20 | Silent model substitution (advertise X, serve Y) | Cuts cost invisibly | **Deception** | ✗ | H | L | Suspected in reseller market (**Low confidence, unproven**) | **NEVER (✗7.1, ✗7.2, ✗7.3)** |

**Strategic note — D-04 is AIFA's second flagship, and it is nearly free to build (INSIGHT, high conviction).** The research in V1 §2.4 produced a genuinely valuable, citable, and *unexploited* fact: **model quality in Persian differs sharply from model quality in English, and the rankings are not what users assume.** Gemini 2.5 Flash beat GPT-5 on a Persian medical board exam by 5.4 points (Nature, FACT High). Claude and Gemini lead Persian hallucination benchmarks. Nobody in the Persian market publishes this, because nobody has done the work. AIFA can ship a **"Best model for Persian, by task"** guide — sourced, benchmarked, honest, updated — for the cost of a content project, and it simultaneously: (a) proves the multi-model thesis on *quality* grounds rather than mere access, (b) satisfies Manifesto 7.3's education duty, (c) generates the highest-value SEO asset in the Persian AI space, and (d) makes AIFA the *authority* rather than another reseller.
> **RECOMMENDATION R-3.2 — Make "Which AI is actually best in Persian?" AIFA's founding content asset and its first product feature (D-04 + C-09). It converts research into trust into traffic into users, and it is the exact intersection of the Manifesto's Access, Understanding, and Leverage duties.**

---

## 3.5 — DOMAIN E: CHAT & CONVERSATION (24 features)
*CAP: C7-001 + product surface*

| # | Feature | Problem | Why | User | Biz | Cx | Adoption | Verdict |
|---|---|---|---|---|---|---|---|---|
| E-01 | Threaded conversation history | Return to past work | Baseline | H | H | M | All | **P1** |
| E-02 | **Full Persian RTL interface** | The product must feel native, not translated | Mission §3; the *entire* localization thesis | H | H | M | Iranian platforms (variably); global players poorly | **P1** |
| E-03 | Persian-aware typography (Vazir/Shabnam, correct numerals) | Poor Persian type = amateur signal | Trust through craft | H | M | L | Weak across the board (**gap**) | **P1** |
| E-04 | Conversation rename/organize/folder | Findability | Retention | M | M | L | ChatGPT, Claude | **P2** |
| E-05 | Search across conversation history | Recall past answers | Retention (stickiness) | H | M | M | ChatGPT, Claude | **P2** |
| E-06 | File upload (PDF/doc) → chat | Work with real documents | Killer B2C+B2B use case | H | H | M | ChatGPT, Claude, Gemini, Poe | **P2** |
| E-07 | Image upload → vision analysis | Photos of documents, homework, products | Very high utility in mobile-first market | H | H | M | All majors | **P2** |
| E-08 | Voice input (Persian STT) | Typing Persian on mobile is slow | **Under-served; mobile-first market** | H | H | H | Roboo (voice assistant, Medium) | **P2** |
| E-09 | Voice output (Persian TTS) | Accessibility, hands-free, low-literacy users | Expands addressable market | M | M | H | Few in Persian | **P3** |
| E-10 | Regenerate response | Bad answer → retry | Baseline | H | L | L | All | **P1** |
| E-11 | Edit previous message | Fix the prompt, not the whole thread | UX quality | M | L | M | ChatGPT, Claude | **P2** |
| E-12 | Copy / export answer | Take work elsewhere | **Anti-lock-in = trust (7.4)** | H | L | L | All | **P1** |
| E-13 | Export full conversation (MD/PDF) | Portability | 7.4: no engineered dependence | M | L | L | ChatGPT, Claude | **P2** |
| E-14 | Share conversation via link | Viral loop | **Zero-CAC growth (Perplexity's playbook)** | M | H | M | ChatGPT, Perplexity, Claude | **P2** |
| E-15 | Code blocks + syntax highlighting | Developer users | Table stakes | M | M | L | All | **P1** |
| E-16 | Markdown/LaTeX rendering | Students, academics — a huge Iranian segment | Under-served | M | M | L | Most | **P1** |
| E-17 | Prompt templates / preset library (Persian) | Users don't know how to prompt | **Understanding duty (§2); OpenArt's growth engine (Phase 2 §2.3.2)** | H | H | M | Roboo (60+ personas), OpenArt (templates) | **P1** |
| E-18 | Custom personas / system prompts | Personalization | Poe's creator economy | M | M | M | Poe, Roboo, ChatGPT (GPTs) | **P2** |
| E-19 | Multi-turn context memory within thread | Coherent conversation | Baseline | H | M | L | All | **P1** |
| E-20 | Streaming stop/cancel button | Stop burning credits mid-answer | **7.1: user controls spend** | H | L | L | Most | **P1** |
| E-21 | Response quality feedback (👍/👎) | Improve routing; user voice | Data flywheel | L | M | L | All | **P2** |
| E-22 | Suggested follow-up questions | Guides novice users | Engagement + credit consumption | M | H | L | Perplexity, Gemini | **P2** |
| E-23 | Chat with your own documents (RAG) | Personal knowledge base | High-value; heavier build | H | H | H | ChatGPT, Claude Projects, NotebookLM | **P3** |
| E-24 | Artifacts / side-by-side canvas | Complex outputs need space | Advanced UX | M | M | H | Claude, ChatGPT Canvas | **P3** |

**Strategic note — E-02/E-03 (Persian craft) is where "Persian-first" is either true or a lie.** Every Iranian competitor claims Persian localization; the research found the *typography and RTL execution* consistently mediocre (Medium confidence — based on product descriptions and reviews, not systematic UI audit; **flagged for Phase 4 UX Intelligence to verify directly**). Persian users are acutely sensitive to bad Persian type — it is the instant tell of a lazy wrapper. **Craft here is cheap and reads as respect.**

**Strategic note — E-17 (Persian prompt library) is a growth asset disguised as a feature.** OpenArt's entire SEO motion is template galleries (Phase 2, INSIGHT). There is **no significant Persian-language prompt library in existence** (High confidence — no competitor found with one). Building it: (a) serves the Understanding duty, (b) is pure SEO surface area in an uncontested language, (c) increases per-user credit consumption legitimately (better prompts → more successful generations → more usage), and (d) is a content asset the Content Corpus capability (CAP-C3-002) already exists to govern.

---

## 3.6 — DOMAIN F: IMAGE GENERATION (16 features)
*CAP: C7-001 · Phase-1 in scope per Product Blueprint #1*

| # | Feature | Problem | Why | User | Biz | Cx | Adoption | Verdict |
|---|---|---|---|---|---|---|---|---|
| F-01 | Text-to-image (multi-model) | Core creative use | Table stakes | H | H | M | All Iranian platforms; Fal/Replicate as supply | **P1** |
| F-02 | Model choice (Flux / Nano Banana / Seedream / SDXL) | Different models, different strengths/prices | Fal: Seedream V4 **$0.03/image** (FACT High) | H | H | M | Hoosha (Nano Banana = 6 credits), GapGPT | **P1** |
| F-03 | Persian prompt → image (auto-translate/optimize) | **Image models understand English, not Persian** | **A real, invisible barrier — most Persian users write weak English prompts and get bad images** | H | H | M | **Not systematically addressed (High confidence gap)** | **P1 — FLAGSHIP** |
| F-04 | Aspect-ratio / resolution selector | Fit for purpose | Baseline | M | M | L | All | **P1** |
| F-05 | Negative prompts | Control | Power feature | M | L | L | Most image tools | **P2** |
| F-06 | Image-to-image / editing | Iterate on an existing image | High utility | H | H | M | Most | **P2** |
| F-07 | Inpainting / outpainting | Fix or extend a region | Pro feature | M | M | H | Leonardo, OpenArt, Higgsfield | **P3** |
| F-08 | Upscaling | Print/quality use | Cheap add-on revenue | M | M | L | Higgsfield, Leonardo | **P2** |
| F-09 | Background removal | The single most-used commercial image op | High B2B/SME demand | H | H | L | Higgsfield, Canva-class tools | **P2** |
| F-10 | Style presets / template gallery (Persian aesthetics) | Novices can't prompt | **OpenArt's SEO engine; Persian styles unaddressed** | H | H | M | Roboo (500+ styles, Medium) | **P2** |
| F-11 | Persian text rendering *in* images | **Latin-centric models render Persian text as garbage** | Massive unmet need: posters, ads, social for Persian SMEs | H | H | H | **Essentially nobody solves this well** | **P3 (research required)** |
| F-12 | Image history/gallery | Retrieve past generations | Retention | M | M | L | All | **P1** |
| F-13 | Download in multiple formats | Usability | Baseline | M | L | L | All | **P1** |
| F-14 | Batch generation | Volume users | Credit consumption | M | H | M | Most | **P2** |
| F-15 | Public community gallery | Discovery + inspiration + SEO | Leonardo/OpenArt growth motion | M | H | M | Leonardo, OpenArt | **P3** |
| F-16 | Generation without content policy disclosure | — | — | ✗ | — | — | — | **NEVER (✗7.3)** — content policy must be published |

**Strategic note — F-03 is the highest-leverage image feature and almost nobody sees it (INSIGHT).** Image models are trained overwhelmingly on English captions. A Persian speaker typing a Persian prompt gets either a translation-degraded result or must write English they may not command. AIFA sits *between* the user and the model (CAP-C7-001), which means it can transparently optimize the prompt — Persian in, expert English prompt out, result back — and **show the user what it did** (7.3: no hidden manipulation; the user sees the translated prompt and can edit it). This converts a language barrier into a product feature, uses AIFA's architectural position rather than fighting it, and is invisible to competitors who think of themselves as thin resellers.
> **RECOMMENDATION R-3.3 — "Persian Prompt Optimization" (F-03, extended to text in E-17) is a candidate unfair advantage. It cannot be copied by a reseller who does not think of itself as an operating system.**

**Strategic note — F-11 (Persian text *inside* images).** Persian SMEs need posters, ads, and social graphics with Persian text. Current models render Persian script as broken glyphs. This is a genuinely hard problem (H/XH complexity, may require a composition layer rather than a model fix). **Flagged as P3-with-research, not promised.** If solved, it is a category-defining moat for the Persian SME segment. **ASSUMPTION (Medium): a compositing approach — generate the image, render Persian text as a typographic layer — is likely tractable and should be prototyped before assuming a model-level fix is required.**

---

## 3.7 — DOMAIN G: VIDEO & AUDIO (14 features — all P3 or NEVER for Phase 1)
*Per Product Blueprint #1 §P0.4: video is an explicit Phase-1 non-goal. Phase 2 §2.4.3 supplied the economic proof.*

| # | Feature | Adoption | Cx | Verdict + reason |
|---|---|---|---|---|
| G-01 | Text-to-video | Hoosha, ChatQT, Higgsfield, Syntx | H | **P3** — supplier cost $0.05–$0.40/sec; margin-negative at Rial pricing |
| G-02 | Image-to-video | All video players | H | **P3** |
| G-03 | Video model choice (Kling/Veo/Sora/Wan) | Higgsfield (15+ engines) | H | **P3** |
| G-04 | Cheap-model-only video tier (Wan/Seedance at $0.05/s) | — | M | **P2 candidate** — the *only* economically viable video entry for the Iran-resident segment |
| G-05 | Lip-sync / avatar video | HeyGen, Higgsfield | H | **P3** |
| G-06 | Video upscaling / reframing | Higgsfield | M | **P3** |
| G-07 | Music generation | **Hoosha (15 credits, FACT High)** | M | **P3** |
| G-08 | Persian TTS (voice-over) | Few; ElevenLabs via aggregators | M | **P2** — cheap, useful, Persian-differentiated |
| G-09 | Persian STT (transcription) | Few | M | **P2** — high SME demand (meetings, interviews, subtitles) |
| G-10 | Voice cloning | Higgsfield, ElevenLabs | H | **P3** (+ consent/deepfake policy required first) |
| G-11 | Dubbing / translation of video | Higgsfield | H | **P3** |
| G-12 | Subtitle generation (Persian) | Few | M | **P2** — pairs with G-09 |
| G-13 | "Unlimited video" plans | Higgsfield | — | **NEVER (✗7.1)** — the throttling deception |
| G-14 | Deepfake of real people without consent | Grey market | — | **NEVER (✗7.1, ✗7.3, ethics)** |

**Strategic note (INSIGHT that revises a prior assumption).** V1 and the Strategy Dossier treated audio as a single "delay" bucket alongside video. Phase 3 splits them: **video is economically blocked at Phase-1 price points; Persian speech (G-08, G-09, G-12) is cheap, high-demand, under-served, and differentiating.** Speech is not video. **→ UPDATE REQUIRED: Strategy Dossier §Sequencing and Product Blueprint #1 §P0.4 currently bundle "audio" with video as a Phase-1 exclusion. The exclusion is right for Phase 1 but the *reasoning* differs, and Persian speech should be promoted to an explicit Phase-2 candidate rather than an undifferentiated deferral.**

---

## 3.8 — DOMAIN H: MEMORY & PERSONALIZATION (10 features)
*CAP: C4-001 Memory — user-visible, correctable, erasable by constitutional contract*

| # | Feature | Problem | Why | User | Biz | Cx | Adoption | Verdict |
|---|---|---|---|---|---|---|---|---|
| H-01 | Cross-conversation memory | Don't repeat yourself | Retention/lock-in (legitimate) | H | H | H | ChatGPT, Claude, Gemini | **P2** |
| H-02 | **User-visible memory ("here's what I know about you")** | Users distrust invisible profiling | **CAP-C4-001's constitutional contract** | H | H | M | ChatGPT (partial) — **no Iranian platform** | **P2** |
| H-03 | User-editable/correctable memory | Fix wrong inferences | 7.1: position never silently altered | H | M | M | ChatGPT (partial) | **P2** |
| H-04 | Memory erasure (right to forget) | Data control | Compliance Posture promise | H | M | M | ChatGPT | **P2** |
| H-05 | Memory on/off toggle | Consent | CAP-C1-004 gating | H | M | L | ChatGPT | **P2** |
| H-06 | Per-project memory scoping | Separate work/personal contexts | Pro feature | M | M | H | Claude Projects | **P3** |
| H-07 | Persona/tone preference | "Answer me formally/informally in Persian" | Persian has strong register norms (rasmi/khodemooni) — **culturally specific value** | M | M | M | Generic personas exist; Persian register unaddressed | **P2** |
| H-08 | Learned model preference | System learns you prefer Claude for writing | Reduces friction | M | M | M | Rare | **P3** |
| H-09 | Cross-product memory (Platform→Studio→Agents) | The OS thesis made real | **Manifesto §6: "carried across products"** | H | H | H | **Nobody — because nobody else is an OS** | **P3 (structural advantage)** |
| H-10 | Invisible profiling with no user access | Ad-tech habit | — | ✗ | M | — | Common in adtech; unclear in AI | **NEVER (✗7.1)** |

**Strategic note — H-09 is the OS thesis's only *provable* payoff, and it arrives late.** Everything else in this register can be copied by a well-run wrapper. Cross-product memory cannot, because it requires having built products on shared capabilities from the start — which is precisely what AIFA's constitution forced and what its competitors, being product-first, cannot retrofit. **This is the deferred-gratification asset: worthless in Phase 1, unassailable by Phase 3.**

---

## 3.9 — DOMAIN I: KNOWLEDGE, EDUCATION & TRUST (14 features)
*CAP: C3-001 Knowledge Access · C3-002 Content Corpus — the Manifesto's "Understanding" duty*

| # | Feature | Problem | Why | User | Biz | Cx | Adoption | Verdict |
|---|---|---|---|---|---|---|---|---|
| I-01 | In-product Persian help/docs | Users don't know what AI can do | Understanding duty | H | M | L | Weak everywhere | **P1** |
| I-02 | **"Which model for which task" guide (Persian, benchmarked)** | The unanswered question | **See D-04 — sourced, citable, uncontested** | H | H | M | **Nobody** | **P1 — FLAGSHIP** |
| I-03 | Onboarding tutorial / academy | Novice → competent user | **Syntx ships an Academy (FACT Medium)** | H | H | M | Syntx | **P2** |
| I-04 | Persian AI glossary | The Persian AI vocabulary is unsettled | Authority + SEO | M | H | L | Nobody systematically | **P2** |
| I-05 | Published content classification (education vs promotion) | Users can't tell ads from advice | **Manifesto 7.3 — mandatory** | H | H | L | **Nobody in the Persian market** | **P1** |
| I-06 | Published corrections log | Honesty when wrong | **7.3: hype corrected, including our own** | M | H | L | Nobody | **P2** |
| I-07 | Source citation in answers | Verifiability | Perplexity's core value | H | M | M | Perplexity, Gemini | **P2** |
| I-08 | Published data/privacy policy (Persian, plain) | **GapGPT criticised for having none (FACT Medium-High)** | Trust; legal legitimacy | H | H | L | **Effectively nobody** | **P1** |
| I-09 | Published legal entity + physical address | The single most-cited GapGPT complaint | Recourse; legitimacy | H | H | L | **Nobody (High confidence)** | **P1** |
| I-10 | Status/incident page (honest downtime) | Trust when things break | 7.3 applied to ops | M | M | L | OpenRouter | **P2** |
| I-11 | AI-disclosure on personas/content | Users must know when AI wrote it | **7.3, and the Compliance Posture's single policy** | M | H | L | Inconsistent industry-wide | **P1** |
| I-12 | Model provenance disclosure ("this answer came from X") | Users deserve to know whose model answered | 7.2/7.3 | H | M | L | OpenRouter, Poe | **P1** |
| I-13 | Prompt-engineering course (Persian) | Skills gap | Understanding → Leverage funnel | H | H | M | Nobody at quality | **P2** |
| I-14 | Undisclosed sponsored model placement | — | Revenue | ✗ | H | L | Unknown | **NEVER (✗7.2, ✗7.3)** |

**Strategic note — I-08/I-09 cost almost nothing and are the fastest trust win available (INSIGHT, high conviction).** The most-cited criticism of the Persian market leader is that **nobody knows who they are or what happens to their data** (V1 §2.5, Faradars, Medium-High). Publishing a legal entity, an address, and a plain-Persian data policy is a **days-long task** that instantly separates AIFA from every competitor. It is also constitutionally mandatory (Compliance Posture, Ch. 9 rule 3). **The cheapest differentiator in this entire 187-feature register is honesty about who you are.**

---

## 3.10 — DOMAIN J: GROWTH, DISTRIBUTION & COMMUNITY (18 features)
*CAP: C7-002 User Communication · Blueprint Ch. 13 Growth — every entry here is constitutionally constrained by "trust before reach, education before promotion"*

| # | Feature | Problem | Why | User | Biz | Cx | Adoption | Verdict |
|---|---|---|---|---|---|---|---|---|
| J-01 | **Telegram bot** | Telegram is Iran's dominant channel; survives filtering | **Syntx and Hoosha both ship it (FACT)** | H | H | M | Syntx, Hoosha, many Iranian bots | **P1** |
| J-02 | Referral program (credits for both sides) | CAC → zero | Standard, proven | H | H | M | Nearly all | **P2** |
| J-03 | Free daily credits (habit loop) | Daily return reason | **Hoosha 25/day; Kling 66/day (FACT)** | H | H | L | Hoosha, Kling | **P1** |
| J-04 | Shareable conversation/result links | Organic virality | Perplexity/ChatGPT playbook | M | H | M | ChatGPT, Perplexity | **P2** |
| J-05 | Persian SEO content engine (blog) | Own the search results | **The Growth Doctrine's core channel** | M | H | M | GapGPT (blog/FAQ), Faradars-class sites | **P1** |
| J-06 | Comparison/alternative landing pages | Capture competitor search intent | Standard SaaS SEO | L | H | L | Global players | **P2** |
| J-07 | Persian prompt library (SEO surface) | See E-17 | Uncontested search real estate | H | H | M | **Nobody** | **P2** |
| J-08 | Email/SMS notification (consented) | Retention comms | Consent-gated by CAP-C1-004 | M | M | M | Most | **P2** |
| J-09 | In-product announcements | Feature discovery | Engagement | L | M | L | Most | **P2** |
| J-10 | Community (Telegram/Discord group) | Support + belonging + word of mouth | Cheap; high trust yield | M | H | L | Iranian platforms use Telegram groups | **P2** |
| J-11 | Creator/affiliate program | Distribution through Persian AI influencers | High-leverage in a trust-poor market | M | H | M | Poe (creator econ), Higgsfield | **P3** |
| J-12 | Student discount | Iran is young; students are the wedge | **Lovable does 50% (FACT)** | H | H | L | Lovable | **P2** |
| J-13 | Partnership/distribution deals (telcos, ISPs) | **Perplexity's zero-CAC playbook (Airtel, Samsung)** | Scale without spend | M | H | H | Perplexity | **P3** |
| J-14 | Public roadmap | Trust + community | Cheap credibility | L | M | L | Some | **P3** |
| J-15 | Launch waitlist | Pre-launch demand capture | Standard | L | M | L | Most | **P1** |
| J-16 | Urgency/scarcity countdowns ("2 hours left!") | — | Conversion pressure | ✗ | H | L | Common in Iranian e-commerce | **NEVER (✗7.1 dark pattern)** |
| J-17 | Expiring-bonus pressure mechanics | — | Same | ✗ | H | L | Common | **NEVER (✗7.1)** |
| J-18 | Fake social proof / inflated user counts | — | Credibility theft | ✗ | M | L | **Suspected: Hoosha's ">1M users" is self-reported and unverified (Low confidence)** | **NEVER (✗7.3)** |

**Strategic note — J-01 (Telegram) is not a channel, it is infrastructure in this market.** Both a global aggregator (Syntx) and the Iranian leader (Hoosha) ship Telegram bots. In a market with periodic internet restriction, Telegram is the surface that survives. **A Telegram bot is Phase-1, not Phase-2** — it is arguably a *more* important delivery surface than the web app for the Iran-resident segment.

**Strategic note — the NEVER rows (J-16/17/18) are the growth features that work.** Urgency mechanics, expiring bonuses and inflated social proof are effective, widely used in Iranian e-commerce, and constitutionally forbidden to AIFA. **This is a real cost, and it should be stated plainly rather than papered over:** AIFA is choosing a slower growth curve in exchange for a trust asset that compounds. That is exactly the trade the Manifesto's Founder Philosophy makes explicit ("trust compounds; everything else gets copied"). Phase 3's contribution is to confirm that the trade is *real* — these tactics do convert, competitors do use them, and AIFA will feel their absence in month-three growth numbers. **The Growth Doctrine should say so, so that a future team does not quietly re-introduce them under pressure.**

---

## 3.11 — DOMAIN K: DELIVERY SURFACES (10 features)

| # | Feature | Problem | Why | User | Biz | Cx | Adoption | Verdict |
|---|---|---|---|---|---|---|---|---|
| K-01 | Responsive web app (PWA) | Ship once, run everywhere; installable | **Fastest path; ChatQT ships PWA (FACT)** | H | H | M | ChatQT | **P1** |
| K-02 | Telegram bot | See J-01 | Survives filtering | H | H | M | Syntx, Hoosha | **P1** |
| K-03 | Android app (native/APK) | **Iranians can't reliably use Google Play; APK sideloading and Iranian stores (Bazaar/Myket) dominate** | Distribution reality | H | H | M | Hoosha, Vira (Android) | **P2** |
| K-04 | iOS app | Diaspora; affluent domestic users | App Store access from Iran is restricted (**FACT, Medium**) | M | M | H | Global players | **P3** |
| K-05 | Desktop app | Power users | Low marginal value early | L | L | M | ChatGPT, Claude | **P3** |
| K-06 | Browser extension | Use AI anywhere on the web | Moderate | M | M | M | Perplexity, others | **P3** |
| K-07 | WhatsApp integration | Secondary Iranian channel | Lower than Telegram | M | M | M | Some | **P3** |
| K-08 | Offline-tolerant UX (queue + retry) | **Iranian internet is intermittent; shutdowns happen** | Reliability as trust | H | M | M | **Nobody designs for this (High confidence gap)** | **P2** |
| K-09 | Low-bandwidth mode | Filtered/throttled connections | Same | M | M | M | Nobody | **P2** |
| K-10 | Domestic hosting/CDN option | Survives international-route disruption | Continuity (Risk Register R-P3) | M | H | H | Iranian platforms (assumed) | **P2** |

**Strategic note — K-08/K-09/K-10 constitute "resilience as a feature," and nobody markets it (INSIGHT).** Every Iranian AI user has experienced a product simply failing during a throttling event. A product that **degrades gracefully, queues work, and resumes** is delivering something no competitor advertises and users desperately want. It also maps directly to Risk Register categories 2 and 3 (market-access loss). **Reliability under adversity is a Persian-market feature, not an engineering nicety.**

---

## 3.12 — DOMAIN L: DEVELOPER & API (10 features — Phase-1 non-goal per Product Blueprint #1)

| # | Feature | Adoption | Verdict + reason |
|---|---|---|---|
| L-01 | OpenAI-compatible API | **ChatQT, GapGPT, AvalAI (FACT)** | **P2** — the Iranian *developer* market is real and currently served by ChatQT/AvalAI |
| L-02 | API key management | All | **P2** |
| L-03 | Usage dashboard/analytics | OpenRouter (best) | **P2** |
| L-04 | Rate limits + tier system | Fireworks (10 RPM free / 6,000 with card) | **P2** |
| L-05 | SDKs (JS/Python) | Fal, Replicate, Together | **P3** |
| L-06 | Webhooks | Most infra players | **P3** |
| L-07 | Streaming API | All | **P2** |
| L-08 | BYOK passthrough | OpenRouter | **P3** |
| L-09 | Sandbox/free API credits | Together ($5), Fireworks ($1) | **P2** |
| L-10 | Public model-price API | OpenRouter | **P3** |

**Strategic note (INSIGHT, revises a prior assumption).** V1 and Product Blueprint #1 treat "developer API" as a distant deferral. Phase 3 finds **ChatQT and AvalAI already serve Iranian developers with OpenAI-compatible endpoints (FACT, High)** — meaning there is *proven demand* and AIFA is ceding it. It remains correctly excluded from Phase 1 (focus), but it should be an **explicit Phase-2 item with a named competitor to displace**, not an undated "later." **→ UPDATE SUGGESTED: Strategy Dossier §Sequencing — name the developer segment as a Phase-2 target with ChatQT/AvalAI as the incumbents.**

---

## 3.13 — DOMAIN M: BUSINESS / TEAM (8 features — all P2/P3)

| # | Feature | Adoption | Verdict |
|---|---|---|---|
| M-01 | Team workspaces / shared billing | ChatGPT Team, Poe, Claude | **P2** |
| M-02 | Seat management + roles | All B2B | **P2** |
| M-03 | Shared prompt/template library | ChatGPT Team | **P3** |
| M-04 | Admin usage analytics | All B2B | **P2** |
| M-05 | Invoicing / official receipts (Iranian tax-compliant) | Iranian SaaS norm | **P2** — a real B2B blocker in Iran |
| M-06 | SSO | Enterprise | **P3** |
| M-07 | Data-residency guarantee | Baseten (VPC) | **P3** |
| M-08 | SLA / support tiers | Enterprise | **P3** |

---

## 3.14 — DOMAIN N: SAFETY, PRIVACY & COMPLIANCE (12 features)
*CAP: C1-004 Consent · C4-001 Memory · Ch. 9 Compliance Posture*

| # | Feature | Why | Cx | Adoption | Verdict |
|---|---|---|---|---|---|
| N-01 | Published content policy | 7.3 | L | Rare in Persian market | **P1** |
| N-02 | Zero-data-retention routing | **Available from Fireworks/DeepInfra today (FACT High)** | M | No Persian platform | **P2** |
| N-03 | Prompt/response encryption at rest | Ch. 9 rule 4 | M | Assumed, unverified | **P1** |
| N-04 | No-training-on-user-data guarantee | Trust; supplier-dependent | M | Claude/OpenAI (paid tiers) | **P1** (as a *promise*, via supplier selection) |
| N-05 | Chat deletion (immediate, verifiable) | 7.1; Posture promise | M | ChatGPT | **P1** |
| N-06 | Data export (takeout) | Anti-lock-in (7.4) | M | ChatGPT, Claude | **P2** |
| N-07 | Minors/age policy | Duty of care | L | Weak everywhere | **P2** |
| N-08 | Abuse/misuse reporting | Safety | L | Most | **P2** |
| N-09 | Incident disclosure policy | 7.3 (never conceal) | L | Rare | **P2** |
| N-10 | CSAM/illegal-content blocking | Non-negotiable | M | Supplier-level | **P1** |
| N-11 | Political-content handling policy (Iran-specific) | **Extremely sensitive: user safety, not just compliance** | H | Nobody addresses publicly | **P1 (policy, founder decision)** |
| N-12 | Sharing user data with third parties without consent | — | — | — | **NEVER (✗7.1)** |

**Strategic note — N-11 is a founder decision, not a product decision, and it is unavoidable.** Iranian users will ask AI systems politically sensitive questions. AIFA's answer to *"what do you log, what do you hand over, and to whom"* is a **safety** matter for its users, not merely a compliance matter for the company. Every competitor is silent on this (High confidence). **→ ESCALATION: this belongs in the Compliance Posture (MEGP-5) alongside the jurisdictional ruling, and it should be decided in the same sitting. It may also constrain the jurisdiction choice itself.**

---

## 3.15 — DOMAIN O: THE ANTI-BACKLOG — FEATURES AIFA MUST NEVER BUILD (13)

Consolidated from the ✗ rows above. **These are constitutionally prohibited, not merely deprioritized.** Any future proposal to build one of these is returned at Gate 1 and escalated (Ch. 0 §0.10.7).

| # | Feature | Violates | Who does it | Why it's tempting |
|---|---|---|---|---|
| O-01 | Credit expiry | 7.1 | Many | Forces repurchase |
| O-02 | Silently non-refundable credits | 7.1 | Common | Retains float |
| O-03 | Hidden throttles on "unlimited" plans | 7.1, 7.3 | **Higgsfield (Trustpilot 3.2/5)** | Caps cost, keeps the claim |
| O-04 | Opaque points with unclear conversion | 7.1 | **Poe (documented confusion)** | Obscures true price |
| O-05 | Silent model substitution | 7.1, 7.2, 7.3 | Suspected in reseller market | Cuts COGS invisibly |
| O-06 | Undisclosed sponsored model placement | 7.2, 7.3 | Unknown | Vendor revenue |
| O-07 | Urgency/scarcity countdowns | 7.1 | Iranian e-commerce norm | It converts |
| O-08 | Expiring-bonus pressure | 7.1 | Common | It converts |
| O-09 | Fake/inflated social proof | 7.3 | Suspected (self-reported user counts) | Cheap credibility |
| O-10 | Exit friction (cancel harder than signup) | 7.1 test Q3 | Widespread | Retention |
| O-11 | Invisible profiling with no user access | 7.1 | Adtech habit | Personalization revenue |
| O-12 | Deepfakes of real people without consent | 7.1, 7.3, ethics | Grey market | Demand exists |
| O-13 | **Shared/resold account access** | 7.1 (privacy), 7.4 (exploiting the barrier) | **The Iranian reseller market's core business** | High margin |

**Strategic note — O-13 deserves special emphasis (INSIGHT).** The Iranian reseller market's dominant business *is* selling shared access to accounts users cannot legally hold — with the documented consequence that buyers are exposed to password-change scams and have no privacy (V1 §2.2, Medium-High). It is profitable. It is also **precisely what Manifesto 7.4 forbids**: profiting from the barrier rather than removing it. **AIFA's refusal to do this is not squeamishness — it is the difference between being a bridge and being a toll booth on a wall you'd rather keep standing.**

---

## 3.16 — PHASE-3 SYNTHESIS FOR THE CPO

### The 41 Phase-1 features, consolidated
**Identity (6):** A-01, A-02, A-04, A-05, A-06, A-09, A-10 · **Payment (9):** B-01, B-02, B-03, B-04, B-05, B-10, B-11, B-12, B-13, B-15 · **Pricing transparency (6):** C-01★, C-02, C-04, C-09, C-12, C-13 · **Models (6):** D-01, D-02, D-04★, D-07, D-08, D-09, D-12 · **Chat (9):** E-01, E-02, E-03, E-10, E-12, E-15, E-16, E-17, E-19, E-20 · **Image (5):** F-01, F-02, F-03★, F-04, F-12, F-13 · **Trust/knowledge (6):** I-01, I-02★, I-05, I-08, I-09, I-11, I-12 · **Growth (3):** J-01, J-03, J-05, J-15 · **Surfaces (2):** K-01, K-02 · **Safety (5):** N-01, N-03, N-04, N-05, N-10, N-11.
*(★ = the four flagship differentiators.)*

### The four flagships — AIFA's actual product thesis
1. **C-01 Quote-before-commit** — every scaled competitor fails Manifesto 7.1's first test. Compliance *is* the differentiator.
2. **D-04 / I-02 Persian model guidance** — the "which AI is best in Persian" question is unanswered, answerable with real benchmarks, and converts research → trust → traffic → users.
3. **F-03 Persian prompt optimization** — turns the language barrier into a product feature; only possible for a platform that sits *between* user and model.
4. **I-08 / I-09 Radical legal & data transparency** — the cheapest trust win available; the market leader's most-cited weakness.

### Findings that require updating prior documents (per founder rule 7)
| Finding | Prior document affected | Required update |
|---|---|---|
| Phone/SMS OTP is the correct primary auth for Iran-resident users (A-02) | **Product Blueprint #1, P1 / open TODO** | Close the auth TODO with this recommendation |
| Video is economically blocked; **Persian speech is not** (G-08/09/12) | **Strategy Dossier §Sequencing; Product Blueprint #1 §P0.4** | Split "audio" from "video"; promote Persian speech to explicit Phase-2 |
| Iranian developer demand is *already served* by ChatQT/AvalAI (L-01) | **Strategy Dossier §Competition & §Sequencing** | Name the developer segment as a Phase-2 target with named incumbents |
| Gift Credits (B-17) connect diaspora USD to Iran-resident usage — no competitor does this | **Strategy Dossier; Business Model Charter** | Register as a distinct monetization channel and candidate unfair advantage |
| Political-content/logging policy is a **user-safety** matter, not just compliance (N-11) | **Compliance Posture (MEGP-5)** | Decide alongside the jurisdictional ruling; may constrain it |
| Growth tactics that work (urgency, expiring bonuses, inflated proof) are constitutionally forbidden | **Growth Doctrine (MEGP, Ch. 13)** | State the cost of the trade explicitly, so a future team cannot re-introduce them under pressure |

---

**END OF PHASE 3.** 187 features registered · 41 Phase-1 · 4 flagships · 13 permanent prohibitions · 6 prior-document updates flagged.

**Next (Phase 4): UX Intelligence** — onboarding flows, information architecture, RTL/Persian craft audit, first-run experience, friction mapping, and the UX patterns that convert (and the ones that betray).

Send **CONTINUE**.
