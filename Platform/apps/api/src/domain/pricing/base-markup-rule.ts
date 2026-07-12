import { Money } from '../money';
import type { PricingContext, PricingRule, PricingRuleResult } from './pricing-rule';

/** Rounds up, never down — the platform never loses money to integer-division truncation. */
function ceilDiv(numerator: bigint, denominator: bigint): bigint {
  return (numerator + denominator - 1n) / denominator;
}

/**
 * Always applies (docs/architecture/pricing-architecture.md's rule pipeline
 * step 1). `basisPoints` is an integer (10000 = 1.00x), never a float
 * multiplier, so this stays exact integer arithmetic — the same "never a
 * float" principle as Money/the ledger, applied to pricing too.
 */
export class BaseMarkupRule implements PricingRule {
  readonly id = 'base-markup';

  constructor(private readonly basisPoints: bigint) {
    if (basisPoints <= 0n) {
      throw new Error('BaseMarkupRule basisPoints must be a positive integer');
    }
  }

  apply(currentPrice: Money, _context: PricingContext): PricingRuleResult {
    const marked = Money.of(ceilDiv(currentPrice.minorUnits * this.basisPoints, 10_000n), currentPrice.currency);
    return { price: marked, applied: true };
  }
}
