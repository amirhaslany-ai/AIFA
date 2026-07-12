# CI/CD Pipeline Design

## What's implemented (repo-root `.github/workflows/aifa-platform-ci.yml`)

**Location note:** the workflow file lives at the true repository root (`.github/workflows/`), not under `Platform/.github/` — GitHub Actions only discovers workflows at the repo root, even in a repo where `Platform/` is a subfolder. It's scoped to this folder via `paths: ["Platform/**"]` and `working-directory: Platform`, not by its physical location.

Runs on every PR and push to `main` that touches `Platform/**`:
1. Checkout, Node (version from `.nvmrc`), pnpm (via `pnpm/action-setup`).
2. `pnpm install --frozen-lockfile` — fails the build if `pnpm-lock.yaml` is out of sync with `package.json` files, catching un-committed lockfile changes.
3. `turbo run lint | typecheck | test | build` — each Turborepo-cached and dependency-aware, so only affected packages re-run on subsequent commits.

Ephemeral Postgres and Redis are provided as GitHub Actions service containers (not the `infra/docker/docker-compose.yml` file, which is for local development) — this is why CI and local dev use separate, if similar, service definitions.

## What's not implemented (CD — deliberately deferred)

There is no deploy step. This is intentional: no staging/production environment exists yet (`infra/README.md`), so a CD step would have nothing real to deploy to. When a deployment target is chosen:

1. Add a `docker build` + registry push step per app (`apps/api/Dockerfile`, `apps/web/Dockerfile`), gated on `push: branches: [main]` only (never on PRs).
2. Add a deploy step specific to the chosen target (single-VM `docker compose pull && up -d` over SSH, a managed platform's CLI, or a Kubernetes manifest apply) — the specific mechanism is an infrastructure decision, not an architecture decision, and shouldn't be guessed here.
3. Gate production deploys on the full `lint/typecheck/test/build` job succeeding first (already structured as a prerequisite by putting them in one job).

## Branch protection (recommended, not yet configured — requires repo admin access)

`main` should require the `lint-typecheck-test-build` check to pass before merge. Not configured as part of this milestone since it's a GitHub repository setting, not a file in this codebase.

## Release flow (target design — no releases exist yet)

- **Versioning:** each app (`apps/api`, `apps/web`) is versioned and deployed independently — they are two separate deployables, not a single monorepo version. A shared package (`@aifa/*`) getting a breaking change is caught by CI (typecheck/test failures in dependent apps), not by a manual version-bump-and-check process.
- **Trigger:** target design is deploy-on-merge-to-`main` for whichever environment `main` maps to (commonly staging-first, promoted to production — see Environment Promotion below), gated on CI passing. No tagging/release-branch scheme is chosen yet since there's only one environment path defined (local) and no real users to protect from an untested release.
- **Artifact:** each app's Docker image, tagged with the git SHA (immutable, traceable) and optionally a floating `latest`/`stable` tag for convenience — not decided which registry hosts these yet (depends on the infra/hosting decision, `infra/README.md`).

## Environment promotion (target design)

```
Local (docker-compose, implemented)
   → CI (ephemeral, implemented — proves the build/tests pass, not a long-lived environment)
   → Staging (not implemented — no environment exists)
   → Production (not implemented)
```

Promotion between staging and production should be the *same build artifact* moving forward (rebuild-per-environment is explicitly avoided — it reintroduces "works in staging, broke in prod because the build differed" risk), gated on a manual approval step or a soak-time check once staging exists. Neither exists yet, so this is a target shape, not a running process.

## Rollback strategy (target design)

- **Application rollback:** redeploy the previous image tag (git-SHA-tagged images, per Release Flow above, make this a simple retag/redeploy rather than a rebuild) — should be a single command/action once a deploy mechanism exists.
- **Database rollback:** migrations are additive/expand-contract by default (`database-standards.md`'s migration strategy) specifically so an application rollback never needs a matching *down* migration — the old application code should keep working against the new (additive) schema. A genuinely destructive migration (the "contract" step) is only run after confirming no rollback to pre-contract code is possible, which is why contract migrations are deliberately a separate, later step, not bundled with the expand step.
- No automated rollback trigger (e.g. auto-rollback on an elevated error-rate alert) is designed yet — depends on the Monitoring/Alerting stack existing first (`monitoring-observability.md`'s follow-up work).
