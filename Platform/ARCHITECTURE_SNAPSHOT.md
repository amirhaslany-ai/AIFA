# Architecture Snapshot

Generated 2026-07-12, against commit `fe80762` on `main`. Every lifecycle diagram below traces actual code paths (file + method names), not an idealized design.

## Current architecture (one paragraph)

A pnpm/Turborepo monorepo: one NestJS backend (`apps/api`) built as hexagonal/ports-and-adapters with six real bounded contexts, one Next.js frontend (`apps/web`) that is currently a placeholder shell, and five shared packages. PostgreSQL (via Prisma) is the datastore; Redis is provisioned but has exactly one consumer (a health-check ping). AI provider access goes through a registry + circuit-breaker + fallback-chain, with one real HTTP adapter behind it. This has never been run against real infrastructure — see `CURRENT_IMPLEMENTATION_STATUS.md`.

## Implemented architecture

- **Identity:** `identity.module.ts` — register/login/refresh/logout, real argon2id hashing, real Ed25519 JWT signing/verification, refresh-token rotation with reuse detection.
- **Billing/Wallet:** `wallet.module.ts` — ledger-based `credit`/`reserve`/`settle`/`rollback`/`debit`, idempotent, only `GET /v1/wallet` exposed over HTTP.
- **Billing/Pricing:** `pricing.module.ts` — ordered rule pipeline (base markup → floor), no HTTP surface, invoked only by Chat.
- **Provider Access:** `health.module.ts` hosts `ProviderRegistryAdapter` — registry, circuit breaker, fallback chain, one real HTTP adapter (`OpenAiCompatibleAdapter`), cost-rate lookup.
- **Conversation:** `chat.module.ts` — `Conversation`/`Message` aggregate, `SendChatMessageUseCase` (the one use case composing all of the above), `GetConversationUseCase`.
- **Usage Tracking:** `usage.module.ts` — `UsageEvent` recording + read history.
- **Platform/System:** `health.module.ts` — liveness/readiness, real DB/Redis/provider checks.

## Planned architecture (documented, zero code)

- **Memory** — no design document, no code. Not scoped.
- **Knowledge** — no design document, no code. Not scoped.
- **Workflow / Agents** — no design document, no code. Not scoped.
- **Capability matrix / streaming / retry policy / response caching** for AI providers — designed in ADR-0007, zero implementation.
- **Campaign/discount pricing, per-plan multipliers** — no design document exists; explicitly deferred pending a real business decision.
- **Staging/production infrastructure, CD pipeline** — deferred pending a hosting decision (`infra/README.md`).
- **Real frontend product UI** — route-group skeleton exists (ADR-0004); no screens built.

## Boundaries

Enforced by `eslint.config.mjs`'s `no-restricted-imports` rules (verified to reject a deliberately-introduced violation):
- `domain/` → nothing outside itself. No `@nestjs/*`, no `application/`, no `infrastructure/`, no `interfaces/`, no vendor AI SDK.
- `application/` → `domain/` and its own `ports/` only. No `infrastructure/`, no `interfaces/`, no vendor AI SDK.
- `interfaces/` → `application/` only. No `infrastructure/`, no vendor AI SDK.
- `infrastructure/` (minus `infrastructure/providers/`) → no vendor AI SDK. `infrastructure/providers/` is the one place a vendor SDK would be allowed (moot — none is actually used; `OpenAiCompatibleAdapter` uses the platform's own `fetch`).
- **Not machine-enforced:** `@aifa/database` should only be imported from `apps/api/src/infrastructure/persistence/*` (and `infrastructure/providers/*` for `AiProviderConfig` reads) — this is documented in `docs/architecture/package-boundaries.md` but has no ESLint rule behind it.

## Hexagonal layers

```
interfaces/http/  (controllers, DTOs, guards, filters, middleware)
        │  depends on
        ▼
application/  (use cases, ports/*)
        │  depends on
        ▼
domain/  (entities, value objects, domain errors)

infrastructure/  (adapters) implements application/ports/* — sits "beside" the
                  stack above, injected via NestJS DI, never imported directly
                  by interfaces/ or application/.
```

## DDD boundaries (bounded contexts / aggregate roots)

| Bounded context | Aggregate root | Owned entities/value objects | Cross-context references |
|---|---|---|---|
| Identity | `Account` | `Email` (value object) | `RefreshToken` (persistence-only record, no behavior) |
| Billing/Wallet | `Wallet` | `LedgerEntry` (value object, never independently persisted) | `accountId` — plain field, no FK |
| Billing/Pricing | none (stateless computation) | `PricingRule`/`BaseMarkupRule`/`FloorRule`/`PricingPipeline` | n/a |
| Conversation | `Conversation` | `Message` (entity, owned — real FK/cascade) | `accountId` — plain field, no FK |
| Usage Tracking | `UsageEvent` (standalone, not owned by anything else) | none | `accountId`, `conversationId` — plain fields, no FK |
| Platform/System | none (infrastructure-adjacent, correctly no aggregate) | n/a | n/a |

Every cross-aggregate reference across the whole codebase is a plain id field, never a live object reference and never a Prisma `@relation` — verified consistently (ADR-0013).

## Dependency direction

`interfaces → application → domain`, with `infrastructure` implementing `application`'s ports and being wired in only via NestJS DI module configuration (`*.module.ts`), never imported directly by `interfaces/` or `application/`. Packages depend on `@aifa/types` at the base of their own graph; `apps/api` depends on all five packages; `apps/web` depends on three of the five (not `@aifa/database` or `@aifa/ai-provider-sdk`). No cycle exists anywhere (verified via `turbo prune`'s successful output for both apps).

