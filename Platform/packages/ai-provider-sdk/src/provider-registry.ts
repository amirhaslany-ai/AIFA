import type { ProviderId } from '@aifa/types';
import type { AiProvider } from './ai-provider';
import { ProviderUnavailableError } from './errors';

/**
 * Holds providers by id, resolved at runtime from configuration.
 * Application code never imports a concrete vendor adapter directly —
 * it asks the registry for "the active provider(s)" by id.
 */
export class ProviderRegistry {
  private readonly providers = new Map<ProviderId, AiProvider>();

  register(provider: AiProvider): void {
    this.providers.set(provider.id, provider);
  }

  get(id: ProviderId): AiProvider {
    const provider = this.providers.get(id);
    if (!provider) {
      throw new ProviderUnavailableError(id);
    }
    return provider;
  }

  has(id: ProviderId): boolean {
    return this.providers.has(id);
  }

  list(): AiProvider[] {
    return [...this.providers.values()];
  }
}
