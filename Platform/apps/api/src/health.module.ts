import { Module } from '@nestjs/common';
import { HealthController } from './interfaces/http/controllers/health.controller';
import { GetSystemHealthUseCase } from './application/use-cases/get-system-health.use-case';
import { PROVIDER_HEALTH_SOURCE_PORT } from './application/ports/provider-health-source.port';
import { DEPENDENCY_HEALTH_SOURCE_PORT } from './application/ports/dependency-health-source.port';
import { CLOCK_PORT } from './application/ports/clock.port';
import { ProviderRegistryAdapter } from './infrastructure/providers/provider-registry.adapter';
import { SystemClockAdapter } from './infrastructure/clock/system-clock.adapter';
import { DependencyHealthAdapter } from './infrastructure/health/dependency-health.adapter';
import { PrismaHealthIndicator } from './infrastructure/health/prisma.health-indicator';
import { RedisHealthIndicator } from './infrastructure/health/redis.health-indicator';

/**
 * The Platform/System bounded context (docs/architecture/domain-boundaries.md).
 * Wires interfaces -> application -> infrastructure for this milestone's one
 * fully-implemented vertical slice. Port bindings are the single place a
 * concrete adapter is chosen — swap ProviderRegistryAdapter for a different
 * implementation here without touching the use case or controller.
 */
@Module({
  controllers: [HealthController],
  providers: [
    GetSystemHealthUseCase,
    { provide: PROVIDER_HEALTH_SOURCE_PORT, useClass: ProviderRegistryAdapter },
    { provide: DEPENDENCY_HEALTH_SOURCE_PORT, useClass: DependencyHealthAdapter },
    { provide: CLOCK_PORT, useClass: SystemClockAdapter },
    PrismaHealthIndicator,
    RedisHealthIndicator,
  ],
})
export class HealthModule {}
