# Security Architecture

Secrets and environment handling is covered in `secrets-config-management.md` — this document covers everything else: authentication tokens, rate limiting, encryption, PII, headers, and a threat model. Rate limiting, encryption-at-rest, and headers remain design-only; JWT/session strategy is now implemented (Sprint 1) — see `docs/adr/0010-auth-token-strategy.md` for the full decision record, including a token-transport revision made during implementation (below).

## JWT strategy (implemented)

- **Access token:** JWT, signed with EdDSA (Ed25519), 15-minute default lifetime (`AUTH_ACCESS_TOKEN_TTL_SECONDS`). Claims: `sub` (account id), `iat`, `exp`, nothing else.
- **Refresh token:** opaque (not a JWT), 30-day lifetime, SHA-256-hashed at rest (raw value never persisted). **Returned in the JSON response body, not an httpOnly cookie** — revised from the original design during implementation; see `docs/adr/0010-auth-token-strategy.md`'s "Token transport" section for why (this is an API-first product per ADR-0006; a cookie is meaningless to non-browser clients, and a first-party browser client should get its own BFF-managed cookie rather than the core API being cookie-based).
- **Rotation:** every refresh-token use issues a new pair and revokes the old refresh token (rotation-on-use). Reuse of an already-rotated token revokes the entire session family, not just that token (`RefreshSessionUseCase`, tested explicitly).

## Session strategy (implemented)

Stateless for the access token (any `apps/api` instance can verify a JWT without a shared session store). The `RefreshToken` table is the only server-side session state, queried only on refresh, not on every request.

## Key rotation

The JWT signing keypair should support rotation without invalidating in-flight tokens: target design is a `kid` (key id) claim in the JWT header, with `apps/api` holding the current + previous public key during a rotation window (verify against either), while only ever signing new tokens with the current private key. Rotation cadence is not decided (a security/ops decision, not an architecture one) — flagged rather than guessed.

## Rate limiting (detail beyond `api-architecture.md`'s seam mention)

- **Where:** a Nest guard/interceptor at the `interfaces/http` layer (never inside a use case — rate limiting is a delivery-mechanism concern, not a business rule).
- **Strategy:** token bucket per account (once auth exists) and per IP (for unauthenticated endpoints, e.g. `/v1/auth/session`), backed by Redis (`INCR` + `EXPIRE`, or a Redis-native rate-limit library) — not in-process memory, since `apps/api` is expected to run as more than one instance eventually and in-process counters would let a client bypass the limit by hitting a different instance.
- **Response:** `429` with a `Retry-After` header and the standard error shape (`api-architecture.md`), `code: RATE_LIMITED`.
- Default limits are not decided (depend on real traffic patterns and abuse cases that don't exist yet) — flagged, not guessed.

## Encryption

- **In transit:** TLS terminated at the load balancer/reverse proxy in any real deployment (not `apps/api` itself) — not yet relevant since no deployment target is chosen (`infra/README.md`).
- **At rest:** deferred to the hosting provider's managed-database encryption-at-rest (standard on RDS/Cloud SQL/Neon/Supabase) rather than application-level column encryption, unless a specific field is identified as needing it beyond what "the whole database is encrypted at rest" already provides (e.g. a field that must be unreadable even to someone with raw DB access — no such field is identified yet).
- **Passwords:** if password-based auth is ever added (vs. OAuth-only), use argon2id (current OWASP recommendation), never a faster/older hash (bcrypt is acceptable as a fallback if the runtime lacks argon2 support; MD5/SHA-family alone are never acceptable for password storage).

## PII handling

- Minimum collection: `email` is the only PII in the current schema (`Account`/`User`). Anything more (name, phone, payment details) is added only when a real feature needs it, not speculatively.
- Logging (`logging-strategy.md`) already forbids logging secrets and full request bodies by default — extend this explicitly to PII: an account's email should appear in logs only as a hashed/truncated reference in non-debug environments, full value only at `debug` level in non-production.
- No PII export/deletion (GDPR-style "right to be forgotten") flow is designed yet — depends on which jurisdictions the platform serves, an open question (mirrors Content Studio's own unresolved locale question) — flagged for founder input once relevant, not guessed.

## CORS (trust boundary between apps/web and apps/api)

`apps/web` and `apps/api` are separate origins by design (`frontend-architecture.md`). `apps/api`'s `main.ts` calls `app.enableCors({ origin: <allowlist>, credentials: true })`, where the allowlist is `CORS_ALLOWED_ORIGINS` (`@aifa/config`, comma-separated, defaults to `http://localhost:3000` for local dev) — never a wildcard, since `credentials: true` requires an explicit origin per the CORS spec anyway. Production deployments must set this to the real `apps/web` origin(s); the default is local-dev-only. Fixed as part of `04_PATCH_LIST.md` P1-4 — previously no CORS policy existed at all, which meant client-side browser calls from `apps/web` to `apps/api` were silently blocked, not deliberately closed.

## Security headers

Target middleware (via `helmet` or NestJS's equivalent, not yet added as a dependency): `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY` (or a `Content-Security-Policy frame-ancestors` equivalent), `Referrer-Policy: strict-origin-when-cross-origin`. Not implemented this milestone since it's a one-line addition best done alongside the first real deployment (adding it to a not-yet-deployed API has no immediate value and risks bit-rotting before it's ever tested against a real client).

## Threat model (foundation-level — revisit once real features exist)

| Threat | Current mitigation | Gap |
|---|---|---|
| Secrets committed to git | `.gitignore` excludes `.env*`; `.env.example` never has real values | No automated secret-scanning in CI yet (target: add a pre-commit or CI secret-scan step, e.g. gitleaks, once the repo has real secrets to protect) |
| SQL injection | Prisma's parameterized queries throughout; the one `$queryRaw` use (`prisma.health-indicator.ts`) is a literal `SELECT 1` with no interpolated values — safe by construction, not by discipline alone | Flag any future `$queryRaw`/`$executeRaw` use with interpolated values for review — Prisma's tagged-template form auto-parameterizes, `$queryRawUnsafe`/string-concatenation would not |
| Provider outage cascading to full outage | `CircuitBreaker` + `FallbackChain` (ADR-0005, implemented and tested) | None at foundation level |
| Over-billing due to a lost/duplicate ledger write | Ledger idempotency via `referenceId` uniqueness (ADR-0008, design-only) | Not implemented — this is a design mitigation, not yet a running one |
| Token theft (XSS exfiltrating a raw refresh token from a browser client) | Refresh tokens are hashed at rest server-side (a leaked DB doesn't expose usable tokens); rotation-on-use + reuse detection limits a stolen token's usable window | `apps/web` has no auth UI yet, so no browser client stores a raw token today — but the core API returns tokens in the JSON body (ADR-0010's revised transport decision), so whoever builds `apps/web`'s auth UI must implement the documented BFF-cookie pattern, not store the raw token in client-readable state |
| Denial of service via request flooding | Rate limiting design (above) | Not implemented; no CDN/WAF layer chosen yet (infra decision, deferred with the rest of `infra/README.md`'s staging/production gap) |

This table should grow as real features land — a threat model for features that don't exist yet is necessarily incomplete by design, not an oversight.
