import type { ChatRequest, ChatResult, ProviderHealth, ProviderId } from '@aifa/types';

/**
 * The port every AI vendor adapter implements. Application code depends on
 * this interface only — never on a concrete vendor SDK.
 * See docs/adr/0005-ai-provider-abstraction.md.
 */
export interface AiProvider {
  readonly id: ProviderId;

  chat(request: ChatRequest): Promise<ChatResult>;

  healthCheck(): Promise<ProviderHealth>;
}
