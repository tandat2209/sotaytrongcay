import { PlantSchema } from "./plant";

describe("PlantSchema", () => {
  it("requires a name and species-defined stage", () => {
    const plant = PlantSchema.parse({
      id: "a775a7ec-fb44-4660-88ed-0f3b1933e7f1",
      name: "Nho sân thượng",
      speciesId: "plant.grape",
      stageId: "grape.stage.trunk-development",
      location: null,
      plantedAt: null,
      createdAt: "2026-07-11T08:00:00.000Z",
    });

    expect(plant.name).toBe("Nho sân thượng");
    expect(plant.location).toBeNull();
  });

  it("rejects a blank name", () => {
    expect(() =>
      PlantSchema.parse({
        id: "a775a7ec-fb44-4660-88ed-0f3b1933e7f1",
        name: "  ",
        speciesId: "plant.grape",
        stageId: "grape.stage.trunk-development",
        location: null,
        plantedAt: null,
        createdAt: "2026-07-11T08:00:00.000Z",
      }),
    ).toThrow();
  });

  it("accepts an optional location", () => {
    const plant = PlantSchema.parse({
      id: "a775a7ec-fb44-4660-88ed-0f3b1933e7f1",
      name: "Nho sân thượng",
      speciesId: "plant.grape",
      stageId: "grape.stage.trunk-development",
      location: "Ban công hướng Đông",
      plantedAt: null,
      createdAt: "2026-07-11T08:00:00.000Z",
    });

    expect(plant.location).toBe("Ban công hướng Đông");
  });
});
