import type { Money } from '../money';
import type { PricingContext, PricingRule } from './pricing-rule';

export interface PricingOutcome {
  price: Money;
  appliedRules: string[];
}

/**
 * Ordered rule pipeline (docs/adr/0009-pricing-engine-pattern.md) — base
 * markup, then campaign/discount rules (none exist yet — no fake campaign
 * data invented here), then a floor. New rule types are added by
 * implementing PricingRule and appending to the ordered list passed in,
 * mirroring how ProviderRegistry treats "which providers exist" as
 * config/composition, not something this class decides.
 */
export class PricingPipeline {
  constructor(private readonly rules: PricingRule[]) {}

  run(cost: Money, context: PricingContext): PricingOutcome {
    let current = cost;
    const appliedRules: string[] = [];

    for (const rule of this.rules) {
      const result = rule.apply(current, context);
      current = result.price;
      if (result.applied) {
        appliedRules.push(rule.id);
      }
    }

    return { price: current, appliedRules };
  }
}
