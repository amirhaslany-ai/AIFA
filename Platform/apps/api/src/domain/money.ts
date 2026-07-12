/**
 * Value object — always an integer minor-units amount (never a float, to
 * avoid floating-point rounding error accumulating over many small AI-call
 * charges — docs/architecture/wallet-architecture.md's accounting principles).
 */
export class Money {
  private constructor(
    readonly minorUnits: bigint,
    readonly currency: string,
  ) {}

  static of(minorUnits: bigint, currency: string): Money {
    if (currency.trim().length === 0) {
      throw new Error('Money requires a non-empty currency code');
    }
    return new Money(minorUnits, currency.toUpperCase());
  }

  static zero(currency: string): Money {
    return Money.of(0n, currency);
  }

  add(other: Money): Money {
    this.assertSameCurrency(other);
    return Money.of(this.minorUnits + other.minorUnits, this.currency);
  }

  subtract(other: Money): Money {
    this.assertSameCurrency(other);
    return Money.of(this.minorUnits - other.minorUnits, this.currency);
  }

  isNegative(): boolean {
    return this.minorUnits < 0n;
  }

  equals(other: Money): boolean {
    return this.minorUnits === other.minorUnits && this.currency === other.currency;
  }

  private assertSameCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new Error(`Currency mismatch: ${this.currency} vs ${other.currency}`);
    }
  }
}
