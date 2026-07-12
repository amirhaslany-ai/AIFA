import { describe, expect, it } from 'vitest';
import { PricingPipeline } from './pricing-pipeline';
import { BaseMarkupRule } from './base-markup-rule';
import { FloorRule } from './floor-rule';
import { Money } from '../money';

const context = { accountId: 'acc-1', providerId: 'openai', requestedAt: new Date('2026-07-12T00:00:00.000Z') };

describe('PricingPipeline', () => {
  it('runs rules in order, each seeing the running price from the one before it', () => {
    const pipeline = new PricingPipeline([
      new BaseMarkupRule(13_000n), // 1.3x
      new FloorRule(Money.of(50n, 'USD')),
    ]);

    // cost 10 -> markup -> 13 -> above floor(50)? no, 13 < 50 -> floor raises to 50.
    const outcome = pipeline.run(Money.of(10n, 'USD'), context);

    expect(outcome.price.minorUnits).toBe(50n);
    expect(outcome.appliedRules).toEqual(['base-markup', 'floor']);
  });

  it('only records rules that actually applied', () => {
    const pipeline = new PricingPipeline([
      new BaseMarkupRule(13_000n),
      new FloorRule(Money.of(1n, 'USD')), // trivially satisfied, won't fire
    ]);

    const outcome = pipeline.run(Money.of(1000n, 'USD'), context);

    expect(outcome.price.minorUnits).toBe(1300n);
    expect(outcome.appliedRules).toEqual(['base-markup']); // floor did not fire
  });

  it('an empty pipeline is a no-op passthrough', () => {
    const pipeline = new PricingPipeline([]);
    const outcome = pipeline.run(Money.of(500n, 'USD'), context);

    expect(outcome.price.minorUnits).toBe(500n);
    expect(outcome.appliedRules).toEqual([]);
  });
});
