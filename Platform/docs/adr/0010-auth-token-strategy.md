# ADR-0010: Short-lived asymmetric-JWT access tokens + rotating opaque refresh tokens

**Status:** Accepted and implemented (Sprint 1 — see `apps/api/src/identity.module.ts` and its dependencies)
**Date:** 2026-07-12, transport decision revised 2026-07-12 (same day, during implementation — see "Token transport" below)
**Related:** `docs/architecture/security-architecture.md`, `docs/architecture/api-standards.md`

## Context

The API/frontend boundary (`api-standards.md`'s auth flow) and the `application/ports/auth-guard.port.ts` seam already assumed *some* token shape before implementation began. This ADR fixes that shape.

## Decision

Access tokens are short-lived (15 min default, `AUTH_ACCESS_TOKEN_TTL_SECONDS`) JWTs signed with EdDSA (Ed25519). Refresh tokens are opaque (256-bit random, SHA-256-hashed at rest — the raw value is never persisted), 30-day lifetime, rotated on every use (old token row marked revoked, a new row continues the same `familyId`), with reuse detection: presenting an already-rotated token revokes the entire session family, not just that token.

## Token transport (revised from the original design)

The original design (written before implementation) specified refresh tokens as httpOnly cookies. **The actual implementation returns both tokens in the JSON response body** (`AuthSessionResponseDto`), not a cookie. This was a deliberate revision made during implementation, not an oversight:

- ADR-0006 established this platform as an API-first product ("usable like an API product... comparable to OpenRouter") — an httpOnly cookie is meaningless to a non-browser client (mobile app, server-to-server caller, third-party integrator), which is exactly the audience ADR-0006 optimizes for.
- A browser-based first-party client (`apps/web`) should not store the raw refresh token in `localStorage` or client-readable state — the recommended pattern (not yet implemented, `apps/web` has no auth UI yet) is a Backend-for-Frontend: a Next.js route handler (matching the existing pattern in `apps/web/src/app/api/health/route.ts`) calls `/v1/auth/*` server-side and sets its *own* httpOnly cookie scoped to `apps/web`'s origin, never exposing the raw refresh token to client-side JS. This keeps the XSS-resistance property ADR-0010 originally wanted, without making the core API cookie-based (and therefore useless to non-browser clients).
- Implementing real cookie issuance from `apps/api` would additionally require `cookie-parser`, CSRF protection (cookies are sent automatically, unlike a Bearer header), and `SameSite`/cross-origin cookie configuration between two different ports/origins in dev — real complexity with no benefit to the API-first use case, and actively worse for non-browser clients.

## Rationale

- Asymmetric signing lets any future service (not just `apps/api`) verify tokens by holding only the public key — avoids a shared-secret distribution problem if the platform ever splits into more services.
- Short-lived access tokens bound the damage window of a leaked token without requiring server-side revocation checking on every request (stateless verification stays fast).
- Opaque (not JWT) refresh tokens mean the long-lived, higher-value credential is never self-describing if intercepted, and can be revoked server-side instantly (a JWT can't be "un-issued" before its expiry without a server-side blocklist, which would defeat the point of using a JWT for that purpose).
- Rotation-on-use with reuse detection is the current industry-standard mitigation for refresh-token theft (per OAuth 2.0 Security Best Current Practice) — a stolen-then-used-once refresh token becomes detectable rather than silently granting the attacker indefinite access.

## Alternatives considered

- **Symmetric JWT (HS256) for access tokens:** simpler (one shared secret), rejected because it doesn't scale to a future multi-service architecture without distributing the signing secret to every verifier, which is a larger blast radius if any one service is compromised.
- **Server-side sessions for everything (no JWT):** simpler mental model, rejected because it makes every request a database/Redis round-trip for session lookup — the stateless-access-token design trades a small amount of revocation latency (up to the token's 15-minute life) for that scalability.
- **Long-lived access tokens (skip refresh entirely):** rejected — a leaked long-lived token is a much larger risk with no rotation-based mitigation available.

## Consequences

- `RefreshToken` exists in `schema.prisma` with `tokenHash` (unique), `familyId`, `revokedAt`, `replacedBy`, `expiresAt`.
- Rotation and reuse detection are implemented together, not access-token issuance alone (`RefreshSessionUseCase` — see its unit tests for the reuse-detection scenario specifically: presenting a rotated-away token revokes the whole family, and a subsequently-legitimate token in that family is then also rejected).
- No httpOnly cookie exists anywhere in this API — see "Token transport" above. If `apps/web` ever needs a first-party browser session, it needs its own BFF layer; this is not built yet (no auth UI exists in `apps/web`).
- No OAuth/social login exists — email + password only. Real OAuth requires third-party provider credentials (Google/GitHub client id+secret) that don't exist in this environment; email+password was chosen specifically because it's the one auth method fully buildable and verifiable without external dependencies.
