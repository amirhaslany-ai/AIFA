# Tool Review Script Workflow
**Document ID:** `04_ScriptEngine/ToolReview_Workflow.md`
**Owning decision:** `DECISIONS.md` D-005 (Locked)
**Referenced by:** `04_ScriptEngine/README.md` (Workflows step 5)

> Applies the universal 9-step process in `README.md` to Tool Review briefs. This file owns the structural template only.

## Structural template

**Problem → Tool → Features → Demo → Comparison → Pricing → Alternatives → Conclusion**

| Section | Job | Notes |
|---|---|---|
| **Problem** | The real problem/pain point the tool addresses, stated before the tool is even named | Anchors the whole review in viewer relevance (`01_Core/Vision.md` — not affiliate-marketing-as-education); this section should work even if the viewer forgets the tool's name afterward |
| **Tool** | What it is, in plain terms | Brief — this is orientation, not the review itself |
| **Features** | The specific capabilities relevant to the stated Problem | Only features that matter to the problem — an exhaustive feature dump is not the goal |
| **Demo** | Show it actually doing the thing | If Research's Claim Verification step (`02_Research/Workflows.md`) flagged a vendor claim as unverified, the Demo section is where that gets tested on-screen, not asserted |
| **Comparison** | How it stacks up against the 2–4 comparable tools identified in Research | Concrete, not vague ("faster than X for Y use case," not "better than the competition") |
| **Pricing** | Actual current pricing, sourced from the vendor's pricing page (Tier 1 per `02_Research/Source_Reliability.md`) | State clearly if pricing is likely to change or has tiers/limits that matter to the Problem framing |
| **Alternatives** | Honest mention of when a viewer should pick a different tool instead | This section is what separates an honest review from a sales script (`01_Core/Vision.md`'s differentiation thesis) — it must exist even when the tool being reviewed is genuinely good |
| **Conclusion** | Direct verdict tied back to the original Problem | Not a hedge — if the facts support a clear recommendation (or non-recommendation), say so |

## Category-specific notes

- **Unverified vendor claims are a required disclosure, not an optional caveat.** If `02_Research`'s Claim Verification step flagged a feature claim as vendor-only/unconfirmed and it wasn't resolved by hands-on testing in the Demo section, the script must say so explicitly rather than silently presenting it as confirmed fact.
- **A demo that contradicts a vendor claim is the story, not a problem to route around.** Per `README.md` § Examples/Edge Cases, this becomes the actual editorial angle — reported plainly.
- **Pricing has the shortest shelf-life of any fact in this category.** If a script sits between writing and publish for a while, a pricing re-check before Production is warranted — flag this in the `revision_log` if pricing was time-sensitive.

## Cross-references
- Owning decision: `DECISIONS.md` D-005
- Universal process this structure plugs into: `README.md` § Workflows
- Upstream research shape feeding this structure: `02_Research/Workflows.md` § Tool Review
