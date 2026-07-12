import { describe, expect, it } from 'vitest';
import { BaseMarkupRule } from './base-markup-rule';
import { Money } from '../money';

const context = { accountId: 'acc-1', providerId: 'openai', requestedAt: new Date('2026-07-12T00:00:00.000Z') };

describe('BaseMarkupRule', () => {
  it('applies a 1.3x markup (13000 basis points)', () => {
    const rule = new BaseMarkupRule(13_000n);
    const result = rule.apply(Money.of(1000n, 'USD'), context);

    expect(result.price.minorUnits).toBe(1300n);
    expect(result.applied).toBe(true);
  });

  it('applies a no-op 1.0x markup (10000 basis points) exactly', () => {
    const rule = new BaseMarkupRule(10_000n);
    const result = rule.apply(Money.of(777n, 'USD'), context);

    expect(result.price.minorUnits).toBe(777n);
  });

  it('rounds up (ceiling), never undercharging on integer division', () => {
    const rule = new BaseMarkupRule(13_333n); // deliberately not evenly divisible
    const result = rule.apply(Money.of(3n, 'USD'), context);

    // 3 * 13333 / 10000 = 3.9999 -> must round UP to 4, never truncate to 3.
    expect(result.price.minorUnits).toBe(4n);
  });

  it('rejects a non-positive basis-points value at construction', () => {
    expect(() => new BaseMarkupRule(0n)).toThrow(/positive integer/);
    expect(() => new BaseMarkupRule(-100n)).toThrow(/positive integer/);
  });
});
