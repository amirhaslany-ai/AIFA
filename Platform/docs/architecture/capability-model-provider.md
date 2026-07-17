# Capability → Model → Provider

**Status:** Design/direction (ADR-0016, Accepted). No implementation exists beyond chat's flat provider-id registry (ADR-0005/0007).

## The chain

**Product-facing:** `Capability → Model` (e.g. "Chat → Claude Opus 4.8"). Provider is never a user-facing concept.

**Backend-facing:** `Capability → Model Family → Variant → Provider → Regional Endpoint`.

See ADR-0016 for the full rationale, decision drivers, and consequences. This document is the structural reference other docs point to — it does not restate ADR-0016's content.

## Composition with the existing mechanism

This chain sits *above* the registry/adapter/fallback/circuit-breaker mechanism ADR-0005/0007 already built for chat (`ai-provider-layer.md`). The mechanism answers "how do we call a provider resiliently"; this chain answers "which provider, for which model, in which region, for this capability." ADR-0017 fixes that the same mechanism is reused, not reinvented, per capability.

## Where each portfolio lives

| Capability | Portfolio ADR | Portfolio doc |
|---|---|---|
| Chat | ADR-0018 | `docs/portfolio/chat.md` |
| Image | ADR-0019 | `docs/portfolio/image.md` |
| Video | ADR-0020 | `docs/portfolio/video.md` |
| Voice | ADR-0021 | `docs/portfolio/voice.md` |
| Music | ADR-0022 | `docs/portfolio/music.md` |
| Avatar | ADR-0023 | `docs/portfolio/avatar.md` |

## Related documents

- ADR-0016, ADR-0017
- `ai-provider-layer.md` (the registry/adapter/fallback/circuit-breaker mechanism)
- `smart-routing.md`, `regional-routing.md`, `privacy-routing.md`, `cost-routing.md` (the routing policies that select a value at each level of the chain)