## Request lifecycle (generic — any authenticated endpoint)

```
Client
  │  HTTP request + Bearer token
  ▼
RequestIdMiddleware        (attach/propagate requestId)
  ▼
ValidationPipe              (class-validator, whitelist unknown props)
  ▼
JwtAuthGuard                (verify token via AuthGuardPort → JwtAuthGuardAdapter)
  ▼
Controller method           (interfaces/http/controllers/*)
  ▼
Use case .execute()          (application/use-cases/*)
  ▼
Port(s)                      (application/ports/*)
  ▼
Adapter(s)                   (infrastructure/*, real I/O)
  ▼
Domain object(s)              (business rules enforced here)
  ▼
Result flows back up → DTO mapping (interfaces/http/dto/*) → HTTP response

On any thrown error at any layer:
  ▼
DomainErrorFilter (global) → maps to {status, code, message, requestId} or a sanitized 500
```

## AI request lifecycle (`POST /v1/chat`, the most complex real path in the system)

```
Client → POST /v1/chat {conversationId?, content, messageId?}
  ▼
ChatController.send()
  ▼
SendChatMessageUseCase.execute()
  │
  ├─ requireWallet(accountId) → throw InsufficientBalanceError if balance ≤ 0   (COARSE GATE — no reservation)
  ├─ loadOrStartConversation()  → Conversation.start() or ConversationRepositoryPort.findById()
  ├─ hasMessage(userMessageId)? → throw DuplicateMessageError if already used   (IDEMPOTENCY GUARD)
  ├─ persist user Message           (ConversationRepositoryPort.appendMessages)
  │
  ├─ ChatCompletionPort.complete(messages)
  │     └─ FallbackChatCompletionAdapter → ProviderRegistryAdapter.getFallbackChain()
  │           └─ FallbackChain tries each CircuitBreaker(AiProvider) in priority order
  │                 └─ OpenAiCompatibleAdapter.chat() [real fetch call]  OR  StubAdapter.chat() [deterministic echo]
  │     (if ALL providers fail → AllProvidersUnavailableError propagates, NO debit occurs, NO usage event recorded)
  │
  ├─ persist assistant Message
  ├─ ProviderCostSourcePort.getCostRates(providerId)
  ├─ calculateCostMinorUnits(usage, rates)             [pure function, integer math, ceiling rounding]
  ├─ PricingEnginePort.calculatePrice(cost, ...)         → PricingPipeline: BaseMarkupRule → FloorRule
  ├─ Wallet.debit(price) + WalletRepositoryPort.appendLedgerEntries()   [NEVER blocks — call already happened]
  └─ UsageEventRepositoryPort.record(usageEvent)
  ▼
Response: {conversationId, message, providerId, usage?, costMinorUnits, priceMinorUnits, walletBalanceMinorUnits}
```

**Never live-verified against a real vendor** — every step above is proven only by unit tests against in-memory port fakes and an injected-`fetch` double for the vendor call itself.

