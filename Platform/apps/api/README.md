# apps/api

The AIFA platform backend — NestJS, hexagonal architecture. See `docs/architecture/backend-architecture.md` for the full layer breakdown and `docs/adr/0003-backend-framework.md` for why.

## Layout

```
src/
├── domain/            # entities, domain errors — no framework imports
├── application/        # use cases + ports (interfaces)
├── infrastructure/      # port implementations (providers, clock, persistence — persistence not yet added)
├── interfaces/http/     # controllers, DTOs, filters, middleware
├── health.module.ts     # the one fully-wired vertical slice this milestone
├── app.module.ts
└── main.ts
```

## Running locally

```bash
pnpm --filter api dev
```

Requires `.env` at the `Platform/` root (copy from `.env.example`). Swagger docs available at `/v1/docs` once running.

## The `HealthModule` slice

Demonstrates the full dependency rule end to end: `HealthController` (interfaces) → `GetSystemHealthUseCase` (application) → `ProviderHealthSourcePort` + `ClockPort` (application ports) → `ProviderRegistryAdapter` + `SystemClockAdapter` (infrastructure). No other bounded context exists yet — see `docs/architecture/domain-boundaries.md` for what's planned next (Identity, Provider Access, Billing, Conversation) and why they're sequenced that way.

## Dependencies

`@aifa/types`, `@aifa/config`, `@aifa/logger`, `@aifa/ai-provider-sdk` (workspace packages) — NestJS (`@nestjs/common`, `core`, `platform-express`, `swagger`, `terminus`), `class-validator`/`class-transformer`, `dotenv`.

## Public API (HTTP endpoints)

| Method | Path | Purpose |
|---|---|---|
| GET | `/v1/health` | Liveness — always `{"status":"ok"}` if the process can respond |
| GET | `/v1/health/ready` | Readiness — real `ProviderRegistry` health, per-provider |
| GET | `/v1/docs` | Swagger UI (OpenAPI, auto-generated) |

## Example (verified output — see `PROGRESS_REPORT.md`)

```bash
$ curl http://localhost:3001/v1/health
{"status":"ok"}

$ curl http://localhost:3001/v1/health/ready
{"status":"ok","providers":[{"providerId":"stub-primary","status":"healthy","checkedAt":"..."},{"providerId":"stub-secondary","status":"healthy","checkedAt":"..."}],"checkedAt":"..."}
```
