import { describe, expect, it } from 'vitest';
import { FloorRule } from './floor-rule';
import { Money } from '../money';

const context = { accountId: 'acc-1', providerId: 'openai', requestedAt: new Date('2026-07-12T00:00:00.000Z') };

describe('FloorRule', () => {
  it('raises a price below the minimum, and reports as applied', () => {
    const rule = new FloorRule(Money.of(100n, 'USD'));
    const result = rule.apply(Money.of(30n, 'USD'), context);

    expect(result.price.minorUnits).toBe(100n);
    expect(result.applied).toBe(true);
  });

  it('leaves a price at or above the minimum unchanged, and reports as not applied', () => {
    const rule = new FloorRule(Money.of(100n, 'USD'));

    const atFloor = rule.apply(Money.of(100n, 'USD'), context);
    expect(atFloor.price.minorUnits).toBe(100n);
    expect(atFloor.applied).toBe(false);

    const aboveFloor = rule.apply(Money.of(500n, 'USD'), context);
    expect(aboveFloor.price.minorUnits).toBe(500n);
    expect(aboveFloor.applied).toBe(false);
  });

  it('a zero floor never applies (the no-floor-configured default)', () => {
    const rule = new FloorRule(Money.of(0n, 'USD'));
    const result = rule.apply(Money.of(1n, 'USD'), context);

    expect(result.applied).toBe(false);
  });
});