## Wallet lifecycle

```
CreditWalletUseCase.execute()          → Wallet.open() if none exists, Wallet.credit(amount)
ReserveFundsUseCase.execute()          → Wallet.reserve(amount) → throws InsufficientBalanceError if it would go negative
SettleReservationUseCase.execute()     → Wallet.settle(reserved, actual) → releaseReservation() + debit(actual), never blocks
RollbackReservationUseCase.execute()   → Wallet.rollback(amount) → full release, no charge
(Chat's own path)                      → Wallet.debit(amount) directly, no prior reservation, never blocks

Every mutating operation → WalletRepositoryPort.appendLedgerEntries(walletId, entries, newBalance)
  → real repo: one Postgres transaction, catches unique-constraint violation on (walletId, referenceId, type)
    as a safe idempotent no-op, returns the ACTUAL persisted balance (never a possibly-double-counted
    in-memory value) — this exact distinction was a real bug found and fixed during development.
```

Only `GET /v1/wallet` (via `GetWalletBalanceUseCase`) is reachable over HTTP; every mutating use case above is real, DI-wired, and callable only from other server-side code (`SendChatMessageUseCase` is the only current caller of `Wallet.debit()`; nothing currently calls `CreditWalletUseCase` outside of tests, since no payment/funding HTTP endpoint exists).

## Pricing lifecycle

```
PricingEnginePort.calculatePrice({accountId, providerId, costMinorUnits, currency, requestedAt})
  ▼
RuleBasedPricingEngineAdapter.calculatePrice()
  ▼
loadConfig()  →  builds a fresh PricingPipeline every call (cheap to re-read; avoids caching a
                  stale multiplier across a config change without a restart)
  ▼
PricingPipeline.run(cost, context)
  ├─ BaseMarkupRule.apply()   → price = ceil(cost × markupBasisPoints / 10000), always fires
  └─ FloorRule.apply()         → price = max(price, configuredFloor), fires only if it changes the price
  ▼
{priceMinorUnits, appliedRules: string[]}   (appliedRules feeds the audit trail / customer receipt)
```

No campaign/discount rule exists — the pipeline is exactly two steps. Only ever invoked by `SendChatMessageUseCase`; no HTTP endpoint calls it directly.

## Provider lifecycle

```
Application boot
  ▼
ProviderRegistryAdapter.onModuleInit()          [runs ONCE — no runtime refresh mechanism]
  ▼
loadEnabledProviderConfigs()
  ├─ prisma.aiProviderConfig.findMany({isEnabled: true}, orderBy priority)
  │     on DB failure → falls back to bootstrap defaults (stub-primary, stub-secondary), logs a warning
  ▼
for each config row:
  buildAdapter(row)
    ├─ if baseUrl+model+apiKeyEnvVar all set AND process.env[apiKeyEnvVar] has a value
    │     → new OpenAiCompatibleAdapter(...)     [real fetch-based HTTP adapter]
    └─ else
          → new StubAdapter(providerId)          [deterministic echo, no network]
  ▼
registry.register(new CircuitBreaker(adapter))    [3-failure threshold, 30s cooldown]
  ▼
fallbackChain = new FallbackChain(registry.list())   [priority order = AiProviderConfig.priority]

Per-request (via ChatCompletionPort / GetSystemHealthUseCase):
  fallbackChain.chat(request) → tries each CircuitBreaker-wrapped provider in order,
                                  only throws AllProvidersUnavailableError if every one fails
  registry health check       → cached 5s (ProviderRegistryAdapter's own health cache)
```

**Real, current gap:** the "per-request" section above never re-reads `AiProviderConfig` — a database row change (disable a provider, reorder priority, rotate cost rates) has no effect until the process restarts, contradicting `docs/architecture/ai-provider-layer.md`'s "operational action, not a deploy" claim.

## Memory lifecycle

**Not implemented.** No design document, no code, no schema, no port, no use case exists anywhere in this codebase for any concept of conversational memory, embeddings, summarization, or long-term recall beyond the literal message history already stored per-`Conversation` (which is a complete transcript, not a memory abstraction — `GetConversationUseCase` returns every message verbatim, with no summarization, retrieval, or relevance ranking of any kind). There is nothing to diagram here honestly beyond stating that it does not exist.
