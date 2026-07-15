---
name: engineering-implementation
description: Implement or refactor production code in this Expo/React Native TypeScript project. Use for every code change, feature slice, bug fix, data-layer change, synchronization change, or test implementation so scope, strict typing, component boundaries, reuse, and project engineering standards are applied before editing.
---

# Engineering implementation

1. Inspect `git status` and the affected feature before editing. Preserve unrelated and pre-existing work.
2. Read only the relevant sections of `docs/ENGINEERING_STANDARDS.md`. For cross-feature or structural changes, also load the `technical-architecture` skill.
3. Identify the product outcome and owning feature. Build one complete, testable vertical slice rather than scattering partial infrastructure.
4. Follow existing project patterns before introducing helpers or dependencies. Resolve application-owned user-facing copy through `src/shared/i18n`; keep Knowledge Base content and user data outside the UI catalog.
5. Keep TypeScript strict: never use `any`, avoid unsafe assertions, validate external data at boundaries, and model invalid states explicitly.
6. Keep route files thin and components below 200 lines. Extract cohesive behavior through composition, not arbitrary fragmentation.
7. Do not add placeholders, TODO comments, fake services, mock production behavior, speculative abstractions, or unrelated cleanup.
8. Explain architectural choices that affect ownership, boundaries, persistence, synchronization, or future change cost.
9. Add or update relevant tests with the implementation. Load `verification-and-handoff` before declaring the task complete.

When documentation and implementation disagree, stop and surface the conflict. Do not silently choose a new product requirement.
