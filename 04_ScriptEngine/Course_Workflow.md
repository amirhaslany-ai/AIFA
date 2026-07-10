# Course / Education Script Workflow
**Document ID:** `04_ScriptEngine/Course_Workflow.md`
**Owning decision:** `DECISIONS.md` D-005 (Locked)
**Referenced by:** `04_ScriptEngine/README.md` (Workflows step 5)

> Applies the universal 9-step process in `README.md` to Course/Education briefs. This file owns the structural template only.

## Structural template

**Skill Tree → Prerequisites → Lessons → Exercises → Quiz → Summary → CTA**

| Section | Job | Notes |
|---|---|---|
| **Skill Tree** | State what the viewer will be able to do by the end, and how it breaks into ordered sub-skills | Comes largely pre-structured from `02_Research/Workflows.md`'s Course workflow (Skill-Tree Fact Extraction step) — Script Engine's job is to present it clearly, not re-derive it from scratch |
| **Prerequisites** | What the viewer needs to already know/have set up | Also sourced from Research's Prerequisite Mapping step; stated upfront so viewers can self-select out early rather than getting lost mid-video |
| **Lessons** | The actual teaching, broken into the ordered sub-skills from the Skill Tree | Each sub-skill gets its own clearly delineated segment — this is where Audience Analysis (README.md step 3) matters most: over-explaining a step the target viewer already knows breaks pacing |
| **Exercises** | A concrete task the viewer can do to practice | Must be feasible within the video's time/format — if Research/Extract Facts surfaces an exercise that isn't feasible, see `README.md` § Examples/Edge Cases (escalate to rescope, don't cram or drop silently) |
| **Quiz** | A short self-check, not a graded test | Confirms the core skill landed; 2–4 questions is typical, not exhaustive coverage |
| **Summary** | Restate what was covered and why it matters | Short — this is reinforcement, not a new section introducing new information |
| **CTA** | Single ask | Typically: try the exercise, or move to the next course in a sequence if one exists |

## Category-specific notes

- **Ordering is load-bearing.** Unlike News or Tips, a Course script's sections have hard dependencies (Prerequisites before Lessons, Lessons before Exercises) — the Outline step (README.md step 5) should treat reordering as a structural error, not a stylistic choice.
- **Accuracy verification carries forward from Research.** `02_Research/Workflows.md`'s Course workflow flags accuracy verification as a step because tool UIs/behaviors drift; if Script Engine is writing a Lessons segment and something in the sourced material looks like it might be stale, that's a Failure Recovery case (README.md), not something to paper over with vague language.
- **Multi-video courses:** if a Skill Tree is too large for one video (per the Examples/Edge Cases note in `README.md`), the split into a mini-series is an Idea Engine rescoping decision, not something Script Engine decides unilaterally.

## Cross-references
- Owning decision: `DECISIONS.md` D-005
- Universal process this structure plugs into: `README.md` § Workflows
- Upstream research shape feeding this structure: `02_Research/Workflows.md` § Course/Education
