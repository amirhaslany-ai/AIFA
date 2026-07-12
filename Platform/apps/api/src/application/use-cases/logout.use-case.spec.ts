import { describe, expect, it } from 'vitest';
import { LogoutUseCase } from './logout.use-case';
import { RefreshSessionUseCase } from './refresh-session.use-case';
import { RegisterAccountUseCase } from './register-account.use-case';
import { SessionIssuerService } from '../services/session-issuer.service';
import { InMemoryAccountRepository } from '../../test-support/in-memory-account.repository';
import { InMemoryRefreshTokenRepository } from '../../test-support/in-memory-refresh-token.repository';
import { createTestTokenIssuer } from '../../test-support/create-test-token-issuer';
import { Argon2PasswordHasherAdapter } from '../../infrastructure/identity/argon2-password-hasher.adapter';
import type { ClockPort } from '../ports/clock.port';
import { InvalidRefreshTokenError } from '../../domain/errors/invalid-refresh-token.error';

const fixedClock: ClockPort = { now: () => new Date('2026-07-12T00:00:00.000Z') };

async function buildUseCases() {
  const accounts = new InMemoryAccountRepository();
  const refreshTokens = new InMemoryRefreshTokenRepository();
  const { issuer } = await createTestTokenIssuer(fixedClock);
  const sessionIssuer = new SessionIssuerService(issuer, refreshTokens, fixedClock);
  const passwordHasher = new Argon2PasswordHasherAdapter();
  const register = new RegisterAccountUseCase(accounts, passwordHasher, fixedClock, sessionIssuer);
  const refresh = new RefreshSessionUseCase(issuer, refreshTokens, fixedClock, sessionIssuer);
  const logout = new LogoutUseCase(issuer, refreshTokens);
  return { register, refresh, logout };
}

describe('LogoutUseCase', () => {
  it('revokes the session — the refresh token stops working afterward', async () => {
    const { register, refresh, logout } = await buildUseCases();
    const session = await register.execute({ email: 'user@example.com', password: 'password-123' });

    await logout.execute(session.refreshToken);

    await expect(refresh.execute(session.refreshToken)).rejects.toThrow(InvalidRefreshTokenError);
  });

  it('is idempotent — logging out with an unknown/already-invalid token does not throw', async () => {
    const { logout } = await buildUseCases();

    await expect(logout.execute('never-issued-token')).resolves.toBeUndefined();
  });
});
