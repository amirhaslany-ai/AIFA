# Product Decision Log

| Field | Value |
|---|---|
| **Title** | Product Decision Log |
| **Created** | 2026-07-13 |
| **Updated** | 2026-07-19 |
| **Owner** | AIFA_Brain maintainers |
| **Status** | Active |
| **Version** | 1.0 |
| **Dependencies** | `README.md` |
| **Related Docs** | `DECISION_LOG.md`, `../01_Product/README.md`, `../15_Roadmap/README.md` |
| **Tags** | `decisions, product` |

Product decisions: what gets built, for whom, in what order, and why — including decisions that resolve `Platform/HANDOVER/12_OPEN_DECISIONS.md`'s product-shaped open questions (first target user, whether Next.js is still the right frontend choice, whether a client can select a specific provider/model, etc.).

Status legend: **Locked** / **Provisional** / **Superseded** (see `DECISION_LOG.md` for definitions).

---

### P-001 — Launch with a broad, value-dense product foundation
**Status:** Locked
**Date:** 2026-07-19
**Decision:** AIFA will launch as a broad multi-capability AI platform rather than as a minimal chat-only product. The initial launch target includes: Chat; Image generation; Video generation; Voice capabilities; Music generation; Avatar generation; Smart Router; Toman wallet and quote-before-commit pricing; user history and generated-asset library; opt-in basic Memory; curated workflow templates; controlled task-focused Agents. Each launch capability must provide at least one complete, reliable, production-ready user journey. AIFA will not wait for every planned subfeature to reach maximum depth before entering testing — once the shared infrastructure and initial user journeys are operational, the Founder will place the product under real usage, testing, debugging, and iterative improvement. Development, testing, bug fixing, and feature expansion continue concurrently after the initial usable product is available. Advanced capability depth may be added continuously without changing the committed product direction, including: unrestricted Agent Builder; unrestricted Workflow Builder; real-time voice; advanced voice cloning with consent and verification; digital twins; professional media editors; enterprise collaboration; public developer APIs; advanced semantic Memory; additional models and providers. Every confirmed product decision, operational rule, verified provider fact, pricing input, and implementation constraint must remain preserved in GitHub as the source of truth for future engineers and autonomous agents.

**Product principle:** Launch with meaningful breadth, then continuously deepen each capability using real operational and customer evidence.

**Rationale (commercial):** AIFA must create greater practical and perceived value than access-focused competitors such as Hoosha and GapGPT. AIFA's differentiation is the combined value of: multiple AI capabilities in one platform; transparent pricing before execution; intelligent model selection; a Persian-first experience; reliable wallet, settlement, and refund behavior; useful Memory, Workflows, and Agents; higher trust; clearer user control; continuous improvement after launch. The objective is to make migration to AIFA feel safer, easier, more useful, and more valuable than remaining on narrower or less-transparent alternatives.

**Constraints:**
- No capability may be presented as production-ready before its complete user journey, pricing, failure handling, and usage settlement work correctly.
- No silent model substitution.
- No opaque credit behavior.
- No hidden charges.
- No sensitive autonomous action without explicit user approval.
- Memory must be optional, visible, editable, and deletable.
- Testing must not expose uncontrolled financial, security, privacy, legal, or abuse risks.
- Advanced depth must not block delivery of the first reliable user journey for each launch capability.

**Owner:** Founder

**Supersedes:** Any earlier recommendation that AIFA should launch only with Chat and Image.

**Related:** [`../01_Product/README.md`](../01_Product/README.md), [`../04_Research/Market_Intelligence/01_Executive_Intelligence_Report.md`](../04_Research/Market_Intelligence/01_Executive_Intelligence_Report.md), [`../../Platform/docs/adr/0016-capability-model-provider-architecture.md`](../../Platform/docs/adr/0016-capability-model-provider-architecture.md), [`../../Platform/docs/adr/0017-multimodal-provider-abstraction.md`](../../Platform/docs/adr/0017-multimodal-provider-abstraction.md), [`../../Platform/docs/adr/0018-chat-portfolio.md`](../../Platform/docs/adr/0018-chat-portfolio.md), [`../../Platform/docs/adr/0019-image-portfolio.md`](../../Platform/docs/adr/0019-image-portfolio.md), [`../../Platform/docs/adr/0020-video-portfolio.md`](../../Platform/docs/adr/0020-video-portfolio.md), [`../../Platform/docs/adr/0021-voice-portfolio.md`](../../Platform/docs/adr/0021-voice-portfolio.md), [`../../Platform/docs/adr/0022-music-portfolio.md`](../../Platform/docs/adr/0022-music-portfolio.md), [`../../Platform/docs/adr/0023-avatar-category.md`](../../Platform/docs/adr/0023-avatar-category.md), [`../../Platform/docs/adr/0024-smart-routing-principles.md`](../../Platform/docs/adr/0024-smart-routing-principles.md)

---

## Entry format

```
### P-001 — {short decision title}
**Status:** {Locked / Provisional / Superseded}
**Date:** {YYYY-MM-DD}
**Decision:** {what was decided}
**Rationale:** {why, grounded in research where possible — link ../04_Research/User_Research/ or ../05_Competitors/ entries}
**Owner:** {who}
**Related:** {links}
```

## Change History

- **2026-07-19:** P-001 added — broad multi-capability launch scope locked, superseding any earlier chat+image-only recommendation.
- **2026-07-13:** Log created (D-021).
