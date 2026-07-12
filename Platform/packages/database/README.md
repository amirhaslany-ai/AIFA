# @aifa/database

Prisma schema, migrations, and a re-exported generated client. See `docs/architecture/database-architecture.md` for the full ownership/consumption rules — in short: only `apps/api/src/infrastructure/persistence/*` may import from this package; no use case or controller talks to Prisma directly.

## Schema

See `prisma/schema.prisma`:
- `Account` — Identity bounded context's aggregate root (`email`, `passwordHash`). Named `Account`, not `User` (see `docs/architecture/ddd-tactical-design.md`).
- `RefreshToken` — opaque, hashed, rotation-tracked refresh-token records (`tokenHash`, `familyId`, `revokedAt`, `replacedBy`) backing `docs/adr/0010-auth-token-strategy.md`.
- `AiProviderConfig` — runtime configuration for `ProviderRegistry` (which providers are enabled, fallback priority, and — since Sprint 1 — `baseUrl`/`model`/`apiKeyEnvVar` for a real adapter plus `costPerInputTokenMicros`/`costPerOutputTokenMicros` for the cost layer), read by `apps/api`'s `ProviderRegistryAdapter` on boot (`onModuleInit`). If the table has no enabled rows (or the database is unreachable), the adapter falls back to a small bootstrap-default provider set and logs a warning — it does not crash the app, and it does not silently treat the fallback as a second competing source of truth (see `docs/adr/0005-ai-provider-abstraction.md`). A row missing `baseUrl`/`model`/`apiKeyEnvVar`, or whose named env var is unset, is served by `StubAdapter` instead of a real HTTP call.
- `Wallet` / `LedgerEntry` — Billing bounded context (`docs/adr/0008-wallet-ledger-pattern.md`). The ledger is authoritative; `Wallet.balanceMinorUnits` is a reconcilable cache. Unique on `(walletId, referenceId, type)`.
- `Conversation` / `Message` — Conversation bounded context (`docs/adr/0014-chat-orchestration.md`). `Conversation.accountId` is a plain field (no `@relation`), matching `Wallet`'s cross-aggregate-by-id-only convention; `Message.conversationId` IS a real `@relation`/cascade since a message never exists outside its parent conversation. `Message.sequence` is a separate autoincrement column purely for deterministic ordering — two messages can share an identical `createdAt` millisecond.
- `UsageEvent` — Usage Tracking bounded context (`docs/adr/0015-usage-tracking.md`). One row per billed chat exchange (tokens, cost, price, provider), written once by `SendChatMessageUseCase`, never updated. `accountId`/`conversationId` are plain fields (no `@relation`), same convention as above. `userMessageId` is `@unique` — a defense-in-depth backstop for the idempotency check `SendChatMessageUseCase` already performs before ever reaching this write.

Pricing (`docs/adr/0009-pricing-engine-pattern.md`) is implemented but has no dedicated table — it's a pure computation (`apps/api/src/domain/pricing/`) over a cost figure and config, not persisted state. No `Subscription`/campaign tables yet — those belong to not-yet-implemented Pricing extensions (campaigns/discounts, plan tiers); model from real requirements when that work starts, not guessed here.

## Dependencies

`@prisma/client` (generated client), `@aifa/types`. Dev-only: `prisma` CLI.

## Public API

- `prisma` — the singleton `PrismaClient` instance.
- `PrismaClient` — re-exported class (rarely needed directly; prefer the `prisma` singleton).
- `isUniqueConstraintViolation(error)` — detects a Prisma unique-constraint violation (P2002) without leaking `@prisma/client`'s error types into consumers; used for ledger-entry idempotency.
- `Account`, `RefreshToken`, `AiProviderConfig`, `Wallet`, `LedgerEntry`, `Conversation`, `Message`, `UsageEvent` — re-exported generated model types. `LedgerEntryType`, `MessageRole` — re-exported generated enums.

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
