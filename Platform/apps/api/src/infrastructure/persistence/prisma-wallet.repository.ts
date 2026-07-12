import { Injectable } from '@nestjs/common';
import {
  prisma,
  isUniqueConstraintViolation,
  LedgerEntryType as PrismaLedgerEntryType,
  type Wallet as WalletRow,
} from '@aifa/database';
import { Wallet } from '../../domain/wallet.entity';
import { Money } from '../../domain/money';
import type { LedgerEntryDraft, LedgerEntryType } from '../../domain/ledger-entry';
import type { WalletRepositoryPort } from '../../application/ports/wallet-repository.port';

const TO_PRISMA_TYPE: Record<LedgerEntryType, PrismaLedgerEntryType> = {
  credit: PrismaLedgerEntryType.CREDIT,
  debit: PrismaLedgerEntryType.DEBIT,
  reservation: PrismaLedgerEntryType.RESERVATION,
  reservation_release: PrismaLedgerEntryType.RESERVATION_RELEASE,
  rollback: PrismaLedgerEntryType.ROLLBACK,
};

@Injectable()
export class PrismaWalletRepository implements WalletRepositoryPort {
  async findByAccountId(accountId: string): Promise<Wallet | null> {
    const row = await prisma.wallet.findUnique({ where: { accountId } });
    return row ? this.toDomain(row) : null;
  }

  async create(wallet: Wallet): Promise<void> {
    const balance = wallet.getBalance();
    await prisma.wallet.create({
      data: {
        id: wallet.id,
        accountId: wallet.accountId,
        currency: balance.currency,
        balanceMinorUnits: balance.minorUnits,
      },
    });
  }

  async appendLedgerEntries(
    walletId: string,
    entries: LedgerEntryDraft[],
    newBalance: Money,
  ): Promise<Money> {
    return prisma.$transaction(async (tx) => {
      let anyNewlyApplied = false;

      for (const entry of entries) {
        try {
          await tx.ledgerEntry.create({
            data: {
              walletId,
              type: TO_PRISMA_TYPE[entry.type],
              amountMinorUnits: entry.amount.minorUnits,
              referenceId: entry.referenceId,
            },
          });
          anyNewlyApplied = true;
        } catch (error) {
          if (isUniqueConstraintViolation(error)) {
            // Idempotency (docs/adr/0008-wallet-ledger-pattern.md): this exact
            // (walletId, referenceId, type) was already applied by a prior
            // attempt — skip it, don't re-apply and don't error.
            continue;
          }
          throw error;
        }
      }

      // Only touch the balance cache if something was actually newly applied,
      // and always return the ACTUAL persisted balance — never just echo
      // back `newBalance`. `newBalance` was computed by an in-memory domain
      // object that has no idea whether this operation is a duplicate; on a
      // full retry it silently double-counts, and blindly trusting it here
      // (or in the use case that called us) would let a retry double-charge
      // even though the ledger rows themselves were correctly deduplicated.
      // Found as a real, reproducing test failure — the earlier version of
      // this method fixed the *stored* balance but still let the use case's
      // *response* report the wrong, double-counted number.
      if (!anyNewlyApplied) {
        const existing = await tx.wallet.findUniqueOrThrow({ where: { id: walletId } });
        return Money.of(existing.balanceMinorUnits, newBalance.currency);
      }

      const updated = await tx.wallet.update({
        where: { id: walletId },
        data: { balanceMinorUnits: newBalance.minorUnits },
      });
      return Money.of(updated.balanceMinorUnits, newBalance.currency);
    });
  }

  async hasLedgerEntry(walletId: string, referenceId: string, type: LedgerEntryType): Promise<boolean> {
    const existing = await prisma.ledgerEntry.findUnique({
      where: { walletId_referenceId_type: { walletId, referenceId, type: TO_PRISMA_TYPE[type] } },
    });
    return existing !== null;
  }

  private toDomain(row: WalletRow): Wallet {
    return Wallet.reconstitute({
      id: row.id,
      accountId: row.accountId,
      balance: Money.of(row.balanceMinorUnits, row.currency),
      createdAt: row.createdAt,
    });
  }
}
