import { createTodayProjection, productionWeather } from "./today-projection";

const plant = { id: "a775a7ec-fb44-4660-88ed-0f3b1933e7f1", name: "Nho sân thượng", speciesId: "plant.grape", stageId: "grape.stage.trunk-development", location: null, plantedAt: null, createdAt: "2026-07-11T08:00:00.000Z" };
const activities = [
  { id: "b775a7ec-fb44-4660-88ed-0f3b1933e7f1", mutationId: "c775a7ec-fb44-4660-88ed-0f3b1933e7f1", plantId: plant.id, type: "watering" as const, occurredAt: "2026-07-12T10:00:00.000Z", origin: "manual" as const, amount: null, notes: null, createdAt: "2026-07-12T10:00:00.000Z" },
  { id: "d775a7ec-fb44-4660-88ed-0f3b1933e7f1", mutationId: "e775a7ec-fb44-4660-88ed-0f3b1933e7f1", plantId: "f775a7ec-fb44-4660-88ed-0f3b1933e7f1", type: "spraying" as const, occurredAt: "2026-07-12T11:00:00.000Z", origin: "manual" as const, amount: null, notes: null, createdAt: "2026-07-12T11:00:00.000Z" },
];

describe("createTodayProjection", () => {
  it("labels known and deleted-plant activities without dropping history", () => {
    const projection = createTodayProjection({ activities, plants: [plant] });
    expect(projection.recentActivities).toEqual([
      expect.objectContaining({ id: activities[1]?.id, plantName: "Cây trồng" }),
      expect.objectContaining({ id: activities[0]?.id, plantName: plant.name }),
    ]);
  });

  it("uses the production unavailable-weather default", () => {
    expect(createTodayProjection({ activities: [], plants: [] }).weather).toEqual(productionWeather);
  });

  it("keeps recommended care as a priority and negative care as an evaluation", () => {
    const evaluations = [
      { id: "watering", plantId: plant.id, activityType: "watering" as const, title: "Kiểm tra đất trước khi tưới", status: "recommended" as const, explanation: "Lần ghi gần nhất cách đây 3 ngày.", daysSinceLastActivity: 3, definitionId: "grape.recommendation.check-soil-before-watering", definitionVersion: "1.0.0" },
      { id: "fertilizing", plantId: plant.id, activityType: "fertilizing" as const, title: "Bón phân", status: "not_recommended" as const, explanation: "Đã bón phân hôm qua.", daysSinceLastActivity: 1, definitionId: "grape.recommendation.fertilizing", definitionVersion: "1.0.0" },
    ];

    const projection = createTodayProjection({ activities: [], evaluations, plants: [plant] });

    expect(projection.priorities).toHaveLength(1);
    expect(projection.priorities[0]?.activityType).toBe("watering");
    expect(projection.priorities[0]?.stageId).toBe(plant.stageId);
    expect(projection.priorities[0]?.stageTitle).toBe("Phát triển thân");
    expect(projection.evaluations).toHaveLength(2);
  });
});
