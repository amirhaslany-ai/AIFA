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

  // --- Hexagonal import-boundary enforcement (docs/architecture/backend-architecture.md,
  // docs/architecture/coding-standards.md, ADR-0005). Machine-enforced, not just documented —
  // see TECHNICAL_DEBT.md #2 / 04_PATCH_LIST.md P1-2, closed by adding this.
  //
  // IMPORTANT: flat config does NOT merge `no-restricted-imports` (or any rule's options)
  // across multiple config objects that both match a given file — the last matching
  // object's options for that rule completely replace earlier ones. Each block below
  // therefore targets a mutually exclusive subtree of apps/api/src/ and bundles every
  // restriction that layer needs into its own single `no-restricted-imports` entry.
  // (Verified: an earlier 4-block version with overlapping `files` silently dropped the
  // domain/application/interfaces rules, keeping only the last block's vendor-SDK rule.)
  //
  // `*.spec.ts` is excluded from every block below: these boundary rules protect
  // production architecture, not tests — a test legitimately constructs concrete
  // adapters directly to exercise real behavior (docs/architecture/testing-architecture.md).
  // (Verified: without this exclusion, tests that build a real Argon2/JWT adapter
  // to test use cases against real crypto were rejected by this same rule.) ---
  {
    files: ['apps/api/src/domain/**/*.ts'],
    ignores: ['**/*.spec.ts'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          { group: ['@nestjs/*'], message: 'domain/ must not depend on a framework (backend-architecture.md dependency rule).' },
          { group: ['**/application/**'], message: 'domain/ must not import application/.' },
          { group: ['**/infrastructure/**'], message: 'domain/ must not import infrastructure/.' },
          { group: ['**/interfaces/**'], message: 'domain/ must not import interfaces/.' },
          { group: ['openai', '@anthropic-ai/*', '@google/generative-ai', '@google-cloud/*'], message: 'Vendor AI SDKs may only be imported inside apps/api/src/infrastructure/providers/ (ADR-0005).' },
        ],
      }],
    },
  },
  {
    files: ['apps/api/src/application/**/*.ts'],
    ignores: ['**/*.spec.ts'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          { group: ['**/infrastructure/**'], message: 'application/ must depend on infrastructure/ only through its own ports/ interfaces, never a concrete adapter import.' },
          { group: ['**/interfaces/**'], message: 'application/ must not import interfaces/.' },
          { group: ['openai', '@anthropic-ai/*', '@google/generative-ai', '@google-cloud/*'], message: 'Vendor AI SDKs may only be imported inside apps/api/src/infrastructure/providers/ (ADR-0005).' },
        ],
      }],
    },
  },
  {
    files: ['apps/api/src/interfaces/**/*.ts'],
    ignores: ['**/*.spec.ts'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          { group: ['**/infrastructure/**'], message: 'interfaces/ must call application/ use cases only, never infrastructure/ directly (backend-architecture.md).' },
          { group: ['openai', '@anthropic-ai/*', '@google/generative-ai', '@google-cloud/*'], message: 'Vendor AI SDKs may only be imported inside apps/api/src/infrastructure/providers/ (ADR-0005).' },
        ],
      }],
    },
  },
  {
    // infrastructure/ minus infrastructure/providers/: everything here still may not
    // import a vendor AI SDK — only the providers/ adapters may (ADR-0005).
    files: ['apps/api/src/infrastructure/**/*.ts'],
    ignores: ['apps/api/src/infrastructure/providers/**/*.ts', '**/*.spec.ts'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          { group: ['openai', '@anthropic-ai/*', '@google/generative-ai', '@google-cloud/*'], message: 'Vendor AI SDKs may only be imported inside apps/api/src/infrastructure/providers/ (ADR-0005).' },
        ],
      }],
    },
  },
);
