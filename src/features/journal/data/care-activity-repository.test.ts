import {
  careActivityFromRow,
  careActivityToInsertParams,
} from "./care-activity-repository";

const activity = {
  id: "86ee7489-6147-42b9-b73f-5650ea7fd214",
  mutationId: "c353342e-9fe0-43a3-9d84-1b0ed436011d",
  plantId: "a775a7ec-fb44-4660-88ed-0f3b1933e7f1",
  type: "watering",
  occurredAt: "2026-07-11T08:30:00.000Z",
  origin: "manual",
  intensity: "moderate",
  estimatedAmountLiters: 1.5,
  notes: null,
  createdAt: "2026-07-11T08:30:00.000Z",
} as const;

describe("care activity repository mapping", () => {
  it("stores stable watering intensity and liter code", () => {
    expect(careActivityToInsertParams(activity)).toEqual([
      activity.id,
      activity.mutationId,
      activity.plantId,
      "watering",
      activity.occurredAt,
      "manual",
      "moderate",
      1.5,
      "liter",
      null,
      activity.createdAt,
    ]);
  });

  it("maps the row back to the activity", () => {
    expect(
      careActivityFromRow({
        id: activity.id,
        mutation_id: activity.mutationId,
        plant_id: activity.plantId,
        activity_type: "watering",
        occurred_at: activity.occurredAt,
        origin: "manual",
        watering_intensity: "moderate",
        amount_value: 1.5,
        amount_unit: "liter",
        notes: null,
        created_at: activity.createdAt,
      }),
    ).toEqual(activity);
  });

  it("keeps legacy watering intensity unknown", () => {
    expect(
      careActivityFromRow({
        id: activity.id,
        mutation_id: activity.mutationId,
        plant_id: activity.plantId,
        activity_type: "watering",
        occurred_at: activity.occurredAt,
        origin: "manual",
        watering_intensity: null,
        amount_value: 1.5,
        amount_unit: "liter",
        notes: null,
        created_at: activity.createdAt,
      }).intensity,
    ).toBeNull();
  });
});
