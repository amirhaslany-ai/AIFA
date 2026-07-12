import { Prisma, PrismaClient } from '@prisma/client';

/**
 * Singleton Prisma client (apps/api is a long-running process, not
 * serverless, so a per-process singleton is correct — see
 * docs/architecture/database-architecture.md "Connection management").
 */
declare global {
  // `var` is required here — TS ambient global declarations don't accept let/const.
  var __aifaPrismaClient: PrismaClient | undefined;
}

export const prisma = globalThis.__aifaPrismaClient ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__aifaPrismaClient = prisma;
}

export { PrismaClient } from '@prisma/client';
export { LedgerEntryType, MessageRole } from '@prisma/client';
export type {
  Account,
  RefreshToken,
  AiProviderConfig,
  Wallet,
  LedgerEntry,
  Conversation,
  Message,
} from '@prisma/client';

/**
 * Keeps Prisma's specific error shape encapsulated in this package —
 * apps/api's infrastructure/persistence/* checks "was this a duplicate?"
 * without importing @prisma/client's error classes directly (P2002 = unique
 * constraint violation). Used for ledger-entry idempotency
 * (docs/adr/0008-wallet-ledger-pattern.md): a retried operation's duplicate
 * (walletId, referenceId, type) is a safe no-op, not an error.
 */
export function isUniqueConstraintViolation(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
}
