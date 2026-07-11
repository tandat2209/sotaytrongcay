# Knowledge Compiler and Bundled Repository Design

**Date:** 2026-07-11  
**Status:** Approved for implementation planning

## Purpose

Compile authored Markdown knowledge into a validated, deterministic offline artifact and expose it to the Expo application through a small read-only repository. This slice establishes the publishing boundary between editorial content and runtime guidance without integrating knowledge into Today or Plant Detail screens.

## Scope

### In scope

- Validate all currently authored knowledge document types.
- Add a JSON Schema for guides.
- Compile `vi-VN` content in explicit production and preview modes.
- Commit a deterministic production bundle at `knowledge/_generated/mobile-bundle.json`.
- Validate the generated bundle at the application boundary with Zod.
- Add `KnowledgeRepository` and `BundledKnowledgeRepository`.
- Add source validation, compiler integration, repository contract, and freshness tests.
- Add package commands for validation, compilation, preview compilation, and freshness checking.
- Resolve knowledge path drift in relevant documentation and update `TODO.md`.

### Out of scope

- Today or Plant Detail UI integration.
- SQLite or Supabase knowledge adapters.
- Knowledge synchronization or remote updates.
- Weather, care-history, or recommendation rule execution.
- RAG, embeddings, or AI-generated guidance.
- Disease, pest, fertilizer, or seasonal catalogs beyond authored pilot content.
- Editorial approval of the current pilot documents.

## Architecture

The implementation has a build-time authoring pipeline and a runtime repository boundary.

```text
knowledge/**/*.md
        |
        v
scripts/knowledge
  discover -> parse -> schema validate -> graph validate
           -> mode filter -> selected graph validate
           -> deterministic compile
        |
        v
knowledge/_generated/mobile-bundle.json
        |
        v
runtime Zod bundle validation
        |
        v
BundledKnowledgeRepository -> KnowledgeRepository
```

### Build-time compiler

Node-only code under `scripts/knowledge` owns file discovery, YAML/frontmatter parsing, JSON Schema validation, relationship validation, eligibility filtering, deterministic serialization, and atomic writes. No application source imports compiler code.

The compiler uses established libraries for:

- YAML/frontmatter parsing.
- JSON Schema Draft 2020-12 validation.

JSON Schema remains the authoring contract. The compiler must not replace the checked-in schemas with independently maintained Zod copies.

### Runtime model

`src/features/knowledge/model` owns:

- Stable knowledge ID types.
- Runtime bundle and document types.
- The complete Zod bundle schema.
- `KnowledgeRepository`.
- Normalized runtime bundle errors.

It has no knowledge of Markdown, YAML, source paths, JSON Schema, or compiler modes beyond the bundle metadata it validates.

### Runtime adapter

`src/features/knowledge/data` owns `BundledKnowledgeRepository`. It validates unknown constructor input once, builds immutable indexes, and performs synchronous in-memory reads without file or network I/O.

The feature exposes its supported public API only through `src/features/knowledge/index.ts`.

The production bundle is injected at an explicit application composition point. The adapter does not import the JSON artifact internally.

## Supported source documents

The first compiler supports every document type in the authored pilot:

- `plant_species`
- `growth_stage_playbook`
- `care_recommendation_definition`
- `guide`
- `reference_source`

A new guide JSON Schema is required before guides may compile. Discovery selects the schema from the declared `type`; expected directory placement is validated separately so misplaced documents fail clearly.

## Compilation modes

### Production

Production includes only documents that meet all of these conditions:

- `status` is `approved`.
- `locale` is `vi-VN`.
- The document and its required relationships pass validation.

The committed `knowledge/_generated/mobile-bundle.json` always declares production mode. Because the current pilot remains under review, the initial production bundle contains no agricultural guidance. The compiler must not weaken this rule to populate the app prematurely.

### Preview

Preview includes documents with `status` of `review` or `approved` and `locale` of `vi-VN`. It exists for development and editorial verification.

The standard preview command writes to a clearly named non-production location and cannot overwrite `mobile-bundle.json`. Draft, archived, and wrong-locale documents remain excluded.

