import type { CarePlan } from "@/features/knowledge";
import type { Plant } from "@/features/plants";
import {
  PlantCarePlanScheduleSnapshotSchema,
  resolveCarePlanSchedule,
  StageCarePlanScheduleSnapshotSchema,
} from "./schedule-snapshot";

const plant: Plant = {
  id: "11111111-1111-4111-8111-111111111111",
  name: "Nho sân thượng",
  speciesId: "plant.grape",
  stageId: "grape.stage.bud-break",
  growingMethod: "container",
  location: null,
  plantedAt: null,
  stageStartedAt: null,
  createdAt: "2026-07-14T00:00:00.000Z",
};

const plan: CarePlan = {
  id: "grape.recommendation.bud-break.watering",
  title: "Tưới nước",
  goal: "Giữ ẩm đều.",
  bodyMarkdown: "",
  priority: 1,
  activityType: "watering",
  eligibility: { kind: "elapsed_days_since_activity", suggestAfterDays: 3 },
  onMissingHistory: "suggest",
  frequency: {
    ground: { display: "Mỗi 3 ngày", intervalDays: 3 },
    container: { display: "Mỗi 2 ngày", intervalDays: 2 },
  },
  version: "1.0.0",
};

const stageSnapshot = StageCarePlanScheduleSnapshotSchema.parse({
  id: "22222222-2222-4222-8222-222222222222",
  mutationId: "33333333-3333-4333-8333-333333333333",
  stageId: plant.stageId,
  carePlanId: plan.id,
  groundFrequencyOverrideDays: 4,
  containerFrequencyOverrideDays: 5,
  notificationEnabled: true,
  notificationOverridden: true,
  notificationTime: "08:00",
  createdAt: "2026-07-14T00:00:00.000Z",
  updatedAt: "2026-07-14T00:00:00.000Z",
});

const plantSnapshot = PlantCarePlanScheduleSnapshotSchema.parse({
  id: "44444444-4444-4444-8444-444444444444",
  mutationId: "55555555-5555-4555-8555-555555555555",
  plantId: plant.id,
  carePlanId: plan.id,
  intervalDays: 1,
  notificationEnabled: false,
  notificationOverridden: true,
  notificationTime: "08:00",
  isActive: true,
  createdAt: "2026-07-14T00:00:00.000Z",
  updatedAt: "2026-07-14T00:00:00.000Z",
});

describe("schedule snapshot notification overrides", () => {
  it("preserves an explicit stage notification override", () => {
    expect(
      StageCarePlanScheduleSnapshotSchema.parse({
        ...stageSnapshot,
        notificationOverridden: true,
      }),
    ).toMatchObject({ notificationOverridden: true });
  });
});

