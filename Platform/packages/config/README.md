# @aifa/config

Typed, validated environment configuration loading. This is the **only** package allowed to call `process.env` directly — everything else (apps and other packages) imports `loadConfig()` and receives a fully-typed, already-validated object.

See `docs/architecture/secrets-config-management.md` for the full policy this package implements.

## Dependencies

`zod` (schema validation). No other runtime dependency.

## Public API

- `loadConfig(env?: NodeJS.ProcessEnv): AppConfig` — parses and validates, throws with a readable message on failure.
- `configSchema` — the zod schema itself, exported for anything that needs to validate a partial shape (e.g. a test).
- `AppConfig` — the inferred TypeScript type.

## Usage

```ts
import { loadConfig } from '@aifa/config';

const config = loadConfig(); // throws at boot if required vars are missing/invalid
config.api.port;
config.database.url;
```

## Adding a new variable

1. Add it to `.env.example` at the repo root with a comment.
2. Add it to the zod schema in `src/schema.ts`, under the right namespace (`api`, `web`, `database`, `redis`, `observability`).
3. Consume it via `loadConfig()` — never `process.env.YOUR_VAR` directly anywhere else in the codebase.
