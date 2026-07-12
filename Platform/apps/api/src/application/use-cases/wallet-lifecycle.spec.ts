import { describe, expect, it } from 'vitest';
import { CreditWalletUseCase } from './credit-wallet.use-case';
import { ReserveFundsUseCase } from './reserve-funds.use-case';
import { SettleReservationUseCase } from './settle-reservation.use-case';
import { RollbackReservationUseCase } from './rollback-reservation.use-case';
import { GetWalletBalanceUseCase } from './get-wallet-balance.use-case';
import { InMemoryWalletRepository } from '../../test-support/in-memory-wallet.repository';
import type { ClockPort } from '../ports/clock.port';

const fixedClock: ClockPort = { now: () => new Date('2026-07-12T00:00:00.000Z') };

function buildUseCases() {
  const wallets = new InMemoryWalletRepository();
  return {
    credit: new CreditWalletUseCase(wallets, fixedClock),
    reserve: new ReserveFundsUseCase(wallets, fixedClock),
    settle: new SettleReservationUseCase(wallets, fixedClock),
    rollback: new RollbackReservationUseCase(wallets, fixedClock),
    getBalance: new GetWalletBalanceUseCase(wallets),
  };
}

/**
 * End-to-end tests of the full flows docs/architecture/wallet-architecture.md
 * describes — not each use case in isolation, since the real value (and the
 * real risk of a bug) is in how they compose across a request's lifecycle.
 */
describe('Wallet lifecycle', () => {
  it('credit → reserve → settle (actual cost under the estimate)', async () => {
    const { credit, reserve, settle, getBalance } = buildUseCases();
    await credit.execute({ accountId: 'acc-1', amountMinorUnits: 10_000n, currency: 'USD', referenceId: 'topup-1' });

    await reserve.execute({ accountId: 'acc-1', amountMinorUnits: 500n, currency: 'USD', referenceId: 'req-1' });
    // 10000 - 500 = 9500 while reserved
    expect((await getBalance.execute('acc-1')).balanceMinorUnits).toBe(9_500n);

    await settle.execute({
      accountId: 'acc-1',
      reservedAmountMinorUnits: 500n,
      actualAmountMinorUnits: 420n,
      currency: 'USD',
      referenceId: 'req-1',
    });
    // release 500 back (→10000), debit actual 420 (→9580)
    expect((await getBalance.execute('acc-1')).balanceMinorUnits).toBe(9_580n);
  });

  it('credit → reserve → rollback (call failed entirely — no charge)', async () => {
    const { credit, reserve, rollback, getBalance } = buildUseCases();
    await credit.execute({ accountId: 'acc-1', amountMinorUnits: 10_000n, currency: 'USD', referenceId: 'topup-1' });
    await reserve.execute({ accountId: 'acc-1', amountMinorUnits: 500n, currency: 'USD', referenceId: 'req-1' });

    await rollback.execute({ accountId: 'acc-1', amountMinorUnits: 500n, currency: 'USD', referenceId: 'req-1' });

    // Fully restored — never charged for a call that produced no result.
    expect((await getBalance.execute('acc-1')).balanceMinorUnits).toBe(10_000n);
  });

  it('REGRESSION GUARD: retrying settle for the same request does not re-debit', async () => {
    const { credit, reserve, settle, getBalance } = buildUseCases();
    await credit.execute({ accountId: 'acc-1', amountMinorUnits: 10_000n, currency: 'USD', referenceId: 'topup-1' });
    await reserve.execute({ accountId: 'acc-1', amountMinorUnits: 500n, currency: 'USD', referenceId: 'req-1' });

    const settleInput = {
      accountId: 'acc-1',
      reservedAmountMinorUnits: 500n,
      actualAmountMinorUnits: 420n,
      currency: 'USD',
      referenceId: 'req-1',
    };
    await settle.execute(settleInput);
    // A retried settlement call for the exact same request (e.g. a crashed
    // response before the client got confirmation) must be a no-op, not a
    // second debit.
    await settle.execute(settleInput);

    expect((await getBalance.execute('acc-1')).balanceMinorUnits).toBe(9_580n); // NOT 9160n
  });

  it('a wallet with no reservation cannot be settled into a false balance (settle without reserve first)', async () => {
    const { credit, settle, getBalance } = buildUseCases();
    await credit.execute({ accountId: 'acc-1', amountMinorUnits: 10_000n, currency: 'USD', referenceId: 'topup-1' });

    // No prior reservation exists for 'req-1' — settling still runs (release
    // is a no-op amount-wise since nothing was held), only the debit lands.
    await settle.execute({
      accountId: 'acc-1',
      reservedAmountMinorUnits: 0n,
      actualAmountMinorUnits: 300n,
      currency: 'USD',
      referenceId: 'req-1',
    });

    expect((await getBalance.execute('acc-1')).balanceMinorUnits).toBe(9_700n);
  });
});
