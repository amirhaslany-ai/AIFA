# Fallback routing (cross-capability)

**Status:** Design/direction (ADR-0017, Accepted). Implemented only for chat (`FallbackChain`, ADR-0005) — see `ai-provider-layer.md` for the actual mechanism; this document does not restate it.

## Summary

ADR-0017 decides that chat's existing `FallbackChain`/`CircuitBreaker` pattern (ADR-0005/0007) is the required mechanism for every capability's provider fallback, not a mechanism to reinvent per modality. This document records only what's new when applying that mechanism *across* the whole portfolio: which capabilities already have a named fallback path decided at the product level.

## Named fallback paths already decided (portfolio ADRs)

| Capability | Model | Primary provider | Fallback | Source |
|---|---|---|---|---|
| Video | Kling 3 | Kling (direct) | `fal` (optional) | ADR-0020 |
| Video | Seedance 2 | Volcano Engine | approved gateway (optional) | ADR-0020 |
| Image | FLUX.2 Pro | Black Forest Labs (direct) | `fal` (optional route) | ADR-0019 |

No other capability has a named fallback path yet — most portfolio entries (ADR-0018, 0021, 0022, 0023) list only a single expected provider per model, meaning **no fallback exists for those models today**. This is a real dependency risk (see ADR-0016 Risks), not an oversight; it is recorded honestly rather than implying resilience that doesn't exist yet.

## Related documents

- ADR-0005, ADR-0007, ADR-0016, ADR-0017
- `ai-provider-layer.md`, `capability-model-provider.md`
