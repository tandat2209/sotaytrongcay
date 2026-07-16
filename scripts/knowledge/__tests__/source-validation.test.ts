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
    await workspace.writeKnowledgeFile(
      "species/grape/species.md",
      "---\nid: plant.grape\ntype: plant_species\n---\n# Nho\n",
    );
    await workspace.writeKnowledgeFile(
      "references/ref.md",
      "---\nid: ref.example\ntype: reference_source\n---\n# Source\n",
    );
    await workspace.writeKnowledgeFile(
      "_schemas/ignored.md",
      "---\nid: ignored\n---\n",
    );
    await workspace.writeKnowledgeFile(
      "_generated/ignored.md",
      "---\nid: ignored\n---\n",
    );

    await expect(
      discoverMarkdownFiles(workspace.knowledgeRoot),
    ).resolves.toEqual([
      join(workspace.knowledgeRoot, "references", "ref.md"),
      join(workspace.knowledgeRoot, "species", "grape", "species.md"),
    ]);
  });

  it("retains the exact Markdown body after parsing frontmatter", async () => {
    const markdownBody = "# Nuôi thân\n\nGiữ nguyên nội dung.\n";
    const sourcePath = await workspace.writeKnowledgeFile(
      "species/grape/lifecycles/development/trunk-development.md",
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
      path: "knowledge/species/grape/lifecycles/development/trunk-development.md",
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
  ])(
    "reports %s YAML frontmatter as a parse failure",
    async (_label, frontmatter) => {
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
    },
  );

  it("reports missing frontmatter with a repository-relative diagnostic path", async () => {
    const sourcePath = await workspace.writeKnowledgeFile(
      "references/ref.md",
      "# Source\n",
    );

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
lifecycles:
  development:
    title: Dev
    repeatable: false
    initial_stage_id: dev1
    stages:
      - id: grape.stage.trunk-development
        title: "Nuôi thân"
        sequence: 1
        transitions: []
        playbook_status: approved
  production:
    title: Prod
    repeatable: true
    initial_stage_id: prod1
    stages:
      - id: grape.stage.pruning
        title: "Cắt cành"
        sequence: 1
        transitions: []
        playbook_status: approved
references: [ref.example]
---
# Nho
`,
  stage: `---
id: grape.stage.trunk-development
type: growth_stage_playbook
locale: vi-VN
species_id: plant.grape
version: 1.0.0
status: approved
primary_objective: "Objective"
entry_criteria: ["Criteria"]
exit_criteria: ["Criteria"]
estimated_duration: "1 week"
references: [ref.example]
---
# Nuôi thân
`,
  recommendation: `---
id: grape.recommendation.check-soil
type: care_plan
title: "Kiểm tra đất"
goal: "Kiểm tra trực tiếp giúp tránh tưới thừa gây úng rễ."
locale: vi-VN
priority: 50
species_ids: [plant.grape]
stage_ids: [grape.stage.trunk-development]
activity_type: watering
eligibility:
  kind: elapsed_days_since_activity
  suggest_after_days: 3
on_missing_history: suggest
version: 1.0.0
status: approved
references: [ref.example]
---
`,
  guide: `---
id: grape.guide.train-main-shoot
type: care_guide
title: "Cố định thân chính"
goal: "Giúp thân chính phát triển ổn định."
locale: vi-VN
species_ids: [plant.grape]
stage_ids: [grape.stage.trunk-development]
version: 1.0.0
status: approved
references: [ref.example]
---
# Cố định thân chính
`,
  disease: `---
id: disease.grape.powdery-mildew
type: disease
title: "Bệnh phấn trắng trên nho"
locale: vi-VN
species_ids: [plant.grape]
stage_ids: [grape.stage.trunk-development]
warning_sign_ids: []
version: 1.0.0
status: review
references: [ref.example]
---
## Dấu hiệu có thể quan sát

Mảng trắng dạng bột có thể xuất hiện trên lá hoặc chồi non.

## Điều kiện rủi ro

Theo dõi các mô xanh non trong giai đoạn có nguy cơ.

## Phòng ngừa

Giữ tán thông thoáng và vệ sinh vật liệu cây bị ảnh hưởng.

## Hành động an toàn ban đầu

Kiểm tra kỹ dấu hiệu trước khi quyết định xử lý.

## Khi nào cần chuyên gia

Dấu hiệu lan nhanh hoặc chưa thể phân biệt với nguyên nhân khác.
`,
  pest: `---
id: pest.grape.thrips
type: pest
title: "Bọ trĩ hại nho"
locale: vi-VN
species_ids: [plant.grape]
stage_ids: [grape.stage.trunk-development]
warning_sign_ids: []
version: 1.0.0
status: review
references: [ref.example]
---
## Dấu hiệu có thể quan sát

Kiểm tra chồi, hoa và quả non để tìm bằng chứng bọ trĩ hiện diện.

## Dạng gây hại

Không kết luận bọ trĩ chỉ từ một dấu hiệu hư hại đơn lẻ.

## Giai đoạn cần lưu ý

Theo dõi trong các giai đoạn mô non phát triển.

## Phòng ngừa

Vệ sinh khu vực trồng và chăm sóc cây cân đối.

## Hành động an toàn ban đầu

Ghi lại bằng chứng và hỏi người có chuyên môn khi chưa rõ.

## Khi nào cần chuyên gia

Mật độ tăng hoặc cây bị ảnh hưởng rõ nhưng chưa xác định được nguyên nhân.
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
    await workspace.writeKnowledgeFile(
      "species/grape/species.md",
      validDocuments.species,
    );
    await workspace.writeKnowledgeFile(
      "species/grape/lifecycles/development/trunk-development.md",
      validDocuments.stage,
    );
    await workspace.writeKnowledgeFile(
      "species/grape/care-plans/check-soil.md",
      validDocuments.recommendation,
    );
    await workspace.writeKnowledgeFile(
      "species/grape/guides/training/train-main-shoot.md",
      validDocuments.guide,
    );
    await workspace.writeKnowledgeFile(
      "catalogs/diseases/grape-powdery-mildew.md",
      validDocuments.disease,
    );
    await workspace.writeKnowledgeFile(
      "catalogs/pests/grape-thrips.md",
      validDocuments.pest,
    );
    await workspace.writeKnowledgeFile(
      "references/ref-example.md",
      validDocuments.reference,
    );

    const result = await validateKnowledgeSources({
      repositoryRoot: workspace.repositoryRoot,
      knowledgeRoot: workspace.knowledgeRoot,
    });

    expect(result.diagnostics).toEqual([]);
    expect(result.documents.map((document) => document.type)).toEqual([
      "disease",
      "pest",
      "reference_source",
      "care_plan",
      "care_guide",
      "growth_stage_playbook",
      "plant_species",
    ]);
  });

  it.each([
    ["missing", null],
    ["invalid JSON", "{ invalid json"],
  ])(
    "returns a sorted schema-load diagnostic for a %s schema",
    async (_label, schemaContent) => {
      const schemaPath = join(
        workspace.knowledgeRoot,
        "_schemas",
        "species.schema.json",
      );
      if (schemaContent === null) {
        await rm(schemaPath);
      } else {
        await writeFile(schemaPath, schemaContent, "utf8");
      }
      await workspace.writeKnowledgeFile(
        "species/grape/species.md",
        validDocuments.species,
      );

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
      expect(result.diagnostics[0]?.path).not.toContain(
        workspace.repositoryRoot,
      );
      expect(result.diagnostics[0]?.message).not.toContain(
        workspace.repositoryRoot,
      );
    },
  );

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
lifecycles:
  development:
    title: Dev
    repeatable: false
    initial_stage_id: dev.start
    stages: []
  production:
    title: Prod
    repeatable: true
    initial_stage_id: prod.start
    stages: []
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
    expect(result.diagnostics).toHaveLength(5);
    expect(result.diagnostics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "KNOWLEDGE_SCHEMA_INVALID",
          field: "lifecycles.development.stages",
        }),
        expect.objectContaining({
          code: "KNOWLEDGE_SCHEMA_INVALID",
          field: "lifecycles.production.stages",
        }),
        expect.objectContaining({
          code: "KNOWLEDGE_SCHEMA_INVALID",
          field: "references",
        }),
        expect.objectContaining({
          code: "KNOWLEDGE_SCHEMA_INVALID",
          field: "scientific_name",
        }),
        expect.objectContaining({
          code: "KNOWLEDGE_SCHEMA_INVALID",
          field: "version",
        }),
      ]),
    );
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
      expect.objectContaining({
        code: "KNOWLEDGE_SCHEMA_INVALID",
        field: "accessed",
      }),
      expect.objectContaining({
        code: "KNOWLEDGE_SCHEMA_INVALID",
        field: "url",
      }),
    ]);
  });

  it("reports a separate directory mismatch only after schema-valid content is parsed", async () => {
    await workspace.writeKnowledgeFile(
      "guides/train-main-shoot.md",
      validDocuments.guide,
    );

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
