# 12 — Open Decisions

Every architectural or business decision that still belongs to the Founder, not to whichever engineer or AI picks this codebase up next. None of these have been guessed at or silently decided anywhere in the current implementation — where a placeholder value exists (e.g. a default markup percentage), it is explicitly flagged in code/docs as a default awaiting a real decision, not a considered business choice.

## Business model & monetization

- **Real pricing:** the current markup (1.3x, `PRICING_BASE_MARKUP_BASIS_POINTS`) and floor (0, no minimum) are engineering defaults, not business decisions. What should the actual markup be? Is it uniform across all providers/models, or does it vary?
- **Campaigns/discounts/plan tiers:** none exist. Should they? What shape (percentage discount, flat discount, free-tier allowance)?
- **Payment collection:** how does real money enter the system? A payment gateway (Stripe, etc.)? Crypto? Manual invoicing? This gates Critical Issue 4 in `11_CRITICAL_ISSUES.md`.
- **Per-call or per-account spending caps:** should there be a hard ceiling on what a single chat call or a single account can cost before requiring explicit approval? This gates Critical Issue 7.

## Authentication strategy

- Is email+password sufficient for launch, or is OAuth/social login (Google, GitHub, etc.) required before real users onboard? (Currently not built — no third-party OAuth credentials exist to build against yet.)
- What access-token/refresh-token lifetimes are appropriate for the real threat model and user experience (currently 15 minutes / 30 days, engineering defaults)?
- Should multi-factor authentication exist at launch or be a fast-follow?

## Authorization / roles

- Does the product need any concept of roles beyond "own your account's data" — admin users, team/organization accounts, scoped API keys for third-party integrators (the aggregator-product vision in ADR-0006 implies this eventually)? If so, when — before or after first launch?

## Provider selection

- Which real AI vendor(s) should actually be configured first? No real API key has ever been used against the one real adapter (`OpenAiCompatibleAdapter`) in this project's history.
- Should multiple providers be live simultaneously at launch (exercising the fallback chain for real), or start with one and add fallback providers later?
- What are the real cost rates (`costPerInputTokenMicros`/`costPerOutputTokenMicros`) for each provider/model actually being used? These are currently zero/unset placeholders.

## Hosting & infrastructure

- No cloud provider or hosting decision has been made. This blocks: a real staging/production environment, a connection-pooling strategy (PgBouncer, Prisma Accelerate, or neither), and any CD pipeline design beyond the CI workflow that already exists.
- Kubernetes, a simpler PaaS (Render, Fly.io, Railway, etc.), or something else? The architecture doesn't presuppose an answer, but every subsequent infra decision depends on this one.

## Database strategy

- Managed Postgres (RDS, Cloud SQL, Supabase, Neon, etc.) or self-hosted? This affects backup/restore strategy, which currently does not exist in any form.
- At what point does connection pooling (PgBouncer or equivalent) become necessary, and should it be provisioned proactively or reactively?
- Read replicas / horizontal scaling strategy — not needed at any traffic level this system has ever seen (none), but worth a founder-level "when do we revisit this" marker.

## Monitoring & alerting

- No observability backend has been chosen. The architecture is deliberately vendor-neutral (OpenTelemetry over OTLP) specifically so this decision can be made later without ripping out instrumentation code — but the instrumentation code itself (spans, metrics) has never been written, only the strategy. Which backend (Grafana/Datadog/New Relic/etc.), and when does someone actually wire OTel SDKs into `apps/api`?
- What should page an on-call human, and via what channel? None of this exists yet.

## Deployment & scaling

- No staging environment exists. Should one exist before production, or is a single production environment with careful rollout acceptable at this stage?
- No scaling strategy (horizontal replica count, autoscaling triggers) has been decided — there is no evidence yet of what load the system needs to handle.
- Rollback strategy: ADR-0012 establishes the migration discipline that *enables* safe rollback (expand/contract, no down-migration dependency), but the actual deployment mechanism that would execute a rollback doesn't exist yet (no CD pipeline).

## Frontend strategy

- `apps/web` is currently an empty shell. Is Next.js still the right choice now that the full API surface is known and real, or should this decision be revisited? (ADR-0004 chose it before any real feature existed to build a UI for.)
- Should the first real UI be a full web app, or would a thin client (CLI, or direct API access for early adopters) be sufficient for an initial launch, with a full web UI as a fast-follow?
- Persian-first (matching the separate Content Studio workstream's audience) or multi-locale from the start? Flagged as unresolved since Milestone 1 and still unresolved.

## Chat / product behavior

- Is debit-after-call with only a positive-balance gate (no pre-call reservation) acceptable long-term, or does the product need real pre-call cost estimation eventually (which would require a token-estimation strategy per model — not something to guess at without real usage data)?
- Should a client be able to request a specific provider/model, or should the aggregator always choose via the fallback chain's priority order (the current, only implemented behavior)?
- Should a failed provider call (all providers unavailable) retain the user's already-persisted message, or should it be rolled back too? (Currently: the message is kept, no charge occurs — a deliberate choice, but worth founder awareness.)

## Anything else still unresolved

- `00_System/OPEN_QUESTIONS.md` OQ-008 ("relationship to the AIFA aggregator platform's timeline," referenced by ADR-0001) remains open at the repository-governance level and is outside this Platform codebase's ability to resolve.
