import type { MessageRole } from '../../domain/message';

export const CHAT_COMPLETION_PORT = Symbol('ChatCompletionPort');

export interface ChatCompletionMessage {
  role: MessageRole;
  content: string;
}

export interface ChatCompletionResult {
  providerId: string;
  content: string;
  usage?: { promptTokens: number; completionTokens: number };
}

/**
 * What Chat needs from Provider Access — a narrow port, not a dependency on
 * @aifa/ai-provider-sdk's FallbackChain/ProviderRegistry classes directly
 * (application/ may only depend on infrastructure/ through its own ports —
 * machine-enforced, eslint.config.mjs). Implemented by
 * infrastructure/providers/fallback-chat-completion.adapter.ts, which wraps
 * ProviderRegistryAdapter.getFallbackChain().
 */
export interface ChatCompletionPort {
  complete(messages: ChatCompletionMessage[]): Promise<ChatCompletionResult>;
}
