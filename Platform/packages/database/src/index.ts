import { PrismaClient } from '@prisma/client';

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
export type { Account, RefreshToken, AiProviderConfig } from '@prisma/client';
