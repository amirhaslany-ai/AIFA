import { Injectable, Logger, type OnModuleInit } from '@nestjs/common';
import {
  CircuitBreaker,
  FallbackChain,
  ProviderRegistry,
  StubAdapter,
  type AiProvider,
} from '@aifa/ai-provider-sdk';
import { prisma } from '@aifa/database';
import type { ProviderHealth, ProviderId } from '@aifa/types';
import type { ProviderHealthSourcePort } from '../../application/ports/provider-health-source.port';
import type { ProviderCostRates, ProviderCostSourcePort } from '../../application/ports/provider-cost-source.port';
import { OpenAiCompatibleAdapter } from './openai-compatible.adapter';

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

interface ProviderConfigRow {
  providerId: string;
  baseUrl: string | null;
  model: string | null;
  apiKeyEnvVar: string | null;
  costPerInputTokenMicros: bigint;
  costPerOutputTokenMicros: bigint;
}

/**
 * Bootstraps the provider registry from `AiProviderConfig` (config-driven,
 * per ADR-0005 — no vendor SDKs may be imported here; see
 * docs/architecture/coding-standards.md's import-boundary rule).
 *
 * A row is served by a real `OpenAiCompatibleAdapter` only when it has
 * `baseUrl`, `model`, and `apiKeyEnvVar` all set AND the named env var
 * actually holds a value at boot; otherwise it falls back to `StubAdapter`
 * with a warning, so a misconfigured or not-yet-provisioned provider degrades
 * to a deterministic stub instead of crashing the app (same "a failure here
 * shouldn't break the application" principle as the DB-outage fallback
 * below). Every registered adapter is wrapped in a CircuitBreaker
 * (ADR-0005), and a FallbackChain is built over the result.
 */
@Injectable()
export class ProviderRegistryAdapter
  implements ProviderHealthSourcePort, ProviderCostSourcePort, OnModuleInit
{
  private readonly logger = new Logger(ProviderRegistryAdapter.name);
  private readonly registry = new ProviderRegistry();
  private readonly costRatesByProviderId = new Map<string, ProviderCostRates>();
  private fallbackChain: FallbackChain | null = null;
  private healthCache: { result: ProviderHealth[]; expiresAt: number } | null = null;

  async onModuleInit(): Promise<void> {
    const configs = await this.loadEnabledProviderConfigs();

    for (const config of configs) {
      this.registry.register(new CircuitBreaker(this.buildAdapter(config)));
      this.costRatesByProviderId.set(config.providerId, {
        costPerInputTokenMicros: config.costPerInputTokenMicros,
        costPerOutputTokenMicros: config.costPerOutputTokenMicros,
      });
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

  async getCostRates(providerId: ProviderId): Promise<ProviderCostRates | null> {
    return this.costRatesByProviderId.get(providerId) ?? null;
  }

  private buildAdapter(config: ProviderConfigRow): AiProvider {
    const apiKey = config.apiKeyEnvVar ? process.env[config.apiKeyEnvVar] : undefined;

    if (config.baseUrl && config.model && config.apiKeyEnvVar && apiKey) {
      return new OpenAiCompatibleAdapter({
        id: config.providerId,
        baseUrl: config.baseUrl,
        model: config.model,
        apiKey,
      });
    }

    if (config.baseUrl && config.model && config.apiKeyEnvVar && !apiKey) {
      this.logger.warn(
        `Provider "${config.providerId}" is configured for a real adapter but env var "${config.apiKeyEnvVar}" is unset — falling back to StubAdapter.`,
      );
    }

    return new StubAdapter(config.providerId);
  }

  private async loadEnabledProviderConfigs(): Promise<ProviderConfigRow[]> {
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
        return BOOTSTRAP_DEFAULT_PROVIDER_IDS.map((providerId) => ({
          providerId,
          baseUrl: null,
          model: null,
          apiKeyEnvVar: null,
          costPerInputTokenMicros: 0n,
          costPerOutputTokenMicros: 0n,
        }));
      }

      return configs.map((config) => ({
        providerId: config.providerId,
        baseUrl: config.baseUrl,
        model: config.model,
        apiKeyEnvVar: config.apiKeyEnvVar,
        costPerInputTokenMicros: config.costPerInputTokenMicros,
        costPerOutputTokenMicros: config.costPerOutputTokenMicros,
      }));
    } catch (error) {
      this.logger.warn(
        `Could not load AiProviderConfig (${(error as Error).message}); falling back to bootstrap defaults: ${BOOTSTRAP_DEFAULT_PROVIDER_IDS.join(', ')}`,
      );
      return BOOTSTRAP_DEFAULT_PROVIDER_IDS.map((providerId) => ({
        providerId,
        baseUrl: null,
        model: null,
        apiKeyEnvVar: null,
        costPerInputTokenMicros: 0n,
        costPerOutputTokenMicros: 0n,
      }));
    }
  }
}
