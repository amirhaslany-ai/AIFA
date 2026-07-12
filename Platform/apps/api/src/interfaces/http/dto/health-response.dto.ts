import { ApiProperty } from '@nestjs/swagger';
import type { ProviderHealth, ProviderStatus, SystemHealth } from '@aifa/types';

export class ProviderHealthDto implements ProviderHealth {
  @ApiProperty()
  providerId!: string;

  @ApiProperty({ enum: ['healthy', 'degraded', 'unavailable'] })
  status!: ProviderStatus;

  @ApiProperty()
  checkedAt!: string;
}

export class HealthResponseDto implements SystemHealth {
  @ApiProperty({ enum: ['ok', 'degraded', 'down'] })
  status!: 'ok' | 'degraded' | 'down';

  @ApiProperty({ type: [ProviderHealthDto] })
  providers!: ProviderHealthDto[];

  @ApiProperty()
  checkedAt!: string;
}
