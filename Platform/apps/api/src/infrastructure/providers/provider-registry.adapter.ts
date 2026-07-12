import { Injectable } from '@nestjs/common';
import { ProviderRegistry, StubAdapter } from '@aifa/ai-provider-sdk';
import type { ProviderHealth } from '@aifa/types';
import type { ProviderHealthSourcePort } from '../../application/ports/provider-health-source.port';

/**
 * Bootstraps the provider registry. This is the ONLY file in apps/api allowed
 * to know which concrete providers exist — see docs/architecture/coding-standards.md's
 * import-boundary rule and docs/adr/0005-ai-provider-abstraction.md.
 *
 * Registers stub adapters only, per this milestone's scope (no real vendor
 * SDKs/API keys — see packages/ai-provider-sdk/README.md "Scope note").
 */
@Injectable()
export class ProviderRegistryAdapter implements ProviderHealthSourcePort {
  private readonly registry = new ProviderRegistry();

  constructor() {
    this.registry.register(new StubAdapter('stub-primary'));
    this.registry.register(new StubAdapter('stub-secondary'));
  }

  async checkAll(): Promise<ProviderHealth[]> {
    return Promise.all(this.registry.list().map((provider) => provider.healthCheck()));
  }
}
