---
name: product-and-mobile-ux
description: Apply product scope and mobile interaction rules for So Tay Trong Cay. Use when changing screens, navigation, care entry, Today, Plant Detail, Journal, reminders, stage playbooks, Vietnamese UI copy, MVP scope, user assumptions, or product risks.
---

# Product and mobile UX

1. Read the relevant sections of `docs/PROJECT_CONTEXT.md` for users, scope, risks, MVP capabilities, and out-of-scope work.
2. Read the affected screen or flow in `docs/MOBILE_UX_DESIGN.md` for interaction behavior and literal Vietnamese copy.
3. Check accepted entries in `docs/DECISIONS.md` when behavior may have been confirmed or superseded. Accepted decisions override lower-precedence descriptions.
4. Keep assumptions separate from requirements. Ask or stop when an unresolved assumption would change the model or interaction.
5. Preserve fast contextual tracking for watering, fertilizing, and spraying. Prefill is not persistence; activity enters history only after explicit Save.
6. No global FAB. Plant Detail alone may use one plant-scoped floating action menu for watering, fertilizing, spraying, and “Thêm nhật ký”. Each choice opens its entry flow and never saves directly.
7. Keep pruning, observations, and stage changes in the journal model. Plant Detail’s “Nhật ký gần đây” interleaves saved Care Activities and Plant Updates without treating updates as dedicated care activities. Stage tips/playbooks and care-recommendation detail sheets remain read-only and use approved knowledge only.
8. Never infer plant photo, health, lifecycle completion, progress, or days in stage. Require persisted source contracts. Plant Detail may present its latest derived persisted journal photo as the identity hero; the lifecycle journey remains its single visible current-stage identifier. Its age pill uses only persisted `stageStartedAt` and user-provided `plantedAt`, omits unavailable values, and keeps those meanings distinct.
9. Consider loading, empty, error, offline, and invalid-data behavior without inventing unsupported data or advice.
10. Update `docs/PROJECT_CONTEXT.md` only when users, scope, or risks actually change; update `docs/MOBILE_UX_DESIGN.md` when confirmed interaction behavior changes.

If UX and visual-design documents conflict, do not select a behavior from aesthetic preference. Surface the conflict and resolve it against accepted decisions and product scope.
