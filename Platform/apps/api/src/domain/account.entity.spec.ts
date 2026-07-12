import { describe, expect, it } from 'vitest';
import { Account } from './account.entity';
import { Email } from './email';

describe('Account', () => {
  it('registers with the given id, email, and password hash', () => {
    const now = new Date('2026-07-12T00:00:00.000Z');
    const account = Account.register({
      id: 'acc-1',
      email: Email.create('user@example.com'),
      passwordHash: 'hashed',
      now,
    });

    expect(account.id).toBe('acc-1');
    expect(account.getEmail().toString()).toBe('user@example.com');
    expect(account.getPasswordHash()).toBe('hashed');
    expect(account.createdAt).toBe(now);
    expect(account.updatedAt).toBe(now);
  });

  it('reconstitutes from persisted state without re-validating business rules', () => {
    const account = Account.reconstitute({
      id: 'acc-2',
      email: Email.create('other@example.com'),
      passwordHash: 'stored-hash',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-02-01T00:00:00.000Z'),
    });

    expect(account.id).toBe('acc-2');
    expect(account.getPasswordHash()).toBe('stored-hash');
  });
});
