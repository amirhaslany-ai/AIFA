# Activation Backlog — model/provider integration work implied by P-002

**Source decision:** [`P-002`](../../../AIFA_Brain/12_Decisions/PRODUCT_DECISION_LOG.md#p-002--launch-model-provider-and-activation-matrix) (Locked, 2026-07-20). This is the single concise backlog for model/provider activation work — it does not duplicate `Platform/POST_FREEZE_BACKLOG.md` (general engineering/infra phases) or any staging-package runbook (pricing-data ingestion). **No item below is implemented by this decision** — recording P-002 is documentation only; this list exists so a future implementation pass has one ordered reference instead of re-deriving it from the decision text.

Each item names what it is, not how to build it — sequencing and estimation are implementation-time decisions, not part of this Locked record.

1. **Shared `fal` media gateway adapter** — one adapter for the four Video families routed through `fal` (Kling Video 3.0, Seedance 2.0, Wan 2.7, Hailuo 2.3), not four separate ad hoc integrations.
2. **Kling Video 3.0 endpoints through `fal`** — Standard/Pro/Turbo, Text-to-Video, Image-to-Video, Motion Control, Native Audio, Multi-shot where supported. Depends on resolving `pricing-audit-gaps.csv` GAP-004 (fal/Kling partnership confirmation) first.
3. **Seedance 2.0 endpoints through `fal`** — Standard/Fast, Text-to-Video, Image-to-Video, Reference-to-Video.
4. **Wan 2.7 endpoints through `fal`** — Text-to-Video, Image-to-Video, Reference-to-Video, editing routes only once exact official endpoints are verified (GAP-003).
5. **Hailuo 2.3 endpoints through `fal`** — Standard/Fast.
6. **Google media adapter for Veo** — Veo 3.1 Standard/Fast, after exact Google API / Vertex AI endpoint verification.
7. **Runway direct adapter** — current verified flagship, faster/economy, and editing models (freshly re-confirm exact names against `runway.md` before building — do not assume Gen-4.5/Gen-4 Turbo/Aleph are still current).
8. **OpenRouter gateway adapter** — one adapter for OpenRouter-routed models generally (initially just Kimi K3), with pinned-slug enforcement (never a moving `~...-latest` alias) and automatic model-fallback disabled by construction.
9. **Pinned model-slug registry** — a single place (config, not hardcoded per call site) mapping each AIFA model to its pinned gateway slug (e.g. Kimi K3 → `moonshotai/kimi-k3`), so a slug can never silently drift.
10. **Kimi K3 through `moonshotai/kimi-k3`** — the first concrete OpenRouter route; implement provider-endpoint inspection, disable automatic provider-level fallback, and log the actual upstream provider per request.
11. **Direct Kimi API comparison task** — evaluate Moonshot's own direct API (`kimi-k3` at `https://api.moonshot.ai/v1`) against the OpenRouter route on price, limits, privacy, latency, and support before deciding whether to add or switch to a direct adapter.
12. **OpenRouter privacy/ZDR validation** — confirm `data_collection: "deny"` and ZDR behavior at the account level for the Kimi K3 route specifically (documentation review is not sufficient — see `openrouter.md`).
13. **Actual-model and upstream-provider logging** — every response's actual served model/provider recorded in the usage record, for OpenRouter routes and direct providers alike.
14. **Shared asynchronous Generation Job infrastructure** — one mechanism for any capability whose generation is not synchronous (Video, Music, Avatar, some Image).
15. **Normalized polling and webhook handling** — one shared pattern across every gateway/provider that supports either.
16. **Asset upload, storage, expiry, and delivery** — shared media-asset handling for generated Video/Image/Music/Avatar output.
17. **Quote/reserve/settle/refund integration** — wiring every new model/provider route into the existing wallet quote-before-commit flow, per capability.
18. **Model and provider configuration** — a config surface that keeps model owner, serving provider, gateway, and billing counterparty as distinct fields (see the schema note in `P-002` and `pricing-audit-gaps.csv` GAP-008) rather than collapsing them.
19. **Live smoke tests** — one passing smoke test per model before it can be marked toward the Active Catalog (activation gate #12).
20. **Persian-quality tests** — for the Chat/Coding models used in the realtime voice stack, and for ElevenLabs/Deepgram's Persian routes specifically.
21. **Chat/Coding/Agentic smoke tests for Kimi K3** — streaming, tool calling, multimodal (image) input, large-context behavior, coding/agentic task behavior.
22. **Media moderation** — moderation-requirement recording and enforcement per model (activation gate #25), across Image/Video/Music/Avatar.
23. **Model activation controls** — the operational switch(es) that move a model from Locked Portfolio to public Active Catalog once all applicable gates pass, and back out again on failure, without blocking sibling models in the same capability (per P-002's "failure of one model must never block others").
24. **Future direct-provider comparison for Kling, Seedance, Wan, and Hailuo** — KlingAI Open Platform, ByteDance/Volcano Engine direct, Alibaba Cloud Model Studio, and MiniMax's own API, each evaluated against the initial `fal` route on cost, limits, reliability, and contract terms.
25. **ElevenLabs and Deepgram adapters** — Voice (TTS/STT/cloning/dubbing) and Music (ElevenLabs Music/Sound Effects) routes, with the Persian-capability checks from item 20 as a hard gate before Persian traffic is routed to either.
26. **HeyGen Avatar adapter** — stock-avatar presenter video, text-to-avatar, audio-to-avatar, approved translation/lip sync, stock voices; Digital Twin/face/voice cloning stay out of scope until consent/identity controls exist.
27. **Suno first-party onboarding and API review** — track the Founder's direct application to Suno's API partner program (`pricing-audit-gaps.csv` GAP-001) as an external dependency; do not build against SunoAPI.org or any unofficial route in the meantime.

## Related documents

- `AIFA_Brain/12_Decisions/PRODUCT_DECISION_LOG.md` (`P-002`)
- `Platform/docs/portfolio/README.md`, `chat.md`, `video.md`, `voice.md`, `music.md`, `avatar.md`
- `Platform/docs/providers/openrouter.md`, `moonshot.md`, `fal.md`, `kling.md`
- `Platform/docs/pricing/pricing-audit-gaps.csv`
- `Platform/POST_FREEZE_BACKLOG.md` (general engineering backlog — distinct scope, not duplicated here)
