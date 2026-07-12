import type { Money } from './money';

export type LedgerEntryType = 'credit' | 'debit' | 'reservation' | 'reservation_release' | 'rollback';

/**
 * What Wallet's methods produce — not yet persisted. `amount` is always a
 * positive magnitude; `type` carries direction (docs/architecture/wallet-architecture.md).
 * The repository persists this as-is; it is never mutated afterward
 * (docs/adr/0008-wallet-ledger-pattern.md's append-only principle).
 */
export interface LedgerEntryDraft {
  type: LedgerEntryType;
  amount: Money;
  referenceId: string;
  createdAt: Date;
}

const CREDITS_BALANCE: Record<LedgerEntryType, boolean> = {
  credit: true,
  reservation_release: true,
  rollback: true,
  reservation: false,
  debit: false,
};

/** Whether this entry type increases (true) or decreases (false) the wallet balance. */
export function increasesBalance(type: LedgerEntryType): boolean {
  return CREDITS_BALANCE[type];
}
