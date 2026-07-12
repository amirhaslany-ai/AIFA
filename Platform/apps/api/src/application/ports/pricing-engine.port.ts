export const PRICING_ENGINE_PORT = Symbol('PricingEnginePort');

export interface PricingRequest {
  accountId: string;
  providerId: string;
  costMinorUnits: bigint;
  currency: string;
  requestedAt: Date;
}

export interface PricingResult {
  priceMinorUnits: bigint;
  appliedRules: string[];
}

/**
 * docs/adr/0009-pricing-engine-pattern.md. Consumes a raw cost (from the AI
 * Provider Layer's cost reporting, ADR-0007) and produces a customer price —
 * never the reverse; Pricing never estimates AI usage itself.
 */
export interface PricingEnginePort {
  calculatePrice(request: PricingRequest): Promise<PricingResult>;
}
