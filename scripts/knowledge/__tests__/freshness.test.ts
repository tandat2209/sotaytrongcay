/**
 * @jest-environment node
 */

import { rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { checkKnowledgeFreshness } from "../freshness";
import { createTestWorkspace, type TestWorkspace } from "./test-workspace";

describe("knowledge freshness check", () => {
  let workspace: TestWorkspace;

  beforeEach(async () => {
    workspace = await createTestWorkspace();
  });

  afterEach(async () => {
    await workspace.cleanup();
  });

  it("fails with KNOWLEDGE_ARTIFACT_STALE when the committed bundle is missing", async () => {
    // Write valid approved reference source
    await workspace.writeKnowledgeFile(
      "references/ref-osu.md",
      `---
id: ref.osu
type: reference_source
title: "OSU Extension"
publisher: "OSU"
source_type: extension_guide
url: http://example.com/osu
accessed: "2026-07-11"
version: 1.0.0
status: active
---
# OSU Extension Guide
`,
    );

    // Write valid approved documents so in-memory compilation succeeds
    await workspace.writeKnowledgeFile(
      "species/grape/species.md",
      `---
id: plant.grape
type: plant_species
title: "Nho"
locale: vi-VN
version: 1.0.0
status: approved
scientific_name: "Vitis vinifera"
stage_journey:
  - id: grape.stage.trunk-development
    title: "Nuôi thân"
    sequence: 1
    playbook_status: unavailable
references: ["ref.osu"]
---
# Cây nho
`,
    );

    const committedBundlePath = join(workspace.knowledgeRoot, "_generated", "mobile-bundle.json");
    const result = await checkKnowledgeFreshness({
      repositoryRoot: workspace.repositoryRoot,
      knowledgeRoot: workspace.knowledgeRoot,
      committedBundlePath,
    });

    expect(result.ok).toBe(false);
    expect(result.diagnostics).toHaveLength(1);
    expect(result.diagnostics[0]!).toMatchObject({
      code: "KNOWLEDGE_ARTIFACT_STALE",
      path: committedBundlePath,
      message: expect.stringContaining('Run "pnpm knowledge:compile" and commit knowledge/_generated/mobile-bundle.json.'),
    });
  });

  it("succeeds when committed bundle matches compiled production output, and fails when there is a mismatch", async () => {
    // Write valid approved reference source
    await workspace.writeKnowledgeFile(
      "references/ref-osu.md",
      `---
id: ref.osu
type: reference_source
title: "OSU Extension"
publisher: "OSU"
source_type: extension_guide
url: http://example.com/osu
accessed: "2026-07-11"
version: 1.0.0
status: active
---
# OSU Extension Guide
`,
    );

    // Write valid approved documents so in-memory compilation succeeds
    await workspace.writeKnowledgeFile(
      "species/grape/species.md",
      `---
id: plant.grape
type: plant_species
title: "Nho"
locale: vi-VN
version: 1.0.0
status: approved
scientific_name: "Vitis vinifera"
stage_journey:
  - id: grape.stage.trunk-development
    title: "Nuôi thân"
    sequence: 1
    playbook_status: unavailable
references: ["ref.osu"]
---
# Cây nho
`,
    );

    const committedBundlePath = join(workspace.knowledgeRoot, "_generated", "mobile-bundle.json");

    // First write matching compiled output
    const expectedSerialized = JSON.stringify(
      {
        schemaVersion: "1.0.0",
        contentVersion: "1.0.0",
        mode: "production",
        species: [
          {
            id: "plant.grape",
            type: "plant_species",
            title: "Nho",
            locale: "vi-VN",
            version: "1.0.0",
            status: "approved",
            references: ["ref.osu"],
            scientificName: "Vitis vinifera",
            stageJourney: [
              {
                id: "grape.stage.trunk-development",
                title: "Nuôi thân",
                sequence: 1,
                playbookStatus: "unavailable",
              }
            ],
            bodyMarkdown: "# Cây nho\n",
          },
        ],
        stagePlaybooks: [],
        careRecommendations: [],
        guides: [],
        references: [
          {
            id: "ref.osu",
            type: "reference_source",
            title: "OSU Extension",
            version: "1.0.0",
            status: "active",
            publisher: "OSU",
            sourceType: "extension_guide",
            url: "http://example.com/osu",
            accessed: "2026-07-11",
            bodyMarkdown: "# OSU Extension Guide\n",
          }
        ],
      },
      null,
      2,
    ) + "\n";

    await workspace.writeKnowledgeFile("_generated/mobile-bundle.json", expectedSerialized);

    let result = await checkKnowledgeFreshness({
      repositoryRoot: workspace.repositoryRoot,
      knowledgeRoot: workspace.knowledgeRoot,
      committedBundlePath,
    });

    expect(result.ok).toBe(true);

    // Write mismatched content (e.g. trailing characters or minor change)
    await workspace.writeKnowledgeFile("_generated/mobile-bundle.json", expectedSerialized + " ");

    result = await checkKnowledgeFreshness({
      repositoryRoot: workspace.repositoryRoot,
      knowledgeRoot: workspace.knowledgeRoot,
      committedBundlePath,
    });

    expect(result.ok).toBe(false);
    expect(result.diagnostics).toHaveLength(1);
    expect(result.diagnostics[0]?.code).toBe("KNOWLEDGE_ARTIFACT_STALE");
  });
});
