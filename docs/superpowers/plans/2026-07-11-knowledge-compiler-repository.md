# Knowledge Compiler and Bundled Repository Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Compile authored Markdown knowledge into a validated, deterministic offline bundle and expose it through a validated, immutable, read-only Expo repository.

**Architecture:** A Node-only compiler under `scripts/knowledge/` discovers Markdown, parses YAML frontmatter, validates checked-in Draft 2020-12 JSON Schemas, validates the complete and mode-selected relationship graphs, and atomically emits deterministic JSON. Runtime code under `src/features/knowledge/` independently validates the artifact with Zod, freezes it, builds indexes once, and exposes only `KnowledgeRepository`.

**Tech Stack:** Node `>=22.13.0`, pnpm `10.32.1`, TypeScript `~6.0.3`, Expo SDK 57, Jest 29 with `jest-expo`, Zod 4, Ajv 8, `ajv-formats`, `gray-matter`, `yaml`, and `tsx`.

## Global Constraints

- Do not inspect, stage, edit, or commit the current untracked `.claude/` directory.
- Do not introduce a fake or mock repository.
- Build-time compiler code must not be imported by application source.
- Runtime model and data code must not depend on Markdown, YAML, JSON Schema, source paths, Node filesystem APIs, or compiler functions.
- Inject the JSON artifact into `BundledKnowledgeRepository`; the adapter must not import it internally.
- Keep TypeScript strict; never use `any`, `as any`, suppression comments, or weakened compiler options.
- Keep source files focused and under 200 lines. Split concrete responsibilities if a file approaches the limit; do not create empty scaffolding.
- Production includes only `approved` `vi-VN` user-facing documents and their reachable active references.
- Preview includes only `review` or `approved` `vi-VN` user-facing documents and their reachable active references.
- Exclude draft, deprecated, archived, wrong-locale, and unreachable content.
- The committed artifact is production-only and initially contains no agricultural guidance.
- Output contains no timestamps, absolute paths, process values, or machine-specific values.
- Writes are atomic; serialization is deterministic.
- Tests exercise the real compiler, generated contract, and `BundledKnowledgeRepository`.
- Commit only when requested, using explicit paths; never stage broadly.

---

## File Map

### Tooling and contracts

- Modify `package.json`: dependencies, commands, and compiler typecheck.
- Modify `pnpm-lock.yaml`: generated dependency lock.
- Create `scripts/knowledge/tsconfig.json`: strict Node-only TypeScript configuration.
- Modify the four user-facing schemas in `knowledge/_schemas/`: accept a locale string so compilation can exclude non-`vi-VN` documents instead of rejecting them structurally.
- Create `knowledge/_schemas/guide.schema.json`: `care_guide` authoring contract.
- Create `knowledge/_schemas/mobile-bundle.schema.json`: compiler output contract.
- Create `knowledge/_generated/.gitignore`: ignore preview and temporary artifacts only.
- Create `knowledge/_generated/mobile-bundle.json`: committed deterministic production artifact.

### Compiler

- Create `scripts/knowledge/types.ts`: compiler-only unions, records, requests, results, and diagnostics.
- Create `scripts/knowledge/diagnostics.ts`: stable sorting and safe formatting.
- Create `scripts/knowledge/paths.ts`: relative paths and type-placement rules.
- Create `scripts/knowledge/discover.ts`: deterministic Markdown discovery.
- Create `scripts/knowledge/parse.ts`: YAML frontmatter and Markdown-body parsing.
- Create `scripts/knowledge/schema-validator.ts`: Ajv schema registry and validation.
- Create `scripts/knowledge/normalize.ts`: snake_case authoring data to camelCase bundle records.
- Create `scripts/knowledge/relationship-validator.ts`: ID uniqueness and typed relationships.
- Create `scripts/knowledge/stage-graph-validator.ts`: stage order, successor, and availability rules.
- Create `scripts/knowledge/content-quality-validator.ts`: reason, reference, and bounded Vietnamese checks.
- Create `scripts/knowledge/eligibility.ts`: mode selection and reachable-reference closure.
- Create `scripts/knowledge/serialize.ts`: bundle assembly and deterministic serialization.
- Create `scripts/knowledge/atomic-write.ts`: same-directory temporary write and rename.
- Create `scripts/knowledge/compiler.ts`: pipeline orchestration.
- Create `scripts/knowledge/freshness.ts`: in-memory production compile and byte comparison.
- Create `scripts/knowledge/cli.ts`: command parsing, output, and exit codes.

### Compiler tests

