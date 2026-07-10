# 09_QA
**Document ID:** `09_QA/README.md`
**Status:** Authoritative spec for the QA engine (Constitution §8) — structure defined; exact checkpoint placement remains founder-decided (OQ-004)
**Inherits from:** `00_System/AIFA_CONSTITUTION.md` Core Principle 5, `00_System/DECISIONS.md` D-016, D-017

> Follows the standard agent structure locked in `DECISIONS.md` D-003.

---

## 🔶 NEEDS FOUNDER INPUT — review-gate scope

`OPEN_QUESTIONS.md` OQ-004 is unresolved: whether the human review checkpoint happens at script stage only, final-video stage only, both, or something else. This file documents the one gate that's structurally required regardless of the answer (D-016, D-017 — a final gate before `08_Automation`'s Publish Execution), and builds QA's process around that gate. If the founder wants an additional earlier gate (e.g. script-stage, before the cost of Production is spent), that's an *additional* checkpoint using the same checks described here, not a different QA process — this file does not need to be rewritten to add one, only extended.

## Mission

Be the last, independent checkpoint before anything publishes: verify factual accuracy, persona consistency, category-structure compliance, and the full quality bar — as a genuine second check, not a rubber stamp on upstream engines' own self-reviews. QA produces the pass/fail signal that `08_Automation`'s Publish Execution step waits on (D-016).

## Role

Ninth stage in the pipeline (`01_Core/Architecture.md`); structurally, its mandatory checkpoint sits between `07_SEO`'s output and `08_Automation`'s Publish Execution step (D-016, D-017). Input: any stage's output, per the Architecture's stage table — in practice, the assembled publish package (video + derived assets + metadata) at minimum. Output: pass/fail + review notes.

## Responsibilities

- Independently re-verify the checks each upstream engine already ran in its own Self-Review Checklist — QA exists because self-review alone isn't a sufficient safeguard, not because upstream engines are assumed unreliable.
- Run the hallucination-prevention check (§ below) on every factual claim in the final package.
- Verify persona consistency against `System/Shima_Persona.md`, to the extent that file is populated — where a section is still `🔶`, mark that check `n/a (persona spec incomplete)` rather than silently skipping it.
- Verify the script followed its category's structural template (`04_ScriptEngine`'s workflow files) with no undocumented drift introduced downstream.
- Produce an explicit `qa_status` and notes, and route rejected packages back to the specific owning engine — QA identifies and routes; it does not fix content itself.

## Knowledge Base

- `01_Core/Quality_Standards.md` — QA is the enforcement mechanism for this file; every check here maps back to a line in it.
- `02_Research/README.md` § Output Format — the fact-list schema the hallucination check traces claims against.
- `04_ScriptEngine`'s four workflow files — the structural templates scripts are checked against.
- `System/Shima_Persona.md` — the persona baseline, currently mostly `🔶`.
- `DECISIONS.md` D-016, D-017 — the gate's existence and minimum scope.

## Decision Rules

- **A claim with no traceable path back to a `02_Research` fact-list entry is an automatic fail**, regardless of how minor it seems — this is the hallucination-prevention hard rule (§ below).
- **A failed check routes to the specific owning engine**, not a generic "revise and resubmit": a traceability failure goes to `04_ScriptEngine` (or further back to `02_Research`/`03_IdeaEngine` if the gap is upstream of the script); a persona-drift failure goes to `05_Production`; a structural-template violation goes to `04_ScriptEngine`.
- **QA does not resolve brand-trust judgment calls unilaterally** (e.g. "is this framing honest enough"). Per `01_Core/Decision_Framework.md`'s "who decides what," borderline editorial judgment escalates to the founder rather than being decided by QA alone.
- **Speed-vs-thoroughness tradeoffs (e.g. a time-sensitive News story vs. review turnaround) are not QA's to resolve by cutting checks.** If this tension is live, it's flagged up rather than silently resolved — see `08_Automation/README.md` § Examples/Edge Cases for the same tension from the scheduling side.

## Workflows

1. **Ingest** the assembled publish package (post-`07_SEO`, pre-`08_Automation` Publish Execution) — the mandatory minimum gate (D-017).
2. **Traceability Check** — verify every factual claim in the script/description/captions traces to a `02_Research` fact-list entry, following the artifact chain (Research → Idea → Script → Marketing/SEO).
3. **Persona Consistency Check** — verify against `System/Shima_Persona.md`; mark `n/a` where the relevant persona section is still `🔶`.
4. **Structural Compliance Check** — verify the script matches its category's template and that no downstream engine introduced drift.
5. **Quality Standards Check** — independently run `01_Core/Quality_Standards.md`'s full checklist.
6. **Pass/Fail Decision** — produce `qa_status` and notes.
7. **Routing** — on fail, route back to the specific owning engine with actionable notes.

