import { DomainError } from './domain-error';

export class InsufficientBalanceError extends DomainError {
  readonly code = 'INSUFFICIENT_BALANCE';

  constructor(walletId: string) {
    super(`Wallet ${walletId} has insufficient balance for this operation`);
  }
}
