# Testing Architecture

## Levels

| Level | Tool | Scope | Location |
|---|---|---|---|
| Unit | Vitest | A single class (use case, domain entity, adapter) in isolation, dependencies mocked via the port interfaces | Colocated: `*.spec.ts` next to the file under test |
| Integration | Vitest + Testcontainers (Postgres, Redis) | A module's real wiring against real infra dependencies, no mocks for the database | `apps/api/test/integration/*.spec.ts` |
| End-to-end | Playwright | Full HTTP request through `apps/api`, or a real browser flow through `apps/web` | `apps/*/test/e2e/*.e2e-spec.ts` |

## Rationale

- Vitest over Jest: faster (esbuild-based), native ESM, compatible Jest-like API — reduces friction, actively maintained, official docs are thorough.
- Testcontainers over mocked repositories for integration tests: catches real Prisma query/schema mismatches that a mocked repository would hide, at the cost of slower CI — an accepted tradeoff since correctness of the persistence layer matters more than integration-test speed.
- Playwright over Cypress: first-party multi-browser support and better CI ergonomics (official Microsoft docs, no license tier gating).

## What's required per PR (enforced in CI, `ci-cd-pipeline.md`)

- Every new `application/use-cases/*.ts` file ships a `.spec.ts` covering its main path and at least one failure path (e.g., `AllProvidersUnavailableError`).
- Every new `infrastructure/persistence/*.repository.ts` file ships an integration test against a real (Testcontainers) Postgres instance — not a mocked Prisma client, since the point is catching schema drift.
- `apps/web` pages are not required to have Playwright coverage yet (no real UI this milestone); the convention is documented so it applies once real pages exist.

## Test doubles policy

Mock only at port boundaries (`application/ports/*`), never mock a concrete class from another layer directly — if a use case needs to be tested without a real database, it's mocking the `*RepositoryPort` interface, not a private Prisma detail. This keeps tests resilient to infrastructure refactors.

## Coverage

No hard coverage percentage gate this milestone (avoids incentivizing low-value tests written purely to hit a number) — CI instead enforces "every use case and every repository has at least one test," per the per-PR list above. A quantitative gate can be added later if coverage visibly regresses in practice.
