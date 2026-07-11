import { plantFromRow, plantToInsertParams } from "./plant-repository";

const plant = {
  id: "a775a7ec-fb44-4660-88ed-0f3b1933e7f1",
  name: "Nho sân thượng",
  speciesId: "plant.grape",
  stageId: "grape.stage.trunk-development",
  plantedAt: null,
  createdAt: "2026-07-11T08:00:00.000Z",
} as const;

describe("plant repository mapping", () => {
  it("maps a plant to SQLite insert parameters", () => {
    expect(plantToInsertParams(plant)).toEqual([
      plant.id,
      plant.name,
      plant.speciesId,
      plant.stageId,
      null,
      plant.createdAt,
    ]);
  });

  it("parses a SQLite row into a plant", () => {
    expect(
      plantFromRow({
        id: plant.id,
        name: plant.name,
        species_id: plant.speciesId,
        stage_id: plant.stageId,
        planted_at: null,
        created_at: plant.createdAt,
      }),
    ).toEqual(plant);
  });
});
