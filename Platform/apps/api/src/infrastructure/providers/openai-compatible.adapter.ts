import type { ChatRequest, ChatResult, ProviderHealth, ProviderId } from '@aifa/types';
import type { AiProvider } from '@aifa/ai-provider-sdk';

/**
 * Real HTTP adapter for any vendor exposing an OpenAI-compatible Chat
 * Completions API (OpenAI itself, and most self-hosted/gateway providers —
 * see docs/architecture/ai-provider-layer.md). Deliberately built on the
 * platform's global `fetch`, not the `openai` SDK package: the wire format is
 * a stable, documented HTTP contract, so no vendor SDK dependency is needed
 * for this milestone's scope (ADR-0005's import-boundary rule still applies —
 * this file is the only place a real vendor HTTP call is made).
 *
 * No API key is ever logged or included in a thrown error message.
 */
export interface OpenAiCompatibleAdapterOptions {
  id: ProviderId;
  baseUrl: string;
  apiKey: string;
  model: string;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
}

interface OpenAiChatCompletionResponse {
  choices: Array<{ message: { role: string; content: string } }>;
  usage?: { prompt_tokens: number; completion_tokens: number };
}

const DEFAULT_TIMEOUT_MS = 30_000;

export class OpenAiCompatibleAdapter implements AiProvider {
  readonly id: ProviderId;

  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly model: string;
  private readonly timeoutMs: number;
  private readonly fetchImpl: typeof fetch;

  constructor(options: OpenAiCompatibleAdapterOptions) {
    this.id = options.id;
    this.baseUrl = options.baseUrl.replace(/\/+$/, '');
    this.apiKey = options.apiKey;
    this.model = options.model;
    this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  async chat(request: ChatRequest): Promise<ChatResult> {
    const response = await this.request('/chat/completions', {
      model: request.model ?? this.model,
      messages: request.messages,
      temperature: request.temperature,
    });

    const body = (await response.json()) as OpenAiChatCompletionResponse;
    const choice = body.choices[0];
    if (!choice) {
      throw new Error(`Provider "${this.id}" returned no completion choices`);
    }

    return {
      providerId: this.id,
      message: { role: 'assistant', content: choice.message.content },
      ...(body.usage
        ? { usage: { promptTokens: body.usage.prompt_tokens, completionTokens: body.usage.completion_tokens } }
        : {}),
    };
  }

  async healthCheck(): Promise<ProviderHealth> {
    try {
      await this.request('/chat/completions', {
        model: this.model,
        messages: [{ role: 'user', content: 'ping' }],
        max_tokens: 1,
      });
      return { providerId: this.id, status: 'healthy', checkedAt: new Date().toISOString() };
    } catch {
      return { providerId: this.id, status: 'unavailable', checkedAt: new Date().toISOString() };
    }
  }

  private async request(path: string, body: Record<string, unknown>): Promise<Response> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await this.fetchImpl(`${this.baseUrl}${path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!response.ok) {
        // Response body may contain vendor-specific detail but never the key
        // we sent — safe to include in the error message.
        const detail = await response.text().catch(() => '');
        throw new Error(
          `Provider "${this.id}" request failed: ${response.status} ${response.statusText}${detail ? ` — ${detail.slice(0, 500)}` : ''}`,
        );
      }

      return response;
    } finally {
      clearTimeout(timeout);
    }
  }
}
