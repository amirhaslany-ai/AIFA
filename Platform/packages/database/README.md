# @aifa/database

Prisma schema, migrations, and a re-exported generated client. See `docs/architecture/database-architecture.md` for the full ownership/consumption rules — in short: only `apps/api/src/infrastructure/persistence/*` may import from this package; no use case or controller talks to Prisma directly.

## This milestone's schema

Two architecture-defining, non-business-logic tables only — see `prisma/schema.prisma`:
- `User` — placeholder for the future (not-yet-implemented) auth system.
- `AiProviderConfig` — runtime configuration backing `ProviderRegistry` (which providers are enabled, fallback priority), consumed via `apps/api`'s `ProviderRegistryAdapter`.

No `Wallet`/`Transaction`/`Subscription` tables — those belong to the (out-of-scope) billing workstream and should be modeled from real requirements, not guessed here.

## Dependencies

`@prisma/client` (generated client), `@aifa/types`. Dev-only: `prisma` CLI.

## Public API

- `prisma` — the singleton `PrismaClient` instance.
- `PrismaClient` — re-exported class (rarely needed directly; prefer the `prisma` singleton).
- `User`, `AiProviderConfig` — re-exported generated model types.

## Example

```ts
import { prisma } from '@aifa/database';

const config = await prisma.aiProviderConfig.findUnique({ where: { providerId: 'openai' } });
```

## Commands

```bash
pnpm --filter @aifa/database generate      # regenerate the Prisma client after a schema change
pnpm --filter @aifa/database migrate:dev   # create + apply a migration locally
```

Requires `DATABASE_URL` set (see `.env.example` at the `Platform/` root).
