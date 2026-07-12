/**
 * @jest-environment node
 */

import { join, resolve } from "node:path";
import { compileKnowledge } from "../compiler";

const REPOSITORY_ROOT = resolve(__dirname, "../../..");
const KNOWLEDGE_ROOT = join(REPOSITORY_ROOT, "knowledge");

describe("grape knowledge pilot integration test", () => {
  it("compiles the real pilot in preview mode with expected records and relationships", async () => {
    const result = await compileKnowledge({
      repositoryRoot: REPOSITORY_ROOT,
      knowledgeRoot: KNOWLEDGE_ROOT,
      mode: "preview",
      write: false,
    });

    if (!result.ok) {
      console.log("PREVIEW COMPILATION DIAGNOSTICS:", result.diagnostics);
    }
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const bundle = result.bundle;

    // Check sizes
    expect(bundle.species).toHaveLength(1);
    expect(bundle.stagePlaybooks).toHaveLength(12);
    expect(bundle.careRecommendations).toHaveLength(21);
    expect(bundle.guides).toHaveLength(3);
    expect(bundle.references).toHaveLength(5);

    // Verify IDs
    expect(bundle.species[0].id).toBe("plant.grape");
    expect(bundle.stagePlaybooks.map((s: any) => s.id)).toContain("grape.stage.trunk-development");
    const recIds = bundle.careRecommendations.map((r: any) => r.id);
    expect(recIds).toContain("grape.recommendation.trunk-development.watering");
    expect(recIds).toContain("grape.recommendation.trunk-development.fertilizing");

    const guideIds = bundle.guides.map((g: any) => g.id).sort();
    expect(guideIds).toContain("grape.guide.train-main-shoot");
    expect(guideIds).toContain("grape.guide.fertilization-seedling");

    const refIds = bundle.references.map((r: any) => r.id).sort();
    expect(refIds).toEqual([
      "ref.fao.grape-production",
      "ref.osu.growing-table-grapes",
      "ref.uc-ipm.young-grape-pruning",
      "ref.ucdavis.vineyard-nutrition",
      "ref.umn.growing-grapes-home-garden",
    ]);

    // Ensure no compiler-only fields like path, absolutePath, frontmatter are serialized
    const serializedString = result.serialized;
    expect(serializedString).not.toContain("absolutePath");
    expect(serializedString).not.toContain("frontmatter");
    expect(serializedString).not.toContain("sourcePath");
  });

  it("compiles the real pilot in production mode as empty arrays since all files are in review status", async () => {
    const result = await compileKnowledge({
      repositoryRoot: REPOSITORY_ROOT,
      knowledgeRoot: KNOWLEDGE_ROOT,
      mode: "production",
      write: false,
    });

    if (!result.ok) {
      console.log("PRODUCTION COMPILATION DIAGNOSTICS:", result.diagnostics);
    }
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const bundle = result.bundle;

    // Everything must be empty since no content has status: approved
    expect(bundle.species).toEqual([]);
    expect(bundle.stagePlaybooks).toEqual([]);
    expect(bundle.careRecommendations).toEqual([]);
    expect(bundle.guides).toEqual([]);
    expect(bundle.references).toEqual([]);
  });
});
