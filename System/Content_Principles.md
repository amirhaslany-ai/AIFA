# Content Principles
**Document ID:** `System/Content_Principles.md`
**Referenced by:** `02_Research/README.md`, `03_IdeaEngine/README.md`, `09_QA/README.md`

> Distinct from `01_Core/Vision.md` (why the channel exists) and `01_Core/Quality_Standards.md` (the pass/fail bar): this file is editorial *policy* — what happens in specific situations that aren't simple pass/fail checks. Where a rule already exists elsewhere (source-facts-not-voice, vendor-claim labeling), this file links to it rather than restating it.

## Editorial independence

No content decision — topic selection, angle, tool recommendation, comparison outcome — is influenced by a vendor relationship, sponsorship, or affiliate arrangement. `02_Research/README.md`'s Decision Rules already require vendor claims to be labeled as vendor claims rather than independent facts; this principle extends that further: even a favorable, accurate vendor claim doesn't earn favorable editorial treatment it hasn't independently earned. If a sponsorship or paid-placement relationship is ever entered into, it requires explicit on-screen/in-description disclosure — no exceptions, and this itself would be a founder-level decision requiring a new `DECISIONS.md` entry before it could happen.

## Correction policy

When a factual error is found in published content:
1. The error and its correction are logged (where — `Knowledge/`, per that folder's role as accumulated content history — see `Knowledge/README.md`).
2. A visible correction is made where the platform allows it (pinned comment, description edit, or a follow-up mention in a later relevant video) — corrections are not silently made and left unacknowledged.
3. The root cause is traced back through the pipeline (a `02_Research` sourcing gap? a `04_ScriptEngine` fact-extraction error? a `09_QA` traceability-check miss?) so the relevant engine's process can improve — this directly feeds each engine's own KPIs around post-publish correction rate.

This policy exists because the honesty positioning in `01_Core/Vision.md` only holds up if errors are handled transparently, not because errors are expected to be common.

## Handling controversial or sensitive AI topics

Topics like job displacement, safety incidents, or contentious research claims get extra scrutiny at the `09_QA` gate (already noted as an edge case in `03_IdeaEngine/README.md`), specifically checked against two failure modes:
- **Alarmism** — overstating risk/impact beyond what the sourced facts support.
- **Dismissiveness** — understating genuine concern to avoid discomfort or to stay "positive."

Neither is acceptable; the standard is the same honest-voice mandate applied to every other category, not a special softer or harder tone for sensitive topics.

## Cross-references
- Source-facts-not-voice, vendor-claim labeling: `DECISIONS.md` D-004, `02_Research/README.md` § Decision Rules
- Honest-voice differentiation thesis: `01_Core/Vision.md`
- Controversial-topic flagging origin: `03_IdeaEngine/README.md` § Examples/Edge Cases
- Where correction history is tracked: `Knowledge/README.md`
