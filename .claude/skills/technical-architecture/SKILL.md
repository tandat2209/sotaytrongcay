---
name: technical-architecture
description: Plan or change technical architecture in this repository. Use for cross-feature structure, public feature APIs, persistence, SQLite, Supabase, outbox synchronization, TanStack Query, state ownership, offline conflict handling, security boundaries, logging, or hard-to-reverse technical decisions.
---

# Technical architecture

1. Read only the relevant sections of `docs/TECHNICAL_ARCHITECTURE.md` and the implementation standards in `docs/ENGINEERING_STANDARDS.md`.
2. Inspect the current code and `TODO.md` before assuming the architecture document describes implemented behavior. It may describe a target state.
3. Preserve feature-first ownership, thin route boundaries, deliberate public interfaces, and separation among model, application, data, and UI concerns.
4. Keep server state, local persisted state, form state, and transient UI state with their intended owners. Do not add a global state layer without a demonstrated need. Static UI copy belongs to `src/shared/i18n`; add narrow root locale state only when runtime catalog selection exists.
5. Keep application UI messages separate from locale-aware Knowledge Base content and user-entered data. Models expose language-neutral facts instead of translated presentation strings.
6. Treat offline writes, outbox behavior, retries, conflicts, RLS, secrets, and logging as system boundaries that require explicit handling and tests.
7. Prefer deterministic, explainable guidance evaluation. Do not introduce AI or RAG where curated rules or validated data are required.
8. Explain the decision, alternatives considered, trade-offs, reversibility, and migration impact.
9. Create an ADR only for a hard-to-reverse decision with a real trade-off. Record an accepted product/behavior choice in `docs/DECISIONS.md` instead.

If current implementation, accepted decisions, and target architecture conflict, stop and report the mismatch before editing.
