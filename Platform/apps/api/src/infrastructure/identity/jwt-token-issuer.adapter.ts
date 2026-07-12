import { randomBytes, createHash } from 'node:crypto';
import { Inject, Injectable } from '@nestjs/common';
import { SignJWT } from 'jose';
import { loadConfig } from '@aifa/config';
import type { GeneratedOpaqueToken, TokenIssuerPort } from '../../application/ports/token-issuer.port';
import { CLOCK_PORT, type ClockPort } from '../../application/ports/clock.port';
import { JwtKeyProvider } from './jwt-key-provider';

@Injectable()
export class JwtTokenIssuerAdapter implements TokenIssuerPort {
  constructor(
    private readonly keys: JwtKeyProvider,
    @Inject(CLOCK_PORT) private readonly clock: ClockPort,
  ) {}

  async signAccessToken(accountId: string): Promise<string> {
    const config = loadConfig();
    // Explicit absolute timestamps from the injected clock, not jose's
    // defaults (which read the real system clock directly) — otherwise this
    // adapter is the one piece of the identity feature immune to clock
    // injection, silently defeating time-dependent tests (found via a real
    // test failure: two tokens signed in the same real-world second, for
    // fake-clock times 5 minutes apart, came out byte-identical).
    const issuedAtSeconds = Math.floor(this.clock.now().getTime() / 1000);
    const expiresAtSeconds = issuedAtSeconds + config.auth.accessTokenTtlSeconds;

    return new SignJWT({})
      .setProtectedHeader({ alg: 'EdDSA' })
      .setSubject(accountId)
      .setIssuedAt(issuedAtSeconds)
      .setExpirationTime(expiresAtSeconds)
      .sign(this.keys.getPrivateKey());
  }

  generateRefreshToken(): GeneratedOpaqueToken {
    const raw = randomBytes(32).toString('base64url');
    return { raw, hash: this.hashRefreshToken(raw) };
  }

  hashRefreshToken(raw: string): string {
    // A fast cryptographic hash (not argon2/bcrypt) is correct here — unlike
    // passwords, this token has 256 bits of entropy from randomBytes, so slow
    // hashing to resist brute force is unnecessary (docs/architecture/security-architecture.md).
    return createHash('sha256').update(raw).digest('hex');
  }
}
