import { getDb, runDatabaseWrite } from "@/shared/lib/db/database";
import {
  PlantCarePlanScheduleSnapshotSchema,
  type PlantCarePlanScheduleSnapshot,
  type ReminderPreferences,
  ReminderPreferencesSchema,
  StageCarePlanScheduleSnapshotSchema,
  type StageCarePlanScheduleSnapshot,
} from "../models/schedule-snapshot";

type StageRow = Readonly<{
  id: string;
  mutation_id: string;
  stage_id: string;
  care_plan_id: string;
  ground_frequency_override_days: number | null;
  container_frequency_override_days: number | null;
  notification_enabled: number;
  notification_overridden: number;
  notification_time: string | null;
  created_at: string;
  updated_at: string;
}>;

type PlantRow = Readonly<{
  id: string;
  mutation_id: string;
  plant_id: string;
  care_plan_id: string;
  interval_days: number;
  notification_enabled: number;
  notification_overridden: number;
  notification_time: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
}>;

export type NotificationState = Readonly<{
  plantId: string;
  carePlanId: string;
  mainNotificationId: string | null;
  followUpNotificationId: string | null;
  updatedAt: string;
}>;

type ReminderPreferencesRow = Readonly<{
  notification_enabled: number;
}>;

export async function getReminderPreferences(): Promise<ReminderPreferences> {
  const db = await getDb();
  const row = await db.getFirstAsync<ReminderPreferencesRow>(
    "SELECT notification_enabled FROM reminder_preferences WHERE id = 'global'",
  );
  return ReminderPreferencesSchema.parse({
    notificationEnabled: row?.notification_enabled === 1,
  });
}

export async function saveReminderPreferences(
  input: ReminderPreferences,
): Promise<void> {
  const preferences = ReminderPreferencesSchema.parse(input);
  await runDatabaseWrite(async (db) => {
    await db.runAsync(
      `INSERT INTO reminder_preferences (id, notification_enabled, updated_at)
       VALUES ('global', ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         notification_enabled = excluded.notification_enabled,
         updated_at = excluded.updated_at`,
      [preferences.notificationEnabled ? 1 : 0, new Date().toISOString()],
    );
  });
}

export async function listStageScheduleSnapshots(): Promise<
  StageCarePlanScheduleSnapshot[]
> {
  const db = await getDb();
  const rows = await db.getAllAsync<StageRow>(
    "SELECT * FROM stage_care_plan_schedule_snapshots ORDER BY stage_id, care_plan_id",
  );
  return rows.map(stageFromRow);
}

export async function saveStageScheduleSnapshot(
  input: StageCarePlanScheduleSnapshot,
): Promise<void> {
  const snapshot = StageCarePlanScheduleSnapshotSchema.parse(input);
  await runDatabaseWrite(async (db) => {
    await db.runAsync(
      `INSERT INTO stage_care_plan_schedule_snapshots
        (id, mutation_id, stage_id, care_plan_id,
         ground_frequency_override_days, container_frequency_override_days,
         notification_enabled, notification_overridden, notification_time,
         created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(stage_id, care_plan_id) DO UPDATE SET
         mutation_id = excluded.mutation_id,
         ground_frequency_override_days = excluded.ground_frequency_override_days,
         container_frequency_override_days = excluded.container_frequency_override_days,
         notification_enabled = excluded.notification_enabled,
         notification_overridden = excluded.notification_overridden,
         notification_time = excluded.notification_time,
         updated_at = excluded.updated_at`,
      [
        snapshot.id,
        snapshot.mutationId,
        snapshot.stageId,
        snapshot.carePlanId,
        snapshot.groundFrequencyOverrideDays,
        snapshot.containerFrequencyOverrideDays,
        snapshot.notificationEnabled ? 1 : 0,
        snapshot.notificationOverridden ? 1 : 0,
        snapshot.notificationTime,
        snapshot.createdAt,
        snapshot.updatedAt,
      ],
    );
  });
}

export async function deleteStageScheduleSnapshot(
  stageId: string,
  carePlanId: string,
): Promise<void> {
  await runDatabaseWrite(async (db) => {
    await db.runAsync(
      "DELETE FROM stage_care_plan_schedule_snapshots WHERE stage_id = ? AND care_plan_id = ?",
      [stageId, carePlanId],
    );
  });
}

export async function listPlantScheduleSnapshots(
  plantId?: string,
): Promise<PlantCarePlanScheduleSnapshot[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<PlantRow>(
    `SELECT * FROM plant_care_plan_schedule_snapshots
     ${plantId ? "WHERE plant_id = ?" : ""}
     ORDER BY plant_id, care_plan_id`,
    plantId ? [plantId] : [],
  );
  return rows.map(plantFromRow);
}

