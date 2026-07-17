# ADR-0023: Avatar AI as a separate top-level capability, and HeyGen/Tavus routing intent

**Status:** Accepted (portfolio/product decision) — every provider mapping is UNVERIFIED pending Phase C of the provider pricing audit
**Date:** 2026-07-17
**Decision owners:** AIFA founder (product)
**Related:** ADR-0016, ADR-0017, ADR-0020 (video portfolio — the category this ADR deliberately does not fold Avatar into), `docs/portfolio/avatar.md`
**Supersedes:** none
**Superseded by:** none

## Context

Avatar-generation products (talking-head avatars, digital twins, conversational AI humans) could be modeled as a mode of the Video capability (ADR-0020) or as its own top-level capability. This ADR fixes that categorization question before any avatar-related routing or provider work begins.

## Decision

**Avatar AI is a separate top-level capability, not a subordinate Video mode.**

| Entry | Classification | Primary use cases (routing intent) |
|---|---|---|
| HeyGen | UNVERIFIED | Conventional avatars, digital twins, translation, lip sync, presenter content, many UGC workflows |
| Tavus | UNVERIFIED | Personalized video, conversational AI humans, video agents, sales agents, customer agents, interactive video experiences |
| Hedra (reserve) | RESERVE | — |
| Synthesia (reserve) | RESERVE | — |
| D-ID (reserve) | RESERVE | — |

**Use cases in scope:** AI Avatar, Digital Twin, Personalized Video, AI Presenter, AI Sales Agent, AI Customer Agent, Video Translation, Lip Sync, UGC Video, Conversational AI Human.

**Routing intent (product strategy, not a technical guarantee):** HeyGen is preferred for conventional avatars, digital twins, translation, lip sync, presenter content, and many UGC workflows. Tavus is preferred for personalized video, conversational AI humans, video agents, sales agents, customer agents, and interactive video experiences. UGC generation may use a Smart Router (ADR-0024) rather than exposing either provider directly to the user.

**This routing intent is explicitly documented as product strategy, not an unsupported technical guarantee** — it describes which provider AIFA *intends* to prefer per use case, not a committed SLA or an implemented routing rule.

## Decision drivers

- Avatar workflows (identity/likeness consent, replica/digital-twin creation fees, conversational-agent billing by the minute) have commercial and legal shapes (see `docs/providers/heygen.md`, `docs/providers/tavus.md` field lists — consent requirements, per-avatar-minute pricing) different enough from generative video that folding Avatar into Video's tiering (ADR-0020) would blur two genuinely different product and compliance surfaces.
- HeyGen/Tavus's use-case split follows each vendor's own apparent product specialization (conventional/presenter vs. conversational/interactive) as understood at decision time — subject to Phase C verification, not asserted as a vendor-confirmed fact.

## Alternatives considered

- **Avatar as a Video mode** (alongside Cinematic/Fast/Budget etc. in ADR-0020): rejected — avatar-specific commercial terms (consent, replica fees) and use cases (conversational agents) don't fit the video tiering model cleanly.

## Consequences

- `docs/portfolio/avatar.md` restates this decision and the routing-intent table.
- Any future implementation must not present the HeyGen/Tavus routing intent to users or partners as a guaranteed technical behavior — it is a current product preference, revisable as both vendors evolve.

## Risks

- A two-provider launch portfolio (HeyGen, Tavus) with three reserve options is a thin bench if either primary provider has an outage or a commercial-terms problem (consent policy, pricing change) — `docs/providers/heygen.md`/`tavus.md` must capture consent and licensing terms carefully given how directly avatar/likeness use touches legal risk.

## Related documents

- `docs/portfolio/avatar.md`, `docs/providers/heygen.md`, `docs/providers/tavus.md`
