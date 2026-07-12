import { Injectable, type OnModuleDestroy } from '@nestjs/common';
import { HealthIndicator, type HealthIndicatorResult } from '@nestjs/terminus';
import Redis from 'ioredis';
import { loadConfig } from '@aifa/config';

/**
 * Real Redis reachability check — see prisma.health-indicator.ts for why this
 * uses Terminus's HealthIndicator base class directly rather than
 * HealthCheckService. `enableOfflineQueue: false` + a short connect timeout
 * mean `ping()` fails fast instead of queuing/hanging when Redis is down —
 * a health check that can itself hang is worse than one that reports down.
 */
@Injectable()
export class RedisHealthIndicator extends HealthIndicator implements OnModuleDestroy {
  private readonly client = new Redis(loadConfig().redis.url, {
    lazyConnect: true,
    maxRetriesPerRequest: 1,
    enableOfflineQueue: false,
    connectTimeout: 2_000,
  });

  async check(key: string): Promise<HealthIndicatorResult> {
    try {
      if (this.client.status === 'wait' || this.client.status === 'end') {
        await this.client.connect();
      }
      await this.client.ping();
      return this.getStatus(key, true);
    } catch (error) {
      return this.getStatus(key, false, { message: (error as Error).message });
    }
  }

  async onModuleDestroy(): Promise<void> {
    this.client.disconnect();
  }
}
