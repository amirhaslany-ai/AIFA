# AIFA_Brain — 04_UX_INTELLIGENCE

| Field | Value |
|---|---|
| **Title** | UX Intelligence — Phase 4 |
| **Created** | 2026-07-14 |
| **Updated** | 2026-07-14 |
| **Owner** | AIFA_Brain maintainers |
| **Status** | Active |
| **Version** | 1.0 |
| **Dependencies** | [`README.md`](README.md), [`03_Feature_Intelligence.md`](03_Feature_Intelligence.md) |
| **Related Docs** | [`../User_Research/README.md`](../User_Research/README.md), [`../../08_Design/README.md`](../../08_Design/README.md), [`05_Pricing_Intelligence.md`](05_Pricing_Intelligence.md) |
| **Tags** | `ux, onboarding, persian, rtl, trust, market-intelligence` |

**Document:** Market Intelligence Foundation, Phase 4 of 8
**Version:** 1.0 · **Date:** 2026-07-14
**Status:** Permanent knowledge base. Extends V1, Phase 2, Phase 3; restates none of them.
**Purpose:** The complete UX intelligence layer — how competitors onboard, structure, and retain users; the Persian RTL/typography craft standard AIFA must meet; the friction points that lose users; and the conversion patterns that are honest versus the ones that betray. UX is where AIFA's constitution becomes *felt* by a user or fails to.
**Cross-references:** Phase 3 Domains A, C, E, J, K (features referenced by ID) · Product Blueprint #1 §P2 Product Surface · Manifesto 7.1 (dark patterns), 7.8 (understandable) · CAP-C7-002, C1-004.

**Labels:** FACT (sourced) · INSIGHT (analysis) · RECOMMENDATION · ASSUMPTION. **Confidence:** High / Medium / Low / Unavailable.

> **Methodological honesty (important).** Direct, systematic hands-on teardowns of the Iranian competitors' live interfaces (GapGPT, Hoosha, ChatQT, Roboo, Vira) were **not** performed in this phase — several are JS-rendered, some are robots-blocked, and a rigorous UI audit requires interactive access. Where this document describes a specific competitor's interface behavior, it is drawn from product descriptions, reviews, and general market knowledge and is marked **Medium** or **Low**. Universal UX principles, onboarding benchmarks, and RTL/Persian technical requirements are **sourced and High**. **A hands-on competitive UX teardown is the single most valuable follow-up to this phase and is flagged as a discrete work item (see §4.9).**

---

## 4.0 — THE UX THESIS FOR AIFA

**INSIGHT — the one-sentence thesis.** In the Persian AI market, *access* is solved and *features* are commoditized (Phase 3), which means **the product that wins will win on the felt experience of two things: how fast a new user reaches their first successful result, and how much they trust the interface while spending money in it.** Everything in this phase serves those two variables: **time-to-first-value (TTFV)** and **trust-per-interaction.**

Two benchmarks anchor the phase:
- **FACT (High):** the 2026 AI-onboarding benchmark is **~60 seconds to value** (Wes Bush/ProductLed), with the strongest flows giving useful output from minimal input. The general SaaS activation benchmark is only **37.5%, median TTFV 1 day 12 hours** — meaning ~2 of 3 signups never reach value.
- **FACT (High):** **90% of users churn if they don't see value in the first week** (UserGuiding); **72% abandon apps during onboarding with too many steps** (Clutch).