export async function savePlantScheduleSnapshot(
  input: PlantCarePlanScheduleSnapshot,
): Promise<void> {
  const snapshot = PlantCarePlanScheduleSnapshotSchema.parse(input);
  await runDatabaseWrite(async (db) => {
    await db.runAsync(
      `INSERT INTO plant_care_plan_schedule_snapshots
        (id, mutation_id, plant_id, care_plan_id, interval_days,
         notification_enabled, notification_overridden, notification_time,
         is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(plant_id, care_plan_id) DO UPDATE SET
         mutation_id = excluded.mutation_id,
         interval_days = excluded.interval_days,
         notification_enabled = excluded.notification_enabled,
         notification_overridden = excluded.notification_overridden,
         notification_time = excluded.notification_time,
         is_active = excluded.is_active,
         updated_at = excluded.updated_at`,
      [
        snapshot.id,
        snapshot.mutationId,
        snapshot.plantId,
        snapshot.carePlanId,
        snapshot.intervalDays,
        snapshot.notificationEnabled ? 1 : 0,
        snapshot.notificationOverridden ? 1 : 0,
        snapshot.notificationTime,
        snapshot.isActive ? 1 : 0,
        snapshot.createdAt,
        snapshot.updatedAt,
      ],
    );
  });
}

export async function deletePlantScheduleSnapshot(
  plantId: string,
  carePlanId: string,
): Promise<void> {
  await runDatabaseWrite(async (db) => {
    await db.runAsync(
      "DELETE FROM plant_care_plan_schedule_snapshots WHERE plant_id = ? AND care_plan_id = ?",
      [plantId, carePlanId],
    );
  });
}

export async function getNotificationState(
  plantId: string,
  carePlanId: string,
): Promise<NotificationState | null> {
  const db = await getDb();
  return await db.getFirstAsync<NotificationState>(
    `SELECT plant_id AS plantId, care_plan_id AS carePlanId,
      main_notification_id AS mainNotificationId,
      follow_up_notification_id AS followUpNotificationId,
      updated_at AS updatedAt
     FROM plant_care_plan_notification_states
     WHERE plant_id = ? AND care_plan_id = ?`,
    [plantId, carePlanId],
  );
}

export async function listNotificationStates(
  plantId: string,
): Promise<NotificationState[]> {
  const db = await getDb();
  return await db.getAllAsync<NotificationState>(
    `SELECT plant_id AS plantId, care_plan_id AS carePlanId,
      main_notification_id AS mainNotificationId,
      follow_up_notification_id AS followUpNotificationId,
      updated_at AS updatedAt
     FROM plant_care_plan_notification_states
     WHERE plant_id = ?`,
    [plantId],
  );
}

export async function saveNotificationState(
  input: NotificationState,
): Promise<void> {
  await runDatabaseWrite(async (db) => {
    await db.runAsync(
      `INSERT INTO plant_care_plan_notification_states
        (plant_id, care_plan_id, main_notification_id, follow_up_notification_id, updated_at)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(plant_id, care_plan_id) DO UPDATE SET
         main_notification_id = excluded.main_notification_id,
         follow_up_notification_id = excluded.follow_up_notification_id,
         updated_at = excluded.updated_at`,
      [
        input.plantId,
        input.carePlanId,
        input.mainNotificationId,
        input.followUpNotificationId,
        input.updatedAt,
      ],
    );
  });
}

function stageFromRow(row: StageRow): StageCarePlanScheduleSnapshot {
  return StageCarePlanScheduleSnapshotSchema.parse({
    id: row.id,
    mutationId: row.mutation_id,
    stageId: row.stage_id,
    carePlanId: row.care_plan_id,
    groundFrequencyOverrideDays: row.ground_frequency_override_days,
    containerFrequencyOverrideDays: row.container_frequency_override_days,
    notificationEnabled: row.notification_enabled === 1,
    notificationOverridden: row.notification_overridden === 1,
    notificationTime: row.notification_time,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

function plantFromRow(row: PlantRow): PlantCarePlanScheduleSnapshot {
  return PlantCarePlanScheduleSnapshotSchema.parse({
    id: row.id,
    mutationId: row.mutation_id,
    plantId: row.plant_id,
    carePlanId: row.care_plan_id,
    intervalDays: row.interval_days,
    notificationEnabled: row.notification_enabled === 1,
    notificationOverridden: row.notification_overridden === 1,
    notificationTime: row.notification_time,
    isActive: row.is_active === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}
