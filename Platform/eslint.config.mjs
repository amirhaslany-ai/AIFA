// Single root flat config (ESLint 9+) — resolved by every package/app in the
// workspace via ESLint's upward directory search, so no per-package config
// duplication is needed. See docs/architecture/coding-standards.md.
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/.next/**',
      '**/node_modules/**',
      '**/coverage/**',
      '**/out/**',
      '**/*.config.{js,mjs,cjs}',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      // Allow an explicit underscore-prefixed unused param/var (common for
      // intentionally-unused destructured values) instead of a blanket disable.
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
);
