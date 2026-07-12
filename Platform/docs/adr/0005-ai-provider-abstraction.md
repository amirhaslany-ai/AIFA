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

- No `apps/api` file outside `infrastructure/providers/` may import an `openai`, `@anthropic-ai/sdk`, or similar package. This is enforceable later via an ESLint import-boundary rule (documented in `Platform/docs/architecture/coding-standards.md`, not yet configured — flagged as follow-up work).
- Real provider adapters, API keys, and rate-limit handling are explicitly out of scope for this milestone (mission constraint) — only the interface, registry, and one illustrative stub adapter exist today.
