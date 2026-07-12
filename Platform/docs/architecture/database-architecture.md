# Database Architecture

## Choice

- **Primary datastore:** PostgreSQL — relational integrity for accounts/billing-adjacent data (even though billing logic itself is out of scope this milestone, its eventual data model needs ACID guarantees, ruling out a document store as the primary store).
- **Cache / ephemeral state:** Redis — provider health-check results, rate-limit counters, session cache (once auth exists).
- **ORM/schema tool:** Prisma — schema-first, generates a typed client consumed only from `packages/database` and `apps/api/src/infrastructure/persistence/`. No other package or app talks to Postgres directly.

## Ownership boundary

`packages/database` owns:
- `prisma/schema.prisma` — the single source of schema truth.
- Migrations (`prisma/migrations/`, generated via `prisma migrate dev` / `prisma migrate deploy`).
- The generated Prisma client, re-exported for `apps/api`'s infrastructure layer to consume.

`apps/api`'s `infrastructure/persistence/*.repository.ts` files are the only consumers of the Prisma client, and each implements an `application/ports/*.repository-port.ts` interface. Use cases never import Prisma types directly — they operate on domain entities and repository port interfaces.

## Schema (this milestone)

Only architecture-defining, non-business-logic entities are modeled, to give the ORM/migration setup something real to compile against without building actual features:

- `User` — id, email, createdAt, updatedAt. Placeholder for the future auth system; no password/session fields yet (auth implementation is explicitly out of scope).
- `AiProviderConfig` — id, providerId, displayName, isEnabled, priority. Backs `ProviderRegistry`'s runtime configuration (which providers are active and in what fallback order) — this is configuration data, not a "provider implementation."

No `Wallet`, `Transaction`, or `Subscription` tables exist yet — those belong to the (out-of-scope) billing/wallet business logic and should be modeled when that workstream starts, informed by real requirements rather than guessed now.

## Migrations policy

- Every schema change ships as a Prisma migration file, committed alongside the schema change — never a manually-run `db push` against a shared environment.
- Migrations run automatically in CI against an ephemeral test database (see `testing-architecture.md`) and manually (`prisma migrate deploy`) against staging/production, gated by the CD pipeline once one exists (not this milestone — see `ci-cd-pipeline.md`).

## Connection management

`packages/database` exports a single lazily-initialized Prisma client instance (Prisma's recommended singleton pattern for serverless/Node long-running processes) to avoid connection-pool exhaustion; `apps/api` is a long-running Nest process in this architecture (not a serverless function), so this is a straightforward singleton, not a per-request client.

## Follow-up work (not this milestone)

- Read replica / pooling strategy (e.g. PgBouncer) once real traffic assumptions exist.
- Row-level security or multi-tenancy strategy, if the platform ever needs per-tenant data isolation beyond application-level checks.
