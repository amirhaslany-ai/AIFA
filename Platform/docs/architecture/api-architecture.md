# API Architecture

See ADR-0006 for why REST + OpenAPI. This document covers conventions.

## Versioning

- URL-prefixed: `/v1/...`. A breaking change (removed field, changed semantics, removed endpoint) requires `/v2/...`; additive changes (new optional field, new endpoint) do not bump the version.
- No deprecation-window policy is defined yet (flagged in ADR-0006) — write one before `/v1` has real external consumers.

## Request/response conventions

- All request/response bodies are typed DTOs (`interfaces/http/dto/*.dto.ts`), decorated with `class-validator` (validation) and `@nestjs/swagger` (`@ApiProperty`, documentation) — the two concerns share one class rather than being defined twice.
- Pagination (once list endpoints exist): cursor-based (`?cursor=&limit=`), not offset-based, to stay stable under concurrent writes.

## Error shape

Every non-2xx response returns:

```json
{
  "error": {
    "code": "PROVIDER_UNAVAILABLE",
    "message": "Human-readable message, safe to show a developer consumer",
    "requestId": "uuid, matches the X-Request-Id response header and log correlation id"
  }
}
```

`code` is a stable machine-readable string (upper snake case), sourced from the domain error class thrown in `application`/`domain` and mapped by the global exception filter (`backend-architecture.md`) — never a raw stack trace or ORM error leaked to the client.

## Authentication (boundary only — not implemented)

A `Bearer` token boundary is reserved (`Authorization` header, validated by a Nest guard) but no token issuance, session, or identity provider exists yet. The guard interface (`application/ports/auth-guard.port.ts`) exists as a seam so real auth can be implemented as an adapter without redesigning controllers.

## Health/readiness

`GET /v1/health` — liveness (process is up). `GET /v1/health/ready` — readiness (dependencies — DB, Redis, provider registry — are reachable), backed by `@nestjs/terminus`. Used by Docker healthchecks and, later, orchestrator readiness probes.

## Rate limiting

Not implemented this milestone. Reserved seam: a Nest guard/interceptor reading limits from `packages/config`, backed by Redis counters — documented here so the eventual implementation has a clear, single intended location (`infrastructure/rate-limit/`) instead of being bolted on ad hoc.
