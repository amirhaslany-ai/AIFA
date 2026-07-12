import { randomUUID } from 'node:crypto';
import { Inject, Injectable } from '@nestjs/common';
import { TOKEN_ISSUER_PORT, type TokenIssuerPort } from '../ports/token-issuer.port';
import {
  REFRESH_TOKEN_REPOSITORY_PORT,
  type RefreshTokenRepositoryPort,
} from '../ports/refresh-token-repository.port';
import { CLOCK_PORT, type ClockPort } from '../ports/clock.port';
import { REFRESH_TOKEN_TTL_MS, type AuthSession } from '../identity.constants';

/**
 * Shared by RegisterAccountUseCase, LoginUseCase, and RefreshSessionUseCase —
 * issuing a token pair is identical in all three (the only difference is
 * whether a new `familyId` starts a session lineage or an existing one
 * continues it). Extracted specifically so this security-sensitive logic is
 * never duplicated (see docs/adr/0010-auth-token-strategy.md).
 */
@Injectable()
export class SessionIssuerService {
  constructor(
    @Inject(TOKEN_ISSUER_PORT) private readonly tokenIssuer: TokenIssuerPort,
    @Inject(REFRESH_TOKEN_REPOSITORY_PORT) private readonly refreshTokens: RefreshTokenRepositoryPort,
    @Inject(CLOCK_PORT) private readonly clock: ClockPort,
  ) {}

  /** Starts a brand-new session lineage (register, login). */
  async issueNewSession(accountId: string): Promise<AuthSession> {
    return (await this.issue(accountId, randomUUID())).session;
  }

  /** Continues an existing session lineage (refresh rotation). */
  async rotateSession(accountId: string, familyId: string): Promise<{ session: AuthSession; recordId: string }> {
    return this.issue(accountId, familyId);
  }

  private async issue(
    accountId: string,
    familyId: string,
  ): Promise<{ session: AuthSession; recordId: string }> {
    const accessToken = await this.tokenIssuer.signAccessToken(accountId);
    const refreshToken = this.tokenIssuer.generateRefreshToken();
    const expiresAt = new Date(this.clock.now().getTime() + REFRESH_TOKEN_TTL_MS);

    const record = await this.refreshTokens.create({
      accountId,
      tokenHash: refreshToken.hash,
      familyId,
      expiresAt,
    });

    return {
      session: { accessToken, refreshToken: refreshToken.raw, refreshTokenExpiresAt: expiresAt },
      recordId: record.id,
    };
  }
}
