import { defineConfig } from 'vitest/config';

/**
 * Root cause fixed here, not patched per-test: @aifa/config's loadConfig()
 * validates the *entire* schema even when a component only reads one section
 * (e.g. JwtKeyProvider only needs `auth.*` but loadConfig() also requires
 * DATABASE_URL/REDIS_URL). CI's workflow happens to set those globally, which
 * masked this — a bare `pnpm test` locally failed every test that touched any
 * infrastructure adapter calling loadConfig(). Setting safe, unused-by-the-
 * actual-test-assertions defaults here means tests never depend on unrelated
 * env vars being externally provided, matching what CI does but making it
 * work locally too.
 */
process.env.DATABASE_URL ??= 'postgresql://test:test@localhost:5432/test';
process.env.REDIS_URL ??= 'redis://localhost:6379';

export default defineConfig({
  test: {},
});
