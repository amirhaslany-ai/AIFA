# Architecture Decision Log (Company-Level)

| Field | Value |
|---|---|
| **Title** | Architecture Decision Log |
| **Created** | 2026-07-13 |
| **Updated** | 2026-07-13 |
| **Owner** | AIFA_Brain maintainers |
| **Status** | Active |
| **Version** | 1.0 |
| **Dependencies** | `README.md` |
| **Related Docs** | `DECISION_LOG.md`, `../../Platform/docs/adr/`, `../09_Technology/README.md` |
| **Tags** | `decisions, architecture` |

Architecture decisions that are genuinely **company-level** — spanning both engineering workstreams, or concerning infrastructure/technology neither workstream's own log naturally owns (e.g. a hosting provider decision that affects both Platform's deployment and any future Content-Studio-adjacent tooling). This log does **not** duplicate:

- **`Platform/docs/adr/`** — Platform's own internal technical architecture (hexagonal layering, database schema decisions, API style, auth strategy, etc.). Those stay ADRs, in that folder, under Platform's own numbering (0001–0015 as of this writing).
- **`00_System/DECISIONS.md`** — Content Studio's own internal architecture (e.g. D-002's documentation-first multi-file agent architecture). Those stay there.

If you're about to add an entry here, first check: is this decision actually about something outside either workstream's own internal architecture (e.g. "which cloud provider hosts everything," "should Content Studio and Platform share a CDN")? If the decision is really just Platform's internal design, write an ADR in `Platform/docs/adr/` instead and link to it from here if it's worth cross-referencing.

Status legend: **Locked** / **Provisional** / **Superseded** (see `DECISION_LOG.md` for definitions).

---

*No entries yet.*

---

## Entry format

```
### CA-001 — {short decision title}
**Status:** {Locked / Provisional / Superseded}
**Date:** {YYYY-MM-DD}
**Decision:** {what was decided}
**Rationale:** {why}
**Alternatives considered:** {what else was weighed, per Platform's own ADR discipline}
**Owner:** {who}
**Related:** {links — e.g. to a Platform ADR this relates to, or Content Studio's DECISIONS.md}
```

("CA" = Company Architecture, to keep the numbering visibly distinct from Platform's own ADR-NNNN and Content Studio's own D-NNN.)

## Change History

- **2026-07-13:** Log created (D-021).