- Create `scripts/knowledge/__tests__/test-workspace.ts`: real temporary filesystem fixture builder.
- Create `scripts/knowledge/__tests__/source-validation.test.ts`.
- Create `scripts/knowledge/__tests__/graph-validation.test.ts`.
- Create `scripts/knowledge/__tests__/compiler.integration.test.ts`.
- Create `scripts/knowledge/__tests__/pilot.integration.test.ts`.
- Create `scripts/knowledge/__tests__/freshness.test.ts`.

Every compiler test starts with:

```ts
/**
 * @jest-environment node
 */
```

### Runtime feature

- Create `src/features/knowledge/model/knowledge-ids.ts`: branded ID schemas.
- Create `src/features/knowledge/model/knowledge-documents.ts`: strict document schemas and types.
- Create `src/features/knowledge/model/knowledge-bundle.ts`: complete bundle schema and cross-record refinements.
- Create `src/features/knowledge/model/knowledge-repository.ts`: public interface.
- Create `src/features/knowledge/model/knowledge-bundle-error.ts`: normalized construction error.
- Create `src/features/knowledge/data/deep-freeze.ts`: recursive runtime immutability.
- Create `src/features/knowledge/data/BundledKnowledgeRepository.ts`: real adapter.
- Create `src/features/knowledge/index.ts`: explicit public exports.
- Create `src/features/knowledge/README.md`: feature boundary and verification commands.
- Create `src/features/knowledge/model/knowledge-bundle.test.ts`.
- Create `src/features/knowledge/data/BundledKnowledgeRepository.test.ts`.
- Create `src/features/knowledge/data/compiled-bundle.integration.test.ts`.

Do not modify `AppProviders.tsx`: UI integration is out of scope, and unused provider wiring would be scaffolding.

### Documentation

- Modify `docs/TECHNICAL_ARCHITECTURE.md`: correct `_schemas` and `stages` paths and document build commands.
- Modify `docs/KNOWLEDGE_BASE_ARCHITECTURE.md`: production/preview eligibility and artifact lifecycle.
- Modify `knowledge/README.md`: commands and output paths.
- Modify `TODO.md`: mark this repository slice complete and retain expert review as outstanding.

---

## Shared Interfaces

Compiler types in `scripts/knowledge/types.ts`:

```ts
export type CompilationMode = "production" | "preview";

export type KnowledgeDocumentType =
  | "plant_species"
  | "growth_stage_playbook"
  | "care_recommendation_definition"
  | "care_guide"
  | "reference_source";

export type DiagnosticCode =
  | "KNOWLEDGE_PARSE_FAILED"
  | "KNOWLEDGE_UNSUPPORTED_TYPE"
  | "KNOWLEDGE_SCHEMA_INVALID"
  | "KNOWLEDGE_DIRECTORY_MISMATCH"
  | "KNOWLEDGE_DUPLICATE_ID"
  | "KNOWLEDGE_RELATIONSHIP_MISSING"
  | "KNOWLEDGE_RELATIONSHIP_WRONG_TYPE"
  | "KNOWLEDGE_STAGE_CHAIN_INVALID"
  | "KNOWLEDGE_ACTIVITY_TYPE_UNSUPPORTED"
  | "KNOWLEDGE_REASON_MISSING"
  | "KNOWLEDGE_REFERENCE_REQUIRED"
  | "KNOWLEDGE_VIETNAMESE_CONTENT_MISSING"
  | "KNOWLEDGE_DEPENDENCY_INELIGIBLE"
  | "KNOWLEDGE_BUNDLE_INVALID"
  | "KNOWLEDGE_ARTIFACT_STALE"
  | "KNOWLEDGE_WRITE_FAILED";

export interface KnowledgeDiagnostic {
  readonly code: DiagnosticCode;
  readonly path: string;
  readonly documentId?: string;
  readonly field?: string;
  readonly message: string;
}

export interface CompileRequest {
  readonly repositoryRoot: string;
  readonly knowledgeRoot: string;
  readonly mode: CompilationMode;
  readonly write: boolean;
  readonly destinationPath?: string;
}

export type CompilationResult =
  | {
      readonly ok: true;
      readonly mode: CompilationMode;
      readonly bundle: CompiledKnowledgeBundle;
      readonly serialized: string;
      readonly destinationPath?: string;
    }
  | {
      readonly ok: false;
      readonly diagnostics: readonly KnowledgeDiagnostic[];
    };
```

Optional properties must be omitted, never assigned `undefined`, because `exactOptionalPropertyTypes` is enabled.

Bundle metadata and shape:

```ts
export const BUNDLE_SCHEMA_VERSION = "1.0.0";
export const KNOWLEDGE_CONTENT_VERSION = "1.0.0";

export interface CompiledKnowledgeBundle {
  readonly schemaVersion: string;
  readonly contentVersion: string;
  readonly mode: CompilationMode;
  readonly species: readonly CompiledKnowledgeSpecies[];
  readonly stagePlaybooks: readonly CompiledGrowthStagePlaybook[];
  readonly careRecommendations: readonly CompiledCareRecommendation[];
  readonly guides: readonly CompiledKnowledgeGuide[];
  readonly references: readonly CompiledReferenceSource[];
}
```

