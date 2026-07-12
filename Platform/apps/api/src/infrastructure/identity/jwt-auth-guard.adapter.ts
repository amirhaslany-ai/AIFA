import { Injectable } from '@nestjs/common';
import { jwtVerify } from 'jose';
import type { AuthGuardPort, AuthenticatedPrincipal } from '../../application/ports/auth-guard.port';
import { JwtKeyProvider } from './jwt-key-provider';

/**
 * Real implementation of the AuthGuardPort seam (application/ports/auth-guard.port.ts),
 * verified against JwtKeyProvider's public key. See docs/adr/0010-auth-token-strategy.md.
 */
@Injectable()
export class JwtAuthGuardAdapter implements AuthGuardPort {
  constructor(private readonly keys: JwtKeyProvider) {}

  async verify(bearerToken: string): Promise<AuthenticatedPrincipal> {
    const { payload } = await jwtVerify(bearerToken, this.keys.getPublicKey());

    if (typeof payload.sub !== 'string' || payload.sub.length === 0) {
      throw new Error('Access token has no subject claim');
    }

    return { accountId: payload.sub };
  }
}
