import { describe, expect, it } from 'vitest';
import { Conversation } from './conversation.entity';
import { Message } from './message';

const now = new Date('2026-07-12T00:00:00.000Z');

describe('Conversation', () => {
  it('starts with no messages', () => {
    const conversation = Conversation.start({ id: 'conv-1', accountId: 'acc-1', now });

    expect(conversation.getMessages()).toEqual([]);
  });

  it('accumulates messages in the order they are added', () => {
    const conversation = Conversation.start({ id: 'conv-1', accountId: 'acc-1', now });
    const userMessage = Message.create({ id: 'msg-1', role: 'user', content: 'hi', createdAt: now });
    const assistantMessage = Message.create({ id: 'msg-2', role: 'assistant', content: 'hello', createdAt: now });

    conversation.addMessage(userMessage);
    conversation.addMessage(assistantMessage);

    expect(conversation.getMessages()).toEqual([userMessage, assistantMessage]);
  });

  it('reconstitutes from persisted state without re-running business rules', () => {
    const message = Message.create({ id: 'msg-1', role: 'user', content: 'hi', createdAt: now });
    const conversation = Conversation.reconstitute({
      id: 'conv-1',
      accountId: 'acc-1',
      messages: [message],
      createdAt: now,
    });

    expect(conversation.getMessages()).toEqual([message]);
  });
});
