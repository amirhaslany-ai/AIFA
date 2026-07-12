# Secrets & Configuration Management

## Layered config model

1. **`.env.example`** (committed) — documents every variable, no real values, the single source of truth for "what config exists."
2. **`.env`** (git-ignored, local only) — a developer's real local values, copied from `.env.example`.
3. **`@aifa/config`** — a typed schema (zod) that parses `process.env` once at process boot, throws immediately (fail-fast) if a required variable is missing or malformed, and is the *only* way any other code reads configuration. No file outside `@aifa/config` calls `process.env` directly — this is what makes "what config does this app need" answerable by reading one file instead of grepping the codebase.

## Secrets vs. config

- **Config:** non-sensitive (ports, feature flags, log level, public URLs). Fine to have realistic-looking values in `.env.example`.
- **Secrets:** API keys, database credentials, anything that grants access. `.env.example` lists the variable name with an empty/placeholder value and a comment, never a real or even a plausible-looking fake secret.

## Local development

Real secrets (e.g., a personal OpenAI key for manual adapter testing, once adapters are real) live only in a developer's own `.env`, never committed, never shared in chat/tickets in plaintext.

## Staging/production (design — not implemented, no deployment exists yet)

Secrets should be injected by the deployment platform's own secret store (e.g., a cloud provider's secrets manager, or a self-hosted option like Vault/Doppler) as environment variables at container start — never baked into a Docker image layer, never committed to `infra/docker/docker-compose.yml` (which uses local-only placeholder credentials suitable for a throwaway local Postgres, not real infrastructure). The specific secrets-manager product is an infrastructure decision deferred until a real deployment target/cloud provider is chosen (tracked as follow-up work, not blocking this milestone).

## Rotation

No rotation policy is defined yet — there is nothing to rotate until real credentials exist. Flagged here as a placeholder so it isn't silently skipped when real provider/database credentials are provisioned.

## Enforcement today

- `.gitignore` excludes `.env*` except `.env.example` (root `Platform/.gitignore`).
- `@aifa/config`'s fail-fast validation means a missing secret is a boot-time crash with a clear message, never a silent `undefined` reaching a use case.
