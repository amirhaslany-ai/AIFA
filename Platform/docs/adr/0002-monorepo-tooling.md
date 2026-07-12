# ADR-0002: pnpm workspaces + Turborepo for monorepo tooling

**Status:** Accepted
**Date:** 2026-07-12

## Context

The platform needs one repository containing multiple deployable apps (`apps/api`, `apps/web`) and multiple shared libraries (`packages/*`) with correct dependency ordering, incremental builds, and no duplicated `node_modules`.

## Decision

- **Package manager:** pnpm (workspace protocol `workspace:*` for internal deps; strict, disk-efficient, fast installs).
- **Task orchestration:** Turborepo (`turbo.json`) for cached, dependency-aware `build`/`lint`/`test`/`dev` pipelines across apps and packages.
- **Language:** TypeScript everywhere (apps and packages), one `tsconfig.base.json` extended per package.

## Rationale

- Both are official, actively maintained, widely documented tools (npm/pnpm docs, Vercel's Turborepo docs) — no unvetted community tooling.
- pnpm's content-addressable store and strict node_modules prevent the "phantom dependency" class of bugs common in npm/yarn monorepos.
- Turborepo's remote-cache-ready pipeline model scales from a solo founder's laptop to a CI fleet without a rewrite.

## Alternatives considered

- **Nx:** more powerful (generators, dependency graph visualization) but heavier and more opinionated than needed at foundation stage. Revisit if the number of packages grows past what Turborepo's simpler model comfortably handles.
- **Yarn workspaces / Lerna:** Lerna is in low-maintenance mode; yarn berry's PnP mode has more ecosystem friction than pnpm for this stack. Not chosen.
- **Single-package (no monorepo):** rejected — the AI provider abstraction, shared types, and the two apps genuinely need independent versioning and boundaries per the Constitution's own principle (Content Studio's D-002: small scoped units over monoliths — the same engineering value applies here).

## Consequences

- Every new package must declare its `name` under an `@aifa/` npm scope and be added to `pnpm-workspace.yaml` (already glob-matched, so no per-package registration needed beyond creating the folder).
- CI (repo-root `.github/workflows/aifa-platform-ci.yml`, scoped to `Platform/**` via `paths:` — GitHub Actions only discovers workflows at the true repo root, not in a subfolder) runs `turbo run lint test build` once; Turborepo internally parallelizes and skips unaffected packages.
