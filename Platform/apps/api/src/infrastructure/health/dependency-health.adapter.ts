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

const HEALTH_CACHE_TTL_MS = 5_000;

/**
 * Caches its result for HEALTH_CACHE_TTL_MS, matching
 * ProviderRegistryAdapter's health-check cache — before this fix, this class
 * issued a live `SELECT 1` and a live Redis `ping()` on every single
 * `/v1/health/ready` call, unlike its sibling. An orchestrator probing
 * readiness every few seconds across N replicas would generate continuous
 * live database/Redis round-trips purely for health-checking.
 */
@Injectable()
export class DependencyHealthAdapter implements DependencyHealthSourcePort {
  private cache: { result: DependencyHealth[]; expiresAt: number } | null = null;

  constructor(
    private readonly prismaIndicator: PrismaHealthIndicator,
    private readonly redisIndicator: RedisHealthIndicator,
  ) {}

  async checkAll(): Promise<DependencyHealth[]> {
    const now = Date.now();

    if (this.cache && this.cache.expiresAt > now) {
      return this.cache.result;
    }

    const [database, redis] = await Promise.all([
      this.prismaIndicator.check('database'),
      this.redisIndicator.check('redis'),
    ]);

    const result = [toDependencyHealth('database', database), toDependencyHealth('redis', redis)];
    this.cache = { result, expiresAt: now + HEALTH_CACHE_TTL_MS };
    return result;
  }
}
