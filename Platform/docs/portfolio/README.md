# Portfolio

The locked AIFA product portfolio across six capabilities: [Chat](chat.md), [Image](image.md), [Video](video.md), [Avatar](avatar.md), [Voice](voice.md), [Music](music.md). Each capability's decision record is its ADR (`../adr/0018`–`0023`); each doc here restates that ADR's table for day-to-day navigation and cross-linking into `../providers/`. **The ADR is authoritative; if this doc and its ADR ever disagree, the ADR wins** (update this doc, don't silently let it drift).

## Classification taxonomy

Every portfolio entry carries exactly one of these classifications. This taxonomy is shared across all six capability docs and `../pricing/model-pricing.csv`'s `portfolio_status` column.

| Classification | Meaning |
|---|---|
| `VERIFIED_ACTIVE` | Confirmed against an official provider source: the model is real, named as given (or the AIFA-facing name's mapping to the official ID is confirmed), and currently generally available. |
| `VERIFIED_PREVIEW` | Confirmed against an official source, but the provider itself designates it preview/beta, not GA. |
| `AIFA_ALIAS` | An AIFA-facing product/commercial name (e.g. a package or bundle), not a claim about a specific provider model at all. |
| `PLANNED` | A locked product decision for a future launch phase; not yet available or not yet integrated. |
| `RESERVE` | Considered and deliberately not committed to the current launch scope; kept as a named fallback/future option. |
| `WATCHLIST` | Explicitly optional/under consideration in the product decision itself — not committed either way. |
| `INTEGRATION_GATED` | The product decision itself is conditional on something not yet confirmed (e.g. "only if an official API exists") — the condition, not the model, is what's unresolved. |
| `UNVERIFIED` | The product/portfolio decision is locked, but the provider mapping, exact official model ID, availability, or pricing has not yet been checked against an official source. **This is the default for every entry as of this document's creation (2026-07-17)** — Phase C of the provider pricing audit resolves these. |

## AIFA alias vs. real provider model ID

Per the audit mission's explicit rule, this repository never silently treats an AIFA-facing name as if it were confirmed to be a provider's literal official model ID. Every portfolio table below carries both:
- the **AIFA-facing name** (what the product/ADR calls it), and
- an **Expected provider** column (who is expected to serve it) —

but not yet a confirmed **official model ID** column — that column is added to `../pricing/model-pricing.csv` once Phase C verifies it. Until then, `UNVERIFIED` is the honest status, not `VERIFIED_ACTIVE`.

## Contents

| Capability | ADR | Doc |
|---|---|---|
| Chat | [`0018`](../adr/0018-chat-portfolio.md) | [`chat.md`](chat.md) |
| Image | [`0019`](../adr/0019-image-portfolio.md) | [`image.md`](image.md) |
| Video | [`0020`](../adr/0020-video-portfolio.md) | [`video.md`](video.md) |
| Voice | [`0021`](../adr/0021-voice-portfolio.md) | [`voice.md`](voice.md) |
| Music | [`0022`](../adr/0022-music-portfolio.md) | [`music.md`](music.md) |
| Avatar | [`0023`](../adr/0023-avatar-category.md) | [`avatar.md`](avatar.md) |

## Related documents

- `../architecture/capability-model-provider.md` (the routing chain every entry here is expressed in terms of)
- `../providers/README.md` (per-provider detail)
- `../pricing/model-pricing.csv` (machine-readable form of these tables, populated in Phase C)
- `../../../AIFA_Brain/12_Decisions/PRODUCT_DECISION_LOG.md` (`P-002`, Locked 2026-07-20 — launch model/provider/activation matrix; adds Kimi K3 to Chat, distinguishes model owner from serving provider/gateway)
- [`ACTIVATION_BACKLOG.md`](ACTIVATION_BACKLOG.md) (the concise implementation backlog P-002 implies — not implemented by P-002 itself)
