import { rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { discoverMarkdownFiles } from "../discover";
import { parseMarkdownFile } from "../parse";
import { validateKnowledgeSources } from "../schema-validator";

import { createTestWorkspace, type TestWorkspace } from "./test-workspace";

describe("knowledge source discovery and parsing", () => {
  let workspace: TestWorkspace;

  beforeEach(async () => {
    workspace = await createTestWorkspace();
  });

  afterEach(async () => {
    await workspace.cleanup();
  });

  it("discovers authored Markdown recursively while excluding schemas and generated files in lexical order", async () => {
    await workspace.writeKnowledgeFile("species/grape/species.md", "---\nid: plant.grape\ntype: plant_species\n---\n# Nho\n");
    await workspace.writeKnowledgeFile("references/ref.md", "---\nid: ref.example\ntype: reference_source\n---\n# Source\n");
    await workspace.writeKnowledgeFile("_schemas/ignored.md", "---\nid: ignored\n---\n");
    await workspace.writeKnowledgeFile("_generated/ignored.md", "---\nid: ignored\n---\n");

    await expect(discoverMarkdownFiles(workspace.knowledgeRoot)).resolves.toEqual([
      join(workspace.knowledgeRoot, "references", "ref.md"),
      join(workspace.knowledgeRoot, "species", "grape", "species.md"),
    ]);
  });

  it("retains the exact Markdown body after parsing frontmatter", async () => {
    const markdownBody = "# Nuôi thân\n\nGiữ nguyên nội dung.\n";
    const sourcePath = await workspace.writeKnowledgeFile(
      "species/grape/stages/trunk-development.md",
      `---\nid: grape.stage.trunk-development\ntype: growth_stage_playbook\n---\n${markdownBody}`,
    );

    const result = await parseMarkdownFile({
      sourcePath,
      repositoryRoot: workspace.repositoryRoot,
    });

    expect(result.document).toMatchObject({
      id: "grape.stage.trunk-development",
      type: "growth_stage_playbook",
      body: markdownBody,
      path: "knowledge/species/grape/stages/trunk-development.md",
    });
    expect(result.diagnostics).toEqual([]);
  });

  it("reports malformed YAML with a repository-relative diagnostic path", async () => {
    const sourcePath = await workspace.writeKnowledgeFile(
      "species/grape/species.md",
      "---\nid: [broken\ntype: plant_species\n---\n# Nho\n",
    );

    const result = await parseMarkdownFile({
      sourcePath,
      repositoryRoot: workspace.repositoryRoot,
    });

    expect(result.document).toBeNull();
    expect(result.diagnostics).toHaveLength(1);
    expect(result.diagnostics[0]).toMatchObject({
      code: "KNOWLEDGE_PARSE_FAILED",
      path: "knowledge/species/grape/species.md",
    });
    expect(result.diagnostics[0]?.path).not.toContain(workspace.repositoryRoot);
  });

  it.each([
    ["scalar", "scalar"],
    ["array", "- first\n- second"],
    ["null", "null"],
  ])("reports %s YAML frontmatter as a parse failure", async (_label, frontmatter) => {
    const sourcePath = await workspace.writeKnowledgeFile(
      "species/grape/species.md",
      `---\n${frontmatter}\n---\n# Nho\n`,
    );

    const result = await parseMarkdownFile({
      sourcePath,
      repositoryRoot: workspace.repositoryRoot,
    });

    expect(result.document).toBeNull();
    expect(result.diagnostics).toEqual([
      expect.objectContaining({
        code: "KNOWLEDGE_PARSE_FAILED",
        path: "knowledge/species/grape/species.md",
      }),
    ]);
  });

  it("reports missing frontmatter with a repository-relative diagnostic path", async () => {
    const sourcePath = await workspace.writeKnowledgeFile("references/ref.md", "# Source\n");

    const result = await parseMarkdownFile({
      sourcePath,
      repositoryRoot: workspace.repositoryRoot,
    });

    expect(result.document).toBeNull();
    expect(result.diagnostics[0]).toMatchObject({
      code: "KNOWLEDGE_FRONTMATTER_MISSING",
      path: "knowledge/references/ref.md",
    });
    expect(result.diagnostics[0]?.path).not.toContain(workspace.repositoryRoot);
  });
});


const validDocuments = {
  species: `---
id: plant.grape
type: plant_species
title: "Nho"
scientific_name: "Vitis vinifera"
locale: vi-VN
version: 1.0.0
status: approved
stage_journey:
  - id: grape.stage.trunk-development
    title: "Nuôi thân"
    sequence: 1
    playbook_status: approved
references: [ref.example]
---
# Nho
`,
  stage: `---
id: grape.stage.trunk-development
type: growth_stage_playbook
title: "Nuôi thân"
locale: vi-VN
species_id: plant.grape
sequence: 1
version: 1.0.0
status: approved
stage_group: development
repeatable: false
primary_objective: "Objective"
entry_criteria: ["Criteria"]
exit_criteria: ["Criteria"]
estimated_duration: "1 week"
recommended_playbook: playbook.grape
default_reminder_templates: ["Reminder"]
recommended_knowledge_topics: ["Topic"]
references: [ref.example]
---
# Nuôi thân
`,
  recommendation: `---
id: grape.recommendation.check-soil
type: care_recommendation_definition
title: "Kiểm tra đất"
locale: vi-VN
species_ids: [plant.grape]
stage_ids: [grape.stage.trunk-development]
activity_type: watering
version: 1.0.0
status: approved
references: [ref.example]
---
# Kiểm tra đất
`,
  guide: `---
id: grape.guide.train-main-shoot
type: care_guide
title: "Cố định thân chính"
locale: vi-VN
species_ids: [plant.grape]
stage_ids: [grape.stage.trunk-development]
version: 1.0.0
status: approved
references: [ref.example]
---
# Cố định thân chính
`,
  reference: `---
id: ref.example
type: reference_source
title: "Example source"
publisher: "Extension"
source_type: extension_guide
url: "https://example.com/grape"
accessed: 2026-07-11
version: 1.0.0
status: active
---
# Source
`,
} as const;

describe("knowledge source schema validation", () => {
  let workspace: TestWorkspace;

  beforeEach(async () => {
    workspace = await createTestWorkspace();
  });

  afterEach(async () => {
    await workspace.cleanup();
  });

  it("validates one correctly placed document for every supported type", async () => {
    await workspace.writeKnowledgeFile("species/grape/species.md", validDocuments.species);
    await workspace.writeKnowledgeFile("species/grape/stages/trunk-development.md", validDocuments.stage);
    await workspace.writeKnowledgeFile("species/grape/care-recommendations/check-soil.md", validDocuments.recommendation);
    await workspace.writeKnowledgeFile("species/grape/guides/training/train-main-shoot.md", validDocuments.guide);
    await workspace.writeKnowledgeFile("references/ref-example.md", validDocuments.reference);

    const result = await validateKnowledgeSources({
      repositoryRoot: workspace.repositoryRoot,
      knowledgeRoot: workspace.knowledgeRoot,
    });

    expect(result.diagnostics).toEqual([]);
    expect(result.documents.map((document) => document.type)).toEqual([
      "reference_source",
      "care_recommendation_definition",
      "care_guide",
      "plant_species",
      "growth_stage_playbook",
    ]);
  });

  it.each([
    ["missing", null],
    ["invalid JSON", "{ invalid json"],
  ])("returns a sorted schema-load diagnostic for a %s schema", async (_label, schemaContent) => {
    const schemaPath = join(workspace.knowledgeRoot, "_schemas", "species.schema.json");
    if (schemaContent === null) {
      await rm(schemaPath);
    } else {
      await writeFile(schemaPath, schemaContent, "utf8");
    }
    await workspace.writeKnowledgeFile("species/grape/species.md", validDocuments.species);

    const result = await validateKnowledgeSources({
      repositoryRoot: workspace.repositoryRoot,
      knowledgeRoot: workspace.knowledgeRoot,
    });

    expect(result.documents).toEqual([]);
    expect(result.diagnostics).toEqual([
      expect.objectContaining({
        code: "KNOWLEDGE_SCHEMA_LOAD_FAILED",
        path: "knowledge/_schemas/species.schema.json",
      }),
    ]);
    expect(result.diagnostics[0]?.path).not.toContain(workspace.repositoryRoot);
    expect(result.diagnostics[0]?.message).not.toContain(workspace.repositoryRoot);
  });

  it("reports an unsupported declared type without absolute paths", async () => {
    await workspace.writeKnowledgeFile(
      "species/grape/species.md",
      `---
id: plant.grape
type: unknown_type
title: "Nho"
---
# Nho
`,
    );

    const result = await validateKnowledgeSources({
      repositoryRoot: workspace.repositoryRoot,
      knowledgeRoot: workspace.knowledgeRoot,
    });

    expect(result.documents).toEqual([]);
    expect(result.diagnostics).toEqual([
      expect.objectContaining({
        code: "KNOWLEDGE_TYPE_UNSUPPORTED",
        path: "knowledge/species/grape/species.md",
        documentId: "plant.grape",
        field: "type",
      }),
    ]);
    expect(result.diagnostics[0]?.path).not.toContain(workspace.repositoryRoot);
  });

  it("returns all independent schema diagnostics with stable field paths", async () => {
    await workspace.writeKnowledgeFile(
      "species/grape/species.md",
      `---
id: plant.grape
type: plant_species
title: "Nho"
locale: vi-VN
version: 1
status: approved
stage_journey: []
references: []
---
# Nho
`,
    );

    const result = await validateKnowledgeSources({
      repositoryRoot: workspace.repositoryRoot,
      knowledgeRoot: workspace.knowledgeRoot,
    });

    expect(result.documents).toEqual([]);
    expect(result.diagnostics).toEqual([
      expect.objectContaining({ code: "KNOWLEDGE_SCHEMA_INVALID", field: "references" }),
      expect.objectContaining({ code: "KNOWLEDGE_SCHEMA_INVALID", field: "scientific_name" }),
      expect.objectContaining({ code: "KNOWLEDGE_SCHEMA_INVALID", field: "stage_journey" }),
      expect.objectContaining({ code: "KNOWLEDGE_SCHEMA_INVALID", field: "version" }),
    ]);
    for (const diagnostic of result.diagnostics) {
      expect(diagnostic.path).toBe("knowledge/species/grape/species.md");
      expect(diagnostic.path).not.toContain(workspace.repositoryRoot);
    }
  });

  it("reports invalid URI and date formats from the reference schema", async () => {
    await workspace.writeKnowledgeFile(
      "references/ref-example.md",
      `---
id: ref.example
type: reference_source
title: "Example source"
publisher: "Extension"
source_type: extension_guide
url: "not a uri"
accessed: not-a-date
version: 1.0.0
status: active
---
# Source
`,
    );

    const result = await validateKnowledgeSources({
      repositoryRoot: workspace.repositoryRoot,
      knowledgeRoot: workspace.knowledgeRoot,
    });

    expect(result.diagnostics).toEqual([
      expect.objectContaining({ code: "KNOWLEDGE_SCHEMA_INVALID", field: "accessed" }),
      expect.objectContaining({ code: "KNOWLEDGE_SCHEMA_INVALID", field: "url" }),
    ]);
  });

  it("reports a separate directory mismatch only after schema-valid content is parsed", async () => {
    await workspace.writeKnowledgeFile("guides/train-main-shoot.md", validDocuments.guide);

    const result = await validateKnowledgeSources({
      repositoryRoot: workspace.repositoryRoot,
      knowledgeRoot: workspace.knowledgeRoot,
    });

    expect(result.documents).toEqual([]);
    expect(result.diagnostics).toEqual([
      expect.objectContaining({
        code: "KNOWLEDGE_DIRECTORY_MISMATCH",
        path: "knowledge/guides/train-main-shoot.md",
        documentId: "grape.guide.train-main-shoot",
      }),
    ]);
  });
});