**INSIGHT:** AI-native products (Cursor, Lovable, Notion) have collapsed onboarding to "minimal flow, then straight to value" (FACT, Userpilot, High). For AIFA this is doubly true, because the founding-market user is often **AI-curious but AI-inexperienced** (they've heard of ChatGPT, been blocked from it, and bought a shared account once). Their patience is low and their trust is pre-damaged. **The onboarding cannot afford a single wasted step.**

---

## 4.1 — ONBOARDING INTELLIGENCE

### 4.1.1 The dominant patterns competitors use (FACT, High)
From the 2026 onboarding teardowns (Userpilot, Guideflow, Contentsquare):
- **Segmented onboarding** — ask 1–2 focused questions (role/use-case), map each answer to a tailored starting point pre-loaded with relevant templates (Notion's pattern). *Recognition over recall.*
- **Outcome-first** — bring the user close to the result before setup (Calendly), or point at a single first action on an otherwise empty state (Dropbox's central upload zone + side checklist).
- **Bumpers, not value-delivery** — the product delivers value; the flow only catches wanderers. Long guided tours are dismissed in under a second.
- **Narrowly-defined activation event** — "published their first flow," not "logged in three times."

### 4.1.2 The AIFA onboarding — recommended flow (RECOMMENDATION, high conviction)
Designed to hit <60-second TTFV for the Persian-market novice, composing only Phase-1 features (Phase 3 §3.16):

| Step | Screen | Feature (Phase 3 ID) | Constitutional note |
|---|---|---|---|
| 0 | **Try before signup** — a working chat box on the landing page, one free message, no account | A-04 guest trial · D-09 free model | TTFV before friction; the "taste" |
| 1 | **One result, instantly** — user's first prompt answered by a fast, free-tier model | D-12 streaming · D-13 latency route | The 60-second value moment |
| 2 | **Phone OTP signup** — only after value is felt, to save the conversation | A-02 phone OTP | Iran-appropriate; not email |
| 3 | **One question: "what will you use AIFA for?"** (writing / study / images / work) → tailored model + prompt-template starting point | E-17 Persian templates · D-04 model guidance | Segmented; recognition over recall |
| 4 | **Signup credit granted, balance shown, first cost previewed** | C-13 signup credit · B-10 balance · **C-01 quote-before-commit** | The trust moment: money is transparent from second one |
| — | **No credit card. No tour. No wall.** | — | 7.1: entry is easy, and (A-09) exit will be too |

**INSIGHT — why this order matters constitutionally.** Putting **value before signup (step 0–1)** and **cost transparency at the moment of first spend (step 4)** means the user experiences AIFA's two differentiators — it works, and it's honest about money — before they've committed anything. The onboarding *is* the pitch, and the pitch is the constitution.

**ASSUMPTION (Medium):** guest-trial-before-signup will materially raise activation for this segment. It is standard in 2026 (Perplexity, HuggingChat, ChatQT already do no-signup trials, Phase 3 A-04) but should be **A/B tested against signup-first**, because a free guest message has a direct supplier cost and could attract abuse. Mitigate with a rate limit and a cheap/free model at step 1.

### 4.1.3 Onboarding anti-patterns to avoid (INSIGHT, from Phase 3 anti-backlog)
- No welcome-modal wall of text (dismissed in <1s; FACT High).
- No forced tour before first value.
- No email verification gate before the user has seen anything work.
- No credit-card-before-trial (a trust-killer in a low-trust market).
- No "invite 3 friends to unlock" pressure (J-16/17 NEVER).

---

## 4.2 — INFORMATION ARCHITECTURE

### 4.2.1 The competitor IA landscape (INSIGHT, Medium)
Two IA models dominate the aggregator space:
- **Chat-first (ChatGPT, Claude, GapGPT, Hoosha):** conversation is the home; models/tools are a switcher inside it. Low cognitive load; scales poorly as modalities multiply.
- **Hub-first (Higgsfield, Syntx, OpenArt):** a dashboard of tools/models is the home; you pick a tool, then work. Scales to many modalities; higher initial cognitive load.

**INSIGHT — AIFA's IA should be chat-first in Phase 1, hub-first-capable by Phase 3.** The Phase-1 product is chat + image (Product Blueprint #1); a chat-first home with an image mode is the lowest-cognitive-load choice for novices. But because AIFA is architecturally an operating system (Manifesto §6), the IA must be **designed to accommodate a hub without a rebuild** — the home screen should be a shell that can host chat today and a tool-grid later. This is the UX expression of the OS thesis and of FP-5 (permanence vs. implementation): the *navigation shell* is durable, the *contents* evolve.

### 4.2.2 The persistent-navigation requirement (RECOMMENDATION)
Five things must be reachable from everywhere, because each is a constitutional surface:
1. **Balance** (B-10) — always visible; money is never hidden.
2. **Model selector** (D-02) — the multi-model value must be one tap away.
3. **History** (E-01) — user's work is always retrievable (anti-lock-in, 7.4).
4. **Account/consent** (A-10, H-02) — data control is always reachable.
5. **Help/learn** (I-01) — the Understanding duty is always present.

---

## 4.3 — PERSIAN RTL & TYPOGRAPHY CRAFT AUDIT (the highest-value section of Phase 4)

> **INSIGHT — why this is the section that matters most.** Every Iranian competitor *claims* Persian localization. Phase 3 flagged (Medium) that execution is inconsistent. This section establishes the **objective craft standard** AIFA must meet, so that "Persian-first" (Mission §3; Product Blueprint #1 §P2) becomes a *testable* product requirement rather than a slogan. Persian users detect bad Persian instantly — it is the single fastest "this is a lazy wrapper" signal — which makes craft here a **trust instrument**, not a cosmetic choice.

### 4.3.1 The technical requirements (FACT, High — sourced)
- **Farsi script is highly cursive; letter forms change by position in the word.** Failing to support proper Farsi text shaping produces **disjointed letters that signal a poor localization effort instantly** (translated.com, High). This is the #1 craft failure.
- **Persian-specific characters** (پ چ ژ گ) must render correctly — Arabic fonts alone are insufficient (placeholdertext.org, High).
- **`dir="rtl"` on HTML *and* CSS logical properties** (`margin-inline-start`, `text-align: start`, `border-inline-start`) — not physical `left`/`right`. Hardcoded `left`/`right` is the root cause of broken RTL (simplelocalize/translatedright, High).
- **Numbers read LTR inside RTL text** (Unicode Bidi Algorithm treats digits as weakly-typed). Phone numbers, codes, prices, and dates need explicit `dir` spans or they render with punctuation in the wrong place (simplelocalize, High). **This directly affects AIFA's price displays and balance — a mis-rendered Toman figure reads as broken.**
- **Persian numerals (۰۱۲۳) vs. Western (0123)** — a deliberate choice; Persian users expect Persian numerals in most contexts (d-fsl, High).
- **Jalali (Shamsi) calendar**, not Gregorian — dates, receipts, history timestamps must use the Persian calendar to feel native (translated.com, High). **This affects B-11 transaction history and B-15 receipts.**
- **Line height / leading must increase** — Persian diacritics and cursive forms crowd at Latin line-heights (translated.com, High).
- **Avoid bold and italic as primary emphasis** — they distort Arabic-script type; use weight/color/spacing instead (Land Rover/reffine, Medium-High).
- **Mirror functional UI, not everything** — navigation, progress bars, sliders flip; but media playback controls, undo/redo, and numeric keypads keep their universal orientation (multiple, High).
- **Bidirectional (bidi) mixed content** — Persian sentences routinely contain English model names ("Claude"), numbers, and URLs; each needs correct directional handling or the line breaks visually (argos/simplelocalize, High).

### 4.3.2 The AIFA Persian craft standard (RECOMMENDATION — make these acceptance criteria)
These should become **objective P1 acceptance tests** (they map to Phase 3 features E-02, E-03, B-11, B-15):
1. A quality Persian webfont with full shaping (e.g., Vazirmatn/Shabnam-class) — **never** a system fallback that breaks cursive joins.
2. Persian numerals by default; Western numerals only where a code/reference demands it, each in an explicit `dir` span.
3. Jalali calendar everywhere a date appears.
4. Every price, balance, and Toman figure verified in a bidi context (number + currency word + surrounding Persian).
5. Full logical-property CSS; zero hardcoded `left`/`right`; a mandatory RTL review of every screen before ship.
6. Increased line-height tuned for Persian; no bold-as-emphasis.
7. Mixed Persian/English strings (model names, receipts) tested for correct bidi rendering.

**INSIGHT — this is cheap and uncontested.** None of the above is expensive; all of it is *craft discipline*. And because competitors are inconsistent here (Phase 3 E-03, Medium), meeting this standard fully is a visible quality gap AIFA can own. **Craft reads as respect, and respect reads as trust.**

**→ UPDATE FLAGGED:** Product Blueprint #1 §P2.1 (onboarding, Persian-first) currently states the Persian-first duty as a principle. **These seven acceptance criteria should be attached to it as testable P1 requirements** so "Persian-first" cannot be quietly downgraded to "Persian-translated" during implementation.

---

## 4.4 — FRICTION MAPPING (where competitors lose users, and where AIFA can win)

**INSIGHT — the friction inventory.** Mapping the user journey against known drop-off points (sourced benchmarks) and market-specific realities:

| Journey stage | Universal friction (FACT) | Persian-market-specific friction (INSIGHT) | AIFA mitigation (Phase 3 feature) |
|---|---|---|---|
| Discovery | — | Distrust ("another reseller scam?") | I-08/I-09 published entity + policy |
| First touch | Signup wall before value (72% abandon on too many steps) | VPN fatigue; expects to be blocked | A-04 guest trial; no-VPN promise |
| Signup | Email friction | No email habit; email is a Western artifact | A-02 phone OTP |
| First result | Slow/no value in 60s | Slow filtered internet makes latency worse | D-13 latency route; D-09 free model |
| First payment | Card required; surprise cost | No Visa/MC; fear of being overcharged | B-02/B-03 Rial; **C-01 quote-before-commit** |
| Payment failure | Generic error, lost sale | Rail flakiness is common and expected | B-05 second gateway; honest error + retry |
| Ongoing use | Credit anxiety ("how much left?") | Acute in a cash-constrained market | B-10 live balance; B-13 refund-on-failure |
| Internet shutdown | Product just dies | **Happens periodically in Iran** | K-08 offline-tolerant queue/retry |
| Exit | Cancel harder than signup | Assumes they'll be trapped | A-09 easy deletion (7.1 test Q3) |

**INSIGHT — two friction points are uniquely Persian and uniquely ownable:** *payment-failure grace* (rails fail often; a product that handles it honestly with an instant second-gateway retry turns a lost sale into a trust moment) and *internet-shutdown resilience* (K-08/09/10 — no competitor designs for it). Both are invisible in normal conditions and decisive in adverse ones — which, in Iran, are frequent.

---

## 4.5 — CONVERSION UX: THE HONEST PATTERNS vs. THE DARK PATTERNS

**FACT (Phase 2 §2.2.5, Phase 3 Domain O):** the highest-converting AI-product growth mechanics in the market are also the ones AIFA's constitution forbids — v0's metering surprises, Higgsfield's hidden throttles, urgency countdowns, expiring bonuses, opaque points.

**INSIGHT — the honest-conversion toolkit.** AIFA must convert *without* the forbidden mechanics. The honest patterns that work (sourced from the 2026 onboarding literature and Phase 3):
- **Value-before-ask** (guest trial) — Perplexity/ChatQT prove it converts (Phase 3 A-04).
- **The visible first win** (Dropbox/Calendly outcome-first pattern, FACT High).
- **Free daily credits** as a *return* reason — Hoosha (25/day) and Kling (66/day) prove the habit loop works in this market (Phase 3 C-12/J-03, FACT).
- **Segmented tailoring** (one question → relevant start) — Notion's pattern (FACT High).
- **Referral credit** (both sides win) — honest because it's mutual value, not pressure (Phase 3 J-02).
- **Progress/streak** as encouragement, not as loss-framed pressure (a streak you're *building* vs. a bonus you're *losing* — the same mechanic, one honest, one a dark pattern).

**RECOMMENDATION R-4.1 — Codify the honest/dark boundary for conversion into the Growth Doctrine.** For every growth mechanic, the test is Manifesto 7.1's: *does it help the user decide, or pressure them past deciding?* Loss-framed urgency ("2 hours left!") pressures; gain-framed encouragement ("you've earned 3 days of credits") informs. The mechanics are often technically identical; the framing is the constitutional line. A future growth team under pressure will reach for the dark version unless the Doctrine draws this line explicitly.

---

## 4.6 — MOBILE-FIRST UX (the Iran reality)

**FACT (V1 §2.1):** Iran has 152M mobile connections (166% of population), 93.1% broadband; MENA smartphone penetration exceeds 70% (translatedright, High). **INSIGHT: the founding-market user is mobile-first, often mobile-only.** This has hard UX consequences:
- **PWA-first** (Phase 3 K-01) — installable, no app-store dependency (Iranians can't reliably use Google Play; Phase 3 K-03, FACT Medium). ChatQT already ships PWA.
- **Thumb-reachable primary actions** — balance, send, model-switch within thumb zone.
- **Voice input** (Phase 3 E-08) — typing Persian on mobile is slow; Persian STT is a mobile-first accelerant, under-served in the market.
- **Low-bandwidth mode** (Phase 3 K-09) — mobile data under filtering/throttling.
- **Android APK + Iranian app stores** (Bazaar/Myket) as the Phase-2 distribution reality (Phase 3 K-03).

---

## 4.7 — TRUST UX: MAKING HONESTY VISIBLE

**INSIGHT — the deepest UX principle for AIFA.** A constitution that guarantees honesty is worthless if the user can't *see* the honesty. Trust must be rendered, not just promised. Concrete UX surfaces where AIFA's constitution becomes visible:
- **The price preview** (C-01) — the single most important trust pixel in the product. It should be prominent, plain, and pre-commitment.
- **The balance** (B-10) — always visible, never buried.
- **The refund-on-failure notice** (B-13) — when a generation fails, *tell the user they weren't charged.* A silent non-charge is honest; a *visible* non-charge is trust-building.
- **The model provenance line** (Phase 3 I-12) — "answered by Claude" / "answered by Gemini" — shows AIFA isn't hiding whose model it is (7.2).
- **The "who we are" footer** (I-08/I-09) — legal entity + data policy, one tap away.
- **The consent dashboard** (A-10, H-02) — data control the user can see and touch.
- **The honest error** — when a rail or model fails, say so plainly (7.3), don't show a generic spinner-to-nowhere.

**RECOMMENDATION R-4.2 — Treat "trust surfaces" as a named, first-class UX category in the Product Surface (P2), distinct from "features." A feature does something; a trust surface *shows the user they can trust what the feature did.* No competitor thinks this way, which is exactly why it's ownable.**

---

## 4.8 — WHAT COMPETITORS DO EXCEPTIONALLY WELL (UX lessons to copy)

| Competitor | UX strength worth copying | Phase 3 feature |
|---|---|---|
| **OpenRouter** | Best-in-class cost/price transparency dashboard | C-02, C-09, B-11 |
| **Perplexity** | Value-before-signup; shareable results as growth | A-04, E-14 |
| **Notion** | Segmented onboarding (one question → tailored start) | onboarding step 3 |
| **ChatGPT** | Minimal onboarding, straight to value; clean chat IA | §4.1, §4.2 |
| **Syntx** | Telegram-native delivery + built-in Academy | J-01, I-03 |
| **Hoosha** | Free-daily-credits habit loop, proven in Persian market | C-12, J-03 |
| **Dropbox/Calendly** | Outcome-first empty states | §4.1.2 |
| **Claude** | Artifacts/canvas for complex outputs (a Phase-3 aspiration) | E-24 |

---

## 4.9 — PHASE-4 SYNTHESIS & FLAGGED FOLLOW-UP

### The UX priorities for AIFA V1 (ranked)
1. **<60-second guest-to-value onboarding** (§4.1.2) — the activation battle.
2. **Persian craft standard as P1 acceptance criteria** (§4.3.2) — the trust-through-craft win.
3. **Trust surfaces as a first-class category** (§4.7) — rendering the constitution.
4. **Mobile-first PWA + Telegram** (§4.6) — meeting the market where it is.
5. **Payment-failure grace + shutdown resilience** (§4.4) — winning in adverse conditions.

### Findings that update prior documents (per founder rule 7)
| Finding | Prior document | Update |
|---|---|---|
| Seven objective Persian-craft acceptance criteria (§4.3.2) | Product Blueprint #1 §P2.1 | Attach as testable P1 requirements so "Persian-first" can't be downgraded to "Persian-translated" |
| Guest-trial-before-signup as the activation lever (§4.1.2) | Product Blueprint #1 §P2 onboarding | Add guest trial (A-04) explicitly to the Phase-1 surface; A/B against signup-first |
| "Trust surfaces" as a distinct Product-Surface category (§4.7) | Product Blueprint #1 §P2 | Add the category; it's where 7.1/7.2/7.3 become visible |
| Honest-vs-dark conversion boundary is often *framing*, not mechanic (§4.5) | Growth Doctrine (Ch. 13) | Codify the 7.1 framing test into the Doctrine |
| IA must be a durable shell hosting evolving contents (§4.2.1) | Product Blueprint #1 §P2; FP-5 | Note the OS-shell IA requirement so Phase-2/3 modalities need no rebuild |

### FLAGGED FOLLOW-UP (discrete work item)
**A hands-on competitive UX teardown of the live Iranian interfaces (GapGPT, Hoosha, ChatQT, Roboo, Vira)** — signup flow, Persian craft quality, price-transparency UX, mobile behavior, payment flow — captured screen-by-screen. This phase established the *standard* and the *principles* from sourced material; a teardown would produce the *specific competitive gaps* to exploit. **Confidence on competitor-specific UX claims will remain Medium until this is done.** Recommend assigning it as AIFA's first hands-on research task (it also doubles as market immersion for the founding team).

---

**END OF PHASE 4.** Onboarding flow designed · IA model chosen · Persian craft standard set as acceptance criteria · friction mapped · honest-conversion toolkit defined · trust surfaces named · 5 prior-document updates flagged · 1 hands-on teardown flagged.

**Next (Phase 5): Pricing Intelligence** — pricing architectures, credit-system mechanics, margin math (Rial-in/USD-out), the unit economics of every model, price anchoring in the Persian market, and the pricing psychology that is honest versus the pricing psychology that is forbidden.

Send **CONTINUE**.
