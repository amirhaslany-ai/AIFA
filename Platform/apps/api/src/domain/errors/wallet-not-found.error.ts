import { DomainError } from './domain-error';

export class WalletNotFoundError extends DomainError {
  readonly code = 'WALLET_NOT_FOUND';

  constructor(accountId: string) {
    super(`No wallet exists for account ${accountId}`);
  }
}
