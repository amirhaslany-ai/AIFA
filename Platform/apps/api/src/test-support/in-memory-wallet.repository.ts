import { Wallet } from '../domain/wallet.entity';
import { Money } from '../domain/money';
import type { LedgerEntryDraft, LedgerEntryType } from '../domain/ledger-entry';
import type { WalletRepositoryPort } from '../application/ports/wallet-repository.port';

interface StoredWallet {
  id: string;
  accountId: string;
  currency: string;
  balanceMinorUnits: bigint;
  createdAt: Date;
}

/**
 * Mirrors the real repository's contract exactly, including the two things a
 * naive fake would get wrong (both found as real bugs while writing this):
 *
 * 1. findByAccountId reconstructs a FRESH Wallet instance from stored state
 *    on every call — it does not return a shared, live-mutated object
 *    reference. A fake that returned the same reference would let a retry
 *    within one test process silently double-apply a domain mutation in a
 *    way the real Prisma-backed repository (which always reads a fresh row)
 *    never would — masking exactly the bug this fake exists to catch.
 * 2. appendLedgerEntries only updates the stored balance if at least one
 *    entry in the batch was newly applied — a full idempotent retry (every
 *    entry already recorded) must leave the stored balance untouched, or a
 *    retry silently double-counts it (see prisma-wallet.repository.ts's
 *    matching fix and comment for the full story).
 */
export class InMemoryWalletRepository implements WalletRepositoryPort {
  private readonly byAccountId = new Map<string, StoredWallet>();
  private readonly appliedKeys = new Set<string>(); // `${walletId}:${referenceId}:${type}`

  async findByAccountId(accountId: string): Promise<Wallet | null> {
    const stored = this.byAccountId.get(accountId);
    return stored ? this.toDomain(stored) : null;
  }

  async create(wallet: Wallet): Promise<void> {
    const balance = wallet.getBalance();
    this.byAccountId.set(wallet.accountId, {
      id: wallet.id,
      accountId: wallet.accountId,
      currency: balance.currency,
      balanceMinorUnits: balance.minorUnits,
      createdAt: wallet.createdAt,
    });
  }

  async appendLedgerEntries(
    walletId: string,
    entries: LedgerEntryDraft[],
    newBalance: Money,
  ): Promise<Money> {
    let anyNewlyApplied = false;

    for (const entry of entries) {
      const key = `${walletId}:${entry.referenceId}:${entry.type}`;
      if (this.appliedKeys.has(key)) {
        continue; // idempotent no-op, matching the real repository
      }
      this.appliedKeys.add(key);
      anyNewlyApplied = true;
    }

    const stored = [...this.byAccountId.values()].find((w) => w.id === walletId);
    if (!stored) {
      throw new Error(`InMemoryWalletRepository: no wallet with id ${walletId}`);
    }

    if (!anyNewlyApplied) {
      // Same fix as prisma-wallet.repository.ts: return what's ACTUALLY
      // stored, never the caller's pre-computed (possibly double-counted)
      // newBalance, on a full-duplicate retry.
      return Money.of(stored.balanceMinorUnits, stored.currency);
    }

    stored.balanceMinorUnits = newBalance.minorUnits;
    return newBalance;
  }

  async hasLedgerEntry(walletId: string, referenceId: string, type: LedgerEntryType): Promise<boolean> {
    return this.appliedKeys.has(`${walletId}:${referenceId}:${type}`);
  }

  private toDomain(stored: StoredWallet): Wallet {
    return Wallet.reconstitute({
      id: stored.id,
      accountId: stored.accountId,
      balance: Money.of(stored.balanceMinorUnits, stored.currency),
      createdAt: stored.createdAt,
    });
  }
}
