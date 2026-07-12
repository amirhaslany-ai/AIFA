# Infrastructure

## Local development

```bash
docker compose -f infra/docker/docker-compose.yml up
```

Brings up Postgres, Redis, `apps/api`, and `apps/web` with the local `.env`. This is the only environment currently defined — see below for what's deliberately not built yet.

## Environments (design, not all implemented)

| Environment | Status | Notes |
|---|---|---|
| Local | Implemented (`infra/docker/docker-compose.yml`) | Throwaway credentials, single-host, no orchestration |
| CI | Implemented (repo-root `.github/workflows/aifa-platform-ci.yml`) | Ephemeral services via GitHub Actions service containers (Postgres/Redis), not this compose file |
| Staging | Not implemented | No cloud provider/orchestrator chosen yet — flagged as a founder decision once the platform needs a shared, always-on environment |
| Production | Not implemented | Depends on the staging decision above; also depends on real secrets-manager choice (`docs/architecture/secrets-config-management.md`) |

## Deployment architecture (target shape, once staging/production exist)

Each app (`apps/api`, `apps/web`) builds to its own container image via its `Dockerfile`, pushed to a registry by CI on merge to `main` (not yet wired — see `docs/ci-cd-pipeline.md`'s follow-up section), then deployed to whatever orchestrator is chosen (a single-VM Docker Compose deploy, a managed container platform, or Kubernetes are all viable at this scale — no choice made yet, deliberately deferred until real traffic/budget constraints exist rather than guessed).

## Why not Kubernetes now

The mission principle "never optimize prematurely" applies directly here: K8s' operational overhead (cluster management, ingress, secrets operator, etc.) has no payoff at zero real users. The Docker Compose + per-app Dockerfile structure is deliberately K8s-compatible-in-spirit (one container per app, config via env vars, health checks already defined) so migrating later is additive, not a rewrite.
