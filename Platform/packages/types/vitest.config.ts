import { defineConfig } from 'vitest/config';

/**
 * @aifa/types has zero runtime logic by design (see README.md) — nothing to
 * unit test. passWithNoTests avoids a false-red CI signal for a package that
 * is legitimately test-free rather than under-tested.
 */
export default defineConfig({
  test: {
    passWithNoTests: true,
  },
});
