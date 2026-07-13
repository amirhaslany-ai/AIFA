# Security Architecture

Secrets and environment handling is covered in `secrets-config-management.md` — this document covers everything else: authentication tokens, rate limiting, encryption, PII, headers, and a threat model. JWT/session strategy, rate limiting, and security headers are now implemented (Sprint 1 + the pre-freeze hardening pass); encryption-at-rest remains deferred to the hosting provider (not yet chosen). See `docs/adr/0010-auth-token-strategy.md` for the auth decision record, including a token-transport revision made during implementation (below).

## JWT strategy (implemented)

- **Access token:** JWT, signed with EdDSA (Ed25519), 15-minute default lifetime (`AUTH_ACCESS_TOKEN_TTL_SECONDS`). Claims: `sub` (account id), `iat`, `exp`, nothing else.
- **Refresh token:** opaque (not a JWT), 30-day lifetime, SHA-256-hashed at rest (raw value never persisted). **Returned in the JSON response body, not an httpOnly cookie** — revised from the original design during implementation; see `docs/adr/0010-auth-token-strategy.md`'s "Token transport" section for why (this is an API-first product per ADR-0006; a cookie is meaningless to non-browser clients, and a first-party browser client should get its own BFF-managed cookie rather than the core API being cookie-based).
- **Rotation:** every refresh-token use issues a new pair and revokes the old refresh token (rotation-on-use). Reuse of an already-rotated token revokes the entire session family, not just that token (`RefreshSessionUseCase`, tested explicitly).

## Session strategy (implemented)

Stateless for the access token (any `apps/api` instance can verify a JWT without a shared session store). The `RefreshToken` table is the only server-side session state, queried only on refresh, not on every request.

## Key rotation

The JWT signing keypair should support rotation without invalidating in-flight tokens: target design is a `kid` (key id) claim in the JWT header, with `apps/api` holding the current + previous public key during a rotation window (verify against either), while only ever signing new tokens with the current private key. Rotation cadence is not decided (a security/ops decision, not an architecture one) — flagged rather than guessed.

## Rate limiting (implemented)

