import { describe, expect, it } from 'vitest';
import { GetSystemHealthUseCase } from './get-system-health.use-case';
import type { ProviderHealthSourcePort } from '../ports/provider-health-source.port';
import type { DependencyHealthSourcePort } from '../ports/dependency-health-source.port';
import type { ClockPort } from '../ports/clock.port';

const fixedClock: ClockPort = { now: () => new Date('2026-07-12T00:00:00.000Z') };

const healthyDependencies: DependencyHealthSourcePort = {
  checkAll: async () => [
    { name: 'database', status: 'healthy', checkedAt: 'x' },
    { name: 'redis', status: 'healthy', checkedAt: 'x' },
  ],
};

describe('GetSystemHealthUseCase', () => {
  it('reports "ok" when every provider and dependency is healthy', async () => {
    const providers: ProviderHealthSourcePort = {
      checkAll: async () => [
        { providerId: 'a', status: 'healthy', checkedAt: 'x' },
        { providerId: 'b', status: 'healthy', checkedAt: 'x' },
      ],
    };
    const useCase = new GetSystemHealthUseCase(providers, healthyDependencies, fixedClock);

    const result = await useCase.execute();

    expect(result.status).toBe('ok');
    expect(result.checkedAt).toBe('2026-07-12T00:00:00.000Z');
  });

  it('reports "degraded" when some but not all providers are unavailable', async () => {
    const providers: ProviderHealthSourcePort = {
      checkAll: async () => [
        { providerId: 'a', status: 'healthy', checkedAt: 'x' },
        { providerId: 'b', status: 'unavailable', checkedAt: 'x' },
      ],
    };
    const useCase = new GetSystemHealthUseCase(providers, healthyDependencies, fixedClock);

    const result = await useCase.execute();

    expect(result.status).toBe('degraded');
  });

  it('reports "down" when every provider is unavailable', async () => {
    const providers: ProviderHealthSourcePort = {
      checkAll: async () => [{ providerId: 'a', status: 'unavailable', checkedAt: 'x' }],
    };
    const useCase = new GetSystemHealthUseCase(providers, healthyDependencies, fixedClock);

    const result = await useCase.execute();

    expect(result.status).toBe('down');
  });

  it('reports "down" when the database is unavailable, even if every provider is healthy', async () => {
    const providers: ProviderHealthSourcePort = {
      checkAll: async () => [{ providerId: 'a', status: 'healthy', checkedAt: 'x' }],
    };
    const dependencies: DependencyHealthSourcePort = {
      checkAll: async () => [
        { name: 'database', status: 'unavailable', checkedAt: 'x' },
        { name: 'redis', status: 'healthy', checkedAt: 'x' },
      ],
    };
    const useCase = new GetSystemHealthUseCase(providers, dependencies, fixedClock);

    const result = await useCase.execute();

    // Regression guard for 04_PATCH_LIST.md P1-3: readiness must not report
    // "ok"/"degraded" while the database is unreachable.
    expect(result.status).toBe('down');
  });

  it('reports "degraded" when redis (not database) is unavailable', async () => {
    const providers: ProviderHealthSourcePort = {
      checkAll: async () => [{ providerId: 'a', status: 'healthy', checkedAt: 'x' }],
    };
    const dependencies: DependencyHealthSourcePort = {
      checkAll: async () => [
        { name: 'database', status: 'healthy', checkedAt: 'x' },
        { name: 'redis', status: 'unavailable', checkedAt: 'x' },
      ],
    };
    const useCase = new GetSystemHealthUseCase(providers, dependencies, fixedClock);

    const result = await useCase.execute();

    expect(result.status).toBe('degraded');
  });
});
