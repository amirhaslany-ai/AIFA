import { Inject, Injectable } from '@nestjs/common';
import { Money } from '../../domain/money';
import { WALLET_REPOSITORY_PORT, type WalletRepositoryPort } from '../ports/wallet-repository.port';
import { CLOCK_PORT, type ClockPort } from '../ports/clock.port';
import { requireWallet } from '../require-wallet';
import type { WalletBalanceResult } from './credit-wallet.use-case';

export interface SettleReservationInput {
  accountId: string;
  reservedAmountMinorUnits: bigint;
  actualAmountMinorUnits: bigint;
  currency: string;
  referenceId: string;
}

/** Releases the estimate hold and charges the real cost — docs/architecture/wallet-architecture.md's settlement flow. */
@Injectable()
export class SettleReservationUseCase {
  constructor(
    @Inject(WALLET_REPOSITORY_PORT) private readonly wallets: WalletRepositoryPort,
    @Inject(CLOCK_PORT) private readonly clock: ClockPort,
  ) {}

  async execute(input: SettleReservationInput): Promise<WalletBalanceResult> {
    const wallet = await requireWallet(this.wallets, input.accountId);
    const now = this.clock.now();

    const entries = wallet.settle(
      Money.of(input.reservedAmountMinorUnits, input.currency),
      Money.of(input.actualAmountMinorUnits, input.currency),
      input.referenceId,
      now,
    );
    await this.wallets.appendLedgerEntries(wallet.id, entries, wallet.getBalance());

    return { walletId: wallet.id, balanceMinorUnits: wallet.getBalance().minorUnits, currency: input.currency };
  }
}
