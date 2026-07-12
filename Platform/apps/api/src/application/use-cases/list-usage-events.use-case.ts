import { Inject, Injectable } from '@nestjs/common';
import {
  USAGE_EVENT_REPOSITORY_PORT,
  type UsageEventRepositoryPort,
} from '../ports/usage-event-repository.port';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export interface ListUsageEventsInput {
  accountId: string;
  limit?: number;
  before?: Date;
}

export interface UsageEventResult {
  id: string;
  conversationId: string;
  providerId: string;
  promptTokens: number;
  completionTokens: number;
  costMinorUnits: bigint;
  priceMinorUnits: bigint;
  currency: string;
  createdAt: Date;
}

@Injectable()
export class ListUsageEventsUseCase {
  constructor(@Inject(USAGE_EVENT_REPOSITORY_PORT) private readonly usageEvents: UsageEventRepositoryPort) {}

  async execute(input: ListUsageEventsInput): Promise<UsageEventResult[]> {
    const limit = Math.min(input.limit ?? DEFAULT_LIMIT, MAX_LIMIT);
    const events = await this.usageEvents.listByAccountId(input.accountId, {
      limit,
      ...(input.before ? { before: input.before } : {}),
    });

    return events.map((event) => ({
      id: event.id,
      conversationId: event.conversationId,
      providerId: event.providerId,
      promptTokens: event.promptTokens,
      completionTokens: event.completionTokens,
      costMinorUnits: event.costMinorUnits,
      priceMinorUnits: event.priceMinorUnits,
      currency: event.currency,
      createdAt: event.createdAt,
    }));
  }
}
