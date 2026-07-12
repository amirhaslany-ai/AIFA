import { DomainError } from './domain-error';

/**
 * Deliberately generic message — never reveals whether the email exists or
 * the password was wrong, so this error can't be used to enumerate accounts.
 */
export class InvalidCredentialsError extends DomainError {
  readonly code = 'INVALID_CREDENTIALS';

  constructor() {
    super('Invalid email or password');
  }
}
