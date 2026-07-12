import { UsageEvent } from '../domain/usage-event';
import type {
  ListUsageEventsOptions,
  UsageEventRepositoryPort,
} from '../application/ports/usage-event-repository.port';

export class InMemoryUsageEventRepository implements UsageEventRepositoryPort {
  private readonly events: UsageEvent[] = [];

  async record(event: UsageEvent): Promise<void> {
    this.events.push(event);
  }

  async listByAccountId(accountId: string, options: ListUsageEventsOptions): Promise<UsageEvent[]> {
    return this.events
      .filter((event) => event.accountId === accountId)
      .filter((event) => !options.before || event.createdAt < options.before)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, options.limit);
  }
}
