# apps/api

The AIFA platform backend — NestJS, hexagonal architecture. See `docs/architecture/backend-architecture.md` for the full layer breakdown and `docs/adr/0003-backend-framework.md` for why.

## Layout

```
src/
├── domain/            # entities, value objects, domain errors — no framework imports
├── application/        # use cases, ports (interfaces), cross-use-case services
├── infrastructure/      # port implementations (providers, clock, persistence, identity)
├── interfaces/http/     # controllers, DTOs, filters, middleware, guards, decorators
├── test-support/        # in-memory port fakes + real-crypto test helpers (test-only, not shipped)
├── health.module.ts     # Platform/System bounded context
├── identity.module.ts   # Identity bounded context — register/login/refresh/logout
├── wallet.module.ts      # Billing bounded context — ledger-based wallet
├── pricing.module.ts     # Billing bounded context — rule-based pricing engine (no controller)
├── app.module.ts
└── main.ts
```

## Running locally

```bash
pnpm --filter api dev
```

Requires `.env` at the `Platform/` root (copy from `.env.example`). Swagger docs available at `/v1/docs` once running.

## Bounded contexts

- **Platform/System** (`health.module.ts`): `HealthController` → `GetSystemHealthUseCase` → `ProviderHealthSourcePort`/`DependencyHealthSourcePort`/`ClockPort` → `ProviderRegistryAdapter`/`DependencyHealthAdapter`/`SystemClockAdapter`. `ProviderRegistryAdapter` also implements `ProviderCostSourcePort` (both ports bound to the same singleton via `useExisting`, not two separate instances — see the comment on `health.module.ts`'s `providers` array).
- **Provider Access** (no controller — consumed by other bounded contexts): `ProviderRegistryAdapter` builds each `AiProviderConfig` row into either a real `OpenAiCompatibleAdapter` (real `fetch`-based HTTP calls; used when `baseUrl`/`model`/`apiKeyEnvVar` are all set and the named env var holds a value at boot) or a `StubAdapter` (fallback, including for the bootstrap defaults `stub-primary`/`stub-secondary`), each wrapped in a `CircuitBreaker` and chained via `FallbackChain`. Cost rates (`costPerInputTokenMicros`/`costPerOutputTokenMicros`) are exposed per-provider via `ProviderCostSourcePort.getCostRates()`; `@aifa/ai-provider-sdk`'s `calculateCostMinorUnits` turns a `ChatResult.usage` + those rates into a cost figure. See `docs/adr/0007-ai-provider-layer-extensions.md`. No real vendor API key exists in this sandbox — the adapter is verified via injected-`fetch` unit tests, not a live vendor call.
- **Identity** (`identity.module.ts`): register/login/refresh/logout, real argon2id password hashing + real Ed25519 JWTs. See `docs/adr/0010-auth-token-strategy.md`. `AccountRepositoryPort`/`RefreshTokenRepositoryPort` → Prisma-backed adapters; `PasswordHasherPort` → `Argon2PasswordHasherAdapter`; `TokenIssuerPort`/`AuthGuardPort` → `jose`-backed Ed25519 adapters sharing one `JwtKeyProvider`. **Note:** cross-module guard sharing requires exporting both the guard class *and* its own constructor dependency token (`AUTH_GUARD_PORT`) — exporting only the class produced a "Nest can't resolve dependencies" boot error even with the consuming module correctly importing this one. See the comment on `identity.module.ts`'s `exports` array.
- **Billing** (`wallet.module.ts`): ledger-based wallet — credit/reserve/settle/rollback, real Prisma transactions. See `docs/adr/0008-wallet-ledger-pattern.md`. Only `GET /v1/wallet` is public; the other four use cases are real and DI-wired but deliberately not exposed via HTTP yet (see `wallet.controller.ts`'s doc comment).
- **Billing — Pricing** (`pricing.module.ts`): rule-based pricing engine — ordered `PricingPipeline` (base markup → floor), config-driven multiplier/floor, basis-points integer math with ceiling rounding. See `docs/adr/0009-pricing-engine-pattern.md`. No controller — `PricingEnginePort` is invoked by other use cases (the future Chat settlement flow), not called directly by a client.

See `docs/architecture/domain-boundaries.md` for what's planned next (Conversation, tying Identity + Provider Access + Wallet + Pricing together) and why it's sequenced last.

## Dependencies

`@aifa/types`, `@aifa/config`, `@aifa/logger`, `@aifa/ai-provider-sdk`, `@aifa/database` (workspace packages) — NestJS (`@nestjs/common`, `core`, `platform-express`, `swagger`, `terminus`), `class-validator`/`class-transformer`, `dotenv`, `ioredis`, `jose`, `@node-rs/argon2`.

## Public API (HTTP endpoints)

| Method | Path | Purpose |
|---|---|---|
| GET | `/v1/health` | Liveness — always `{"status":"ok"}` if the process can respond |
| GET | `/v1/health/ready` | Readiness — real database (Prisma), Redis, and `ProviderRegistry` checks. Returns HTTP 503 when `status` is `"down"`. |
| POST | `/v1/auth/register` | Create an account, returns an access + refresh token pair |
| POST | `/v1/auth/login` | Authenticate with email + password |
| POST | `/v1/auth/refresh` | Rotate a refresh token for a new pair (old one revoked; reuse revokes the whole session family) |
| POST | `/v1/auth/logout` | Revoke a session (idempotent) |
| GET | `/v1/auth/me` | Bearer-protected — returns `{ accountId }` for the current token |
| GET | `/v1/wallet` | Bearer-protected — the current account's wallet balance |
| GET | `/v1/docs` | Swagger UI (OpenAPI, auto-generated) |

## Example (verified output — see `PROGRESS_REPORT.md`)

```bash
$ curl http://localhost:3001/v1/health
{"status":"ok"}

$ curl -w '\n%{http_code}\n' http://localhost:3001/v1/health/ready
# with no reachable Postgres/Redis (verified in this sandbox — no live DB available):
{"status":"down","providers":[{"providerId":"stub-primary","status":"healthy","checkedAt":"..."},{"providerId":"stub-secondary","status":"healthy","checkedAt":"..."}],"dependencies":[{"name":"database","status":"unavailable","checkedAt":"..."},{"name":"redis","status":"unavailable","checkedAt":"..."}],"checkedAt":"..."}
503
```
