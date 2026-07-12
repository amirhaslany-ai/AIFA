import type { ProviderId } from '@aifa/types';

export class ProviderUnavailableError extends Error {
  constructor(
    public readonly providerId: ProviderId,
    cause?: unknown,
  ) {
    super(`Provider "${providerId}" is unavailable`);
    this.name = 'ProviderUnavailableError';
    this.cause = cause;
  }
}

/** Thrown by FallbackChain only when every configured provider has failed. */
export class AllProvidersUnavailableError extends Error {
  constructor(public readonly attempted: ProviderId[]) {
    super(`All configured providers are unavailable: ${attempted.join(', ')}`);
    this.name = 'AllProvidersUnavailableError';
  }
}

export class CircuitOpenError extends Error {
  constructor(public readonly providerId: ProviderId) {
    super(`Circuit breaker for provider "${providerId}" is open`);
    this.name = 'CircuitOpenError';
  }
}
