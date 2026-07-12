export interface SystemHealth {
  status: 'ok' | 'degraded' | 'down';
  providers: import('./ai-provider').ProviderHealth[];
  checkedAt: string;
}
