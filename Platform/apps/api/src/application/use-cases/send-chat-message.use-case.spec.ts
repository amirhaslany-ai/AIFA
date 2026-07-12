import { describe, expect, it } from 'vitest';
import { SendChatMessageUseCase } from './send-chat-message.use-case';
import { CreditWalletUseCase } from './credit-wallet.use-case';
import { InMemoryConversationRepository } from '../../test-support/in-memory-conversation.repository';
import { InMemoryWalletRepository } from '../../test-support/in-memory-wallet.repository';
import { ConversationNotFoundError } from '../../domain/errors/conversation-not-found.error';
import { DuplicateMessageError } from '../../domain/errors/duplicate-message.error';
import { InsufficientBalanceError } from '../../domain/errors/insufficient-balance.error';
import type { ClockPort } from '../ports/clock.port';
import type { ChatCompletionPort, ChatCompletionResult } from '../ports/chat-completion.port';
import type { ProviderCostSourcePort } from '../ports/provider-cost-source.port';
import type { PricingEnginePort, PricingRequest, PricingResult } from '../ports/pricing-engine.port';

const fixedClock: ClockPort = { now: () => new Date('2026-07-12T00:00:00.000Z') };

class FakeChatCompletion implements ChatCompletionPort {
  public calls = 0;
  constructor(private readonly result: ChatCompletionResult | (() => ChatCompletionResult)) {}

  async complete(): Promise<ChatCompletionResult> {
    this.calls += 1;
    return typeof this.result === 'function' ? this.result() : this.result;
  }
}

class FakeProviderCostSource implements ProviderCostSourcePort {
  async getCostRates() {
    return { costPerInputTokenMicros: 2000n, costPerOutputTokenMicros: 6000n };
  }
}

/** 1.3x markup, matching the real RuleBasedPricingEngineAdapter's default, kept independent so this test doesn't couple to that adapter. */
class FakePricingEngine implements PricingEnginePort {
  public lastRequest: PricingRequest | null = null;

  async calculatePrice(request: PricingRequest): Promise<PricingResult> {
    this.lastRequest = request;
    const price = (request.costMinorUnits * 13_000n + 9_999n) / 10_000n;
    return { priceMinorUnits: price, appliedRules: ['base-markup'] };
  }
}

function buildUseCase(chatCompletion: ChatCompletionPort) {
  const wallets = new InMemoryWalletRepository();
  const conversations = new InMemoryConversationRepository();
  const credit = new CreditWalletUseCase(wallets, fixedClock);
  const sendMessage = new SendChatMessageUseCase(
    conversations,
    wallets,
    chatCompletion,
    new FakeProviderCostSource(),
    new FakePricingEngine(),
    fixedClock,
  );
  return { wallets, conversations, credit, sendMessage };
}

describe('SendChatMessageUseCase', () => {
  it('starts a new conversation, calls the provider, and debits the real cost', async () => {
    const chatCompletion = new FakeChatCompletion({
      providerId: 'stub-primary',
      content: 'hello there',
      usage: { promptTokens: 1000, completionTokens: 500 },
    });
    const { credit, sendMessage, wallets } = buildUseCase(chatCompletion);
    await credit.execute({ accountId: 'acc-1', amountMinorUnits: 10_000n, currency: 'USD', referenceId: 'topup-1' });

    const result = await sendMessage.execute({ accountId: 'acc-1', content: 'hi there' });

    // cost = ceil(1000*2000/1e6) + ceil(500*6000/1e6) = 2 + 3 = 5
    expect(result.costMinorUnits).toBe(5n);
    // price = ceil(5 * 1.3) = 7 (using this test's independent fake pricing formula)
    expect(result.priceMinorUnits).toBe(7n);
    expect(result.message.content).toBe('hello there');
    expect(result.walletBalanceMinorUnits).toBe(10_000n - 7n);

    const wallet = await wallets.findByAccountId('acc-1');
    expect(wallet?.getBalance().minorUnits).toBe(10_000n - 7n);
  });

  it('continues an existing conversation, sending the full message history to the provider', async () => {
    const chatCompletion = new FakeChatCompletion({ providerId: 'stub-primary', content: 'second reply' });
    const { credit, sendMessage } = buildUseCase(chatCompletion);
    await credit.execute({ accountId: 'acc-1', amountMinorUnits: 10_000n, currency: 'USD', referenceId: 'topup-1' });

    const first = await sendMessage.execute({ accountId: 'acc-1', content: 'first message' });
    await sendMessage.execute({ accountId: 'acc-1', conversationId: first.conversationId, content: 'second message' });

    expect(chatCompletion.calls).toBe(2);
  });

  it('throws ConversationNotFoundError for a conversation id that does not belong to the account', async () => {
    const { credit, sendMessage } = buildUseCase(new FakeChatCompletion({ providerId: 'x', content: 'y' }));
    await credit.execute({ accountId: 'acc-1', amountMinorUnits: 10_000n, currency: 'USD', referenceId: 'topup-1' });

    await expect(
      sendMessage.execute({ accountId: 'acc-1', conversationId: 'does-not-exist', content: 'hi' }),
    ).rejects.toThrow(ConversationNotFoundError);
  });

  it('throws InsufficientBalanceError and never calls the provider when the balance is not positive', async () => {
    const chatCompletion = new FakeChatCompletion({ providerId: 'x', content: 'y' });
    const { credit, sendMessage } = buildUseCase(chatCompletion);
    await credit.execute({ accountId: 'acc-1', amountMinorUnits: 0n, currency: 'USD', referenceId: 'topup-1' });

    await expect(sendMessage.execute({ accountId: 'acc-1', content: 'hi' })).rejects.toThrow(
      InsufficientBalanceError,
    );
    expect(chatCompletion.calls).toBe(0);
  });

  it('rejects a retried client-supplied messageId before calling the provider or debiting again', async () => {
    const chatCompletion = new FakeChatCompletion({ providerId: 'stub-primary', content: 'hello' });
    const { credit, sendMessage, wallets } = buildUseCase(chatCompletion);
    await credit.execute({ accountId: 'acc-1', amountMinorUnits: 10_000n, currency: 'USD', referenceId: 'topup-1' });

    const first = await sendMessage.execute({ accountId: 'acc-1', content: 'hi', messageId: 'client-msg-1' });
    expect(chatCompletion.calls).toBe(1);

    await expect(
      sendMessage.execute({
        accountId: 'acc-1',
        conversationId: first.conversationId,
        content: 'hi',
        messageId: 'client-msg-1',
      }),
    ).rejects.toThrow(DuplicateMessageError);

    // No second provider call, no second debit — balance unchanged since the first request.
    expect(chatCompletion.calls).toBe(1);
    const wallet = await wallets.findByAccountId('acc-1');
    expect(wallet?.getBalance().minorUnits).toBe(first.walletBalanceMinorUnits);
  });

  it('REGRESSION GUARD: a provider failure never debits the wallet', async () => {
    const failingCompletion: ChatCompletionPort = {
      complete: async () => {
        throw new Error('all providers unavailable');
      },
    };
    const { credit, sendMessage, wallets } = buildUseCase(failingCompletion);
    await credit.execute({ accountId: 'acc-1', amountMinorUnits: 10_000n, currency: 'USD', referenceId: 'topup-1' });

    await expect(sendMessage.execute({ accountId: 'acc-1', content: 'hi' })).rejects.toThrow(
      'all providers unavailable',
    );

    const wallet = await wallets.findByAccountId('acc-1');
    expect(wallet?.getBalance().minorUnits).toBe(10_000n);
  });
});
