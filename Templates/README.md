# Templates
**Document ID:** `Templates/README.md`
**Referenced by:** `04_ScriptEngine`'s workflow files, `06_Marketing/Platform_Derivation.md`, `07_SEO/README.md`

> Distinct from `Prompts/` (reusable instruction wording) and each engine's workflow files (the rules that define a structure): this folder holds the actual fillable skeletons — the structure applied, ready to be populated per piece of content.

## Purpose

Give each recurring output format a ready-to-fill skeleton so structure doesn't get reconstructed from the workflow description every single time.

## What belongs here

- **Script templates**, one per category, mirroring `04_ScriptEngine`'s four structural templates exactly: News (Hook → What Happened → Why It Matters → Nuance/What's Next → CTA), Course (Skill Tree → Prerequisites → Lessons → Exercises → Quiz → Summary → CTA), Tool Review (Problem → Tool → Features → Demo → Comparison → Pricing → Alternatives → Conclusion), Tips (Hook → Problem/Context → The Tip → Quick Proof/Demo → CTA).
- **Caption templates per platform**, matching `06_Marketing/Platform_Derivation.md`'s format specs (YouTube Shorts, Instagram Reels, TikTok, Telegram).
- **Chapter-marker template**, matching `07_SEO/README.md`'s chapter-generation output shape.
- **Thumbnail template** — `🔶` blocked pending `System/Brand_Guidelines.md`'s visual identity gaps, same as the thumbnail work itself (`07_SEO/README.md` § Thumbnails).

## Authority relationship

The owning engine's workflow file is always authoritative; a template here is an implementation of that structure, not an independent source of truth. If a template and its owning workflow file ever appear to disagree, the workflow file wins and the template needs updating — this mirrors `01_Core/Architecture.md`'s general pattern of engine READMEs being authoritative over any derived convenience file.

## Cross-references
- Script structures these templates implement: `04_ScriptEngine/News_Workflow.md`, `Course_Workflow.md`, `ToolReview_Workflow.md`, `Tips_Workflow.md`
- Platform caption formats: `06_Marketing/Platform_Derivation.md`
- Chapter output shape: `07_SEO/README.md` § Output Format
- Thumbnail template blocker: `System/Brand_Guidelines.md`
