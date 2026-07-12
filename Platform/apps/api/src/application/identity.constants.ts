/** 30 days — docs/architecture/security-architecture.md's refresh-token lifetime target. */
export const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
}
