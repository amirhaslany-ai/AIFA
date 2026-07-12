# AI Provider Layer — Usage Detail

See ADR-0005 for the design decision and rationale. This document covers how `apps/api` actually consumes `@aifa/ai-provider-sdk` day to day.

## Call flow

```
Controller → Use Case → AiProviderPort (interface, in application/ports)
                              │
                     bound at module-registration time to →
                              ▼
            @aifa/ai-provider-sdk's ProviderRegistry
                              │
              resolves active provider(s) from @aifa/config
                              │
                    wraps each in CircuitBreaker
                              │
                 tries in priority order via FallbackChain
                              │
                              ▼
              infrastructure/providers/<vendor>.adapter.ts
           (implements AiProvider; only file allowed to import
            the vendor's own SDK/HTTP client)
```

## Configuration-driven, not code-driven, provider selection

Which providers are active and in what fallback order is **data** (the `AiProviderConfig` table / `packages/config` at boot), not a code change. Disabling a failing provider or reordering fallback priority is an operational action, not a deploy.

## Adding a new provider (the intended workflow this architecture optimizes for)

1. Create `apps/api/src/infrastructure/providers/<vendor>.adapter.ts` implementing `AiProvider` from `@aifa/ai-provider-sdk`.
2. Register it in the provider registry's bootstrap (one line).
3. Add a row/config entry so it's selectable without a code change elsewhere.

No use case, controller, or domain file changes when a provider is added, removed, or reordered — this is the concrete test of "no provider may be hardcoded" and "hot-swappable."

## Failure semantics

- A single provider's failure trips its `CircuitBreaker` (after N consecutive failures) and the `FallbackChain` moves to the next configured provider.
- Only if **every** configured provider fails does the use case receive an error — and it receives a domain-level `AllProvidersUnavailableError`, not a vendor-specific exception, so `apps/api`'s error handling (see `api-architecture.md`) never branches on vendor error types.

## What's stubbed vs. real (Sprint 1)

The registry, fallback chain, circuit breaker, and port interfaces are real, tested code. `StubAdapter` (`packages/ai-provider-sdk/src/adapters/stub.adapter.ts`) is still used for the bootstrap-default providers (`stub-primary`/`stub-secondary`) and any `AiProviderConfig` row missing `baseUrl`/`model`/`apiKeyEnvVar`. `OpenAiCompatibleAdapter` (`apps/api/src/infrastructure/providers/openai-compatible.adapter.ts`) is a real HTTP adapter — real `fetch` calls, real bearer auth, a real per-call timeout (`AbortController`) — selected by `ProviderRegistryAdapter` only when a config row is fully configured *and* its named API-key env var actually holds a value at boot; otherwise that row falls back to `StubAdapter` with a warning, never crashing the app. No real vendor API key exists in this codebase's development/CI sandbox, so the adapter's logic (request shape, auth header, response parsing, error/timeout handling) is verified by unit tests against an injected `fetch` double, not a live call to a real vendor.

