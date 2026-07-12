import { describe, expect, it } from 'vitest';
import { Message } from './message';

const now = new Date('2026-07-12T00:00:00.000Z');

describe('Message', () => {
  it('creates a message with the given role and content', () => {
    const message = Message.create({ id: 'msg-1', role: 'user', content: 'hello', createdAt: now });

    expect(message).toMatchObject({ id: 'msg-1', role: 'user', content: 'hello', createdAt: now });
  });

  it('rejects empty content', () => {
    expect(() => Message.create({ id: 'msg-1', role: 'user', content: '   ', createdAt: now })).toThrow(
      /must not be empty/,
    );
  });
});
