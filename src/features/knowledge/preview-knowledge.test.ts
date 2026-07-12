import { getPreviewPlantKnowledge, getStagePlaybook } from "./preview-knowledge";

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
});
