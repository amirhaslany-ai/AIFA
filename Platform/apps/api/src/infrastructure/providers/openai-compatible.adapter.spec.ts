import { describe, expect, it, vi } from 'vitest';
import { OpenAiCompatibleAdapter } from './openai-compatible.adapter';

function jsonResponse(body: unknown, init: { status?: number; statusText?: string } = {}): Response {
  return new Response(JSON.stringify(body), {
    status: init.status ?? 200,
    statusText: init.statusText ?? 'OK',
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('OpenAiCompatibleAdapter', () => {
  it('sends a real OpenAI-shaped request with bearer auth and parses the response', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      jsonResponse({
        choices: [{ message: { role: 'assistant', content: 'hello there' } }],
        usage: { prompt_tokens: 12, completion_tokens: 34 },
      }),
    );

    const adapter = new OpenAiCompatibleAdapter({
      id: 'openai',
      baseUrl: 'https://api.example.com/v1/',
      apiKey: 'sk-test-secret',
      model: 'gpt-test',
      fetchImpl,
    });

    const result = await adapter.chat({ messages: [{ role: 'user', content: 'hi' }] });

    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [url, init] = fetchImpl.mock.calls[0]!;
    expect(url).toBe('https://api.example.com/v1/chat/completions');
    expect(init.headers.Authorization).toBe('Bearer sk-test-secret');
    const sentBody = JSON.parse(init.body as string);
    expect(sentBody).toEqual({ model: 'gpt-test', messages: [{ role: 'user', content: 'hi' }], temperature: undefined });

    expect(result).toEqual({
      providerId: 'openai',
      message: { role: 'assistant', content: 'hello there' },
      usage: { promptTokens: 12, completionTokens: 34 },
    });
  });

  it('strips a trailing slash from baseUrl so the request path is never doubled', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      jsonResponse({ choices: [{ message: { role: 'assistant', content: 'ok' } }] }),
    );
    const adapter = new OpenAiCompatibleAdapter({
      id: 'openai',
      baseUrl: 'https://api.example.com/v1/',
      apiKey: 'sk-test',
      model: 'gpt-test',
      fetchImpl,
    });

    await adapter.chat({ messages: [{ role: 'user', content: 'hi' }] });

    expect(fetchImpl.mock.calls[0]![0]).toBe('https://api.example.com/v1/chat/completions');
  });

  it('throws on a non-ok response without leaking the API key', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(new Response('invalid api key', { status: 401, statusText: 'Unauthorized' }));
    const adapter = new OpenAiCompatibleAdapter({
      id: 'openai',
      baseUrl: 'https://api.example.com/v1',
      apiKey: 'sk-super-secret',
      model: 'gpt-test',
      fetchImpl,
    });

    const error: Error = await adapter.chat({ messages: [{ role: 'user', content: 'hi' }] }).catch((e) => e);

    expect(error.message).toMatch(/401 Unauthorized/);
    expect(error.message).not.toContain('sk-super-secret');
  });

  it('healthCheck reports unavailable when the request fails', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response('down', { status: 500 }));
    const adapter = new OpenAiCompatibleAdapter({
      id: 'openai',
      baseUrl: 'https://api.example.com/v1',
      apiKey: 'sk-test',
      model: 'gpt-test',
      fetchImpl,
    });

    const health = await adapter.healthCheck();

    expect(health.status).toBe('unavailable');
    expect(health.providerId).toBe('openai');
  });

  it('healthCheck reports healthy when the request succeeds', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      jsonResponse({ choices: [{ message: { role: 'assistant', content: 'pong' } }] }),
    );
    const adapter = new OpenAiCompatibleAdapter({
      id: 'openai',
      baseUrl: 'https://api.example.com/v1',
      apiKey: 'sk-test',
      model: 'gpt-test',
      fetchImpl,
    });

    const health = await adapter.healthCheck();

    expect(health.status).toBe('healthy');
  });

  it('throws if the provider returns no completion choices', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse({ choices: [] }));
    const adapter = new OpenAiCompatibleAdapter({
      id: 'openai',
      baseUrl: 'https://api.example.com/v1',
      apiKey: 'sk-test',
      model: 'gpt-test',
      fetchImpl,
    });

    await expect(adapter.chat({ messages: [{ role: 'user', content: 'hi' }] })).rejects.toThrow(
      /no completion choices/,
    );
  });
});
