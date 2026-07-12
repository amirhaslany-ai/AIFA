# 02 — Architecture Map

Every layer that exists in `apps/api` (the only application with real architectural layering — `apps/web` is a flat Next.js App Router tree with no internal architecture worth mapping, since it has no product code). Layer boundaries are enforced by `eslint.config.mjs`'s `no-restricted-imports` rules, verified to reject a deliberately-introduced violation when it was added.

## Layer: `domain/`

**Purpose:** Business rules and invariants, expressed with zero framework dependency.

**Responsibilities:**
- Entities/aggregates: `Account`, `Wallet`, `Conversation` (owns `Message`), `UsageEvent`.
- Value objects: `Email`, `Money`, `LedgerEntryDraft`.
- Domain errors: one class per business rule violation, all extending `DomainError` (`account-already-exists`, `invalid-credentials`, `invalid-refresh-token`, `insufficient-balance`, `wallet-not-found`, `conversation-not-found`, `duplicate-message`).
- Pricing rule objects: `PricingRule` interface, `BaseMarkupRule`, `FloorRule`, `PricingPipeline`.

**Dependencies allowed:** nothing outside `domain/` itself (other domain files only).

**Forbidden dependencies (machine-enforced):** `@nestjs/*` (no framework), `application/**`, `infrastructure/**`, `interfaces/**`, and vendor AI SDKs (`openai`, `@anthropic-ai/*`, `@google/generative-ai`, `@google-cloud/*`).

**Important design decisions:**
- `Wallet` is the aggregate root for Billing; `LedgerEntry` is a value object owned by it, never independently persisted/queried (ADR-0008).
- `Conversation` is the aggregate root for the chat bounded context; `Message` is a child entity, never existing outside its parent (docs/architecture/ddd-tactical-design.md).
- `UsageEvent` is a standalone, append-only fact record — deliberately **not** owned by any other aggregate, because "list my usage history" isn't a read any other aggregate's repository naturally exposes (ADR-0015).
- Money is always an integer `bigint` of minor currency units, never a float, everywhere in the codebase (ledger, pricing, cost, usage).

## Layer: `application/`

**Purpose:** Orchestrates one user-facing operation per use case; contains no business rules itself (those live in `domain/`).

**Responsibilities:**
- `use-cases/`: one class per operation (`RegisterAccountUseCase`, `LoginUseCase`, `RefreshSessionUseCase`, `LogoutUseCase`, `CreditWalletUseCase`, `ReserveFundsUseCase`, `SettleReservationUseCase`, `RollbackReservationUseCase`, `GetWalletBalanceUseCase`, `GetSystemHealthUseCase`, `SendChatMessageUseCase`, `GetConversationUseCase`, `ListUsageEventsUseCase`).
- `ports/`: one interface per external dependency a use case needs (13 ports total — repositories, `ClockPort`, `PasswordHasherPort`, `TokenIssuerPort`, `AuthGuardPort`, `PricingEnginePort`, `ChatCompletionPort`, `ProviderCostSourcePort`, `ProviderHealthSourcePort`, `DependencyHealthSourcePort`).
- `services/session-issuer.service.ts`: the one shared cross-use-case service (register/login/refresh all issue a session identically).

**Dependencies allowed:** `domain/`, its own `ports/` (interfaces only).

**Forbidden dependencies (machine-enforced):** `infrastructure/**` (must go through a port, never a concrete adapter import), `interfaces/**`, vendor AI SDKs.

**Important design decisions:**
- `SendChatMessageUseCase` is the one use case that composes ports from five different modules (Conversation, Wallet, Pricing, Provider Access via `ChatCompletionPort`, Usage Tracking) in a single request — see `docs/adr/0014-chat-orchestration.md`. This is the most architecturally significant file in the codebase; a reviewer should read it first among the use cases.
- No `DebitWalletUseCase` exists as a standalone class — `SendChatMessageUseCase` composes `WalletRepositoryPort` and `Wallet.debit()` directly, deliberately, to avoid a wrapper use case with exactly one caller (a documented "don't add abstraction beyond what's needed" choice, not an oversight).
- Idempotency for Chat is "check first" (`ConversationRepositoryPort.hasMessage()` before any provider call or debit), mirroring the pre-existing pattern `ReserveFundsUseCase` already used for its own blocking precondition.

## Layer: `infrastructure/`

**Purpose:** Concrete implementations of `application/ports/*` — the only place real I/O (database, HTTP calls to vendors, cryptography, clock) happens.

