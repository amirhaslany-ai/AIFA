import type { ProviderHealth } from '@aifa/types';

export const PROVIDER_HEALTH_SOURCE_PORT = Symbol('ProviderHealthSourcePort');

/**
 * What GetSystemHealthUseCase needs from the AI provider layer — a narrow
 * port, not a dependency on @aifa/ai-provider-sdk's full ProviderRegistry API.
 * Implemented by infrastructure/providers/provider-registry.adapter.ts.
 */
export interface ProviderHealthSourcePort {
  checkAll(): Promise<ProviderHealth[]>;
}
