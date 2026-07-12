# Monitoring & Observability Strategy

**Status:** Design only this milestone — no monitoring stack is deployed. This document exists so implementation has an agreed target instead of being invented ad hoc later.

## Three pillars

- **Logs:** see `logging-strategy.md`.
- **Metrics:** OpenTelemetry Metrics API, instrumented in `apps/api` (request duration/count per route, AI provider call count/latency/error-rate per provider, circuit-breaker state transitions). Exported via OTLP to whatever backend the deployment environment provides (Prometheus, a managed APM, etc.) — the instrumentation code doesn't hardcode a specific backend, only an OTLP endpoint read from `packages/config`.
- **Traces:** OpenTelemetry Tracing, one span per inbound HTTP request, child spans for: use-case execution, database queries (Prisma has official OTel instrumentation), and each AI provider adapter call. This makes "why was this request slow" answerable by trace, not by guesswork — particularly important given the fallback chain (ADR-0005) can make one logical request try multiple providers.

## Why OpenTelemetry specifically

Vendor-neutral, official, CNCF-graduated standard — avoids locking the architecture into one observability vendor at foundation stage, consistent with the mission's "no provider may be hardcoded" principle applied to observability tooling, not just AI providers.

## Health checks (implemented this milestone)

`GET /v1/health` and `/v1/health/ready` (see `api-architecture.md`) are the only observability surface that actually exists in code right now. `/v1/health` is a trivial liveness check (no dependency access). `/v1/health/ready` is backed by `@nestjs/terminus`'s `HealthIndicator` (custom `PrismaHealthIndicator`/`RedisHealthIndicator`, `apps/api/src/infrastructure/health/`) and checks DB/Redis/provider-registry reachability; it returns HTTP 503 (not 200) when the database is unreachable, so an orchestrator's readiness probe correctly stops routing traffic. Docker Compose's healthcheck stanzas (`infra/docker/docker-compose.yml`) poll `/v1/health/ready`.

## Alerting

Not designed this milestone — depends on the deployment environment's chosen metrics backend. Flagged as follow-up work once `monitoring-observability.md`'s metrics/traces are actually instrumented and a deployment target is chosen.

## Follow-up work (explicitly deferred)

- Actual OTel SDK wiring in `apps/api` (currently: strategy documented, ports for future instrumentation identified, not yet coded).
- Dashboard definitions, alert thresholds, on-call policy — all depend on real traffic patterns that don't exist yet.
