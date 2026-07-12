# Domain Boundaries

Bounded contexts identified for the aggregator platform, per DDD. Only the first is scaffolded this milestone (`HealthModule`, as an architectural example) — the rest are named and scoped now so future work has an agreed home, per the mission's "produce the architecture those systems will use" instruction.

| Context | Owns | Status |
|---|---|---|
| **Platform/System** | Health checks, system-level config, cross-cutting concerns | Scaffolded (`HealthModule`) |
| **Identity** | Accounts, authentication, sessions | Implemented (`identity.module.ts`) — register/login/refresh/logout, real argon2id + Ed25519 JWTs |
| **Provider Access** | AI provider registry, routing, fallback/circuit-breaking, usage metering | Registry/fallback/circuit-breaker implemented (`packages/ai-provider-sdk`); real HTTP adapter implemented (`OpenAiCompatibleAdapter`) and cost layer implemented (`ai-provider-sdk/src/cost.ts`) — no real vendor API key in this sandbox, so verified via injected-fetch unit tests, not a live vendor call; no streaming/capability-matrix/retry-policy yet |
| **Billing** | Wallet, credits, pricing, transactions | Wallet implemented (`wallet.module.ts`) — ledger-based credit/reserve/settle/rollback; Pricing implemented (`pricing.module.ts`) — base markup + floor rule pipeline, no HTTP surface, no campaign/discount rules yet |
| **Conversation** | Chat sessions, message history, model-selection-per-conversation | Implemented (`chat.module.ts`) — `Conversation`/`Message` aggregate, `SendChatMessageUseCase` ties Identity + Provider Access + Pricing + Wallet + Usage Tracking together per request (docs/adr/0014-chat-orchestration.md); no model-selection-per-conversation yet (the client can't request a specific provider, only the fallback chain's priority order) |
| **Usage Tracking** | Per-call usage events (tokens, cost, price, provider), queryable history | Implemented (`usage.module.ts`) — `UsageEvent` recorded by `SendChatMessageUseCase` after each billed exchange, `GET /v1/usage` read endpoint (docs/adr/0015-usage-tracking.md) |

## Rules

- A bounded context = one Nest module + (eventually) its own database tables, owned exclusively by that module's repositories. No other module queries another context's tables directly — it calls an exported use case or port.
- Cross-context communication happens through application-layer ports (e.g., Conversation depends on an `AiProviderPort` from Provider Access, not on Provider Access's internal classes) or, later, domain events if contexts need to stay decoupled across process boundaries.
- New contexts are added to this table before their first line of code is written, so boundaries are agreed, not discovered after the fact.

## Why this order (dependency-driven, not arbitrary)

Provider Access has no dependency on Identity and can be built/tested standalone (as done this milestone). Conversation needs both Identity (whose conversation is it) and Provider Access (which model answers it) — it is necessarily the last context to become real. Billing depends on Identity (whose wallet) and typically on Conversation/Provider Access (usage-based metering) — also necessarily late. This ordering is a consequence of the dependency graph, not a priority judgment about business value.
