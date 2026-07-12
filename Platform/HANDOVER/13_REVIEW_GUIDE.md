# 13 — Review Guide

For the external architect performing the final review.

## Where to start

1. **`Platform/HANDOVER/`** (this package) — read `14_EXECUTIVE_SUMMARY.md` first for the 3-page version, then work through `01` → `12` in order. This package supersedes the root-level pre-Sprint-1 audit files (`01_FINAL_ARCHITECTURE_AUDIT.md` etc.) — do not use those for current-state claims; they describe an earlier codebase state (see `01_PROJECT_OVERVIEW.md`'s note and `06_TECHNICAL_DEBT.md` item 18).
2. **`Platform/README.md`**, then **`docs/adr/`** in numeric order (0001 → 0015) — the ADRs are the real decision log and, per `05_ARCHITECTURE_DECISIONS.md`, are mostly kept current; where one is stale, `05_ARCHITECTURE_DECISIONS.md` says so explicitly.
3. **`docs/architecture/domain-boundaries.md`** and **`docs/architecture/ddd-tactical-design.md`** — the strategic and tactical shape of every bounded context.
4. **`apps/api/src/application/use-cases/send-chat-message.use-case.ts`** — read this file directly, not just about it. It's the one piece of code that proves (or disproves) whether the architecture actually composes, since it's the only use case touching five different ports/bounded contexts in one request.

## Files that matter most

- `packages/database/prisma/schema.prisma` — the entire data model in one file.
- `eslint.config.mjs` — the machine-enforced architecture boundary; read the comments, they explain a real bug (flat-config rule-merging) that was found and fixed.
- `apps/api/src/main.ts` — everything that's globally wired (or conspicuously not wired — no rate limiting, no shutdown hooks).
- Each `*.module.ts` in `apps/api/src/` — how the six bounded contexts actually get assembled via NestJS DI, including the two places (`ProviderRegistryAdapter`, guard exports) where a concrete class had to be exported alongside its port token for cross-module DI to resolve.
- `docs/adr/0014-chat-orchestration.md` and `docs/adr/0015-usage-tracking.md` — the two most architecturally interesting decisions made during Sprint 1, both explained in full with alternatives considered.

## Known weak areas (don't re-derive these — they're already found and documented)

- The persistence layer has never touched a real database (`06_TECHNICAL_DEBT.md` #1, `11_CRITICAL_ISSUES.md` #1).
- No rate limiting, no security headers, unauthenticated Swagger (`08_SECURITY_REVIEW.md`).
- CI has never actually run on GitHub — 8 commits sitting unpushed (`11_CRITICAL_ISSUES.md` #3).
- Docker has never been built (`11_CRITICAL_ISSUES.md` #5).
- `apps/web` is an empty shell — there is no frontend to review (`03_IMPLEMENTATION_STATUS.md`).
- `AiProviderConfig` requires a restart to take effect, contradicting its own documentation (`06_TECHNICAL_DEBT.md` #8).
- The root-level pre-Sprint-1 audit files are stale and could mislead a reviewer who reads them before this package (`06_TECHNICAL_DEBT.md` #18).

## Questions the reviewer should answer

### Architecture concerns
- Is the debit-after-call (no pre-call reservation) design in `SendChatMessageUseCase` (ADR-0014) the right long-term call, or does it need a pre-call cost-estimation strategy before real users are onboarded?
- Is exporting a concrete infrastructure class from a module (e.g. `ProviderRegistryAdapter` from `HealthModule`) for cross-module DI an acceptable pattern going forward, or should a narrower port be introduced instead each time this need arises?
- Should `@aifa/database` import access be machine-enforced (ESLint), not just documented, matching the rigor already applied to the domain/application/infrastructure/interfaces boundary and the vendor-SDK restriction?

### Business concerns
- Every item in `12_OPEN_DECISIONS.md` — pricing, payment collection, provider selection, hosting, and the frontend strategy all require a founder decision this codebase cannot make on its own.
- Is a single-tier authorization model (own-your-data only, no roles) acceptable for the actual go-to-market plan, or does the real business model require team/org accounts or admin tooling sooner than the current architecture assumes?

### Future concerns
- At what real traffic level does the current single-Postgres, no-pooling, no-queue design need to change? No load has ever been measured, so this is currently a judgment call, not a data-driven one.
- When should Memory/Knowledge/Workflow/Agents (currently entirely unbuilt — see `03_IMPLEMENTATION_STATUS.md`) enter the roadmap, and does the current Conversation/Message model need to change shape to support them, or can they be added additively?
- Is Next.js still the right frontend choice now that the full API contract is known, or should that decision be revisited before real frontend work begins (see `12_OPEN_DECISIONS.md`)?

## How to verify this package's claims yourself

Every specific claim in this package (file counts, commit counts, test counts, "never pushed," "no Docker daemon," etc.) was derived from an actual command run against this repository, not asserted from memory. If you want to re-verify:

```bash
# from Platform/
pnpm turbo run lint typecheck test build --force   # should show 27/27 tasks green

# from the repo root
git rev-list --left-right --count origin/main...main   # should show "0  8" (nothing pushed)
git ls-files Platform/ | wc -l                           # should show 244
```
