import type { Money } from '../money';
import type { PricingContext, PricingRule, PricingRuleResult } from './pricing-rule';

/**
 * docs/architecture/pricing-architecture.md's rule pipeline step 3 — price
 * is never less than a configurable minimum. Only "applies" (for the audit
 * trail) when it actually raises the price; a no-op floor check isn't a
 * rule that fired.
 */
export class FloorRule implements PricingRule {
  readonly id = 'floor';

  constructor(private readonly minimum: Money) {}

  apply(currentPrice: Money, _context: PricingContext): PricingRuleResult {
    if (currentPrice.minorUnits < this.minimum.minorUnits) {
      return { price: this.minimum, applied: true };
    }
    return { price: currentPrice, applied: false };
  }
}
