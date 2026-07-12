import { describe, expect, it } from 'vitest';
import { ListUsageEventsUseCase } from './list-usage-events.use-case';
import { InMemoryUsageEventRepository } from '../../test-support/in-memory-usage-event.repository';
import { UsageEvent } from '../../domain/usage-event';

function event(id: string, accountId: string, createdAt: Date): UsageEvent {
  return UsageEvent.create({
    id,
    accountId,
    conversationId: 'conv-1',
    userMessageId: `msg-${id}`,
    providerId: 'stub-primary',
    promptTokens: 10,
    completionTokens: 5,
    costMinorUnits: 3n,
    priceMinorUnits: 4n,
    currency: 'USD',
    createdAt,
  });
}

describe('ListUsageEventsUseCase', () => {
  it('returns only the requesting account\'s events, newest first', async () => {
    const usageEvents = new InMemoryUsageEventRepository();
    await usageEvents.record(event('1', 'acc-1', new Date('2026-07-12T00:00:00.000Z')));
    await usageEvents.record(event('2', 'acc-1', new Date('2026-07-12T00:01:00.000Z')));
    await usageEvents.record(event('3', 'acc-2', new Date('2026-07-12T00:02:00.000Z')));

    const useCase = new ListUsageEventsUseCase(usageEvents);
    const result = await useCase.execute({ accountId: 'acc-1' });

    expect(result.map((r) => r.id)).toEqual(['2', '1']);
  });

  it('caps the limit at 100 even if a larger value is requested', async () => {
    const usageEvents = new InMemoryUsageEventRepository();
    for (let i = 0; i < 150; i += 1) {
      await usageEvents.record(event(`e${i}`, 'acc-1', new Date(2026, 0, 1, 0, i)));
    }

    const useCase = new ListUsageEventsUseCase(usageEvents);
    const result = await useCase.execute({ accountId: 'acc-1', limit: 500 });

    expect(result).toHaveLength(100);
  });

  it('supports a before cursor for pagination', async () => {
    const usageEvents = new InMemoryUsageEventRepository();
    await usageEvents.record(event('1', 'acc-1', new Date('2026-07-12T00:00:00.000Z')));
    await usageEvents.record(event('2', 'acc-1', new Date('2026-07-12T00:01:00.000Z')));

    const useCase = new ListUsageEventsUseCase(usageEvents);
    const result = await useCase.execute({ accountId: 'acc-1', before: new Date('2026-07-12T00:01:00.000Z') });

    expect(result.map((r) => r.id)).toEqual(['1']);
  });
});
