# Smart Router

**Status:** Design/direction only (ADR-0024). No implementation exists.

## Summary

The Smart Router is the top-level policy that selects a Model/Provider/Region (ADR-0016's chain) for a given request, informed by the four engines below. This document is the entry point into the routing-policy family; each engine's own document covers its specific dimension.

| Engine | Dimension | Document |
|---|---|---|
| Smart Cost Engine | cheapest acceptable provider/variant | `cost-routing.md` |
| Quality Engine | best-quality provider/variant for the request (e.g. Persian-language quality) | *(no dedicated document yet — tracked as a gap; see below)* |
| Privacy Engine | data-retention/privacy-preferred provider | `privacy-routing.md` |
| Speed Engine | lowest-latency provider/region | `regional-routing.md` (region is the primary latency lever currently identified) |
| Fallback (resilience, not a "smart" policy per se) | keep the request alive on provider/capability failure | `fallback-routing.md` |

**Quality Engine has no dedicated architecture document yet** — this is a real gap, not an omission to be silently filled. `AIFA_Brain/04_Research/Market_Intelligence/01_Executive_Intelligence_Report.md` already identifies "Persian-quality authority" (routing to whichever model is actually best in Persian, which the research notes is often *not* the most expensive one) as one of AIFA's most durable, uncontested opportunities — a genuinely rich basis for a future `quality-routing.md`, once a first quality-scoring methodology is decided. Recorded here as an explicit follow-up, not invented now.

## AI Compare and AI Benchmark (ADR-0024)

Both are locked functional requirements (ADR-0024), not yet designed as architecture:

- **AI Compare** must run multiple models in parallel for the same prompt/input.
- **AI Benchmark** must report: execution time, provider cost, normalized cost, output quality, reliability, failure rate — the same fields that feed Cost/Quality/Speed routing decisions, reused rather than computed twice.

## Related documents

- ADR-0016, ADR-0024
- `capability-model-provider.md`, `cost-routing.md`, `privacy-routing.md`, `regional-routing.md`, `fallback-routing.md`
- `AIFA_Brain/04_Research/Market_Intelligence/01_Executive_Intelligence_Report.md`
