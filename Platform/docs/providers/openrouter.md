# OpenRouter

**Status:** Gateway doc — created 2026-07-20 per [`P-002`](../../../AIFA_Brain/12_Decisions/PRODUCT_DECISION_LOG.md#p-002--launch-model-provider-and-activation-matrix). OpenRouter is a **gateway**, not a model owner: it is the initial serving route for one specific, explicitly-decided model (Kimi K3 / Moonshot AI), not a general-purpose supplier. It remains additionally documented as a **competitive reference** in `AIFA_Brain/04_Research/Market_Intelligence/02_Competitors_Phase2.md` and `01_Executive_Intelligence_Report.md` (routing-arbitrage evidence) — that research is separate and is not restated here.

## AIFA usage (locked portfolio decision)

- Chat/Coding: Kimi K3 (Moonshot AI), initial serving gateway only — [`../portfolio/chat.md`](../portfolio/chat.md), `P-002`.

## Gateway role

OpenRouter exposes an OpenAI-compatible API (`https://openrouter.ai/api/v1`) that forwards requests to upstream model providers. It is a **serving provider/gateway** and, for this route, also the **initial billing counterparty** — it is never the **model owner** (Moonshot AI is, for Kimi K3). These roles must not be collapsed into one field (per P-002's terminology).

## Model slug registry (AIFA-selected models only)

| AIFA model | Pinned OpenRouter slug | Do not use | Source |
|---|---|---|---|
| Kimi K3 | `moonshotai/kimi-k3` | `~moonshotai/kimi-latest` (moving alias — a separate model page exists at `openrouter.ai/~moonshotai/kimi-latest` and may resolve to a different model over time); `openrouter/auto` (not for this named route) | [`openrouter.ai/moonshotai/kimi-k3`](https://openrouter.ai/moonshotai/kimi-k3), checked 2026-07-20 |

A pinned slug is used for every AIFA-selected model on this gateway — never a moving/"latest" alias, per P-002's routing requirements.

## Provider routing and fallback behavior

Where OpenRouter exposes multiple upstream endpoints for one model, AIFA must: inspect the endpoint/provider list, record the actual upstream provider actually used, disable automatic provider-level fallback initially, and use explicit provider routing when a verified provider slug is available. Automatic **model** fallback (substituting a different model) is never enabled for an AIFA product route — see [`P-002`](../../../AIFA_Brain/12_Decisions/PRODUCT_DECISION_LOG.md#p-002--launch-model-provider-and-activation-matrix)'s Initial fallback policy, which applies to OpenRouter-routed models the same as direct providers.

## Usage reporting

The actual model and actual upstream provider returned in every response must be recorded in AIFA's own usage record — never assume the requested slug is what actually served the request without checking the response metadata.

## Data controls / ZDR — PENDING full verification

OpenRouter documents (`https://openrouter.ai/docs/guides/features/zdr`, checked 2026-07-20) a `data_collection: "deny"` provider-routing parameter (route only to providers that don't collect data) and a `zdr` request/account parameter (Zero Data Retention enforcement — globally, per model group, or per request). OpenRouter's own stated default is that it does not store prompts/responses unless prompt logging is opted in (off by default), retaining only request metadata (token counts, latency, model used, timestamps) by default. **Whether these controls are sufficient for AIFA's Kimi K3 route, and whether Moonshot AI's specific upstream endpoint supports ZDR, has not been confirmed as of 2026-07-20** — this requires account-level testing, not just documentation reading. If the needed controls prove unavailable for this route, it stays `INTEGRATION_GATED` per P-002 rather than activating without them.

## Pricing-source handling

OpenRouter's own model page is the pricing source for **routing cost through this gateway** only — it does not establish Moonshot AI's own direct-API pricing (a separate, not-yet-compared figure; see `moonshot.md`) and is not itself converted into a `provider-pricing.csv` row by this decision (see `P-002`'s Kimi pricing note). Confidence label per ADR-0025: gateway-sourced pricing is treated as `OFFICIAL_EXPLICIT` for OpenRouter's own charge to AIFA, not as evidence of Moonshot's direct pricing.

## Billing counterparty

OpenRouter is the initial billing counterparty for the Kimi K3 route (AIFA is charged by OpenRouter, not directly by Moonshot AI, until/unless a direct Moonshot route is activated).

## Failure and refund implications

Per P-002's Initial fallback policy: a failed OpenRouter request may receive a safe idempotent retry against the same model/route; it must never be silently retried against a different model or a moving alias. A failed request releases the wallet reservation or triggers the correct refund — no special-case OpenRouter behavior is introduced.

## Commercial & legal — PENDING

Account-level terms (rate limits actually granted to AIFA's account, credit-purchase fees, platform fees beyond the per-token price, support/SLA): **UNKNOWN, requires account verification** (login-gated).

## Related documents

- [`../portfolio/chat.md`](../portfolio/chat.md), [`moonshot.md`](moonshot.md)
- `AIFA_Brain/12_Decisions/PRODUCT_DECISION_LOG.md` (`P-002`)
- `AIFA_Brain/04_Research/Market_Intelligence/02_Competitors_Phase2.md`, `01_Executive_Intelligence_Report.md` (prior competitive-reference research on OpenRouter, unchanged)
- `../adr/0025-pricing-source-of-truth.md`