describe("resolveCarePlanSchedule", () => {
  it("does not create a schedule when missing history is withheld", () => {
    expect(
      resolveCarePlanSchedule({
        defaultNotificationEnabled: true,
        evaluatedAt: new Date("2026-07-14T12:00:00.000Z"),
        latestActivityAt: null,
        plan: {
          ...plan,
          activityType: "fertilizing",
          onMissingHistory: "withhold",
        },
        plant,
        plantSnapshot: null,
        stageSnapshot: null,
      }),
    ).toBeNull();
  });

  it("uses authored frequency for the plant growing method", () => {
    expect(
      resolveCarePlanSchedule({
        defaultNotificationEnabled: true,
        evaluatedAt: new Date("2026-07-14T12:00:00.000Z"),
        latestActivityAt: "2026-07-13T10:00:00.000Z",
        plan,
        plant,
        plantSnapshot: null,
        stageSnapshot: null,
      }),
    ).toMatchObject({
      intervalDays: 2,
      source: "care-plan",
      status: "upcoming",
    });
  });

  it("inherits enabled global delivery at the default notification time", () => {
    expect(
      resolveCarePlanSchedule({
        defaultNotificationEnabled: true,
        evaluatedAt: new Date("2026-07-14T12:00:00.000Z"),
        latestActivityAt: "2026-07-13T10:00:00.000Z",
        plan,
        plant,
        plantSnapshot: null,
        stageSnapshot: null,
      }),
    ).toMatchObject({
      notificationEnabled: true,
      notificationTime: "08:00",
    });
  });

  it("ignores a snapshot notification value that was not manually overridden", () => {
    expect(
      resolveCarePlanSchedule({
        defaultNotificationEnabled: true,
        evaluatedAt: new Date("2026-07-14T12:00:00.000Z"),
        latestActivityAt: "2026-07-13T10:00:00.000Z",
        plan,
        plant,
        plantSnapshot: null,
        stageSnapshot: {
          ...stageSnapshot,
          notificationEnabled: false,
          notificationOverridden: false,
        },
      }),
    ).toMatchObject({ notificationEnabled: true });
  });

  it("respects a manually disabled stage notification", () => {
    expect(
      resolveCarePlanSchedule({
        defaultNotificationEnabled: true,
        evaluatedAt: new Date("2026-07-14T12:00:00.000Z"),
        latestActivityAt: "2026-07-13T10:00:00.000Z",
        plan,
        plant,
        plantSnapshot: null,
        stageSnapshot: {
          ...stageSnapshot,
          notificationEnabled: false,
          notificationOverridden: true,
        },
      }),
    ).toMatchObject({ notificationEnabled: false });
  });

  it("uses the nearest manual override instead of the nearest frequency snapshot", () => {
    expect(
      resolveCarePlanSchedule({
        defaultNotificationEnabled: true,
        evaluatedAt: new Date("2026-07-14T12:00:00.000Z"),
        latestActivityAt: "2026-07-13T10:00:00.000Z",
        plan,
        plant,
        plantSnapshot: {
          ...plantSnapshot,
          notificationEnabled: true,
          notificationOverridden: false,
        },
        stageSnapshot: {
          ...stageSnapshot,
          notificationEnabled: false,
          notificationOverridden: true,
        },
      }),
    ).toMatchObject({ notificationEnabled: false, source: "plant" });
  });

  it("suppresses all delivery when the global preference is off", () => {
    expect(
      resolveCarePlanSchedule({
        defaultNotificationEnabled: false,
        evaluatedAt: new Date("2026-07-14T12:00:00.000Z"),
        latestActivityAt: "2026-07-13T10:00:00.000Z",
        plan,
        plant,
        plantSnapshot: {
          ...plantSnapshot,
          notificationEnabled: true,
          notificationOverridden: true,
        },
        stageSnapshot,
      }),
    ).toMatchObject({ notificationEnabled: false });
  });

  it("uses the stage frequency for the selected growing method", () => {
    expect(
      resolveCarePlanSchedule({
        defaultNotificationEnabled: true,
        evaluatedAt: new Date("2026-07-16T12:00:00.000Z"),
        latestActivityAt: "2026-07-13T10:00:00.000Z",
        plan,
        plant: { ...plant, growingMethod: "ground" },
        plantSnapshot: null,
        stageSnapshot,
      }),
    ).toMatchObject({ intervalDays: 4, source: "stage", status: "upcoming" });
  });

  it("uses container frequency with shared stage notifications", () => {
    expect(
      resolveCarePlanSchedule({
        defaultNotificationEnabled: true,
        evaluatedAt: new Date("2026-07-14T12:00:00.000Z"),
        latestActivityAt: "2026-07-13T10:00:00.000Z",
        plan,
        plant,
        plantSnapshot: null,
        stageSnapshot,
      }),
    ).toMatchObject({
      intervalDays: 5,
      notificationEnabled: true,
      notificationTime: "08:00",
      source: "stage",
    });
  });

  it("lets copied plant snapshot win over later stage changes", () => {
    expect(
      resolveCarePlanSchedule({
        defaultNotificationEnabled: true,
        evaluatedAt: new Date("2026-07-14T12:00:00.000Z"),
        latestActivityAt: "2026-07-13T10:00:00.000Z",
        plan,
        plant,
        plantSnapshot,
        stageSnapshot: {
          ...stageSnapshot,
          containerFrequencyOverrideDays: 6,
        },
      }),
    ).toMatchObject({
      intervalDays: 1,
      notificationEnabled: false,
      source: "plant",
      status: "due",
    });
  });

  it("keeps notification-disabled care visible when due", () => {
    expect(
      resolveCarePlanSchedule({
        defaultNotificationEnabled: true,
        evaluatedAt: new Date("2026-07-14T12:00:00.000Z"),
        latestActivityAt: "2026-07-13T10:00:00.000Z",
        plan,
        plant,
        plantSnapshot,
        stageSnapshot,
      }),
    ).toMatchObject({ notificationEnabled: false, status: "due" });
  });
});
