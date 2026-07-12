import type { ProviderId } from '@aifa/types';
import type { AiProvider } from './ai-provider';
import { CircuitOpenError } from './errors';
import type { ChatRequest, ChatResult, ProviderHealth } from '@aifa/types';

export interface CircuitBreakerOptions {
  /** Consecutive failures before the circuit trips open. Default 3. */
  failureThreshold?: number;
  /** How long the circuit stays open before allowing a trial request, in ms. Default 30s. */
  cooldownMs?: number;
  /** Injectable clock for deterministic tests. */
  now?: () => number;
}

type CircuitState = 'closed' | 'open' | 'half-open';

/**
 * Wraps an AiProvider so repeated failures stop hitting a known-bad provider
 * for a cooldown window instead of retrying into it on every request.
 * See docs/adr/0005-ai-provider-abstraction.md.
 */
export class CircuitBreaker implements AiProvider {
  readonly id: ProviderId;

  private state: CircuitState = 'closed';
  private consecutiveFailures = 0;
  private openedAt = 0;

  private readonly failureThreshold: number;
  private readonly cooldownMs: number;
  private readonly now: () => number;

  constructor(
    private readonly provider: AiProvider,
    options: CircuitBreakerOptions = {},
  ) {
    this.id = provider.id;
    this.failureThreshold = options.failureThreshold ?? 3;
    this.cooldownMs = options.cooldownMs ?? 30_000;
    this.now = options.now ?? (() => Date.now());
  }

  async chat(request: ChatRequest): Promise<ChatResult> {
    this.evaluateCooldown();

    if (this.state === 'open') {
      throw new CircuitOpenError(this.id);
    }

    try {
      const result = await this.provider.chat(request);
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  async healthCheck(): Promise<ProviderHealth> {
    return this.provider.healthCheck();
  }

  private evaluateCooldown(): void {
    if (this.state === 'open' && this.now() - this.openedAt >= this.cooldownMs) {
      this.state = 'half-open';
    }
  }

  private onSuccess(): void {
    this.consecutiveFailures = 0;
    this.state = 'closed';
  }

  private onFailure(): void {
    this.consecutiveFailures += 1;
    if (this.state === 'half-open' || this.consecutiveFailures >= this.failureThreshold) {
      this.state = 'open';
      this.openedAt = this.now();
    }
  }
}
