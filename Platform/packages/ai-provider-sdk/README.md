# @aifa/ai-provider-sdk

The provider-agnostic AI abstraction layer. See `docs/adr/0005-ai-provider-abstraction.md` for the design decision and `docs/architecture/ai-provider-layer.md` for how `apps/api` consumes it.

## What's here

- `AiProvider` — the port every vendor adapter implements.
- `ProviderRegistry` — resolves the active provider(s) by id, config-driven (never a compile-time import of a vendor SDK by application code).
- `FallbackChain` — tries providers in priority order; only fails if all fail.
- `CircuitBreaker` — trips after N consecutive failures per provider, short-circuits calls to a known-bad provider during a cooldown window.
- `adapters/` — vendor adapter **stubs**. No real network calls, no API keys — see the "Scope" note below.

## Scope note (read before extending)

This package's registry, fallback chain, circuit breaker, and port interfaces are real, tested logic. `src/adapters/stub.adapter.ts` is a deterministic, no-network placeholder — still used for the bootstrap-default providers and any `AiProviderConfig` row missing full configuration. A real adapter now exists (Sprint 1) — `OpenAiCompatibleAdapter` — but it lives in `apps/api/src/infrastructure/providers/`, not in this package's `src/adapters/`, per the location convention `ai-provider-layer.md` documents: this package holds the provider-agnostic abstraction (registry/fallback/circuit-breaker/cost calc), `apps/api` holds the concrete vendor adapters that implement `AiProvider` against it. No real vendor API key has ever been used against the real adapter in this codebase's history — it's verified only via an injected-`fetch` unit test double.

## Adding a provider

1. Add `<vendor>.adapter.ts` implementing `AiProvider` under `apps/api/src/infrastructure/providers/` (not in this package — see the Scope note above).
2. Register an instance in wherever the registry is bootstrapped (`apps/api/src/infrastructure/providers/provider-registry.adapter.ts`) — this package has no opinion on which providers exist, only how to hold and call them.

## Dependencies

`@aifa/types` (shared DTOs) only.

## Public API

- `AiProvider` (interface), `ProviderRegistry`, `FallbackChain`, `CircuitBreaker` (+ `CircuitBreakerOptions`), `StubAdapter`.
- Errors: `ProviderUnavailableError`, `AllProvidersUnavailableError`, `CircuitOpenError`.

## Example

```ts
import { ProviderRegistry, FallbackChain, CircuitBreaker, StubAdapter } from '@aifa/ai-provider-sdk';

const registry = new ProviderRegistry();
registry.register(new CircuitBreaker(new StubAdapter('primary')));
registry.register(new CircuitBreaker(new StubAdapter('secondary')));

const chain = new FallbackChain(registry.list());
const result = await chain.chat({ messages: [{ role: 'user', content: 'hello' }] });
```
