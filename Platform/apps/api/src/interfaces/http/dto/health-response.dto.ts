import { ApiProperty } from '@nestjs/swagger';
import type { DependencyHealth, ProviderHealth, ProviderStatus, SystemHealth } from '@aifa/types';

export class ProviderHealthDto implements ProviderHealth {
  @ApiProperty()
  providerId!: string;

  @ApiProperty({ enum: ['healthy', 'degraded', 'unavailable'] })
  status!: ProviderStatus;

  @ApiProperty()
  checkedAt!: string;
}

export class DependencyHealthDto implements DependencyHealth {
  @ApiProperty({ description: 'e.g. "database", "redis"' })
  name!: string;

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

  @ApiProperty({ type: [DependencyHealthDto] })
  dependencies!: DependencyHealthDto[];

  @ApiProperty()
  checkedAt!: string;
}
