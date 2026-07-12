# Backend Architecture — `apps/api`

See ADR-0003 for why NestJS + hexagonal layering was chosen. This document covers the concrete layout and rules.

## Layers

```
apps/api/src/
├── domain/            # entities, value objects, domain services, domain events. No framework imports.
├── application/        # use cases + ports (interfaces) that infrastructure implements
│   ├── ports/           # e.g. AiProviderPort, UserRepositoryPort — interfaces only
│   └── use-cases/       # one class per use case, orchestrates domain + ports
├── infrastructure/      # adapters implementing application/ports
│   ├── persistence/      # repositories (Prisma-backed), implements *RepositoryPort
│   ├── providers/        # AI provider adapters — the ONLY place vendor AI SDKs may be imported
│   └── external/         # any other third-party integration adapter
├── interfaces/          # inbound: HTTP controllers, GraphQL resolvers (future), CLI (future)
│   └── http/
│       ├── controllers/
│       └── dto/          # request/response DTOs, decorated for OpenAPI (@nestjs/swagger)
└── main.ts              # Nest bootstrap
```

## Dependency rule

- `domain` → nothing in this repo.
- `application` → `domain` only (plus its own `ports/` interfaces).
- `infrastructure` → implements `application/ports`; may depend on `domain` types and external SDKs.
- `interfaces` → `application` use cases only; never imports `infrastructure` directly (Nest's DI wires the concrete adapter at module-registration time).

A use case never `new`s a concrete repository or provider — it receives a port via constructor injection, bound to a concrete implementation in the owning Nest module's `providers` array. This is what makes providers hot-swappable in practice: swapping an adapter is a one-line change to a module's provider binding.

## Module boundaries

Each bounded context (see `domain-boundaries.md`) gets its own Nest module (`*.module.ts`) that:
1. Declares its own controllers, use cases, and adapter bindings.
2. Exports only what other modules genuinely need (a port interface or a facade use case) — never exports a repository or adapter directly.

## Example (illustrative, present in the scaffold)

`HealthModule` — the one fully-wired vertical slice in this milestone, demonstrating the pattern end to end:
- `interfaces/http/controllers/health.controller.ts` → calls `application/use-cases/get-system-health.use-case.ts`
- The use case depends on an `AiProviderPort` (from `packages/ai-provider-sdk`) to report provider registry health, and a `ClockPort` (trivial example port) — both bound to real implementations in `infrastructure/`.

## Error handling

Use cases throw domain-specific error classes (defined in `domain/errors/`); a global Nest exception filter (`interfaces/http/filters/domain-error.filter.ts`) maps them to the HTTP error shape defined in `api-architecture.md`. Controllers never catch and re-throw generic errors.

## Follow-up work (not this milestone)

- ESLint import-boundary rule enforcing the dependency rule automatically (currently a documented convention, not machine-enforced).
- Real bounded-context modules beyond `HealthModule` (auth, conversation, billing) once business logic starts.
