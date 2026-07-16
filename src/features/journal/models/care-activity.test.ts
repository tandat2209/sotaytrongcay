import {
  CareActivitySchema,
  NewCareActivitySchema,
  findLatestCareActivity,
} from "./care-activity";

const baseActivity = {
  id: "86ee7489-6147-42b9-b73f-5650ea7fd214",
  mutationId: "c353342e-9fe0-43a3-9d84-1b0ed436011d",
  plantId: "a775a7ec-fb44-4660-88ed-0f3b1933e7f1",
  type: "watering",
  occurredAt: "2026-07-11T08:30:00.000Z",
  origin: "manual",
  intensity: "moderate",
  estimatedAmountLiters: null,
  notes: null,
  createdAt: "2026-07-11T08:30:00.000Z",
} as const;

describe("CareActivitySchema", () => {
  it("accepts stable watering intensity and estimated liters", () => {
    const activity = CareActivitySchema.parse({
      ...baseActivity,
      intensity: "deep",
      estimatedAmountLiters: 1.5,
    });

    expect(activity.intensity).toBe("deep");
    expect(activity.estimatedAmountLiters).toBe(1.5);
  });

  it("accepts legacy watering without intensity", () => {
    const activity = CareActivitySchema.parse({
      ...baseActivity,
      intensity: null,
      estimatedAmountLiters: 1.5,
    });

    expect(activity.intensity).toBeNull();
  });

  it("accepts rain without inventing an estimated amount", () => {
    const activity = NewCareActivitySchema.parse({
      ...baseActivity,
      intensity: "rain",
    });

    expect(activity.estimatedAmountLiters).toBeNull();
  });

  it("requires intensity for newly saved watering", () => {
    expect(() =>
      NewCareActivitySchema.parse({ ...baseActivity, intensity: null }),
    ).toThrow();
  });

  it("rejects invalid watering intensity", () => {
    expect(() =>
      CareActivitySchema.parse({ ...baseActivity, intensity: "heavy" }),
    ).toThrow();
  });

  it("rejects non-positive estimated liters", () => {
    expect(() =>
      CareActivitySchema.parse({ ...baseActivity, estimatedAmountLiters: 0 }),
    ).toThrow();
  });

  it("rejects watering details for non-watering activities", () => {
    expect(() =>
      CareActivitySchema.parse({
        ...baseActivity,
        type: "fertilizing",
      }),
    ).toThrow();
  });

  it("accepts spraying without watering details", () => {
    const activity = NewCareActivitySchema.parse({
      ...baseActivity,
      type: "spraying",
      intensity: null,
    });

    expect(activity.intensity).toBeNull();
    expect(activity.estimatedAmountLiters).toBeNull();
  });

  it("accepts a paired curated target snapshot for spraying", () => {
    const activity = NewCareActivitySchema.parse({
      ...baseActivity,
      type: "spraying",
      intensity: null,
      sprayTargetId: "pest.grape.thrips",
      sprayTargetNameSnapshot: "Bọ trĩ hại nho",
    });

    expect(activity).toMatchObject({
      sprayTargetId: "pest.grape.thrips",
      sprayTargetNameSnapshot: "Bọ trĩ hại nho",
    });
  });

  it("rejects an incomplete spraying target snapshot", () => {
    expect(() =>
      NewCareActivitySchema.parse({
        ...baseActivity,
        type: "spraying",
        intensity: null,
        sprayTargetId: "pest.grape.thrips",
      }),
    ).toThrow();
  });

  it("rejects spraying target fields for another care type", () => {
    expect(() =>
      NewCareActivitySchema.parse({
        ...baseActivity,
        sprayTargetId: "pest.grape.thrips",
        sprayTargetNameSnapshot: "Bọ trĩ hại nho",
      }),
    ).toThrow();
  });

  it("finds latest matching care regardless of input order", () => {
    const older = CareActivitySchema.parse({
      ...baseActivity,
      occurredAt: "2026-07-10T08:30:00.000Z",
      createdAt: "2026-07-10T08:30:00.000Z",
    });
    const newer = CareActivitySchema.parse({
      ...baseActivity,
      id: "7174d8e3-df23-4f13-9e06-245ebfc9877b",
      mutationId: "6b665283-26bb-4dab-a214-f8802bb73fc0",
      occurredAt: "2026-07-12T08:30:00.000Z",
    });

    expect(
      findLatestCareActivity([older, newer], older.plantId, "watering")?.id,
    ).toBe(newer.id);
    expect(
      findLatestCareActivity([newer, older], older.plantId, "watering")?.id,
    ).toBe(newer.id);
  });
});
