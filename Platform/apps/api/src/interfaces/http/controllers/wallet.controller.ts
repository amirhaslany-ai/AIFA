import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetWalletBalanceUseCase } from '../../../application/use-cases/get-wallet-balance.use-case';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentAccount } from '../decorators/current-account.decorator';
import type { AuthenticatedPrincipal } from '../../../application/ports/auth-guard.port';
import { toWalletBalanceResponseDto, WalletBalanceResponseDto } from '../dto/wallet.dto';

/**
 * Deliberately exposes ONLY a balance read. `CreditWalletUseCase`,
 * `ReserveFundsUseCase`, `SettleReservationUseCase`, and
 * `RollbackReservationUseCase` are real, tested, and wired into DI (see
 * wallet.module.ts) but are NOT exposed as public endpoints here — see
 * docs/architecture/wallet-architecture.md's credit flow ("Payment/grant
 * confirmed — external event") and the fact that reserve/settle amounts must
 * come from real usage measurement, not a client-supplied number. Exposing
 * them as self-service HTTP endpoints today, before a payment webhook or
 * Provider Integration/Chat exists to call them for real reasons, would let
 * any authenticated caller credit themselves arbitrary funds or settle a
 * reservation for whatever amount they choose — a real vulnerability, not a
 * missing feature. They'll be invoked by the payment-webhook handler and the
 * Chat use case respectively once those are built.
 */
@ApiTags('wallet')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wallet')
export class WalletController {
  constructor(private readonly getWalletBalance: GetWalletBalanceUseCase) {}

  @Get()
  @ApiOperation({ summary: "The current account's wallet balance." })
  @ApiResponse({ status: 200, type: WalletBalanceResponseDto })
  @ApiResponse({ status: 404, description: 'No wallet exists yet for this account (nothing credited it).' })
  async balance(@CurrentAccount() principal: AuthenticatedPrincipal): Promise<WalletBalanceResponseDto> {
    const result = await this.getWalletBalance.execute(principal.accountId);
    return toWalletBalanceResponseDto(result);
  }
}
