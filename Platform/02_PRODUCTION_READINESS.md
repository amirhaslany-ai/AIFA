# 02 — Production Readiness

## The distinction the brief blurs, made explicit

"Production readiness" can mean two different things, and conflating them produces a nonsense answer:

1. **Is the *system* ready to serve production traffic?** — No, and not close. There is one health endpoint and a placeholder web page. No auth, no billing, no real AI providers, no product. This was *never the goal* of the foundation mission (explicitly out of scope), so scoring it "not production ready" is technically true but useless.

2. **Is the *architecture* ready to be built on — can a competent team implement the product on this foundation without redesigning it?** — This is the real question, and the answer is **yes, after the P0 and P1 patches**. The structure, boundaries, and decisions are sound; the defects are wiring, location, and documentation-accuracy problems, not design flaws.

Everything below answers question (2).

## Readiness gates

| Gate | State | Blocking? |
|---|---|---|
| Reproducible build | Green on working tree; **lockfile uncommitted (P0-2)** | Yes — until committed |
| CI actually executes | **No — workflow mislocated (P0-1)** | Yes |
| Docs match code | **No — auth-guard port, AiProviderConfig consumption, terminus readiness all falsely described (P1-1, P1-3)** | Yes — misleads implementers |
| Flagship resilience wired | **No — circuit breaker/fallback orphaned (P1-2)** | Yes — must be wired + labeled honestly before it's trusted |
| Cross-origin story works | **No — CORS absent (P1-4)** | Yes — breaks first real client call |
| Health probe is orchestration-safe | **No — ignores DB/Redis (P1-3)** | Yes |
| Hexagonal boundaries enforced | Documented, **not machine-enforced** (pre-existing `TECHNICAL_DEBT.md` #2) | No — but do before 2nd context |
| Input validation | Unwired (P2-1) | No |
| Observability wired | Logger not in DI; no tracing/metrics (P2-5) | No — design is sound |
| Test depth | Unit only; zero integration despite CI provisioning for it (P2-6) | No |
| Security controls | All design-only | No — expected at this stage |

## What "ready after patches" concretely requires

The P0s and P1s in `04_PATCH_LIST.md` are the gate. None require touching the architecture's shape:
- P0-1/P0-2 are a file move and a `git add`.
- P1-1/P1-3 are documentation corrections plus (for readiness) wiring `@nestjs/terminus` — a dependency already installed — to actually check Postgres/Redis.
- P1-2 is instantiating classes that already exist and pass tests, in the one bootstrap file that currently hardcodes stubs.
- P1-4 is `app.enableCors()` with a configured allowlist.
- P1-5 is caching health state (the circuit-breaker state already computes it).

Estimated effort for the full P0+P1 set: **1–2 engineer-days.** No redesign, no ADR reversals.

## What is legitimately deferred and should NOT block

Auth implementation, wallet/pricing/provider implementation, rate limiting, security headers, staging/production infra, OpenTelemetry wiring, integration tests — all design-only by explicit scope. These are the *next* team's implementation work, and the design docs (once P1-1/P1-3 are corrected to stop over-claiming) are a genuine head start. Holding "foundation approval" hostage to these would be wrong; they are exactly what the foundation exists to enable, not precede.

## Bottom line

The system is not production-ready and was never meant to be at this milestone. The *architecture* is ready to be built on **after the 2 P0 and 5 P1 patches** — which are integration and accuracy fixes measured in days, not a redesign. See `05_ARCHITECTURE_FREEZE_DECISION.md`.
