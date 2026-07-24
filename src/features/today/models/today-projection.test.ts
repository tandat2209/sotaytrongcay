import type { CarePlan } from "@/features/knowledge";
import type { PlantCarePlanScheduleSnapshot } from "@/features/reminders";
import { createTodayProjection, productionWeather } from "./today-projection";

const plant = {
  id: "a775a7ec-fb44-4660-88ed-0f3b1933e7f1",
  name: "Nho sân thượng",
  speciesId: "plant.grape",
  stageId: "grape.stage.trunk-development",
  growingMethod: "container" as const,
  location: null,
  plantedAt: null,
  stageStartedAt: null,
  createdAt: "2026-07-11T08:00:00.000Z",
};
const activity = {
  id: "b775a7ec-fb44-4660-88ed-0f3b1933e7f1",
  mutationId: "c775a7ec-fb44-4660-88ed-0f3b1933e7f1",
  plantId: plant.id,
  type: "watering" as const,
  occurredAt: "2026-07-12T10:00:00.000Z",
  origin: "manual" as const,
  intensity: null,
  estimatedAmountLiters: null,
  notes: null,
  createdAt: "2026-07-12T10:00:00.000Z",
};
const plan: CarePlan = {
  id: "grape.plan.watering",
  title: "Kiểm tra đất trước khi tưới",
  goal: "Kiểm tra độ ẩm trước khi tưới.",
  bodyMarkdown: "",
  priority: 10,
  activityType: "watering",
  eligibility: { kind: "elapsed_days_since_activity", suggestAfterDays: 2 },
  onMissingHistory: "suggest",
  frequency: {
    ground: { display: "Mỗi 3 ngày", intervalDays: 3 },
    container: { display: "Mỗi 3 ngày", intervalDays: 3 },
  },
  fertilizerSuggestions: [
    { id: "fertilizer.npk", name: "NPK", group: "npk-balanced" },
  ],
  recommendedInputs: [
    { id: "fertilizer.npk", name: "NPK", group: "npk-balanced" },
  ],
  version: "1.0.0",
};
const plantSnapshot: PlantCarePlanScheduleSnapshot = {
  id: "11111111-1111-4111-8111-111111111111",
  mutationId: "22222222-2222-4222-8222-222222222222",
  plantId: plant.id,
  carePlanId: plan.id,
  intervalDays: 5,
  notificationTime: null,
  notificationEnabled: false,
  notificationOverridden: false,
  isActive: true,
  createdAt: "2026-07-11T00:00:00.000Z",
  updatedAt: "2026-07-11T00:00:00.000Z",
};
const plansByPlant = new Map([[plant.id, [plan]]]);

describe("createTodayProjection", () => {
  it("preserves recent history and unavailable weather", () => {
    const deletedPlantActivity = {
      ...activity,
      id: "d775a7ec-fb44-4660-88ed-0f3b1933e7f1",
      mutationId: "e775a7ec-fb44-4660-88ed-0f3b1933e7f1",
      plantId: "f775a7ec-fb44-4660-88ed-0f3b1933e7f1",
      occurredAt: "2026-07-12T11:00:00.000Z",
    };
    const projection = createTodayProjection({
      activities: [activity, deletedPlantActivity],
      plants: [plant],
    });

    expect(projection.recentActivities[0]?.plantName).toBe("Cây trồng");
    expect(projection.weather).toEqual(productionWeather);
  });

  it("uses custom reminder frequency as the only due rule", () => {
    const projection = createTodayProjection({
      activities: [activity],
      evaluatedAt: new Date("2026-07-16T12:00:00.000Z"),
      plansByPlant,
      plants: [plant],
      plantSnapshots: [plantSnapshot],
    });

    expect(projection.careCards).toEqual([]);
  });

  it("emits one exact reminder-backed card when due", () => {
    const projection = createTodayProjection({
      activities: [activity],
      evaluatedAt: new Date("2026-07-17T12:00:00.000Z"),
      plansByPlant,
      plants: [plant],
      plantSnapshots: [plantSnapshot],
    });

    expect(projection.careCards).toEqual([
      expect.objectContaining({
        carePlanId: plan.id,
        dueStatus: "due",
        fertilizerSuggestions: plan.fertilizerSuggestions,
        suggestion: "NPK",
      }),
    ]);
  });

  it("falls back to the current stage schedule when a plant snapshot is inactive", () => {
    const projection = createTodayProjection({
      activities: [activity],
      evaluatedAt: new Date("2026-07-20T12:00:00.000Z"),
      plansByPlant,
      plants: [plant],
      plantSnapshots: [{ ...plantSnapshot, isActive: false }],
    });

    expect(projection.careCards[0]).toMatchObject({ dueStatus: "overdue" });
  });

  it("keeps recommendation behavior for a plan without authored frequency", () => {
    const { frequency: _frequency, ...planWithoutFrequency } = plan;
    const frequencylessPlan: CarePlan = {
      ...planWithoutFrequency,
      id: "grape.plan.observation",
    };
    const projection = createTodayProjection({
      activities: [],
      evaluatedAt: new Date("2026-07-17T12:00:00.000Z"),
      plansByPlant: new Map([[plant.id, [frequencylessPlan]]]),
      plants: [plant],
    });

    expect(projection.careCards[0]).toMatchObject({
      carePlanId: frequencylessPlan.id,
      dueStatus: null,
    });
  });

  it("attaches the latest persisted photo to canonical cards", () => {
    const projection = createTodayProjection({
      activities: [activity],
      evaluatedAt: new Date("2026-07-17T12:00:00.000Z"),
      plansByPlant,
      plants: [plant],
      plantSnapshots: [plantSnapshot],
      updates: [
        {
          id: "86ee7489-6147-42b9-b73f-5650ea7fd214",
          mutationId: "c353342e-9fe0-43a3-9d84-1b0ed436011d",
          plantId: plant.id,
          occurredAt: "2026-07-13T15:00:00.000Z",
          notes: null,
          stageId: plant.stageId,
          photos: [
            {
              id: "7174d8e3-df23-4f13-9e06-245ebfc9877b",
              localUri: "file:///latest-plant.jpg",
              position: 0,
              createdAt: "2026-07-13T15:00:00.000Z",
            },
          ],
          createdAt: "2026-07-13T15:00:00.000Z",
        },
      ],
    });

    expect(projection.careCards[0]?.imageUri).toBe("file:///latest-plant.jpg");
  });

  it("accepts the bounded latest-photo projection without update history", () => {
    const projection = createTodayProjection({
      activities: [activity],
      evaluatedAt: new Date("2026-07-17T12:00:00.000Z"),
      plansByPlant,
      plantPhotoUris: { [plant.id]: "file:///bounded-latest.jpg" },
      plants: [plant],
      plantSnapshots: [plantSnapshot],
    });

    expect(projection.plantPhotoUris).toEqual({
      [plant.id]: "file:///bounded-latest.jpg",
    });
    expect(projection.careCards[0]?.imageUri).toBe(
      "file:///bounded-latest.jpg",
    );
  });
});
