---
name: domain-and-decisions
description: Maintain canonical product language and project decision records. Use when changing domain entities, Vietnamese business vocabulary, schemas, model names, accepted behavior, ADRs, documentation ownership, project context, or TODO/backlog status.
---

# Domain and decisions

1. Read the relevant entries in `CONTEXT.md` before changing domain language, model concepts, or canonical Vietnamese terms. Clarify ambiguity before changing code or schemas.
2. Use `docs/README.md` for documentation ownership and precedence:
   - accepted decisions control behavior;
   - schemas control data shape;
   - lower-precedence documents must be aligned;
   - mockups and review-stage knowledge do not create requirements.
3. Search `docs/DECISIONS.md` for both accepted and superseded entries. Only accepted decisions govern current behavior; preserve history rather than rewriting old decisions.
4. Add or update a decision when a product or technical choice is confirmed, including rationale and consequences. Use an ADR only when the decision is hard to reverse and has a material trade-off.
5. Update `CONTEXT.md` when canonical vocabulary or domain meaning changes.
6. Update `docs/PROJECT_CONTEXT.md` when users, scope, or risks change.
7. Update `TODO.md` when work is completed or newly discovered. Do not use TODO comments in production code as a substitute for the backlog.
8. Stop and report contradictions among accepted decisions, schemas, current implementation, and documentation.

Keep documentation edits proportional to the actual decision; do not rewrite unrelated history.
