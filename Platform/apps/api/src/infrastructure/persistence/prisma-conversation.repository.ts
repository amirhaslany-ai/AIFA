import { Injectable } from '@nestjs/common';
import { prisma, MessageRole as PrismaMessageRole, type Message as MessageRow } from '@aifa/database';
import { Conversation } from '../../domain/conversation.entity';
import { Message, type MessageRole } from '../../domain/message';
import type { ConversationRepositoryPort } from '../../application/ports/conversation-repository.port';

const TO_PRISMA_ROLE: Record<MessageRole, PrismaMessageRole> = {
  system: PrismaMessageRole.SYSTEM,
  user: PrismaMessageRole.USER,
  assistant: PrismaMessageRole.ASSISTANT,
};

const TO_DOMAIN_ROLE: Record<PrismaMessageRole, MessageRole> = {
  [PrismaMessageRole.SYSTEM]: 'system',
  [PrismaMessageRole.USER]: 'user',
  [PrismaMessageRole.ASSISTANT]: 'assistant',
};

@Injectable()
export class PrismaConversationRepository implements ConversationRepositoryPort {
  async findById(id: string, accountId: string): Promise<Conversation | null> {
    const row = await prisma.conversation.findFirst({
      where: { id, accountId },
      include: { messages: { orderBy: { sequence: 'asc' } } },
    });
    if (!row) {
      return null;
    }

    return Conversation.reconstitute({
      id: row.id,
      accountId: row.accountId,
      createdAt: row.createdAt,
      messages: row.messages.map((message) => this.toDomainMessage(message)),
    });
  }

  async create(conversation: Conversation): Promise<void> {
    await prisma.conversation.create({
      data: {
        id: conversation.id,
        accountId: conversation.accountId,
      },
    });
  }

  async appendMessages(conversationId: string, messages: readonly Message[]): Promise<void> {
    for (const message of messages) {
      await prisma.message.create({
        data: {
          id: message.id,
          conversationId,
          role: TO_PRISMA_ROLE[message.role],
          content: message.content,
        },
      });
    }
  }

  async hasMessage(messageId: string): Promise<boolean> {
    const existing = await prisma.message.findUnique({ where: { id: messageId } });
    return existing !== null;
  }

  private toDomainMessage(row: MessageRow): Message {
    return Message.create({
      id: row.id,
      role: TO_DOMAIN_ROLE[row.role],
      content: row.content,
      createdAt: row.createdAt,
    });
  }
}
