# Budget scenarios

**Status:** Framework only. No user-volume assumptions are invented; every scenario below is a structure to fill in once real usage/cost data (Phase C) and business inputs (founder decisions) exist.

## What this framework must be able to calculate, per scenario

- Cost per standardized unit (using `../pricing/assumptions.yaml`'s scenario definitions)
- Cost per active user
- Cost per paying user
- Cost per plan (once `subscription-model-requirements.md` is priced)
- Expected gross margin (once `margin-policy.md` is set)
- Provider concentration (what share of total cost sits with a single provider — `google.md` and `elevenlabs.md` are flagged in `../providers/` as the current highest-concentration candidates)

## Required scenarios

| Scenario | What it stresses |
|---|---|
| Best-case | Favorable usage mix, low failure/retry rate, no adverse FX/price movement |
| Base-case | Expected usage mix and rates |
| Worst-case | Unfavorable usage mix, high failure/retry rate, adverse movement |
| High-video-usage | Video's per-second cost is the most expensive dimension in the portfolio (ADR-0020 Risks) — a usage mix skewed toward video stresses margin hardest |
| High-avatar-usage | Avatar's per-minute/replica-fee cost structure (ADR-0023) stressed |
| High-realtime-voice | Realtime voice's three-provider-call pipeline (ADR-0021) stressed for both cost and latency/failure compounding |
| Free-tier-abuse | Usage-limited free tier (ADR-0018) consumed adversarially (e.g. automated abuse) beyond intended limits |
| Provider-price-increase | A single provider raises its price (documented precedent: `AIFA_Brain/04_Research/Market_Intelligence/02_Competitors_Phase2.md` Finding A — inference-layer consolidation and repricing) |
| Failover-provider | A primary provider becomes unavailable and a named fallback (`../architecture/fallback-routing.md`) serves the request instead, at a possibly different cost |

## Explicit non-goal

**No user-volume, conversion-rate, or growth assumption is invented here.** Every scenario above needs a real business input (expected user count, usage mix) before it produces a number — those inputs are configurable, clearly labeled placeholders once this framework is implemented, not filled with guessed figures.

## Related documents

- `../pricing/assumptions.yaml`, `../pricing/scenario-costs.csv`
- `cost-model.md`, `margin-policy.md`, `subscription-model-requirements.md`
- `../adr/0020-video-portfolio.md`, `../adr/0023-avatar-category.md`, `../adr/0021-voice-portfolio.md`, `../adr/0018-chat-portfolio.md`
- `AIFA_Brain/04_Research/Market_Intelligence/02_Competitors_Phase2.md` (Finding A)
