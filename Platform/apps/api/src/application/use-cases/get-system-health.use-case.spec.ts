import { describe, expect, it } from 'vitest';
import { GetSystemHealthUseCase } from './get-system-health.use-case';
import type { ProviderHealthSourcePort } from '../ports/provider-health-source.port';
import type { ClockPort } from '../ports/clock.port';

const fixedClock: ClockPort = { now: () => new Date('2026-07-12T00:00:00.000Z') };

describe('GetSystemHealthUseCase', () => {
  it('reports "ok" when every provider is healthy', async () => {
    const source: ProviderHealthSourcePort = {
      checkAll: async () => [
        { providerId: 'a', status: 'healthy', checkedAt: 'x' },
        { providerId: 'b', status: 'healthy', checkedAt: 'x' },
      ],
    };
    const useCase = new GetSystemHealthUseCase(source, fixedClock);

    const result = await useCase.execute();

    expect(result.status).toBe('ok');
    expect(result.checkedAt).toBe('2026-07-12T00:00:00.000Z');
  });

  it('reports "degraded" when some but not all providers are unavailable', async () => {
    const source: ProviderHealthSourcePort = {
      checkAll: async () => [
        { providerId: 'a', status: 'healthy', checkedAt: 'x' },
        { providerId: 'b', status: 'unavailable', checkedAt: 'x' },
      ],
    };
    const useCase = new GetSystemHealthUseCase(source, fixedClock);

    const result = await useCase.execute();

    expect(result.status).toBe('degraded');
  });

  it('reports "down" when every provider is unavailable', async () => {
    const source: ProviderHealthSourcePort = {
      checkAll: async () => [{ providerId: 'a', status: 'unavailable', checkedAt: 'x' }],
    };
    const useCase = new GetSystemHealthUseCase(source, fixedClock);

    const result = await useCase.execute();

    expect(result.status).toBe('down');
  });
});
