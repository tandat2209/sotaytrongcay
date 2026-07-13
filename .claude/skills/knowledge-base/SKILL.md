---
name: knowledge-base
description: Work on curated plant knowledge, schemas, relationships, compiler/validator scripts, generated mobile bundles, or care recommendations. Use for any file under knowledge/, scripts/knowledge/, or knowledge-facing feature code so review status, stable IDs, validation, deterministic output, and agronomic safety are preserved.
---

# Knowledge base

1. Read the relevant sections of `docs/KNOWLEDGE_BASE_ARCHITECTURE.md` and the current-state rules in `knowledge/README.md`.
2. Inspect the affected schema under `knowledge/_schemas/` before changing authored content, compiler types, serialization, or consumers. Schemas own field shape.
3. Check accepted decisions in `docs/DECISIONS.md`; review-stage documents and preview bundles cannot establish runtime behavior.
4. Preserve stable IDs, explicit versions, source/reviewer metadata, review and approval states, relationship validity, and deterministic compilation.
5. Keep curated knowledge separate from user/runtime data. Do not turn informational playbooks into reminders, task completion, care history, or automatic stage changes.
6. Never present unsupported products, dosages, diagnoses, sensor readings, or advice as fact. Production compilation must exclude content that is not approved for production use.
7. Update authored source and compiler/schema contracts together when the data model changes. Regenerate only the intentional bundle targets; never hand-edit generated bundles.
8. Keep tracked watering, fertilizing, and spraying guidance in `care_plan`. Keep `care_guide` for generic informational techniques that do not create tracked activities, recommendations, reminders, or history.
9. Run the relevant knowledge commands from `verification-and-handoff`, including production checks for changes that can affect shipped content.

Stop if schema, accepted decision, authored content, and consumer expectations disagree; resolve the authority conflict instead of normalizing it away.
