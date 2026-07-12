/**
 * Provider Access's cost layer (ADR-0007, docs/architecture/ai-provider-layer.md
 * "Provider cost layer"): what a chat call cost the platform, in the
 * account's smallest currency unit. Never what to charge the customer —
 * that's Pricing's job (ADR-0009), a deliberately separate concern.
 *
 * Integer-only (micros of a minor unit per token), never floats, for the
 * same reason the ledger and pricing pipeline avoid them: a billing figure
 * must be exactly reproducible, not subject to floating-point rounding.
 * Rounds up (ceiling division) so a fractional-minor-unit remainder is never
 * silently dropped, undercounting the platform's actual cost.
 */

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
}

export interface CostRates {
  /** Micros (1e-6) of a minor currency unit, per input token. */
  costPerInputTokenMicros: bigint;
  /** Micros (1e-6) of a minor currency unit, per output token. */
  costPerOutputTokenMicros: bigint;
}

const MICROS_PER_MINOR_UNIT = 1_000_000n;

function ceilDiv(numerator: bigint, denominator: bigint): bigint {
  return (numerator + denominator - 1n) / denominator;
}

export function calculateCostMinorUnits(usage: TokenUsage, rates: CostRates): bigint {
  const inputCost = ceilDiv(BigInt(usage.promptTokens) * rates.costPerInputTokenMicros, MICROS_PER_MINOR_UNIT);
  const outputCost = ceilDiv(
    BigInt(usage.completionTokens) * rates.costPerOutputTokenMicros,
    MICROS_PER_MINOR_UNIT,
  );
  return inputCost + outputCost;
}
