import { describe, expect, it } from 'vitest';
import { CreditWalletUseCase } from './credit-wallet.use-case';
import { ReserveFundsUseCase } from './reserve-funds.use-case';
import { InMemoryWalletRepository } from '../../test-support/in-memory-wallet.repository';
import type { ClockPort } from '../ports/clock.port';
import { InsufficientBalanceError } from '../../domain/errors/insufficient-balance.error';
import { WalletNotFoundError } from '../../domain/errors/wallet-not-found.error';

const fixedClock: ClockPort = { now: () => new Date('2026-07-12T00:00:00.000Z') };

function buildUseCases() {
  const wallets = new InMemoryWalletRepository();
  const credit = new CreditWalletUseCase(wallets, fixedClock);
  const reserve = new ReserveFundsUseCase(wallets, fixedClock);
  return { credit, reserve };
}

describe('ReserveFundsUseCase', () => {
  it('holds funds, decreasing the available balance', async () => {
    const { credit, reserve } = buildUseCases();
    await credit.execute({ accountId: 'acc-1', amountMinorUnits: 1000n, currency: 'USD', referenceId: 'topup-1' });

    const result = await reserve.execute({
      accountId: 'acc-1',
      amountMinorUnits: 300n,
      currency: 'USD',
      referenceId: 'req-1',
    });

    expect(result.balanceMinorUnits).toBe(700n);
  });

  it('rejects a reservation the account cannot afford, BEFORE any provider would be called', async () => {
    const { credit, reserve } = buildUseCases();
    await credit.execute({ accountId: 'acc-1', amountMinorUnits: 100n, currency: 'USD', referenceId: 'topup-1' });

    await expect(
      reserve.execute({ accountId: 'acc-1', amountMinorUnits: 200n, currency: 'USD', referenceId: 'req-1' }),
    ).rejects.toThrow(InsufficientBalanceError);
  });

  it('rejects reserving against an account with no wallet at all', async () => {
    const { reserve } = buildUseCases();

    await expect(
      reserve.execute({ accountId: 'no-wallet-acc', amountMinorUnits: 100n, currency: 'USD', referenceId: 'req-1' }),
    ).rejects.toThrow(WalletNotFoundError);
  });

  it('REGRESSION GUARD: retrying an already-successful reservation does not spuriously throw InsufficientBalanceError', async () => {
    const { credit, reserve } = buildUseCases();
    await credit.execute({ accountId: 'acc-1', amountMinorUnits: 1000n, currency: 'USD', referenceId: 'topup-1' });

    const first = await reserve.execute({
      accountId: 'acc-1',
      amountMinorUnits: 900n,
      currency: 'USD',
      referenceId: 'req-1',
    });
    expect(first.balanceMinorUnits).toBe(100n);

    // A client retry of the exact same reservation. Without the hasLedgerEntry
    // pre-check, this would re-run wallet.reserve(900) against the
    // already-reduced balance (100), throwing InsufficientBalanceError even
    // though the reservation already succeeded once.
    const retried = await reserve.execute({
      accountId: 'acc-1',
      amountMinorUnits: 900n,
      currency: 'USD',
      referenceId: 'req-1',
    });

    expect(retried.balanceMinorUnits).toBe(100n); // unchanged, not double-reserved, not an error
  });
});
