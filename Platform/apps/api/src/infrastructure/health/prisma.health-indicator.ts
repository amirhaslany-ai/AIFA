import { Injectable } from '@nestjs/common';
import { HealthIndicator, type HealthIndicatorResult } from '@nestjs/terminus';
import { prisma } from '@aifa/database';

/**
 * Real database reachability check — fixes the previously-false claim that
 * readiness checked the database. Uses Terminus's
 * HealthIndicator base class directly rather than its HealthCheckService/
 * @HealthCheck() decorator, so the result can be folded into this app's own
 * SystemHealth response shape instead of adopting Terminus's response format
 * wholesale (would be a breaking API change, out of scope for a patch).
 */
@Injectable()
export class PrismaHealthIndicator extends HealthIndicator {
  async check(key: string): Promise<HealthIndicatorResult> {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return this.getStatus(key, true);
    } catch (error) {
      return this.getStatus(key, false, { message: (error as Error).message });
    }
  }
}
