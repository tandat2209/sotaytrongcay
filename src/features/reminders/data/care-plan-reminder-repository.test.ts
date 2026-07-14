import {
  carePlanReminderPreferenceFromRow,
  carePlanReminderPreferenceToParams,
} from "./care-plan-reminder-repository";

const preference = {
  id: "11111111-1111-4111-8111-111111111111",
  mutationId: "22222222-2222-4222-8222-222222222222",
  plantId: "33333333-3333-4333-8333-333333333333",
  carePlanId: "care-plan.grape.trunk-development.watering.general",
  carePlanVersion: "1.0.0",
  activityType: "watering",
  recommendedIntervalDays: 3,
  customIntervalDays: null,
  notificationTime: "08:15",
  notificationEnabled: true,
  pausedAt: null,
  isApplicable: true,
  mainNotificationId: "main-id",
  followUpNotificationId: "follow-up-id",
  createdAt: "2026-07-14T00:00:00.000Z",
  updatedAt: "2026-07-14T00:00:00.000Z",
} as const;

const row = {
  id: preference.id,
  mutation_id: preference.mutationId,
  plant_id: preference.plantId,
  care_plan_id: preference.carePlanId,
  care_plan_version: preference.carePlanVersion,
  activity_type: preference.activityType,
  recommended_interval_days: preference.recommendedIntervalDays,
  custom_interval_days: preference.customIntervalDays,
  notification_time: preference.notificationTime,
  notification_enabled: 1,
  paused_at: preference.pausedAt,
  is_applicable: 1,
  main_notification_id: preference.mainNotificationId,
  follow_up_notification_id: preference.followUpNotificationId,
  created_at: preference.createdAt,
  updated_at: preference.updatedAt,
};

describe("Care Plan reminder preference repository mapping", () => {
  it("maps a validated preference to SQLite parameters", () => {
    expect(carePlanReminderPreferenceToParams(preference)).toEqual([
      preference.id,
      preference.mutationId,
      preference.plantId,
      preference.carePlanId,
      preference.carePlanVersion,
      preference.activityType,
      3,
      null,
      "08:15",
      1,
      null,
      1,
      "main-id",
      "follow-up-id",
      preference.createdAt,
      preference.updatedAt,
    ]);
  });

  it("parses a SQLite row into a validated preference", () => {
    expect(carePlanReminderPreferenceFromRow(row)).toEqual(preference);
  });
});
