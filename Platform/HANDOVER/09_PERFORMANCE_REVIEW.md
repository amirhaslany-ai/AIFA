# 09 — Performance Review

No load testing has ever been performed against this system — it has never run against real traffic of any volume. Everything below is static analysis of the code as written, not measured behavior.

## Current bottlenecks (real, in code today)

1. **`DependencyHealthAdapter.checkAll()` performs a live, uncached database query and a live Redis ping on every single `/v1/health/ready` request.** With an orchestrator (Kubernetes, ECS, etc.) probing readiness every few seconds across N replicas, this is N replicas × (1 query + 1 ping) every few seconds, purely for health-checking, forever. The sibling provider-health check already solved this exact problem with a 5-second cache — the dependency-health check was added later and didn't inherit that pattern. This is the single clearest, most concrete current performance issue in the codebase.
2. **`ProviderRegistryAdapter.onModuleInit()` makes a live database query during application boot**, with a try/catch fallback to bootstrap defaults if it fails. This is a one-time cost per process start, not a per-request cost, so it's low-severity — but it does mean a slow or unreachable database at boot adds real latency (or, if it times out, silently degrades to stub providers) to every cold start/restart.
3. **`SendChatMessageUseCase` makes its collaborator calls sequentially** (load wallet → load/create conversation → check duplicate → persist user message → call provider → persist assistant message → look up cost rates → calculate price → debit wallet → record usage event). This is architecturally correct (each step causally depends on the previous one — there's no missed parallelization opportunity here), but it does mean the total latency of one chat request is the sum of every one of those round-trips, including two full database writes (user message, assistant message) that happen in the same request before the provider is even called. Whether this matters depends entirely on real database latency, which has never been measured (see `06_TECHNICAL_DEBT.md` item 1).

## Future bottlenecks (not yet real, but predictable from the current design)

- **No connection pooling.** The Prisma singleton (`packages/database/src/index.ts`) assumes one long-running process holds one connection pool for its lifetime — correct for the current deployment model (a single long-running `apps/api` process), but nothing (PgBouncer, Prisma Accelerate, etc.) exists yet for when multiple replicas of `apps/api` need to share a connection budget against one Postgres instance.
- **A single Postgres instance with no read-replica or sharding strategy.** Fine at low-to-moderate traffic; would become the binding constraint well before any other part of this architecture at high write volume (the ledger and message tables are both append-only and grow unboundedly with usage).
- **No async worker/queue for anything.** Wallet settlement, usage-event recording, and message persistence are all synchronous, on the request's critical path. This is currently correct (nothing here is expensive enough yet to justify a queue), but if a future feature adds a genuinely slow post-processing step (e.g. embedding a message for future "Memory" functionality — currently NOT IMPLEMENTED, see `03_IMPLEMENTATION_STATUS.md`), it should not simply be bolted onto this same synchronous request path without reconsidering this.
- **Redis is provisioned but has exactly one real consumer** (the readiness health check) — no caching, no session store, no rate-limit counter, no pub/sub uses it yet. This isn't a performance problem today; it's infrastructure-ahead-of-usage, worth knowing so nobody assumes Redis is doing more work than it actually is.

## Scalability

Reusing the honest framing from the pre-Sprint-1 audit (still methodologically valid, even though the underlying feature set has grown since it was written): the architecture's *shape* (stateless API process, config-driven provider selection at boot, ledger-based accounting, cache-ready Redis provisioning) is scale-compatible. But **zero load-bearing evidence exists at any traffic tier** — nothing in this system has ever served a real concurrent request from more than one client at a time in a real environment. Claims about "handles 10,000 users" or similar would be pure extrapolation, not measurement, and this document deliberately does not make them.

## Caching

- **Provider health**: cached, 5-second TTL (`ProviderRegistryAdapter`). Good.
- **Dependency (DB/Redis) health**: not cached at all (see Bottleneck #1 above). Inconsistent with the sibling implementation.
- **Circuit breaker state**: functions as an implicit health cache for a known-bad provider (per ADR-0005's original design intent) — this part works as designed.
- **No response caching** exists anywhere (e.g., no identical-`ChatRequest` cache) — explicitly design-only per ADR-0007, never built, not expected to be at this stage.
- **`AiProviderConfig` is effectively cached for the lifetime of the process** (read once at boot, never refreshed) — this is presented as a limitation elsewhere in this package (`06_TECHNICAL_DEBT.md` item 8), but from a pure performance standpoint it does mean provider selection has zero per-request database cost, which is a genuine (if accidental) positive alongside the operational downside.

## Database

- Real indexes exist where query patterns are known: `AiProviderConfig.providerId` (unique), `RefreshToken.accountId`/`familyId`, `LedgerEntry.walletId` + the `(walletId, referenceId, type)` unique constraint, `Conversation.accountId`, `Message.conversationId`, `UsageEvent.(accountId, createdAt)` composite index (supporting the usage-history list query's exact access pattern) plus a unique index on `userMessageId`.
- `Message.sequence` (a separate autoincrement column, distinct from the `id` primary key) exists specifically to guarantee deterministic ordering even when `createdAt` timestamps collide at millisecond resolution — a real, considered design choice, not an oversight.
- No query has ever been measured with `EXPLAIN ANALYZE` or any real query plan — because no live database has ever been available to run one against.

## API

- Global `ValidationPipe` runs on every request (a small, real, unmeasured CPU cost per request — `class-validator`'s reflection-based validation is not free, but is standard practice and not a known bottleneck at any traffic level this system has approached).
- No response compression (`compression` middleware) is configured.
- No pagination exists on `GET /v1/chat/conversations/:id` (a conversation with a very large message history would return its entire history in one response) — `GET /v1/usage` does have simple `limit`/`before` pagination, but the conversation-read endpoint does not.

## Frontend

Not applicable in any meaningful sense — `apps/web` has three static pages and one server-side proxy route. There is no client-side data-fetching, no bundle-size concern beyond Next.js's own default output, and no rendering-performance question to evaluate, because there is no product UI to evaluate (see `03_IMPLEMENTATION_STATUS.md`).

## AI Providers

- `OpenAiCompatibleAdapter` enforces a hard per-call timeout (`AbortController`, default 30s) — a real, deliberate choice preventing a slow/hung vendor call from blocking a request indefinitely.
- No retry policy exists (ADR-0007, design-only) — a single transient failure (e.g. one 503 from a vendor) is currently indistinguishable from a hard failure and immediately counts against the circuit breaker's failure threshold, rather than being retried once before counting.
- No streaming exists — every chat response is a single, complete, non-streamed HTTP response, meaning the client waits for the entire model completion before seeing anything, with no time-to-first-token improvement possible in the current design.
- This entire section has never been exercised against a real vendor endpoint — no real API key has ever been configured in any environment this codebase has run in, so real-world latency/throughput/failure-rate characteristics of the one real adapter are completely unmeasured.
