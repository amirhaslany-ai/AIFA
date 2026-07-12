import { Conversation } from '../domain/conversation.entity';
import { Message } from '../domain/message';
import type { ConversationRepositoryPort } from '../application/ports/conversation-repository.port';

interface StoredConversation {
  id: string;
  accountId: string;
  createdAt: Date;
  messages: Message[];
}

/**
 * Mirrors the real repository's contract: findById reconstructs a fresh
 * Conversation from stored state (never a shared, live-mutated reference —
 * same reasoning as InMemoryWalletRepository), and appendMessages throws on
 * a duplicate message id so the use case's idempotency check is exercised
 * the same way it would be against the real unique constraint.
 */
export class InMemoryConversationRepository implements ConversationRepositoryPort {
  private readonly byId = new Map<string, StoredConversation>();
  private readonly usedMessageIds = new Set<string>();

  async findById(id: string, accountId: string): Promise<Conversation | null> {
    const stored = this.byId.get(id);
    if (!stored || stored.accountId !== accountId) {
      return null;
    }
    return Conversation.reconstitute({
      id: stored.id,
      accountId: stored.accountId,
      createdAt: stored.createdAt,
      messages: [...stored.messages],
    });
  }

  async create(conversation: Conversation): Promise<void> {
    this.byId.set(conversation.id, {
      id: conversation.id,
      accountId: conversation.accountId,
      createdAt: conversation.createdAt,
      messages: [...conversation.getMessages()],
    });
  }

  async appendMessages(conversationId: string, messages: readonly Message[]): Promise<void> {
    const stored = this.byId.get(conversationId);
    if (!stored) {
      throw new Error(`InMemoryConversationRepository: no conversation with id ${conversationId}`);
    }

    for (const message of messages) {
      this.usedMessageIds.add(message.id);
      stored.messages.push(message);
    }
  }

  async hasMessage(messageId: string): Promise<boolean> {
    return this.usedMessageIds.has(messageId);
  }
}
