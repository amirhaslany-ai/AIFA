import { describe, expect, it } from 'vitest';
import { CircuitBreaker } from './circuit-breaker';
import { StubAdapter } from './adapters/stub.adapter';
import { CircuitOpenError } from './errors';

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
});
