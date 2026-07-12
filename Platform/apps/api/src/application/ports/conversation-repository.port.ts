import type { Conversation } from '../../domain/conversation.entity';
import type { Message } from '../../domain/message';

export const CONVERSATION_REPOSITORY_PORT = Symbol('ConversationRepositoryPort');

/**
 * One repository for the Conversation aggregate root — Message is a child
 * entity owned by Conversation, never queried/persisted independently
 * (docs/architecture/ddd-tactical-design.md).
 */
export interface ConversationRepositoryPort {
  /** Null if no conversation with this id exists, or it exists but belongs to a different account (never leaks cross-account existence). */
  findById(id: string, accountId: string): Promise<Conversation | null>;
  create(conversation: Conversation): Promise<void>;
  appendMessages(conversationId: string, messages: Message[]): Promise<void>;
  /**
   * Used by SendChatMessageUseCase to detect a retried client-supplied
   * messageId BEFORE calling the provider or debiting the wallet — the same
   * "check first, don't just recover after" pattern ReserveFundsUseCase uses
   * for its own blocking precondition (see wallet-repository.port.ts's
   * hasLedgerEntry doc comment; docs/adr/0014-chat-orchestration.md).
   */
  hasMessage(messageId: string): Promise<boolean>;
}
