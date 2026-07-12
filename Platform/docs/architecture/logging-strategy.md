# Logging Strategy

## Format

Structured JSON logs (one log line = one JSON object), via `@aifa/logger` (pino under the hood — chosen for its low overhead and first-class structured-logging support, official docs at getpino.io).

## Required fields (every log line)

- `timestamp` (ISO 8601)
- `level` (`trace`/`debug`/`info`/`warn`/`error`/`fatal`)
- `message`
- `requestId` — propagated from the `X-Request-Id` HTTP header (generated if absent), present on every log emitted during that request's lifecycle, and included in the API error shape (`api-architecture.md`) so a support conversation can go from "here's the error I got" straight to the exact log lines.
- `service` — e.g. `api`, `web`.
- `context` — the emitting module/class name (Nest's logger context convention).

## Levels — when to use which

- `error`/`fatal`: something failed that a human should look at (unhandled exception, all AI providers unavailable, DB connection lost). Always includes `err` (serialized error/stack).
- `warn`: degraded-but-recovered (one provider's circuit breaker tripped but fallback succeeded).
- `info`: significant lifecycle events (server started, provider registry initialized) — not per-request noise.
- `debug`: per-request detail, enabled via `LOG_LEVEL=debug` locally, not in production by default.

## What must never be logged

Secrets (API keys, tokens), full request bodies containing user content by default (log a size/hash, not the content, unless `LOG_LEVEL=debug` in a non-production environment), and raw vendor AI provider error payloads that might embed the caller's API key in a URL or header echo — providers adapters must sanitize before throwing.

## Where logs go (this milestone vs. later)

This milestone: stdout only (JSON lines), consumed by `docker compose logs` locally. Centralized log aggregation (e.g. an ELK/Loki stack, or a managed provider) is a deployment-environment decision deferred to `monitoring-observability.md`'s follow-up section — the structured JSON format is chosen specifically so adopting one later requires no logging-call changes, only a shipper/sidecar.
