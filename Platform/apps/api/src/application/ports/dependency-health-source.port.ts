import type { DependencyHealth } from '@aifa/types';

export const DEPENDENCY_HEALTH_SOURCE_PORT = Symbol('DependencyHealthSourcePort');

/**
 * What GetSystemHealthUseCase needs to know about infrastructure dependencies
 * (database, cache) — distinct from ProviderHealthSourcePort, which reports on
 * AI providers. Implemented by infrastructure/health/dependency-health.adapter.ts.
 */
export interface DependencyHealthSourcePort {
  checkAll(): Promise<DependencyHealth[]>;
}
