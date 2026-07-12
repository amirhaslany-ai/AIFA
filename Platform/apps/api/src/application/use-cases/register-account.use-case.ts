import { randomUUID } from 'node:crypto';
import { Inject, Injectable } from '@nestjs/common';
import { Account } from '../../domain/account.entity';
import { Email } from '../../domain/email';
import { AccountAlreadyExistsError } from '../../domain/errors/account-already-exists.error';
import { ACCOUNT_REPOSITORY_PORT, type AccountRepositoryPort } from '../ports/account-repository.port';
import { PASSWORD_HASHER_PORT, type PasswordHasherPort } from '../ports/password-hasher.port';
import { CLOCK_PORT, type ClockPort } from '../ports/clock.port';
import { SessionIssuerService } from '../services/session-issuer.service';
import type { AuthSession } from '../identity.constants';

@Injectable()
export class RegisterAccountUseCase {
  constructor(
    @Inject(ACCOUNT_REPOSITORY_PORT) private readonly accounts: AccountRepositoryPort,
    @Inject(PASSWORD_HASHER_PORT) private readonly passwordHasher: PasswordHasherPort,
    @Inject(CLOCK_PORT) private readonly clock: ClockPort,
    private readonly sessionIssuer: SessionIssuerService,
  ) {}

  async execute(input: { email: string; password: string }): Promise<AuthSession> {
    const email = Email.create(input.email);

    const existing = await this.accounts.findByEmail(email);
    if (existing) {
      throw new AccountAlreadyExistsError(email.toString());
    }

    const passwordHash = await this.passwordHasher.hash(input.password);
    const account = Account.register({ id: randomUUID(), email, passwordHash, now: this.clock.now() });
    await this.accounts.create(account);

    return this.sessionIssuer.issueNewSession(account.id);
  }
}
