import { Inject, Injectable } from '@nestjs/common';
import { ConversationNotFoundError } from '../../domain/errors/conversation-not-found.error';
import { CONVERSATION_REPOSITORY_PORT, type ConversationRepositoryPort } from '../ports/conversation-repository.port';

export interface ConversationMessageResult {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

export interface GetConversationResult {
  conversationId: string;
  messages: ConversationMessageResult[];
}

@Injectable()
export class GetConversationUseCase {
  constructor(@Inject(CONVERSATION_REPOSITORY_PORT) private readonly conversations: ConversationRepositoryPort) {}

  async execute(conversationId: string, accountId: string): Promise<GetConversationResult> {
    const conversation = await this.conversations.findById(conversationId, accountId);
    if (!conversation) {
      throw new ConversationNotFoundError(conversationId);
    }

    return {
      conversationId: conversation.id,
      messages: conversation.getMessages().map((message) => ({
        id: message.id,
        role: message.role,
        content: message.content,
        createdAt: message.createdAt,
      })),
    };
  }
}
