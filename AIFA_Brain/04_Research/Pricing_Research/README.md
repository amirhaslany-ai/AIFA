# Pricing_Research

| Field | Value |
|---|---|
| **Title** | Pricing_Research — README |
| **Created** | 2026-07-13 |
| **Updated** | 2026-07-18 |
| **Owner** | unassigned |
| **Status** | Active |
| **Version** | 1.1 |
| **Dependencies** | none |
| **Related Docs** | `../README.md`, `../../11_Pricing/README.md`, `TEMPLATE_Pricing_Research.md`, [`Provider_Pricing_Audit/00_Summary.md`](Provider_Pricing_Audit/00_Summary.md) |
| **Tags** | `research, pricing` |

## Purpose

What comparable products (OpenRouter, Poe, and others) **charge AIFA's own customers** — per-token, subscription, credits, and why — the market-grounding input to `../../11_Pricing/`'s real decision. Use `TEMPLATE_Pricing_Research.md` for new studies of this kind.

**This is demand-side (competitor/customer-facing) pricing research, distinct from supply-side (upstream vendor/provider) cost research.** What OpenAI, Anthropic, Google, and AIFA's other AI suppliers charge *AIFA* is a different research question, governed by `Platform/docs/adr/0025-pricing-source-of-truth.md` and living primarily in `Platform/docs/pricing/`. The one exception, added 2026-07-18: [`Provider_Pricing_Audit/`](Provider_Pricing_Audit/00_Summary.md) preserves the raw research/verification/ingestion-plan artifacts from that supplier-cost audit as AIFA_Brain's durable knowledge-layer record — see that subfolder's summary for why it lives here rather than purely in `Platform/`, and for the reconciled staging package it feeds.

## Update rules

Competitor pricing changes without notice — treat this as needing periodic refresh, not a one-time study.

## Ownership

Unassigned.

## Relationships

Directly feeds `../../11_Pricing/`. Overlaps with `../../05_Competitors/` (each competitor profile there may reference its own pricing model; this folder is where cross-competitor pricing *patterns* get synthesized).

**`Provider_Pricing_Audit/`** — the supplier-cost exception described above. Its production-facing counterpart is `../../../Platform/docs/pricing/` (machine-readable datasets, governed by ADR-0025); this folder holds the raw audit trail, not a competing source of truth.
