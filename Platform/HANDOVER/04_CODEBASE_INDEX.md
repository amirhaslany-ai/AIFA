# 04 — Codebase Index

## Repository root (`Platform/`)

```
Platform/
├── apps/api/                NestJS backend — see below
├── apps/web/                 Next.js frontend — placeholder, see below
├── packages/{types,config,logger,ai-provider-sdk,database}/
├── docs/adr/                 15 ADRs
├── docs/architecture/        ~24 standing architecture docs
├── infra/docker/              docker-compose.yml (local dev only)
├── HANDOVER/                  This package
├── 01_FINAL_ARCHITECTURE_AUDIT.md … 05_ARCHITECTURE_FREEZE_DECISION.md   STALE, pre-Sprint-1
├── ARCHITECTURE_REVIEW.md, TECHNICAL_DEBT.md, IMPROVEMENT_PLAN.md, PROGRESS_REPORT.md  STALE, pre-Sprint-1
├── README.md, CONTRIBUTING.md
├── eslint.config.mjs         Root ESLint flat config — hexagonal import-boundary rules
├── turbo.json                 Task graph (lint/typecheck/test/build/dev)
├── tsconfig.base.json          Shared strict TS config every package/app extends
├── pnpm-workspace.yaml, package.json, pnpm-lock.yaml
└── .env.example
```

## `apps/api/src/` — full tree with purpose

```
domain/
├── account.entity.ts / .spec.ts          Identity aggregate root
├── email.ts / .spec.ts                    Value object — validates/normalizes email
├── money.ts / .spec.ts                    Value object — integer minor-units + currency
├── wallet.entity.ts / .spec.ts             Billing aggregate root — credit/reserve/settle/rollback/debit
├── ledger-entry.ts                         LedgerEntryDraft type + increasesBalance() helper
├── conversation.entity.ts / .spec.ts       Conversation aggregate root
├── message.ts / .spec.ts                   Message entity (owned by Conversation)
├── usage-event.ts / .spec.ts               Standalone append-only usage fact record
├── pricing/
│   ├── pricing-rule.ts                     PricingRule interface
│   ├── base-markup-rule.ts / .spec.ts       cost * markup multiplier
│   ├── floor-rule.ts / .spec.ts             enforce a minimum price
│   └── pricing-pipeline.ts / .spec.ts       runs an ordered PricingRule[]
└── errors/
    ├── domain-error.ts                       abstract base (all domain errors extend this)
    ├── account-already-exists.error.ts
    ├── invalid-credentials.error.ts
    ├── invalid-refresh-token.error.ts
    ├── insufficient-balance.error.ts
    ├── wallet-not-found.error.ts
    ├── conversation-not-found.error.ts
    └── duplicate-message.error.ts

application/
├── identity.constants.ts                   REFRESH_TOKEN_TTL_MS, AuthSession interface
├── require-wallet.ts                        shared "load wallet or throw" helper
├── ports/  (13 files — one interface per external dependency)
│   ├── account-repository.port.ts, refresh-token-repository.port.ts
│   ├── password-hasher.port.ts, token-issuer.port.ts, auth-guard.port.ts
│   ├── clock.port.ts
│   ├── wallet-repository.port.ts
│   ├── pricing-engine.port.ts
│   ├── conversation-repository.port.ts, chat-completion.port.ts
│   ├── provider-cost-source.port.ts, provider-health-source.port.ts
│   ├── dependency-health-source.port.ts
│   └── usage-event-repository.port.ts
├── services/session-issuer.service.ts       shared register/login/refresh session logic
└── use-cases/ (13 use cases + 12 spec files + 1 integration-style spec)
    ├── register-account, login, refresh-session, logout   (Identity)
    ├── credit-wallet, reserve-funds, settle-reservation, rollback-reservation, get-wallet-balance   (Wallet)
    ├── wallet-lifecycle.spec.ts                            integration-style, in-memory-fake-backed
    ├── get-system-health                                   (Platform/System)
    ├── send-chat-message, get-conversation                 (Conversation) — send-chat-message is the
    │                                                         one use case composing 5 other contexts
    └── list-usage-events                                   (Usage Tracking)

infrastructure/
├── identity/  argon2-password-hasher.adapter.ts, jwt-token-issuer.adapter.ts,
│              jwt-auth-guard.adapter.ts, jwt-key-provider.ts
├── persistence/  prisma-account.repository.ts, prisma-refresh-token.repository.ts,
│                 prisma-wallet.repository.ts, prisma-conversation.repository.ts,
│                 prisma-usage-event.repository.ts
├── providers/  provider-registry.adapter.ts (registry + circuit-breaker + fallback-chain bootstrap),
│               openai-compatible.adapter.ts / .spec.ts (the one real vendor HTTP adapter),
│               fallback-chat-completion.adapter.ts (wraps the fallback chain behind ChatCompletionPort)
├── pricing/  rule-based-pricing-engine.adapter.ts / .spec.ts
├── health/  prisma.health-indicator.ts, redis.health-indicator.ts, dependency-health.adapter.ts
└── clock/  system-clock.adapter.ts

interfaces/http/
├── controllers/  auth, wallet, health, chat, usage.controller.ts
├── dto/  auth, wallet, chat, usage, health-response, error-response.dto.ts
├── guards/jwt-auth.guard.ts
├── decorators/current-account.decorator.ts
├── filters/domain-error.filter.ts            the single global exception → HTTP mapping
└── middleware/request-id.middleware.ts

test-support/ (test-only, not shipped)
├── in-memory-account.repository.ts, in-memory-refresh-token.repository.ts
├── in-memory-wallet.repository.ts, in-memory-conversation.repository.ts, in-memory-usage-event.repository.ts
└── create-test-token-issuer.ts               real-crypto test helper (not a mock — a real JWT issuer for tests)

health.module.ts       Platform/System — HealthController, ProviderRegistryAdapter (dual-bound to
                        PROVIDER_HEALTH_SOURCE_PORT and PROVIDER_COST_SOURCE_PORT via useExisting)
identity.module.ts     Identity — AuthController, real crypto adapters
wallet.module.ts       Billing/Wallet — WalletController (GET-only), exports ports for Chat's reuse
pricing.module.ts      Billing/Pricing — no controller, invoked only by Chat
chat.module.ts         Conversation — ChatController, imports Identity+Wallet+Pricing+Health+Usage
usage.module.ts        Usage Tracking — UsageController, exports its port for Chat to write to
app.module.ts           Root module — imports all six feature modules + RequestIdMiddleware
main.ts                 Bootstrap: dotenv load, ValidationPipe, CORS, Swagger, DomainErrorFilter
vitest.config.ts        Sets safe env-var defaults so unit tests don't depend on a real .env
```

