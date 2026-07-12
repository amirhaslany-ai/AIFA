# ADR-0005: AI Provider Layer — registry + adapter pattern, no hardcoded provider

**Status:** Accepted
**Date:** 2026-07-12
**Mission constraint:** "No provider may be hardcoded. Providers must be hot-swappable. Provider failure must not break the application."

## Context

The aggregator platform's entire value proposition is multi-model access. The application layer must never import a specific vendor SDK (OpenAI, Anthropic, Google, etc.) directly — only a stable internal interface.

## Decision

`packages/ai-provider-sdk` defines:

1. **`AiProvider` port** (interface): `id`, `capabilities` (chat/completion/embedding/vision flags), `chat(request): Promise<ChatResult>` (or `AsyncIterable` for streaming), `healthCheck(): Promise<ProviderHealth>`.
2. **`ProviderRegistry`**: holds a map of `AiProvider` implementations keyed by provider id, resolved at runtime from configuration (`packages/config`), not compile-time imports in application code.
3. **`ProviderAdapter` base**: each concrete vendor (e.g., `adapters/openai.adapter.ts`, `adapters/anthropic.adapter.ts` — stubs only in this milestone, no real API calls per the mission's "do not build AI providers implementation" constraint) implements `AiProvider` and translates the vendor's own SDK/HTTP shape into the internal `ChatRequest`/`ChatResult` DTOs from `packages/types`.
4. **Failure isolation**: a `FallbackChain` decorator wraps a list of `AiProvider`s in priority order; on a provider error or health-check failure it moves to the next, and only throws if every provider in the chain fails. A `CircuitBreaker` decorator (per-provider) trips after N consecutive failures and short-circuits calls to a known-bad provider for a cooldown window instead of retrying into it.

Consumers (NestJS `application/` use cases in `apps/api`) depend only on the `AiProvider`/`ProviderRegistry` interfaces from `packages/ai-provider-sdk` — never on a vendor SDK package directly. Vendor SDKs are a dependency of the adapter file only.

## Rationale

- This is the standard "ports & adapters" pattern applied to the one part of the system where vendor churn is guaranteed (models/pricing/APIs change constantly) — isolating that churn to adapters is the entire point of the abstraction.
- Registry + config-driven resolution means adding a provider is "write an adapter + register it," never a change to any use case.
- Fallback chain + circuit breaker directly satisfies "provider failure must not break the application" without inventing a bespoke resilience mechanism (this mirrors well-documented patterns, e.g. Netflix Hystrix-style circuit breaking, described in official cloud provider architecture guides).

## Alternatives considered

- **LangChain / LiteLLM as the abstraction layer:** would satisfy "hot-swappable providers" faster, but pulls in a large, fast-moving third-party dependency as the core of the platform's differentiator — the mission explicitly says "avoid unnecessary third-party dependencies" and "no provider may be hardcoded" implies AIFA owns this abstraction rather than inheriting one wholesale. A thin internal layer can still *use* such a library inside a specific adapter later if it earns its place, without it being the contract the rest of the app codes against.

## Consequences

- No `apps/api` file outside `infrastructure/providers/` may import an `openai`, `@anthropic-ai/sdk`, or similar package — machine-enforced via the `no-restricted-imports` ESLint rule in `eslint.config.mjs` (closed the "flagged as follow-up work" gap this ADR originally noted).
- A real adapter now exists (Sprint 1 — `OpenAiCompatibleAdapter`, `infrastructure/providers/openai-compatible.adapter.ts`), built on the platform's `fetch` rather than a vendor SDK package, since the OpenAI-compatible Chat Completions wire format is a stable HTTP contract many vendors implement. `ProviderRegistryAdapter` selects it per `AiProviderConfig` row only when `baseUrl`/`model`/`apiKeyEnvVar` are all set and the named env var holds a value at boot; otherwise it falls back to `StubAdapter`. No real API key exists in the development/CI sandbox this was built in, so the adapter's request/response/error-handling logic is verified via an injected-`fetch` unit test double (isolating the one true external boundary — a live vendor HTTP call — the same way Prisma-backed code is tested against real Postgres, not mocked, wherever that's possible), not a live call to a real vendor endpoint.
