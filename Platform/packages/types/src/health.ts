import type { ProviderHealth, ProviderStatus } from './ai-provider';

/** Health of an infrastructure dependency (database, cache) — not an AI provider. */
export interface DependencyHealth {
  name: string;
  status: ProviderStatus;
  checkedAt: string;
}

export interface SystemHealth {
  status: 'ok' | 'degraded' | 'down';
  providers: ProviderHealth[];
  /** Added in P1-3 remediation — database/Redis reachability, not just AI providers. */
  dependencies: DependencyHealth[];
  checkedAt: string;
}
