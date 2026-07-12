import { describe, expect, it } from 'vitest';
import { Money } from './money';

describe('Money', () => {
  it('adds and subtracts within the same currency', () => {
    const a = Money.of(500n, 'usd');
    const b = Money.of(200n, 'USD');

    expect(a.add(b).minorUnits).toBe(700n);
    expect(a.subtract(b).minorUnits).toBe(300n);
  });

  it('normalizes currency to uppercase', () => {
    expect(Money.of(100n, 'usd').currency).toBe('USD');
  });

  it('rejects mixing currencies', () => {
    const usd = Money.of(100n, 'USD');
    const eur = Money.of(100n, 'EUR');

    expect(() => usd.add(eur)).toThrow(/Currency mismatch/);
  });

  it('detects a negative amount', () => {
    expect(Money.of(-1n, 'USD').isNegative()).toBe(true);
    expect(Money.of(0n, 'USD').isNegative()).toBe(false);
  });

  it('equals compares both amount and currency', () => {
    expect(Money.of(100n, 'USD').equals(Money.of(100n, 'USD'))).toBe(true);
    expect(Money.of(100n, 'USD').equals(Money.of(100n, 'EUR'))).toBe(false);
    expect(Money.of(100n, 'USD').equals(Money.of(200n, 'USD'))).toBe(false);
  });

  it('rejects an empty currency code', () => {
    expect(() => Money.of(100n, '')).toThrow(/non-empty currency/);
  });
});
