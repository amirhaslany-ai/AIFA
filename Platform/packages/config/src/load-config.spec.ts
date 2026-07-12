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
    expect(config.api.corsAllowedOrigins).toEqual(['http://localhost:3000']);
  });

  it('parses a comma-separated CORS allowlist into an array, trimming whitespace', () => {
    const config = loadConfig({
      DATABASE_URL: 'postgresql://u:p@localhost:5432/db',
      REDIS_URL: 'redis://localhost:6379',
      CORS_ALLOWED_ORIGINS: 'https://app.example.com, https://admin.example.com',
    });

    expect(config.api.corsAllowedOrigins).toEqual([
      'https://app.example.com',
      'https://admin.example.com',
    ]);
  });

  it('defaults auth.jwt keys to undefined and access-token TTL to 900s', () => {
    const config = loadConfig({
      DATABASE_URL: 'postgresql://u:p@localhost:5432/db',
      REDIS_URL: 'redis://localhost:6379',
    });

    expect(config.auth.jwtPrivateKeyPem).toBeUndefined();
    expect(config.auth.jwtPublicKeyPem).toBeUndefined();
    expect(config.auth.accessTokenTtlSeconds).toBe(900);
  });

  it('defaults pricing to 1.3x markup and no floor', () => {
    const config = loadConfig({
      DATABASE_URL: 'postgresql://u:p@localhost:5432/db',
      REDIS_URL: 'redis://localhost:6379',
    });

    expect(config.pricing.baseMarkupBasisPoints).toBe(13_000);
    expect(config.pricing.minimumPriceMinorUnits).toBe(0n);
  });
});
