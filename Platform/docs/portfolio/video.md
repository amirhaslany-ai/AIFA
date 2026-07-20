# Video

**Decision record:** [`../adr/0020-video-portfolio.md`](../adr/0020-video-portfolio.md) (authoritative for the original tier/mode structure) plus [`P-002`](../../../AIFA_Brain/12_Decisions/PRODUCT_DECISION_LOG.md#p-002--launch-model-provider-and-activation-matrix) (Locked, 2026-07-20 — resolves the Wan version, fixes exact Kling/Seedance naming, and sets `fal` as the **initial** serving gateway rather than a fallback for Kling/Seedance/Wan/Hailuo). Where this doc and P-002 disagree, **P-002 wins** (it is the later Locked decision); where this doc and ADR-0020 disagree on anything P-002 does not address, the ADR still wins.

**Do not confuse Kling Video 3.0 with Kling Video 3.0 Omni (a separate, related-but-distinct family) or with Kimi K3 (an unrelated Chat/Coding model, Moonshot AI — see [`chat.md`](chat.md)).**

## General launch

| Model | Model owner | Initial serving gateway | Classification | Provider doc |
|---|---|---|---|---|
| Kling Video 3.0 Standard | KlingAI / Kuaishou | `fal` | UNVERIFIED | [`kling.md`](../providers/kling.md), [`fal.md`](../providers/fal.md) |
| Seedance 2.0 Standard | ByteDance | `fal` | UNVERIFIED | [`volcano-engine.md`](../providers/volcano-engine.md), [`fal.md`](../providers/fal.md) |
| Veo 3.1 Fast | Google | Google direct (API/Vertex, endpoint TBC) | UNVERIFIED | [`google.md`](../providers/google.md) |
| Wan 2.7 | Alibaba | `fal` | UNVERIFIED | [`alibaba.md`](../providers/alibaba.md), [`fal.md`](../providers/fal.md) |
| Gemini Omni Flash | Google | Google direct | UNVERIFIED | [`google.md`](../providers/google.md) |

## Premium

| Model | Model owner | Initial serving gateway | Classification |
|---|---|---|---|
| Veo 3.1 Standard | Google | Google direct | UNVERIFIED |
| Seedance 2.0 (Standard tier) | ByteDance | `fal` | UNVERIFIED |
| Kling Video 3.0 Pro | KlingAI / Kuaishou | `fal` | UNVERIFIED |
| Runway (current verified flagship — freshly confirm exact name/endpoint, do not assume Gen-4.5 still current) | Runway | Runway direct | UNVERIFIED |

## Economy

| Model | Model owner | Initial serving gateway | Classification |
|---|---|---|---|
| Veo Lite | Google | Google direct | UNVERIFIED |
| Hailuo 2.3 Fast | MiniMax | `fal` | UNVERIFIED |
| Kling Video 3.0 Turbo (where commercially useful) | KlingAI / Kuaishou | `fal` | UNVERIFIED |
| Runway (current verified faster/economy model — freshly confirm) | Runway | Runway direct | UNVERIFIED |
| Wan 2.7 (720p mode) | Alibaba | `fal` | UNVERIFIED |

## Editing

| Model | Model owner | Initial serving gateway | Classification |
|---|---|---|---|
| Gemini Omni Flash | Google | Google direct | UNVERIFIED |
| Runway (current verified editing model, API-accessible — freshly confirm) | Runway | Runway direct | UNVERIFIED |
| Wan 2.7 Video Edit / Reference-to-Video | Alibaba | `fal` | UNVERIFIED |

## Character / motion

| Model | Model owner | Initial serving gateway | Classification |
|---|---|---|---|
| Kling Video 3.0 Motion Control | KlingAI / Kuaishou | `fal` | UNVERIFIED |
| Wan 2.7 Reference-to-Video | Alibaba | `fal` | UNVERIFIED |

## Reserve / watchlist

Luma, Sora, Grok Video, Pika — considered, not in launch scope (`RESERVE`).

## Consumer modes

Smart Video · Best Quality · Fast · Economy · Text to Video · Image to Video · Reference to Video · Video Editing · Motion Control · Native Audio (where available). Professional users may manually select an activated model; not every mode needs to be enabled in the first internal test build.

## Serving-gateway strategy (per P-002)

Initial: **Google direct** for Veo · **`fal`** for Kling Video 3.0, Seedance 2.0, Wan 2.7, and Hailuo 2.3 · **Runway direct** for Runway models. This reduces the number of initial runtime adapters while retaining broad model coverage. Direct-provider adapters for Kling/Seedance/Wan/Hailuo (KlingAI Open Platform, ByteDance/Volcano Engine, Alibaba Cloud Model Studio, MiniMax API respectively) remain future optimizations, not a launch requirement — see [`ACTIVATION_BACKLOG.md`](ACTIVATION_BACKLOG.md) item 21.

## Known open items

- Exact Wan version is now **resolved to 2.7** by P-002 (was "2.6 or 2.7" in ADR-0020) — the remaining task is exact API-endpoint verification via `fal`, not the version choice itself.
- Runway's exact current flagship/economy/editing model names and endpoints must be freshly re-verified before Phase C — do not assume Gen-4.5/Gen-4 Turbo/Aleph are still current or correctly named; see `runway.md`.
- Kling Video 3.0's exact official API identifier (via `fal` vs. a future KlingAI Open Platform direct route) is not yet confirmed — see `kling.md`.
