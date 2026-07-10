# Production Standards
**Document ID:** `System/Production_Standards.md`
**Owning decision:** `DECISIONS.md` D-019 (Provisional)
**Referenced by:** `05_Production/README.md`

> Distinct from `05_Production/README.md` (the engine's *process* — avatar/voice/assembly pipeline mechanics): this file is the *technical export specification* every render must meet, independent of which tool eventually produces it.

## Default export specs (D-019)

| Spec | Default |
|---|---|
| Resolution | 1080p minimum; 4K if tooling/budget supports it without added cost |
| Frame rate | 30fps |
| Audio | Stereo, AAC, 192kbps or better |
| Captions | Persian, burned-in or platform-native (`DECISIONS.md` D-015) |

These are industry-standard baseline values chosen as a cheap, reversible default (§ D-019 rationale) — not a brand-identity choice. Revisit once actual avatar/voice tooling (`OPEN_QUESTIONS.md` OQ-002) and budget (OQ-003) are confirmed, since tool output capability may constrain what's actually achievable.

## File naming and versioning

- Rendered video files are named to include: category, working title (slugified), and content-brief reference, so a file can be traced back to its pipeline artifact without opening it.
- Persona/brand asset configurations (`05_Production/Avatar_Pipeline.md` step 2) are versioned explicitly — every rendered video's output artifact (`05_Production/README.md` § Output Format `avatar_asset_version`) references which configuration version produced it, so a persona-spec update's effect on prior videos is traceable.

## Technical QC (distinct from editorial QC)

This file's checks are technical (does the export meet spec, is the file free of corruption/artifacts) — separate from `09_QA/README.md`'s editorial checks (traceability, persona consistency, structure). Both are required; neither substitutes for the other. A technically perfect export can still fail `09_QA`'s editorial gate, and vice versa.

## Cross-references
- Owning decision: `DECISIONS.md` D-019
- Process this spec applies to: `05_Production/README.md`
- Captions mandate: `DECISIONS.md` D-015
- Editorial QC (separate axis): `09_QA/README.md`
