import type { Money } from '../money';

export interface PricingContext {
  accountId: string;
  providerId: string;
  requestedAt: Date;
}

export interface PricingRuleResult {
  price: Money;
  /** Did this rule actually change/gate the price — feeds the appliedRules audit trail. */
  applied: boolean;
}

/**
 * docs/adr/0009-pricing-engine-pattern.md: an ordered rule pipeline, not an
 * unordered "first match wins" set — each rule sees the running price
 * produced by the rule before it.
 */
export interface PricingRule {
  readonly id: string;
  apply(currentPrice: Money, context: PricingContext): PricingRuleResult;
}
