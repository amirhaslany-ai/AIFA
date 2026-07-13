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
  // A classic half-open gate admits exactly one trial request, not every
  // concurrent request that arrives during the window — without this flag,
  // every concurrent request hitting evaluateCooldown() right after the
  // cooldown elapses would see state==='half-open' and pass through,
  // hammering a provider that just tripped the breaker with a full burst
  // instead of one probe.
  private halfOpenTrialInFlight = false;

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

    if (this.state === 'half-open') {
      if (this.halfOpenTrialInFlight) {
        throw new CircuitOpenError(this.id);
      }
      this.halfOpenTrialInFlight = true;
    }

    try {
      const result = await this.provider.chat(request);
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    } finally {
      this.halfOpenTrialInFlight = false;
    }
  }

  async healthCheck(): Promise<ProviderHealth> {
    this.evaluateCooldown();

    // An open circuit IS the cheap health signal (docs/architecture/ai-provider-layer.md's
    // caching strategy) — report unavailable without a live call to a known-bad provider.
    if (this.state === 'open') {
      return { providerId: this.id, status: 'unavailable', checkedAt: new Date(this.now()).toISOString() };
    }

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
