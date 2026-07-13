# Post-Freeze Backlog

Everything intentionally postponed past this architecture freeze, grouped by when it should happen relative to founder decisions and to each other. This is not a sprint plan — it's a dependency-ordered list of what's left, so nothing gets started before its prerequisite is real.

## Phase 2 — Verification (pure engineering, no founder decision needed, unblocks everything else)

The highest-value phase: almost nothing else can be trusted until this runs for real.

1. **Provision a real Postgres and Redis instance**, run `prisma migrate deploy`, and exercise every one of the six bounded contexts against it — register, login, credit a wallet (directly via the use case, since no HTTP endpoint exists), send a chat message, read usage history. Verify the ledger/message/usage-event idempotency logic under real concurrent writes, not just the in-memory fakes' approximation of it.
2. **Push to `origin/main`** (or open a PR) and observe a real GitHub Actions run — this is the first time the CI workflow, correct and in place since early in this project's history, will have actually executed.
3. **Build both Docker images for real** (`docker build -f apps/api/Dockerfile .` and the `apps/web` equivalent from `Platform/`), fix whatever the first real build surfaces, then run `docker-compose up` against `infra/docker/docker-compose.yml` and hit the running containers over HTTP.
4. **Add integration tests** (Testcontainers or equivalent) for at least the five Prisma repositories, and one true end-to-end test exercising register → login → credit (internal) → chat → usage-history through real HTTP against a real database.

## Phase 3 — Product (blocked on founder decisions in `HANDOVER/12_OPEN_DECISIONS.md`)

Cannot start responsibly until the founder has decided: real pricing/markup, payment strategy, which AI vendor(s), and the frontend strategy.

5. **Build the funding/payment path** — a payment gateway webhook, an admin-only manual-credit endpoint, or both, per the decided payment strategy.
6. **Add a per-call and/or per-account spend cap** to Chat, per the decided risk tolerance — this may require revisiting ADR-0014's debit-after-call model if the tolerance is low enough to require a pre-call cost estimate.
7. **Configure a real AI vendor** in `AiProviderConfig` and make the first real, live-verified call through `OpenAiCompatibleAdapter` — the single biggest remaining "has this code ever actually worked against reality" gap.
8. **Build the frontend** — first decide (per `REVIEW_NOTES.md`'s redesign-candidate note) whether Next.js is still the right choice now that the full API surface is known, then build auth screens, the chat UI, and wallet/usage views. Consider whether a thin client (CLI, direct API access for early adopters) is a faster path to a first real user than a full web UI.
9. **Add campaign/discount pricing and plan tiers**, once the real business model defines what they should be — the `PricingPipeline` is already extensible for this (ADR-0009).

## Phase 4 — Scale (revisit only when real traffic or a real second replica exists)

None of this is needed at zero traffic. Building it now would be premature optimization.

10. **Make `AiProviderConfig` hot-reloadable** — a periodic or triggered refresh in `ProviderRegistryAdapter`, closing the "requires a restart" gap.
11. **Move rate limiting to a Redis-backed store** (`@nestjs/throttler`'s `ThrottlerStorageRedisService` or equivalent) once more than one `apps/api` replica is real — in-process counters are bypassable across replicas.
12. **Add connection pooling** (PgBouncer or Prisma Accelerate) once concurrent replica count justifies it.
13. **Wire the OpenTelemetry SDK** (ADR-0011's strategy, never implemented) — revisit once there's a real observability backend to export to.
14. **Design and build a real RBAC/authorization model** once team/org accounts or admin tooling enter scope — do this deliberately, not retrofitted under pressure.
15. **Tighten CI secret-scanning from warn-only to blocking** once it's run clean for a while (item 2 above must happen first — it's never actually run yet).
16. **Add dependency-vulnerability scanning** (Dependabot/Renovate).

## Future — speculative, no current design, do not start without a real product need

These are not "coming soon" — they are genuinely undesigned, unscoped concepts that would each be a new set of bounded contexts, not an extension of an existing one.

17. **Memory** — long-term conversational memory, summarization, or recall beyond the literal stored message history.
18. **Knowledge (RAG)** — a knowledge base, embeddings, retrieval-augmented generation.
19. **Workflow / Agents** — any multi-step orchestration or autonomous-agent capability beyond a single request/response chat exchange.
20. **Streaming chat responses, provider capability matrix, retry policy, response caching** — all designed in ADR-0007, none built, correctly deferred until a real caller needs them.
21. **Multi-region, horizontal database scaling, an event bus** — not needed at any traffic level this system has approached.

## How to use this backlog

Phase 2 first, always — it's the only phase that doesn't depend on a decision only the founder can make, and it's what turns every "should work" claim in this project into a "does work" fact. After that, don't start Phase 3 items out of order relative to their founder-decision dependency; starting item 6 (spend cap) before the founder has set a risk tolerance means guessing at a number that will need to be redone. Phase 4 and Future are explicitly not urgent — resist the pull to build them early just because they're interesting.
