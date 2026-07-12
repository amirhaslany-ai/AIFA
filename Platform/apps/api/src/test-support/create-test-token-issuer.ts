import { JwtKeyProvider } from '../infrastructure/identity/jwt-key-provider';
import { JwtTokenIssuerAdapter } from '../infrastructure/identity/jwt-token-issuer.adapter';
import { JwtAuthGuardAdapter } from '../infrastructure/identity/jwt-auth-guard.adapter';
import type { ClockPort } from '../application/ports/clock.port';

/**
 * Builds a REAL token issuer + guard sharing a real (ephemeral, test-only)
 * Ed25519 keypair — used by use-case tests so they exercise actual JWT
 * signing/verification, not a mock of the crypto itself.
 */
export async function createTestTokenIssuer(
  clock: ClockPort,
): Promise<{ issuer: JwtTokenIssuerAdapter; guard: JwtAuthGuardAdapter }> {
  const keys = new JwtKeyProvider();
  await keys.onModuleInit();
  return { issuer: new JwtTokenIssuerAdapter(keys, clock), guard: new JwtAuthGuardAdapter(keys) };
}
