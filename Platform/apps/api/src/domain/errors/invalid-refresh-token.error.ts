import { DomainError } from './domain-error';

export class InvalidRefreshTokenError extends DomainError {
  readonly code = 'INVALID_REFRESH_TOKEN';

  constructor(reason: string) {
    super(`Refresh token is invalid: ${reason}`);
  }
}
