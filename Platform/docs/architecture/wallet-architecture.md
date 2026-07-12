# Wallet Architecture (Implemented — Sprint 1)

**Status:** implemented — `apps/api/src/wallet.module.ts`, `domain/wallet.entity.ts`, `domain/money.ts`. Only `GET /v1/wallet` (balance) is exposed via HTTP; credit/reserve/settle/rollback are real, tested use cases not yet reachable via a public endpoint — see `wallet.controller.ts`'s doc comment for exactly why (exposing them before a payment webhook or Chat exists to call them for real reasons would be a "free money" / bill-your-own-amount vulnerability, not a missing feature).

## Why a ledger, not a balance column

A `Wallet.balance` column that's directly incremented/decremented is the single most common source of billing bugs in real systems: a crashed request between "deduct" and "record what it was for" loses the audit trail, and concurrent writes race. Instead: **the balance is never stored directly — it's derived (sum of `LedgerEntry.amount`) or cached with the ledger as the source of truth.** This is standard double-entry-adjacent accounting practice, not a novel design.

## Core concepts

- **Wallet** (aggregate root): one per `Account`, holds a `currency` and a cached `balance` (an optimization — always reconcilable against the ledger sum; the ledger, not the cache, is authoritative).
- **LedgerEntry** (value object, append-only, owned by `Wallet`): `type` (`credit | debit | reservation | reservation_release | rollback`), `amountMinorUnits` (integer, never a float — avoids floating-point rounding errors in money), `referenceId` (idempotency key — see below), `createdAt`. Never updated or deleted once written.

## Flows

### Credit flow (adding funds — e.g. a purchase, a promotional grant)
```
1. Payment/grant confirmed (external event — payment provider webhook, admin action)
2. Append LedgerEntry { type: credit, amount, referenceId: <payment id> }
3. Update Wallet.balance cache (balance += amount), in the same DB transaction as step 2
```
The `referenceId` is the idempempotency guard: if the same payment webhook fires twice (a documented reality of most payment providers), inserting a `LedgerEntry` with a `referenceId` that already exists is a no-op (unique constraint on `(walletId, referenceId)`), not a double credit.

### Reservation flow (before a metered AI call — hold funds so a second concurrent request can't overspend)
```
1. Use case estimates a call's max cost (from AI Provider Layer's cost estimate, pre-call)
2. Append LedgerEntry { type: reservation, amount: -estimatedCost, referenceId: <request id> }
3. Wallet.balance cache -= estimatedCost
4. If balance would go negative, reject the request BEFORE calling any AI provider (never let an AI call happen that the account can't afford, per "provider failure must not break the application" applied to the financial side too)
```

### Settlement flow (after the AI call completes, replacing the estimate with the real cost)
```
1. AI Provider Layer reports actual usage/cost (may differ from the pre-call estimate)
2. Append LedgerEntry { type: reservation_release, amount: +estimatedCost, referenceId: <request id> }  (releases the hold)
3. Append LedgerEntry { type: debit, amount: -actualCost, referenceId: <request id>-settlement }
4. Wallet.balance cache adjusted by the net difference
```
Steps 2+3 happen in one DB transaction — a partially-settled reservation (released but not debited, or vice versa) is exactly the kind of state a ledger-based design exists to make structurally hard to produce (both writes succeed or neither does).

### Rollback flow (AI call failed entirely — e.g. `AllProvidersUnavailableError`)
```
1. Append LedgerEntry { type: rollback, amount: +estimatedCost, referenceId: <request id> }  (full release, no debit)
2. Wallet.balance cache += estimatedCost
```
The account is never charged for a call that produced no result — this is a product/trust decision (not charging for failures), documented here as the assumed default; flag if the founder wants a partial "attempted call" fee model instead.

## Accounting principles

- **Money is always an integer** (`amountMinorUnits` — cents, or the smallest unit of whatever `currency` is), never a float, to avoid representation error accumulating over many small AI-call charges.
- **Every entry is attributable**: `referenceId` always traces back to a real event (a request id, a payment id) — no `LedgerEntry` exists "just to fix the balance," because that would defeat the entire purpose of the ledger being authoritative. If the cached balance and the ledger sum ever disagree, that's a bug to fix (a reconciliation job, target design), not something to paper over with a manual adjustment entry that itself isn't attributable.
- **No entry is ever mutated or deleted.** A correction is always a new, opposite entry referencing the original (`referenceId` convention: `<original-id>-correction`) — preserves a complete, append-only audit trail.

## Audit trail

The ledger *is* the audit trail — every balance change is reconstructable from `LedgerEntry` rows alone, ordered by `createdAt`, without needing a separate audit-log table. This is why `LedgerEntry` is modeled as a value object owned by the `Wallet` aggregate rather than a freestanding entity with its own repository: it should never be queried, updated, or deleted independently of its wallet's history.

## What this document deliberately does not decide

- Currency support (single currency vs. multi-currency wallets) — flagged as open, since Content Studio's Persian-market focus might suggest Rial-first, but the platform's own audience/locale is separately unresolved (`frontend-architecture.md`'s open question) and shouldn't be guessed here.
- Refund policy, chargeback handling, minimum balance/overdraft — all business decisions requiring founder input once Billing is actually being implemented, not architecture questions.
- Whether reservations expire (e.g. an abandoned request holding funds forever) — target design should include a TTL + a cleanup job, but the TTL value is a product decision, not fixed here.
