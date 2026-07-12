import { describe, expect, it } from 'vitest';
import { RegisterAccountUseCase } from './register-account.use-case';
import { SessionIssuerService } from '../services/session-issuer.service';
import { InMemoryAccountRepository } from '../../test-support/in-memory-account.repository';
import { InMemoryRefreshTokenRepository } from '../../test-support/in-memory-refresh-token.repository';
import { createTestTokenIssuer } from '../../test-support/create-test-token-issuer';
import { Argon2PasswordHasherAdapter } from '../../infrastructure/identity/argon2-password-hasher.adapter';
import type { ClockPort } from '../ports/clock.port';
import { AccountAlreadyExistsError } from '../../domain/errors/account-already-exists.error';
import { Email } from '../../domain/email';

const fixedClock: ClockPort = { now: () => new Date('2026-07-12T00:00:00.000Z') };

async function buildUseCase() {
  const accounts = new InMemoryAccountRepository();
  const refreshTokens = new InMemoryRefreshTokenRepository();
  const { issuer } = await createTestTokenIssuer(fixedClock);
  const sessionIssuer = new SessionIssuerService(issuer, refreshTokens, fixedClock);
  const passwordHasher = new Argon2PasswordHasherAdapter();
  const useCase = new RegisterAccountUseCase(accounts, passwordHasher, fixedClock, sessionIssuer);
  return { useCase, accounts, passwordHasher };
}

describe('RegisterAccountUseCase', () => {
  it('creates an account with a real argon2 hash and issues a real signed session', async () => {
    const { useCase, accounts, passwordHasher } = await buildUseCase();

    const session = await useCase.execute({ email: 'new@example.com', password: 'correct-horse-battery' });

    expect(session.accessToken.split('.')).toHaveLength(3); // a real JWT has 3 dot-separated parts
    expect(session.refreshToken).toHaveLength(43); // 32 random bytes, base64url-encoded

    const stored = await accounts.findByEmail(Email.create('new@example.com'));
    expect(stored).not.toBeNull();
    expect(await passwordHasher.verify('correct-horse-battery', stored!.getPasswordHash())).toBe(true);
    expect(await passwordHasher.verify('wrong-password', stored!.getPasswordHash())).toBe(false);
  });

  it('rejects a duplicate email', async () => {
    const { useCase } = await buildUseCase();

    await useCase.execute({ email: 'dup@example.com', password: 'first-password-1' });

    await expect(
      useCase.execute({ email: 'dup@example.com', password: 'second-password-2' }),
    ).rejects.toThrow(AccountAlreadyExistsError);
  });

  it('rejects a malformed email before touching the repository', async () => {
    const { useCase } = await buildUseCase();

    await expect(useCase.execute({ email: 'not-an-email', password: 'whatever-1' })).rejects.toThrow(
      /not a valid email/,
    );
  });
});
