# Quality Standards (Technical/Deliverable)
**Document ID:** `System/Quality_Standards.md`
**Referenced by:** `09_QA/README.md`, `05_Production/README.md`

> **Not the same file as `01_Core/Quality_Standards.md`.** That file is the *editorial/content* quality bar (is the script honest, does the persona match, is the structure right) — the bar `09_QA/README.md` is built around. This file is the *technical/deliverable* quality bar: does the file itself meet spec and play back correctly. The two are independent axes; a video can pass one and fail the other.

## What this file checks

- **Export spec compliance** — matches `System/Production_Standards.md`'s defaults (resolution, frame rate, audio bitrate) or an explicitly justified deviation.
- **File integrity** — no corruption, no dropped frames, no audio/video desync.
- **Caption presence and sync** — captions exist (D-015) and are time-aligned to the spoken audio, not just present.
- **Cross-platform playback** — the exported file actually plays correctly on the target platform's player, not just locally.

## Relationship to 09_QA

`09_QA/README.md`'s Quality Standards Check (workflow step 5) runs `01_Core/Quality_Standards.md`'s editorial checklist. This file's technical checks are a separate, prerequisite pass — a file that fails technical QC shouldn't reach editorial QC at all, since editorial review of a desynced or corrupted file is wasted effort. In practice: technical check first, editorial check second.

## Cross-references
- Editorial quality bar (different file, different scope): `01_Core/Quality_Standards.md`
- Export spec defaults being checked against: `System/Production_Standards.md`
- Where this fits in the review sequence: `09_QA/README.md`
