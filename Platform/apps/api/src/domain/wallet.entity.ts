import { Money } from './money';
import { type LedgerEntryDraft, type LedgerEntryType, increasesBalance } from './ledger-entry';
import { InsufficientBalanceError } from './errors/insufficient-balance.error';

/**
 * Aggregate root for the Billing bounded context (docs/architecture/wallet-architecture.md,
 * docs/adr/0008-wallet-ledger-pattern.md). The ledger (LedgerEntryDraft output
 * of these methods) is authoritative; `balance` here is a cache that this
 * entity keeps in sync with every operation it accepts — the repository is
 * responsible for persisting both the new ledger row(s) and this balance in
 * one atomic transaction.
 */
export class Wallet {
  private constructor(
    readonly id: string,
    readonly accountId: string,
    private balance: Money,
    readonly createdAt: Date,
  ) {}

  static open(params: { id: string; accountId: string; currency: string; now: Date }): Wallet {
    return new Wallet(params.id, params.accountId, Money.zero(params.currency), params.now);
  }

  static reconstitute(params: {
    id: string;
    accountId: string;
    balance: Money;
    createdAt: Date;
  }): Wallet {
    return new Wallet(params.id, params.accountId, params.balance, params.createdAt);
  }

  getBalance(): Money {
    return this.balance;
  }

  /** Adding funds (a purchase, a promotional grant). */
  credit(amount: Money, referenceId: string, now: Date): LedgerEntryDraft {
    return this.applyEntry('credit', amount, referenceId, now);
  }

  /**
   * Holds funds before a metered call. Throws InsufficientBalanceError
   * BEFORE any AI call happens if the account can't afford the estimate —
   * never let a call happen the account can't pay for.
   */
  reserve(amount: Money, referenceId: string, now: Date): LedgerEntryDraft {
    return this.applyEntry('reservation', amount, referenceId, now);
  }

  /** Releases a hold without charging anything (used standalone, or as half of settle()). */
  releaseReservation(amount: Money, referenceId: string, now: Date): LedgerEntryDraft {
    return this.applyEntry('reservation_release', amount, referenceId, now);
  }

  /**
   * Releases the estimated hold and charges the real cost — two entries, one
   * atomic write (docs/architecture/wallet-architecture.md's settlement flow).
   * If actualAmount exceeds reservedAmount, the debit can push the cached
   * balance negative — a known, accepted limitation (see wallet-architecture.md);
   * settlement never fails after the fact, since the AI call already happened
   * and must be paid for regardless.
   */
  settle(reservedAmount: Money, actualAmount: Money, referenceId: string, now: Date): LedgerEntryDraft[] {
    const release = this.applyEntry('reservation_release', reservedAmount, referenceId, now);
    const debit = this.applyEntry('debit', actualAmount, `${referenceId}-settlement`, now, {
      skipBalanceCheck: true,
    });
    return [release, debit];
  }

  /** Full release, no charge — the AI call failed entirely (e.g. AllProvidersUnavailableError). */
  rollback(amount: Money, referenceId: string, now: Date): LedgerEntryDraft {
    return this.applyEntry('rollback', amount, referenceId, now);
  }

  private applyEntry(
    type: LedgerEntryType,
    amount: Money,
    referenceId: string,
    now: Date,
    options: { skipBalanceCheck?: boolean } = {},
  ): LedgerEntryDraft {
    const newBalance = increasesBalance(type) ? this.balance.add(amount) : this.balance.subtract(amount);

    // Only the reservation gate blocks a call from happening at all. Debit
    // (settlement) never blocks — the call already happened and must be
    // accounted for even if it overran the reservation estimate.
    if (type === 'reservation' && newBalance.isNegative() && !options.skipBalanceCheck) {
      throw new InsufficientBalanceError(this.id);
    }

    this.balance = newBalance;
    return { type, amount, referenceId, createdAt: now };
  }
}
