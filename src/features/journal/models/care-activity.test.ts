import { CareActivitySchema } from "./care-activity";

describe("CareActivitySchema", () => {
  it("accepts watering without an amount", () => {
    const activity = CareActivitySchema.parse({
      id: "86ee7489-6147-42b9-b73f-5650ea7fd214",
      mutationId: "c353342e-9fe0-43a3-9d84-1b0ed436011d",
      plantId: "a775a7ec-fb44-4660-88ed-0f3b1933e7f1",
      type: "watering",
      occurredAt: "2026-07-11T08:30:00.000Z",
      origin: "manual",
      amount: null,
      notes: null,
      createdAt: "2026-07-11T08:30:00.000Z",
    });

    expect(activity.amount).toBeNull();
  });

  it("uses the stable liter code for an entered amount", () => {
    const activity = CareActivitySchema.parse({
      id: "86ee7489-6147-42b9-b73f-5650ea7fd214",
      mutationId: "c353342e-9fe0-43a3-9d84-1b0ed436011d",
      plantId: "a775a7ec-fb44-4660-88ed-0f3b1933e7f1",
      type: "watering",
      occurredAt: "2026-07-11T08:30:00.000Z",
      origin: "manual",
      amount: { value: 1.5, unit: "liter" },
      notes: null,
      createdAt: "2026-07-11T08:30:00.000Z",
    });

    expect(activity.amount).toEqual({ value: 1.5, unit: "liter" });
  });

  it("rejects a liter amount for fertilizing", () => {
    expect(() => CareActivitySchema.parse({
      id: "86ee7489-6147-42b9-b73f-5650ea7fd214",
      mutationId: "c353342e-9fe0-43a3-9d84-1b0ed436011d",
      plantId: "a775a7ec-fb44-4660-88ed-0f3b1933e7f1",
      type: "fertilizing",
      occurredAt: "2026-07-11T08:30:00.000Z",
      origin: "manual",
      amount: { value: 1.5, unit: "liter" },
      notes: null,
      createdAt: "2026-07-11T08:30:00.000Z",
    })).toThrow();
  });

  it("accepts spraying without structured details", () => {
    expect(CareActivitySchema.parse({
      id: "86ee7489-6147-42b9-b73f-5650ea7fd214",
      mutationId: "c353342e-9fe0-43a3-9d84-1b0ed436011d",
      plantId: "a775a7ec-fb44-4660-88ed-0f3b1933e7f1",
      type: "spraying",
      occurredAt: "2026-07-11T08:30:00.000Z",
      origin: "manual",
      amount: null,
      notes: "Quan sát lá",
      createdAt: "2026-07-11T08:30:00.000Z",
    }).amount).toBeNull();
  });
});
