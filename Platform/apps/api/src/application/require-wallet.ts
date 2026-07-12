import type { Wallet } from '../domain/wallet.entity';
import { WalletNotFoundError } from '../domain/errors/wallet-not-found.error';
import type { WalletRepositoryPort } from './ports/wallet-repository.port';

/** Shared by every use case that requires an existing wallet (reserve/settle/rollback/balance) — not credit, which creates one lazily. */
export async function requireWallet(wallets: WalletRepositoryPort, accountId: string): Promise<Wallet> {
  const wallet = await wallets.findByAccountId(accountId);
  if (!wallet) {
    throw new WalletNotFoundError(accountId);
  }
  return wallet;
}
