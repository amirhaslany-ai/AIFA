import { Module } from '@nestjs/common';
import { IdentityModule } from './identity.module';
import { WalletModule } from './wallet.module';
import { PricingModule } from './pricing.module';
import { HealthModule } from './health.module';
import { ChatController } from './interfaces/http/controllers/chat.controller';
import { SendChatMessageUseCase } from './application/use-cases/send-chat-message.use-case';
import { GetConversationUseCase } from './application/use-cases/get-conversation.use-case';
import { CONVERSATION_REPOSITORY_PORT } from './application/ports/conversation-repository.port';
import { CHAT_COMPLETION_PORT } from './application/ports/chat-completion.port';
import { PrismaConversationRepository } from './infrastructure/persistence/prisma-conversation.repository';
import { FallbackChatCompletionAdapter } from './infrastructure/providers/fallback-chat-completion.adapter';

/**
 * The Conversation bounded context (docs/architecture/domain-boundaries.md,
 * docs/adr/0014-chat-orchestration.md) — the first feature that composes
 * every other Sprint 1 bounded context in one request: IdentityModule (the
 * guard), WalletModule (balance check + debit), PricingModule (cost ->
 * price), HealthModule (ProviderRegistryAdapter's fallback chain + cost
 * rates).
 */
@Module({
  imports: [IdentityModule, WalletModule, PricingModule, HealthModule],
  controllers: [ChatController],
  providers: [
    SendChatMessageUseCase,
    GetConversationUseCase,
    { provide: CONVERSATION_REPOSITORY_PORT, useClass: PrismaConversationRepository },
    { provide: CHAT_COMPLETION_PORT, useClass: FallbackChatCompletionAdapter },
  ],
})
export class ChatModule {}
