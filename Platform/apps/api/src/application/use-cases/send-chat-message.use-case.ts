import { randomUUID } from 'node:crypto';
import { Inject, Injectable } from '@nestjs/common';
import { calculateCostMinorUnits } from '@aifa/ai-provider-sdk';
import { Conversation } from '../../domain/conversation.entity';
import { Message } from '../../domain/message';
import { Money } from '../../domain/money';
import { UsageEvent } from '../../domain/usage-event';
import { ConversationNotFoundError } from '../../domain/errors/conversation-not-found.error';
import { DuplicateMessageError } from '../../domain/errors/duplicate-message.error';
import { InsufficientBalanceError } from '../../domain/errors/insufficient-balance.error';
import { CONVERSATION_REPOSITORY_PORT, type ConversationRepositoryPort } from '../ports/conversation-repository.port';
import { WALLET_REPOSITORY_PORT, type WalletRepositoryPort } from '../ports/wallet-repository.port';
import { CHAT_COMPLETION_PORT, type ChatCompletionPort } from '../ports/chat-completion.port';
import { PROVIDER_COST_SOURCE_PORT, type ProviderCostSourcePort } from '../ports/provider-cost-source.port';
import { PRICING_ENGINE_PORT, type PricingEnginePort } from '../ports/pricing-engine.port';
import { USAGE_EVENT_REPOSITORY_PORT, type UsageEventRepositoryPort } from '../ports/usage-event-repository.port';
import { CLOCK_PORT, type ClockPort } from '../ports/clock.port';
import { requireWallet } from '../require-wallet';

export interface SendChatMessageInput {
  accountId: string;
  conversationId?: string;
  content: string;
  /** Client-supplied idempotency key; a retry with the same id is rejected before any provider call or wallet debit. */
  messageId?: string;
}

export interface SendChatMessageResult {
  conversationId: string;
  message: { id: string; role: 'assistant'; content: string; createdAt: Date };
  providerId: string;
  usage?: { promptTokens: number; completionTokens: number };
  costMinorUnits: bigint;
  priceMinorUnits: bigint;
  walletBalanceMinorUnits: bigint;
}

const ZERO_COST_RATES = { costPerInputTokenMicros: 0n, costPerOutputTokenMicros: 0n };

/**
 * Ties together every Sprint 1 bounded context (docs/adr/0014-chat-orchestration.md):
 * Identity (accountId, via the caller's authenticated session), Provider
 * Access (ChatCompletionPort), Billing/Pricing (PricingEnginePort),
 * Billing/Wallet (debit), and Usage Tracking (UsageEventRepositoryPort,
 * docs/adr/0015-usage-tracking.md). Deliberately does NOT pre-reserve an estimated
 * cost — that would require guessing a token count before the call, which
 * would violate the "no fake data" principle this codebase holds elsewhere.
 * Instead it requires a strictly positive balance before calling a
 * provider, then debits the real cost afterward (Wallet.debit, no blocking
 * precondition) — a documented, deliberate simplification, not an
 * oversight: a low-balance account can go negative on one expensive call.
 */
@Injectable()
export class SendChatMessageUseCase {
  constructor(
    @Inject(CONVERSATION_REPOSITORY_PORT) private readonly conversations: ConversationRepositoryPort,
    @Inject(WALLET_REPOSITORY_PORT) private readonly wallets: WalletRepositoryPort,
    @Inject(CHAT_COMPLETION_PORT) private readonly chatCompletion: ChatCompletionPort,
    @Inject(PROVIDER_COST_SOURCE_PORT) private readonly providerCosts: ProviderCostSourcePort,
    @Inject(PRICING_ENGINE_PORT) private readonly pricing: PricingEnginePort,
    @Inject(USAGE_EVENT_REPOSITORY_PORT) private readonly usageEvents: UsageEventRepositoryPort,
    @Inject(CLOCK_PORT) private readonly clock: ClockPort,
  ) {}

  async execute(input: SendChatMessageInput): Promise<SendChatMessageResult> {
    const wallet = await requireWallet(this.wallets, input.accountId);
    if (wallet.getBalance().minorUnits <= 0n) {
      throw new InsufficientBalanceError(wallet.id);
    }

    const now = this.clock.now();
    const conversation = await this.loadOrStartConversation(input, now);

    const userMessageId = input.messageId ?? randomUUID();
    if (await this.conversations.hasMessage(userMessageId)) {
      throw new DuplicateMessageError(userMessageId);
    }

    const userMessage = Message.create({ id: userMessageId, role: 'user', content: input.content, createdAt: now });
    await this.conversations.appendMessages(conversation.id, [userMessage]);
    conversation.addMessage(userMessage);

    const completion = await this.chatCompletion.complete(
      conversation.getMessages().map((message) => ({ role: message.role, content: message.content })),
    );

    const assistantMessage = Message.create({
      id: randomUUID(),
      role: 'assistant',
      content: completion.content,
      createdAt: this.clock.now(),
    });
    await this.conversations.appendMessages(conversation.id, [assistantMessage]);

    const rates = (await this.providerCosts.getCostRates(completion.providerId)) ?? ZERO_COST_RATES;
    const usage = completion.usage ?? { promptTokens: 0, completionTokens: 0 };
    const costMinorUnits = calculateCostMinorUnits(usage, rates);

    const currency = wallet.getBalance().currency;
    const priceResult = await this.pricing.calculatePrice({
      accountId: input.accountId,
      providerId: completion.providerId,
      costMinorUnits,
      currency,
      requestedAt: now,
    });

    const debitEntry = wallet.debit(
      Money.of(priceResult.priceMinorUnits, currency),
      `chat-debit-${userMessageId}`,
      this.clock.now(),
    );
    const balance = await this.wallets.appendLedgerEntries(wallet.id, [debitEntry], wallet.getBalance());

    // Recorded after the debit succeeds, keyed by the same userMessageId the
    // duplicate-messageId check already guards — a retry never reaches this
    // line twice for the same exchange, so no separate idempotency handling
    // is needed here (docs/adr/0015-usage-tracking.md).
    await this.usageEvents.record(
      UsageEvent.create({
        id: randomUUID(),
        accountId: input.accountId,
        conversationId: conversation.id,
        userMessageId,
        providerId: completion.providerId,
        promptTokens: usage.promptTokens,
        completionTokens: usage.completionTokens,
        costMinorUnits,
        priceMinorUnits: priceResult.priceMinorUnits,
        currency,
        createdAt: this.clock.now(),
      }),
    );

    return {
      conversationId: conversation.id,
      message: {
        id: assistantMessage.id,
        role: 'assistant',
        content: assistantMessage.content,
        createdAt: assistantMessage.createdAt,
      },
      providerId: completion.providerId,
      ...(completion.usage ? { usage: completion.usage } : {}),
      costMinorUnits,
      priceMinorUnits: priceResult.priceMinorUnits,
      walletBalanceMinorUnits: balance.minorUnits,
    };
  }

  private async loadOrStartConversation(input: SendChatMessageInput, now: Date): Promise<Conversation> {
    if (!input.conversationId) {
      const conversation = Conversation.start({ id: randomUUID(), accountId: input.accountId, now });
      await this.conversations.create(conversation);
      return conversation;
    }

    const existing = await this.conversations.findById(input.conversationId, input.accountId);
    if (!existing) {
      throw new ConversationNotFoundError(input.conversationId);
    }
    return existing;
  }
}
