import { Inject, Injectable } from '@nestjs/common';
import type { SystemHealth } from '@aifa/types';
import {
  PROVIDER_HEALTH_SOURCE_PORT,
  type ProviderHealthSourcePort,
} from '../ports/provider-health-source.port';
import { CLOCK_PORT, type ClockPort } from '../ports/clock.port';

@Injectable()
export class GetSystemHealthUseCase {
  constructor(
    @Inject(PROVIDER_HEALTH_SOURCE_PORT)
    private readonly providerHealthSource: ProviderHealthSourcePort,
    @Inject(CLOCK_PORT)
    private readonly clock: ClockPort,
  ) {}

  async execute(): Promise<SystemHealth> {
    const providers = await this.providerHealthSource.checkAll();

    const status: SystemHealth['status'] = providers.every((p) => p.status === 'healthy')
      ? 'ok'
      : providers.every((p) => p.status === 'unavailable')
        ? 'down'
        : 'degraded';

    return {
      status,
      providers,
      checkedAt: this.clock.now().toISOString(),
    };
  }
}