Compiler functions:

```ts
export async function discoverMarkdownFiles(
  knowledgeRoot: string,
): Promise<readonly string[]>;

export async function validateKnowledgeSources(request: {
  readonly repositoryRoot: string;
  readonly knowledgeRoot: string;
}): Promise<ValidationResult>;

export async function compileKnowledge(
  request: CompileRequest,
): Promise<CompilationResult>;

export async function checkKnowledgeFreshness(request: {
  readonly repositoryRoot: string;
  readonly knowledgeRoot: string;
  readonly committedBundlePath: string;
}): Promise<
  | { readonly ok: true }
  | { readonly ok: false; readonly diagnostics: readonly KnowledgeDiagnostic[] }
>;
```

Runtime repository:

```ts
export interface KnowledgeRepository {
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

Runtime errors and adapter:

```ts
export interface KnowledgeBundleIssue {
  readonly code: string;
  readonly path: readonly (string | number)[];
  readonly message: string;
}

export class KnowledgeBundleError extends Error {
  readonly issues: readonly KnowledgeBundleIssue[];

  constructor(issues: readonly KnowledgeBundleIssue[]);
}

export class BundledKnowledgeRepository implements KnowledgeRepository {
  constructor(input: unknown);
  // Implements every KnowledgeRepository method exactly.
}
```

---

### Task 1: Establish compiler tooling and authoring schemas

**Files:**

- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Modify: `knowledge/_schemas/species.schema.json`
- Modify: `knowledge/_schemas/stage-playbook.schema.json`
- Modify: `knowledge/_schemas/care-recommendation.schema.json`
- Create: `knowledge/_schemas/guide.schema.json`
- Create: `scripts/knowledge/tsconfig.json`

**Interfaces:**

- Consumes: existing Draft 2020-12 schema conventions.
- Produces: Node compiler environment and five user-facing schemas that structurally accept locale strings.

- [ ] **Step 1: Install Node-only compiler dependencies**

```bash
pnpm add -D ajv@^8 ajv-formats@^3 gray-matter@^4 yaml@^2 tsx@^4 @types/node@^22
```

Expected: `package.json` and `pnpm-lock.yaml` update successfully; packages are under `devDependencies`.

- [ ] **Step 2: Add the guide schema**

Create `knowledge/_schemas/guide.schema.json` as Draft 2020-12, `additionalProperties: false`, with required fields `id`, `type`, `title`, `locale`, `species_ids`, `stage_ids`, `version`, `status`, and `references`. Set `type` to `care_guide`; use the same ID, version, status, species, stage, and reference constraints as the existing content schemas.

- [ ] **Step 3: Make locale structural rather than publishing-specific**

Replace each user-facing schema's `"locale": { "const": "vi-VN" }` with:

```json
"locale": {
  "type": "string",
  "pattern": "^[a-z]{2,3}(?:-[A-Z]{2})?$"
}
```

Do not add locale to reference documents.

- [ ] **Step 4: Add the compiler TypeScript configuration**

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "module": "CommonJS",
    "moduleResolution": "Node",
    "target": "ES2023",
    "types": ["node", "jest"],
    "noEmit": true
  },
  "include": ["./**/*.ts"]
}
```

Keep scripts outside the root Expo `tsconfig` include graph.

- [ ] **Step 5: Validate JSON and dependency setup**

```bash
node -e "for (const f of require('node:fs').readdirSync('knowledge/_schemas')) if (f.endsWith('.json')) JSON.parse(require('node:fs').readFileSync('knowledge/_schemas/'+f,'utf8'))"
pnpm exec tsx --version
```

Expected: both commands exit 0.

---

### Task 2: Discover, parse, and schema-validate source documents

**Files:**

- Create: `scripts/knowledge/types.ts`
- Create: `scripts/knowledge/diagnostics.ts`
- Create: `scripts/knowledge/paths.ts`
- Create: `scripts/knowledge/discover.ts`
- Create: `scripts/knowledge/parse.ts`
- Create: `scripts/knowledge/schema-validator.ts`
- Create: `scripts/knowledge/__tests__/test-workspace.ts`
- Create: `scripts/knowledge/__tests__/source-validation.test.ts`

**Interfaces:**

- Consumes: `KnowledgeDocumentType`, checked-in schemas, a repository root, and real Markdown files.
- Produces: `ValidatedSourceDocument` records or sorted `KnowledgeDiagnostic[]`.

- [ ] **Step 1: Write failing discovery and parse tests**

