# Naming Conventions

## Packages and apps

- npm scope: `@aifa/<name>` for every `packages/*` entry. `apps/*` are not published, so no scope needed in their `package.json` `name` (use the folder name, e.g. `api`, `web`).
- Folder name = unscoped package name, always kebab-case.

## Files

- `kebab-case.ts` universally.
- Suffix communicates layer/role: `.entity.ts`, `.value-object.ts`, `.use-case.ts`, `.port.ts` (interface), `.repository.ts`, `.adapter.ts`, `.controller.ts`, `.resolver.ts`, `.dto.ts`, `.module.ts`, `.filter.ts`, `.guard.ts`, `.interceptor.ts`.
- Test files: `<subject>.spec.ts` colocated with the file under test (unit), `<flow>.e2e-spec.ts` under a top-level `test/` folder (integration/e2e) — see `testing-architecture.md`.

## Classes/types

- Classes: `PascalCase`, matching filename (`get-system-health.use-case.ts` exports `GetSystemHealthUseCase`).
- Interfaces (ports): `PascalCase`, suffixed `Port` (`AiProviderPort`), not prefixed `I` (avoid Hungarian-notation-style prefixes).
- DTOs: suffixed `Dto` (`CreateConversationRequestDto`).

## Environment variables

- `SCREAMING_SNAKE_CASE`, namespaced by concern when ambiguity is possible (`DATABASE_URL`, `REDIS_URL`, `API_PORT`, `NEXT_PUBLIC_API_BASE_URL`). Client-exposed Next.js vars always carry the `NEXT_PUBLIC_` prefix — never a secret.

## Git

- Branches: `feat/<short-desc>`, `fix/<short-desc>`, `docs/<short-desc>`, `chore/<short-desc>`.
- Commits: Conventional Commits (see `coding-standards.md`).

## ADRs

- `docs/adr/NNNN-kebab-case-title.md`, four-digit zero-padded sequence number, never reused or renumbered.
