import { getDb } from "@/shared/lib/db/database";
import {
  CarePlanReminderPreferenceSchema,
  type CarePlanReminderPreference,
} from "../models/care-plan-reminder-preference";

export type CarePlanReminderPreferenceRow = Readonly<{
  id: string;
  mutation_id: string;
  plant_id: string;
  care_plan_id: string;
  care_plan_version: string;
  activity_type: string;
  recommended_interval_days: number;
  custom_interval_days: number | null;
  notification_time: string | null;
  notification_enabled: number;
  paused_at: string | null;
  is_applicable: number;
  main_notification_id: string | null;
  follow_up_notification_id: string | null;
  created_at: string;
  updated_at: string;
}>;

export function carePlanReminderPreferenceToParams(
  preference: CarePlanReminderPreference,
): (string | number | null)[] {
  const parsed = CarePlanReminderPreferenceSchema.parse(preference);
  return [
    parsed.id,
    parsed.mutationId,
    parsed.plantId,
    parsed.carePlanId,
    parsed.carePlanVersion,
    parsed.activityType,
    parsed.recommendedIntervalDays,
    parsed.customIntervalDays,
    parsed.notificationTime,
    parsed.notificationEnabled ? 1 : 0,
    parsed.pausedAt,
    parsed.isApplicable ? 1 : 0,
    parsed.mainNotificationId,
    parsed.followUpNotificationId,
    parsed.createdAt,
    parsed.updatedAt,
  ];
}

export function carePlanReminderPreferenceFromRow(
  row: CarePlanReminderPreferenceRow,
): CarePlanReminderPreference {
  return CarePlanReminderPreferenceSchema.parse({
    id: row.id,
    mutationId: row.mutation_id,
    plantId: row.plant_id,
    carePlanId: row.care_plan_id,
    carePlanVersion: row.care_plan_version,
    activityType: row.activity_type,
    recommendedIntervalDays: row.recommended_interval_days,
    customIntervalDays: row.custom_interval_days,
    notificationTime: row.notification_time,
    notificationEnabled: row.notification_enabled === 1,
    pausedAt: row.paused_at,
    isApplicable: row.is_applicable === 1,
    mainNotificationId: row.main_notification_id,
    followUpNotificationId: row.follow_up_notification_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

export async function saveCarePlanReminderPreference(
  input: CarePlanReminderPreference,
): Promise<void> {
  const preference = CarePlanReminderPreferenceSchema.parse(input);
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO care_plan_reminder_preferences
      (id, mutation_id, plant_id, care_plan_id, care_plan_version, activity_type,
       recommended_interval_days, custom_interval_days, notification_time,
       notification_enabled, paused_at, is_applicable, main_notification_id,
       follow_up_notification_id, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(plant_id, care_plan_id) DO UPDATE SET
       mutation_id = excluded.mutation_id,
       care_plan_version = excluded.care_plan_version,
       activity_type = excluded.activity_type,
       recommended_interval_days = excluded.recommended_interval_days,
       custom_interval_days = excluded.custom_interval_days,
       notification_time = excluded.notification_time,
       notification_enabled = excluded.notification_enabled,
       paused_at = excluded.paused_at,
       is_applicable = excluded.is_applicable,
       main_notification_id = excluded.main_notification_id,
       follow_up_notification_id = excluded.follow_up_notification_id,
       updated_at = excluded.updated_at`,
    carePlanReminderPreferenceToParams(preference),
  );
}

export async function listCarePlanReminderPreferences(
  applicableOnly = false,
): Promise<CarePlanReminderPreference[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<CarePlanReminderPreferenceRow>(
    `SELECT * FROM care_plan_reminder_preferences
     ${applicableOnly ? "WHERE is_applicable = 1" : ""}
     ORDER BY plant_id, activity_type`,
  );
  return rows.map(carePlanReminderPreferenceFromRow);
}

export async function getCarePlanReminderPreference(
  id: string,
): Promise<CarePlanReminderPreference | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<CarePlanReminderPreferenceRow>(
    "SELECT * FROM care_plan_reminder_preferences WHERE id = ?",
    [id],
  );
  return row ? carePlanReminderPreferenceFromRow(row) : null;
}
