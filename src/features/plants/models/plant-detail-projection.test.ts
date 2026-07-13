import type { CareActivity } from "@/features/journal";
import type { Plant } from "./plant";
import { createPlantDetailProjection } from "./plant-detail-projection";

const plant: Plant = {
  id: "a775a7ec-fb44-4660-88ed-0f3b1933e7f1",
  name: "Nho sân thượng",
  speciesId: "plant.grape",
  stageId: "grape.stage.trunk-development", growingMethod: "container" as const,
  location: null,
  plantedAt: null,
  createdAt: "2026-07-11T08:00:00.000Z",
};

function activity(type: CareActivity["type"], occurredAt: string, id: string): CareActivity {
  return {
    id,
    mutationId: "c353342e-9fe0-43a3-9d84-1b0ed436011d",
    plantId: plant.id,
    type,
    occurredAt,
    origin: "manual",
    amount: type === "watering" ? { value: 1.5, unit: "liter" } : null,
    notes: null,
    createdAt: occurredAt,
  };
}

describe("createPlantDetailProjection", () => {
  it("derives latest care by type from unsorted saved activity history", () => {
    const projection = createPlantDetailProjection({
      activities: [
        activity("watering", "2026-07-10T08:00:00.000Z", "86ee7489-6147-42b9-b73f-5650ea7fd214"),
        activity("fertilizing", "2026-07-12T08:00:00.000Z", "a791e36d-b28e-4542-bf31-7c5ebac16d21"),
        activity("watering", "2026-07-13T08:00:00.000Z", "b791e36d-b28e-4542-bf31-7c5ebac16d21"),
        activity("spraying", "2026-07-11T08:00:00.000Z", "c791e36d-b28e-4542-bf31-7c5ebac16d21"),
      ],
      plant,
    });

    expect(projection.stageTitle).toBe("Phát triển thân");
    expect(projection.stagePlaybook).not.toBeNull();
    expect(projection.stagePlaybook?.primaryObjective).toBeTruthy();
    expect(projection.latestCare.watering?.id).toBe("b791e36d-b28e-4542-bf31-7c5ebac16d21");
    expect(projection.latestCare.fertilizing?.id).toBe("a791e36d-b28e-4542-bf31-7c5ebac16d21");
    expect(projection.latestCare.spraying?.id).toBe("c791e36d-b28e-4542-bf31-7c5ebac16d21");
    expect(projection.recentCare.map((item) => item.id)).toEqual([
      "b791e36d-b28e-4542-bf31-7c5ebac16d21",
      "a791e36d-b28e-4542-bf31-7c5ebac16d21",
      "c791e36d-b28e-4542-bf31-7c5ebac16d21",
      "86ee7489-6147-42b9-b73f-5650ea7fd214",
    ]);
  });

  it("caps recentCare at 5 entries regardless of total activity count", () => {
    const activities = [
      activity("watering", "2026-07-15T08:00:00.000Z", "aa000001-0000-0000-0000-000000000001"),
      activity("fertilizing", "2026-07-14T08:00:00.000Z", "aa000002-0000-0000-0000-000000000002"),
      activity("spraying", "2026-07-13T08:00:00.000Z", "aa000003-0000-0000-0000-000000000003"),
      activity("watering", "2026-07-12T08:00:00.000Z", "aa000004-0000-0000-0000-000000000004"),
      activity("fertilizing", "2026-07-11T08:00:00.000Z", "aa000005-0000-0000-0000-000000000005"),
      activity("watering", "2026-07-10T08:00:00.000Z", "aa000006-0000-0000-0000-000000000006"),
    ];
    const projection = createPlantDetailProjection({ activities, plant });

    expect(projection.recentCare).toHaveLength(5);
    const ids = projection.recentCare.map((a) => a.id);
    expect(ids[0]).toBe("aa000001-0000-0000-0000-000000000001");
    expect(ids[4]).toBe("aa000005-0000-0000-0000-000000000005");
  });

  it("falls back to an unknown stage without inferring care or health", () => {
    const projection = createPlantDetailProjection({
      activities: [],
      plant: { ...plant, speciesId: "plant.unknown", stageId: "unknown.stage" },
    });

    expect(projection.stageTitle).toBe("Chưa xác định");
    expect(projection.stagePlaybook).toBeNull();
    expect(projection.latestCare).toEqual({ fertilizing: null, spraying: null, watering: null });
    expect(projection.recentCare).toEqual([]);
  });

  it("returns stagePlaybook with objective and exit criteria for a known grape stage", () => {
    const projection = createPlantDetailProjection({ activities: [], plant });

    expect(projection.stagePlaybook).not.toBeNull();
    expect(typeof projection.stagePlaybook?.primaryObjective).toBe("string");
    expect(projection.stagePlaybook!.primaryObjective.length).toBeGreaterThan(0);
    expect(Array.isArray(projection.stagePlaybook?.exitCriteria)).toBe(true);
    expect(projection.stagePlaybook!.exitCriteria.length).toBeGreaterThan(0);
  });

  it("returns stagePlaybook as null for an unknown stage ID", () => {
    const unknownPlant = { ...plant, speciesId: "plant.unknown", stageId: "unknown.stage" };
    const projection = createPlantDetailProjection({ activities: [], plant: unknownPlant });

    expect(projection.stagePlaybook).toBeNull();
  });
});
