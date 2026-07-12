# Security Architecture

Secrets and environment handling is covered in `secrets-config-management.md` — this document covers everything else: authentication tokens, rate limiting, encryption, PII, headers, and a threat model. Most of this is design-only (no auth implementation exists this milestone, per mission scope) but is documented now so the eventual implementation has an agreed shape.

## JWT strategy (design — not implemented)

- **Access token:** JWT, signed with an asymmetric key (RS256/EdDSA, not HS256 — asymmetric lets `apps/web`'s server-side code or a future separate service verify tokens without holding the signing key), short-lived (target: 15 minutes). Claims: `sub` (account id), `iat`, `exp`, nothing sensitive (JWTs are base64, not encrypted — never put PII beyond an id in claims).
- **Refresh token:** opaque (not a JWT), long-lived (target: 30 days), stored httpOnly + Secure + SameSite=Lax cookie, never accessible to client-side JS. Persisted server-side (hashed, not plaintext — same principle as password storage) so a single refresh token can be revoked without invalidating every session.
- **Rotation:** every refresh-token use issues a new refresh token and invalidates the old one (rotation-on-use) — limits the damage window if a refresh token is ever exfiltrated, since a replayed old token after rotation is detectable (a reuse-detection signal that should trigger revoking the entire token family, target design).

## Session strategy (design)

Stateless for the access token (any `apps/api` instance can verify a JWT without a shared session store — matters once there's more than one instance). The refresh-token table (target: a `RefreshToken` entity, not yet in the schema) is the only server-side session state, queried only on refresh, not on every request — keeps the hot path (most requests, using the access token) fast and stateless.

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
| SQL injection | Prisma's parameterized queries by default (no raw SQL in this codebase) | None identified — stays true only as long as `$queryRaw`/`$executeRaw` are avoided; flag any future use for review |
| Provider outage cascading to full outage | `CircuitBreaker` + `FallbackChain` (ADR-0005, implemented and tested) | None at foundation level |
| Over-billing due to a lost/duplicate ledger write | Ledger idempotency via `referenceId` uniqueness (ADR-0008, design-only) | Not implemented — this is a design mitigation, not yet a running one |
| Token theft (XSS exfiltrating a refresh token) | httpOnly cookie design (JWT strategy above) | Not implemented; also depends on `apps/web` never rendering unsanitized user content, which isn't yet a concern with zero product UI |
| Denial of service via request flooding | Rate limiting design (above) | Not implemented; no CDN/WAF layer chosen yet (infra decision, deferred with the rest of `infra/README.md`'s staging/production gap) |

This table should grow as real features land — a threat model for features that don't exist yet is necessarily incomplete by design, not an oversight.
