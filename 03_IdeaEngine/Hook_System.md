# Hook System
**Document ID:** `03_IdeaEngine/Hook_System.md`
**Referenced by:** `03_IdeaEngine/README.md` (Knowledge Base, Workflows step 6)

> Idea Engine selects a **hook direction** (which lever, and why it fits this brief). `04_ScriptEngine`'s own Hook Generation step (`DECISIONS.md` D-005) then writes the actual hook line. This file owns the direction/type library; it does not write hook copy — that division of labor keeps this file and `04_ScriptEngine` from duplicating each other.

## Hook direction types

| Type | Built on (`Viral_Psychology.md`) | Best fit |
|---|---|---|
| **Curiosity Gap** | Curiosity gap | News (a development with a non-obvious implication), Tool Review (a feature that does something unexpected) |
| **Bold/Contrarian Claim** | Contrarian / expectation-violation | News and Tool Review, only when the facts genuinely support pushing back on a common assumption |
| **Relatable Problem** | Stakes/relevance | Course and Tips — opens on the exact frustration the content resolves |
| **Direct Value Promise** | Specificity | Tips (a fast, specific win) and Course (a specific, named capability the viewer will have by the end) |
| **Pattern Interrupt (visual/verbal)** | Pattern interrupt | Any category, used when the brief's angle itself isn't strong enough to carry the first seconds alone — a structural aid, not a substitute for a real angle |

## Selection rule

Pick the type that most honestly matches the brief's angle (`README.md` Decision Rules — hook direction must be earned by the facts). If more than one type fits, prefer the type with the strongest factual specificity available, since specificity is both more engaging and easier to keep honest (`Viral_Psychology.md`).

## What Idea Engine hands off vs. what Script Engine does

Idea Engine's output for this field (`README.md` § Output Format) is: `hook_direction: <type> + <one-line rationale>` — e.g. `hook_direction: Relatable Problem — viewers hitting this exact API rate-limit error is a common, searchable pain point`. It is explicitly **not** a written hook line ("Ever hit this error and had no idea why?"). Writing that line, testing it against the 5–8 second window, and fitting it to Shima's actual voice is `04_ScriptEngine`'s Hook Generation step — see that engine's README once written.

## Category defaults (starting point, not a rigid rule)

- **News:** Curiosity Gap or Bold/Contrarian Claim
- **Course:** Relatable Problem or Direct Value Promise
- **Tool Review:** Curiosity Gap or Bold/Contrarian Claim (on a specific feature/claim, not the tool generically)
- **Tips:** Direct Value Promise

## Cross-references
- Underlying psychological principles: `Viral_Psychology.md`
- Hard requirement that hooks land in the first 5–8 seconds: `01_Core/Quality_Standards.md`
- Where the actual hook line gets written: `04_ScriptEngine` (Hook Generation step, `DECISIONS.md` D-005)
