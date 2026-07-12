# 07 — Code Quality

An honest, category-by-category evaluation. No scores here (see `03_ARCHITECTURE_SCORECARD.md` at the repository root for the pre-Sprint-1 numeric scorecard — it is stale for "current state" but its scoring *methodology* is still a reasonable reference); this document is qualitative and specific.

## Architecture

Sound. The hexagonal layering (`domain → application → infrastructure/interfaces`) is not just documented — it's machine-enforced via ESLint and has now been proven across six real bounded contexts, not one toy example. `SendChatMessageUseCase` is the architecture's real stress test: it composes five different ports in one orchestration and the dependency direction never breaks (it depends only on its own ports, never on a concrete adapter or another module's internals). The one architectural gap that matters: `AiProviderConfig`'s "config-driven, not code-driven" claim is only true at boot, not at runtime (see `06_TECHNICAL_DEBT.md` item 8) — a real, current inconsistency between design intent and implementation.

## Maintainability

Good, with one caveat. Within `apps/api`, the codebase is highly maintainable: consistent naming, one class per responsibility, doc comments that explain *why* (a hidden constraint or a bug that was found) rather than restating *what* the code does. The caveat is external: the root-level pre-Sprint-1 audit documents are now stale and, if not removed or clearly superseded, actively harm maintainability for the next person who reads them first (see `06_TECHNICAL_DEBT.md` item 18).

## Coupling

Low, deliberately. Every cross-bounded-context dependency goes through a port interface, never a concrete class. Cross-aggregate references are always by id (`accountId`, `conversationId` as plain string fields, never a live object reference or a Prisma `@relation`) — verified consistently across `Wallet`, `Conversation`, and `UsageEvent`. The one place coupling is looser than ideal: NestJS module wiring occasionally requires exporting a concrete class (not just its port token) for cross-module DI to resolve correctly (`ProviderRegistryAdapter` exported from `HealthModule` so `ChatModule`'s adapter can call `getFallbackChain()`) — a real NestJS DI constraint, not a design choice, and it's the one place a consuming module knows a concrete infrastructure class exists, even though it never imports its file directly (Nest resolves it via DI, not an import statement).

## Cohesion

High. Each use case does exactly one thing (`CreditWalletUseCase` doesn't know about reservations; `GetConversationUseCase` doesn't know about sending messages). The exception, correctly reasoned in code comments: `SendChatMessageUseCase` is intentionally NOT split further, because Chat's entire value is the orchestration itself — splitting it into five single-purpose use cases and a sixth "orchestrator" use case that calls all five would be more files with the same total complexity, not less.

## Readability

High. Names are unambiguous (`ReserveFundsUseCase`, not `WalletService.doReserve`), and error classes are named after the business rule they represent, not their HTTP status. Comments are used sparingly and only where the *why* isn't obvious from the code (e.g. `Wallet.debit()`'s comment explaining it never blocks because "the call already happened"). No dead code was found anywhere in the codebase.

## Testing

This is the weakest category. Unit-level testing discipline is genuinely strong — every domain class and every use case has a spec file, several with explicit "REGRESSION GUARD" tests documenting a real bug that was found and fixed (e.g. the wallet balance double-counting bug, the idempotency race in `ReserveFundsUseCase`). But the entire test suite (~104 tests) has never touched a real database, a real Redis instance, a real HTTP server, or a real browser. Coverage percentage is unknown (no coverage tool configured). See `06_TECHNICAL_DEBT.md` items 1 and 4.

## Dependency management

Clean. pnpm's strict `node_modules` prevents phantom dependencies. No circular package dependencies exist (verified implicitly — `turbo prune` succeeds cleanly for both apps, which requires an acyclic graph). Every workspace package has a real `package.json` with an accurate `dependencies`/`devDependencies` split. The one soft issue: `apps/web` declares `@aifa/config`/`@aifa/logger` but doesn't use either in real route code yet (`06_TECHNICAL_DEBT.md` item 20) — low-severity but a real, verifiable "declared but unused" gap.

## DDD (Domain-Driven Design)

Consistently applied, per ADR-0013's stated tactical vocabulary. Every bounded context that has real invariants uses the same shape: an aggregate root (private constructor, static factory methods `open`/`start`/`reconstitute`), value objects (`Money`, `Email`), and one repository per aggregate root (never per table — `LedgerEntry` and `Message` are never independently queried, only through `Wallet`/`Conversation`). `HealthModule` correctly has no aggregate at all — the codebase resisted the temptation to force DDD ceremony where it isn't needed.

## Hexagonal Architecture (Ports & Adapters)

Real, not aspirational. Every port has exactly one production implementation and, where a port is exercised by application-layer tests, an in-memory test-double implementation that mirrors the real adapter's edge-case behavior (e.g. `InMemoryWalletRepository`'s doc comment explains two specific bugs a naive fake would have missed, because those bugs were actually found this way). The ESLint boundary rule is the mechanism that keeps this real rather than a convention that erodes — it was verified to reject a deliberately-introduced violation, not just written and assumed to work.

## SOLID

- **Single Responsibility:** strong — see Cohesion above.
- **Open/Closed:** strong in the provider/pricing layers — a new `AiProvider` implementation or a new `PricingRule` can be added without modifying `FallbackChain`/`PricingPipeline`. Weaker in `SendChatMessageUseCase`, which would need direct modification to add a seventh collaborator — an accepted tradeoff for a use case whose entire job is orchestration (see Cohesion).
- **Liskov Substitution:** holds — every `AiProvider` implementation (`StubAdapter`, `OpenAiCompatibleAdapter`, `CircuitBreaker`-wrapped versions of both) is interchangeable through the same interface, verified by the fact that `FallbackChain` and `ProviderRegistry` never branch on concrete type.
- **Interface Segregation:** strong — ports are narrow (`ProviderCostSourcePort` has exactly one method; `ChatCompletionPort` has exactly one method), not fat multi-purpose interfaces.
- **Dependency Inversion:** the architecture's whole point, and it holds — `application/` never imports a concrete `infrastructure/` class.

## DRY (Don't Repeat Yourself)

Mostly good, with one known, accepted exception (dotenv loading duplicated in two entrypoints — `06_TECHNICAL_DEBT.md` item 19) and one structural near-duplication that is arguably correct: every `*RepositoryPort`'s in-memory test double reimplements idempotency/dedup logic that also exists in the real Prisma adapter. This isn't accidental duplication — the test double exists specifically to prove the same behavioral contract two different ways, and a change to one without checking the other would be caught by their respective tests diverging, not silently drift.

## KISS (Keep It Simple)

Consistently favored over cleverness. The most notable KISS decision in the entire codebase: Chat's cost/price flow does **not** attempt to solve pre-call cost estimation by inventing a token-count guess — it takes the simpler, more honest path of a coarse balance gate plus a real debit after the fact (ADR-0014), explicitly rejecting the "more complete-looking" reserve/settle flow because it would require fabricating data. This is the single clearest piece of evidence in the codebase that the project's stated "no fake data" discipline is a real practice, not a slogan.
