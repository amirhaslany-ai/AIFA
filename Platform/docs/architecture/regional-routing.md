# Regional routing

**Status:** Design/direction only (ADR-0016, ADR-0024). No implementation exists.

## Summary

ADR-0016's routing chain ends in a Regional Endpoint — a provider-offered region/data-residency option, where one exists. This is currently an **unpopulated dimension**: no provider doc in `docs/providers/` has yet been researched for regional endpoint availability (that is Phase C work). This document exists so the dimension has a fixed home once that research lands, rather than being bolted on later.

## Why this matters for AIFA specifically

`AIFA_Brain/04_Research/Market_Intelligence/06_Technology_Intelligence.md` and `08_Future_Market_Intelligence.md` both discuss data residency and jurisdiction as live open questions for AIFA's own market (Iran/diaspora), separate from *provider-side* regional endpoints. This document is scoped to the latter only: which region a given provider serves a request from, for latency/compliance reasons on the provider's side. It does not duplicate or resolve AIFA's own jurisdiction question, which belongs to AIFA_Brain's business/legal research, not this engineering doc.

## What Phase C needs to populate

For each provider in `docs/providers/`, whether the provider publishes distinct regional endpoints, and if so, which capability/model combinations they apply to. Tracked as an open item in `docs/pricing/pricing-audit-gaps.csv` once Phase C begins.

## Related documents

- ADR-0016, ADR-0024
- `capability-model-provider.md`, `privacy-routing.md`
- `AIFA_Brain/04_Research/Market_Intelligence/06_Technology_Intelligence.md`
