# Domain Boundaries

Bounded contexts identified for the aggregator platform, per DDD. Only the first is scaffolded this milestone (`HealthModule`, as an architectural example) — the rest are named and scoped now so future work has an agreed home, per the mission's "produce the architecture those systems will use" instruction.

| Context | Owns | Status |
|---|---|---|
| **Platform/System** | Health checks, system-level config, cross-cutting concerns | Scaffolded (`HealthModule`) |
| **Identity** | User accounts, authentication, sessions | Named only — no auth implementation this milestone |
| **Provider Access** | AI provider registry, routing, fallback/circuit-breaking, usage metering | Abstraction scaffolded (`packages/ai-provider-sdk`); no real provider calls |
| **Billing** | Wallet, credits, pricing, transactions | Named only — explicitly out of scope this milestone |
| **Conversation** | Chat sessions, message history, model-selection-per-conversation | Named only — depends on Identity + Provider Access existing first |

## Rules

- A bounded context = one Nest module + (eventually) its own database tables, owned exclusively by that module's repositories. No other module queries another context's tables directly — it calls an exported use case or port.
- Cross-context communication happens through application-layer ports (e.g., Conversation depends on an `AiProviderPort` from Provider Access, not on Provider Access's internal classes) or, later, domain events if contexts need to stay decoupled across process boundaries.
- New contexts are added to this table before their first line of code is written, so boundaries are agreed, not discovered after the fact.

## Why this order (dependency-driven, not arbitrary)

Provider Access has no dependency on Identity and can be built/tested standalone (as done this milestone). Conversation needs both Identity (whose conversation is it) and Provider Access (which model answers it) — it is necessarily the last context to become real. Billing depends on Identity (whose wallet) and typically on Conversation/Provider Access (usage-based metering) — also necessarily late. This ordering is a consequence of the dependency graph, not a priority judgment about business value.
