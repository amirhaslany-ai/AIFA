import { Inject, Injectable } from '@nestjs/common';
import { InvalidRefreshTokenError } from '../../domain/errors/invalid-refresh-token.error';
import { TOKEN_ISSUER_PORT, type TokenIssuerPort } from '../ports/token-issuer.port';
import {
  REFRESH_TOKEN_REPOSITORY_PORT,
  type RefreshTokenRepositoryPort,
} from '../ports/refresh-token-repository.port';
import { CLOCK_PORT, type ClockPort } from '../ports/clock.port';
import { SessionIssuerService } from '../services/session-issuer.service';
import type { AuthSession } from '../identity.constants';

@Injectable()
export class RefreshSessionUseCase {
  constructor(
    @Inject(TOKEN_ISSUER_PORT) private readonly tokenIssuer: TokenIssuerPort,
    @Inject(REFRESH_TOKEN_REPOSITORY_PORT) private readonly refreshTokens: RefreshTokenRepositoryPort,
    @Inject(CLOCK_PORT) private readonly clock: ClockPort,
    private readonly sessionIssuer: SessionIssuerService,
  ) {}

  async execute(rawRefreshToken: string): Promise<AuthSession> {
    const tokenHash = this.tokenIssuer.hashRefreshToken(rawRefreshToken);
    const record = await this.refreshTokens.findByTokenHash(tokenHash);

    if (!record) {
      throw new InvalidRefreshTokenError('not recognized');
    }

    if (record.revokedAt) {
      // This exact token was already rotated away once before. Someone is
      // presenting a stale token from this lineage — either a replay attack,
      // or a client bug retrying an old token. Either way, per
      // docs/adr/0010-auth-token-strategy.md the entire session family must
      // be revoked, not just this one token, since we can't tell which
      // downstream token (if any) is in an attacker's hands.
      await this.refreshTokens.revokeFamily(record.familyId);
      throw new InvalidRefreshTokenError('reuse of a rotated token detected — session revoked');
    }

    if (record.expiresAt.getTime() <= this.clock.now().getTime()) {
      throw new InvalidRefreshTokenError('expired');
    }

    const { session, recordId } = await this.sessionIssuer.rotateSession(record.accountId, record.familyId);
    await this.refreshTokens.markRotated(record.id, recordId);

    return session;
  }
}
