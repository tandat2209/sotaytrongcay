import type { CareActivity } from "@/features/journal";
import type { Plant } from "./plant";
import { createPlantDetailProjection } from "./plant-detail-projection";

const evaluatedAt = new Date("2026-07-13T10:00:00.000Z");
const plant: Plant = {
  id: "a775a7ec-fb44-4660-88ed-0f3b1933e7f1",
  name: "Nho sân thượng",
  speciesId: "plant.grape",
  stageId: "grape.stage.trunk-development",
  growingMethod: "container",
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

function project(activities: readonly CareActivity[] = [], selectedPlant = plant) {
  return createPlantDetailProjection({ activities, evaluatedAt, plant: selectedPlant });
}

describe("createPlantDetailProjection", () => {
  it("projects the ordered lifecycle and marks only the current stage", () => {
    const projection = project();

    expect(projection.lifecycleStages.length).toBeGreaterThan(1);
    expect(projection.lifecycleStages.filter((stage) => stage.isCurrent)).toEqual([
      expect.objectContaining({ id: plant.stageId, title: "Phát triển thân" }),
    ]);
  });

  it("builds watering and fertilizing cards from reviewed plans", () => {
    const projection = project([
      activity("watering", "2026-07-12T08:00:00.000Z", "86ee7489-6147-42b9-b73f-5650ea7fd214"),
    ]);

    expect(projection.careCards.map((card) => card.activityType)).toEqual(["watering", "fertilizing"]);
    expect(projection.careCards[0]).toEqual(expect.objectContaining({
      evaluation: expect.objectContaining({ status: "not_recommended" }),
      frequencyDisplay: null,
      lastActivity: expect.objectContaining({ id: "86ee7489-6147-42b9-b73f-5650ea7fd214" }),
    }));
    expect(projection.careCards[1]?.title).toEqual(expect.any(String));
  });

  it("selects frequency for the plant growing method when the plan defines it", () => {
    const container = project().careCards.find((card) => card.activityType === "fertilizing");
    const ground = project([], { ...plant, growingMethod: "ground" }).careCards.find((card) => card.activityType === "fertilizing");

    expect(container?.frequencyDisplay).toEqual(expect.any(String));
    expect(ground?.frequencyDisplay).toEqual(expect.any(String));
    expect(container?.frequencyDisplay).not.toBe(ground?.frequencyDisplay);
  });

  it("derives latest care without mutating unsorted history", () => {
    const activities = [
      activity("watering", "2026-07-10T08:00:00.000Z", "86ee7489-6147-42b9-b73f-5650ea7fd214"),
      activity("fertilizing", "2026-07-12T08:00:00.000Z", "a791e36d-b28e-4542-bf31-7c5ebac16d21"),
      activity("watering", "2026-07-13T08:00:00.000Z", "b791e36d-b28e-4542-bf31-7c5ebac16d21"),
      activity("spraying", "2026-07-11T08:00:00.000Z", "c791e36d-b28e-4542-bf31-7c5ebac16d21"),
    ];
    const originalOrder = activities.map((item) => item.id);
    const projection = project(activities);

    expect(projection.latestCare.watering?.id).toBe("b791e36d-b28e-4542-bf31-7c5ebac16d21");
    expect(projection.latestCare.fertilizing?.id).toBe("a791e36d-b28e-4542-bf31-7c5ebac16d21");
    expect(projection.latestCare.spraying?.id).toBe("c791e36d-b28e-4542-bf31-7c5ebac16d21");
    expect(activities.map((item) => item.id)).toEqual(originalOrder);
  });

  it("keeps only three recent activities", () => {
    const projection = project([
      activity("watering", "2026-07-15T08:00:00.000Z", "aa000001-0000-0000-0000-000000000001"),
      activity("fertilizing", "2026-07-14T08:00:00.000Z", "aa000002-0000-0000-0000-000000000002"),
      activity("spraying", "2026-07-13T08:00:00.000Z", "aa000003-0000-0000-0000-000000000003"),
      activity("watering", "2026-07-12T08:00:00.000Z", "aa000004-0000-0000-0000-000000000004"),
    ]);

    expect(projection.recentCare.map((item) => item.id)).toEqual([
      "aa000001-0000-0000-0000-000000000001",
      "aa000002-0000-0000-0000-000000000002",
      "aa000003-0000-0000-0000-000000000003",
    ]);
  });

  it("uses truthful empty guidance for unknown knowledge", () => {
    const projection = project([], { ...plant, speciesId: "plant.unknown", stageId: "unknown.stage" });

    expect(projection.stageTitle).toBe("Chưa xác định");
    expect(projection.stagePlaybook).toBeNull();
    expect(projection.lifecycleStages).toEqual([]);
    expect(projection.careCards).toEqual([
      expect.objectContaining({ activityType: "watering", evaluation: null, frequencyDisplay: null }),
      expect.objectContaining({ activityType: "fertilizing", evaluation: null, frequencyDisplay: null }),
    ]);
  });
});