**Responsibilities:**
- `persistence/`: `PrismaAccountRepository`, `PrismaRefreshTokenRepository`, `PrismaWalletRepository`, `PrismaConversationRepository`, `PrismaUsageEventRepository`.
- `identity/`: `Argon2PasswordHasherAdapter`, `JwtTokenIssuerAdapter`, `JwtAuthGuardAdapter`, `JwtKeyProvider` (shared Ed25519 keypair, ephemeral-with-warning if env vars unset).
- `providers/`: `ProviderRegistryAdapter` (registry bootstrap + circuit-breaker/fallback-chain wiring + cost-rate lookup), `OpenAiCompatibleAdapter` (the one real vendor HTTP adapter), `FallbackChatCompletionAdapter` (wraps the registry's fallback chain behind `ChatCompletionPort`).
- `pricing/`: `RuleBasedPricingEngineAdapter`.
- `health/`: `PrismaHealthIndicator`, `RedisHealthIndicator` (both real, using `@nestjs/terminus`'s base class directly), `DependencyHealthAdapter`.
- `clock/`: `SystemClockAdapter` (wraps `Date.now()`/`new Date()` behind a port so tests can inject a fixed clock).

**Dependencies allowed:** `domain/`, `application/ports/` (to implement them), `@aifa/database`, `@aifa/ai-provider-sdk`, `@aifa/config`.

**Forbidden dependencies (machine-enforced, per-subfolder):** vendor AI SDKs (`openai`, `@anthropic-ai/*`, etc.) are forbidden **everywhere in `infrastructure/` except `infrastructure/providers/`**. In practice, no vendor SDK is used at all anywhere in the codebase — `OpenAiCompatibleAdapter` is built on the platform's own `fetch`, not the `openai` npm package, because the OpenAI-compatible Chat Completions format is a documented HTTP contract, not something requiring a vendor SDK dependency.

**Important design decisions:**
- `ProviderRegistryAdapter.onModuleInit()` reads `AiProviderConfig` **once, at application boot**. There is no mechanism to re-read it at runtime. This directly contradicts `docs/architecture/ai-provider-layer.md`'s claim that "disabling a failing provider or reordering fallback priority is an operational action, not a deploy" — **as currently implemented, it requires a process restart.** This is a real, current doc/implementation inconsistency — see `06_TECHNICAL_DEBT.md`.
- A database outage at boot degrades to a hardcoded bootstrap default provider set (`stub-primary`, `stub-secondary`) rather than crashing — deliberate, tested.
- `DependencyHealthAdapter.checkAll()` performs a **live** `SELECT 1` against Postgres and a live Redis `ping()` on **every single call**, with **no caching** — unlike `ProviderRegistryAdapter`'s health check, which has a 5-second cache. This is an inconsistency within the codebase itself (one health source is cached, the sibling one isn't) and a live performance/cost concern if `/v1/health/ready` is polled frequently by an orchestrator — see `09_PERFORMANCE_REVIEW.md`.

## Layer: `interfaces/http/`

**Purpose:** The only layer allowed to know about HTTP — controllers, DTOs, guards, filters, middleware.

**Responsibilities:**
- `controllers/`: `AuthController`, `WalletController`, `HealthController`, `ChatController`, `UsageController`.
- `dto/`: request/response shapes with `class-validator` decorators; every response DTO serializes `bigint` fields to strings (JSON has no native bigint).
- `guards/jwt-auth.guard.ts`: the one auth guard, verifying a Bearer token via `AuthGuardPort`.
- `filters/domain-error.filter.ts`: the single global exception filter mapping every known domain/provider error to an HTTP status + stable error code; anything unrecognized becomes a generic sanitized 500 (never leaks a stack trace).
- `middleware/request-id.middleware.ts`: attaches/propagates a request id for log correlation.

**Dependencies allowed:** `application/` (use cases and their DTOs/results), never `infrastructure/` directly.

**Forbidden dependencies (machine-enforced):** `infrastructure/**`, vendor AI SDKs.

**Important design decisions:**
- `WalletController` deliberately exposes **only** `GET /v1/wallet` — credit/reserve/settle/rollback are real, DI-wired, and callable internally (by `SendChatMessageUseCase`) but have no HTTP endpoint, because exposing them to any authenticated caller today would let an account credit itself arbitrary funds (a real vulnerability, not a missing feature — see the doc comment on `wallet.controller.ts`).
- `Swagger`/OpenAPI docs are served at `/v1/docs` with **no authentication guard** — see `08_SECURITY_REVIEW.md`.

## Cross-cutting: `packages/*`

| Package | Purpose | Consumed by | Forbidden dependents |
|---|---|---|---|
| `@aifa/types` | Shared DTO/interface shapes (`ChatMessage`, `ChatRequest`, `SystemHealth`, `ProviderHealth`, etc.) | Every app and package | Must not import from any app or from `@aifa/database` |
| `@aifa/config` | Zod schema + `loadConfig()`, fails fast on invalid/missing env vars | `apps/api`, `apps/web` (declared dependency, minimally used — see `06_TECHNICAL_DEBT.md`) | Must not import `@nestjs/*` or any app code |
| `@aifa/logger` | Pino wrapper (`createLogger`) | `apps/api` (used); `apps/web` (declared dependency, unused in route code) | Same as above |
| `@aifa/ai-provider-sdk` | `AiProvider` interface, `ProviderRegistry`, `CircuitBreaker`, `FallbackChain`, `StubAdapter`, `calculateCostMinorUnits` | `apps/api`'s `infrastructure/providers/` exclusively | Must never import a vendor AI SDK itself |
| `@aifa/database` | Prisma schema, migrations, re-exported generated client, `isUniqueConstraintViolation()` | Only `apps/api/src/infrastructure/persistence/*` and `infrastructure/providers/*` (for `AiProviderConfig` reads) — this rule is **documented, not machine-enforced by ESLint** (no boundary rule currently restricts `@aifa/database` imports the way vendor-SDK imports are restricted) | No other module should import it, but nothing currently stops a violation |

**Note on package-level enforcement:** the ESLint import-boundary rule enforces the domain/application/infrastructure/interfaces hexagonal layering and the vendor-SDK restriction. It does **not** enforce "`@aifa/database` may only be imported from `infrastructure/persistence/`" — that rule exists only in `docs/architecture/package-boundaries.md` prose. A reviewer should treat this as an open gap, not an oversight that was fixed.

## Layer: `apps/web`

**Purpose (as designed, per ADRs):** the product frontend.

**Purpose (as it actually exists):** a placeholder. Three files: a marketing landing page (static text), a dashboard page (static text), and a health-check proxy API route. No authentication UI, no chat UI, no wallet/usage UI, no data fetching from any of the six real backend endpoints beyond the health proxy. See `03_IMPLEMENTATION_STATUS.md`.
