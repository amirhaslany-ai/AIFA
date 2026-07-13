import { Inject, Injectable } from '@nestjs/common';
import type { SystemHealth } from '@aifa/types';
import {
  PROVIDER_HEALTH_SOURCE_PORT,
  type ProviderHealthSourcePort,
} from '../ports/provider-health-source.port';
import {
  DEPENDENCY_HEALTH_SOURCE_PORT,
  type DependencyHealthSourcePort,
} from '../ports/dependency-health-source.port';
import { CLOCK_PORT, type ClockPort } from '../ports/clock.port';

@Injectable()
export class GetSystemHealthUseCase {
  constructor(
    @Inject(PROVIDER_HEALTH_SOURCE_PORT)
    private readonly providerHealthSource: ProviderHealthSourcePort,
    @Inject(DEPENDENCY_HEALTH_SOURCE_PORT)
    private readonly dependencyHealthSource: DependencyHealthSourcePort,
    @Inject(CLOCK_PORT)
    private readonly clock: ClockPort,
  ) {}

  async execute(): Promise<SystemHealth> {
    const [providers, dependencies] = await Promise.all([
      this.providerHealthSource.checkAll(),
      this.dependencyHealthSource.checkAll(),
    ]);

    const status = this.computeStatus(providers, dependencies);

    return {
      status,
      providers,
      dependencies,
      checkedAt: this.clock.now().toISOString(),
    };
  }

  private computeStatus(
    providers: SystemHealth['providers'],
    dependencies: SystemHealth['dependencies'],
  ): SystemHealth['status'] {
    // The database being unreachable means the system cannot function
    // regardless of provider health — an orchestrator must not route traffic
    // here (readiness previously ignored this entirely).
    const databaseDown = dependencies.some((d) => d.name === 'database' && d.status === 'unavailable');
    const allProvidersDown = providers.length > 0 && providers.every((p) => p.status === 'unavailable');

    if (databaseDown || allProvidersDown) {
      return 'down';
    }

    const everythingHealthy =
      providers.every((p) => p.status === 'healthy') && dependencies.every((d) => d.status === 'healthy');

    return everythingHealthy ? 'ok' : 'degraded';
  }
}
