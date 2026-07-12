# ADR-0010: Short-lived asymmetric-JWT access tokens + rotating opaque refresh tokens

**Status:** Accepted (design-only — not implemented)
**Date:** 2026-07-12
**Related:** `docs/architecture/security-architecture.md`

## Context

Authentication implementation is out of scope for this foundation milestone, but the API/frontend boundary (`api-standards.md`'s auth flow design) and the `application/ports/auth-guard.port.ts` seam already assume *some* token shape. Deferring this decision entirely would leave a structural gap in an otherwise-complete foundation.

## Decision

Access tokens are short-lived (15 min target) JWTs signed with an asymmetric algorithm (RS256 or EdDSA). Refresh tokens are opaque, long-lived, stored httpOnly/Secure/SameSite cookies, persisted hashed server-side, and rotated on every use (old token invalidated, reuse triggers full family revocation).

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

- No `RefreshToken` table exists in `schema.prisma` yet — required before this can be implemented (see `database-standards.md`'s ER diagram note — not yet added, since no code reads it).
- Whoever implements Identity must implement rotation + reuse detection together, not access-token issuance alone — issuing tokens without the revocation-on-reuse mechanic would silently violate this ADR's threat model.
