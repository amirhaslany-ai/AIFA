# Contributing to the AIFA Platform

This covers process (branching, commits, review). For code conventions see [`docs/architecture/coding-standards.md`](docs/architecture/coding-standards.md) and [`docs/architecture/naming-conventions.md`](docs/architecture/naming-conventions.md). For the architectural rules a change must respect, start at [`docs/architecture/00-overview.md`](docs/architecture/00-overview.md) and the [`docs/adr/`](docs/adr) log.

## Before you start

1. Read the ADRs in order — they explain *why* the structure is what it is. A change that seems to violate one either needs a new ADR superseding it, or is probably wrong.
2. Check `docs/architecture/domain-boundaries.md` and `package-boundaries.md` before adding a new module/package — most new work belongs inside an existing boundary, not a new one.
3. If your change is architecturally significant (new package, new bounded context, a reversed decision), write an ADR *before* writing code, not after.

## Branch strategy

- Branch off `main`: `feat/<short-desc>`, `fix/<short-desc>`, `docs/<short-desc>`, `chore/<short-desc>`, `refactor/<short-desc>` (matches `naming-conventions.md`).
- No long-lived branches beyond `main` — this repo doesn't use a `develop` branch or release branches yet (nothing to release to, per `docs/architecture/ci-cd-pipeline.md`'s deferred CD).

## Commit convention

[Conventional Commits](https://www.conventionalcommits.org/): `type(scope): description`, e.g. `feat(ai-provider-sdk): add retry policy decorator`. Types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`. Scope is the package/app name without the `@aifa/` prefix, omitted for repo-wide changes.

## Before opening a PR

Run locally (all wired via Turborepo, see root `package.json`):
```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```
All four are what CI (repo-root `.github/workflows/aifa-platform-ci.yml`) runs — a PR that fails any of them won't merge, so catching it locally first is faster than waiting on CI.

## PR expectations

- One coherent change per PR — restated from `docs/architecture/coding-standards.md`'s "definition of done," but worth repeating: a PR that touches an unrelated package "while I was in there" is harder to review and revert.
- Use the PR template (`.github/pull_request_template.md`) — it asks for the same things a reviewer needs to check anyway.
- If the PR adds a new package/app, it needs: a `README.md` stating responsibility (first paragraph), an entry in `docs/architecture/package-boundaries.md`, and — if it introduces a new architectural pattern — an ADR.

## Code review guide (for reviewers)

Check, roughly in this order (fail fast on the cheap checks):
1. **CI is green.** Don't manually re-verify what CI already checked.
2. **Boundary violations:** does this reach across a layer it shouldn't (`backend-architecture.md`'s dependency rule), or import a vendor SDK outside `infrastructure/providers/` (ADR-0005)? This is the single most common way foundation-era discipline erodes — check it every time, not just on backend PRs.
3. **Scope creep:** is everything in this diff actually related to its stated purpose?
4. **Tests:** does new `application/use-cases/*` or `infrastructure/persistence/*` code have a test, per `docs/architecture/testing-architecture.md`'s per-PR requirements?
5. **Docs:** if the PR changes a documented convention or adds a package, did the relevant doc get updated in the same PR (not "in a follow-up")?

Reviewers should request changes for (2) and (4) without much debate — they're conventions already agreed in the ADR log, not new opinions being litigated per-PR. (1), (3), (5) are judgment calls.

## Issue templates

Use `.github/ISSUE_TEMPLATE/bug_report.md` or `feature_request.md`. If neither fits (e.g. proposing an architectural change), open a PR adding an ADR instead — architectural discussion belongs in the ADR log, not an issue thread that isn't part of the permanent record.
