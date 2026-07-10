# 08_Automation
**Document ID:** `08_Automation/README.md`
**Status:** Authoritative spec for the Automation engine (Constitution §8) — currently a specification, not a running system
**Inherits from:** `01_Core/Architecture.md` (stage definition), `00_System/DECISIONS.md` D-009, D-016

> Follows the standard agent structure locked in `DECISIONS.md` D-003. This engine is blocked on the same open questions as `05_Production` (tooling, budget) — this file documents the pipeline *shape* it must eventually fill, per the tool-agnostic design principle in `01_Core/Architecture.md`.

---

## Mission

Take every finished asset for a piece of content (video, derived platform assets, SEO metadata) and get it published, correctly scheduled, on the right platform — without ever bypassing the human review checkpoint that has to happen first (Constitution Core Principle 5, `DECISIONS.md` D-016).

## Role

Seventh/eighth stage in the pipeline (`01_Core/Architecture.md`). Input: all finished assets — the rendered video (`05_Production`), derived platform assets (`06_Marketing`), and metadata (`07_SEO`). Output: scheduled and, once approved, published posts across YouTube, Instagram, TikTok, and Telegram.

**Ordering clarification (D-016):** `01_Core/Architecture.md`'s pipeline diagram places this engine before `09_QA`. That's accurate for *package assembly and scheduling*, but actual publish execution holds until `09_QA` signs off — this engine stages and queues, it doesn't unilaterally go live on a timer.

## Responsibilities

- Assemble a complete publish package per platform from `05_Production`, `06_Marketing`, and `07_SEO` outputs.
- Assign a scheduled publish time per platform.
- Hold every package in a pending-approval state visible to `09_QA` until it's signed off — no package skips this regardless of schedule pressure.
- Execute publish via each platform's API/integration once approved.
- Log publish status (success/failure) back to `Knowledge/` for saturation-check history (`03_IdeaEngine`) and KPI tracking.

## Knowledge Base

- `OPEN_QUESTIONS.md` OQ-001 (tool assignments — is n8n still the automation tool, is it confirmed) and OQ-003 (budget) — both block final tool selection and are the main reason this engine remains a specification today.
- `DECISIONS.md` D-009 — the longer-term command-interface goal (`/news`, `/course`, etc.) that would eventually trigger this engine directly, once the orchestration layer (`10_Orchestrator`) exists.
- `DECISIONS.md` D-016 — the QA-hold ordering clarification above.
- `09_QA/README.md` — the review gate this engine's publish step depends on (to be written; see `OPEN_QUESTIONS.md` OQ-004 for what exactly gets reviewed).

## Decision Rules

- **No publish package fires without `09_QA` sign-off** (D-016) — this is a hard rule, not a target, including for time-sensitive News content. If review delay conflicts with a News story's freshness window, that tension is flagged (see § Failure Recovery), not resolved by skipping review.
- **Scheduling respects cadence targets once `OPEN_QUESTIONS.md` OQ-005 resolves.** Until then, scheduling is founder-driven/manually triggered rather than assumed against an unconfirmed cadence.
- **Tool selection is out of scope for this file.** n8n was the original proposal (`DECISIONS.md` D-001) but is not confirmed as current (OQ-001) — this file documents workflow shape only, per `01_Core/Architecture.md`'s tool-agnostic principle.

## Workflows

1. **Ingest** all finished assets for one content brief's full output set (video + derived assets + metadata).
2. **Package Assembly** — bundle each platform's specific asset and metadata into a publish-ready package.
3. **Schedule Assignment** — assign a target publish time per platform.
4. **QA Hold** — the package sits in a pending-approval state until `09_QA` signs off (D-016).
5. **Publish Execution** — upon approval, execute publish via the platform's API/integration (tool TBD, OQ-001).
6. **Status Logging** — record publish confirmation or failure back to `Knowledge/` and KPI tracking.

## Quality Standards

Inherits `01_Core/Quality_Standards.md`. Automation-specific hard rule: no package may skip the QA Hold step (workflow step 4) regardless of scheduling pressure — an on-time publish that bypassed review is a worse outcome than a late one that didn't.

## Examples / Edge Cases

- **Platform API failure during Publish Execution:** requires retry/backoff logic — specified as a requirement for whatever tool is eventually chosen (§ Future Improvements), since no tool exists yet to implement it against.
- **A time-sensitive News video where QA approval risks missing the story's freshness window:** flagged as a real tension between review thoroughness and News's recency need — not resolved here; this is exactly the kind of case `09_QA/README.md` needs to address when it defines the review gate's scope and speed (OQ-004).
- **Founder wants to publish immediately, bypassing the schedule:** the engine must support a manual trigger alongside the scheduled queue — scheduling is a convenience, not the only path to publish.

## Failure Recovery

- **Publish API failure:** retry with backoff; escalate to a human after repeated failures rather than silently dropping the package.
- **QA rejects a package:** Automation holds/cancels the scheduled publish and routes it back to whichever engine owns the rejected element (`05_Production`, `06_Marketing`, or `07_SEO`) — it does not attempt to fix the package itself.

## Output Format

```
- content_brief_id: <reference>
  publish_packages:
    - platform: youtube | youtube_shorts | instagram_reels | tiktok | telegram
      asset_ref: <05_Production / 06_Marketing artifact reference>
      metadata_ref: <07_SEO artifact reference>
      scheduled_time: <target publish time>
      qa_status: pending | approved | rejected
      publish_status: queued | published | failed
```

## Self-Review Checklist

- [ ] Every package held for QA sign-off before publish (D-016).
- [ ] Scheduled times respect platform cadence targets where defined, or are explicitly manual pending OQ-005.
- [ ] Publish failures are logged and retried/escalated, never silently dropped.

## KPIs

- Publish success rate.
- Schedule adherence (once cadence targets exist to measure against).
- Time from QA approval to live publish — should approach zero once this engine is actually automated rather than manual.

## Future Improvements

- Tool selection and wiring (n8n or otherwise) once `OPEN_QUESTIONS.md` OQ-001 and OQ-003 resolve.
- Retry/backoff logic for platform API failures, specified here but implementable only once a tool is chosen.
- The command-interface (`DECISIONS.md` D-009) eventually triggering this engine directly via `10_Orchestrator`, once that layer exists.

## Cross-references
- Pipeline stage definition: `01_Core/Architecture.md`
- QA-hold ordering decision: `DECISIONS.md` D-016
- Command-interface future goal: `DECISIONS.md` D-009
- Blocking open questions: `OPEN_QUESTIONS.md` OQ-001, OQ-003, OQ-005
- The review gate this engine depends on: `09_QA/README.md`
