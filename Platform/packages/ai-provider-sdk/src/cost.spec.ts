import { describe, expect, it } from 'vitest';
import { calculateCostMinorUnits } from './cost';

describe('calculateCostMinorUnits', () => {
  it('computes exact cost when tokens divide evenly', () => {
    const cost = calculateCostMinorUnits(
      { promptTokens: 1000, completionTokens: 500 },
      { costPerInputTokenMicros: 2000n, costPerOutputTokenMicros: 6000n },
    );

    // 1000 * 2000 / 1_000_000 = 2, 500 * 6000 / 1_000_000 = 3
    expect(cost).toBe(5n);
  });

  it('rounds up a fractional remainder instead of dropping it', () => {
    const cost = calculateCostMinorUnits(
      { promptTokens: 1, completionTokens: 0 },
      { costPerInputTokenMicros: 1n, costPerOutputTokenMicros: 0n },
    );

    // 1 * 1 / 1_000_000 = 0.000001 -> ceil to 1, never 0 (never undercounts cost).
    expect(cost).toBe(1n);
  });

  it('returns zero cost for a stub/free provider with no configured rates', () => {
    const cost = calculateCostMinorUnits(
      { promptTokens: 999, completionTokens: 999 },
      { costPerInputTokenMicros: 0n, costPerOutputTokenMicros: 0n },
    );

    expect(cost).toBe(0n);
  });
});
