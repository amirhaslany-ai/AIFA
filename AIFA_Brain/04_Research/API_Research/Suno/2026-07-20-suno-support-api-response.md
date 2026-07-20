# Suno Support — API availability response (2026-07-20)

| Field | Value |
|---|---|
| **Title** | Suno Support — first-party API availability response |
| **Date received** | 2026-07-20 |
| **Sender classification** | Suno Support (first-party, Suno's own support channel) |
| **Recipient** | AIFA Founder |
| **Evidence class** | First-party correspondence — the evidentiary authority for Suno's current API availability; supersedes third-party websites, secondary reporting, and any earlier internal assumption about Suno's API status |
| **Status** | Active — canonical evidence for the correction recorded in `AIFA_Brain/12_Decisions/PRODUCT_DECISION_LOG.md` (`P-002`) |
| **Related P-002 link** | [`../../../12_Decisions/PRODUCT_DECISION_LOG.md#p-002--launch-model-provider-and-activation-matrix`](../../../12_Decisions/PRODUCT_DECISION_LOG.md#p-002--launch-model-provider-and-activation-matrix) |
| **Related Docs** | [`README.md`](README.md), [`../../../../Platform/docs/providers/suno.md`](../../../../Platform/docs/providers/suno.md), [`../../../../Platform/docs/portfolio/music.md`](../../../../Platform/docs/portfolio/music.md), [`../../../../Platform/docs/pricing/pricing-audit-gaps.csv`](../../../../Platform/docs/pricing/pricing-audit-gaps.csv) (GAP-001) |
| **Tags** | `suno, music, api-research, first-party-evidence, integration-gated` |

## Note on the Founder's original outreach

The Founder's original outreach message to Suno is not reproduced here — it was not supplied into this repository's context, and this record does not reconstruct or invent it. The response below is self-contained and numbers its answers against the Founder's original questions ("Questions 1–8", "Questions 9–13", etc.); those question numbers are preserved as Suno Support wrote them, without inferring or fabricating what each numbered question said.

No email headers, message IDs, authentication information, or other message metadata are preserved here — only the substantive response text, per this repository's evidence-handling rule for correspondence.

## Full response text (verbatim)

> Hi Amir,
>
> Thanks for the detailed and thoughtful message — it's clear you've done your homework, and the AIFA platform sounds like an interesting project.
>
> I want to give you a straight answer so you can plan accordingly: Suno does not currently offer an authorized public API. There is no developer signup, no documented API endpoints, no API key issuance, and no API-tier subscription. This applies to both free and paid plan tiers.
>
> To address a few of your specific questions directly:
>
> API access (Questions 1–8): No production API access is available at this time. There is no onboarding process, pricing structure, rate-limit documentation, or model-capabilities reference for a public API — because the product does not exist yet.
>
> Third-party "Suno API" wrappers: Some services on the web advertise themselves as a "Suno API." These are entirely unaffiliated with Suno. They work by automating the web app under the hood, which carries real terms-of-service risk. Suno does not sanction, endorse, or support them — and we cannot guarantee their continued operation.
>
> Commercial and pass-through rights (Questions 9–13): Pro and Premier subscribers own commercial-use rights to songs they personally generate on Suno's platform. There is currently no licensing framework for API-based integrations or for passing commercial rights through to end users of a third-party platform, because such a product does not exist today.
>
> Enterprise plans (Questions 6, 21): Suno does not currently offer an enterprise, team, or business plan. All accounts are individual.
>
> Data, DPA, legal terms (Questions 15–20): API-specific data handling terms, subprocessor lists, and enterprise agreements do not exist at this time, as there is no API product. Suno's standard consumer Terms of Service are at suno.com/terms.
>
> What you can do right now:
>
> If AIFA has a genuine commercial partnership or integration interest in Suno, the right path is to reach out directly to the partnerships team at support@suno.com. Include a clear description of AIFA, the proposed integration shape, your expected usage, and your key asks. That's how business-development inquiries reach the right internal owners — there is no separate BD inbox or partnerships form at this time.
>
> I can't make any promises about timeline, outcome, or whether an API or enterprise offering is on the roadmap, but a concrete, well-framed pitch to support@suno.com is the right channel to start that conversation.
>
> All the best,
> Suno Support

## Concise summary

Suno confirmed, in its own words, that **no authorized public API currently exists** — no developer signup, no documented endpoints, no API keys, no API-tier subscription, on any plan. Consumer Pro/Premier commercial-use rights do not extend to any API-based or third-party pass-through use, because no such product exists. Suno explicitly disclaims and does not support third-party "Suno API" wrappers (web-app automation, real ToS risk). No enterprise/team/business plan exists. The only current legitimate path forward is a direct commercial-partnership pitch to `support@suno.com`, with no promised timeline or outcome.

## Product implications

- Suno cannot be publicly exposed as an available generation engine in AIFA today — there is no authorized route to invoke it, bill through it, or pass commercial rights through it.
- Suno remains in AIFA's Locked Music Portfolio (strategically important, intentionally not removed) but is `INTEGRATION_GATED` with no authorized serving provider, gateway, or billing counterparty currently available.
- No engineering work should proceed against Suno (no adapter, no API-key setup, no smoke test, no pricing ingestion) until Suno grants explicit written authorization — this is a business/partnership dependency, not an engineering task.
- Third-party "Suno API" wrappers (e.g. SunoAPI.org) are confirmed unaffiliated, unsanctioned, and carry real ToS/continuity/commercial-rights risk — rejected for AIFA production use.
- AIFA's Music launch is not blocked by Suno's absence — ElevenLabs Music/Sound Effects, MiniMax's music route, and the other already-selected authorized providers carry the launch; see `Platform/docs/portfolio/music.md`.
- See `AIFA_Brain/12_Decisions/PRODUCT_DECISION_LOG.md`'s `P-002` for the corrected canonical Suno relationship and activation requirements this evidence drives.
