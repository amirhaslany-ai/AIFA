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

### Identity (implemented — Sprint 1)
- **Aggregate root:** `Account` (`apps/api/src/domain/account.entity.ts`). Invariant enforced: unique email (via `Email` value object + a DB unique constraint). The "cannot be deleted while it holds a non-zero wallet balance" cross-context invariant is deferred until Wallet exists — not enforceable yet, correctly not implemented.
- **Value objects:** `Email` (`apps/api/src/domain/email.ts`) — validates format, normalizes case.
- **Repository:** `AccountRepositoryPort` → `PrismaAccountRepository`, backed by the `Account` Prisma model.
- **Auth mechanics:** `RefreshToken` (persistence-only record, not a domain entity — it has no behavior of its own, only rotation/revocation state read and written by `RefreshTokenRepositoryPort`). See `docs/adr/0010-auth-token-strategy.md`.

### Provider Access (registry/fallback/circuit-breaker + real adapter implemented; capability-aware routing not implemented)
- **Aggregate root:** none needed for the registry itself (it's a runtime object, not a persisted business entity) — `AiProviderConfig` (the persisted configuration) is a simple entity, not an aggregate, since it has no internal sub-objects and no invariants beyond field validation.
- **Domain service (target):** `ProviderSelectionPolicy` — given a request's required capabilities (from the future capability matrix, see `ai-provider-layer.md`) and the current `ProviderRegistry` state, decides fallback order. Currently, `FallbackChain`'s order is still config-driven (static priority), not policy-driven — this is the documented seam for where dynamic routing logic would go.

### Billing (implemented — Sprint 1)
See `wallet-architecture.md` and `pricing-architecture.md` for full detail. `Wallet` (`apps/api/src/domain/wallet.entity.ts`) is the aggregate root, owning `LedgerEntry` value objects internally (never modified after creation, only appended — a value object, not an entity with its own repository). Pricing (`domain/pricing/`) is a stateless computation over a cost figure and config, not a persisted aggregate.

### Conversation (implemented — Sprint 1)
- **Aggregate root:** `Conversation` (`apps/api/src/domain/conversation.entity.ts`), owning `Message` entities (`apps/api/src/domain/message.ts`) — messages have identity (an id) but never exist outside their parent conversation, hence not their own aggregate, matching the target shape below exactly.
- **Repository:** `ConversationRepositoryPort` → `PrismaConversationRepository`. `hasMessage(id)` supports a check-first idempotency guard for client-supplied message ids (docs/adr/0014-chat-orchestration.md), the same pattern `WalletRepositoryPort.hasLedgerEntry` uses for `ReserveFundsUseCase`.
- **Cross-context orchestration:** `SendChatMessageUseCase` (`application/use-cases/`) is the one place that calls into Identity (implicit — the authenticated principal), Provider Access (`ChatCompletionPort`), Billing/Pricing (`PricingEnginePort`), and Billing/Wallet (`WalletRepositoryPort`, `Wallet.debit()`) in a single request — see ADR-0014 for why it doesn't use Wallet's reserve/settle flow.

## Dependency rules (restating `backend-architecture.md`'s rule in DDD terms)

- A domain service may depend on other domain services/entities/value objects **within the same bounded context only**. Cross-context domain logic doesn't exist — it's always mediated by an application-layer use case calling another context's exported port.
- An aggregate is never referenced by another aggregate's foreign key held as a live object reference — only by id. (E.g., a future `Conversation` aggregate holds `accountId: AccountId`, never a live `Account` object.) This keeps aggregates independently loadable and testable.

## Context mapping

```
Identity ──────────────┐
                        │ (Account.id referenced by id only)
Provider Access         ▼
   │              Conversation ──────► Billing
   │ (config only,         │ (real cost/usage        (Wallet.debit()
   │  no per-account       │  from ChatCompletionPort  charged with the
   │  coupling)            │  feeds Pricing)          real price)
   ▼
(no dependents yet)
```

Relationship style (DDD context-mapping vocabulary): Identity is a **Shared Kernel-free upstream** — Conversation and Billing depend on it (via id reference only), it depends on nothing. Provider Access is used by Conversation as a **Customer/Supplier** (Conversation is the customer; Provider Access's interface is designed for Conversation's needs, but Provider Access doesn't know Conversation exists — it's generic). This mapping is confirmed now that Conversation/Billing are actually implemented (Sprint 1) — it held up as predicted, not just a prediction anymore.

## Why this document exists separately from `domain-boundaries.md`

`domain-boundaries.md` answers "which context owns what and in what order do we build them." This document answers "once you're inside a context, what pattern do you reach for" — keeping the two separate avoids one file trying to be both a map and a style guide.
