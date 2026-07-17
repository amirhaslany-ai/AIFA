# ADR-0017: The provider-abstraction pattern (ADR-0005/0007) applies unchanged to every capability

**Status:** Accepted — design/direction only, no implementation beyond chat exists yet
**Date:** 2026-07-17
**Decision owners:** AIFA founder (product/architecture)
**Related:** ADR-0005, ADR-0007, ADR-0016
**Supersedes:** none
**Superseded by:** none

## Context

ADR-0005 built a real, tested `AiProvider` port + `ProviderRegistry` + `FallbackChain` + `CircuitBreaker` for chat. ADR-0007 extended the design (capability matrix, streaming, retry, cost) — still chat-scoped in the actual code (`packages/ai-provider-sdk`, `packages/types/src/ai-provider.ts`). AIFA's portfolio now spans six capabilities (ADR-0018–0023), each with its own set of providers (`docs/providers/`). A new abstraction could be invented per modality (an `ImageProvider` port distinct from `AiProvider`, a `VideoProvider` port, etc.) or the existing pattern could be generalized and reused.

## Problem

Deciding, before any image/video/avatar/voice/music code exists, whether AIFA invents a new provider-abstraction mechanism per modality or reuses the one already built and proven for chat — so that future engineering work has a settled target rather than re-litigating ports-and-adapters per capability.

## Decision

**No new provider-abstraction mechanism is invented per modality.** The registry + adapter + fallback-chain + circuit-breaker pattern from ADR-0005, and the capability-matrix/streaming/retry/cost extensions from ADR-0007, are the **required pattern for every future capability adapter** — image, video, avatar, voice, and music alike. Each capability gets its own typed request/result DTOs (an image generation request is not shaped like a chat request), but the *mechanism* — a registry resolved from config, adapters translating vendor shape to internal DTOs, fallback chains, circuit breakers, per-call cost reporting — is shared, not reinvented.

## Decision drivers

- Single-responsibility and DRY: the failure-isolation problem (provider outage, rate limit, timeout) is identical in shape across chat, image, video, avatar, voice, and music — solving it once and reusing it is strictly better than six parallel, subtly-different implementations.
- ADR-0005's own rationale ("isolating vendor churn to adapters is the entire point of the abstraction") applies with equal force to every modality; vendor churn is, if anything, faster in image/video (see `docs/providers/` — several providers are recent acquisitions or fast-moving valuations).
- Avoids the common failure mode of "this module's V1 got a bespoke pattern because nobody looked at what already existed."

## Alternatives considered

- **A dedicated port per modality** (`ImageProvider`, `VideoProvider`, `VoiceProvider`, …), each with its own registry/fallback/circuit-breaker reimplementation: rejected — six near-identical resilience mechanisms is exactly the maintenance burden ADR-0005 was written to avoid, multiplied by six.
- **A single untyped `AnyCapabilityProvider` interface** handling all modalities through one generic request/response shape: rejected — an image generation call and a chat call have genuinely different request/response shapes (resolution/duration/voice parameters vs. messages/tokens); forcing them into one interface would produce a leaky, `any`-typed contract that defeats the purpose of the DTOs in `packages/types`.

## Consequences

- Future engineering work for image/video/avatar/voice/music providers extends `packages/ai-provider-sdk`'s existing primitives (or a sibling package following the identical pattern), not a new package with a new resilience mechanism.
- `docs/architecture/fallback-routing.md` documents this shared mechanism's application across capabilities without restating ADR-0005/0007's mechanism details — it cross-references `docs/architecture/ai-provider-layer.md` for the mechanism itself.
- No provider integration in `docs/providers/` should be read as production-ready — per the mission's own instruction, appearing in the portfolio is a product decision, not an implementation status claim. As of this ADR, only chat has any real (non-stub) adapter (`OpenAiCompatibleAdapter`, ADR-0005 Consequences), and it is not configured against a real vendor (`CURRENT_IMPLEMENTATION_STATUS.md`).

## Risks

- Generalizing a pattern before a second real use case exists risks the pattern being subtly chat-shaped in ways that don't fit image/video until someone actually implements an adapter and finds the mismatch.

## Mitigations

- This ADR fixes intent, not a finished generic interface — the actual generalization (if `AiProvider` needs a shared base vs. capability-specific ports composing shared decorators) is left to the engineering task that first implements a non-chat adapter, informed by this decision rather than starting from zero.

## Implementation implications

- The first non-chat provider adapter built should validate (and if necessary, formally amend via a new ADR) whether `FallbackChain`/`CircuitBreaker` can wrap a non-chat `AiProvider`-shaped port unmodified, or need a shared generic base.

## Related documents

- `docs/architecture/ai-provider-layer.md`, `docs/architecture/fallback-routing.md`, `docs/architecture/capability-model-provider.md`
- ADR-0005, ADR-0007, ADR-0016
