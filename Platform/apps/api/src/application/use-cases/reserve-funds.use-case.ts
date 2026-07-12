import { Inject, Injectable } from '@nestjs/common';
import { Money } from '../../domain/money';
import { WALLET_REPOSITORY_PORT, type WalletRepositoryPort } from '../ports/wallet-repository.port';
import { CLOCK_PORT, type ClockPort } from '../ports/clock.port';
import { requireWallet } from '../require-wallet';
import type { WalletBalanceResult } from './credit-wallet.use-case';

export interface ReserveFundsInput {
  accountId: string;
  amountMinorUnits: bigint;
  currency: string;
  referenceId: string;
}

/**
 * Holds funds before a metered AI call. Throws InsufficientBalanceError (via
 * Wallet.reserve) BEFORE any provider is called if the account can't afford
 * the estimate — see docs/architecture/wallet-architecture.md's reservation flow.
 */
@Injectable()
export class ReserveFundsUseCase {
  constructor(
    @Inject(WALLET_REPOSITORY_PORT) private readonly wallets: WalletRepositoryPort,
    @Inject(CLOCK_PORT) private readonly clock: ClockPort,
  ) {}

  async execute(input: ReserveFundsInput): Promise<WalletBalanceResult> {
    const wallet = await requireWallet(this.wallets, input.accountId);

    // Check BEFORE running the domain's balance gate, not just recover after
    // (wallet-repository.port.ts's hasLedgerEntry doc comment): a retry of an
    // already-successful reservation would otherwise re-run the balance
    // check against the *current* (already-reduced) balance and could
    // spuriously throw InsufficientBalanceError even though the original
    // attempt already succeeded.
    if (await this.wallets.hasLedgerEntry(wallet.id, input.referenceId, 'reservation')) {
      const balance = wallet.getBalance();
      return { walletId: wallet.id, balanceMinorUnits: balance.minorUnits, currency: input.currency };
    }

    const now = this.clock.now();
    const entry = wallet.reserve(Money.of(input.amountMinorUnits, input.currency), input.referenceId, now);
    const actualBalance = await this.wallets.appendLedgerEntries(wallet.id, [entry], wallet.getBalance());

    return { walletId: wallet.id, balanceMinorUnits: actualBalance.minorUnits, currency: input.currency };
  }
}
