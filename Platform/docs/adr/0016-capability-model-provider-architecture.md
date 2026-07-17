# ADR-0016: Capability → Model → Provider as the canonical routing chain

**Status:** Accepted
**Date:** 2026-07-17
**Decision owners:** AIFA founder (product/architecture)
**Related:** ADR-0005 (provider registry + adapter pattern), ADR-0007 (capability matrix, streaming, cost — design-only extensions), ADR-0017 (multi-modal provider abstraction)
**Supersedes:** none
**Superseded by:** none

## Context

ADR-0005 established a provider-registry/adapter pattern for a single capability (chat). AIFA's product scope has since been locked as a multi-modal portfolio (chat, image, video, avatar, voice, music — see ADR-0018 through ADR-0023), each with multiple models, multiple provider options per model, and in some cases multiple regional endpoints per provider. The existing `AiProvider` port (keyed flatly by `providerId`) has no concept of capability, model family, variant, or region — it cannot express "route this chat request to GPT-5.6 Sol via OpenAI's default region" versus "route this image request to Nano Banana Pro via Google."

## Problem

Without an explicit routing chain, capability→provider mapping becomes implicit and ad hoc as more modalities are added, which directly risks two things the mission forbids: exposing a provider-first experience to end users, and hardcoding a provider inside application logic per capability.

## Decision

The canonical routing chain, front-to-back, is:

```
Capability → Model → Provider
```

as the **user- and product-facing** abstraction (what AIFA calls a "model" is a stable AIFA identity — e.g. "GPT-5.6 Sol" — that a user selects or that Smart Router selects on their behalf; the provider behind it is an implementation detail).

Internally, the routing chain used by the backend to actually dispatch a request is:

```
Capability → Model Family → Variant → Provider → Regional Endpoint
```

- **Capability**: one of Chat, Image, Video, Avatar, Voice, Music (ADR-0018–0023).
- **Model Family**: a product-facing named model (e.g. "Kling 3", "Nano Banana Pro") — may map to one or more providers over time.
- **Variant**: a specific configuration of a model family (e.g. resolution tier, quality tier, "HQ" vs. standard) — see each portfolio ADR's Premium/Professional/Economy tiers.
- **Provider**: the vendor/API that actually serves the variant (ADR-0017; per-provider docs in `docs/providers/`).
- **Regional Endpoint**: a specific provider region/data-residency option, where the provider offers one (relevant to Privacy Engine, `docs/architecture/regional-routing.md`, and `docs/architecture/privacy-routing.md`).

A model or AIFA product identity **remains stable even when the underlying provider changes** (e.g. if AIFA moves "Kling 3" from a direct Kling integration to a `fal` gateway route, the user-facing model identity does not change). Provider substitution must be **observable and disclosed where required** (e.g. in an audit log, a "powered by" disclosure where commercially/legally required) — never silently misrepresented as a different model.

## Decision drivers

- The mission constraint from ADR-0005 ("no provider may be hardcoded... provider failure must not break the application") must extend to every capability, not just chat.
- A multi-modal portfolio without an explicit routing chain becomes unmaintainable and risks silent provider-model conflation (see `docs/portfolio/README.md`'s AIFA-alias vs. real-model-ID distinction).
- Users must not be forced into a provider-first experience (mission requirement) — the chain's outward face is Capability → Model; Provider and Regional Endpoint are backend routing concerns only.

## Alternatives considered

- **Flat per-capability provider registries** (one `ProviderRegistry`-like map per capability, no shared model/variant concept): simpler short-term, but re-derives the same registry pattern six times (once per capability) with no shared vocabulary for "this model, this variant, this region" — rejected as it does not scale to the full portfolio and would make Smart Router's cross-capability routing (ADR-0024) harder to implement uniformly.
- **Provider-first user experience** (let users pick "OpenAI" or "Google" directly): rejected outright — violates the mission's explicit requirement that users must not be forced into a provider-first experience, and forfeits AIFA's ability to substitute providers transparently.

## Consequences

- `packages/types/src/ai-provider.ts`'s current `ChatRequest.model?: string` (a bare optional string) does not yet express Model Family/Variant/Provider/Region — extending it is a real, non-trivial implementation task, intentionally **not** done as part of this docs-only decision record. This ADR fixes the target shape; implementation is future engineering work.
- Every portfolio ADR (0018–0023) and every provider doc (`docs/providers/*.md`) must express its entries in terms of this chain (capability, model family, variant, provider, region where applicable) so the mapping is traceable end to end.
- `docs/architecture/capability-model-provider.md` documents this chain's structure and how it composes with ADR-0005/0007's registry/adapter mechanism and ADR-0024's Smart Router.

## Risks

- Retrofitting the current chat-only, flat-provider-id implementation to this five-level chain is real engineering effort not yet scoped or estimated.
- A model family with only one available provider (no real alternative) cannot honestly offer "hot-swappable" resilience — this must be disclosed as a dependency risk (see `docs/economics/README.md`'s cross-reference to AIFA_Brain's Dependency & Exit-Path Registry), not silently treated as equivalent to a multi-provider model.

## Mitigations

- Provider mapping status is tracked explicitly per portfolio entry using the classification taxonomy in `docs/portfolio/README.md` (VERIFIED_ACTIVE, AIFA_ALIAS, PLANNED, RESERVE, WATCHLIST, INTEGRATION_GATED, UNVERIFIED) so single-provider dependency is visible, not hidden.

## Implementation implications

- Any future engineering ADR that extends `AiProvider`/`ProviderRegistry` to carry model-family/variant/region must reference this ADR as the target shape it is implementing toward.

## Related documents

- `docs/architecture/capability-model-provider.md`
- `docs/architecture/ai-provider-layer.md` (existing mechanism)
- ADR-0005, ADR-0007, ADR-0017
