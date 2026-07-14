import type { CareActivity, PlantUpdate } from "@/features/journal";
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
  plantedAt: "2026-07-01",
  stageStartedAt: "2026-07-10T08:00:00.000Z",
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

function plantUpdate(occurredAt: string, id: string): PlantUpdate {
  return {
    id,
    mutationId: "e5ba0d31-9de3-433b-b475-4d8bec3b6a48",
    plantId: plant.id,
    occurredAt,
    notes: "Cây có chồi mới.",
    stageId: plant.stageId,
    photos: [],
    createdAt: occurredAt,
  };
}

function project(activities: readonly CareActivity[] = [], selectedPlant = plant, updates: readonly PlantUpdate[] = []) {
  return createPlantDetailProjection({ activities, evaluatedAt, plant: selectedPlant, updates });
}

describe("createPlantDetailProjection", () => {
  it("projects elapsed days only from persisted plant and stage dates", () => {
    expect(project().ageLabels).toEqual(["3 ngày ở giai đoạn này", "Đã trồng 12 ngày"]);
    expect(project([], { ...plant, plantedAt: null, stageStartedAt: null }).ageLabels).toEqual([]);
    expect(project([], { ...plant, plantedAt: "2026-07-14", stageStartedAt: "2026-07-14T08:00:00.000Z" }).ageLabels).toEqual([]);
  });

  it("uses clear same-day age labels", () => {
    expect(project([], { ...plant, plantedAt: "2026-07-13", stageStartedAt: "2026-07-13T08:00:00.000Z" }).ageLabels).toEqual([
      "Bắt đầu giai đoạn hôm nay",
      "Trồng hôm nay",
    ]);
  });

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

    expect(container?.details).toEqual(expect.objectContaining({
      frequencyDisplay: "Mỗi 1–2 tuần ở nửa liều so với trồng đất",
      goal: expect.stringContaining("Thúc đẩy sinh trưởng mạnh"),
      notes: expect.arrayContaining([expect.stringContaining("Thừa đạm")]),
      recommendedInputs: expect.arrayContaining([
        expect.objectContaining({ group: "Phân giàu đạm (high-N)", examples: expect.stringContaining("Urê") }),
      ]),
    }));
    expect(ground?.details?.frequencyDisplay).toBe("Mỗi 2–4 tuần trong giai đoạn sinh trưởng mạnh");
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

  it("interleaves care and plant updates in three recent journal entries", () => {
    const projection = project([
      activity("watering", "2026-07-15T08:00:00.000Z", "aa000001-0000-0000-0000-000000000001"),
      activity("spraying", "2026-07-13T08:00:00.000Z", "aa000003-0000-0000-0000-000000000003"),
      activity("watering", "2026-07-12T08:00:00.000Z", "aa000004-0000-0000-0000-000000000004"),
    ], plant, [
      plantUpdate("2026-07-16T08:00:00.000Z", "bb000001-0000-0000-0000-000000000001"),
      plantUpdate("2026-07-14T08:00:00.000Z", "bb000002-0000-0000-0000-000000000002"),
    ]);

    expect(projection.recentJournalItems.map((item) => `${item.kind}:${item.id}`)).toEqual([
      "update:bb000001-0000-0000-0000-000000000001",
      "care:aa000001-0000-0000-0000-000000000001",
      "update:bb000002-0000-0000-0000-000000000002",
    ]);
  });

  it("projects the latest saved journal photo", () => {
    const update: PlantUpdate = {
      id: "86ee7489-6147-42b9-b73f-5650ea7fd214",
      mutationId: "c353342e-9fe0-43a3-9d84-1b0ed436011d",
      plantId: plant.id,
      occurredAt: "2026-07-13T15:00:00.000Z",
      notes: null,
      stageId: plant.stageId,
      photos: [{ id: "7174d8e3-df23-4f13-9e06-245ebfc9877b", localUri: "file:///journal/latest.jpg", position: 0, createdAt: "2026-07-13T15:00:00.000Z" }],
      createdAt: "2026-07-13T15:00:00.000Z",
    };

    expect(project([], plant, [update]).latestPhotoUri).toBe("file:///journal/latest.jpg");
  });

  it("uses truthful empty guidance for unknown knowledge", () => {
    const projection = project([], { ...plant, speciesId: "plant.unknown", stageId: "unknown.stage" });

    expect(projection.stageTitle).toBe("Chưa xác định");
    expect(projection.stagePlaybook).toBeNull();
    expect(projection.lifecycleStages).toEqual([]);
    expect(projection.careCards).toEqual([
      expect.objectContaining({ activityType: "watering", details: null, evaluation: null, frequencyDisplay: null }),
      expect.objectContaining({ activityType: "fertilizing", details: null, evaluation: null, frequencyDisplay: null }),
    ]);
  });
});
