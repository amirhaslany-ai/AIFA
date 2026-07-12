# API Standards

Companion to `api-architecture.md` (versioning, error shape, health, rate-limiting seam). This document covers the conventions `api-architecture.md` referenced but didn't detail.

## Endpoint naming

- Plural nouns for collections: `/v1/conversations`, not `/v1/conversation`.
- Nesting reflects ownership, capped at one level: `/v1/conversations/{id}/messages`, never a third level (`/v1/conversations/{id}/messages/{id}/reactions` → promote `reactions` to its own top-level resource referencing both ids in the body/query instead).
- Actions that don't fit CRUD are verbs under the resource, not new HTTP methods: `POST /v1/conversations/{id}/archive`, not `PATCH` with a magic body field.
- No trailing slashes; lowercase, hyphen-separated multi-word segments (`/v1/provider-configs`, not `/v1/providerConfigs` or `/v1/provider_configs`).

## Pagination

Cursor-based (restated from `api-architecture.md`, detailed here):

```
GET /v1/conversations?limit=20&cursor=eyJpZCI6...
```

Response envelope:
```json
{
  "data": [ /* items */ ],
  "pagination": {
    "nextCursor": "eyJpZCI6..." ,
    "hasMore": true
  }
}
```

The cursor is an opaque, base64-encoded pointer (implementation detail: last-seen id + sort key), not a page number — offset pagination is not used anywhere in this API, since it produces skipped/duplicated rows under concurrent writes, which a multi-user chat/billing product will have from day one.

## Filtering and sorting

- Filtering: query params named after the field (`?status=active`), combined with implicit AND. No query language (no `filter[status][eq]=active` style) unless a real consumer need justifies the added complexity — not guessed here.
- Sorting: `?sort=createdAt` (ascending default), `?sort=-createdAt` (descending, leading hyphen) — one sort key at a time until a real multi-key-sort need appears.

## Authentication flow design (seam only — no identity provider implemented)

Target flow, to be implemented when Identity (see `domain-boundaries.md`) is built:

```
Client → POST /v1/auth/session (credentials or OAuth callback)
       ← { accessToken (JWT, short-lived), refreshToken (opaque, long-lived, httpOnly cookie) }

Client → GET /v1/conversations
         Authorization: Bearer <accessToken>
       → NestJS AuthGuard validates JWT signature + expiry (see security-architecture.md)
       → request.user populated from JWT claims
       → controller/use case proceeds
```

The `application/ports/auth-guard.port.ts` seam (already present in `apps/api`) is where this guard's interface lives; the concrete implementation (JWT verification, refresh rotation) is deferred — see `security-architecture.md`'s JWT/session strategy for the token design this flow assumes.

## Authorization flow design (seam only)

Role/permission model is not decided (no real user roles exist yet — flagged rather than guessed). Target shape: a `PermissionPort` checked inside each use case (not in the controller, so authorization logic isn't bypassable by adding a new controller that forgets the check) — `use case → PermissionPort.can(account, action, resource) → throw ForbiddenError | proceed`. Resource-level (e.g. "can this account access this specific conversation") vs. role-level (e.g. "is this account an admin") authorization are both expected to be needed; which comes first depends on which bounded context ships first (Conversation likely needs resource-level ownership checks before any admin/role concept exists).

## OpenAPI strategy

- Generated from `@nestjs/swagger` decorators (already wired in `apps/api/src/main.ts`), never hand-written — restated from ADR-0006 because it's the single most important rule for keeping the contract honest.
- Every new DTO needs `@ApiProperty` on every field, including a `description` when the field name doesn't fully self-document (e.g. `@ApiProperty({ description: 'Opaque cursor from a previous page response' })`).
- The generated spec should be exported as a build artifact (`pnpm --filter api build` → future step: dump `SwaggerModule.createDocument()`'s output to `openapi.json`) once there's a real consumer (e.g. a generated TS client for `apps/web`, or a public API docs site) — not built yet since there's no consumer to serve it to.

## Error standards (detail beyond `api-architecture.md`'s shape)

Machine-readable `code` values are namespaced by concern once more than a handful exist, to avoid collisions across bounded contexts: `AUTH_*`, `PROVIDER_*`, `BILLING_*`, `VALIDATION_*`. Current codes in use: `PROVIDER_UNAVAILABLE`, `INTERNAL_ERROR`, plus whatever `HttpException` subclass name Nest's built-ins map to (e.g. `NOT_FOUND`). A registry of all codes (a single source-of-truth enum or doc table) should be created once more than ~10 exist — premature at 3.
