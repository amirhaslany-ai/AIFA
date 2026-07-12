import { DomainError } from './domain-error';

export class AccountAlreadyExistsError extends DomainError {
  readonly code = 'ACCOUNT_ALREADY_EXISTS';

  constructor(email: string) {
    super(`An account with email "${email}" already exists`);
  }
}
