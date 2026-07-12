import { describe, expect, it } from 'vitest';
import { Wallet } from './wallet.entity';
import { Money } from './money';
import { InsufficientBalanceError } from './errors/insufficient-balance.error';

const now = new Date('2026-07-12T00:00:00.000Z');

function openWallet(): Wallet {
  return Wallet.open({ id: 'wallet-1', accountId: 'acc-1', currency: 'USD', now });
}

describe('Wallet', () => {
  it('starts at zero balance', () => {
    expect(openWallet().getBalance().minorUnits).toBe(0n);
  });

  it('credit increases the balance and returns a matching draft entry', () => {
    const wallet = openWallet();
    const entry = wallet.credit(Money.of(1000n, 'USD'), 'topup-1', now);

    expect(wallet.getBalance().minorUnits).toBe(1000n);
    expect(entry).toMatchObject({ type: 'credit', referenceId: 'topup-1' });
    expect(entry.amount.minorUnits).toBe(1000n);
  });

  it('reserve decreases the balance', () => {
    const wallet = openWallet();
    wallet.credit(Money.of(1000n, 'USD'), 'topup-1', now);

    wallet.reserve(Money.of(300n, 'USD'), 'req-1', now);

    expect(wallet.getBalance().minorUnits).toBe(700n);
  });

  it('reserve throws InsufficientBalanceError before letting the balance go negative', () => {
    const wallet = openWallet();
    wallet.credit(Money.of(100n, 'USD'), 'topup-1', now);

    expect(() => wallet.reserve(Money.of(200n, 'USD'), 'req-1', now)).toThrow(InsufficientBalanceError);
    // The balance must be unchanged after a rejected reservation.
    expect(wallet.getBalance().minorUnits).toBe(100n);
  });

  it('releaseReservation restores the held amount', () => {
    const wallet = openWallet();
    wallet.credit(Money.of(1000n, 'USD'), 'topup-1', now);
    wallet.reserve(Money.of(300n, 'USD'), 'req-1', now);

    wallet.releaseReservation(Money.of(300n, 'USD'), 'req-1', now);

    expect(wallet.getBalance().minorUnits).toBe(1000n);
  });

  it('settle releases the estimate and debits the actual cost, net effect on balance', () => {
    const wallet = openWallet();
    wallet.credit(Money.of(1000n, 'USD'), 'topup-1', now);
    wallet.reserve(Money.of(300n, 'USD'), 'req-1', now); // balance now 700

    const [release, debit] = wallet.settle(
      Money.of(300n, 'USD'),
      Money.of(250n, 'USD'), // actual cost less than the estimate
      'req-1',
      now,
    );

    expect(release).toMatchObject({ type: 'reservation_release', referenceId: 'req-1' });
    expect(debit).toMatchObject({ type: 'debit', referenceId: 'req-1-settlement' });
    // 700 (after reservation) + 300 (release) - 250 (debit) = 750
    expect(wallet.getBalance().minorUnits).toBe(750n);
  });

  it('settle does not throw even if actual cost exceeds the original estimate (known limitation, documented)', () => {
    const wallet = openWallet();
    wallet.credit(Money.of(1000n, 'USD'), 'topup-1', now);
    wallet.reserve(Money.of(100n, 'USD'), 'req-1', now); // balance now 900

    expect(() =>
      wallet.settle(Money.of(100n, 'USD'), Money.of(150n, 'USD'), 'req-1', now),
    ).not.toThrow();
    // 900 + 100 (release) - 150 (debit) = 850 — never blocked after the fact.
    expect(wallet.getBalance().minorUnits).toBe(850n);
  });

  it('debit charges a known cost directly, with no prior reservation required', () => {
    const wallet = openWallet();
    wallet.credit(Money.of(1000n, 'USD'), 'topup-1', now);

    const entry = wallet.debit(Money.of(150n, 'USD'), 'chat-debit-1', now);

    expect(entry).toMatchObject({ type: 'debit', referenceId: 'chat-debit-1' });
    expect(wallet.getBalance().minorUnits).toBe(850n);
  });

  it('debit never throws even if it would push the balance negative (the call already happened)', () => {
    const wallet = openWallet();
    wallet.credit(Money.of(100n, 'USD'), 'topup-1', now);

    expect(() => wallet.debit(Money.of(150n, 'USD'), 'chat-debit-1', now)).not.toThrow();
    expect(wallet.getBalance().minorUnits).toBe(-50n);
  });

  it('rollback fully restores a reservation with no charge', () => {
    const wallet = openWallet();
    wallet.credit(Money.of(1000n, 'USD'), 'topup-1', now);
    wallet.reserve(Money.of(300n, 'USD'), 'req-1', now);

    wallet.rollback(Money.of(300n, 'USD'), 'req-1', now);

    expect(wallet.getBalance().minorUnits).toBe(1000n);
  });

  it('reconstitutes from persisted state without re-running business rules', () => {
    const wallet = Wallet.reconstitute({
      id: 'wallet-2',
      accountId: 'acc-2',
      balance: Money.of(5000n, 'USD'),
      createdAt: now,
    });

    expect(wallet.getBalance().minorUnits).toBe(5000n);
  });
});
