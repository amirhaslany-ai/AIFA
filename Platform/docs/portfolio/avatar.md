# Avatar AI

**Decision record:** [`../adr/0023-avatar-category.md`](../adr/0023-avatar-category.md) (authoritative — this doc is for navigation only).

**Avatar AI is a separate top-level capability, not a subordinate Video mode** (ADR-0023).

## Providers

| Provider | Classification | Routing intent (product strategy, not a technical guarantee) | Provider doc |
|---|---|---|---|
| HeyGen | UNVERIFIED | Conventional avatars, digital twins, translation, lip sync, presenter content, many UGC workflows | [`heygen.md`](../providers/heygen.md) |
| Tavus | UNVERIFIED | Personalized video, conversational AI humans, video agents, sales agents, customer agents, interactive video experiences | [`tavus.md`](../providers/tavus.md) |
| Hedra | RESERVE | — | — |
| Synthesia | RESERVE | — | — |
| D-ID | RESERVE | — | — |

UGC generation may use the Smart Router (`../architecture/smart-routing.md`) rather than exposing HeyGen/Tavus directly.

## Use cases in scope

AI Avatar · Digital Twin · Personalized Video · AI Presenter · AI Sales Agent · AI Customer Agent · Video Translation · Lip Sync · UGC Video · Conversational AI Human.
