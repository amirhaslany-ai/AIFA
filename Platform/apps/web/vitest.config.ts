import { defineConfig } from 'vitest/config';

/**
 * No product UI exists yet this milestone (docs/architecture/testing-architecture.md
 * — "apps/web pages are not required to have Playwright/unit coverage yet").
 * passWithNoTests avoids a false-red CI signal until real pages land.
 */
export default defineConfig({
  test: {
    passWithNoTests: true,
  },
});
