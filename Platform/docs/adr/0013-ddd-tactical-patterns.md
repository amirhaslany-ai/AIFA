# ADR-0013: Standard DDD tactical patterns (aggregate/entity/value-object/repository) across all bounded contexts

**Status:** Accepted
**Date:** 2026-07-12
**Related:** `docs/architecture/ddd-tactical-design.md`, `docs/architecture/domain-boundaries.md`

## Context

`domain-boundaries.md` (Phase 1) named the bounded contexts and their sequencing but didn't fix *how* domain logic is modeled inside each one. Without a shared answer, each future context (Identity, Billing, Conversation) risks inventing its own ad hoc pattern, reintroducing the inconsistency the whole hexagonal/DDD approach is meant to prevent.

## Decision

Every bounded context that has real domain invariants (i.e., isn't a thin infrastructure-adjacent module like `HealthModule`) uses the same tactical vocabulary, defined once in `ddd-tactical-design.md`: entities have identity-based equality, value objects are immutable and value-equal, aggregates designate one root as the only externally-referenceable object and enforce invariants across their cluster, repositories are one-per-aggregate-root (never per table) and speak in aggregates/entities, never raw ORM rows, and cross-aggregate references are always by id, never a live object reference.

## Rationale

- A single, named vocabulary means a developer moving from Identity to Billing to Conversation already knows the shape they'll find, rather than re-learning each context's bespoke conventions.
- "Repository per aggregate root, not per table" specifically prevents a common DDD anti-pattern (a repository per table that lets calling code assemble aggregates ad hoc, silently bypassing the root's invariant enforcement).
- "Cross-aggregate references by id only" keeps aggregates independently loadable/testable and is what makes the Context Mapping in `ddd-tactical-design.md` meaningful — if aggregates held live references to each other, the bounded-context boundaries would be fiction.

## Alternatives considered

- **Anemic domain model (all logic in application-layer use cases, entities are plain data)**: simpler to write initially, rejected because it's exactly the pattern Clean/Hexagonal/DDD architecture (mission-mandated) is meant to avoid — invariants end up scattered across use cases instead of enforced once at the aggregate.
- **Let each bounded context choose its own tactical style:** rejected for the consistency reason above; a context with genuinely different needs (e.g. an event-sourced aggregate) should propose a superseding/additional ADR explaining why, not silently diverge.

## Consequences

- Only `HealthModule` exists today and correctly has no aggregate (see `ddd-tactical-design.md`'s per-context section) — this ADR doesn't retroactively force DDD ceremony onto something that doesn't need it.
- Whoever implements Identity, Billing, or Conversation first should treat `ddd-tactical-design.md`'s per-context sketch as the starting contract, and update that document (not silently deviate) if real implementation reveals the sketch was wrong.
