import { ApiProperty } from '@nestjs/swagger';
import type { WalletBalanceResult } from '../../../application/use-cases/credit-wallet.use-case';

export class WalletBalanceResponseDto implements Omit<WalletBalanceResult, 'balanceMinorUnits'> {
  @ApiProperty()
  walletId!: string;

  @ApiProperty({ description: 'Integer string, minor units (e.g. cents) — bigint does not serialize to JSON directly' })
  balanceMinorUnits!: string;

  @ApiProperty()
  currency!: string;
}

export function toWalletBalanceResponseDto(result: WalletBalanceResult): WalletBalanceResponseDto {
  return {
    walletId: result.walletId,
    balanceMinorUnits: result.balanceMinorUnits.toString(),
    currency: result.currency,
  };
}
