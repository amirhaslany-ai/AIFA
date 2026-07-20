# Product Decision Log

| Field | Value |
|---|---|
| **Title** | Product Decision Log |
| **Created** | 2026-07-13 |
| **Updated** | 2026-07-20 |
| **Owner** | AIFA_Brain maintainers |
| **Status** | Active |
| **Version** | 1.2 |
| **Dependencies** | `README.md` |
| **Related Docs** | `DECISION_LOG.md`, `../01_Product/README.md`, `../15_Roadmap/README.md` |
| **Tags** | `decisions, product` |

Product decisions: what gets built, for whom, in what order, and why — including decisions that resolve `Platform/HANDOVER/12_OPEN_DECISIONS.md`'s product-shaped open questions (first target user, whether Next.js is still the right frontend choice, whether a client can select a specific provider/model, etc.).

Status legend: **Locked** / **Provisional** / **Superseded** (see `DECISION_LOG.md` for definitions).

---

### P-001 — Launch with a broad, value-dense product foundation
**Status:** Locked
**Date:** 2026-07-19
**Decision:** AIFA will launch as a broad multi-capability AI platform rather than as a minimal chat-only product. The initial launch target includes: Chat; Image generation; Video generation; Voice capabilities; Music generation; Avatar generation; Smart Router; Toman wallet and quote-before-commit pricing; user history and generated-asset library; opt-in basic Memory; curated workflow templates; controlled task-focused Agents. Each launch capability must provide at least one complete, reliable, production-ready user journey. AIFA will not wait for every planned subfeature to reach maximum depth before entering testing — once the shared infrastructure and initial user journeys are operational, the Founder will place the product under real usage, testing, debugging, and iterative improvement. Development, testing, bug fixing, and feature expansion continue concurrently after the initial usable product is available. Advanced capability depth may be added continuously without changing the committed product direction, including: unrestricted Agent Builder; unrestricted Workflow Builder; real-time voice; advanced voice cloning with consent and verification; digital twins; professional media editors; enterprise collaboration; public developer APIs; advanced semantic Memory; additional models and providers. Every confirmed product decision, operational rule, verified provider fact, pricing input, and implementation constraint must remain preserved in GitHub as the source of truth for future engineers and autonomous agents.

**Product principle:** Launch with meaningful breadth, then continuously deepen each capability using real operational and customer evidence.

**Rationale (commercial):** AIFA must create greater practical and perceived value than access-focused competitors such as Hoosha and GapGPT. AIFA's differentiation is the combined value of: multiple AI capabilities in one platform; transparent pricing before execution; intelligent model selection; a Persian-first experience; reliable wallet, settlement, and refund behavior; useful Memory, Workflows, and Agents; higher trust; clearer user control; continuous improvement after launch. The objective is to make migration to AIFA feel safer, easier, more useful, and more valuable than remaining on narrower or less-transparent alternatives.

**Constraints:**
- No capability may be presented as production-ready before its complete user journey, pricing, failure handling, and usage settlement work correctly.
- No silent model substitution.
- No opaque credit behavior.
- No hidden charges.
- No sensitive autonomous action without explicit user approval.
- Memory must be optional, visible, editable, and deletable.
- Testing must not expose uncontrolled financial, security, privacy, legal, or abuse risks.
- Advanced depth must not block delivery of the first reliable user journey for each launch capability.

**Owner:** Founder

**Supersedes:** Any earlier recommendation that AIFA should launch only with Chat and Image.

