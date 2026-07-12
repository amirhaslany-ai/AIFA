# ADR-0011: OpenTelemetry + structured JSON logging as the observability stack

**Status:** Accepted (strategy designed; SDK wiring not yet implemented)
**Date:** 2026-07-12
**Related:** `docs/architecture/logging-strategy.md`, `docs/architecture/monitoring-observability.md`

## Context

`logging-strategy.md` and `monitoring-observability.md` were written in Phase 1 but the tooling choice (OpenTelemetry) was stated without a dedicated ADR — Phase 2's ADR-completeness pass surfaced this gap.

## Decision

Structured JSON logging (pino, `@aifa/logger`) for logs; OpenTelemetry (vendor-neutral, CNCF-graduated) for metrics and traces, exported via OTLP to whatever backend a future deployment provides. No logging/observability SaaS vendor is chosen or hardcoded into the instrumentation layer.

## Rationale

- Vendor-neutrality matters here for the same reason it matters for AI providers (ADR-0005): the platform has not chosen a hosting/cloud provider yet, and coupling observability code to a specific vendor's SDK (e.g. Datadog's or New Relic's proprietary agent) would need to be re-done once that choice is made. OTLP is a wire protocol every major observability backend accepts.
- Structured (JSON) logs over plain-text are a prerequisite for any log aggregation tool to be useful later — retrofitting structure onto plain-text logs after the fact means rewriting every call site; starting structured costs nothing extra now.

## Alternatives considered

- **A specific vendor SDK now** (e.g. Datadog, Sentry): would give richer out-of-box dashboards sooner, but locks instrumentation code to that vendor before a hosting decision exists. Rejected for the same reason ADR-0005 rejected hardcoding an AI provider.
- **No structured logging, defer entirely:** rejected — logs are needed from the first `apps/api` request onward (already true today, e.g. `main.ts`'s startup log), so there's no "later" point where this becomes free to retrofit.

## Consequences

- Every new log call must go through `@aifa/logger`, never `console.log` — already true in the existing codebase (`main.ts`, `domain-error.filter.ts`), this ADR just makes the rule explicit and citable.
- OTel SDK instrumentation itself (spans, metrics) is not yet wired into `apps/api` — `monitoring-observability.md`'s "Follow-up work" section already flagged this; this ADR doesn't change that status, only formalizes the tooling choice it's deferred against.