- **Where:** `@nestjs/throttler`'s `ThrottlerGuard`, applied globally via `APP_GUARD` in `app.module.ts` — a delivery-mechanism concern, never inside a use case.
- **Strategy:** in-process, per-IP token bucket (`ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }])` — 100 req/min default), with a stricter per-route override (`@Throttle({ default: { ttl: 60_000, limit: 10 } })`) on `POST /v1/auth/register` and `POST /v1/auth/login`, the two highest-value brute-force/abuse targets.
- **Known limitation:** in-process counters, not Redis-backed — a client can bypass the limit by being routed to a different `apps/api` replica once more than one instance runs. Acceptable at current (single-instance) scale; revisit with a Redis-backed store (`@nestjs/throttler`'s `ThrottlerStorageRedisService` or equivalent) once horizontal scaling is real.
- **Response:** `ThrottlerException` extends Nest's `HttpException`, so `DomainErrorFilter`'s existing `HttpException` branch already maps it into the standard `{error: {code, message, requestId}}` envelope at `429` — no filter change was needed.
- Default limits (100/min, 10/min on auth) are conservative engineering defaults, not tuned against real traffic — revisit once real usage patterns exist.

## Encryption

- **In transit:** TLS terminated at the load balancer/reverse proxy in any real deployment (not `apps/api` itself) — not yet relevant since no deployment target is chosen (`infra/README.md`).
- **At rest:** deferred to the hosting provider's managed-database encryption-at-rest (standard on RDS/Cloud SQL/Neon/Supabase) rather than application-level column encryption, unless a specific field is identified as needing it beyond what "the whole database is encrypted at rest" already provides (e.g. a field that must be unreadable even to someone with raw DB access — no such field is identified yet).
- **Passwords:** if password-based auth is ever added (vs. OAuth-only), use argon2id (current OWASP recommendation), never a faster/older hash (bcrypt is acceptable as a fallback if the runtime lacks argon2 support; MD5/SHA-family alone are never acceptable for password storage).

## PII handling

- Minimum collection: `email` is the only PII in the current schema (`Account`/`User`). Anything more (name, phone, payment details) is added only when a real feature needs it, not speculatively.
- Logging (`logging-strategy.md`) already forbids logging secrets and full request bodies by default — extend this explicitly to PII: an account's email should appear in logs only as a hashed/truncated reference in non-debug environments, full value only at `debug` level in non-production.
- No PII export/deletion (GDPR-style "right to be forgotten") flow is designed yet — depends on which jurisdictions the platform serves, an open question (mirrors Content Studio's own unresolved locale question) — flagged for founder input once relevant, not guessed.

## CORS (trust boundary between apps/web and apps/api)

`apps/web` and `apps/api` are separate origins by design (`frontend-architecture.md`). `apps/api`'s `main.ts` calls `app.enableCors({ origin: <allowlist>, credentials: true })`, where the allowlist is `CORS_ALLOWED_ORIGINS` (`@aifa/config`, comma-separated, defaults to `http://localhost:3000` for local dev) — never a wildcard, since `credentials: true` requires an explicit origin per the CORS spec anyway. Production deployments must set this to the real `apps/web` origin(s); the default is local-dev-only.

## Security headers (implemented)

`app.use(helmet())` in `main.ts` — `helmet`'s default policy (`Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `X-Frame-Options`, `Strict-Transport-Security` when served over HTTPS, `Referrer-Policy`, and the rest of helmet's standard header set). Not yet tuned with a custom CSP for any specific real client — helmet's defaults are a safe, real baseline, not a placeholder.

## Threat model (foundation-level — revisit once real features exist)

| Threat | Current mitigation | Gap |
|---|---|---|
| Secrets committed to git | `.gitignore` excludes `.env*`; `.env.example` never has real values; CI runs a `gitleaks` scan (warn-only — `.github/workflows/aifa-platform-ci.yml`) | Warn-only, not yet blocking — tighten once it's run clean for a while. CI has never actually executed (nothing pushed to the remote yet), so this has never run for real either. |
| SQL injection | Prisma's parameterized queries throughout; the two `$queryRaw` uses (`prisma.health-indicator.ts`'s `SELECT 1`, both literal, no interpolated values) are safe by construction, not by discipline alone | Flag any future `$queryRaw`/`$executeRaw` use with interpolated values for review — Prisma's tagged-template form auto-parameterizes, `$queryRawUnsafe`/string-concatenation would not |
| Provider outage cascading to full outage | `CircuitBreaker` + `FallbackChain` (ADR-0005, implemented and tested, including the half-open single-trial fix) | None at foundation level |
| Over-billing due to a lost/duplicate ledger write | Ledger idempotency via `(walletId, referenceId, type)` uniqueness (ADR-0008, implemented and tested) | Never run against a real Postgres instance — idempotency under real concurrent writes is unverified |
| Token theft (XSS exfiltrating a raw refresh token from a browser client) | Refresh tokens are hashed at rest server-side (a leaked DB doesn't expose usable tokens); rotation-on-use + reuse detection limits a stolen token's usable window | `apps/web` has no auth UI yet, so no browser client stores a raw token today — but the core API returns tokens in the JSON body (ADR-0010's revised transport decision), so whoever builds `apps/web`'s auth UI must implement the documented BFF-cookie pattern, not store the raw token in client-readable state |
| Denial of service via request flooding | `@nestjs/throttler`, global 100/min per IP + stricter 10/min on auth endpoints (implemented) | In-process counters only, bypassable across multiple `apps/api` replicas until Redis-backed; no CDN/WAF layer chosen yet (infra decision, deferred with the rest of `infra/README.md`'s staging/production gap) |
| Silent auth failure from misconfigured signing keys | `@aifa/config` refuses to boot when `NODE_ENV=production` and `AUTH_JWT_*_PEM` are unset (implemented) — previously booted "successfully" with an ephemeral keypair, invalidating every token on the next restart | None known |
| Unauthenticated API-surface disclosure via Swagger | `/v1/docs` is only mounted when `NODE_ENV !== 'production'` (implemented) | None known |
| Container running as root | Both Dockerfiles now run as the built-in non-root `node` user (implemented) | Never actually verified with a real `docker build` — no Docker daemon available in this codebase's development history |

This table should grow as real features land — a threat model for features that don't exist yet is necessarily incomplete by design, not an oversight.
