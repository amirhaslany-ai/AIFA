import { DomainError } from './domain-error';

export class ConversationNotFoundError extends DomainError {
  readonly code = 'CONVERSATION_NOT_FOUND';

  constructor(conversationId: string) {
    super(`No conversation exists with id ${conversationId}`);
  }
}
