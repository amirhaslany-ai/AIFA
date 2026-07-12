# ADR-0007: AI provider layer extensions — capability matrix, streaming, retry, cost

**Status:** Accepted, partially implemented (Sprint 1) — cost layer and a real HTTP adapter now exist (see Consequences); capability matrix, streaming, retry policy, and response caching remain design-only
**Date:** 2026-07-12
**Related:** ADR-0005 (original provider abstraction)

## Context

ADR-0005 shipped a real, tested `ProviderRegistry`/`FallbackChain`/`CircuitBreaker` with stub adapters. Phase 2 of the foundation mission requires completing the *design* (not implementation) of everything a real adapter will eventually need: capability-aware routing, streaming, retry semantics distinct from circuit-breaking, timeouts, caching, and a cost-reporting contract feeding the (also design-only) Pricing/Wallet layers.

## Decision

Extend the `AiProvider` interface and its decorator chain per `docs/architecture/ai-provider-layer.md`'s "Design-only extensions" section:

- `capabilities: ProviderCapabilities` added to the interface (routing input).
- `chatStream()` added alongside `chat()`, with an explicit constraint: fallback only occurs before the first streamed chunk, never mid-stream.
- A new `RetryPolicy` decorator, composed *inside* `CircuitBreaker` (`CircuitBreaker(RetryPolicy(adapter))`), handling transient single-call failures distinctly from the circuit breaker's repeated-failure threshold.
- Per-call timeouts enforced inside each adapter, not left to transport defaults.
- An opt-in response cache (Redis-backed) for identical, explicitly-marked-cacheable requests.
- `ChatResult.usage` (already present) becomes the input to a per-provider cost calculation, which is Provider Access's entire cost-layer responsibility — it stops at "what this cost us," never computing customer-facing price (that's Pricing's job, ADR-0009).

## Rationale

- Keeping retry and circuit-breaking as separate decorators (rather than one merged mechanism) follows single-responsibility: retry answers "was this one call a transient blip," circuit-breaking answers "should we stop trying this provider at all for a while." Merging them makes both harder to tune independently (e.g., you may want more retries but a stricter circuit threshold, or vice versa).
- The "no mid-stream fallback" constraint is called out explicitly because it's a real, non-obvious limitation of combining streaming with failover — silently allowing it would let a client receive a response that discontinuously jumps between two providers' outputs.
- Separating "cost to us" (Provider Access) from "price to customer" (Pricing) mirrors how the wallet/billing domain models it in `wallet-architecture.md`/`pricing-architecture.md` — a single AI call can have its raw cost known immediately but its customer price depend on a markup rule that changes independently (e.g. a promotional campaign), so conflating them in one layer would create a coupling neither side needs.

## Alternatives considered

- **Merge retry into the circuit breaker** (single decorator with both concerns): simpler to add, harder to tune independently later. Rejected — the two failure modes (transient vs. sustained) have different appropriate responses and the mission principle "optimize for long-term maintainability" favors the extra decorator over a harder-to-tune merged one.
- **Allow mid-stream provider fallback** (silently retry on a different provider if the stream errors after starting): rejected as a correctness risk (discontinuous output) for a marginal reliability gain; a stream error after the first chunk should surface to the caller, which can choose to retry the whole request if desired.

## Consequences

- **Implemented (Sprint 1):** `AiProviderConfig` gained `costPerInputTokenMicros`/`costPerOutputTokenMicros` columns (migration `20260712180000_add_provider_config_fields`), added now that a real adapter exists to read them — the "not added yet" deferral below is resolved. `packages/ai-provider-sdk/src/cost.ts` exports `calculateCostMinorUnits(usage, rates)`, the pure "what this cost us" computation this ADR specifies — integer micros-per-token math with ceiling division, never floats, mirroring the ledger/pricing precision principle. `ProviderCostSourcePort` (`apps/api/src/application/ports/provider-cost-source.port.ts`), implemented by `ProviderRegistryAdapter`, is how a future use case (Chat, Sprint 1 Feature 5) will read a provider's configured rates without depending on `@aifa/database` directly.
- **Not implemented:** `AiProvider`'s actual TypeScript interface in `packages/ai-provider-sdk/src/ai-provider.ts` still does **not** have `capabilities` or `chatStream` — no real streaming or capability-aware routing exists yet. `RetryPolicy`, per-provider response caching, and the "no mid-stream fallback" constraint remain design-only, since `OpenAiCompatibleAdapter` (the first real adapter) only needed non-streaming `chat()` and a hard per-call timeout to satisfy Sprint 1's scope — implementing the rest speculatively ahead of a caller that needs them was avoided.
