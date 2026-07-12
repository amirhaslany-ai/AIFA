# 05 — Architecture Freeze Decision

## Decision

## B) APPROVED WITH PATCHES

The architecture is production-ready **as a foundation to build on**, after the listed P0 and P1 patches are applied. **No redesign is required.**

## Why not A (APPROVED / freeze now)

Because two P0 defects mean the foundation's own quality gate does not function, and five P1 defects mean parts of the running code contradict what the documentation says exists:

- **CI does not run** (P0-1) — the workflow is in a directory GitHub Actions never scans. Every "verified by CI" claim is currently false. You cannot freeze an architecture whose verification pipeline has never executed.
- **The lockfile is uncommitted** (P0-2) — reproducible builds and all Docker/CI installs are broken until it is committed.
- **Documentation asserts non-existent seams and false consumption relationships** (P1-1) — an `auth-guard.port.ts` that isn't there, an `AiProviderConfig` "consumed" by code that never reads it. A foundation sold as "build without redesign" cannot ship with docs that misdirect the next team.
- **The flagship resilience layer is orphaned** (P1-2) and **readiness is unsafe for orchestration** (P1-3) — the two guarantees the architecture most loudly makes ("provider failure won't break the app," "readiness means ready") are, respectively, wired into nothing and checking the wrong thing.

Freezing now would ratify these as "correct."

## Why not C (REJECTED)

Because none of the findings require reworking the architecture. Every P0 and P1 is a **location, wiring, or documentation-accuracy** fix on a fundamentally sound structure:

- The hexagonal/DDD/monorepo shape is correct and the one implemented slice proves the pattern.
- The 13-ADR decision chain is internally consistent with no contradictions.
- The wallet-ledger and pricing-pipeline designs are genuinely good separations of concern.
- The total P0+P1 remediation is ~1.5–2 engineer-days, no ADR reversals, no boundary changes.

A rejection would imply the design is wrong. It is not. The *integration and the paperwork's tense* are wrong.

## Conditions of approval

This approval is contingent on, and the architecture may be frozen once:

1. **P0-1 and P0-2 are resolved and a CI run has actually passed** on a PR (not asserted — observed).
2. **P1-1 and P1-3 are resolved** such that no document describes an unimplemented artifact as present, and readiness either checks the datastore or explicitly documents that it does not.
3. **P1-2, P1-4, P1-5 are resolved** so that at least one request path exercises the resilience layer, cross-origin calls are deliberately configured, and the health path does not amplify provider load.
4. The import-boundary ESLint rule (`TECHNICAL_DEBT.md` #2) is added in the same pass as P1-2.

P2/P3 items do **not** gate the freeze; they gate scaling and hardening, and should be scheduled into early development.

## What this approval explicitly does not claim

- It does **not** claim the *system* is production-ready. It is a foundation with one endpoint; the product is unbuilt, by design.
- It does **not** claim any behavior beyond the `HealthModule` slice has been proven — the AI request lifecycle, wallet, pricing, and auth are design-only and their first implementation will be the real test of these designs.
- It does **not** waive the security and scalability work catalogued as design-only; those are the next team's mandate, not evidence of current readiness.

## One-line verdict

**Sound architecture, unfinished wiring, over-claiming docs — approve with a two-day patch list, then freeze.**
