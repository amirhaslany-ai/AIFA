# ADR-0024: Smart product capabilities — Router, Cost/Quality/Privacy/Speed Engines, Compare, Benchmark

**Status:** Accepted — direction/roadmap only; no implementation exists for any capability listed here
**Date:** 2026-07-17
**Decision owners:** AIFA founder (product)
**Related:** ADR-0016, ADR-0017, `docs/architecture/smart-routing.md`, `docs/architecture/cost-routing.md`, `docs/architecture/privacy-routing.md`, `docs/architecture/regional-routing.md`
**Supersedes:** none
**Superseded by:** none

## Context

AIFA's long-term differentiation is explicitly not any single model, but the routing/comparison/benchmarking layer sitting above the whole portfolio (ADR-0016's Capability→Model→Provider chain exists partly to make this layer possible).

## Decision

The long-term product differentiators, locked as roadmap direction:

- **Smart Router** — selects a model/provider per request per ADR-0016's chain, informed by the engines below.
- **Smart Cost Engine** — cost-aware routing (`docs/architecture/cost-routing.md`).
- **Quality Engine** — quality-aware routing (e.g. the Persian-quality-authority finding already documented in `AIFA_Brain/04_Research/Market_Intelligence/`, generalized across capabilities).
- **Privacy Engine** — privacy/data-retention-aware routing (`docs/architecture/privacy-routing.md`), preferring zero-data-retention providers where the portfolio offers a choice.
- **Speed Engine** — latency-aware routing (`docs/architecture/regional-routing.md`'s regional-endpoint dimension is a direct input).
- **AI Compare** — must support running multiple models in parallel (a locked functional requirement, not yet implemented).
- **AI Benchmark** — must be capable of showing: execution time, provider cost, normalized cost, output quality, reliability, failure rate (locked required fields, not yet implemented).
- **Project Workspace, Asset Library, Prompt Enhancement, Workflow Automation** — supporting product capabilities, direction only.

## Decision drivers

- ADR-0016 exists specifically so this layer has a stable chain to route across; this ADR names what that routing is *for*, closing the loop between the two decisions.
- AI Compare/Benchmark's required fields are locked now (even pre-implementation) so any future benchmark implementation has a fixed target schema rather than inventing metrics ad hoc later.

## Alternatives considered

- Deferring naming these capabilities until implementation begins: rejected — the mission's own framing treats these as decided long-term differentiators, and recording them now lets portfolio/pricing/economics docs reference them consistently.

## Consequences

- No code exists for any of these capabilities. Every architecture doc under `docs/architecture/{smart-routing,cost-routing,privacy-routing,regional-routing}.md` documents design intent, not shipped behavior — each doc's own status line says so explicitly.
- The Credit Engine (`docs/economics/credit-engine-requirements.md`) must expose the cost data AI Benchmark needs (provider cost, normalized cost) as a byproduct of its own requirements, not a separate data source.

## Risks

- Naming five "engines" before any is built risks over-scoping relative to what a small team can actually ship — this ADR does not sequence or prioritize them; that is a roadmap decision (`AIFA_Brain/15_Roadmap/`), not an architecture decision.

## Mitigations

- None of these are marked `Status: Proposed requiring validation` individually — they are accepted as *direction*; sequencing/prioritization is deliberately left to product roadmap planning rather than fixed here.

## Related documents

- `docs/architecture/smart-routing.md`, `docs/architecture/cost-routing.md`, `docs/architecture/privacy-routing.md`, `docs/architecture/regional-routing.md`, `docs/architecture/fallback-routing.md`
- `docs/economics/credit-engine-requirements.md`
