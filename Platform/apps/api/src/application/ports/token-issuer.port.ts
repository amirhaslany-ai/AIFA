export const TOKEN_ISSUER_PORT = Symbol('TokenIssuerPort');

export interface GeneratedOpaqueToken {
  /** Returned to the client once, never persisted. */
  raw: string;
  /** What actually gets stored (docs/adr/0010-auth-token-strategy.md). */
  hash: string;
}

/**
 * Issuance side of docs/adr/0010-auth-token-strategy.md — distinct from
 * AuthGuardPort (application/ports/auth-guard.port.ts), which is the
 * verification side used by the HTTP guard on protected routes. Behind a
 * port (not a plain util) because token generation is non-deterministic —
 * same reasoning as ClockPort.
 */
export interface TokenIssuerPort {
  signAccessToken(accountId: string): Promise<string>;
  generateRefreshToken(): GeneratedOpaqueToken;
  hashRefreshToken(raw: string): string;
}
