import type { Account } from '../../domain/account.entity';
import type { Email } from '../../domain/email';

export const ACCOUNT_REPOSITORY_PORT = Symbol('AccountRepositoryPort');

/** One repository per aggregate root (docs/architecture/ddd-tactical-design.md) — never per table. */
export interface AccountRepositoryPort {
  findByEmail(email: Email): Promise<Account | null>;
  findById(id: string): Promise<Account | null>;
  create(account: Account): Promise<void>;
}
