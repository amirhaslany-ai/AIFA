# Decision Log (General / Cross-Cutting)

| Field | Value |
|---|---|
| **Title** | Decision Log |
| **Created** | 2026-07-13 |
| **Updated** | 2026-07-13 |
| **Owner** | AIFA_Brain maintainers |
| **Status** | Active |
| **Version** | 1.1 |
| **Dependencies** | `README.md` |
| **Related Docs** | `ARCHITECTURE_DECISION_LOG.md`, `BUSINESS_DECISION_LOG.md`, `PRODUCT_DECISION_LOG.md`, `../../00_System/DECISIONS.md`, `../00_Index/KNOWLEDGE_SYNC_POLICY.md` |
| **Tags** | `decisions` |

General/cross-cutting decisions — anything of real consequence that doesn't fit cleanly into Architecture, Business, or Product (e.g. an organizational decision, a decision about how `AIFA_Brain/` itself works, a decision spanning multiple of the other three categories equally). See `README.md` for how this relates to `00_System/DECISIONS.md` and `Platform/docs/adr/`.

Status legend (matching `00_System/DECISIONS.md`'s convention): **Locked** = settled, changing it requires explicit founder approval · **Provisional** = working assumption · **Superseded** = replaced by a later entry, kept for history, never deleted.

---

### G-001 — GitHub is the single source of truth; knowledge is synced to the repo and pushed at every milestone
**Status:** Locked
**Date:** 2026-07-13
**Decision:** GitHub (`github.com/amirhaslany-ai/AIFA`) is the permanent single source of truth for the entire AIFA project. The local filesystem is never treated as the primary workspace. For every completed task: (1) update the appropriate document inside `AIFA_Brain/`; (2) store any new knowledge in the correct folder, updating `MASTER_INDEX.md` and related documents and cross-linking; (3) record any business decision in `AIFA_Brain/12_Decisions/`; (4) store completed research as raw research + summarized findings + conclusions; (5) create/update the relevant competitor profile for any competitor analysis; (6) update the architecture documents for any architecture change; (7) update `15_Roadmap/` for any roadmap change; (8) commit using meaningful conventional commits; (9) push to GitHub whenever a logical milestone is finished. Important project knowledge must never live only on the local machine.
**Rationale:** Founder directive. A knowledge base is only trustworthy if it is complete and current in one authoritative place; scattering knowledge across local machines and un-pushed commits is exactly the failure mode the whole `AIFA_Brain/` restructuring exists to prevent. Making "record it in the repo, commit, and push at the milestone" part of the definition of done for every task keeps GitHub authoritative by construction.
**Owner:** Founder (policy); AIFA_Brain maintainers (day-to-day execution).
**Related:** `../00_Index/KNOWLEDGE_SYNC_POLICY.md` (the operational statement of this policy), `../README.md`, `../../../CLAUDE.md`, `../../Agents/KNOWLEDGE_ACCESS_RULES.md` (the same discipline applied to future agents). This is a **Locked** policy — permanent unless the founder explicitly changes it.

---

## Entry format

```
### G-001 — {short decision title}
**Status:** {Locked / Provisional / Superseded}
**Date:** {YYYY-MM-DD}
**Decision:** {what was decided, stated precisely}
**Rationale:** {why}
**Owner:** {who is accountable for this decision}
**Related:** {links to any related decisions, research, or documents}
```

Number entries `G-001`, `G-002`, ... sequentially, never reused even if an entry is later superseded.

## Change History

- **2026-07-13:** G-001 added — GitHub established as the permanent single source of truth (founder policy). Canonical statement in `../00_Index/KNOWLEDGE_SYNC_POLICY.md`.
- **2026-07-13:** Log created (D-021).
