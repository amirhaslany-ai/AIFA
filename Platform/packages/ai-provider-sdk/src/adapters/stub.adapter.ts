import type { ChatRequest, ChatResult, ProviderHealth, ProviderId } from '@aifa/types';
import type { AiProvider } from '../ai-provider';

/**
 * Illustrative stub adapter — deterministic canned response, no real network
 * call, no API key. Demonstrates the AiProvider contract a real vendor
 * adapter (e.g. openai.adapter.ts) would implement. See README.md "Scope note".
 *
 * A real adapter would import its vendor's SDK here, and ONLY here
 * (docs/architecture/coding-standards.md's import-boundary rule).
 */
export class StubAdapter implements AiProvider {
  constructor(
    readonly id: ProviderId,
    private readonly options: { alwaysFail?: boolean } = {},
  ) {}

  async chat(request: ChatRequest): Promise<ChatResult> {
    if (this.options.alwaysFail) {
      throw new Error(`stub provider "${this.id}" configured to fail`);
    }

    const lastUserMessage = [...request.messages].reverse().find((m) => m.role === 'user');

    return {
      providerId: this.id,
      message: {
        role: 'assistant',
        content: `[stub:${this.id}] echo: ${lastUserMessage?.content ?? ''}`,
      },
      usage: { promptTokens: 0, completionTokens: 0 },
    };
  }

  async healthCheck(): Promise<ProviderHealth> {
    return {
      providerId: this.id,
      status: this.options.alwaysFail ? 'unavailable' : 'healthy',
      checkedAt: new Date().toISOString(),
    };
  }
}
