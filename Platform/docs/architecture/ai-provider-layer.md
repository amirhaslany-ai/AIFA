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

## What's stubbed vs. real this milestone

The registry, fallback chain, circuit breaker, and port interfaces are real, tested code. Vendor adapters (`openai.adapter.ts`, etc.) are stub implementations that satisfy the `AiProvider` interface and return a deterministic placeholder response — no real API key, network call, or billing implication exists yet, per the mission's explicit "do not build AI providers implementation" constraint.

---

## Design-only extensions (Phase 2)

Everything below is architecture/interface design for capabilities the current `StubAdapter` doesn't need yet. None of it is implemented — each section states the target shape so a real adapter has a contract to implement against, per ADR-0007.

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

### Provider cost layer

Each adapter's response should report actual token usage (`ChatResult.usage`, already on the type) — the cost layer multiplies that by a per-provider, per-model cost table (source: `AiProviderConfig` gains `costPerInputTokenMicros`/`costPerOutputTokenMicros` columns, target design, not yet in the schema) to produce a cost-in-smallest-currency-unit figure attached to the response. This figure is what `pricing-architecture.md`'s markup layer and `wallet-architecture.md`'s ledger consume — the AI provider layer's job stops at "here's what this call cost us," never "here's what to charge the customer" (that's Pricing's job, kept as a separate concern per single-responsibility).

### Future provider onboarding (checklist)

1. Confirm the vendor's SDK/HTTP contract maps cleanly onto `ChatRequest`/`ChatResult` (`packages/types`) — note any capability gaps in the new provider's `capabilities` object rather than distorting the shared type to fit one vendor.
2. Write `infrastructure/providers/<vendor>.adapter.ts`, implementing timeout + reporting real `usage` numbers.
3. Add a row to `AiProviderConfig` (disabled by default — `isEnabled: false`) so it can be tested in an environment before going live.
4. Verify circuit-breaker/retry/fallback behavior against the new adapter with its network calls mocked (unit test), then against a real sandbox/test key if the vendor offers one (integration test, not run in CI without a real key — mark `skip` unless the key is present).
5. Flip `isEnabled: true` in the target environment's config once verified.

No code outside `infrastructure/providers/` changes for any of the above — the entire point of ADR-0005.