## `apps/web/src/` — full tree (this is the entire frontend)

```
app/
├── layout.tsx                     Root layout
├── globals.css                     Tailwind base styles
├── (marketing)/page.tsx            Static placeholder landing page ("no product content yet")
├── (app)/layout.tsx                 Layout for the (unbuilt) authenticated app shell
├── (app)/dashboard/page.tsx          Static placeholder ("Product surface placeholder")
└── api/health/route.ts              Server route proxying apps/api's /v1/health/ready
```

That is the complete frontend. There is no login page, no chat interface, no wallet/usage view, and no client-side code that calls any authenticated backend endpoint.

## `packages/*/src/` — every shared library

```
packages/types/src/
├── ai-provider.ts    ChatRole, ChatMessage, ChatRequest, ChatResult, ProviderStatus, ProviderHealth
├── health.ts          DependencyHealth, SystemHealth
└── index.ts            barrel export

packages/config/src/
├── schema.ts           zod schema: nodeEnv, api, web, auth, pricing, database, redis, observability
├── load-config.ts       loadConfig(env) — parses process.env, throws with every violation listed
├── load-config.spec.ts   6 tests
└── index.ts

packages/logger/src/
├── create-logger.ts     createLogger({ service, logLevel }) — pino wrapper
├── create-logger.spec.ts 3 tests
└── index.ts

packages/ai-provider-sdk/src/
├── ai-provider.ts        AiProvider interface (id, chat(), healthCheck())
├── provider-registry.ts   ProviderRegistry — register/get/has/list
├── circuit-breaker.ts / .spec.ts    per-provider failure-threshold + cooldown wrapper
├── fallback-chain.ts / .spec.ts      tries providers in priority order
├── cost.ts / .spec.ts                 calculateCostMinorUnits(usage, rates) — pure function
├── errors.ts             ProviderUnavailableError, AllProvidersUnavailableError, CircuitOpenError
├── adapters/stub.adapter.ts   deterministic no-network placeholder adapter
└── index.ts

packages/database/
├── prisma/schema.prisma        the single source of truth for the DB schema
├── prisma/migrations/           5 migrations (init, wallet+ledger, provider-config-fields,
│                                 chat-conversations, usage-events) — never applied to a live DB
└── src/index.ts                 prisma singleton, re-exported types, isUniqueConstraintViolation()
```

## `docs/` — governance and design documents

- `docs/adr/0001` through `0015` — see `05_ARCHITECTURE_DECISIONS.md` for the full list with status.
- `docs/architecture/` — ~24 files covering every layer (backend, frontend, database, API, domain boundaries, package boundaries, coding standards, naming, testing, logging, monitoring, secrets/config management, CI/CD, security, wallet, pricing, AI provider layer, DDD tactical design). These were kept in sync with implementation reality throughout Sprint 1 (each feature's commit updated the relevant docs) and are **the trustworthy documentation set** — unlike the root-level pre-Sprint-1 audit files.

## Stray artifacts

- `Platform/webtest` — an empty, untracked directory. Not part of git history. Harmless.
