import { randomUUID } from 'node:crypto';
import type {
  RefreshTokenRecord,
  RefreshTokenRepositoryPort,
} from '../application/ports/refresh-token-repository.port';

export class InMemoryRefreshTokenRepository implements RefreshTokenRepositoryPort {
  private readonly byId = new Map<string, RefreshTokenRecord>();

  async create(record: {
    accountId: string;
    tokenHash: string;
    familyId: string;
    expiresAt: Date;
  }): Promise<RefreshTokenRecord> {
    const full: RefreshTokenRecord = {
      id: randomUUID(),
      accountId: record.accountId,
      tokenHash: record.tokenHash,
      familyId: record.familyId,
      revokedAt: null,
      replacedBy: null,
      expiresAt: record.expiresAt,
      createdAt: new Date(),
    };
    this.byId.set(full.id, full);
    return full;
  }

  async findByTokenHash(tokenHash: string): Promise<RefreshTokenRecord | null> {
    for (const record of this.byId.values()) {
      if (record.tokenHash === tokenHash) {
        return record;
      }
    }
    return null;
  }

  async markRotated(id: string, replacedById: string): Promise<void> {
    const record = this.byId.get(id);
    if (record) {
      this.byId.set(id, { ...record, revokedAt: new Date(), replacedBy: replacedById });
    }
  }

  async revokeFamily(familyId: string): Promise<void> {
    for (const [id, record] of this.byId.entries()) {
      if (record.familyId === familyId && !record.revokedAt) {
        this.byId.set(id, { ...record, revokedAt: new Date() });
      }
    }
  }
}
