# 03 — Architecture Scorecard

Scores are 0–100, justified by the verified findings in `01_FINAL_ARCHITECTURE_AUDIT.md`. A high design score can coexist with a low implementation score; where the two diverge, the score reflects the *lower* of "is it designed well" and "does the running code match the design," because a foundation is judged by whether it can be trusted, not whether it reads well.

| Dimension | Score | Justification |
|---|---:|---|
| **Architecture** | 80 | Structure, hexagonal layering, and package boundaries are sound and the one implemented slice is faithful. Docked for the flagship resilience layer being orphaned (P1-2) and the only registry bootstrap hardcoding providers — the design's own headline principle is contradicted by its sole implementation. |
| **DDD** | 76 | Strong strategic (`domain-boundaries.md`) and tactical (`ddd-tactical-design.md`) docs, coherent context mapping, correct decision not to force an aggregate onto `HealthModule`. Docked because ~95% of it is aspirational (one context implemented), and the `User` vs `Account` naming contradiction between schema and DDD docs is unresolved. |
| **Security** | 52 | Good design artifacts (JWT strategy, threat model, secrets hygiene is genuinely correct). But zero implemented controls, no CORS boundary, no input validation despite deps present, unauthenticated provider-inventory disclosure on readiness, unauthenticated Swagger. Design-only ≠ secure. |
| **Scalability** | 58 | Scale-compatible shape (stateless API, config-driven providers, ledger money model). Docked hard for two real in-code scale defects (health-path provider amplification P1-5, unmanaged Prisma connections P2-3) and zero load-bearing evidence at any tier above trivial. |
| **Maintainability** | 78 | Excellent ADR discipline, conventions, and doc breadth. Docked because doc↔code contradictions (P1-1, P1-3) actively mislead a maintainer — the most expensive kind of maintainability debt. |
| **Documentation** | 70 | Voluminous, mostly high quality, honest about design-only sections. Docked substantially because three specific claims are false (nonexistent auth-guard port, fictional `AiProviderConfig` consumption, terminus/DB readiness). A doc that lies is worse than a doc that's missing. |
| **Developer Experience** | 66 | Clean local flow once running; `turbo dev` correctly builds deps first (a real earlier fix). Docked for: CI that doesn't run, uncommitted lockfile, and the first-clone experience depending on undocumented gotchas (Prisma `postinstall` needing the schema, etc.). |
| **Repository Quality** | 64 | Clean, well-organized tree with real READMEs. Docked because nothing is committed, CI is mislocated, the lockfile is untracked, and `.github/` templates are in a location GitHub ignores. |
| **Production Readiness** | 42 | As a foundation-to-build-on: acceptable after patches. As anything resembling a production system: not close, by design. The blended score reflects that the *gates* (CI, reproducible build, doc accuracy, orchestration-safe health) are currently failing. |
| **OVERALL** | **64** | Sound architecture undermined by an unenforced quality pipeline and documentation that over-claims implementation state. Fixable in days, not a redesign. |

## How to read a 64

This is not a bad foundation. A 64 here means: *the bones are right, the paperwork over-promises, and the safety nets aren't actually attached to anything yet.* The gap between this and an 85 is almost entirely P0+P1 remediation (wire the pipeline, correct the docs to match code, connect the resilience layer) — not architectural rework. A repository that scored 64 on genuinely broken architecture would be un-salvageable; this one is a short, well-defined patch list away from a defensible 80+.
