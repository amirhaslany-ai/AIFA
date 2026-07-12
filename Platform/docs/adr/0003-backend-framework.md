# ADR-0003: NestJS for `apps/api`, arranged as Hexagonal/Clean Architecture

**Status:** Accepted
**Date:** 2026-07-12

## Context

`apps/api` is the backend for the AIFA aggregator platform: a multi-model AI product requiring provider-agnostic request routing, auth, billing/wallet, and a stable public API — none of which are implemented yet (out of scope for this foundation milestone), but the architecture must not block them.

## Decision

- **Framework:** NestJS (TypeScript, dependency injection built in, first-party support for REST + GraphQL + microservice transports).
- **Internal layout:** Hexagonal (ports & adapters) mapped onto Nest's module system:
  - `src/domain/` — entities, value objects, domain services. Zero framework imports, zero I/O.
  - `src/application/` — use cases (application services), input/output ports (interfaces) that `domain` and `infrastructure` implement against.
  - `src/infrastructure/` — adapters: database repositories, AI provider clients, external APIs, cache. Implements the ports defined in `application`.
  - `src/interfaces/` — inbound adapters: HTTP controllers, GraphQL resolvers, CLI, message consumers. Depends on `application`, never on `infrastructure` directly.
- Dependency rule: `interfaces` and `infrastructure` depend inward on `application`/`domain`; `domain` depends on nothing in this repo.

## Rationale

- NestJS's DI container is what makes hexagonal boundaries enforceable in practice (swap an adapter by rebinding a provider token) rather than aspirational.
- Official docs (docs.nestjs.com) are extensive; large ecosystem of first-party modules (`@nestjs/config`, `@nestjs/testing`, `@nestjs/terminus` for health checks) reduces custom glue code.
- Matches the mission's required principles (Clean/Hexagonal Architecture, SOLID, DDD, testability) directly rather than requiring a bespoke framework-less structure.

## Alternatives considered

- **Express/Fastify, hand-rolled structure:** more control, more boilerplate, no enforced DI — boundary violations are easy to introduce silently. Rejected for a team-scale, multi-year project.
- **tRPC-first (no REST):** attractive for a single Next.js frontend, but the platform's stated goal (aggregator product, third-party API consumers eventually) needs a framework-agnostic HTTP contract, not one coupled to the TS client. REST/OpenAPI now (ADR-0006), tRPC or GraphQL can be added later as an additional `interfaces` adapter without touching `domain`/`application`.

## Consequences

- Every new backend capability starts as a use case in `application/`, not a controller method with logic inline.
- The AI provider layer (ADR-0005) is consumed by `application/` through a port interface (`packages/ai-provider-sdk`'s `AiProvider` interface) and implemented in `infrastructure/`, so `application` never imports a concrete provider SDK.