Test real temporary directories created with `fs.mkdtemp` and cleaned in `afterEach`. Cover recursive `.md` discovery, exclusion of `_schemas` and `_generated`, lexical ordering, exact body retention, malformed YAML, missing frontmatter, and relative diagnostic paths.

```ts
expect(await discoverMarkdownFiles(knowledgeRoot)).toEqual([
  join(knowledgeRoot, "references", "ref.md"),
  join(knowledgeRoot, "species", "grape", "species.md"),
]);
expect(diagnostic).toMatchObject({
  code: "KNOWLEDGE_PARSE_FAILED",
  path: "knowledge/species/grape/species.md",
});
expect(diagnostic.path).not.toContain(repositoryRoot);
```

- [ ] **Step 2: Run the test and observe the intended failure**

```bash
pnpm jest scripts/knowledge/__tests__/source-validation.test.ts --runInBand
```

Expected: FAIL because compiler modules do not exist.

- [ ] **Step 3: Implement types, diagnostics, paths, discovery, and parsing**

Use `gray-matter` with `yaml.parse` as the engine. Diagnostics sort by `path`, then `documentId`, `field`, and `code`. Discovery must return deterministic absolute paths internally; diagnostics convert them to repository-relative `/`-separated paths.

Expected placement rules:

```ts
plant_species: knowledge/species/<slug>/species.md
growth_stage_playbook: knowledge/species/<slug>/stages/*.md
care_recommendation_definition: knowledge/species/<slug>/care-recommendations/*.md
care_guide: knowledge/species/<slug>/guides/**/*.md
reference_source: knowledge/references/*.md
```

- [ ] **Step 4: Write failing schema and placement tests**

Cover one valid document per type, unsupported declared type, schema mismatch, misplaced guide, all-errors behavior, stable field paths, invalid URI/date, and diagnostics without absolute paths.

- [ ] **Step 5: Implement Ajv validation**

Use:

```ts
const ajv = new Ajv2020({
  allErrors: true,
  strict: true,
  validateFormats: true,
});
addFormats(ajv);
```

Map declared types to exact schema filenames. Return all independent schema diagnostics and a separate `KNOWLEDGE_DIRECTORY_MISMATCH` when schema-valid content is misplaced.

- [ ] **Step 6: Verify source validation and compiler types**

```bash
pnpm jest scripts/knowledge/__tests__/source-validation.test.ts --runInBand
pnpm exec tsc -p scripts/knowledge/tsconfig.json --noEmit
```

Expected: PASS.

---

### Task 3: Normalize documents and validate the authored graph

**Files:**

- Create: `scripts/knowledge/normalize.ts`
- Create: `scripts/knowledge/relationship-validator.ts`
- Create: `scripts/knowledge/stage-graph-validator.ts`
- Create: `scripts/knowledge/content-quality-validator.ts`
- Create: `scripts/knowledge/__tests__/graph-validation.test.ts`

**Interfaces:**

- Consumes: schema-valid source records.
- Produces: camelCase `NormalizedKnowledgeDocument[]` and complete-graph diagnostics.

- [ ] **Step 1: Write failing normalization tests**

Assert snake_case becomes camelCase, stable IDs and Vietnamese prose remain unchanged, `bodyMarkdown` is retained, stage journey order is retained, and source paths/raw frontmatter never enter output records.

- [ ] **Step 2: Implement minimal normalization**

Use a discriminated switch over all five types. Never mutate the parsed input. Sort only unordered relationship arrays; preserve `stageJourney` order.

- [ ] **Step 3: Write failing typed-relationship tests**

Cover duplicate global IDs, missing references, wrong-type references, species links, recommendation links, guide links, and playbooks absent from their species journey.

```ts
expect(validateRelationships(documents)).toContainEqual(
  expect.objectContaining({
    code: "KNOWLEDGE_RELATIONSHIP_WRONG_TYPE",
    field: "references",
  }),
);
```

- [ ] **Step 4: Implement relationship validation**

Build one global `Map<string, NormalizedKnowledgeDocument>`. Validate every relationship against its expected type. Collect, sort, and return all independent failures.

- [ ] **Step 5: Write failing stage-chain tests**

Cover duplicate stage IDs/sequences, non-contiguous sequence, mismatched playbook sequence, available stage without playbook, unavailable stage without playbook as valid, non-terminal successor mismatch, terminal successor, and playbook missing from the species journey.

Resolve `nextStageId` against the species registry journey, not only playbooks: the current `trunk-development` playbook legitimately points to an unavailable next stage.

- [ ] **Step 6: Implement stage validation**

Sort a copy by sequence, require sequences `1..n`, compare each non-terminal registry successor to the next registry ID, and require a playbook only when `playbookStatus !== "unavailable"`.

