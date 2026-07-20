# Moonshot AI (Kimi)

**Status:** Model-owner doc — created 2026-07-20 per [`P-002`](../../../AIFA_Brain/12_Decisions/PRODUCT_DECISION_LOG.md#p-002--launch-model-provider-and-activation-matrix). Moonshot AI is the **model owner** of Kimi K3; it is a separate concept from the **serving gateway** currently used to reach it (OpenRouter — see [`openrouter.md`](openrouter.md)).

## AIFA usage (locked portfolio decision)

- Chat/Coding/Agentic: Kimi K3, Locked Portfolio (public activation pending all P-002 activation gates) — [`../portfolio/chat.md`](../portfolio/chat.md), `P-002`.

## Identity — verified 2026-07-20

| Field | Value | Source |
|---|---|---|
| Official model name | Kimi K3 | [`platform.kimi.ai/docs/guide/kimi-k3-quickstart`](https://platform.kimi.ai/docs/guide/kimi-k3-quickstart) |
| Direct API model ID | `kimi-k3` | same, checked 2026-07-20 — **corrects** an earlier internal reference to `k3`; see `P-002`'s Verified correction |
| Direct API base URL | `https://api.moonshot.ai/v1` | same |
| Parameters | Context window 1,048,576 tokens (1M); `max_completion_tokens` defaults to 131,072, settable up to 1,048,576; reasoning always enabled, `reasoning_effort` accepts `low`/`high`/`max` (default `max`); `temperature`, `top_p`, `seed` are fixed and should be omitted | same |
| Modalities | Native visual (image) understanding; images sent as base64 or an `ms://` file reference — public image URLs are not supported | same |
| Architecture | 2.8T parameters, Kimi Delta Attention (KDA) hybrid linear attention + Attention Residuals | same |
| Availability | API live since 2026-07-16 | same |

**OpenRouter also lists this model** at `moonshotai/kimi-k3` (checked 2026-07-20) — OpenRouter's page proves OpenRouter offers this endpoint; it does **not** by itself prove Moonshot's own direct terms (per P-002's rule that "a gateway's documentation proves only that the gateway offers an endpoint").

## Initial serving route (per P-002)

**OpenRouter** (gateway; billing counterparty: OpenRouter) — pinned slug `moonshotai/kimi-k3`. See [`openrouter.md`](openrouter.md) for routing/fallback/data-control detail.

## Future direct route — not implemented

Moonshot AI's own direct API (`https://api.moonshot.ai/v1`, model ID `kimi-k3`) is tracked as a future option that may replace or complement OpenRouter if it offers better price, rate limits, privacy, latency, availability, contract terms, model controls, or support. No direct adapter is built in this documentation decision.

## Pricing — time-stamped observation only, not production pricing

Per OpenRouter's `moonshotai/kimi-k3` page (checked 2026-07-20): **$3 / 1M input tokens, $15 / 1M output tokens, $0.30 / 1M cached input tokens.** This is OpenRouter's charge to AIFA for this route, not independently confirmed as Moonshot's own direct-API price list (Moonshot's direct pricing was not separately located as of this check). **Do not write this to `provider-pricing.csv` without a fresh live-endpoint check** — see `P-002` and `ACTIVATION_BACKLOG.md`.

## Commercial & legal — PENDING

Commercial-use terms, generated-output ownership, data-retention/training-use default, DPA/regional-processing availability, geographic/export restrictions (Moonshot AI's jurisdiction carries the same category of question AIFA_Brain's Market Intelligence flags for other non-US/EU providers): **UNKNOWN, not yet checked against an official Moonshot AI commercial-terms page.**

## Related documents

- [`openrouter.md`](openrouter.md), [`../portfolio/chat.md`](../portfolio/chat.md)
- `AIFA_Brain/12_Decisions/PRODUCT_DECISION_LOG.md` (`P-002`)
- `../adr/0025-pricing-source-of-truth.md`
