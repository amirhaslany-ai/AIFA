import { Inject, Injectable } from '@nestjs/common';
import { TOKEN_ISSUER_PORT, type TokenIssuerPort } from '../ports/token-issuer.port';
import {
  REFRESH_TOKEN_REPOSITORY_PORT,
  type RefreshTokenRepositoryPort,
} from '../ports/refresh-token-repository.port';

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject(TOKEN_ISSUER_PORT) private readonly tokenIssuer: TokenIssuerPort,
    @Inject(REFRESH_TOKEN_REPOSITORY_PORT) private readonly refreshTokens: RefreshTokenRepositoryPort,
  ) {}

  async execute(rawRefreshToken: string): Promise<void> {
    const tokenHash = this.tokenIssuer.hashRefreshToken(rawRefreshToken);
    const record = await this.refreshTokens.findByTokenHash(tokenHash);

    // Idempotent: logging out with an already-invalid token is not an error —
    // the caller's goal (no longer being logged in) is already satisfied.
    if (!record) {
      return;
    }

    // Revokes the whole lineage, not just the presented token — logging out
    // ends the session, including any tokens already rotated within it.
    await this.refreshTokens.revokeFamily(record.familyId);
  }
}
