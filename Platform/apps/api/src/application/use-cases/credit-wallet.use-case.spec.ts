import { describe, expect, it } from 'vitest';
import { CreditWalletUseCase } from './credit-wallet.use-case';
import { InMemoryWalletRepository } from '../../test-support/in-memory-wallet.repository';
import type { ClockPort } from '../ports/clock.port';

const fixedClock: ClockPort = { now: () => new Date('2026-07-12T00:00:00.000Z') };

describe('CreditWalletUseCase', () => {
  it('opens a wallet lazily on first credit', async () => {
    const wallets = new InMemoryWalletRepository();
    const useCase = new CreditWalletUseCase(wallets, fixedClock);

    const result = await useCase.execute({
      accountId: 'acc-1',
      amountMinorUnits: 1000n,
      currency: 'USD',
      referenceId: 'topup-1',
    });

    expect(result.balanceMinorUnits).toBe(1000n);
    expect(result.currency).toBe('USD');
  });

  it('accumulates across multiple credits to the same account', async () => {
    const wallets = new InMemoryWalletRepository();
    const useCase = new CreditWalletUseCase(wallets, fixedClock);

    await useCase.execute({ accountId: 'acc-1', amountMinorUnits: 1000n, currency: 'USD', referenceId: 'topup-1' });
    const result = await useCase.execute({
      accountId: 'acc-1',
      amountMinorUnits: 500n,
      currency: 'USD',
      referenceId: 'topup-2',
    });

    expect(result.balanceMinorUnits).toBe(1500n);
  });

  it('REGRESSION GUARD: retrying the same credit (same referenceId) does not double-count the balance', async () => {
    const wallets = new InMemoryWalletRepository();
    const useCase = new CreditWalletUseCase(wallets, fixedClock);

    await useCase.execute({ accountId: 'acc-1', amountMinorUnits: 1000n, currency: 'USD', referenceId: 'topup-1' });
    // A client retry after a timeout, or a duplicate webhook delivery — same referenceId.
    const retried = await useCase.execute({
      accountId: 'acc-1',
      amountMinorUnits: 1000n,
      currency: 'USD',
      referenceId: 'topup-1',
    });

    expect(retried.balanceMinorUnits).toBe(1000n); // NOT 2000n
  });
});
