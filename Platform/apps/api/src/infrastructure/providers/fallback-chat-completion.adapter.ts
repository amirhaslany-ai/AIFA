import { Injectable } from '@nestjs/common';
import type {
  ChatCompletionMessage,
  ChatCompletionPort,
  ChatCompletionResult,
} from '../../application/ports/chat-completion.port';
import { ProviderRegistryAdapter } from './provider-registry.adapter';

/**
 * Wraps ProviderRegistryAdapter.getFallbackChain() behind ChatCompletionPort
 * so Chat's application layer depends on its own narrow port, never on
 * @aifa/ai-provider-sdk's FallbackChain class or ProviderRegistryAdapter
 * directly (ADR-0005's import-boundary rule).
 */
@Injectable()
export class FallbackChatCompletionAdapter implements ChatCompletionPort {
  constructor(private readonly providerRegistry: ProviderRegistryAdapter) {}

  async complete(messages: ChatCompletionMessage[]): Promise<ChatCompletionResult> {
    const chain = this.providerRegistry.getFallbackChain();
    const result = await chain.chat({ messages });

    return {
      providerId: result.providerId,
      content: result.message.content,
      ...(result.usage ? { usage: result.usage } : {}),
    };
  }
}
