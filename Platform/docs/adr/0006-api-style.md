# ADR-0006: REST + OpenAPI as the primary API contract

**Status:** Accepted
**Date:** 2026-07-12

## Context

`apps/api` needs a stable, documentable contract consumable by `apps/web` and, eventually, third-party integrators (the aggregator platform's differentiator is being usable like an API product, comparable to OpenRouter).

## Decision

- REST over HTTP as the primary interface, versioned by URL prefix (`/v1/...`).
- OpenAPI 3.1 schema generated from NestJS decorators (`@nestjs/swagger`), published at `/v1/docs` and as a build artifact — the schema is the contract, hand-written docs reference it rather than duplicate it.
- GraphQL and/or tRPC are not ruled out but are additional `interfaces/` adapters to add later if a concrete consumer need justifies them (per ADR-0003, they'd sit beside the REST controllers without touching `application`/`domain`).

## Rationale

- REST/OpenAPI is the lowest-friction choice for third-party API consumers, which is the platform's stated long-term differentiator — a GraphQL-only or tRPC-only API would work for the first-party web client but raise the bar for external integrators.
- Auto-generated OpenAPI from code annotations prevents contract/implementation drift, which hand-maintained API docs are prone to.

## Consequences

- Every controller method needs `@nestjs/swagger` decorators (`@ApiOperation`, `@ApiResponse`, DTO classes with `@ApiProperty`) as part of "done," not an afterthought — captured in `Platform/docs/architecture/api-architecture.md`.
- Breaking changes require a new version prefix (`/v2/...`); this repo does not yet define a deprecation-window policy for old versions — flagged as a follow-up decision once the platform has real external consumers.
