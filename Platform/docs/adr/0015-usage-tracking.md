# ADR-0015: Usage Tracking as an append-only fact record, written by Chat

**Status:** Accepted and implemented (Sprint 1 — `apps/api/src/domain/usage-event.ts`, `apps/api/src/usage.module.ts`)
**Date:** 2026-07-12
**Related:** ADR-0007 (provider cost layer), ADR-0009 (pricing), ADR-0014 (Chat orchestration)

## Context

Every other Sprint 1 bounded context produces a durable record of what happened: Identity has `Account`, Billing has `LedgerEntry`, Conversation has `Message`. `SendChatMessageUseCase` (ADR-0014) already computes real token usage, real cost, and real price for every completed exchange, but nothing previously persisted that computation as its own queryable record — the only place it lived was the ledger's debit entry (an amount, with no token/provider/cost breakdown) and the HTTP response (never seen again after the client received it).

## Decision

A new `UsageEvent` (`apps/api/src/domain/usage-event.ts`) is an append-only fact record: `accountId`, `conversationId`, `userMessageId`, `providerId`, `promptTokens`, `completionTokens`, `costMinorUnits`, `priceMinorUnits`, `currency`, `createdAt`. It is not owned by any other aggregate (unlike `LedgerEntry`, which only exists through `Wallet`) — it gets its own `UsageEventRepositoryPort`/`PrismaUsageEventRepository` for independent querying, since "show me my usage history" is a first-class read, not a side effect of reading Wallet or Conversation.

`SendChatMessageUseCase` records exactly one `UsageEvent` per successful exchange, immediately after the wallet debit succeeds, keyed by the same `userMessageId` its duplicate-messageId check (ADR-0014) already guards — so no separate idempotency mechanism is needed for the event itself; a retry never reaches that line twice for the same exchange. The database enforces this too (`userMessageId` is `@unique`), a defense-in-depth backstop, not the primary guard.

A new read-only endpoint, `GET /v1/usage`, returns the authenticated account's usage history, newest first, with a simple `limit` (default 20, capped at 100) and `before` (ISO timestamp) cursor for pagination.

## Rationale

- Recording after the debit (not before, not in parallel) means a `UsageEvent` only ever exists for an exchange that was actually charged — there's no risk of a usage record existing for a call the account was never billed for, or vice versa where a real charge left no trace.
- No separate `UsageEvent`-level idempotency check was built: `userMessageId`'s uniqueness is already established at the ledger level (`chat-debit-${userMessageId}` reference id) and the duplicate-message check (ADR-0014) fires before either the debit or the usage-record write. Building a second, independent check here would duplicate logic that's already correct one step earlier in the same request, for no additional safety.
- `UsageEvent` has its own repository (unlike `LedgerEntry`) because nothing else naturally exposes "list my usage history" — `WalletRepositoryPort` only reads a single current balance, and `ConversationRepositoryPort` reads one conversation's messages, neither of which is the shape a usage/billing history view needs.

## Alternatives considered

- **Derive usage history from `LedgerEntry` rows instead of a new table:** rejected — `LedgerEntry` intentionally has no `providerId`/token-count fields (`docs/adr/0008-wallet-ledger-pattern.md` keeps the ledger's shape minimal and currency-agnostic of *why* an amount is what it is), so reconstructing per-call token/provider detail from it isn't possible without adding exactly the columns `UsageEvent` already provides — better to have one purpose-built table than overload the ledger's shape.
- **Full cursor-based pagination with opaque tokens:** rejected as over-scoped for this milestone — a `before: Date` keyset cursor is simple, real (not a fake stub), and sufficient for "scroll back through history"; an opaque-token scheme can replace it later without an API-breaking change if genuinely needed.

## Consequences

- `usage_events` has no foreign key to `accounts`/`conversations` (plain `accountId`/`conversationId` fields), matching the cross-aggregate-by-id-only convention already used by `Wallet`/`Conversation`.
- No real vendor API key or live Postgres exists in this codebase's sandbox, so `ListUsageEventsUseCase` and the recording path inside `SendChatMessageUseCase` are verified via in-memory port fakes and a live app boot confirming `UsageModule`/`GET /v1/usage` wire correctly — not a full live HTTP round-trip, the same documented limitation as every other Sprint 1 feature.
