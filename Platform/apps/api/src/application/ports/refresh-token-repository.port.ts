export const REFRESH_TOKEN_REPOSITORY_PORT = Symbol('RefreshTokenRepositoryPort');

export interface RefreshTokenRecord {
  id: string;
  accountId: string;
  tokenHash: string;
  familyId: string;
  revokedAt: Date | null;
  replacedBy: string | null;
  expiresAt: Date;
  createdAt: Date;
}

/**
 * Rotation-on-use + reuse-detection (docs/adr/0010-auth-token-strategy.md,
 * docs/architecture/security-architecture.md). `familyId` groups a lineage of
 * rotated tokens from one original login — reusing an already-rotated token
 * revokes the whole family, not just that one token.
 */
export interface RefreshTokenRepositoryPort {
  create(record: {
    accountId: string;
    tokenHash: string;
    familyId: string;
    expiresAt: Date;
  }): Promise<RefreshTokenRecord>;
  findByTokenHash(tokenHash: string): Promise<RefreshTokenRecord | null>;
  markRotated(id: string, replacedById: string): Promise<void>;
  revokeFamily(familyId: string): Promise<void>;
}
