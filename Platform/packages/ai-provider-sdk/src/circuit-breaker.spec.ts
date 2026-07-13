import { describe, expect, it } from 'vitest';
import { CircuitBreaker } from './circuit-breaker';
import { StubAdapter } from './adapters/stub.adapter';
import { CircuitOpenError } from './errors';
import type { AiProvider } from './ai-provider';

describe('CircuitBreaker', () => {
  it('passes through calls while closed', async () => {
    const breaker = new CircuitBreaker(new StubAdapter('p'));
    const result = await breaker.chat({ messages: [{ role: 'user', content: 'hi' }] });
    expect(result.providerId).toBe('p');
  });

  it('opens after the failure threshold and short-circuits further calls', async () => {
    const now = 0;
    const breaker = new CircuitBreaker(new StubAdapter('p', { alwaysFail: true }), {
      failureThreshold: 2,
      cooldownMs: 1000,
      now: () => now,
    });

    await expect(breaker.chat({ messages: [] })).rejects.toThrow();
    await expect(breaker.chat({ messages: [] })).rejects.toThrow();

    // Circuit is now open — should short-circuit without calling the provider.
    await expect(breaker.chat({ messages: [] })).rejects.toThrowError(CircuitOpenError);
  });

  it('allows a trial request after the cooldown window elapses', async () => {
    let now = 0;
    const provider = new StubAdapter('p', { alwaysFail: true });
    const breaker = new CircuitBreaker(provider, {
      failureThreshold: 1,
      cooldownMs: 1000,
      now: () => now,
    });

    await expect(breaker.chat({ messages: [] })).rejects.toThrow();
    await expect(breaker.chat({ messages: [] })).rejects.toThrowError(CircuitOpenError);

    now = 1500; // past cooldown
    // Still fails (provider always fails) but should attempt the call, not short-circuit.
    await expect(breaker.chat({ messages: [] })).rejects.not.toThrowError(CircuitOpenError);
  });

  it('healthCheck reports unavailable without calling the provider once open', async () => {
    let liveCallCount = 0;
    const provider = new StubAdapter('p', { alwaysFail: true });
    const originalHealthCheck = provider.healthCheck.bind(provider);
    provider.healthCheck = async () => {
      liveCallCount += 1;
      return originalHealthCheck();
    };

    const breaker = new CircuitBreaker(provider, { failureThreshold: 1, cooldownMs: 1000, now: () => 0 });

    await expect(breaker.chat({ messages: [] })).rejects.toThrow(); // trips the circuit open

    const health = await breaker.healthCheck();

    expect(health.status).toBe('unavailable');
    expect(liveCallCount).toBe(0); // never delegated to the underlying provider
  });

  it('healthCheck delegates to the provider while closed', async () => {
    const breaker = new CircuitBreaker(new StubAdapter('p'));
    const health = await breaker.healthCheck();
    expect(health.status).toBe('healthy');
  });

  it('half-open admits only a single in-flight trial, rejecting concurrent requests instead of hammering the provider', async () => {
    let now = 0;
    let callCount = 0;
    let resolveTrial: (() => void) | undefined;

    const provider: AiProvider = {
      id: 'p',
      chat: async () => {
        callCount += 1;
        if (callCount === 1) {
          throw new Error('boom'); // trips the circuit open
        }
        // The trial call (2nd invocation) hangs until the test resolves it,
        // simulating a slow provider so a second concurrent call can race it.
        await new Promise<void>((resolve) => {
          resolveTrial = resolve;
        });
        return { providerId: 'p', message: { role: 'assistant', content: 'ok' } };
      },
      healthCheck: async () => ({ providerId: 'p', status: 'healthy', checkedAt: '' }),
    };

    const breaker = new CircuitBreaker(provider, { failureThreshold: 1, cooldownMs: 1000, now: () => now });

    await expect(breaker.chat({ messages: [] })).rejects.toThrow(); // trips open (call #1)

    now = 1500; // past cooldown -> half-open on next evaluateCooldown()

    const trial = breaker.chat({ messages: [] }); // becomes the single admitted trial
    const concurrent = breaker.chat({ messages: [] }); // must be rejected, not passed through

    await expect(concurrent).rejects.toThrowError(CircuitOpenError);
    expect(callCount).toBe(2); // the concurrent request never reached the provider

    resolveTrial?.();
    await expect(trial).resolves.toMatchObject({ providerId: 'p' });
  });
});
