# @aifa/types

Shared TypeScript types and DTOs with zero runtime logic — no I/O, no framework imports, no business rules. If a type is used across `apps/api` and `apps/web`, or across two `packages/*`, it lives here so both sides of a boundary agree on its shape without one importing the other's implementation.

## What belongs here

- Shared request/response DTO shapes (kept in sync with `apps/api`'s OpenAPI-decorated DTOs, which extend or mirror these).
- Cross-cutting value types (e.g. `ProviderId`, `ChatRole`).

## What does not belong here

- Anything with a method that does real work (that's a domain service or use case, owned by `apps/api`).
- Prisma-generated types (those live in `@aifa/database` and are mapped to these shared types at the repository boundary, not re-exported wholesale).

## Dependencies

None at runtime — this package is pure TypeScript types/interfaces, zero dependencies by design (a types-only package that pulled in a runtime dependency would be a smell).

## Public API

- `ChatMessage`, `ChatRequest`, `ChatResult`, `ProviderId`, `ChatRole`, `ProviderStatus`, `ProviderHealth` (`src/ai-provider.ts`)
- `SystemHealth` (`src/health.ts`)

## Example

```ts
import type { ChatRequest, ChatResult } from '@aifa/types';

function buildRequest(message: string): ChatRequest {
  return { messages: [{ role: 'user', content: message }] };
}
```
