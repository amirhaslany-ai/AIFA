# Suno

**Status:** Corrected 2026-07-20 on first-party evidence from Suno Support — [`P-002`](../../../AIFA_Brain/12_Decisions/PRODUCT_DECISION_LOG.md#p-002--launch-model-provider-and-activation-matrix). This closes the identity gate the original skeleton doc below named as the single highest-priority open question — the answer is **no**.

## The gate is resolved: Suno has no authorized public API

Suno Support's direct response (`AIFA_Brain/04_Research/API_Research/Suno/2026-07-20-suno-support-api-response.md`) states plainly: **no authorized public API exists** — no developer signup, no documented API endpoints, no API-key issuance, no API-tier subscription, on either the free or paid consumer plan. No enterprise/team/business plan exists. Pro/Premier consumer commercial-use rights do not extend to API-based or third-party pass-through use, because no such product exists today. This directly contradicts (and corrects) any earlier repository framing that treated `platform.suno.com`, a consumer subscription, or a "curated API partner-program intake" as evidence of production API access — none of that establishes an authorized route.

## AIFA usage (locked portfolio decision — corrected 2026-07-20)

- Music: Suno v5.5 (Full Song) — **Locked Portfolio**, **not in the Active Catalog**, `INTEGRATION_GATED — NO AUTHORIZED PUBLIC API OR PASS-THROUGH LICENSING FRAMEWORK` — [`../portfolio/music.md`](../portfolio/music.md), ADR-0022, `P-002`.

| Field | Value |
|---|---|
| Model owner | Suno |
| Authorized serving provider | None currently available |
| Authorized gateway | None currently available |
| Billing counterparty for API use | None |
| Current legitimate path | Direct commercial-partnership discussion — `support@suno.com` (no separate BD inbox/form; no promised timeline or outcome) |

## Identity — resolved (no API), full spec still PENDING

**Does Suno have an official API product at all?** Resolved: **no**, as of the 2026-07-20 first-party response. Exact model IDs, endpoints, and versioning for a future API remain **N/A until one exists**.

## Pricing — PENDING, no authorized basis exists

There is no public API billing unit, no public API plan, and no production cost basis — Suno's response is explicit that no API-tier subscription or pricing structure exists. **Do not populate any Suno API price in `provider-pricing.csv` until Suno provides one in writing.** Consumer subscription pricing (Pro/Premier) is a different product and must not be treated as an API rate, per ADR-0025.

## Commercial & legal — PENDING, gated on a future written agreement

Confirmed by Suno's own response: no API-specific data-handling terms, subprocessor list, or enterprise agreement exists (there is no API product for them to attach to). Suno's standard consumer Terms of Service (`suno.com/terms`) govern the consumer product only and do not establish AIFA commercial/pass-through rights. **Suno may enter the Active Catalog only after Suno directly provides, in writing:** authorized integration/API access; technical endpoints and authentication; API model/capability documentation; pricing and billing terms; rate limits and capacity terms; explicit permission to embed Suno in AIFA; permission for AIFA to charge end users; pass-through commercial-use rights for AIFA's users; output-ownership terms; API-specific data/retention terms; a DPA or equivalent where required; geographic/sanctions/account-eligibility terms; support/suspension/termination/continuity terms; and an executed partnership or commercial agreement where required. Until then, Suno must not be publicly exposed as an available generation engine.

## Third-party wrappers — rejected for production use

**SunoAPI.org (`docs.sunoapi.org`): `REJECTED FOR PRODUCTION USE`.**

| Field | Value |
|---|---|
| Model owner | Suno |
| Third-party operator | SunoAPI.org (claimed operator information may remain as historical research, not restated here) |
| Authorization | **Not authorized by Suno**, per Suno's own first-party response |
| Reported access method | Web-application automation |
| Risk | Terms-of-service, licensing, continuity, commercial-rights, and operational risk |

AIFA must not use SunoAPI.org, any other unofficial Suno wrapper, browser automation, consumer-account automation, shared consumer accounts, session cookies, reverse-engineered endpoints, undocumented access, or an unofficial reseller — with or without that reseller's own claim of authorization. No implementation task for SunoAPI.org exists in `../portfolio/ACTIVATION_BACKLOG.md`; none should be added. Prior historical research describing such wrappers (if any) may remain preserved elsewhere, clearly marked rejected — not deleted, and not restated here as a candidate route.

## Music launch continuity

Suno's absence does not block the Music capability. ElevenLabs Music/Sound Effects, MiniMax's music route, and the other already-selected authorized candidates (Lyria, Mureka, Stable Audio, Udio) carry the launch — see [`../portfolio/music.md`](../portfolio/music.md). Each still passes the Universal activation gates independently of Suno's status.

## Related documents

- `../adr/0022-music-portfolio.md`, `AIFA_Brain/12_Decisions/PRODUCT_DECISION_LOG.md` (`P-002`)
- `AIFA_Brain/04_Research/API_Research/Suno/2026-07-20-suno-support-api-response.md` (first-party evidence)
- `../portfolio/music.md`, `../pricing/pricing-audit-gaps.csv` (GAP-001)
