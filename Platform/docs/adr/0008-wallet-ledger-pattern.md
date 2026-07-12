# ADR-0008: Wallet uses an append-only ledger, not a mutable balance column

**Status:** Accepted and implemented (Sprint 1 — `apps/api/src/domain/wallet.entity.ts`, `packages/database/prisma/schema.prisma`)
**Date:** 2026-07-12
**Related:** `docs/architecture/wallet-architecture.md`

## Context

The platform needs to track account balances for metered AI usage. A naive `Wallet.balance` column, directly incremented/decremented by application code, is simple to implement but a well-documented source of billing bugs: lost updates on crash-between-steps, races under concurrent requests, and no audit trail for "why is the balance what it is."

## Decision

Model the wallet as an aggregate root with an append-only `LedgerEntry` value object collection as the source of truth. `Wallet.balance` exists only as a derivable cache, always reconcilable against `SUM(LedgerEntry.amount)`. Every balance change (credit, debit, reservation, reservation release, rollback) is a new `LedgerEntry`, never an update to an existing one or a direct balance mutation.

## Rationale

- This is standard practice in billing systems handling real money (double-entry-adjacent accounting) — not a novel invention, and battle-tested for exactly the failure modes a metered-AI-usage product will hit (partial failures mid-call, concurrent requests from the same account, disputes needing a full history).
- An append-only ledger makes "what happened to this account's balance and why" a query, not a mystery — directly satisfies the mission's "audit trail" requirement.
- Idempotency via `referenceId` uniqueness (rather than application-level "check then act" logic) closes the double-webhook/double-charge race at the database constraint level, not just in code that could have a bug.

## Alternatives considered

- **Mutable balance column, transaction log as a secondary/best-effort table:** rejected — demotes the audit trail to "nice to have" instead of "structurally the source of truth," which is exactly backwards for money.
- **External billing provider (Stripe Billing, Metronome, etc.) instead of building this in-house:** genuinely worth considering once real implementation starts (not decided here — this ADR only fixes the *internal model* if/when it's built in-house; whether to build vs. buy is a founder decision informed by cost and the Persian-market payment-provider landscape (`OPEN_QUESTIONS.md` OQ-003-adjacent territory in Content Studio's docs, analogous question exists here), not something this architecture pass should decide unilaterally).

## Consequences

- `Wallet`/`LedgerEntry` exist in `packages/database/prisma/schema.prisma`, unique on `(walletId, referenceId, type)` — deliberately not just `(walletId, referenceId)`, since a reservation and its eventual release/rollback share one referenceId (the originating request id) but are different types and must coexist as separate rows.
- Idempotency turned out to need care beyond the unique constraint alone: the balance *cache* must only update when a ledger entry was genuinely newly applied, and callers must use the repository's returned balance, not their own pre-computed one — both found as real, reproducing test failures during implementation (a retried operation was silently double-counting the reported balance even though the ledger row itself was correctly deduplicated). See `apps/api/src/infrastructure/persistence/prisma-wallet.repository.ts` and `application/ports/wallet-repository.port.ts`'s doc comments for the full story.
- `reserve()` additionally needs an idempotency check *before* running the domain's balance-check, not just recovery after — otherwise a retry of an already-successful reservation could spuriously throw `InsufficientBalanceError` against the already-reduced current balance. `credit`/`settle`/`rollback` have no such blocking precondition, so this only applies to reserve.
- Every future write path touching a wallet must go through the reservation → settlement/rollback flow (`wallet-architecture.md`) — a direct "just debit the balance" shortcut anywhere in the codebase would violate this ADR and should be caught in code review.