- [ ] **Step 7: Write failing content-quality tests**

Cover unsupported activity defense, a missing/non-empty `## Vì sao` recommendation section, bounded Vietnamese character check for user-facing `vi-VN` records, and required references for safety or avoid guidance. Do not apply Vietnamese checks to English reference metadata.

- [ ] **Step 8: Implement bounded content checks**

Extract an exact Markdown section until the next heading; do not add a Markdown AST dependency. Detect Vietnamese with an explicit Unicode character expression, not probabilistic language detection.

- [ ] **Step 9: Run graph tests**

```bash
pnpm jest scripts/knowledge/__tests__/graph-validation.test.ts --runInBand
```

Expected: PASS.

---

### Task 4: Select eligible content and compile deterministic bundles

**Files:**

- Create: `scripts/knowledge/eligibility.ts`
- Create: `scripts/knowledge/serialize.ts`
- Create: `knowledge/_schemas/mobile-bundle.schema.json`
- Create: `scripts/knowledge/__tests__/compiler.integration.test.ts`

**Interfaces:**

- Consumes: a valid complete authored graph and `CompilationMode`.
- Produces: selected closed graph, `CompiledKnowledgeBundle`, and canonical JSON bytes.

- [ ] **Step 1: Write failing mode-selection tests**

Cover production approved-only behavior, preview review-or-approved behavior, wrong locale exclusion, draft/deprecated/archived exclusion, inactive reference failure, omission of unreachable active references, and included content depending on excluded content.

- [ ] **Step 2: Implement eligibility and reference closure**

```ts
export function isEligibleForMode(
  document: NormalizedUserFacingDocument,
  mode: CompilationMode,
): boolean {
  if (document.locale !== "vi-VN") return false;
  return mode === "production"
    ? document.status === "approved"
    : document.status === "review" || document.status === "approved";
}
```

Start from eligible user-facing records. Include only reachable `active` references. Fail with `KNOWLEDGE_DEPENDENCY_INELIGIBLE` when any required relationship is absent from the selected closure. Never drop a relationship silently.

- [ ] **Step 3: Write the output JSON Schema**

Define strict top-level metadata and arrays for all five compiled types. Use camelCase field names. Require `schemaVersion`, `contentVersion`, and `mode`. Reuse `$defs` for stable ID and status patterns where useful.

- [ ] **Step 4: Write failing determinism tests**

Permute discovery order and unordered relationship arrays and expect identical bytes. Assert stage journey remains sequence-ordered, arrays sort by ID, output has exactly one trailing newline, and metadata has no timestamp.

- [ ] **Step 5: Implement assembly and serialization**

Top-level arrays sort by stable ID. Nested unordered ID arrays sort lexically. `stageJourney` sorts by sequence. Construct object keys in contract order and serialize with:

```ts
`${JSON.stringify(bundle, null, 2)}\n`;
```

- [ ] **Step 6: Validate assembled output with Ajv**

Return `KNOWLEDGE_BUNDLE_INVALID` rather than serialize when the output schema fails.

- [ ] **Step 7: Run compiler selection and serialization tests**

```bash
pnpm jest scripts/knowledge/__tests__/compiler.integration.test.ts --runInBand
```

Expected: PASS for in-memory selection and serialization cases.

---

### Task 5: Orchestrate compilation, atomic writes, CLI, and freshness

**Files:**

- Create: `scripts/knowledge/atomic-write.ts`
- Create: `scripts/knowledge/compiler.ts`
- Create: `scripts/knowledge/freshness.ts`
- Create: `scripts/knowledge/cli.ts`
- Create: `scripts/knowledge/__tests__/freshness.test.ts`
- Modify: `scripts/knowledge/__tests__/compiler.integration.test.ts`
- Modify: `package.json`

**Interfaces:**

- Consumes: all compiler units from Tasks 2–4.
- Produces: `validateKnowledgeSources`, `compileKnowledge`, `checkKnowledgeFreshness`, and four package commands.

- [ ] **Step 1: Write failing orchestration and write-safety tests**

Assert the exact pipeline order through observable results, multiple sorted diagnostics, `write: false` performs no write, failed validation preserves existing bytes, successful compile replaces bytes, and no temporary file remains.

- [ ] **Step 2: Implement atomic writing**

Write a sibling temporary file with `flag: "wx"`, then rename over the destination. On `unknown` failure, remove only that compiler-owned temporary path and rethrow. The destination parent must already exist.

- [ ] **Step 3: Implement compiler orchestration**

Execute exactly: discover → parse → schema validation → normalization → complete graph validation → mode selection → selected graph validation → assembly → output validation → serialization → optional atomic write. Stop before writing on any diagnostic.

- [ ] **Step 4: Write failing freshness tests**

