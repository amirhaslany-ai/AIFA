# Phase E Implementation Checklist — 2026-07-18 chat provider-pricing batch

**Audience:** a future implementation agent or engineer with no access to the conversation history that produced this package. Read [`00_Summary.md`](../../../../../AIFA_Brain/04_Research/Pricing_Research/Provider_Pricing_Audit/00_Summary.md) first for why these tasks exist; this file is the ordered task list only.

**This checklist does not authorize any unresolved schema change.** The 4 founder/architecture decisions below stay open until recorded — this file says where they need to be made, not what they should be.

## Engineering tasks (no founder decision needed — do these regardless)

1. **Re-confirm all 13 source URLs in [`sources.yaml`](sources.yaml).** Independently fetch each URL and check it's the exact page the associated claim traces to. For each: update `staging_disposition` to `ELIGIBLE`, or log why it can't be confirmed and set `REJECTED`. This alone unblocks the 90 verified facts that have no other blocker — do not treat "evidence class is `OFFICIAL_VERIFIED`" as a substitute for this step.
2. **Write `sources.csv`, `provider-pricing.csv`, `model-pricing.csv` (updates only, 13 rows already exist — do not insert duplicates), `pricing-audit-gaps.csv`** from [`sources.yaml`](sources.yaml) → [`model_facts.yaml`](model_facts.yaml) → [`pricing_facts.yaml`](pricing_facts.yaml) → [`audit_gaps.yaml`](audit_gaps.yaml), in that order, for every record whose `mapping_type` in [`mapping_manifest.yaml`](mapping_manifest.yaml) is `direct` or `transformation` and whose source is re-confirmed. Assign `priority`/`owner` on `pricing-audit-gaps.csv` rows (human judgment, not invented in staging).
3. **A historical price with a stated `effective_date`** (e.g. Claude Sonnet 5's introductory pricing through 2026-08-31) becomes **two separate rows**, per ADR-0025's versioning principle — never overwrite a historical row's `price_value`.
4. **Extend `validate_pricing.py`** per `mapping_manifest.yaml`'s `required_validator_rule` fields: accept the 13 new `official_model_id` values; distinguish "confirmed not offered" (e.g. `batch_discount_percent = 0` with an explicit statement) from "not yet ingested"; validate `billing_dimension` free-text against a documented accepted set; require every pricing row's `source_id` to resolve to a *re-confirmed* `sources.csv` row. Do this as its own reviewable change, not bundled into data insertion.
5. **`model_facts.yaml`'s ~23 records outside the identity/model-spec field groups** (rate limits, cache multipliers, regions, license claims, aliases, launch/GA dates) aren't yet classified in `mapping_manifest.yaml`. Triage these into existing free-text `notes` columns (the default, no schema change) during the URL re-confirmation pass — flag any that seem to warrant a real column as a 5th founder-decision item rather than guessing.
6. **`../scenario-costs.csv`: do not touch.** Out of scope for this batch.

## Founder/architecture decisions (blocking — see `00_Summary.md` for full framing)

| # | Decision | Facts waiting on it |
|---|---|---|
| 1 | Add model-spec columns to `model-pricing.csv` (context window, max output, knowledge cutoff, availability status)? | 24 verified (+4 unverified) |
| 2 | How to represent OpenAI's dual long-context multiplier (two tagged rows vs. schema extension)? | 4 verified |
| 3 | Add an OpenRouter model-slug column, or keep `notes`-only? | 4 verified |
| 4 | Create `commercial-terms.csv` (Phase D's proposal)? | 8 verified (+3 unverified) |

Do not force-fit any of these into an existing column while waiting for sign-off — route the fact to `pricing-audit-gaps.csv` as a schema-gap reason instead.

## Stop conditions

- A source URL can't be independently re-confirmed as the exact page a claim traces to — log it as a gap, don't block the rest of the batch on it.
- A re-confirmed source contradicts the staged value — treat as a new `CONFLICTING` finding in `pricing-audit-gaps.csv`; never silently overwrite the staged value or the destination row.
- `validate_pricing.py` fails after an insertion step — fix before continuing.

## Validation

```bash
cd Platform
python3 docs/pricing/validate_pricing.py
```
Run after every insertion step; must pass before the next one.

## Expected commits (one per file, independently revertible)

1. `data: register re-confirmed chat-pricing sources (2026-07-18 batch)`
2. `data: ingest verified chat provider pricing (2026-07-18 batch)`
3. `data: update chat model identity fields (2026-07-18 batch)`
4. `data: log unresolved chat-pricing gaps (2026-07-18 batch)`
5. `chore: retire 2026-07-18-chat staging package` (once fully consumed)
6. `tooling: extend validate_pricing.py for chat-pricing batch rules`

## Related documents

- [`00_Summary.md`](../../../../../AIFA_Brain/04_Research/Pricing_Research/Provider_Pricing_Audit/00_Summary.md), [`README.md`](README.md), [`mapping_manifest.yaml`](mapping_manifest.yaml)
- `../../adr/0025-pricing-source-of-truth.md`, `../../adr/0026-phase-c5-evidence-vocabulary-mapping.md`
