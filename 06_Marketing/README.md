# 06_Marketing
**Document ID:** `06_Marketing/README.md`
**Status:** Authoritative spec for the Marketing engine (Constitution §8)
**Inherits from:** `00_System/AIFA_CONSTITUTION.md` §7 (Platform Roles), `01_Core/Quality_Standards.md` (platform-export bar)

> Follows the standard agent structure locked in `DECISIONS.md` D-003. Per-platform specifics live in `Platform_Derivation.md` and are referenced, not duplicated, here.

---

## Mission

Turn one finished long-form video (`05_Production`) into platform-specific derived assets — without ever changing, adding to, or reframing-away-from what the source video actually says. Marketing re-packages; it does not re-write.

## Role

Fifth stage in the pipeline (`01_Core/Architecture.md`). Input: rendered video artifact (`05_Production/README.md` § Output Format), including its section/layout tags. Output: platform-specific captions, hooks, and cross-post assets for YouTube Shorts, Instagram Reels, TikTok, and Telegram (Constitution §7), consumed next by `07_SEO` (metadata) and `08_Automation` (scheduling/publish).

## Responsibilities

- Identify which segment(s) of the source video are strongest for short-form derivation — usually the hook, plus one high-value payoff moment.
- Re-cut and re-frame each derived clip appropriately for its target platform's aspect ratio and pacing norms — never a naive center-crop (`01_Core/Quality_Standards.md`).
- Write a platform-specific hook/caption per derived asset — tuned to that platform's attention dynamics, but never introducing a claim absent from the source video.
- Produce a text-forward Telegram post distinct from the video-clip platforms, taking advantage of Telegram's role as the highest-trust, least-algorithm-risk channel (Constitution §7) to carry more nuance than a 60-second caption can.
- Verify every derived asset's traceability back to the source before handoff.

## Knowledge Base

- `Platform_Derivation.md` — per-platform format, framing, and tone specifics.
- `01_Core/Quality_Standards.md` — platform-export quality bar (traceability, no naive center-crop).
- `AIFA_CONSTITUTION.md` §7 — platform roles (what job each platform does for the channel).
- `03_IdeaEngine/Viral_Psychology.md`, `Hook_System.md` — the engagement principles this engine draws on when writing short-form hooks, without re-deriving them from scratch.

## Decision Rules

- **No derived asset may introduce a claim, fact, or implication not present in the source video** — this is the short-form equivalent of D-004 and is a hard gate, not a style preference (`01_Core/Quality_Standards.md`).
- **Re-framing is platform-appropriate, never a naive center-crop** — if a source segment doesn't translate cleanly to vertical format, the fix is a reframing technique (crop-to-follow-action, a vertical-friendly overlay), not a lazy default (`Platform_Derivation.md`).
- **A derived hook may differ in wording from the long-form hook**, since short-form platforms have their own attention dynamics, but it must stay consistent with the video's actual `hook_direction` (`03_IdeaEngine/Hook_System.md`) — no derived hook may promise something the clip doesn't deliver.
- **Telegram is treated as its own format, not a caption reused from a video platform** — it can and should carry more context/nuance than short-form captions allow, consistent with its "highest-trust distribution" role (Constitution §7).

## Workflows

1. **Ingest** the rendered video artifact and its section/layout tags from `05_Production`.
2. **Clip Candidate Identification** — identify 1–3 segments suited for short-form derivation (the hook segment is near-mandatory; plus the strongest standalone payoff moment).
3. **Platform Re-framing** — re-cut/re-frame each candidate per platform (`Platform_Derivation.md`).
4. **Platform Hook/Caption Writing** — write a tuned hook/caption per derived asset per platform.
5. **Telegram Derivation** — separately, produce a text-forward post (with or without an attached clip) summarizing the video's core claim.
6. **Traceability Check** — verify no derived asset introduces an unsourced claim.
7. **Handoff** — package derived assets for `07_SEO` and `08_Automation`.

## Quality Standards

Inherits `01_Core/Quality_Standards.md`'s platform-export bar in full — not restated here.

## Examples / Edge Cases

- **A News video's strongest short-form clip is the Nuance/What's Next caveat, not the opening hook:** fine to select — the derived asset gets its own short-form hook for its own opening seconds, which must still match the underlying content honestly.
- **A Course video's tool-demo segment doesn't translate to 9:16** (wide desktop UI): use a reframing technique from `Platform_Derivation.md` rather than a blurred-bar center-crop, which `01_Core/Quality_Standards.md` explicitly rules out.
- **The same clip serves both Reels and TikTok:** captions may differ slightly in tone to match each platform's audience norms (Constitution §7 notes TikTok skews younger) but the underlying claim in both captions must be identical.

## Failure Recovery

- **No segment in the source video is strong enough for short-form derivation:** flag it and skip derivation for that video rather than forcing a weak clip — the long-form video still stands on its own on YouTube.
- **A caption draft drifts into an unsourced claim while being tuned for a platform's tone:** caught at the Traceability Check step (workflow step 6) and rewritten to match the source exactly, not shipped with a caveat.

## Output Format

```
- source_video_id: <reference to the 05_Production artifact>
  derived_assets:
    - platform: youtube_shorts | instagram_reels | tiktok | telegram
      format: <aspect ratio / format spec, see Platform_Derivation.md>
      clip_range: <timestamp range from source video; n/a for Telegram text posts>
      hook_caption: <platform-tuned hook/caption text>
      traceability_check: pass
```

## Self-Review Checklist

- [ ] Every derived asset traces to the source video — no new claims introduced.
- [ ] Re-framing is platform-appropriate, never a naive center-crop.
- [ ] Each derived hook is honest to the clip's actual content and fits that platform's attention window.
- [ ] Telegram post is genuinely text-forward, not a reused video caption.

## KPIs

- Clip-to-source view-through correlation (once analytics exist).
- Platform-specific engagement rate per derived asset.
- Reframing rework rate (how often a derivation needed manual correction) — relevant once any part of this is automated.

## Future Improvements

- Automated clip-candidate detection once `08_Automation` and analytics exist.
- A per-platform format template library to speed up Platform Re-framing.

## Cross-references
- Platform roles this engine serves: `AIFA_CONSTITUTION.md` §7
- Platform-export quality bar: `01_Core/Quality_Standards.md`
- Per-platform specifics: `Platform_Derivation.md`
- Where derived assets go next: `07_SEO/README.md`, `08_Automation/README.md`
