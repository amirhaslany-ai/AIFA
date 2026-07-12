import { describe, expect, it } from 'vitest';
import { RefreshSessionUseCase } from './refresh-session.use-case';
import { RegisterAccountUseCase } from './register-account.use-case';
import { SessionIssuerService } from '../services/session-issuer.service';
import { InMemoryAccountRepository } from '../../test-support/in-memory-account.repository';
import { InMemoryRefreshTokenRepository } from '../../test-support/in-memory-refresh-token.repository';
import { createTestTokenIssuer } from '../../test-support/create-test-token-issuer';
import { Argon2PasswordHasherAdapter } from '../../infrastructure/identity/argon2-password-hasher.adapter';
import type { ClockPort } from '../ports/clock.port';
import { InvalidRefreshTokenError } from '../../domain/errors/invalid-refresh-token.error';

async function buildUseCases(now: () => Date) {
  const clock: ClockPort = { now };
  const accounts = new InMemoryAccountRepository();
  const refreshTokens = new InMemoryRefreshTokenRepository();
  const { issuer } = await createTestTokenIssuer(clock);
  const sessionIssuer = new SessionIssuerService(issuer, refreshTokens, clock);
  const passwordHasher = new Argon2PasswordHasherAdapter();
  const register = new RegisterAccountUseCase(accounts, passwordHasher, clock, sessionIssuer);
  const refresh = new RefreshSessionUseCase(issuer, refreshTokens, clock, sessionIssuer);
  return { register, refresh, refreshTokens };
}

describe('RefreshSessionUseCase', () => {
  it('rotates: the old token stops working and a new one is issued', async () => {
    let now = new Date('2026-07-12T00:00:00.000Z');
    const { register, refresh } = await buildUseCases(() => now);

    const initial = await register.execute({ email: 'user@example.com', password: 'password-123' });

    now = new Date('2026-07-12T00:05:00.000Z');
    const rotated = await refresh.execute(initial.refreshToken);

    expect(rotated.refreshToken).not.toBe(initial.refreshToken);
    expect(rotated.accessToken).not.toBe(initial.accessToken);
  });

  it('rejects an unrecognized token', async () => {
    const { refresh } = await buildUseCases(() => new Date());

    await expect(refresh.execute('not-a-real-token')).rejects.toThrow(InvalidRefreshTokenError);
  });

  it('rejects an expired token', async () => {
    let now = new Date('2026-07-12T00:00:00.000Z');
    const { register, refresh } = await buildUseCases(() => now);
    const initial = await register.execute({ email: 'user@example.com', password: 'password-123' });

    now = new Date('2026-08-20T00:00:00.000Z'); // 39 days later, past the 30-day TTL
    await expect(refresh.execute(initial.refreshToken)).rejects.toThrow(InvalidRefreshTokenError);
  });

  it('REUSE DETECTION: presenting an already-rotated token revokes the entire session family', async () => {
    let now = new Date('2026-07-12T00:00:00.000Z');
    const { register, refresh } = await buildUseCases(() => now);
    const initial = await register.execute({ email: 'user@example.com', password: 'password-123' });

    // Legitimate rotation.
    now = new Date('2026-07-12T00:05:00.000Z');
    const rotated = await refresh.execute(initial.refreshToken);

    // An attacker (or a buggy retry) replays the now-rotated-away original token.
    now = new Date('2026-07-12T00:10:00.000Z');
    await expect(refresh.execute(initial.refreshToken)).rejects.toThrow(
      /reuse of a rotated token detected/,
    );

    // The legitimate, correctly-rotated token is now ALSO dead — the whole
    // family was revoked, not just the replayed one. This is the entire
    // point of family-based revocation (docs/adr/0010-auth-token-strategy.md):
    // if a stolen token is used, the attacker forces the real owner's
    // current session to die too, making the compromise detectable.
    now = new Date('2026-07-12T00:15:00.000Z');
    await expect(refresh.execute(rotated.refreshToken)).rejects.toThrow(InvalidRefreshTokenError);
  });
});
