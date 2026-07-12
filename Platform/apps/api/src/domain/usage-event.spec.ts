import { describe, expect, it } from 'vitest';
import { UsageEvent } from './usage-event';

const now = new Date('2026-07-12T00:00:00.000Z');

function validProps() {
  return {
    id: 'usage-1',
    accountId: 'acc-1',
    conversationId: 'conv-1',
    userMessageId: 'msg-1',
    providerId: 'stub-primary',
    promptTokens: 10,
    completionTokens: 5,
    costMinorUnits: 3n,
    priceMinorUnits: 4n,
    currency: 'USD',
    createdAt: now,
  };
}

describe('UsageEvent', () => {
  it('creates a valid usage event', () => {
    const event = UsageEvent.create(validProps());

    expect(event).toMatchObject({ id: 'usage-1', promptTokens: 10, completionTokens: 5 });
  });

  it('rejects negative token counts', () => {
    expect(() => UsageEvent.create({ ...validProps(), promptTokens: -1 })).toThrow(/must not be negative/);
  });

  it('rejects negative cost or price', () => {
    expect(() => UsageEvent.create({ ...validProps(), costMinorUnits: -1n })).toThrow(/must not be negative/);
    expect(() => UsageEvent.create({ ...validProps(), priceMinorUnits: -1n })).toThrow(/must not be negative/);
  });
});
