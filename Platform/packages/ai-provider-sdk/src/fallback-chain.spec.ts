import { describe, expect, it } from 'vitest';
import { FallbackChain } from './fallback-chain';
import { StubAdapter } from './adapters/stub.adapter';
import { AllProvidersUnavailableError } from './errors';

describe('FallbackChain', () => {
  it('returns the first healthy provider\'s result', async () => {
    const chain = new FallbackChain([new StubAdapter('primary'), new StubAdapter('secondary')]);

    const result = await chain.chat({ messages: [{ role: 'user', content: 'hi' }] });

    expect(result.providerId).toBe('primary');
  });

  it('falls back to the next provider when the first fails', async () => {
    const chain = new FallbackChain([
      new StubAdapter('primary', { alwaysFail: true }),
      new StubAdapter('secondary'),
    ]);

    const result = await chain.chat({ messages: [{ role: 'user', content: 'hi' }] });

    expect(result.providerId).toBe('secondary');
  });

  it('throws AllProvidersUnavailableError when every provider fails', async () => {
    const chain = new FallbackChain([
      new StubAdapter('primary', { alwaysFail: true }),
      new StubAdapter('secondary', { alwaysFail: true }),
    ]);

    await expect(chain.chat({ messages: [{ role: 'user', content: 'hi' }] })).rejects.toThrowError(
      AllProvidersUnavailableError,
    );
  });
});
