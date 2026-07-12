## What changed

<!-- One or two sentences. What, not why-in-detail (that's the commit message's job if non-obvious). -->

## Why

<!-- Link an issue, ADR, or explain the motivation if there's no issue. -->

## Checklist

- [ ] `pnpm lint && pnpm typecheck && pnpm test && pnpm build` pass locally
- [ ] New `application/use-cases/*` or `infrastructure/persistence/*` files have tests (`docs/architecture/testing-architecture.md`)
- [ ] No vendor SDK imported outside `infrastructure/providers/*` (ADR-0005)
- [ ] If this adds a package/app: README + `docs/architecture/package-boundaries.md` updated
- [ ] If this introduces a new architectural pattern or reverses a decision: an ADR is included

## Screenshots / output

<!-- If this touches apps/web or produces observable output, paste it. Delete this section if not applicable. -->
