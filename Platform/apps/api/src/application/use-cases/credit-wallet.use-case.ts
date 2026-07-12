import { randomUUID } from 'node:crypto';
import { Inject, Injectable } from '@nestjs/common';
import { Wallet } from '../../domain/wallet.entity';
import { Money } from '../../domain/money';
import { WALLET_REPOSITORY_PORT, type WalletRepositoryPort } from '../ports/wallet-repository.port';
import { CLOCK_PORT, type ClockPort } from '../ports/clock.port';

export interface CreditWalletInput {
  accountId: string;
  amountMinorUnits: bigint;
  currency: string;
  referenceId: string;
}

export interface WalletBalanceResult {
  walletId: string;
  balanceMinorUnits: bigint;
  currency: string;
}

/** Get-or-create: a wallet is opened lazily on its first credit, not at account registration. */
@Injectable()
export class CreditWalletUseCase {
  constructor(
    @Inject(WALLET_REPOSITORY_PORT) private readonly wallets: WalletRepositoryPort,
    @Inject(CLOCK_PORT) private readonly clock: ClockPort,
  ) {}

  async execute(input: CreditWalletInput): Promise<WalletBalanceResult> {
    const now = this.clock.now();
    let wallet = await this.wallets.findByAccountId(input.accountId);

    if (!wallet) {
      wallet = Wallet.open({
        id: randomUUID(),
        accountId: input.accountId,
        currency: input.currency,
        now,
      });
      await this.wallets.create(wallet);
    }

    const entry = wallet.credit(Money.of(input.amountMinorUnits, input.currency), input.referenceId, now);
    // Use the repository's returned balance, not wallet.getBalance() — on a
    // duplicate/retried referenceId the in-memory value double-counts (see
    // wallet-repository.port.ts's doc comment on appendLedgerEntries).
    const actualBalance = await this.wallets.appendLedgerEntries(wallet.id, [entry], wallet.getBalance());

    return { walletId: wallet.id, balanceMinorUnits: actualBalance.minorUnits, currency: input.currency };
  }
}