**Related:** [`../01_Product/README.md`](../01_Product/README.md), [`../04_Research/Market_Intelligence/01_Executive_Intelligence_Report.md`](../04_Research/Market_Intelligence/01_Executive_Intelligence_Report.md), [`../../Platform/docs/adr/0016-capability-model-provider-architecture.md`](../../Platform/docs/adr/0016-capability-model-provider-architecture.md), [`../../Platform/docs/adr/0017-multimodal-provider-abstraction.md`](../../Platform/docs/adr/0017-multimodal-provider-abstraction.md), [`../../Platform/docs/adr/0018-chat-portfolio.md`](../../Platform/docs/adr/0018-chat-portfolio.md), [`../../Platform/docs/adr/0019-image-portfolio.md`](../../Platform/docs/adr/0019-image-portfolio.md), [`../../Platform/docs/adr/0020-video-portfolio.md`](../../Platform/docs/adr/0020-video-portfolio.md), [`../../Platform/docs/adr/0021-voice-portfolio.md`](../../Platform/docs/adr/0021-voice-portfolio.md), [`../../Platform/docs/adr/0022-music-portfolio.md`](../../Platform/docs/adr/0022-music-portfolio.md), [`../../Platform/docs/adr/0023-avatar-category.md`](../../Platform/docs/adr/0023-avatar-category.md), [`../../Platform/docs/adr/0024-smart-routing-principles.md`](../../Platform/docs/adr/0024-smart-routing-principles.md). **See also:** [`P-002`](#p-002--launch-model-provider-and-activation-matrix) — the launch model/provider/activation matrix that implements this scope's capability breadth.

---

### P-002 — Launch model, provider, and activation matrix
**Status:** Locked
**Date:** 2026-07-20
**Owner:** Founder

**Decision principle:** AIFA maintains a broad, competitive model Portfolio across Chat, Coding, Image, Video, Voice, Music, and Avatar. Models are selected for quality, pricing range, market relevance, specialized capability, Persian usefulness, Coding/Agentic value, and competitive importance. **Inclusion in the Locked Portfolio does not automatically mean public activation.** A model enters the public Active Catalog only after all applicable [Universal activation gates](#universal-activation-gates) pass. Integration effort alone is never a valid reason to remove an important selected model family.

#### Required terminology

| Term | Meaning |
|---|---|
| **Model owner** | Organization that owns/publishes the model. |
| **Serving provider** | API AIFA actually invokes to run the model. |
| **Gateway** | A third-party service exposing another company's model (a kind of serving provider that is not the model owner). |
| **Billing counterparty** | Organization that charges AIFA for usage. |
| **Locked Portfolio** | Models AIFA has intentionally selected for eventual support. |
| **Active Catalog** | Models that have passed every applicable activation gate and are customer-facing. |
| **Integration-gated** | A selected model blocked by access, identity, pricing, contract, legal, or technical requirements. |
| **Watchlist** | Monitored, no activation commitment. |
| **Reserve** | Lower-priority future option. |
| **AIFA alias** | A customer-facing name that is not an official provider model ID. |

Model owner, serving provider, gateway, and billing counterparty are never collapsed into one field. An AIFA alias is never presented as an official API identifier.

#### Kimi K3 — correction and launch decision

**Kimi K3 is a Locked member of the Chat, Coding, Reasoning, and Agentic launch Portfolio — it is not a Video model and must never be confused with Kling Video 3.0** (a separate, unrelated Video family below). An earlier internal draft misread the informal shorthand "K3" as referring to Kling Video 3; this entry is the corrected record.

| Field | Value |
|---|---|
| Model | Kimi K3 |
| Model owner | Moonshot AI |
| Initial serving gateway | OpenRouter |
| Initial billing counterparty | OpenRouter |
| Pinned OpenRouter model slug | `moonshotai/kimi-k3` |
| Direct Kimi API model ID | `kimi-k3` — see **Verified correction** below |
| Future direct-serving option | Kimi API / Moonshot AI (`https://api.moonshot.ai/v1`) |
| Capabilities | Chat, Coding, vision input, reasoning, tool use, long-context knowledge work, Agentic workflows |
| Status | Locked Portfolio; public activation pending all activation gates |

**Verified correction (2026-07-20):** the founder brief for this decision referred to the direct Kimi API model ID as `k3`. Freshly checked against Moonshot's own API documentation ([`platform.kimi.ai/docs/guide/kimi-k3-quickstart`](https://platform.kimi.ai/docs/guide/kimi-k3-quickstart), checked 2026-07-20), the exact literal model-ID string the direct API expects is **`kimi-k3`** (served at `https://api.moonshot.ai/v1`), not the bare string `k3` — this matches the model component of the OpenRouter slug `moonshotai/kimi-k3`. Recorded here per this repository's verified-source discipline (ADR-0025): the founder's intent (track a future direct Moonshot route as a second serving option) is fully preserved; only the literal ID string is corrected, and it is corrected in this same Locked entry rather than silently — a future engineer must not use `k3` as a literal API parameter.

**OpenRouter routing requirements for Kimi K3:**
1. Use the exact pinned slug `moonshotai/kimi-k3`. Never use `~moonshotai/kimi-latest` (a moving alias — confirmed to exist as a separate OpenRouter model page, `openrouter.ai/~moonshotai/kimi-latest` — that may resolve to a different underlying model over time) for this named product route.
2. Never use `openrouter/auto` for the explicit Kimi K3 route.
3. No fallback-model array is configured for initial launch (see [Initial fallback policy](#p-002-initial-fallback-policy)).
4. Kimi K3 must never be silently substituted with Kimi K2.x, another Moonshot model, or another vendor's model.
5. The actual model and upstream provider returned in every response must be recorded in the usage record.
6. Where OpenRouter exposes multiple upstream endpoints for this model: inspect the endpoint/provider list, record the actual upstream provider, disable automatic provider-level fallback initially, use explicit provider routing if a verified provider slug is available, and never claim Moonshot-direct inference unless the actual endpoint is Moonshot AI.
7. Evaluate OpenRouter's `data_collection: "deny"` routing parameter and Zero Data Retention (ZDR) availability (`openrouter.ai/docs/guides/features/zdr`, checked 2026-07-20) before activation; if the needed privacy or provider-pinning controls are unavailable for this model, keep the route `INTEGRATION_GATED` and document the exact blocker rather than activating without them.

**Kimi pricing (time-stamped observation, not production pricing):** OpenRouter's `moonshotai/kimi-k3` page (`https://openrouter.ai/moonshotai/kimi-k3`, checked 2026-07-20) lists **$3 / 1M input tokens, $15 / 1M output tokens, $0.30 / 1M cached input tokens**, flat across a 1,048,576-token (1M) context window; Moonshot's own direct-API docs state a default `max_completion_tokens` of 131,072, settable up to 1,048,576, fixed sampling parameters (`temperature=1.0`, `top_p=0.95` — do not send these), and `reasoning_effort` accepting only `low`/`high`/`max` (default `max`, always enabled). This is an observation for planning purposes only — it is **not** converted into AIFA customer pricing or a `provider-pricing.csv` row by this decision; a fresh live-endpoint check is required before any production pricing write (see the [Activation backlog](../../Platform/docs/portfolio/ACTIVATION_BACKLOG.md)).

**Kimi direct route:** Moonshot AI's direct Kimi API (`kimi-k3` at `https://api.moonshot.ai/v1`) is tracked as a future direct-provider option that may later replace or complement OpenRouter if it offers better price, rate limits, privacy, latency, availability, contract terms, model controls, or support. **Not implemented in this documentation decision.**

#### Chat and Coding Portfolio

The existing selected Chat families are preserved, each still subject to exact official verification per ADR-0018: OpenAI, Anthropic, Google, xAI, DeepSeek, Qwen (Alibaba), GLM (Zhipu). **Kimi K3 (Moonshot AI) is added** to this Portfolio and to `Platform/docs/pricing/model-pricing.csv`, tagged for general Chat, advanced Coding, large-repository analysis, long-context work, tool use, Agentic execution, and complex knowledge work — strategically important for its newness, 1M-token context, coding/agentic focus, and market relevance, without claiming universal benchmark leadership.

**OpenRouter** is approved as an initial serving gateway for selected Chat models where explicitly decided (currently: Kimi K3 only) — it is **not** a model owner. `Platform/docs/providers/openrouter.md` (new) and `Platform/docs/providers/moonshot.md` (new) are the model-owner/gateway docs for this route; `Platform/docs/providers/README.md`'s prior blanket exclusion of OpenRouter ("AIFA's locked portfolio decisions do not use it as a supplier") is corrected — it is now a supplier for this one specific, explicitly-decided route, not a general-purpose one.

#### Image, Video, Voice, Music, and Avatar Portfolios

The Founder-selected direction in each of these capabilities is preserved and reconciled against fresh official-source checks (`Platform/docs/portfolio/*.md`, `Platform/docs/providers/*.md`); summary:

- **Image:** OpenAI image generation, Google image models and Nano Banana aliases, Black Forest Labs FLUX families, and the existing selected professional/economy candidates are unchanged. Black Forest Labs direct API and `fal` remain eligible routes.
- **Video:** Google **Veo 3.1 Standard/Fast** (direct Google/Vertex API); **Kling Video 3.0 Standard/Pro/Turbo** (Text-to-Video, Image-to-Video, Motion Control, Native Audio, Multi-shot where supported; model owner **KlingAI/Kuaishou**) — **Kling Video 3.0 is a distinct family from Kling Video 3.0 Omni and from Kimi K3; never conflate them**; **Seedance 2.0 Standard/Fast** (model owner **ByteDance**); **Wan 2.7** (model owner **Alibaba**, resolving the prior Wan 2.6-vs-2.7 ambiguity in ADR-0020 in favor of 2.7, pending exact endpoint verification); **Hailuo 2.3 Standard/Fast** (model owner **MiniMax**); **Runway** (current verified flagship, faster/economy, and editing models via Runway's own direct API — do not preserve a deprecated Runway name merely because an older document names it). **Initial serving-gateway strategy:** Google direct for Veo; **`fal`** for Kling, Seedance, Wan, and Hailuo (an initial-gateway decision, not merely a fallback — corrects `video.md`/ADR-0020's prior "optional fallback" framing for Kling, and moves Seedance off a Volcano-Engine-first framing); Runway direct for Runway models. Direct-provider adapters for Kling/Seedance/Wan/Hailuo remain a future optimization, justified by cost, limits, capability access, reliability, or contract terms.
- **Voice:** Persian TTS primary = **ElevenLabs Eleven v3** (Persian/`fas` support confirmed in ElevenLabs' own language documentation, checked 2026-07-20); Persian STT primary = **Deepgram Nova-3** (Persian support confirmed in Deepgram's own documentation, checked 2026-07-20 — Nova-3 added Hebrew/Persian/Urdu). Realtime architecture: `Audio → STT (Deepgram) → selected Chat model → TTS (ElevenLabs) → Audio`. Do not route Persian to Deepgram Flux or any model whose official documentation does not explicitly include Persian. Voice cloning stays `INTEGRATION_GATED` on consent, ownership verification, revocation, deletion, audit logging, abuse controls, and legal review.
- **Music:** **Suno remains Locked and strategically important — corrected 2026-07-20 on first-party evidence from Suno Support** (`AIFA_Brain/04_Research/API_Research/Suno/2026-07-20-suno-support-api-response.md`), which supersedes this section's original third-party-sourced framing. The earlier statement in this section that Suno "opened a curated API partner-program intake... which the Founder is pursuing" is **corrected**: Suno Support's direct response states plainly that **no authorized public API exists at all** — no developer signup, no documented endpoints, no API keys, no API-tier subscription, on any plan, and no enterprise/team/business plan. The canonical current relationship is:

  - Model owner: **Suno**
  - Authorized serving provider: **None currently available**
  - Authorized gateway: **None currently available**
  - Billing counterparty for API use: **None**
  - Portfolio status: **Locked**
  - Active Catalog status: **Not available**
  - Activation status: `INTEGRATION_GATED — NO AUTHORIZED PUBLIC API OR PASS-THROUGH LICENSING FRAMEWORK`
  - Current legitimate path: **direct commercial-partnership discussion with Suno** (`support@suno.com`; no separate BD inbox or partnerships form exists; no timeline or outcome is promised)
  - External dependency: Suno must grant AIFA explicit authorized integration and commercial (pass-through) rights before this entry can move toward the Active Catalog

  **Suno may enter the Active Catalog only after Suno directly provides, in writing:** (1) authorized integration/API access, (2) technical endpoints and authentication, (3) API model/capability documentation, (4) pricing and billing terms, (5) rate limits and capacity terms, (6) explicit permission to embed Suno in AIFA, (7) permission for AIFA to charge end users, (8) pass-through commercial-use rights for AIFA's users, (9) output-ownership terms, (10) API-specific data/retention terms, (11) a DPA or equivalent where required, (12) geographic/sanctions/account-eligibility terms, (13) support/suspension/termination/continuity terms, and (14) an executed partnership or commercial agreement where required. **Until then, Suno must not be publicly exposed as an available generation engine.**

  **SunoAPI.org (`docs.sunoapi.org`) is `REJECTED FOR PRODUCTION USE`** — Suno's own response confirms such wrappers are "entirely unaffiliated," work by automating the web app (real ToS risk), and are not sanctioned, endorsed, or supported by Suno. No third-party Suno wrapper, browser automation, consumer-account automation, shared account, session cookie, reverse-engineered endpoint, or unofficial reseller may be used, with or without a wrapper's own claims of authorization. Historical research describing such wrappers may remain preserved, clearly marked rejected, not deleted.

  Music launch continuity is unaffected: ElevenLabs Music/Sound Effects, MiniMax's music route, and the existing reserve candidates (Lyria, Mureka, Stable Audio, Udio) carry the Music capability's launch; each still passes the Universal activation gates independently of Suno's status.
- **Avatar:** **HeyGen direct API** remains the primary initial provider (stock-avatar presenter video, text-to-avatar, audio-to-avatar, approved translation/lip sync, stock voices). Custom Digital Twins, face cloning, and voice cloning stay `INTEGRATION_GATED` pending consent/identity controls. Tavus remains a future option.

#### Initial fallback policy

Automatic cross-model/cross-provider fallback is **not** enabled for initial launch, for OpenRouter-routed models as well as direct providers. Per request: (1) one model and one serving route is selected before execution; (2) the estimated charge is shown before commitment; (3) a safe idempotent retry against the *same* model/route may occur; (4) a different model/provider, or a moving alias, is never silently substituted for a purchased named-model request; (5) failed requests release the wallet reservation or trigger the correct refund; (6) the actual model, provider, and usage are stored; (7) the user may explicitly retry with another active model. The architecture remains capable of adding real automatic fallback later, based on measured uptime, latency, error rate, output quality, cost, capacity, and regional availability — not before.

#### Universal activation gates

A Locked model enters the public Active Catalog only after all applicable gates pass: (1) exact official model identity, (2) exact official API identifier, (3) model owner confirmed, (4) serving provider confirmed, (5) gateway confirmed where applicable, (6) billing counterparty confirmed, (7) commercial access authorized, (8) exact source URLs recorded, (9) pricing/billing dimensions recorded, (10) account eligibility confirmed, (11) credentials configured, (12) live smoke test passed, (13) streaming behavior tested, (14) tool-calling behavior tested, (15) multimodal behavior tested, (16) input schema mapped, (17) output schema mapped, (18) async job behavior tested, (19) usage reporting tested, (20) quote-before-commit tested, (21) wallet reservation tested, (22) settlement tested, (23) failure/refund tested, (24) rate limits recorded, (25) moderation requirements recorded, (26) retention behavior recorded, (27) geographic restrictions recorded, (28) customer-facing paid use permitted, (29) Beta/Preview/gated/unavailable status accurately shown, (30) monitoring and operational ownership established. **Failure of one model must never block other models in the same capability.**

#### Schema note (not implemented in this decision)

`Platform/docs/pricing/model-pricing.csv` and `provider-pricing.csv` have no columns separately representing model owner, serving provider, gateway, and billing counterparty as distinct concepts — only `primary_provider`/`backup_provider`, which this decision's own terminology explicitly forbids collapsing these roles into. Until a founder/architecture decision adds explicit columns, the Kimi K3 row uses `primary_provider` for the current serving path and carries the full owner/gateway/billing-counterparty/pinned-slug/direct-ID relationship in `notes` (the same escape-hatch convention already used elsewhere in these datasets) — see `Platform/docs/pricing/pricing-audit-gaps.csv`.

**Supersedes:** Any earlier draft of P-002, any instruction interpreting "K3" as Kling Video 3, and any instruction to use SunoAPI.org as a selected implementation route.

**Related:** [`01_Product/README.md`](../01_Product/README.md), [`15_Roadmap/README.md`](../15_Roadmap/README.md), [`../../Platform/docs/portfolio/chat.md`](../../Platform/docs/portfolio/chat.md), [`../../Platform/docs/portfolio/video.md`](../../Platform/docs/portfolio/video.md), [`../../Platform/docs/portfolio/voice.md`](../../Platform/docs/portfolio/voice.md), [`../../Platform/docs/portfolio/music.md`](../../Platform/docs/portfolio/music.md), [`../../Platform/docs/portfolio/avatar.md`](../../Platform/docs/portfolio/avatar.md), [`../../Platform/docs/providers/openrouter.md`](../../Platform/docs/providers/openrouter.md), [`../../Platform/docs/providers/moonshot.md`](../../Platform/docs/providers/moonshot.md), [`../../Platform/docs/providers/kling.md`](../../Platform/docs/providers/kling.md), [`../../Platform/docs/providers/fal.md`](../../Platform/docs/providers/fal.md), [`../../Platform/docs/adr/0016-capability-model-provider-architecture.md`](../../Platform/docs/adr/0016-capability-model-provider-architecture.md) through [`0025`](../../Platform/docs/adr/0025-pricing-source-of-truth.md), [`../../Platform/docs/portfolio/ACTIVATION_BACKLOG.md`](../../Platform/docs/portfolio/ACTIVATION_BACKLOG.md), [`../04_Research/API_Research/Suno/2026-07-20-suno-support-api-response.md`](../04_Research/API_Research/Suno/2026-07-20-suno-support-api-response.md) (first-party evidence for the Suno correction)

---

## Entry format

```
### P-001 — {short decision title}
**Status:** {Locked / Provisional / Superseded}
**Date:** {YYYY-MM-DD}
**Decision:** {what was decided}
**Rationale:** {why, grounded in research where possible — link ../04_Research/User_Research/ or ../05_Competitors/ entries}
**Owner:** {who}
**Related:** {links}
```

## Change History

- **2026-07-20:** P-002's Music/Suno section corrected on first-party evidence from Suno Support: no authorized public API exists (was: an API partner-program intake the Founder was "pursuing"). Suno stays Locked, now explicitly `INTEGRATION_GATED — NO AUTHORIZED PUBLIC API OR PASS-THROUGH LICENSING FRAMEWORK`; SunoAPI.org reclassified `REJECTED FOR PRODUCTION USE`. All other P-002 decisions (Kimi K3, OpenRouter, Video, Voice, Image, Avatar, fallback policy, activation gates) unchanged. See `AIFA_Brain/04_Research/API_Research/Suno/2026-07-20-suno-support-api-response.md`.
- **2026-07-20:** P-002 added — launch model/provider/activation matrix locked, including the Kimi K3 (Moonshot AI, via OpenRouter) correction and Video/Voice/Music/Avatar reconciliation.
- **2026-07-19:** P-001 added — broad multi-capability launch scope locked, superseding any earlier chat+image-only recommendation.
- **2026-07-13:** Log created (D-021).
