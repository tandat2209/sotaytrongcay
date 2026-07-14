import type { CarePlan } from "@/features/knowledge";
import type { Plant } from "@/features/plants";
import type { CarePlanReminderPreference } from "./care-plan-reminder-preference";
import { reconcileCarePlanReminders } from "./reconcile-care-plan-reminders";

const plant: Plant = {
  id: "33333333-3333-4333-8333-333333333333",
  name: "Nho Kẹo Nhật",
  speciesId: "plant.grape",
  stageId: "grape.stage.trunk-development",
  growingMethod: "container",
  location: null,
  plantedAt: null,
  stageStartedAt: null,
  createdAt: "2026-07-14T00:00:00.000Z",
};

const wateringPlan: CarePlan = {
  id: "care-plan.watering",
  title: "Tưới nước",
  goal: "Giữ ẩm phù hợp.",
  bodyMarkdown: "",
  priority: 1,
  activityType: "watering",
  eligibility: { kind: "elapsed_days_since_activity", suggestAfterDays: 3 },
  onMissingHistory: "suggest",
  frequency: {
    ground: { display: "3 ngày", intervalDays: 3 },
    container: { display: "2 ngày", intervalDays: 2 },
  },
  version: "1.0.0",
};

const existing: CarePlanReminderPreference = {
  id: "11111111-1111-4111-8111-111111111111",
  mutationId: "22222222-2222-4222-8222-222222222222",
  plantId: plant.id,
  carePlanId: wateringPlan.id,
  carePlanVersion: wateringPlan.version,
  activityType: "watering",
  recommendedIntervalDays: 2,
  customIntervalDays: 5,
  notificationTime: "08:15",
  notificationEnabled: true,
  pausedAt: null,
  isApplicable: false,
  mainNotificationId: null,
  followUpNotificationId: null,
  createdAt: "2026-07-14T00:00:00.000Z",
  updatedAt: "2026-07-14T00:00:00.000Z",
};

const ids = [
  "44444444-4444-4444-8444-444444444444",
  "55555555-5555-4555-8555-555555555555",
];

function reconcile(
  preferences: readonly CarePlanReminderPreference[],
  plans: readonly CarePlan[],
) {
  let index = 0;
  return reconcileCarePlanReminders({
    createId: () => ids[index++] ?? "55555555-5555-4555-8555-555555555555",
    existing: preferences,
    now: "2026-07-15T00:00:00.000Z",
    plant,
    plans,
  });
}

describe("Care Plan reminder reconciliation", () => {
  it("creates default preferences for a newly applicable Care Plan", () => {
    const result = reconcile([], [wateringPlan]);

    expect(result.activated).toEqual([wateringPlan.id]);
    expect(result.deactivated).toEqual([]);
    expect(result.preferences[0]).toMatchObject({
      carePlanId: wateringPlan.id,
      customIntervalDays: null,
      isApplicable: true,
      notificationEnabled: false,
      notificationTime: null,
      recommendedIntervalDays: 2,
    });
  });

  it("reactivates the same Care Plan with saved customization", () => {
    const result = reconcile([existing], [wateringPlan]);

    expect(result.activated).toEqual([wateringPlan.id]);
    expect(result.preferences[0]).toMatchObject({
      id: existing.id,
      customIntervalDays: 5,
      notificationTime: "08:15",
      isApplicable: true,
    });
  });

  it("deactivates missing plans while retaining their preferences", () => {
    const result = reconcile([{ ...existing, isApplicable: true }], []);

    expect(result.deactivated).toEqual([wateringPlan.id]);
    expect(result.preferences[0]).toMatchObject({
      customIntervalDays: 5,
      isApplicable: false,
      mainNotificationId: null,
      followUpNotificationId: null,
    });
  });

  it("returns no membership summary when applicability is unchanged", () => {
    const result = reconcile(
      [{ ...existing, isApplicable: true }],
      [wateringPlan],
    );

    expect(result.activated).toEqual([]);
    expect(result.deactivated).toEqual([]);
  });

  it("refreshes Care Plan version and recommendation without losing customization", () => {
    const result = reconcile(
      [{ ...existing, isApplicable: true }],
      [
        {
          ...wateringPlan,
          version: "2.0.0",
          frequency: {
            ground: { display: "4 ngày", intervalDays: 4 },
            container: { display: "3 ngày", intervalDays: 3 },
          },
        },
      ],
    );

    expect(result.preferences[0]).toMatchObject({
      carePlanVersion: "2.0.0",
      customIntervalDays: 5,
      recommendedIntervalDays: 3,
    });
  });

  it("does not create a reminder when growing method has no authored frequency", () => {
    const { frequency: _frequency, ...planWithoutFrequency } = wateringPlan;

    expect(reconcile([], [planWithoutFrequency]).preferences).toEqual([]);
  });

  it("deactivates old plan and activates new stage plan in one reconciliation", () => {
    const newPlan = {
      ...wateringPlan,
      id: "care-plan.fertilizing",
      activityType: "fertilizing" as const,
    };
    const result = reconcile([{ ...existing, isApplicable: true }], [newPlan]);

    expect(result.activated).toEqual([newPlan.id]);
    expect(result.deactivated).toEqual([wateringPlan.id]);
    expect(result.preferences).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ carePlanId: newPlan.id, isApplicable: true }),
        expect.objectContaining({
          carePlanId: wateringPlan.id,
          customIntervalDays: 5,
          isApplicable: false,
        }),
      ]),
    );
  });
});