The cost layer (`packages/ai-provider-sdk/src/cost.ts`'s `calculateCostMinorUnits`) is also real: given `ChatResult.usage` and a provider's `costPerInputTokenMicros`/`costPerOutputTokenMicros` (now real columns on `AiProviderConfig`), it computes what a call cost the platform — stopping there, never computing customer price (Pricing's job, ADR-0009). `ProviderCostSourcePort`/`ProviderRegistryAdapter.getCostRates()` expose the configured rates to a future consumer; the Chat use case (Sprint 1 Feature 5, not built yet) is what will actually call `calculateCostMinorUnits` and feed the result into `PricingEnginePort` — so there's no end-to-end HTTP path exercising the cost layer today, only the unit-tested pure function and the rate lookup.

---

## Design-only extensions (Phase 2, updated Sprint 1)

Everything below is architecture/interface design for capabilities the current adapters don't need yet. Streaming, the capability matrix, retry policy, and response caching are all still unimplemented — each section states the target shape so a future adapter/use case has a contract to implement against, per ADR-0007. (The cost layer, originally the last item in this list, is implemented now — see "What's stubbed vs. real" above.)

### Provider capability matrix

Not every provider supports every feature (vision, function-calling, streaming, embeddings). `AiProvider` gains a `capabilities` field:

```ts
interface ProviderCapabilities {
  chat: boolean;
  streaming: boolean;
  vision: boolean;
  functionCalling: boolean;
  embeddings: boolean;
  maxContextTokens: number;
}

interface AiProvider {
  readonly id: ProviderId;
  readonly capabilities: ProviderCapabilities; // NEW — not yet on the interface
  // ...
}
```

`ProviderSelectionPolicy` (see `ddd-tactical-design.md`) filters the registry by required capability before applying fallback priority — a request needing vision never gets routed to a text-only provider, regardless of priority order.

### Streaming design

`chat()` returns `Promise<ChatResult>` today (non-streaming). The streaming variant, for when a real adapter needs it:

```ts
interface AiProvider {
  chat(request: ChatRequest): Promise<ChatResult>;
  chatStream(request: ChatRequest): AsyncIterable<ChatChunk>; // NEW — not yet implemented
}

interface ChatChunk {
  providerId: ProviderId;
  delta: string;       // incremental content
  done: boolean;
}
```

`FallbackChain.chatStream()` cannot silently retry mid-stream on a different provider once tokens have been sent to the client (the client would see a discontinuous response) — its target design only fails over **before** the first chunk is yielded; a failure after streaming has started propagates as a stream error, not a silent provider switch. This is a real constraint worth flagging now, before a caching/UI layer is built on the wrong assumption.

### Retry strategy

Distinct from `CircuitBreaker` (which stops calling a provider after repeated failures) — retry handles a *single* transient failure (network blip, provider 503) before deciding the call failed at all:

- Exponential backoff with jitter: `min(baseMs * 2^attempt + random(0, jitterMs), maxDelayMs)`, default `baseMs=200`, `maxDelayMs=5000`, max 2 retries.
- Only retries idempotent-safe failures (timeouts, 5xx, connection errors) — never retries after a response has been partially received (avoids duplicate side effects, relevant once Billing meters per-call).
- Lives as a decorator (`RetryPolicy`, analogous to `CircuitBreaker`) wrapping an adapter, composed as: `CircuitBreaker(RetryPolicy(adapter))` — retry happens before a failure counts against the circuit breaker's threshold.

### Timeout strategy

Every adapter call gets a hard timeout (default 30s for `chat`, 60s for `chatStream`'s time-to-first-chunk) enforced by the adapter itself (via the vendor SDK's own timeout option where available, or `AbortController` otherwise) — not left to the HTTP client's default, which is often either infinite or too short for a slow model response. A timed-out call counts as a failure for both retry and circuit-breaker purposes.

### Caching strategy

Two distinct cache opportunities, not to be conflated:
1. **Response cache** (target): identical `ChatRequest` (same messages, model, temperature=0) within a short TTL (e.g. 5 minutes) can return a cached `ChatResult` — an explicit opt-in per request (a `cacheable: boolean` flag), never on by default, since most chat use cases want a fresh response even for a repeated question.
2. **Provider health cache**: already effectively implemented — `CircuitBreaker`'s state *is* a health cache (avoids a real health-check network call on every request). A separate explicit `healthCheck()` result cache (short TTL, e.g. 10s) is a reasonable future addition if health checks become expensive, not needed at current scale.

Cache storage: Redis (already in the stack — `infra/docker/docker-compose.yml`), keyed by a hash of the normalized request, namespaced per provider so a cache-invalidation bug in one provider's integration can't poison another's.

### Future provider onboarding (checklist)

1. Confirm the vendor's SDK/HTTP contract maps cleanly onto `ChatRequest`/`ChatResult` (`packages/types`) — note any capability gaps in the new provider's `capabilities` object rather than distorting the shared type to fit one vendor.
2. Write `infrastructure/providers/<vendor>.adapter.ts`, implementing timeout + reporting real `usage` numbers.
3. Add a row to `AiProviderConfig` (disabled by default — `isEnabled: false`) so it can be tested in an environment before going live.
4. Verify circuit-breaker/retry/fallback behavior against the new adapter with its network calls mocked (unit test), then against a real sandbox/test key if the vendor offers one (integration test, not run in CI without a real key — mark `skip` unless the key is present).
5. Flip `isEnabled: true` in the target environment's config once verified.

No code outside `infrastructure/providers/` changes for any of the above — the entire point of ADR-0005.
