import { Injectable } from '@nestjs/common';
import { prisma, type UsageEvent as UsageEventRow } from '@aifa/database';
import { UsageEvent } from '../../domain/usage-event';
import type {
  ListUsageEventsOptions,
  UsageEventRepositoryPort,
} from '../../application/ports/usage-event-repository.port';

@Injectable()
export class PrismaUsageEventRepository implements UsageEventRepositoryPort {
  async record(event: UsageEvent): Promise<void> {
    await prisma.usageEvent.create({
      data: {
        id: event.id,
        accountId: event.accountId,
        conversationId: event.conversationId,
        userMessageId: event.userMessageId,
        providerId: event.providerId,
        promptTokens: event.promptTokens,
        completionTokens: event.completionTokens,
        costMinorUnits: event.costMinorUnits,
        priceMinorUnits: event.priceMinorUnits,
        currency: event.currency,
      },
    });
  }

  async listByAccountId(accountId: string, options: ListUsageEventsOptions): Promise<UsageEvent[]> {
    const rows = await prisma.usageEvent.findMany({
      where: { accountId, ...(options.before ? { createdAt: { lt: options.before } } : {}) },
      orderBy: { createdAt: 'desc' },
      take: options.limit,
    });

    return rows.map((row) => this.toDomain(row));
  }

  private toDomain(row: UsageEventRow): UsageEvent {
    return UsageEvent.create({
      id: row.id,
      accountId: row.accountId,
      conversationId: row.conversationId,
      userMessageId: row.userMessageId,
      providerId: row.providerId,
      promptTokens: row.promptTokens,
      completionTokens: row.completionTokens,
      costMinorUnits: row.costMinorUnits,
      priceMinorUnits: row.priceMinorUnits,
      currency: row.currency,
      createdAt: row.createdAt,
    });
  }
}
