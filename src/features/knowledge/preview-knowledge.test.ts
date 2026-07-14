import {
  getCarePlansForStage,
  getNextStagePlaybook,
  getPreviewPlantKnowledge,
  getStagePlaybook,
  listInformationalGuidesForStage,
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

    it("returns an empty array for a stage with no plans", () => {
      expect(getCarePlansForStage("grape.stage.nonexistent")).toHaveLength(0);
    });
  });
});
