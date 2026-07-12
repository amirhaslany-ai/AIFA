# Package Boundaries

| Package | Responsibility | May depend on | Must NOT contain |
|---|---|---|---|
| `@aifa/types` | Shared DTOs, domain-adjacent types with zero runtime logic (interfaces, type aliases, zod schemas for shared validation) | nothing internal | business logic, I/O, framework imports |
| `@aifa/config` | Typed, validated environment/config loading (one schema, fails fast on missing/invalid env at boot) | `@aifa/types` | secret values themselves (only reads `process.env`), business logic |
| `@aifa/logger` | Structured logging wrapper (pino), consistent log shape across apps | `@aifa/config` (log level) | app-specific log statements (apps call it, they don't extend it) |
| `@aifa/ai-provider-sdk` | Provider-agnostic AI abstraction: `AiProvider` port, `ProviderRegistry`, `FallbackChain`, `CircuitBreaker`, adapter stubs | `@aifa/types`, `@aifa/logger` | any concrete business use case; vendor SDKs stay inside individual adapter files only |
| `@aifa/database` | Prisma schema, migrations, generated client re-export | `@aifa/types` | query logic specific to one bounded context (that belongs in `apps/api`'s repositories) |

## Apps

| App | Responsibility | May depend on |
|---|---|---|
| `apps/api` | Backend: all business logic, all bounded contexts, the only writer to the database | all `packages/*` |
| `apps/web` | Frontend: renders UI, calls `apps/api` over HTTP only | `@aifa/types` (for shared DTO shapes), `@aifa/config`, `@aifa/logger` — never `@aifa/database` or `@aifa/ai-provider-sdk` directly |

## Rule of thumb

If a `packages/*` folder starts needing to import from `apps/api` or `apps/web`, that's a signal the boundary is wrong — packages are leaves in the dependency graph; apps are the only nodes allowed to depend on multiple packages and compose them.

## Adding a package

1. Confirm it isn't better as a folder inside an existing package (avoid a package-per-file anti-pattern — Content Studio's D-002 "small scoped files" principle does not mean "maximize package count").
2. Add the folder under `packages/<name>/`, with its own `package.json` (name: `@aifa/<name>`), `tsconfig.json` (extends `../../tsconfig.base.json`), and `README.md` stating its responsibility in the first paragraph.
3. `pnpm-workspace.yaml`'s glob already picks it up — no separate registration step.
