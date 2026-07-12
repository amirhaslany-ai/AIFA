import type { UsageEvent } from '../../domain/usage-event';

export const USAGE_EVENT_REPOSITORY_PORT = Symbol('UsageEventRepositoryPort');

export interface ListUsageEventsOptions {
  limit: number;
  /** Only events created strictly before this timestamp — simple keyset pagination, newest first. */
  before?: Date;
}

export interface UsageEventRepositoryPort {
  record(event: UsageEvent): Promise<void>;
  listByAccountId(accountId: string, options: ListUsageEventsOptions): Promise<UsageEvent[]>;
}
