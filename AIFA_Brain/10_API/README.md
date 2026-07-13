# 10_API

| Field | Value |
|---|---|
| **Title** | 10_API — README |
| **Created** | 2026-07-13 |
| **Updated** | 2026-07-13 |
| **Owner** | unassigned |
| **Status** | Active |
| **Version** | 1.0 |
| **Dependencies** | none |
| **Related Docs** | `../../Platform/docs/architecture/api-architecture.md`, `../../Platform/docs/adr/0006-api-style.md`, `../04_Research/API_Research/README.md` |
| **Tags** | `api, strategy, partners` |

## Purpose

Public-facing API **strategy** — how third-party integrators and partners are meant to consume AIFA Platform's API, versioning/deprecation policy for external consumers, partner-facing documentation planning. This is a business/product scope, distinct from `Platform/docs/architecture/api-architecture.md`, which documents the API's internal technical conventions (REST, error shapes, auth).

Currently structure-only. Platform's own ADR-0006 already commits to "REST/OpenAPI... usable like an API product, comparable to OpenRouter" as the technical foundation — this folder is where the actual go-to-market plan for that positioning (who are the first third-party integrators, what does a partner onboarding flow look like, what's the external versioning/deprecation policy ADR-0006 itself flags as still undecided) should be written.

## Update rules

- Distinguish "what the API technically does" (link to `Platform/docs/architecture/api-architecture.md`) from "how we go to market with it as a product" (this folder's actual content).
- A deprecation/versioning policy decided here should be reflected back as an ADR update in `Platform/docs/adr/0006-api-style.md`, which explicitly flags this as an open follow-up.

## Ownership

Unassigned.

## Relationships

- **`Platform/docs/architecture/api-architecture.md`** and **`Platform/docs/adr/0006-api-style.md`** — the technical foundation this folder's strategy builds on.
- **`04_Research/API_Research/`** — research into how comparable API products (OpenRouter, etc.) handle partner onboarding, versioning, and docs.
- **`11_Pricing/`** — API pricing for third-party/partner usage may differ from end-user pricing; cross-reference rather than duplicate.