Cover matching bytes, one-byte mismatch, missing artifact, and the remediation message:

```text
Run "pnpm knowledge:compile" and commit knowledge/_generated/mobile-bundle.json.
```

- [ ] **Step 5: Implement in-memory freshness checking**

Compile production with `write: false`, read the committed artifact, and compare UTF-8 bytes. Never write during `check`.

- [ ] **Step 6: Write failing CLI behavior tests**

Cover success exit `0`, compiler failure exit `1`, bad command/option exit `2`, validate never writing, preview refusing the production output path, and safe relative diagnostic formatting.

- [ ] **Step 7: Implement CLI dispatch**

Commands:

```json
{
  "typecheck": "tsc --noEmit && tsc -p scripts/knowledge/tsconfig.json --noEmit",
  "knowledge:validate": "tsx scripts/knowledge/cli.ts validate",
  "knowledge:compile": "tsx scripts/knowledge/cli.ts compile --mode production --output knowledge/_generated/mobile-bundle.json",
  "knowledge:compile:preview": "tsx scripts/knowledge/cli.ts compile --mode preview --output knowledge/_generated/mobile-bundle.preview.json",
  "knowledge:check": "tsx scripts/knowledge/cli.ts check"
}
```

The preview command must reject `knowledge/_generated/mobile-bundle.json` even when passed explicitly.

- [ ] **Step 8: Run compiler and freshness tests**

```bash
pnpm jest scripts/knowledge/__tests__/compiler.integration.test.ts scripts/knowledge/__tests__/freshness.test.ts --runInBand
pnpm typecheck
```

Expected: PASS.

---

### Task 6: Compile and verify the real grape pilot

**Files:**

- Create: `scripts/knowledge/__tests__/pilot.integration.test.ts`
- Create: `knowledge/_generated/.gitignore`
- Create: `knowledge/_generated/mobile-bundle.json`

**Interfaces:**

- Consumes: real checked-in Markdown and compiler entry points.
- Produces: proven preview output and committed empty production artifact.

- [ ] **Step 1: Write the real preview integration test**

Compile the repository root with `mode: "preview"`, `write: false`. Assert exactly one species, one playbook, one recommendation, one guide, and three reachable references. Assert IDs and Vietnamese titles, and ensure no serialized `sourcePath` exists.

- [ ] **Step 2: Write the real production integration test**

Assert `mode === "production"` and every content array is empty because all authored user-facing content remains `review`. References must also be empty because none are reachable from production content.

- [ ] **Step 3: Run the pilot test**

```bash
pnpm jest scripts/knowledge/__tests__/pilot.integration.test.ts --runInBand
```

Expected: PASS. Do not weaken eligibility if production is empty.

- [ ] **Step 4: Configure generated-file tracking**

`knowledge/_generated/.gitignore` contains:

```gitignore
mobile-bundle.preview.json
.*.tmp
```

It must not ignore `mobile-bundle.json`.

- [ ] **Step 5: Generate and check production**

```bash
pnpm knowledge:validate
pnpm knowledge:compile
pnpm knowledge:check
```

Expected: valid authored graph, production JSON written, then freshness PASS. The artifact has metadata plus five empty arrays.

---

### Task 7: Define the complete runtime Zod contract

**Files:**

- Create: `src/features/knowledge/model/knowledge-ids.ts`
- Create: `src/features/knowledge/model/knowledge-documents.ts`
- Create: `src/features/knowledge/model/knowledge-bundle.ts`
- Create: `src/features/knowledge/model/knowledge-bundle-error.ts`
- Create: `src/features/knowledge/model/knowledge-bundle.test.ts`

**Interfaces:**

- Consumes: `unknown` compiler-shaped JSON.
- Produces: branded IDs, strict runtime documents, `KnowledgeBundleSchema`, `KnowledgeBundle`, and normalized errors.

- [ ] **Step 1: Write failing branded-ID tests**

Test valid/invalid species, playbook, recommendation, guide, and reference IDs. Define each with `z.string().regex(...).brand<...>()` and export `z.infer` types.

- [ ] **Step 2: Implement branded ID schemas**

Use the same patterns as the output schema. Do not expose constructors based on unchecked casts.

- [ ] **Step 3: Write failing document and bundle tests**

Cover a compiler-produced fixture, strict unknown-field rejection, invalid mode/status, malformed nested records, duplicate IDs, missing/wrong-type relationships, production containing review content, and preview containing draft content.

- [ ] **Step 4: Implement complete Zod schemas**

Use strict schemas for every nested object. `KnowledgeBundleSchema.superRefine` validates unique IDs, typed relationships, selected-graph integrity, and mode/status compatibility. Do not import compiler code.

- [ ] **Step 5: Write failing normalized-error tests**

