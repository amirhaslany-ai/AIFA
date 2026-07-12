import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { RuleBasedPricingEngineAdapter } from './rule-based-pricing-engine.adapter';

describe('RuleBasedPricingEngineAdapter', () => {
  const originalMarkup = process.env.PRICING_BASE_MARKUP_BASIS_POINTS;
  const originalFloor = process.env.PRICING_MINIMUM_PRICE_MINOR_UNITS;

  beforeEach(() => {
    process.env.PRICING_BASE_MARKUP_BASIS_POINTS = '15000'; // 1.5x, distinct from the 1.3x default
    process.env.PRICING_MINIMUM_PRICE_MINOR_UNITS = '10';
  });

  afterEach(() => {
    if (originalMarkup === undefined) delete process.env.PRICING_BASE_MARKUP_BASIS_POINTS;
    else process.env.PRICING_BASE_MARKUP_BASIS_POINTS = originalMarkup;
    if (originalFloor === undefined) delete process.env.PRICING_MINIMUM_PRICE_MINOR_UNITS;
    else process.env.PRICING_MINIMUM_PRICE_MINOR_UNITS = originalFloor;
  });

  it('reads the configured markup and floor, not hardcoded defaults', async () => {
    const adapter = new RuleBasedPricingEngineAdapter();

    const result = await adapter.calculatePrice({
      accountId: 'acc-1',
      providerId: 'openai',
      costMinorUnits: 100n,
      currency: 'USD',
      requestedAt: new Date(),
    });

    // 100 * 1.5 = 150, above the floor(10), so only base-markup fires.
    expect(result.priceMinorUnits).toBe(150n);
    expect(result.appliedRules).toEqual(['base-markup']);
  });

  it('applies the configured floor when the marked-up price is still below it', async () => {
    const adapter = new RuleBasedPricingEngineAdapter();

    const result = await adapter.calculatePrice({
      accountId: 'acc-1',
      providerId: 'openai',
      costMinorUnits: 1n, // 1 * 1.5 = 1.5 -> ceil 2, below the floor(10)
      currency: 'USD',
      requestedAt: new Date(),
    });

    expect(result.priceMinorUnits).toBe(10n);
    expect(result.appliedRules).toEqual(['base-markup', 'floor']);
  });
});
