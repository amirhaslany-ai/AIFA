import type { ProviderId } from '@aifa/types';

export const PROVIDER_COST_SOURCE_PORT = Symbol('ProviderCostSourcePort');

export interface ProviderCostRates {
  costPerInputTokenMicros: bigint;
  costPerOutputTokenMicros: bigint;
}

/**
 * What a future cost-calculation step (feeding PricingEnginePort, ADR-0007's
 * "cost to us" layer) needs from Provider Access — a narrow port, not a
 * dependency on @aifa/database's AiProviderConfig model directly.
 * Implemented by infrastructure/providers/provider-registry.adapter.ts.
 */
export interface ProviderCostSourcePort {
  /** Null if the provider id has no configured cost rates (e.g. a stub provider). */
  getCostRates(providerId: ProviderId): Promise<ProviderCostRates | null>;
}
