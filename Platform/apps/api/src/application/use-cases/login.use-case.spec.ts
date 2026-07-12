import { describe, expect, it } from 'vitest';
import { LoginUseCase } from './login.use-case';
import { RegisterAccountUseCase } from './register-account.use-case';
import { SessionIssuerService } from '../services/session-issuer.service';
import { InMemoryAccountRepository } from '../../test-support/in-memory-account.repository';
import { InMemoryRefreshTokenRepository } from '../../test-support/in-memory-refresh-token.repository';
import { createTestTokenIssuer } from '../../test-support/create-test-token-issuer';
import { Argon2PasswordHasherAdapter } from '../../infrastructure/identity/argon2-password-hasher.adapter';
import type { ClockPort } from '../ports/clock.port';
import { InvalidCredentialsError } from '../../domain/errors/invalid-credentials.error';

const fixedClock: ClockPort = { now: () => new Date('2026-07-12T00:00:00.000Z') };

async function buildUseCases() {
  const accounts = new InMemoryAccountRepository();
  const refreshTokens = new InMemoryRefreshTokenRepository();
  const { issuer } = await createTestTokenIssuer(fixedClock);
  const sessionIssuer = new SessionIssuerService(issuer, refreshTokens, fixedClock);
  const passwordHasher = new Argon2PasswordHasherAdapter();
  const register = new RegisterAccountUseCase(accounts, passwordHasher, fixedClock, sessionIssuer);
  const login = new LoginUseCase(accounts, passwordHasher, sessionIssuer);
  return { register, login };
}

describe('LoginUseCase', () => {
  it('issues a new session for the correct password', async () => {
    const { register, login } = await buildUseCases();
    await register.execute({ email: 'user@example.com', password: 'correct-password-1' });

    const session = await login.execute({ email: 'user@example.com', password: 'correct-password-1' });

    expect(session.accessToken.split('.')).toHaveLength(3);
  });

  it('rejects the wrong password with a generic error', async () => {
    const { register, login } = await buildUseCases();
    await register.execute({ email: 'user@example.com', password: 'correct-password-1' });

    await expect(
      login.execute({ email: 'user@example.com', password: 'wrong-password-1' }),
    ).rejects.toThrow(InvalidCredentialsError);
  });

  it('rejects a non-existent account with the SAME generic error (no account enumeration)', async () => {
    const { login } = await buildUseCases();

    await expect(
      login.execute({ email: 'nobody@example.com', password: 'whatever-1' }),
    ).rejects.toThrow(InvalidCredentialsError);
  });

  it('rejects a malformed email with the same generic error, not a validation error', async () => {
    const { login } = await buildUseCases();

    await expect(login.execute({ email: 'not-an-email', password: 'whatever-1' })).rejects.toThrow(
      InvalidCredentialsError,
    );
  });
});
