export const AUTH_GUARD_PORT = Symbol('AuthGuardPort');

/**
 * The account identity extracted from a verified token. Deliberately minimal —
 * only what use cases need to know "who is calling," never raw JWT claims.
 */
export interface AuthenticatedPrincipal {
  accountId: string;
}

/**
 * Seam for future authentication (docs/architecture/security-architecture.md's
 * JWT strategy, docs/adr/0010-auth-token-strategy.md). No implementation exists
 * yet — no NestJS Guard is bound to this port, and no module references it.
 * It exists so a real implementation (verify signature, check expiry, map the
 * `sub` claim to accountId) can be added as an infrastructure/ adapter without
 * redesigning controllers that will eventually depend on this interface.
 */
export interface AuthGuardPort {
  verify(bearerToken: string): Promise<AuthenticatedPrincipal>;
}
