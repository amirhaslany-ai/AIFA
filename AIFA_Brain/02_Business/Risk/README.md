# Risk

| Field | Value |
|---|---|
| **Title** | Risk — README |
| **Created** | 2026-07-13 |
| **Updated** | 2026-07-13 |
| **Owner** | unassigned |
| **Status** | Active |
| **Version** | 1.0 |
| **Dependencies** | none |
| **Related Docs** | `../README.md`, `../Legal/README.md`, `../../../Platform/FINAL_REVIEW/03_RISK_MATRIX.md`, `TEMPLATE_Risk_Register.md` |
| **Tags** | `risk, business` |

## Purpose

The **business** risk register — market risk, financial risk, legal/compliance risk, key-person risk, and similar. This is distinct from `Platform/FINAL_REVIEW/03_RISK_MATRIX.md`, which is Platform's own **technical** risk matrix (security, scalability, deployment, database risks specific to the codebase) — that document already exists and is current; this folder should link to it for technical risk rather than duplicate it, and hold everything else.

Currently structure-only; use `TEMPLATE_Risk_Register.md` for the first real register.

## Update rules

Each risk entry needs a likelihood, an impact, and a mitigation or an explicit "accepted, not mitigated" — an unranked list of worries is not a risk register. Revisit at least quarterly, or whenever a major decision changes the risk landscape (a new market entered, a new legal jurisdiction, a major partnership).

## Ownership

Unassigned.

## Relationships

- **`Platform/FINAL_REVIEW/03_RISK_MATRIX.md`** — Platform's technical risk matrix; this folder is the business-side complement, not a replacement.
- **`../Legal/`** — legal risk is a subset, linked not duplicated.
- **`../Financial_Planning/`** — financial risk feeds directly into the financial plan's assumptions.