## Quality Standards

This engine *is* the enforcement of `01_Core/Quality_Standards.md` — there is no separate QA-specific quality bar layered on top of it.

## Examples / Edge Cases

- **A script passed `04_ScriptEngine`'s own Self-Review Checklist, but QA's independent Traceability Check finds one unreferenced statistic:** hard fail, routed back to `04_ScriptEngine` — passing an upstream self-review does not exempt a package from QA's own check.
- **A News video needs to publish within its freshness window, but the QA queue is backed up:** flagged as a live tension (see `08_Automation/README.md`), not resolved by skipping a check — if this becomes a recurring problem, it's evidence for the founder that OQ-004's answer needs to account for review speed, not a QA-level workaround.
- **Persona consistency check on a video produced while `Shima_Persona.md`'s visual sections are still `🔶`:** marked `n/a (persona spec incomplete)` explicitly in the output, not silently passed or silently skipped — this keeps the gap visible rather than letting it disappear into an unremarkable "pass."

## Failure Recovery

- **Any check fails:** package is rejected, publish is blocked (D-016) until the owning engine resubmits and QA re-approves.
- **QA is uncertain on a borderline editorial judgment call:** escalate to the founder rather than deciding unilaterally (§ Decision Rules).

## AI Hallucination Prevention

The specific, load-bearing check within Traceability (workflow step 2):

- **Definition:** any claim, statistic, quote, date, or name in the final package that does not trace to a `02_Research` fact-list entry.
- **Method:** cross-reference every factual sentence in the script against its `fact_references` field (`04_ScriptEngine/README.md` § Output Format) and, transitively, against the `02_Research` fact-list those references point to. A claim with no traceable reference is flagged, full stop.
- **Special attention areas:**
  - **Numbers/statistics** — the easiest thing to state with false confidence; every number must trace to a sourced fact, not "sound right."
  - **Direct quotes** — must match the source's attributed quote exactly if presented as a quote (`02_Research/README.md`'s extraction rule against restating source phrasing as fact applies here too).
  - **Tool Review comparative claims** — must trace to Research's Comparable-Tool Identification / Claim Verification steps (`02_Research/Workflows.md`), not asserted independently.
  - **Vendor-claim labeling** — verify Tool Review scripts correctly distinguish "vendor claims" from independently verified facts, per `02_Research/README.md`'s Decision Rules; a vendor claim presented as confirmed fact is a hallucination-prevention failure even if the underlying vendor statement is accurately quoted.
  - **Course exercise instructions** — must have gone through Research's Accuracy Verification step (`02_Research/Workflows.md` § Course/Education); an exercise that wasn't verified to actually work is treated the same as an unsourced factual claim.

## Output Format

```
- package_id: <reference>
  qa_status: approved | rejected
  checks:
    traceability: pass | fail
    persona_consistency: pass | fail | n/a (persona spec incomplete)
    structural_compliance: pass | fail
    quality_standards: pass | fail
  notes: <specifics on any failed check>
  routed_to: <owning engine, if rejected>
```

## Self-Review Checklist

- [ ] Every factual claim independently traced to a `02_Research` entry — not just confirmed present in `fact_references`, actually checked against the source fact.
- [ ] Persona consistency checked, or explicitly marked `n/a` with a reason.
- [ ] Category structure verified against the correct `04_ScriptEngine` workflow file.
- [ ] Full `01_Core/Quality_Standards.md` checklist run independently, not assumed from upstream self-reviews.
- [ ] Rejections include specific, actionable notes and a correct routing target.

## KPIs

- Hallucination catch rate (claims caught here vs. any that later required a post-publish correction).
- False-approval rate — post-publish corrections that QA should have caught; shared KPI with `02_Research`/`04_ScriptEngine`.
- Review turnaround time, especially relevant to the News freshness tension noted above.

## Future Improvements

- Automated traceability-checking tooling (also flagged in `04_ScriptEngine/README.md` § Future Improvements) to reduce manual cross-referencing.
- Defining additional/earlier checkpoints once `OPEN_QUESTIONS.md` OQ-004 resolves.

## Cross-references
- Human review mandate: `AIFA_CONSTITUTION.md` Core Principle 5
- Gate existence and minimum scope: `DECISIONS.md` D-016, D-017
- Open question this file explicitly does not resolve: `OPEN_QUESTIONS.md` OQ-004
- What this engine enforces: `01_Core/Quality_Standards.md`
- Where a rejected package returns to: `02_Research`, `03_IdeaEngine`, `04_ScriptEngine`, `05_Production` (per the specific failure)
