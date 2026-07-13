import { describe, expect, it, vi } from 'vitest';
import type { HealthIndicatorResult } from '@nestjs/terminus';
import { DependencyHealthAdapter } from './dependency-health.adapter';
import type { PrismaHealthIndicator } from './prisma.health-indicator';
import type { RedisHealthIndicator } from './redis.health-indicator';

function fakeIndicator(key: string, up: boolean): { check: (key: string) => Promise<HealthIndicatorResult> } {
  return {
    check: vi.fn(async () => ({ [key]: { status: up ? 'up' : 'down' } }) as HealthIndicatorResult),
  };
}

describe('DependencyHealthAdapter', () => {
  it('reports healthy/unavailable per dependency from the underlying indicators', async () => {
    const prisma = fakeIndicator('database', true);
    const redis = fakeIndicator('redis', false);
    const adapter = new DependencyHealthAdapter(
      prisma as unknown as PrismaHealthIndicator,
      redis as unknown as RedisHealthIndicator,
    );

    const result = await adapter.checkAll();

    expect(result).toEqual([
      { name: 'database', status: 'healthy', checkedAt: expect.any(String) },
      { name: 'redis', status: 'unavailable', checkedAt: expect.any(String) },
    ]);
  });

  it('caches the result and does not re-check the indicators within the TTL', async () => {
    const prisma = fakeIndicator('database', true);
    const redis = fakeIndicator('redis', true);
    const adapter = new DependencyHealthAdapter(
      prisma as unknown as PrismaHealthIndicator,
      redis as unknown as RedisHealthIndicator,
    );

    await adapter.checkAll();
    await adapter.checkAll();
    await adapter.checkAll();

    expect(prisma.check).toHaveBeenCalledTimes(1);
    expect(redis.check).toHaveBeenCalledTimes(1);
  });

  it('re-checks the indicators once the cache expires', async () => {
    vi.useFakeTimers();
    try {
      const prisma = fakeIndicator('database', true);
      const redis = fakeIndicator('redis', true);
      const adapter = new DependencyHealthAdapter(
        prisma as unknown as PrismaHealthIndicator,
        redis as unknown as RedisHealthIndicator,
      );

      await adapter.checkAll();
      vi.advanceTimersByTime(5_001);
      await adapter.checkAll();

      expect(prisma.check).toHaveBeenCalledTimes(2);
      expect(redis.check).toHaveBeenCalledTimes(2);
    } finally {
      vi.useRealTimers();
    }
  });
});
