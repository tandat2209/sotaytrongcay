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
7. Do not infer automation, tracked state, sensor data, care recommendations, or product capabilities from a visual artifact.
8. If `docs/design/DESIGN.md` and `docs/MOBILE_UX_DESIGN.md` disagree on order or behavior, stop and report the conflict rather than silently following the mockup.

Load `verification-and-handoff` before completion.
