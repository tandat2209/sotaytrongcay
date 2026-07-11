# Grape Knowledge Pilot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver one sourced, review-ready grape Knowledge Base slice for the “Nuôi thân” stage and document how every current mockup depends on curated knowledge.

**Architecture:** Author Vietnamese user content as Markdown with stable IDs and structured frontmatter. Validate parsed documents against JSON Schema, then compile approved content through the future `KnowledgeRepository`; keep all pilot content in `review` until expert approval.

**Tech Stack:** Markdown, YAML frontmatter, JSON Schema Draft 2020-12, Git, future TypeScript/Zod compiler.

---

### Task 1: Review screen-to-knowledge coverage

**Files:**
- Create: `docs/design/SCREEN_REVIEW.md`
- Modify: `docs/design/DESIGN.md`
- Modify: `docs/README.md`

- [ ] Review references 01–14 against the product and UX specifications.
- [ ] Record each screen's Knowledge Base dependency and implementation blockers.
- [ ] Mark unsupported sensor readings, dosage, product, timing, and task behavior as non-authoritative.
- [ ] Link the review from the design and documentation indexes.

### Task 2: Define the pilot content contract

**Files:**
- Create: `knowledge/README.md`
- Create: `knowledge/_schemas/species.schema.json`
- Create: `knowledge/_schemas/stage-playbook.schema.json`
- Create: `knowledge/_schemas/care-recommendation.schema.json`
- Create: `knowledge/_schemas/reference.schema.json`

- [ ] Define stable IDs, review states, locale, versions, references, and relationship fields.
- [ ] Restrict care recommendations to `watering`, `fertilizing`, and `spraying`.
- [ ] Document that only `approved` content enters the production mobile bundle.
- [ ] Document the Markdown → validation → generated JSON → `KnowledgeRepository` pipeline.

### Task 3: Author the sourced “Nuôi thân” slice

**Files:**
- Create: `knowledge/species/grape/species.md`
- Create: `knowledge/species/grape/stages/trunk-development.md`
- Create: `knowledge/species/grape/care-recommendations/check-soil-before-watering.md`
- Create: `knowledge/species/grape/guides/train-main-shoot.md`
- Create: `knowledge/references/ref-osu-growing-table-grapes.md`
- Create: `knowledge/references/ref-uc-ipm-young-grape-pruning.md`
- Create: `knowledge/references/ref-umn-growing-grapes-home-garden.md`

- [ ] Define the grape identity and full canonical stage journey.
- [ ] Mark only “Nuôi thân” as having a pilot playbook.
- [ ] Write concise Vietnamese goal, tips, avoid guidance, warning signs, and observable completion criteria.
- [ ] Add one bounded watering recommendation that asks the user to assess soil instead of prescribing a fixed amount.
- [ ] Add a non-trackable main-shoot training guide.
- [ ] Attach extension references to every agronomic document.
- [ ] Keep documents in `review` until expert approval.

### Task 4: Maintain project context and verify

**Files:**
- Modify: `TODO.md`
- Modify: `CONTEXT.md` only if a canonical business term changes

- [ ] Record the completed pilot and outstanding expert review.
- [ ] Verify JSON syntax with `python -m json.tool` or an equivalent parser.
- [ ] Check Markdown whitespace with `git diff --check`.
- [ ] Search for broken local Knowledge Base IDs and unsupported `approved` content.
- [ ] Confirm application compilation separately; do not modify unrelated Expo bootstrap files.
