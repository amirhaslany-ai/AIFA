import { Injectable, Logger, type OnModuleInit } from '@nestjs/common';
import {
  CircuitBreaker,
  FallbackChain,
  ProviderRegistry,
  StubAdapter,
  type AiProvider,
} from '@aifa/ai-provider-sdk';
import { prisma } from '@aifa/database';
import type { ProviderHealth } from '@aifa/types';
import type { ProviderHealthSourcePort } from '../../application/ports/provider-health-source.port';

/**
 * Default providers used only if `AiProviderConfig` has no enabled rows yet
 * (e.g. a fresh database with no seed data). Once rows exist, they are the
 * only source of truth for which providers are active and in what order —
 * see docs/adr/0005-ai-provider-abstraction.md's "config-driven, not
 * code-driven" principle. This fallback exists so the app can still boot on
 * a fresh environment; it is NOT a second, competing source of configuration.
 */
const BOOTSTRAP_DEFAULT_PROVIDER_IDS = ['stub-primary', 'stub-secondary'];

const HEALTH_CACHE_TTL_MS = 5_000;

/**
 * Bootstraps the provider registry from `AiProviderConfig` (config-driven,
 * per ADR-0005 — no vendor SDKs may be imported here; see
 * docs/architecture/coding-standards.md's import-boundary rule).
 *
 * Registers stub adapters only, per this milestone's scope (no real vendor
 * SDKs/API keys — see packages/ai-provider-sdk/README.md "Scope note").
 * Every registered adapter is wrapped in a CircuitBreaker (ADR-0005), and a
 * FallbackChain is built over the result so a future chat use case has a
 * real, wired resilience path to call — not just unit-tested library classes.
 */
@Injectable()
export class ProviderRegistryAdapter implements ProviderHealthSourcePort, OnModuleInit {
  private readonly logger = new Logger(ProviderRegistryAdapter.name);
  private readonly registry = new ProviderRegistry();
  private fallbackChain: FallbackChain | null = null;
  private healthCache: { result: ProviderHealth[]; expiresAt: number } | null = null;

  async onModuleInit(): Promise<void> {
    const configuredProviderIds = await this.loadEnabledProviderIds();

    for (const providerId of configuredProviderIds) {
      this.registry.register(new CircuitBreaker(new StubAdapter(providerId)));
    }

    this.fallbackChain = new FallbackChain(this.registry.list());
  }

  /** Exposed for a future chat use case — the actual resilience path, not just the registry. */
  getFallbackChain(): FallbackChain {
    if (!this.fallbackChain) {
      throw new Error('ProviderRegistryAdapter used before onModuleInit ran');
    }
    return this.fallbackChain;
  }

  async checkAll(): Promise<ProviderHealth[]> {
    const now = Date.now();

    if (this.healthCache && this.healthCache.expiresAt > now) {
      return this.healthCache.result;
    }

    const result = await Promise.all(
      this.registry.list().map((provider: AiProvider) => provider.healthCheck()),
    );
    this.healthCache = { result, expiresAt: now + HEALTH_CACHE_TTL_MS };
    return result;
  }

  private async loadEnabledProviderIds(): Promise<string[]> {
    // A database outage at boot should degrade to the safe default set, not
    // crash the whole app — the same "a failure here shouldn't break the
    // application" principle ADR-0005 applies to providers applies to this
    // config source too. Verified: without this catch, an unreachable
    // Postgres at boot previously crashed the process entirely.
    try {
      const configs = await prisma.aiProviderConfig.findMany({
        where: { isEnabled: true },
        orderBy: { priority: 'asc' },
      });

      if (configs.length === 0) {
        return BOOTSTRAP_DEFAULT_PROVIDER_IDS;
      }

      return configs.map((config) => config.providerId);
    } catch (error) {
      this.logger.warn(
        `Could not load AiProviderConfig (${(error as Error).message}); falling back to bootstrap defaults: ${BOOTSTRAP_DEFAULT_PROVIDER_IDS.join(', ')}`,
      );
      return BOOTSTRAP_DEFAULT_PROVIDER_IDS;
    }
  }
}
