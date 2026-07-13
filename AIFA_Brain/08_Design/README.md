# 08_Design

| Field | Value |
|---|---|
| **Title** | 08_Design — README |
| **Created** | 2026-07-13 |
| **Updated** | 2026-07-13 |
| **Owner** | unassigned |
| **Status** | Active |
| **Version** | 1.0 |
| **Dependencies** | none |
| **Related Docs** | `../../System/Brand_Guidelines.md`, `../../Platform/docs/adr/0004-frontend-framework.md`, `../03_Marketing/README.md` |
| **Tags** | `design, brand, ux` |

## Purpose

The cross-product design system and visual identity — the one place brand identity (logo, palette, typography) and UX principles are defined once and shared across everywhere they're needed: Content Studio's visual output, Platform's future frontend (`apps/web`, currently a placeholder per `Platform/CURRENT_IMPLEMENTATION_STATUS.md`), and marketing materials.

Currently structure-only, and genuinely blocked: Content Studio's own `System/Brand_Guidelines.md` already flags (🔶, per `TODO.md`'s "Blocked / needs founder input" list) that no logo, color palette, or typography has ever been specified. This folder inherits that same open gap rather than guessing at one — the first real document here should resolve `System/Brand_Guidelines.md`'s gap once, not invent a second, possibly-conflicting answer.

## Update rules

- Brand visual identity (logo, colors, typography) is defined **once**, here or in `System/Brand_Guidelines.md` — not both, and not independently. If this folder becomes the canonical source, `System/Brand_Guidelines.md` should be updated to point here rather than maintain a second copy.
- UX principles for Platform's eventual frontend should be written with `Platform/HANDOVER/12_OPEN_DECISIONS.md`'s open "UX" question in mind (per `Platform/FOUNDER_NEXT_STEP.md`'s recommended order: UX before visual design, both before more frontend code).

## Ownership

Unassigned.

## Relationships

- **`System/Brand_Guidelines.md`** (Content Studio) — the existing, currently-unresolved brand-identity gap this folder should close, not duplicate.
- **`Platform/docs/adr/0004-frontend-framework.md`** — chose Next.js before any real UI need was known; `Platform/FOUNDER_NEXT_STEP.md` flags this as worth revisiting once UX/design work happens here.
- **`03_Marketing/`** — marketing materials should be visually consistent with whatever this folder defines.
