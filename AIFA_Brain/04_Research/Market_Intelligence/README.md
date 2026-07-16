# Market Intelligence Foundation

| Field | Value |
|---|---|
| **Title** | Market Intelligence Foundation — Section Guide |
| **Created** | 2026-07-16 |
| **Updated** | 2026-07-16 |
| **Owner** | AIFA_Brain maintainers |
| **Status** | Active |
| **Version** | 1.0 |
| **Dependencies** | [`../README.md`](../README.md), [`../../00_Index/METADATA_STANDARD.md`](../../00_Index/METADATA_STANDARD.md) |
| **Related Docs** | [`../../MASTER_INDEX.md`](../../MASTER_INDEX.md), [`../../00_Index/NAVIGATION.md`](../../00_Index/NAVIGATION.md) |
| **Tags** | `market-intelligence, research, competitive-intelligence, navigation` |

## Summary

The **Market Intelligence Foundation** is AIFA's permanent, cross-referenced body of market research — the *market-facing* evidence base that informs (but never makes) strategic decisions. It is a cohesive, self-referential series of twelve documents produced as an eight-phase study plus an executive, synthesis, and independent-audit layer. The documents cite each other by phase (e.g. "Phase 2 §2.1"), so they are kept together here as siblings rather than scattered across the taxonomy.

**Where its findings go.** This foundation is *evidence*, not law. Its recommendations become binding only when ratified into a governed document (Strategy Dossier, Business Model Charter, Risk Register, Product Blueprint) through the constitution's amendment path. The consolidated, ratifiable list of proposed amendments is in [`00_Master_Index.md`](00_Master_Index.md) Part 7.

## Start here

1. **[`01_Executive_Intelligence_Report.md`](01_Executive_Intelligence_Report.md)** — the single-document decision entry point. Assumes no prior context; everything needed to decide is here. Read this first.
2. **[`00_Master_Index.md`](00_Master_Index.md)** — the foundation's internal control layer: full document map, cross-reference spine, and the global Confidence / Evidence / Update / Gap / Amendment registers.
3. The phase documents (02–08) for the evidence behind any claim; the audit/synthesis layer (09–11) for the consolidation and the independent verdict.

## Contents

| # | Document | Scope |
|---|---|---|
| 00 | [`00_Master_Index.md`](00_Master_Index.md) | Navigation, cross-reference map, and the five global registers |
| 01 | [`01_Executive_Intelligence_Report.md`](01_Executive_Intelligence_Report.md) | Executive synthesis and recommendations — the decision entry point |
| 02 | [`02_Competitors_Phase2.md`](02_Competitors_Phase2.md) | Competitor & supplier profiles (inference layer, builders, creative/video) |
| 03 | [`03_Feature_Intelligence.md`](03_Feature_Intelligence.md) | 187-feature register, phase verdicts, constitutional flags |
| 04 | [`04_UX_Intelligence.md`](04_UX_Intelligence.md) | Onboarding, IA, Persian RTL craft standard, trust surfaces |
| 05 | [`05_Pricing_Intelligence.md`](05_Pricing_Intelligence.md) | Full Rial-in/USD-out margin model and unit economics |
| 06 | [`06_Technology_Intelligence.md`](06_Technology_Intelligence.md) | Routing, fallback, caching, latency → CAP-C7-001 requirements |
| 07 | [`07_Strategic_Intelligence.md`](07_Strategic_Intelligence.md) | Three-ring competitor frame, war-gaming, market gaps |
| 08 | [`08_Future_Market_Intelligence.md`](08_Future_Market_Intelligence.md) | 2026–2030 scenarios, commoditize-vs-defensible map |
| 09 | [`09_Consistency_Audit.md`](09_Consistency_Audit.md) | Internal contradictions, duplications, missing links |
| 10 | [`10_Executive_Synthesis.md`](10_Executive_Synthesis.md) | The decision layer bridging research → governed docs |
| 11 | [`11_Due_Diligence_Review_v1.0_FROZEN.md`](11_Due_Diligence_Review_v1.0_FROZEN.md) | Independent red-team audit; decision-readiness scoring (**frozen**) |

## How this section maps to the rest of AIFA_Brain

The foundation feeds the taxonomy sections that link back into it:

- Phase 2 (competitors/suppliers) → [`../../05_Competitors/`](../../05_Competitors/README.md)
- Phase 4 (UX) → [`../User_Research/`](../User_Research/README.md), [`../../08_Design/`](../../08_Design/README.md)
- Phase 5 (pricing/margin) → [`../../11_Pricing/`](../../11_Pricing/README.md), [`../Pricing_Research/`](../Pricing_Research/README.md)
- Phase 6 (technology) → [`../../09_Technology/`](../../09_Technology/README.md), [`../../06_AI/`](../../06_AI/README.md), [`../../10_API/`](../../10_API/README.md)
- Phase 3 (features) & Executive Report → [`../../01_Product/`](../../01_Product/README.md)
- Phases 7–8 & Synthesis → [`../../15_Roadmap/`](../../15_Roadmap/README.md), [`../../03_Marketing/`](../../03_Marketing/README.md)
- Audit & Due Diligence (09, 11) → [`../../13_Learnings/`](../../13_Learnings/README.md)

## Known gaps

- **Phase 1 — "Market Intelligence V1"** (market overview, Iranian-market deep-dive, Tier-1 competitor profiles, core frameworks) was delivered as an in-chat artifact and **was never exported to a file**. It is therefore *not* in this repository. The phase documents reference it as "V1 §…". Recovering and integrating it as `01b_Market_Intelligence_V1.md` (or renumbering) is the top outstanding item for this section. Until then, the Executive Intelligence Report (01) is the reliable standalone entry point.
- The ten open research gaps (RG-1…RG-10) and the ~40 governed-document amendments are catalogued in [`00_Master_Index.md`](00_Master_Index.md) Parts 6–7.

## History

This section was integrated into the canonical repository on 2026-07-16. The full record of what changed, what was reorganized, what was preserved, and the accidental deletions that were caught and reverted is in [`MIGRATION_REPORT_2026-07-16.md`](MIGRATION_REPORT_2026-07-16.md).

## Conventions

Every document carries the standard metadata block ([`../../00_Index/METADATA_STANDARD.md`](../../00_Index/METADATA_STANDARD.md)). The research documents additionally use a consistent labeling scheme in their bodies: **FACT** (sourced) · **INSIGHT** (analysis) · **ASSUMPTION** · **RECOMMENDATION**, with confidence **High / Medium / Low / Unavailable**. The Due Diligence Review (11) is **frozen** — re-audits are filed as new versions, never edits.
