import { Inject, Injectable } from '@nestjs/common';
import { Email } from '../../domain/email';
import { InvalidCredentialsError } from '../../domain/errors/invalid-credentials.error';
import { ACCOUNT_REPOSITORY_PORT, type AccountRepositoryPort } from '../ports/account-repository.port';
import { PASSWORD_HASHER_PORT, type PasswordHasherPort } from '../ports/password-hasher.port';
import { SessionIssuerService } from '../services/session-issuer.service';
import type { AuthSession } from '../identity.constants';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(ACCOUNT_REPOSITORY_PORT) private readonly accounts: AccountRepositoryPort,
    @Inject(PASSWORD_HASHER_PORT) private readonly passwordHasher: PasswordHasherPort,
    private readonly sessionIssuer: SessionIssuerService,
  ) {}

  async execute(input: { email: string; password: string }): Promise<AuthSession> {
    // Email.create() can throw on malformed input — treated as invalid
    // credentials, not a validation error, so a malformed-email probe can't
    // be distinguished from a wrong-password probe (no account enumeration).
    let email: Email;
    try {
      email = Email.create(input.email);
    } catch {
      throw new InvalidCredentialsError();
    }

    const account = await this.accounts.findByEmail(email);
    if (!account) {
      throw new InvalidCredentialsError();
    }

    const passwordMatches = await this.passwordHasher.verify(input.password, account.getPasswordHash());
    if (!passwordMatches) {
      throw new InvalidCredentialsError();
    }

    return this.sessionIssuer.issueNewSession(account.id);
  }
}
