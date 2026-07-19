import {
  plantFromRow,
  plantToInsertParams,
  plantToUpdateParams,
} from "./plant-repository";

const plant = {
  id: "a775a7ec-fb44-4660-88ed-0f3b1933e7f1",
  name: "Nho sân thượng",
  speciesId: "plant.grape",
  stageId: "grape.stage.trunk-development",
  growingMethod: "container" as const,
  location: null,
  plantedAt: null,
  stageStartedAt: "2026-07-10T08:00:00.000Z",
  createdAt: "2026-07-11T08:00:00.000Z",
} as const;

describe("plant repository mapping", () => {
  it("maps a plant to SQLite insert parameters", () => {
    expect(plantToInsertParams(plant)).toEqual([
      plant.id,
      plant.name,
      plant.speciesId,
      plant.stageId,
      plant.growingMethod,
      null, // location
      null, // plantedAt
      plant.stageStartedAt,
      plant.createdAt,
    ]);
  });

  it("maps a plant with location to insert parameters", () => {
    const withLocation = { ...plant, location: "Ban công hướng Đông" };
    expect(plantToInsertParams(withLocation)[5]).toBe("Ban công hướng Đông");
  });

  it("parses a SQLite row into a plant", () => {
    expect(
      plantFromRow({
        id: plant.id,
        name: plant.name,
        species_id: plant.speciesId,
        stage_id: plant.stageId,
        growing_method: plant.growingMethod,
        location: null,
        planted_at: null,
        stage_started_at: plant.stageStartedAt,
        archived_at: null,
        created_at: plant.createdAt,
      }),
    ).toEqual(plant);
  });

  it("parses a SQLite row with location into a plant", () => {
    const result = plantFromRow({
      id: plant.id,
      name: plant.name,
      species_id: plant.speciesId,
      stage_id: plant.stageId,
      growing_method: plant.growingMethod,
      location: "Ban công hướng Đông",
      planted_at: null,
      stage_started_at: plant.stageStartedAt,
      archived_at: null,
      created_at: plant.createdAt,
    });
    expect(result.location).toBe("Ban công hướng Đông");
  });

  it("maps editable profile fields to SQLite update parameters", () => {
    expect(
      plantToUpdateParams(plant.id, {
        growingMethod: "ground",
        name: "  Nho trước sân  ",
        plantedAt: "2026-06-01",
      }),
    ).toEqual(["Nho trước sân", "ground", "2026-06-01", plant.id]);
  });

  it("rejects an empty edited plant name", () => {
    expect(() =>
      plantToUpdateParams(plant.id, {
        growingMethod: "container",
        name: "   ",
        plantedAt: null,
      }),
    ).toThrow();
  });
});
