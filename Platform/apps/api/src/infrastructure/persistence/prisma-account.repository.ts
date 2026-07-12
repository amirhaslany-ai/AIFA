import { Injectable } from '@nestjs/common';
import { prisma, type Account as AccountRow } from '@aifa/database';
import { Account } from '../../domain/account.entity';
import { Email } from '../../domain/email';
import type { AccountRepositoryPort } from '../../application/ports/account-repository.port';

@Injectable()
export class PrismaAccountRepository implements AccountRepositoryPort {
  async findByEmail(email: Email): Promise<Account | null> {
    const row = await prisma.account.findUnique({ where: { email: email.toString() } });
    return row ? this.toDomain(row) : null;
  }

  async findById(id: string): Promise<Account | null> {
    const row = await prisma.account.findUnique({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async create(account: Account): Promise<void> {
    await prisma.account.create({
      data: {
        id: account.id,
        email: account.getEmail().toString(),
        passwordHash: account.getPasswordHash(),
        createdAt: account.createdAt,
        updatedAt: account.updatedAt,
      },
    });
  }

  private toDomain(row: AccountRow): Account {
    return Account.reconstitute({
      id: row.id,
      email: Email.create(row.email),
      passwordHash: row.passwordHash,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
