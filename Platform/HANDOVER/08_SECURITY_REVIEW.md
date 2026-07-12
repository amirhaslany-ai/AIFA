# 08 — Security Review

Current status only. Nothing here describes planned controls as if active.

## Authentication

**Real and reasonably strong.** Argon2id password hashing (`@node-rs/argon2`, a native binding, not a pure-JS implementation). Ed25519-signed JWT access tokens, 15-minute default TTL. Refresh tokens are opaque (256-bit random), SHA-256-hashed at rest — the raw token is never persisted — with rotation-on-use and reuse detection (a stolen-then-reused refresh token revokes the entire session family, not just itself). This matches OAuth 2.0 Security BCP guidance.

**Gap:** if `AUTH_JWT_PRIVATE_KEY_PEM`/`AUTH_JWT_PUBLIC_KEY_PEM` are unset, the process generates an ephemeral keypair at boot and only logs a warning — it does not refuse to start. In a real deployment, this silently invalidates every issued token on every restart. See `06_TECHNICAL_DEBT.md` item 6.

**Gap:** no OAuth/social login exists — email + password only. Not a defect (a deliberate scope decision, ADR-0010, since no third-party OAuth credentials exist to build against), but worth knowing as a current limitation.

## Authorization gaps

There is **no role or permission model of any kind.** Every endpoint's access control is "must present a valid Bearer token, and may only read/write resources scoped to that token's `accountId`." There is no admin role, no team/org concept, no scoped API keys, no `PermissionPort` implementation (mentioned as a design target in `api-standards.md`, never built). This is adequate for a single-tier, single-user-per-account product and inadequate the moment any admin tooling, org/team accounts, or tiered access is needed.

## Secrets

`.env.example` contains no real values (verified by inspection — every value is either a placeholder or a throwaway local-dev default like `aifa_local_dev`). `.gitignore` excludes `.env*` except the example file. `apiKeyEnvVar` on `AiProviderConfig` stores only the *name* of an environment variable, never a secret value, by design. **Gap:** no automated secret-scanning exists in CI (no gitleaks or equivalent) — if a real secret is ever accidentally committed, nothing catches it before it reaches git history.

## Environment variables

`@aifa/config`'s zod schema validates every required variable at boot and fails fast with every violation listed in one error — a genuinely good pattern (verified by tests). No environment variable is read directly via `process.env` inside `apps/api`'s business logic; the one exception is `apps/web/src/app/api/health/route.ts`, which reads `NEXT_PUBLIC_API_BASE_URL` directly rather than through `@aifa/config` (a pre-existing, low-severity, carried-over inconsistency — `06_TECHNICAL_DEBT.md` item 19-20 territory).

## Input validation

**Real and globally wired.** `app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))` in `main.ts` — every request DTO is validated via `class-validator` decorators before reaching a controller method, and unknown properties are stripped rather than silently accepted. This closed a gap the pre-Sprint-1 audit flagged (the pipe used to be entirely unwired); it is now genuinely active on every one of the 12 endpoints.

## Rate limiting

**Does not exist.** No `@nestjs/throttler` or equivalent package is installed. `POST /v1/auth/login`, `/v1/auth/register`, and `POST /v1/chat` all accept unlimited requests from any single caller today. This is the single most important security gap in the current system if it were ever deployed as-is — see `06_TECHNICAL_DEBT.md` item 2.

## Headers

**No security headers are set anywhere.** No `helmet` package, no manual `Content-Security-Policy`/`X-Frame-Options`/`Strict-Transport-Security`/`X-Content-Type-Options` headers on any response.

## Logging

Structured JSON logging (pino) exists and is used for the exception filter and application startup. **Gap:** it is not wired into Nest's DI container as a general-purpose service — no request-level access log exists correlating successful requests to their `requestId` (the id is generated and propagated, just never logged on the happy path). No log statement anywhere was found to log a raw password, a raw refresh token, or a signing key — verified by inspection of every `logger.*`/`console.*` call site in the codebase.

## Sensitive information

- Passwords: never logged, never returned in any response, stored only as an argon2id hash.
- Refresh tokens: the raw value is returned to the client exactly once (at issuance/rotation), never logged, never stored raw — only `tokenHash` (SHA-256) is persisted.
- The `OpenAiCompatibleAdapter`'s error messages are explicitly designed to never include the API key, verified by a dedicated unit test (`throws on a non-ok response without leaking the API key`) that asserts the thrown error's message does not contain the configured key.
- Generic 500 responses never leak a stack trace to the client (`DomainErrorFilter`'s catch-all branch returns a sanitized message; the real error is only logged server-side).

## Docker security

**No Dockerfile sets a `USER` directive** — both `apps/api` and `apps/web` containers, if built, would run their process as root by default. Neither has been built or run in any environment used, so this has never manifested as an actual incident, but it is a real configuration gap that should be fixed before any real deployment.

## Supply chain

- Dependency versions are pinned with `^` ranges (standard npm semver, not exact pins) in every `package.json`.
- `pnpm-lock.yaml` is committed and tracked (this was a real fix during an earlier phase — the lockfile was previously untracked, which would have broken every `--frozen-lockfile` install).
- **No automated dependency-vulnerability scanning exists** — no Dependabot config, no Renovate config, no `npm audit`/`pnpm audit` step in CI.
- No Docker base-image scanning exists (moot until Docker is actually built for the first time).

## Dependency risks (specific, not generic)

- `@node-rs/argon2` and `jose` are both mature, widely-used, actively-maintained packages appropriate for their cryptographic role — no concern.
- `ioredis` is used only for health-check pinging today (`06`/`03` — Redis has exactly one real consumer currently), so its blast radius if compromised is currently minimal, but this will grow the moment Redis gains a real caching/session/queue consumer.
- No vendor AI SDK (`openai`, `@anthropic-ai/*`, etc.) is a dependency anywhere — `OpenAiCompatibleAdapter` deliberately avoids this entire supply-chain surface by using the platform's own `fetch` against a documented HTTP contract instead.

## Additional finding: Swagger UI is unauthenticated

`/v1/docs` (the full OpenAPI/Swagger UI) has no guard and no environment-based gating — it is reachable by anyone who can reach the server, in every environment including a hypothetical production deployment, and would expose the complete API surface including request/response shapes and error codes. See `06_TECHNICAL_DEBT.md` item 12.

## What genuinely holds up

- No raw SQL anywhere in the codebase — Prisma's parameterized query builder is used exclusively, so the SQL-injection surface is closed by construction as long as `$queryRaw`/`$executeRaw` stay unused for anything touching user input (today's one use of `$queryRaw` is `PrismaHealthIndicator`'s hardcoded `SELECT 1`, which takes no user input).
- CORS is a real, configured allowlist (`config.api.corsAllowedOrigins`), not a wildcard — `credentials: true` requires this per the CORS spec anyway, so this was the correct, not merely convenient, choice.
- The refresh-token rotation/reuse-detection design is genuinely sound and matches current industry best practice, not just "good enough for a foundation."
