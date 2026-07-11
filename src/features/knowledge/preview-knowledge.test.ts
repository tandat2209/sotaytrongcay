import { getPreviewPlantKnowledge } from "./preview-knowledge";

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
});
