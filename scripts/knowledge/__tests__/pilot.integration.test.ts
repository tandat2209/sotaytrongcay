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

    const bundle = result.bundle as Readonly<{
      schemaVersion: string;
      species: readonly Readonly<{ id: string }>[];
      stagePlaybooks: readonly Readonly<{ id: string }>[];
      carePlans: readonly Readonly<{
        id: string;
        recommendedInputs?: readonly Readonly<{
          id: string;
          name: string;
          group: string;
        }>[];
      }>[];
      guides: readonly Readonly<{ id: string }>[];
      diseases: readonly Readonly<{ id: string }>[];
      pests: readonly Readonly<{ id: string }>[];
      references: readonly Readonly<{ id: string }>[];
    }>;

    // Check sizes
    expect(bundle.schemaVersion).toBe("2.0.0");
    expect(bundle.species).toHaveLength(1);
    expect(bundle.stagePlaybooks).toHaveLength(12);
    expect(bundle.carePlans).toHaveLength(22);
    expect(bundle.guides).toHaveLength(3);
    expect(bundle.diseases).toHaveLength(1);
    expect(bundle.pests).toHaveLength(5);
    expect(bundle.references).toHaveLength(15);

    // Verify IDs
    expect(bundle.species[0]?.id).toBe("plant.grape");
    expect(bundle.stagePlaybooks.map((stage) => stage.id)).toContain(
      "grape.stage.trunk-development",
    );
    const recIds = bundle.carePlans.map((plan) => plan.id);
    expect(recIds).toContain("grape.recommendation.trunk-development.watering");
    expect(recIds).toContain(
      "grape.recommendation.trunk-development.fertilizing",
    );
    expect(recIds).toContain(
      "grape.recommendation.bud-break.powdery-mildew-prevention",
    );
    const budBreakFertilizing = bundle.carePlans.find(
      (plan) => plan.id === "grape.recommendation.bud-break.fertilizing",
    );
    expect(budBreakFertilizing?.recommendedInputs).toEqual(
      expect.arrayContaining([
        {
          id: "fertilizer.urea",
          name: "Urê",
          group: "nitrogen-rich",
        },
        {
          id: "fertilizer.npk-20-10-10",
          name: "NPK 20-10-10",
          group: "nitrogen-rich",
        },
      ]),
    );
    expect(budBreakFertilizing?.recommendedInputs?.[0]).not.toHaveProperty(
      "suggestions",
    );

    const guideIds = bundle.guides.map((guide) => guide.id).sort();
    expect(guideIds).toContain("grape.guide.train-main-shoot");
    expect(guideIds).toContain("grape.guide.fertilization-seedling");

    expect(bundle.diseases.map((disease) => disease.id)).toEqual([
      "disease.grape.powdery-mildew",
    ]);
    expect(bundle.pests.map((pest) => pest.id)).toEqual([
      "pest.grape.aphids",
      "pest.grape.mealybugs",
      "pest.grape.phylloxera",
      "pest.grape.scale-insects",
      "pest.grape.thrips",
    ]);

    const refIds = bundle.references.map((reference) => reference.id).sort();
    expect(refIds).toEqual([
      "ref.fao.grape-production",
      "ref.osu.growing-table-grapes",
      "ref.uc-ipm.grape-aphids",
      "ref.uc-ipm.grape-european-fruit-lecanium-scale",
      "ref.uc-ipm.grape-phylloxera",
      "ref.uc-ipm.grape-powdery-mildew",
      "ref.uc-ipm.grape-vine-mealybug",
      "ref.uc-ipm.growing-grape",
      "ref.uc-ipm.young-grape-pruning",
      "ref.ucdavis.vineyard-nutrition",
      "ref.umn.fertilizer-urea",
      "ref.umn.growing-grapes-home-garden",
      "ref.umn.high-tunnel-nutrient-management",
      "ref.vaas.grape-nh01-48",
      "ref.vusta.grape-thrips",
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

    const bundle = result.bundle as Readonly<{
      schemaVersion: string;
      species: readonly Readonly<{ id: string }>[];
      stagePlaybooks: readonly Readonly<{ id: string }>[];
      carePlans: readonly Readonly<{ id: string }>[];
      guides: readonly Readonly<{ id: string }>[];
      references: readonly Readonly<{ id: string }>[];
    }>;

    // Everything must be empty since no content has status: approved
    expect(bundle.schemaVersion).toBe("1.0.0");
    expect(bundle.species).toEqual([]);
    expect(bundle.stagePlaybooks).toEqual([]);
    expect(bundle.carePlans).toEqual([]);
    expect(bundle.guides).toEqual([]);
    expect(bundle.references).toEqual([]);
    expect(bundle).not.toHaveProperty("diseases");
    expect(bundle).not.toHaveProperty("pests");
  });
});
