# DDD Tactical Design

`docs/architecture/domain-boundaries.md` defines the strategic picture (bounded contexts, why they're sequenced Identity → Provider Access → Conversation → Billing). This document defines the tactical patterns *inside* each context — the building blocks every future implementer should reuse rather than reinvent per-context.

## Building blocks (definitions as used in this codebase)

| Pattern | Definition here | Lives in |
|---|---|---|
| **Entity** | Has identity (an id) that persists across state changes; equality is by id, not attribute values. | `domain/` |
| **Value Object** | No identity; equality is by value; immutable. Prefer this over a primitive (e.g. `Money`, `EmailAddress`) whenever a primitive would let invalid states compile. | `domain/` |
| **Aggregate** | A cluster of entities/value objects with one designated **Aggregate Root** that is the only object external code may reference directly; the root enforces the cluster's invariants. | `domain/` |
| **Repository** | One per aggregate root (never per table), interface in `application/ports/`, implementation in `infrastructure/persistence/`. Returns/accepts aggregate roots, never raw ORM rows. | port: `application/`, impl: `infrastructure/` |
| **Domain Service** | Domain logic that doesn't naturally belong to one entity/value object (e.g. something spanning two aggregates). Stateless. | `domain/services/` |
| **Application Service (Use Case)** | Orchestrates one user-facing operation: loads aggregate(s) via repository, calls domain logic, persists, returns a DTO. Contains no business rules itself — those live in the domain layer. | `application/use-cases/` |
| **Domain Event** | Something that happened, named in the past tense (`CreditsReserved`, `ProviderMarkedUnhealthy`), raised by an aggregate, handled by an application-layer subscriber. Not implemented yet (no aggregate needs cross-context notification this milestone) — the pattern is documented so Billing/Conversation adopt it consistently once they exist, rather than each inventing its own event shape. | `domain/events/` (reserved, not yet populated) |

## Per-context tactical design (target shape — only Platform/System is implemented)

### Platform/System (implemented this milestone)
No aggregate — `HealthModule` is infrastructure-adjacent (system introspection), not a domain concept with business invariants. This is why it skips the aggregate/repository pattern entirely; forcing DDD ceremony onto a health check would be over-engineering.

### Identity (not implemented — target design)
- **Aggregate root:** `Account` (not `User` — see note below). Invariants: an account has exactly one primary email, cannot be deleted while it holds a non-zero wallet balance (cross-context rule enforced at the application layer, since Wallet is a different aggregate/context — see Context Mapping below).
- **Value objects:** `EmailAddress` (validates format), `AccountId`.
- **Repository:** `AccountRepository` (port), backed by the `User` Prisma model — note the deliberate naming split: `AccountId` note below.
- **Note on `User` vs `Account`:** `packages/database/prisma/schema.prisma`'s `User` table was named before this document existed. Recommend renaming the domain concept to `Account` (an "account" can later encompass org/team membership; "user" strongly implies a single natural person, foreclosing that later) — flagged as a decision for whoever implements Identity, not made unilaterally here since it touches a already-created (if unused) table. See `TECHNICAL_DEBT.md`.

### Provider Access (abstraction implemented; routing/metering not implemented)
- **Aggregate root:** none needed for the registry itself (it's a runtime object, not a persisted business entity) — `AiProviderConfig` (the persisted configuration) is a simple entity, not an aggregate, since it has no internal sub-objects and no invariants beyond field validation.
- **Domain service (target):** `ProviderSelectionPolicy` — given a request's required capabilities (from the future capability matrix, see `ai-provider-layer.md`) and the current `ProviderRegistry` state, decides fallback order. Currently, `FallbackChain`'s order is config-driven (static priority), not policy-driven — this is the documented seam for where dynamic routing logic would go.

### Billing (not implemented — target design, design-only per current scope)
See `wallet-architecture.md` and `pricing-architecture.md` for full detail. Tactical shape: `Wallet` is the aggregate root (owns `LedgerEntry` value objects internally — a ledger entry is never modified after creation, only appended, which is why it's a value object, not an entity with its own repository).

### Conversation (not implemented — target design)
- **Aggregate root:** `Conversation` (owns `Message` entities — messages have identity because they can be individually referenced/edited-flagged, but never exist outside their parent conversation, hence not their own aggregate).

## Dependency rules (restating `backend-architecture.md`'s rule in DDD terms)

- A domain service may depend on other domain services/entities/value objects **within the same bounded context only**. Cross-context domain logic doesn't exist — it's always mediated by an application-layer use case calling another context's exported port.
- An aggregate is never referenced by another aggregate's foreign key held as a live object reference — only by id. (E.g., a future `Conversation` aggregate holds `accountId: AccountId`, never a live `Account` object.) This keeps aggregates independently loadable and testable.

## Context mapping

```
Identity ──────────────┐
                        │ (Account.id referenced by id only)
Provider Access         ▼
   │              Conversation ──────► Billing
   │ (config only,         │ (usage events meter    (ledger debited
   │  no per-account       │  against Billing,       per Context
   │  coupling)            │  not implemented yet)   Mapping above)
   ▼
(no dependents yet)
```

Relationship style (DDD context-mapping vocabulary): Identity is a **Shared Kernel-free upstream** — Conversation and Billing depend on it (via id reference only), it depends on nothing. Provider Access is used by Conversation as a **Customer/Supplier** (Conversation is the customer; Provider Access's interface is designed for Conversation's needs, but Provider Access doesn't know Conversation exists — it's generic). This mapping should be revisited once Conversation/Billing are actually implemented; it's a prediction, not a retrospective.

## Why this document exists separately from `domain-boundaries.md`

`domain-boundaries.md` answers "which context owns what and in what order do we build them." This document answers "once you're inside a context, what pattern do you reach for" — keeping the two separate avoids one file trying to be both a map and a style guide.
