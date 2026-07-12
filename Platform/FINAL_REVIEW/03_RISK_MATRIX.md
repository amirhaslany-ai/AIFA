# 03 — Risk Matrix

Likelihood × Impact are this reviewer's judgment, stated so they can be argued with. "Likelihood" is the chance the risk materializes if the system is taken toward production **without** first addressing the linked blocker. Ratings: Low / Medium / High / Critical.

## Technical risks

| Risk | Likelihood | Impact | Rating | Linked blocker |
|---|---|---|---|---|
| Persistence behaves differently against real Postgres than against in-memory fakes (transactions, isolation, constraint timing). | High | High | **Critical** | P0-1 |
| The one real AI adapter breaks against a real vendor's actual response/error/timeout shapes. | Medium | High | **High** | (D2 / `01`) |
| `exactOptionalPropertyTypes`/strict-mode edge cases surface only at runtime with real data. | Low | Medium | Medium | — |
| Half-open circuit breaker hammers a flapping provider with a concurrent burst. | Medium | Low | Low | P3-5 |

## Business risks

| Risk | Likelihood | Impact | Rating |
|---|---|---|---|
| No revenue path: no user can fund a wallet in the running system, so the product cannot transact. | High (today) | High | **Critical** (P0-2) |
| Pricing markup/floor are engineering defaults (1.3x / 0), not business decisions — real margins undefined. | High | Medium | **High** (`HANDOVER/12`) |
| An account goes deeply negative from one large chat call (no spend cap). | Medium | High | **High** (P0-3/P1-3) |
| Product is unusable without a UI; only API-literate users could touch it today. | High | Medium | **High** (frontend 5%) |

## Security risks

| Risk | Likelihood | Impact | Rating |
|---|---|---|---|
| Credential brute-force on unthrottled `/v1/auth/login`. | High | High | **Critical** (P0-3) |
| Cost/abuse flooding of unthrottled `/v1/chat` once a real key exists. | High | High | **Critical** (P0-3) |
| Unauthenticated Swagger exposes full API surface in prod. | Medium | Medium | **High** (P1-4) |
| Missing security headers (clickjacking, MIME-sniff, no HSTS). | Medium | Medium | Medium (P1-5) |
| Secret accidentally committed with no scanning to catch it. | Low | High | Medium (P2-6) |
| No authorization model beyond resource-ownership — no defense if admin/multi-tenant features are added without redesign. | Medium (on feature growth) | High | **High** |
| Positive: no raw SQL anywhere (Prisma parameterized only); passwords argon2id; refresh tokens hashed + rotated with reuse detection. | — | — | These materially *reduce* the baseline surface. |

## Operational risks

| Risk | Likelihood | Impact | Rating |
|---|---|---|---|
| Operator can't disable a bad/over-budget provider without a full restart. | Medium | Medium | **High** (P2-2) |
| Forgotten JWT keys → silent recurring mass logout. | Medium | High | **High** (P0-4) |
| No request-level logging on the success path → hard to debug a live incident. | Medium | Medium | Medium (P2-4) |
| No metrics/tracing/alerting — problems are invisible until a user reports them. | High | Medium | **High** (`03` monitoring) |
| Prisma connections not drained on shutdown → messy rolling deploys. | Medium | Low | Low (P2-3) |

## Scalability risks

| Risk | Likelihood | Impact | Rating |
|---|---|---|---|
| Uncached readiness DB/Redis probe amplifies load linearly with replicas × probe frequency. | Medium | Medium | Medium (P2-1) |
| Single Postgres, no pooling, no replica — binding constraint at write volume (append-only ledger/message/usage tables grow unbounded). | Medium (on growth) | High | **High** (P2-7) |
| Synchronous critical path (2 DB writes + provider call + debit + usage write per chat) — latency is the sum of all round-trips, unmeasured. | Medium | Medium | Medium |
| Zero load-bearing evidence at any scale — no load test ever run. | — | — | Unknown by construction; treat all scale claims as unproven. |

## Vendor lock-in risks

| Risk | Rating | Note |
|---|---|---|
| AI vendor lock-in. | **Low** | Deliberately mitigated: no vendor SDK dependency; `OpenAiCompatibleAdapter` speaks a portable HTTP contract; provider selection is data-driven via `AiProviderConfig`. This is a genuine architectural strength. |
| Cloud/hosting lock-in. | **Low (today)** | No hosting chosen yet, so nothing is coupled — but this is "unlocked because undecided," not a designed-in portability guarantee. |
| Observability vendor lock-in. | **Low** | OTLP/OpenTelemetry chosen precisely for neutrality — though the instrumentation is unbuilt (`01` A3). |
| ORM/database lock-in. | **Medium** | Prisma + Postgres are pervasive across all persistence; migrating off either would be a real effort. Normal and acceptable for this stage. |

## Single points of failure

| SPOF | Rating | Note |
|---|---|---|
| Single Postgres instance. | **High** | Every bounded context persists here; no replica/failover designed. |
| Single `apps/api` process model (Prisma singleton assumes long-running single process). | **Medium** | Horizontal replicas are possible (stateless API) but connection pooling for them is undesigned. |
| `JwtKeyProvider` ephemeral-key default. | **Medium** | A single misconfiguration invalidates all auth for the whole fleet at once. |
| Redis. | **Low (today)** | Only the health check depends on it; its failure degrades readiness reporting, not core function — but this grows the moment Redis gains a real consumer. |

## Database risks

- **Never run against real Postgres** (P0-1) — the top database risk, subsuming most others below until closed.
- No backup/restore strategy exists or is decided.
- No connection pooling for multi-replica deployment.
- Append-only tables (`ledger_entries`, `messages`, `usage_events`) grow without bound and have no retention/archival policy.
- Expand/contract migration discipline (ADR-0012) is sound but **never exercised** — all 5 migrations to date are purely additive, so the rollback-safety property is untested.

## Deployment risks

- No staging/production environment, no CD pipeline, no orchestrator decision (all founder-gated, `HANDOVER/12`).
- Docker images never built (P1-2).
- Rollback mechanism is a documented policy (ADR-0012) with no executing pipeline behind it.

## Monitoring risks

- No metrics, no tracing, no alerting (`01` A3). A production incident would be invisible until user-reported.
- Success-path requests are not logged with their correlation id (P2-4), so even post-hoc log forensics is half-blind.
- Health/readiness endpoints are real and correct — the one monitoring primitive that genuinely works — but nothing consumes them yet (no uptime monitor configured).

## Recovery risks

- No disaster-recovery plan, no tested backup, no restore drill — because no database has ever held real data.
- Refresh-token reuse detection gives a real account-compromise recovery primitive (family revocation) — a genuine positive on the identity side.
- No incident runbook, no on-call, no rollback rehearsal exists — expected at this stage, listed so it is not assumed to exist.

## The one-paragraph risk verdict

The **critical-rated risks cluster in three places**: unverified persistence (P0-1), no monetization/spend-control path (P0-2, P0-3), and an unthrottled auth/chat attack surface (P0-3). None of these are architectural defects — they are the predictable consequence of a foundation that has never touched a real database, a real payment, or real traffic. Vendor lock-in and code-level technical risk are genuinely **low**, which is the architecture's strongest showing in this matrix.
