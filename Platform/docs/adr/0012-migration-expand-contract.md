# ADR-0012: Expand/contract migrations, no down-migrations relied upon for rollback

**Status:** Accepted
**Date:** 2026-07-12
**Related:** `docs/architecture/database-standards.md`, `docs/architecture/ci-cd-pipeline.md` (rollback strategy)

## Context

`database-standards.md`'s migration strategy and `ci-cd-pipeline.md`'s rollback strategy both assume a specific migration discipline (expand/contract) without it having its own ADR — surfaced during the Phase 2 ADR-completeness pass.

## Decision

Destructive schema changes (drop column, rename, tighten a constraint) always ship as two separate migrations: an **expand** step (add the new shape alongside the old, backward-compatible with currently-deployed application code) and, only after confirming no code path depends on the old shape, a **contract** step (remove the old shape). Additive changes (new nullable column, new table) ship as a single migration with no special handling. Rollback of a deployed application version never depends on running a matching "down" migration.

## Rationale

- This is what makes `ci-cd-pipeline.md`'s rollback strategy actually work: if application rollback required a corresponding schema down-migration, rollback would be a two-step, error-prone, and often destructive (a down-migration that drops a column loses data) operation under exactly the conditions (an incident) where a fast, safe rollback matters most.
- Standard practice for zero-downtime deploys generally (not specific to this stack) — decouples "deploy new code" from "schema is in its final shape," which matters once there's more than one running instance of `apps/api` (a rolling deploy briefly runs old and new code against the same schema).

## Alternatives considered

- **Single-step destructive migrations + down-migrations for rollback:** simpler to write per-change, rejected because it makes rollback unsafe (potential data loss) exactly when safety matters most, and doesn't support zero-downtime rolling deploys.

## Consequences

- A "rename a column" change is always two PRs/migrations (add new column + backfill + dual-write if needed, then later remove the old column), never one — slower to fully complete, but each step is independently safe to deploy and roll back.
- Prisma's `migrate dev` will happily generate a single destructive migration if asked — this ADR is a process discipline, not something Prisma enforces automatically; code review is the enforcement mechanism (see `CONTRIBUTING.md`'s review guide).