## Compiler pipeline

The compiler performs these steps in order:

1. Discover supported Markdown files beneath `knowledge/`, excluding `_schemas` and `_generated`.
2. Parse YAML frontmatter and retain the Markdown body.
3. Validate each frontmatter object against the JSON Schema selected by `type`.
4. Normalize each document into the compiler's bundle record without altering stable IDs or user-facing content.
5. Validate the complete authored graph.
6. Select documents eligible for the requested compilation mode.
7. Validate the selected graph independently.
8. Sort all records and nested ordered relationships deterministically.
9. Validate the assembled bundle against the output contract.
10. Serialize deterministically and write atomically.

A failed parse, validation, or write preparation must leave the previous valid artifact unchanged.

### Complete graph validation

Validation of the authored graph includes:

- IDs are globally unique across all supported document types.
- Every relationship resolves to a document of the required type.
- Species stage IDs are unique and maintain explicit canonical order.
- Every non-terminal stage has a valid next stage.
- Terminal stages have no invalid successor.
- Stage availability agrees with authored playbook coverage: an unavailable registry entry need not have a playbook, while an available entry must resolve to one.
- Recommendation activity types are limited to `watering`, `fertilizing`, and `spraying`.
- Required recommendation reasons and source relationships are present.
- Required user-facing content is Vietnamese for an eligible `vi-VN` document.
- Safety or avoid guidance carries source relationships required by its document contract.
- Directory placement matches the declared content type.

Rule facts, operators, and effects are not validated in this slice because rule documents and execution are out of scope.

### Selected graph validation

After filtering, every relationship required by an included document must resolve to another included document. An included document depending on a missing or mode-ineligible document fails compilation. The compiler never drops such relationships with a warning and never emits unresolved relationship IDs.

This permits a preview document to reference another review document while preventing an approved production document from depending on review-only content.

## Bundle contract

The generated artifact contains:

- Bundle schema version.
- Knowledge content version.
- Compilation mode.
- Deterministically ordered arrays of species, stage playbooks, care recommendations, guides, and references.
- Authored Markdown bodies where required for presentation.
- Stable relationship IDs.

It excludes:

- Absolute or machine-specific paths.
- Build timestamps or other values that cause meaningless diffs.
- Draft, archived, unsupported-locale, or otherwise ineligible content.
- Runtime-resolved aggregate copies.
- User data.

Stable IDs remain language-neutral and unchanged. The bundle format version and knowledge content version are separate so format changes do not masquerade as editorial revisions.

## Repository contract

The initial interface is lookup-oriented rather than screen-specific:

```ts
interface KnowledgeRepository {
  listSpecies(): readonly KnowledgeSpecies[];
  getSpeciesById(id: PlantSpeciesId): KnowledgeSpecies | undefined;

  listStagePlaybooks(): readonly GrowthStagePlaybook[];
  getStagePlaybookById(
    id: GrowthStagePlaybookId,
  ): GrowthStagePlaybook | undefined;
  listStagePlaybooksBySpeciesId(
    speciesId: PlantSpeciesId,
  ): readonly GrowthStagePlaybook[];

  listCareRecommendations(): readonly CareRecommendation[];
  getCareRecommendationById(
    id: CareRecommendationId,
  ): CareRecommendation | undefined;

  listGuides(): readonly KnowledgeGuide[];
  getGuideById(id: KnowledgeGuideId): KnowledgeGuide | undefined;

  getReferenceById(id: ReferenceSourceId): ReferenceSource | undefined;
}
```

Final type names may be refined during implementation planning, but the behavior and surface area remain fixed:

- Lists are immutable and deterministically ordered.
- A missing singular lookup returns `undefined`.
- A valid query with no members returns an immutable empty array.
- Relationships remain stable IDs and are resolved through explicit repository calls.
- The interface exposes no source paths, raw frontmatter, compiler services, or unrestricted raw bundle accessor.
- Aggregate views for Today and Plant Detail remain a later application-layer concern.

`BundledKnowledgeRepository` accepts unknown input and validates the complete bundle with Zod before indexing it. Malformed or internally inconsistent input fails construction with a normalized bundle error. Valid lookup misses do not throw.

