import { Injectable } from '@nestjs/common';
import type { HealthIndicatorResult } from '@nestjs/terminus';
import type { DependencyHealth } from '@aifa/types';
import type { DependencyHealthSourcePort } from '../../application/ports/dependency-health-source.port';
import { PrismaHealthIndicator } from './prisma.health-indicator';
import { RedisHealthIndicator } from './redis.health-indicator';

function toDependencyHealth(name: string, result: HealthIndicatorResult): DependencyHealth {
  return {
    name,
    status: result[name]?.status === 'up' ? 'healthy' : 'unavailable',
    checkedAt: new Date().toISOString(),
  };
}

@Injectable()
export class DependencyHealthAdapter implements DependencyHealthSourcePort {
  constructor(
    private readonly prismaIndicator: PrismaHealthIndicator,
    private readonly redisIndicator: RedisHealthIndicator,
  ) {}

  async checkAll(): Promise<DependencyHealth[]> {
    const [database, redis] = await Promise.all([
      this.prismaIndicator.check('database'),
      this.redisIndicator.check('redis'),
    ]);

    return [toDependencyHealth('database', database), toDependencyHealth('redis', redis)];
  }
}
