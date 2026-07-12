import { Module } from '@nestjs/common';
import { IdentityModule } from './identity.module';
import { WalletController } from './interfaces/http/controllers/wallet.controller';
import { CreditWalletUseCase } from './application/use-cases/credit-wallet.use-case';
import { ReserveFundsUseCase } from './application/use-cases/reserve-funds.use-case';
import { SettleReservationUseCase } from './application/use-cases/settle-reservation.use-case';
import { RollbackReservationUseCase } from './application/use-cases/rollback-reservation.use-case';
import { GetWalletBalanceUseCase } from './application/use-cases/get-wallet-balance.use-case';
import { WALLET_REPOSITORY_PORT } from './application/ports/wallet-repository.port';
import { CLOCK_PORT } from './application/ports/clock.port';
import { PrismaWalletRepository } from './infrastructure/persistence/prisma-wallet.repository';
import { SystemClockAdapter } from './infrastructure/clock/system-clock.adapter';

/**
 * The Billing bounded context (docs/architecture/domain-boundaries.md,
 * docs/adr/0008-wallet-ledger-pattern.md). Only GetWalletBalanceUseCase is
 * exposed via HTTP (wallet.controller.ts) — the other four use cases are
 * real and wired here so a future payment-webhook handler or the Chat
 * feature can inject and call them, but are deliberately not reachable via a
 * public endpoint yet (see wallet.controller.ts's doc comment for why).
 */
@Module({
  imports: [IdentityModule], // for JwtAuthGuard, protecting WalletController (exported by IdentityModule)
  controllers: [WalletController],
  providers: [
    CreditWalletUseCase,
    ReserveFundsUseCase,
    SettleReservationUseCase,
    RollbackReservationUseCase,
    GetWalletBalanceUseCase,
    { provide: WALLET_REPOSITORY_PORT, useClass: PrismaWalletRepository },
    { provide: CLOCK_PORT, useClass: SystemClockAdapter },
  ],
  // WALLET_REPOSITORY_PORT and CLOCK_PORT are also exported (not just the use
  // cases) so ChatModule's SendChatMessageUseCase can read the balance
  // pre-check and call Wallet.debit() directly — Chat's debit-after-call
  // flow doesn't fit any of the four existing use cases above (see
  // docs/adr/0014-chat-orchestration.md), so it composes the port itself
  // rather than getting a new single-purpose DebitWalletUseCase that would
  // only ever have one caller.
  exports: [
    CreditWalletUseCase,
    ReserveFundsUseCase,
    SettleReservationUseCase,
    RollbackReservationUseCase,
    WALLET_REPOSITORY_PORT,
    CLOCK_PORT,
  ],
})
export class WalletModule {}
