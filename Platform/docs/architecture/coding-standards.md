# Coding Standards

## TypeScript

- Strict mode (`tsconfig.base.json`) — every package/app extends it, never loosens it.
- No `any` without an inline comment justifying it (e.g., a third-party type gap).
- Prefer `type` for shapes/unions, `interface` for anything meant to be implemented (ports) or extended.
- No default exports — named exports only (easier refactor/rename tracing, consistent with an explicit-imports style across a multi-package repo).

## Import boundaries (documented convention; not yet lint-enforced — follow-up work)

- `domain/` imports nothing from `application/`, `infrastructure/`, `interfaces/`, or any Nest package.
- Vendor AI SDKs (`openai`, `@anthropic-ai/sdk`, etc.) may only be imported inside `apps/api/src/infrastructure/providers/*.adapter.ts`.
- `apps/web` never imports `@aifa/database` or `@aifa/ai-provider-sdk` — it talks to `apps/api` over HTTP only.
- Intended enforcement: `eslint-plugin-boundaries` or `import/no-restricted-paths`, configured once the first real cross-boundary violation risk appears — not configured yet to avoid premature tooling investment ahead of real code volume.

## Linting/formatting

- ESLint (`@typescript-eslint`, flat config) + Prettier, run via `pnpm lint` / `pnpm format` (Turborepo-cached per package).
- Prettier config: 2-space indent, single quotes, trailing commas — default Prettier opinions, not bikeshedded further.

## Nest-specific

- One class per file; file name matches class name in kebab-case (`get-system-health.use-case.ts` → `GetSystemHealthUseCase`).
- Constructor injection only — no service-locator/manual instantiation inside a use case or controller.
- DTOs are the only classes allowed to carry both `class-validator` and `@nestjs/swagger` decorators; domain entities carry neither.

## Commit style

Conventional commits (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`) for changes under `Platform/`, scoped optionally to a package (`feat(ai-provider-sdk): add circuit breaker`).

## Definition of done (per package/module)

- [ ] Follows the dependency rule for its layer.
- [ ] Has a `README.md` stating its responsibility.
- [ ] Has at least one test exercising its main behavior (see `testing-architecture.md`).
- [ ] No vendor SDK imported outside an adapter file, if applicable.
- [ ] Passes `pnpm lint`, `pnpm typecheck`, `pnpm test` (enforced in CI — `ci-cd-pipeline.md`).
