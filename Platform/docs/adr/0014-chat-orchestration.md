# ADR-0014: Chat orchestration — debit-after-call, no pre-call reservation

**Status:** Accepted and implemented (Sprint 1 — `apps/api/src/application/use-cases/send-chat-message.use-case.ts`, `apps/api/src/domain/conversation.entity.ts`, `apps/api/src/domain/message.ts`)
**Date:** 2026-07-12
**Related:** ADR-0005/0007 (Provider Access), ADR-0008 (wallet ledger), ADR-0009 (pricing)

## Context

Chat is the first feature that ties every other Sprint 1 bounded context together in one request: Identity (whose account), Provider Access (which provider answers), Pricing (what to charge), and Wallet (recording the charge). `wallet-architecture.md`'s designed flow for a metered call is reserve (hold an estimate) → call → settle (release the estimate, debit the real cost). That flow requires an estimate of the cost *before* the call, which for an LLM chat completion means estimating token counts ahead of time.

## Decision

Chat does **not** pre-reserve an estimated cost. Estimating a token count before the call is itself a guess — with no principled way to size it (model-dependent, prompt-dependent, wildly variable completion lengths) — and this codebase's established discipline (`00_System/CLAUDE_MASTER_PROMPT.md`'s "no fake data") treats inventing a number with no real basis as worse than the alternative. Instead:

1. Before calling a provider, `SendChatMessageUseCase` requires the wallet's current balance to be strictly positive (`> 0`). This is a coarse gate — real, not guessed — and is the only pre-call check.
2. The provider is called for real. Its actual `usage` (prompt/completion tokens) is only known once the call returns.
3. The real cost (`@aifa/ai-provider-sdk`'s `calculateCostMinorUnits`) and real price (`PricingEnginePort`) are computed from that real usage.
4. `Wallet.debit()` (new domain method, no blocking precondition — mirrors the debit half of `settle()`) charges the account for the real price. The call already happened; it must be accounted for regardless of the resulting balance.

Idempotency is handled at the message level, not the ledger level alone: the client may supply a `messageId`. `SendChatMessageUseCase` checks `ConversationRepositoryPort.hasMessage(messageId)` *before* calling the provider or touching the wallet — the same "check first, don't just recover after" pattern `ReserveFundsUseCase` already uses for its own blocking precondition. A repeat with the same `messageId` is rejected (`DuplicateMessageError`, HTTP 409) rather than silently re-processed.

## Rationale

- Reserve/settle exists and remains available in `Wallet` for any future caller that *can* size an accurate pre-call estimate (e.g. a fixed-price product tier). Chat specifically cannot, so building a fake estimator just to fit the existing flow would trade one honesty problem (no reservation) for another (a made-up number).
- A strictly-positive-balance gate is weaker than a sized reservation — an account with 1 minor unit of balance can still trigger a call that costs far more, going deeply negative. This is a known, accepted limitation, not an oversight, and is the direct analog of `wallet-architecture.md`'s already-accepted "settle can push the balance negative" limitation.
- Debit-without-reservation needed a new domain capability (`Wallet.debit()`) because every existing wallet operation either has a blocking precondition (`reserve`) or requires one to already exist (`settle`, which releases a reservation). Chat's cost is never reserved, so neither fits.
- Message-level idempotency (not just the ledger's `(walletId, referenceId, type)` uniqueness) is necessary because a network retry of the whole chat request would otherwise generate a *new* server-side message id and reference id, defeating the ledger's own deduplication — the dedup key has to be anchored to something the client can deterministically repeat, which only a client-supplied `messageId` provides.

## Alternatives considered

- **Reserve a generous fixed estimate (e.g. "assume max context tokens") regardless of actual prompt size:** rejected — this is exactly the kind of invented number the mission's "no fake data" principle exists to prevent, and a generous-enough estimate to never undershoot would block far more balance than most calls actually need, harming legitimate low-balance accounts.
- **Full request-level idempotent replay** (cache and return the exact previous response for a repeated `messageId`, rather than rejecting the retry): would fully close the "client retries and can't see why" gap, but requires persisting and correctly replaying a whole prior HTTP response — a materially bigger feature. Rejected for this milestone as over-scoped; the client can already recover by calling `GET /v1/chat/conversations/:id` to see the conversation state after a 409.

## Consequences

- `Wallet.debit()` is a new public domain method. It never throws, matching `settle()`'s debit half.
- `POST /v1/chat` can return HTTP 402 (balance not positive), 404 (unknown `conversationId` for this account), 409 (repeated `messageId`), or 503 (every configured provider failed) in addition to 201.
- An account can go negative from a single expensive call. No mechanism to pre-empt this exists yet (e.g. a hard per-plan spending cap) — flagged as a real product gap, not silently ignored.
- No real vendor API key exists in this codebase's development/CI sandbox (same limitation as ADR-0005/0007), so `SendChatMessageUseCase` is verified end-to-end with in-memory port fakes (`send-chat-message.use-case.spec.ts`) and a live app boot confirming `ChatModule` wires correctly — not a full live HTTP round-trip requiring a real Postgres-backed wallet and conversation, which this sandbox cannot provide (same limitation Wallet and Pricing already documented).
