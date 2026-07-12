import {
  getCareGuideForStage,
  getCareRecommendationsForStage,
  getNextStagePlaybook,
  getPreviewPlantKnowledge,
  getStagePlaybook,
} from "./preview-knowledge";

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
    expect(playbook!.recommendedKnowledgeTopics.length).toBeGreaterThan(0);
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

    it("returns null for the last stage in a lifecycle", () => {
      // recovery is sequence 8, the last in the production lifecycle
      const next = getNextStagePlaybook("grape.stage.recovery");

      expect(next).toBeNull();
    });

    it("returns null for an unknown stage ID", () => {
      expect(getNextStagePlaybook("unknown.stage")).toBeNull();
    });
  });

  describe("getCareGuideForStage", () => {
    it("returns a care guide for a stage that has one", () => {
      const guide = getCareGuideForStage("grape.stage.trunk-development");

      expect(guide).not.toBeNull();
      expect(guide!.id).toBe("grape.guide.fertilization-trunk-development");
      expect(guide!.title.length).toBeGreaterThan(0);
    });

    it("returns null for a stage without a guide", () => {
      expect(getCareGuideForStage("grape.stage.harvest")).toBeNull();
    });
  });

  describe("getCareRecommendationsForStage", () => {
    it("returns care recommendations for a stage that has them", () => {
      const recs = getCareRecommendationsForStage("grape.stage.trunk-development");

      expect(recs.length).toBeGreaterThan(0);
      expect(recs[0]!.id).toBe("grape.recommendation.check-soil-before-watering");
      expect(recs[0]!.activityType).toBe("watering");
    });

    it("returns an empty array for a stage with no recommendations", () => {
      expect(getCareRecommendationsForStage("grape.stage.harvest")).toHaveLength(0);
    });
  });
});
