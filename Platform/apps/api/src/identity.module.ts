import { Module } from '@nestjs/common';
import { AuthController } from './interfaces/http/controllers/auth.controller';
import { RegisterAccountUseCase } from './application/use-cases/register-account.use-case';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { RefreshSessionUseCase } from './application/use-cases/refresh-session.use-case';
import { LogoutUseCase } from './application/use-cases/logout.use-case';
import { SessionIssuerService } from './application/services/session-issuer.service';
import { ACCOUNT_REPOSITORY_PORT } from './application/ports/account-repository.port';
import { PASSWORD_HASHER_PORT } from './application/ports/password-hasher.port';
import { TOKEN_ISSUER_PORT } from './application/ports/token-issuer.port';
import { REFRESH_TOKEN_REPOSITORY_PORT } from './application/ports/refresh-token-repository.port';
import { AUTH_GUARD_PORT } from './application/ports/auth-guard.port';
import { CLOCK_PORT } from './application/ports/clock.port';
import { PrismaAccountRepository } from './infrastructure/persistence/prisma-account.repository';
import { PrismaRefreshTokenRepository } from './infrastructure/persistence/prisma-refresh-token.repository';
import { Argon2PasswordHasherAdapter } from './infrastructure/identity/argon2-password-hasher.adapter';
import { JwtTokenIssuerAdapter } from './infrastructure/identity/jwt-token-issuer.adapter';
import { JwtAuthGuardAdapter } from './infrastructure/identity/jwt-auth-guard.adapter';
import { JwtKeyProvider } from './infrastructure/identity/jwt-key-provider';
import { JwtAuthGuard } from './interfaces/http/guards/jwt-auth.guard';
import { SystemClockAdapter } from './infrastructure/clock/system-clock.adapter';

/**
 * The Identity bounded context (docs/architecture/domain-boundaries.md) —
 * register/login/refresh/logout, real argon2id + Ed25519 JWTs, no stubs.
 * See docs/adr/0010-auth-token-strategy.md.
 */
@Module({
  controllers: [AuthController],
  providers: [
    RegisterAccountUseCase,
    LoginUseCase,
    RefreshSessionUseCase,
    LogoutUseCase,
    SessionIssuerService,
    JwtAuthGuard,
    JwtKeyProvider,
    { provide: ACCOUNT_REPOSITORY_PORT, useClass: PrismaAccountRepository },
    { provide: REFRESH_TOKEN_REPOSITORY_PORT, useClass: PrismaRefreshTokenRepository },
    { provide: PASSWORD_HASHER_PORT, useClass: Argon2PasswordHasherAdapter },
    { provide: TOKEN_ISSUER_PORT, useClass: JwtTokenIssuerAdapter },
    { provide: AUTH_GUARD_PORT, useClass: JwtAuthGuardAdapter },
    { provide: CLOCK_PORT, useClass: SystemClockAdapter },
  ],
  // Both must be exported, not just JwtAuthGuard: a cross-module @UseGuards()
  // consumer (WalletModule) re-resolves the guard's own constructor
  // dependencies (AUTH_GUARD_PORT) rather than reusing a fully-built
  // singleton — exporting the class alone produced "Nest can't resolve
  // dependencies of the JwtAuthGuard... Symbol(AuthGuardPort)" even with
  // WalletModule importing this module. Confirmed by reproducing the boot
  // failure and fixing it by adding AUTH_GUARD_PORT here.
  exports: [JwtAuthGuard, AUTH_GUARD_PORT],
})
export class IdentityModule {}
