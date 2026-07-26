import {
  getCarePlansForStage,
  getNextStagePlaybook,
  getPreviewPlantKnowledge,
  getStagePlaybook,
  listFertilizerSuggestions,
  listInformationalGuidesForStage,
  listThreatsForStageId,
} from "./preview-knowledge";
import * as previewKnowledge from "./preview-knowledge";

describe("preview knowledge", () => {
  it("exposes grape stages through a typed module", () => {
    const knowledge = getPreviewPlantKnowledge();

    expect(knowledge.species.id).toBe("plant.grape");
    expect(knowledge.species.title).toBe("Nho");
    expect(knowledge.stages).toContainEqual({
      id: "grape.stage.trunk-development",
      title: "Phát triển thân",
    });
  });

  it("returns a stage playbook with objective and exit criteria for a known stage", () => {
    const playbook = getStagePlaybook("grape.stage.trunk-development");

    expect(playbook).not.toBeNull();
    expect(playbook!.id).toBe("grape.stage.trunk-development");
    expect(playbook!.primaryObjective.length).toBeGreaterThan(0);
    expect(Array.isArray(playbook!.exitCriteria)).toBe(true);
    expect(playbook!.exitCriteria.length).toBeGreaterThan(0);
  });

  it("exposes the curated stage image identity", () => {
    expect(getStagePlaybook("grape.stage.trunk-development")).toMatchObject({
      imageId: "image.grape.stage.trunk-development",
    });
  });

  it("returns null for an unknown stage ID", () => {
    expect(getStagePlaybook("unknown.stage.id")).toBeNull();
  });

  describe("getNextStagePlaybook", () => {
    it("returns the next stage in the same lifecycle by sequence", () => {
      const next = getNextStagePlaybook("grape.stage.trunk-development");

      expect(next).not.toBeNull();
      expect(next!.id).toBe("grape.stage.trellis-training");
    });

    it("returns the authored transition from development into production", () => {
      const next = getNextStagePlaybook("grape.stage.canopy-formation");

      expect(next).not.toBeNull();
      expect(next!.id).toBe("grape.stage.pruning");
    });

    it("returns null for an unknown stage ID", () => {
      expect(getNextStagePlaybook("unknown.stage")).toBeNull();
    });
  });

  describe("listInformationalGuidesForStage", () => {
    it("returns non-plan guides for a stage", () => {
      const guides = listInformationalGuidesForStage(
        "grape.stage.trunk-development",
      );

      expect(guides).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: "grape.guide.train-main-shoot" }),
        ]),
      );
    });

    it("returns an empty array for a stage without informational guides", () => {
      expect(
        listInformationalGuidesForStage("grape.stage.harvest"),
      ).toHaveLength(0);
    });
  });

  describe("getCarePlansForStage", () => {
    it("returns care plans for a stage that has them", () => {
      const recs = getCarePlansForStage("grape.stage.trunk-development");

      expect(recs.length).toBeGreaterThan(0);
      expect(recs[0]!.id).toBe(
        "grape.recommendation.trunk-development.fertilizing",
      );
      expect(recs[0]!.activityType).toBe("fertilizing");
      expect(recs[0]!.title.length).toBeGreaterThan(0);
      expect(recs[0]!.goal.length).toBeGreaterThan(0);
    });

    it("resolves Care Plan catalogue roles into prioritized fertilizer suggestions", () => {
      const plan = getCarePlansForStage("grape.stage.canopy-formation").find(
        (candidate) => candidate.activityType === "fertilizing",
      );

      expect(plan?.fertilizerSuggestions).toEqual(
        expect.arrayContaining([
          {
            id: "fertilizer-role.high-potassium",
            name: "Phân giàu kali",
            group: "potassium-rich",
            priority: "primary",
          },
        ]),
      );
    });

    it("exposes fertilizer chips for the default trunk-development stage", () => {
      const plan = getCarePlansForStage("grape.stage.trunk-development").find(
        (candidate) => candidate.activityType === "fertilizing",
      );

      expect(plan?.fertilizerSuggestions).toEqual([
        {
          id: "fertilizer-role.high-nitrogen",
          name: "Phân giàu đạm",
          group: "nitrogen-rich",
          priority: "primary",
        },
        {
          id: "fertilizer-role.balanced-nutrition",
          name: "NPK cân đối",
          group: "npk-balanced",
          priority: "alternative",
        },
        {
          id: "fertilizer-role.organic-foundation",
          name: "Phân hữu cơ",
          group: "organic",
          priority: "alternative",
        },
      ]);
    });

    it("exposes stage-specific fertilizer-group guidance", () => {
      const plan = getCarePlansForStage("grape.stage.trunk-development").find(
        (candidate) => candidate.activityType === "fertilizing",
      );

      expect(plan?.fertilizerGroupGuidance).toEqual([
        {
          group: "nitrogen-rich",
          description: expect.stringContaining("thân và lá"),
        },
        {
          group: "npk-balanced",
          description: expect.stringContaining("đạm, lân và kali"),
        },
      ]);
    });

    it("returns an empty array for a stage with no plans", () => {
      expect(getCarePlansForStage("grape.stage.nonexistent")).toHaveLength(0);
    });
  });

  it("lists stage threat guidance without requiring a plant record", () => {
    expect(
      listThreatsForStageId("grape.stage.trunk-development").map(
        (threat) => threat.id,
      ),
    ).toContain("pest.grape.scale-insects");
  });

  it("lists curated spraying targets by species without using stage eligibility", () => {
    const listSprayTargets: unknown = Reflect.get(
      previewKnowledge,
      "listSprayTargets",
    );

    expect(typeof listSprayTargets).toBe("function");
    if (typeof listSprayTargets !== "function") return;

    expect(listSprayTargets("plant.grape")).toEqual([
      {
        id: "disease.grape.powdery-mildew",
        kind: "disease",
        title: "Bệnh phấn trắng trên nho",
      },
      {
        id: "pest.grape.aphids",
        kind: "pest",
        title: "Rệp muội trên nho",
      },
      {
        id: "pest.grape.mealybugs",
        kind: "pest",
        title: "Rệp sáp trên nho",
      },
      {
        id: "pest.grape.phylloxera",
        kind: "pest",
        title: "Rệp hại rễ nho (Phylloxera)",
      },
      {
        id: "pest.grape.scale-insects",
        kind: "pest",
        title: "Rệp vảy trên nho",
      },
      {
        id: "pest.grape.thrips",
        kind: "pest",
        title: "Bọ trĩ hại nho",
      },
    ]);
    expect(listSprayTargets("plant.unknown")).toEqual([]);
  });

  it("lists review-stage threats for monitoring in a matching stage", () => {
    const listThreatsForStage: unknown = Reflect.get(
      previewKnowledge,
      "listThreatsForStage",
    );

    expect(typeof listThreatsForStage).toBe("function");
    if (typeof listThreatsForStage !== "function") return;

    expect(
      listThreatsForStage({
        speciesId: "plant.grape",
        stageId: "grape.stage.bud-break",
      }).map((threat: { id: string }) => threat.id),
    ).toEqual([
      "disease.grape.powdery-mildew",
      "pest.grape.aphids",
      "pest.grape.mealybugs",
      "pest.grape.scale-insects",
      "pest.grape.thrips",
    ]);
    expect(
      listThreatsForStage({
        speciesId: "plant.grape",
        stageId: "grape.stage.nonexistent",
      }),
    ).toEqual([]);
  });

  it("lists the focused fertilizer guide in authored section order", () => {
    const suggestions = listFertilizerSuggestions();
    expect(suggestions).toHaveLength(9);
    expect(suggestions[0]).toEqual({
      id: "fertilizer-role.organic-foundation",
      name: "Phân hữu cơ",
      group: "organic",
      description: "Ví dụ: phân trùn quế, phân chuồng hoai mục.",
      section: {
        id: "foundation",
        title: "Nhóm nền tảng",
      },
    });
    expect(suggestions.map(({ id }) => id)).toEqual([
      "fertilizer-role.organic-foundation",
      "fertilizer-role.soil-support",
      "fertilizer-role.balanced-nutrition",
      "fertilizer-role.high-nitrogen",
      "fertilizer-role.high-phosphorus",
      "fertilizer-role.calcium-boron",
      "fertilizer-role.high-potassium",
      "fertilizer-role.potassium-only",
      "fertilizer-role.magnesium",
    ]);
  });
});