Assert `KnowledgeBundleError` contains only code, safe path segments, and message; it must not retain the raw payload or machine paths.

- [ ] **Step 6: Implement the runtime error**

Normalize Zod issues into immutable `KnowledgeBundleIssue[]` and set a stable error name/message.

- [ ] **Step 7: Run runtime contract tests**

```bash
pnpm jest src/features/knowledge/model/knowledge-bundle.test.ts --runInBand
pnpm typecheck
```

Expected: PASS.

---

### Task 8: Implement the immutable bundled repository

**Files:**

- Create: `src/features/knowledge/model/knowledge-repository.ts`
- Create: `src/features/knowledge/data/deep-freeze.ts`
- Create: `src/features/knowledge/data/BundledKnowledgeRepository.ts`
- Create: `src/features/knowledge/data/BundledKnowledgeRepository.test.ts`

**Interfaces:**

- Consumes: `unknown` bundle input and runtime schemas from Task 7.
- Produces: the exact `KnowledgeRepository` API and immutable synchronous reads.

- [ ] **Step 1: Write the repository interface exactly**

Use the interface from “Shared Interfaces.” Do not add raw bundle, get-all, aggregate-view, or compiler-mode methods.

- [ ] **Step 2: Write failing behavior tests**

Construct the real adapter with a valid compiler-shaped bundle. Cover every list/get method, deterministic order, species-filtered playbooks, singular misses returning `undefined`, valid empty queries returning `[]`, and malformed/corrupt construction throwing `KnowledgeBundleError`.

- [ ] **Step 3: Write failing immutability tests**

Attempt to mutate a returned top-level array, record property, and nested relationship array. Assert mutation throws in strict mode or has no effect, then query again and assert original data remains unchanged.

- [ ] **Step 4: Implement recursive freezing**

`deepFreeze` handles arrays and plain objects and returns a readonly type. Freeze parsed data once after Zod validation. Do not repeatedly clone on each read.

- [ ] **Step 5: Implement `BundledKnowledgeRepository`**

Constructor order: parse complete Zod schema → deep freeze → build private ID maps → build frozen species-to-playbook arrays → share one frozen empty array. Methods perform no parsing, filesystem, or network I/O.

- [ ] **Step 6: Run adapter tests**

```bash
pnpm jest src/features/knowledge/data/BundledKnowledgeRepository.test.ts --runInBand
pnpm typecheck
```

Expected: PASS.

---

### Task 9: Expose and verify the compiler-to-repository seam

**Files:**

- Create: `src/features/knowledge/index.ts`
- Create: `src/features/knowledge/data/compiled-bundle.integration.test.ts`
- Create: `src/features/knowledge/README.md`
- Modify: `scripts/knowledge/__tests__/pilot.integration.test.ts`

**Interfaces:**

- Consumes: compiler production/preview output and runtime repository.
- Produces: supported public feature imports and end-to-end proof.

- [ ] **Step 1: Add explicit public exports**

Export the adapter, runtime error, bundle schema, branded ID schemas, repository interface, document types, and branded ID types. Use explicit internal paths; do not add nested barrels.

- [ ] **Step 2: Test the committed production artifact**

```ts
import bundle from "../../../../knowledge/_generated/mobile-bundle.json";
import {
  BundledKnowledgeRepository,
  PlantSpeciesIdSchema,
} from "@/features/knowledge";

it("constructs and queries the committed production bundle", () => {
  const repository = new BundledKnowledgeRepository(bundle);
  expect(repository.listSpecies()).toEqual([]);
  expect(
    repository.getSpeciesById(PlantSpeciesIdSchema.parse("plant.grape")),
  ).toBeUndefined();
});
```

If required, add `"resolveJsonModule": true` to root `tsconfig.json`; do not replace the real artifact with a hand-written fixture.

- [ ] **Step 3: Extend the real preview integration test through the adapter**

Pass `compileKnowledge(...preview...).bundle` into the real `BundledKnowledgeRepository`. Parse all lookup IDs with exported schemas. Query species, playbook, recommendation, guide, and references. Verify Vietnamese title/body, stable relationship IDs, no source path, and mutation resistance.

- [ ] **Step 4: Document the feature boundary**

`src/features/knowledge/README.md` states purpose, public API, constructor failure, lookup-miss behavior, immutability, dependency direction, and focused test commands.

- [ ] **Step 5: Run both seam tests**

```bash
pnpm jest src/features/knowledge/data/compiled-bundle.integration.test.ts scripts/knowledge/__tests__/pilot.integration.test.ts --runInBand
```

Expected: production and preview seams PASS.

---

### Task 10: Align architecture documentation and backlog

**Files:**

- Modify: `docs/TECHNICAL_ARCHITECTURE.md`
- Modify: `docs/KNOWLEDGE_BASE_ARCHITECTURE.md`
- Modify: `knowledge/README.md`
- Modify: `TODO.md`

