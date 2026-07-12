import { describe, expect, it } from 'vitest';
import { loadConfig } from './load-config';

describe('loadConfig', () => {
  it('parses a complete, valid environment', () => {
    const config = loadConfig({
      NODE_ENV: 'test',
      API_PORT: '3001',
      DATABASE_URL: 'postgresql://u:p@localhost:5432/db',
      REDIS_URL: 'redis://localhost:6379',
    });

    expect(config.nodeEnv).toBe('test');
    expect(config.api.port).toBe(3001);
    expect(config.database.url).toContain('postgresql://');
  });

  it('throws a clear error when a required variable is missing', () => {
    expect(() => loadConfig({})).toThrowError(/DATABASE_URL is required/);
  });

  it('applies defaults for optional variables', () => {
    const config = loadConfig({
      DATABASE_URL: 'postgresql://u:p@localhost:5432/db',
      REDIS_URL: 'redis://localhost:6379',
    });

    expect(config.api.port).toBe(3001);
    expect(config.observability.logLevel).toBe('info');
  });
});
