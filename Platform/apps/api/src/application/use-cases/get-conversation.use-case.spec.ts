import { describe, expect, it } from 'vitest';
import { GetConversationUseCase } from './get-conversation.use-case';
import { InMemoryConversationRepository } from '../../test-support/in-memory-conversation.repository';
import { Conversation } from '../../domain/conversation.entity';
import { Message } from '../../domain/message';
import { ConversationNotFoundError } from '../../domain/errors/conversation-not-found.error';

const now = new Date('2026-07-12T00:00:00.000Z');

describe('GetConversationUseCase', () => {
  it('returns the conversation messages in order', async () => {
    const conversations = new InMemoryConversationRepository();
    const conversation = Conversation.start({ id: 'conv-1', accountId: 'acc-1', now });
    await conversations.create(conversation);
    await conversations.appendMessages('conv-1', [
      Message.create({ id: 'msg-1', role: 'user', content: 'hi', createdAt: now }),
      Message.create({ id: 'msg-2', role: 'assistant', content: 'hello', createdAt: now }),
    ]);

    const useCase = new GetConversationUseCase(conversations);
    const result = await useCase.execute('conv-1', 'acc-1');

    expect(result.messages.map((m) => m.content)).toEqual(['hi', 'hello']);
  });

  it('throws ConversationNotFoundError for another account\'s conversation', async () => {
    const conversations = new InMemoryConversationRepository();
    await conversations.create(Conversation.start({ id: 'conv-1', accountId: 'acc-1', now }));

    const useCase = new GetConversationUseCase(conversations);

    await expect(useCase.execute('conv-1', 'acc-2')).rejects.toThrow(ConversationNotFoundError);
  });

  it('throws ConversationNotFoundError for an unknown id', async () => {
    const useCase = new GetConversationUseCase(new InMemoryConversationRepository());

    await expect(useCase.execute('does-not-exist', 'acc-1')).rejects.toThrow(ConversationNotFoundError);
  });
});