**Interfaces:**

- Consumes: implemented command names, paths, and behavior.
- Produces: documentation matching the shipped slice.

- [ ] **Step 1: Correct path drift**

Standardize on `knowledge/_schemas` and `knowledge/species/<slug>/stages`. Remove obsolete `knowledge/schemas` and `growth-stages` references in relevant sections.

- [ ] **Step 2: Document publishing behavior and artifacts**

State:

```text
production: approved + vi-VN + valid selected graph
preview: review|approved + vi-VN + valid selected graph
production output: knowledge/_generated/mobile-bundle.json
preview output: knowledge/_generated/mobile-bundle.preview.json
```

State that generated output is never hand-edited and preview cannot overwrite production.

- [ ] **Step 3: Document commands**

Explain `pnpm knowledge:validate`, `knowledge:compile`, `knowledge:compile:preview`, and `knowledge:check` with their write/no-write behavior.

- [ ] **Step 4: Update the backlog precisely**

Mark the schema-validated Markdown compiler and bundled repository complete. Keep qualified Vietnamese grape-growing review outstanding. Do not claim Today or Plant Detail integration is complete.

- [ ] **Step 5: Verify documentation consistency**

```bash
rg "knowledge/schemas|growth-stages" docs/TECHNICAL_ARCHITECTURE.md docs/KNOWLEDGE_BASE_ARCHITECTURE.md knowledge/README.md
```

Expected: no matches.

---

### Task 11: Run full verification and inspect the final diff

**Files:**

- Verify all files from Tasks 1–10.

**Interfaces:**

- Consumes: complete implementation.
- Produces: evidence for the project definition of done.

- [ ] **Step 1: Verify source and both compilation modes**

```bash
pnpm knowledge:validate
pnpm knowledge:compile:preview
pnpm knowledge:compile
pnpm knowledge:check
```

Expected: authored pilot valid; preview contains the five review-stage document groups; production contains empty guidance arrays; freshness passes.

- [ ] **Step 2: Run focused and full tests**

```bash
pnpm jest scripts/knowledge/__tests__ --runInBand
pnpm jest src/features/knowledge --runInBand
pnpm test
```

Expected: all PASS.

- [ ] **Step 3: Run static and export checks**

```bash
pnpm typecheck
pnpm lint
pnpm export
pnpm knowledge:check
git diff --check
```

Expected: all PASS; production remains fresh after export.

- [ ] **Step 4: Confirm end-to-end behavior explicitly**

The real preview integration must demonstrate Markdown discovery, YAML parsing, JSON Schema validation, graph validation, preview filtering, deterministic bundle assembly, Zod parsing, repository construction, all lookup families, stable relationship IDs, no exposed source path, and immutable reads.

- [ ] **Step 5: Inspect scope and repository state**

```bash
git status --short
git diff --stat
git diff -- package.json scripts/knowledge knowledge/_schemas knowledge/_generated src/features/knowledge docs/TECHNICAL_ARCHITECTURE.md docs/KNOWLEDGE_BASE_ARCHITECTURE.md knowledge/README.md TODO.md
```

Expected: only planned implementation files changed; preview/temp output is ignored; `.claude/` remains untracked and untouched.

- [ ] **Step 6: Report completion without committing unless asked**

Report changes, architectural rationale, possible improvements, and actual results for compile, focused tests, full tests, typecheck, lint, export, freshness, and `git diff --check`. If any command fails, preserve the failure output and do not claim completion.

---

## Plan Self-Review

- **Spec coverage:** Tasks 1–6 implement five source types, guide schema, complete/selected graph validation, explicit modes, output schema, deterministic bytes, atomic writes, commands, freshness, and the committed production artifact. Tasks 7–9 implement Zod validation, normalized errors, repository behavior, immutability, and the real compiler/runtime seam. Tasks 10–11 cover documentation and all completion gates.
- **Boundary check:** Compiler and runtime are connected only by the JSON contract; no Node compiler code enters `src/`.
- **Scope check:** Compiler and repository remain one plan because the approved outcome requires their end-to-end artifact seam. UI, persistence, synchronization, rules, and AI remain excluded.
- **Type consistency:** `care_guide` is the authored discriminator; `KnowledgeGuide` is the runtime type. All repository method and branded-ID names match the approved contract.
- **Reference nuance:** References use `active|superseded|unavailable`, have no locale, and are included only when reachable from selected user-facing content.
- **Stage nuance:** `nextStageId` resolves against the species journey, allowing an available playbook to point to a later unavailable stage without requiring an unavailable playbook.
- **Placeholder scan:** The plan contains no deferred implementation placeholders or unspecified validation steps.
