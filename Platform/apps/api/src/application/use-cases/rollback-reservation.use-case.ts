import { Inject, Injectable } from '@nestjs/common';
import { Money } from '../../domain/money';
import { WALLET_REPOSITORY_PORT, type WalletRepositoryPort } from '../ports/wallet-repository.port';
import { CLOCK_PORT, type ClockPort } from '../ports/clock.port';
import { requireWallet } from '../require-wallet';
import type { WalletBalanceResult } from './credit-wallet.use-case';

export interface RollbackReservationInput {
  accountId: string;
  amountMinorUnits: bigint;
  currency: string;
  referenceId: string;
}

/** Full release, no charge — the AI call failed entirely (docs/architecture/wallet-architecture.md's rollback flow). */
@Injectable()
export class RollbackReservationUseCase {
  constructor(
    @Inject(WALLET_REPOSITORY_PORT) private readonly wallets: WalletRepositoryPort,
    @Inject(CLOCK_PORT) private readonly clock: ClockPort,
  ) {}

  async execute(input: RollbackReservationInput): Promise<WalletBalanceResult> {
    const wallet = await requireWallet(this.wallets, input.accountId);
    const now = this.clock.now();

    const entry = wallet.rollback(Money.of(input.amountMinorUnits, input.currency), input.referenceId, now);
    await this.wallets.appendLedgerEntries(wallet.id, [entry], wallet.getBalance());

    return { walletId: wallet.id, balanceMinorUnits: wallet.getBalance().minorUnits, currency: input.currency };
  }
}
