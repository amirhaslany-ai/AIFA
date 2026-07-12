import type { Wallet } from '../../domain/wallet.entity';
import type { LedgerEntryDraft, LedgerEntryType } from '../../domain/ledger-entry';
import type { Money } from '../../domain/money';

export const WALLET_REPOSITORY_PORT = Symbol('WalletRepositoryPort');

/**
 * One repository for the Wallet aggregate root — LedgerEntry is a value
 * object owned by Wallet, never queried/persisted independently
 * (docs/architecture/ddd-tactical-design.md, docs/adr/0008-wallet-ledger-pattern.md).
 */
export interface WalletRepositoryPort {
  findByAccountId(accountId: string): Promise<Wallet | null>;
  create(wallet: Wallet): Promise<void>;

  /**
   * Persists one or more ledger entries and the wallet's resulting balance
   * atomically (one DB transaction) — settle() produces two entries that
   * must land together or not at all. Idempotent: an entry whose
   * (referenceId, type) already exists for this wallet is silently skipped,
   * not re-applied and not an error — a retried request is a safe no-op,
   * never a double charge.
   *
   * Returns the ACTUAL resulting balance (which is `newBalance` if anything
   * was newly applied, or the unchanged persisted balance if every entry was
   * a duplicate) — callers must use this return value, not their own
   * pre-computed `newBalance`, for anything they report back to a caller.
   * The in-memory domain object that computed `newBalance` has no way to
   * know an operation was a duplicate (that's this repository's job), so its
   * own balance is only correct on a genuinely new operation.
   */
  appendLedgerEntries(walletId: string, entries: LedgerEntryDraft[], newBalance: Money): Promise<Money>;

  /**
   * Used by ReserveFundsUseCase to detect a retry BEFORE calling the domain's
   * balance-check (Wallet.reserve) — reserve is the one wallet operation with
   * a blocking precondition, so re-running it against the *current* (already
   * reduced) balance on a retry could spuriously throw InsufficientBalanceError
   * even though the original attempt already succeeded. Credit/settle/rollback
   * have no such blocking check, so appendLedgerEntries' own idempotency is
   * sufficient for them; only reserve needs to check first, not just recover after.
   */
  hasLedgerEntry(walletId: string, referenceId: string, type: LedgerEntryType): Promise<boolean>;
}
