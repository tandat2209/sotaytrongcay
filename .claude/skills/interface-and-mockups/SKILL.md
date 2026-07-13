---
name: interface-and-mockups
description: Design or implement mobile interfaces and mockups in this project. Use for React Native UI, visual styling, layout, components, responsive behavior, accessibility, screenshots, design reviews, or translating files under docs/design/mockups into code.
---

# Interface and mockups

1. Load `product-and-mobile-ux` for the affected screen so interaction behavior is settled before visual implementation.
2. Read the relevant principles and component guidance in `docs/design/DESIGN.md`.
3. Before using any mockup, read `docs/design/SCREEN_REVIEW.md`. Mockups are visual references, not runtime requirements; ignore elements the review marks obsolete, unsafe, or unsupported.
4. Inspect existing components and tokens before adding variants. Reuse deliberately, but do not force unrelated screens into one abstraction.
5. Design mobile-first for thumb reach, readable hierarchy, adequate touch targets, screen-reader semantics, dynamic text, and clear loading/error/disabled feedback.
6. Keep Vietnamese UI copy aligned with the UX specification and canonical domain vocabulary.
7. Do not infer automation, tracked state, sensor data, care recommendations, plant photo, health, lifecycle progress, stage age, or product capabilities from a visual artifact.
8. No global FAB. Plant Detail may use one local plant-scoped floating action menu for watering, fertilizing, spraying, and “Thêm nhật ký”. It opens the selected entry flow, never saves directly, and respects reduced-motion preferences. Care-card info actions may open the existing native, scrollable read-only bottom sheet with activity-specific Vietnamese accessibility labels.
9. On Plant Detail, present the latest derived persisted journal photo as a rounded identity hero with a bottom contrast gradient, overlaid plant name and species, and a full-image viewer. Use a compact leaf fallback when no photo exists. Keep the stage title in the lifecycle journey rather than repeating it in the hero or objective card.
10. Render Plant Detail’s “Nhật ký gần đây” as a compact, occurrence-time-ordered mix of Care Activities and Plant Updates, using the matching activity visual or first update photo/note icon and routing each type to its own detail screen.
11. If `docs/design/DESIGN.md` and `docs/MOBILE_UX_DESIGN.md` disagree on order or behavior, stop and report the conflict rather than silently following the mockup.

Load `verification-and-handoff` before completion.
