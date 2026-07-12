import type { Account } from '../domain/account.entity';
import type { AccountRepositoryPort } from '../application/ports/account-repository.port';
import type { Email } from '../domain/email';

/**
 * Test double at the port boundary (docs/architecture/testing-architecture.md's
 * "mock only at port boundaries" rule) — not a stub of the feature under test,
 * only of the database.
 */
export class InMemoryAccountRepository implements AccountRepositoryPort {
  private readonly byId = new Map<string, Account>();

  async findByEmail(email: Email): Promise<Account | null> {
    for (const account of this.byId.values()) {
      if (account.getEmail().equals(email)) {
        return account;
      }
    }
    return null;
  }

  async findById(id: string): Promise<Account | null> {
    return this.byId.get(id) ?? null;
  }

  async create(account: Account): Promise<void> {
    this.byId.set(account.id, account);
  }
}
