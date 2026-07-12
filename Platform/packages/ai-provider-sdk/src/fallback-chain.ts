import type { ChatRequest, ChatResult, ProviderId } from '@aifa/types';
import type { AiProvider } from './ai-provider';
import { AllProvidersUnavailableError } from './errors';

/**
 * Tries a priority-ordered list of providers; only throws once every
 * provider in the chain has failed. See docs/adr/0005-ai-provider-abstraction.md.
 */
export class FallbackChain implements AiProvider {
  readonly id: ProviderId = 'fallback-chain';

  constructor(private readonly providersInPriorityOrder: AiProvider[]) {
    if (providersInPriorityOrder.length === 0) {
      throw new Error('FallbackChain requires at least one provider');
    }
  }

  async chat(request: ChatRequest): Promise<ChatResult> {
    const attempted: ProviderId[] = [];

    for (const provider of this.providersInPriorityOrder) {
      attempted.push(provider.id);
      try {
        return await provider.chat(request);
      } catch {
        continue;
      }
    }

    throw new AllProvidersUnavailableError(attempted);
  }

  async healthCheck() {
    // Constructor guarantees at least one provider.
    return this.providersInPriorityOrder[0]!.healthCheck();
  }
}
