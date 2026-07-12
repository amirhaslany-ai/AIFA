import { Injectable } from '@nestjs/common';
import { prisma, type RefreshToken as RefreshTokenRow } from '@aifa/database';
import type {
  RefreshTokenRecord,
  RefreshTokenRepositoryPort,
} from '../../application/ports/refresh-token-repository.port';

@Injectable()
export class PrismaRefreshTokenRepository implements RefreshTokenRepositoryPort {
  async create(record: {
    accountId: string;
    tokenHash: string;
    familyId: string;
    expiresAt: Date;
  }): Promise<RefreshTokenRecord> {
    const row = await prisma.refreshToken.create({ data: record });
    return this.toRecord(row);
  }

  async findByTokenHash(tokenHash: string): Promise<RefreshTokenRecord | null> {
    const row = await prisma.refreshToken.findUnique({ where: { tokenHash } });
    return row ? this.toRecord(row) : null;
  }

  async markRotated(id: string, replacedById: string): Promise<void> {
    await prisma.refreshToken.update({
      where: { id },
      data: { revokedAt: new Date(), replacedBy: replacedById },
    });
  }

  async revokeFamily(familyId: string): Promise<void> {
    // Only touches still-active rows — an already-revoked row keeps its
    // original revokedAt (append-only-ish audit trail, not overwritten).
    await prisma.refreshToken.updateMany({
      where: { familyId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  private toRecord(row: RefreshTokenRow): RefreshTokenRecord {
    return {
      id: row.id,
      accountId: row.accountId,
      tokenHash: row.tokenHash,
      familyId: row.familyId,
      revokedAt: row.revokedAt,
      replacedBy: row.replacedBy,
      expiresAt: row.expiresAt,
      createdAt: row.createdAt,
    };
  }
}