Returned collections and records must not permit callers to mutate repository state. The implementation may use readonly data, defensive copies, freezing, or an equivalent mechanism verified by contract tests.

## Diagnostics and errors

Compiler validation should collect independent failures where practical and report structured diagnostics containing:

- Stable diagnostic code.
- Repository-relative source path.
- Document ID when parsing reached it.
- Relevant field or relationship.
- Concise remediation message.

Diagnostic categories include:

- Markdown or frontmatter parsing failure.
- Unsupported document type.
- Schema mismatch.
- Unexpected directory placement.
- Duplicate ID.
- Missing or wrong-type relationship.
- Invalid stage chain.
- Unsupported activity type.
- Missing reason, required source, or Vietnamese content.
- Publication-ineligible dependency.
- Invalid bundle output.

Compilation exits nonzero on errors and does not rewrite the prior artifact. Diagnostics must not expose absolute paths or sensitive data.

At runtime, only malformed bundle construction throws. The error exposes actionable validation issues in a normalized form without including machine-specific information.

## Determinism and freshness

The committed production artifact supports offline Expo builds and reviewable content diffs. To prevent staleness:

- Compilation sorts documents by stable ID unless domain order is explicit.
- Explicit species stage order is preserved and validated.
- Object serialization follows one stable convention.
- The output contains no current timestamp.
- `knowledge:check` validates sources, compiles production content to an isolated location, and compares the bytes with the committed bundle.
- A mismatch fails with instructions to run the production compile command.

Generated output is never hand-edited.

## Testing strategy

### Document and graph validation

Tests cover:

- A valid document for each supported type.
- Malformed YAML and invalid frontmatter.
- Unsupported type and incorrect directory placement.
- Duplicate IDs.
- Missing and wrong-type relationships.
- Invalid stage order, successor links, and availability/playbook agreement.
- Unsupported activity types.
- Missing reasons, required references, or Vietnamese content.

### Compiler integration

Tests cover:

- Production includes approved `vi-VN` documents only.
- Preview includes review and approved `vi-VN` documents.
- Neither mode includes draft, archived, or wrong-locale documents.
- Included documents cannot depend on excluded documents.
- Output is byte-for-byte deterministic.
- Failed compilation preserves the previous artifact.
- The authored pilot validates and compiles in preview.
- The current production artifact contains no review-stage guidance.
- Freshness checking detects and reports stale committed output.

### Repository contract

Tests use the real compiler output contract and the real adapter; no fake repository is introduced. They cover:

- A compiler-produced bundle passes runtime Zod validation.
- All list and lookup methods return deterministic typed records.
- Species-filtered playbook queries work.
- Missing IDs return `undefined`.
- Empty valid queries return immutable empty arrays.
- Malformed and internally inconsistent bundles fail construction.
- Returned values cannot mutate repository state.

## Commands

The slice adds clear package entry points with final command details chosen during implementation planning:

- `knowledge:validate` validates authored sources and relationships without writing output.
- `knowledge:compile` validates and atomically writes the production bundle.
- `knowledge:compile:preview` validates and writes a clearly separated preview artifact.
- `knowledge:check` validates sources and verifies that the committed production bundle is fresh.

## Documentation updates

Implementation updates the relevant source-of-truth documents to:

- Standardize on `knowledge/_schemas`, not `knowledge/schemas`.
- Standardize on species `stages`, not `growth-stages`.
- Document production and preview eligibility.
- Document the committed artifact and freshness command.
- Mark completed work and any concrete follow-up in `TODO.md`.

No unrelated documentation is changed.

## Completion criteria

The slice is complete when:

- All current authored document types have schemas and compiler support.
- The authored pilot validates and compiles in preview.
- The committed production bundle is deterministic, fresh, and contains no review content.
- `BundledKnowledgeRepository` validates and queries that bundle through the public contract.
- Relevant tests pass.
- The full test suite passes.
- Typecheck and lint pass.
- Production bundle freshness passes.
- `git diff --check` passes.
- End-to-end verification compiles a bundle and constructs and queries the real repository from it.
