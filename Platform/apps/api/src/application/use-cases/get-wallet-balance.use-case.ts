import { Inject, Injectable } from '@nestjs/common';
import { WALLET_REPOSITORY_PORT, type WalletRepositoryPort } from '../ports/wallet-repository.port';
import { requireWallet } from '../require-wallet';
import type { WalletBalanceResult } from './credit-wallet.use-case';

@Injectable()
export class GetWalletBalanceUseCase {
  constructor(@Inject(WALLET_REPOSITORY_PORT) private readonly wallets: WalletRepositoryPort) {}

  async execute(accountId: string): Promise<WalletBalanceResult> {
    const wallet = await requireWallet(this.wallets, accountId);
    const balance = wallet.getBalance();

    return { walletId: wallet.id, balanceMinorUnits: balance.minorUnits, currency: balance.currency };
  }
}
