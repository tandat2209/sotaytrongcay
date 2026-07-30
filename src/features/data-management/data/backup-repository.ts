import type { SQLiteDatabase } from "expo-sqlite";

import {
  runDatabaseWrite,
  withDatabaseWriteTransaction,
} from "@/shared/lib/db/database";
import type { BackupManifest } from "../models/backup-manifest";

type BackupData = BackupManifest["data"];
export type BackupDatabaseSnapshot = Readonly<{
  data: BackupData;
  photoSourceUris: ReadonlyMap<string, string>;
}>;
type BooleanSnapshotRow = Readonly<{
  notificationEnabled: number;
  notificationOverridden: number;
}>;

const DELETE_EXISTING_DATA = `
DELETE FROM weather_cache;
DELETE FROM weather_locations;
DELETE FROM fertilizer_applications;
DELETE FROM user_fertilizers;
DELETE FROM plant_care_plan_notification_states;
DELETE FROM plant_care_plan_schedule_snapshots;
DELETE FROM stage_care_plan_schedule_snapshots;
DELETE FROM reminder_preferences;
DELETE FROM plant_stage_history;
DELETE FROM plant_update_photos;
DELETE FROM plant_updates;
DELETE FROM care_activities;
DELETE FROM plants;
`;

async function readData(db: SQLiteDatabase): Promise<BackupDatabaseSnapshot> {
  const plants = await db.getAllAsync<BackupData["plants"][number]>(`
    SELECT id, name, species_id AS speciesId, stage_id AS stageId,
      growing_method AS growingMethod, location, planted_at AS plantedAt,
      stage_started_at AS stageStartedAt, archived_at AS archivedAt,
      created_at AS createdAt
    FROM plants ORDER BY created_at, id
  `);
  const careActivities = await db.getAllAsync<
    BackupData["careActivities"][number]
  >(`
    SELECT id, mutation_id AS mutationId, plant_id AS plantId,
      activity_type AS type, occurred_at AS occurredAt, origin,
      watering_intensity AS intensity, amount_value AS amountValue,
      amount_unit AS amountUnit, spray_target_id AS sprayTargetId,
      spray_target_name_snapshot AS sprayTargetNameSnapshot, notes,
      created_at AS createdAt
    FROM care_activities ORDER BY created_at, id
  `);
  const plantUpdates = await db.getAllAsync<
    BackupData["plantUpdates"][number]
  >(`
    SELECT id, mutation_id AS mutationId, plant_id AS plantId,
      occurred_at AS occurredAt, notes, stage_id AS stageId,
      created_at AS createdAt
    FROM plant_updates ORDER BY created_at, id
  `);
  const storedPhotos = await db.getAllAsync<
    Omit<BackupData["plantUpdatePhotos"][number], "fileName"> & {
      localUri: string;
    }
  >(`
    SELECT id, plant_update_id AS plantUpdateId, local_uri AS localUri,
      position, created_at AS createdAt
    FROM plant_update_photos ORDER BY plant_update_id, position
  `);
  const plantUpdatePhotos = storedPhotos.map(({ localUri, ...photo }) => ({
    ...photo,
    fileName: `${photo.id}.${photoExtension(localUri)}`,
  }));
  const plantStageHistory = await db.getAllAsync<
    BackupData["plantStageHistory"][number]
  >(`
    SELECT id, plant_id AS plantId, from_stage_id AS fromStageId,
      to_stage_id AS toStageId, journal_entry_id AS journalEntryId,
      changed_at AS changedAt, created_at AS createdAt
    FROM plant_stage_history ORDER BY created_at, id
  `);
  const stageRows = await db.getAllAsync<
    Omit<
      BackupData["stageScheduleSnapshots"][number],
      "notificationEnabled" | "notificationOverridden"
    > &
      BooleanSnapshotRow
  >(`
    SELECT id, mutation_id AS mutationId, stage_id AS stageId,
      care_plan_id AS carePlanId,
      ground_frequency_override_days AS groundFrequencyOverrideDays,
      container_frequency_override_days AS containerFrequencyOverrideDays,
      notification_enabled AS notificationEnabled,
      notification_overridden AS notificationOverridden,
      notification_time AS notificationTime, created_at AS createdAt,
      updated_at AS updatedAt
    FROM stage_care_plan_schedule_snapshots ORDER BY created_at, id
  `);
  const plantRows = await db.getAllAsync<
    Omit<
      BackupData["plantScheduleSnapshots"][number],
      "notificationEnabled" | "notificationOverridden" | "isActive"
    > &
      BooleanSnapshotRow & { isActive: number }
  >(`
    SELECT id, mutation_id AS mutationId, plant_id AS plantId,
      care_plan_id AS carePlanId, interval_days AS intervalDays,
      notification_enabled AS notificationEnabled,
      notification_overridden AS notificationOverridden,
      notification_time AS notificationTime, is_active AS isActive,
      created_at AS createdAt, updated_at AS updatedAt
    FROM plant_care_plan_schedule_snapshots ORDER BY created_at, id
  `);
  const preference = await db.getFirstAsync<{
    notificationEnabled: number;
    updatedAt: string;
  }>(
    `SELECT notification_enabled AS notificationEnabled, updated_at AS updatedAt FROM reminder_preferences WHERE id = 'global'`,
  );
  const userFertilizers = await db.getAllAsync<
    BackupData["userFertilizers"][number]
  >(`
    SELECT id, mutation_id AS mutationId, name, fertilizer_group AS "group",
      knowledge_id AS knowledgeId, created_at AS createdAt,
      updated_at AS updatedAt
    FROM user_fertilizers ORDER BY created_at, id
  `);
  const fertilizerApplications = await db.getAllAsync<
    BackupData["fertilizerApplications"][number]
  >(`
    SELECT id, care_activity_id AS careActivityId,
      user_fertilizer_id AS userFertilizerId, position,
      name_snapshot AS nameSnapshot, group_snapshot AS groupSnapshot,
      knowledge_id_snapshot AS knowledgeIdSnapshot,
      amount_value AS amountValue, amount_unit AS amountUnit,
      application_method AS applicationMethod, notes
    FROM fertilizer_applications ORDER BY care_activity_id, position
  `);
  const weatherLocation = await db.getFirstAsync<
    BackupData["weatherLocation"] & object
  >(`
    SELECT label, latitude, longitude, updated_at AS updatedAt
    FROM weather_locations WHERE id = 'growing-location'
  `);

  return {
    data: {
      plants,
      careActivities,
      plantUpdates,
      plantUpdatePhotos,
      plantStageHistory,
      stageScheduleSnapshots: stageRows.map((row) => ({
        ...row,
        notificationEnabled: row.notificationEnabled === 1,
        notificationOverridden: row.notificationOverridden === 1,
      })),
      plantScheduleSnapshots: plantRows.map((row) => ({
        ...row,
        notificationEnabled: row.notificationEnabled === 1,
        notificationOverridden: row.notificationOverridden === 1,
        isActive: row.isActive === 1,
      })),
      reminderPreferences: preference
        ? {
            notificationEnabled: preference.notificationEnabled === 1,
            updatedAt: preference.updatedAt,
          }
        : null,
      userFertilizers,
      fertilizerApplications,
      weatherLocation: weatherLocation ?? null,
    },
    photoSourceUris: new Map(
      storedPhotos.map((photo) => [photo.id, photo.localUri]),
    ),
  };
}

function photoExtension(uri: string): string {
  const extension = uri.split(/[?#]/, 1)[0]?.match(/\.([a-zA-Z0-9]+)$/)?.[1];
  return extension && /^(?:heic|jpeg|jpg|png|webp)$/i.test(extension)
    ? extension.toLowerCase()
    : "jpg";
}

export async function readBackupSnapshot(): Promise<BackupDatabaseSnapshot> {
  return await runDatabaseWrite(async (db) => {
    let snapshot: BackupDatabaseSnapshot | null = null;
    await db.withExclusiveTransactionAsync(async (transaction) => {
      snapshot = await readData(transaction);
    });
    if (snapshot === null) throw new Error("Could not read backup data.");
    return snapshot;
  });
}

export async function replaceDataFromBackup(
  data: BackupData,
  photoUris: ReadonlyMap<string, string>,
): Promise<void> {
  await withDatabaseWriteTransaction(async (db) => {
    await db.execAsync(DELETE_EXISTING_DATA);
    for (const record of data.plants) {
      await db.runAsync(
        `INSERT INTO plants (
          id, name, species_id, stage_id, growing_method, location, planted_at,
          stage_started_at, archived_at, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        record.id,
        record.name,
        record.speciesId,
        record.stageId,
        record.growingMethod,
        record.location,
        record.plantedAt,
        record.stageStartedAt,
        record.archivedAt,
        record.createdAt,
      );
    }
    for (const record of data.userFertilizers) {
      await db.runAsync(
        `INSERT INTO user_fertilizers (
          id, mutation_id, name, fertilizer_group, knowledge_id, created_at,
          updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        record.id,
        record.mutationId,
        record.name,
        record.group,
        record.knowledgeId,
        record.createdAt,
        record.updatedAt,
      );
    }
    for (const record of data.careActivities) {
      await db.runAsync(
        `INSERT INTO care_activities (
          id, mutation_id, plant_id, activity_type, occurred_at, origin,
          watering_intensity, amount_value, amount_unit, spray_target_id,
          spray_target_name_snapshot, notes, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        record.id,
        record.mutationId,
        record.plantId,
        record.type,
        record.occurredAt,
        record.origin,
        record.intensity,
        record.amountValue,
        record.amountUnit,
        record.sprayTargetId,
        record.sprayTargetNameSnapshot,
        record.notes,
        record.createdAt,
      );
    }
    for (const record of data.fertilizerApplications) {
      await db.runAsync(
        `INSERT INTO fertilizer_applications (
          id, care_activity_id, user_fertilizer_id, position, name_snapshot,
          group_snapshot, knowledge_id_snapshot, amount_value, amount_unit,
          application_method, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        record.id,
        record.careActivityId,
        record.userFertilizerId,
        record.position,
        record.nameSnapshot,
        record.groupSnapshot,
        record.knowledgeIdSnapshot,
        record.amountValue,
        record.amountUnit,
        record.applicationMethod,
        record.notes,
      );
    }
    for (const record of data.plantUpdates) {
      await db.runAsync(
        `INSERT INTO plant_updates (
          id, mutation_id, plant_id, occurred_at, notes, stage_id, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        record.id,
        record.mutationId,
        record.plantId,
        record.occurredAt,
        record.notes,
        record.stageId,
        record.createdAt,
      );
    }
    for (const record of data.plantUpdatePhotos) {
      const localUri = photoUris.get(record.id);
      if (!localUri) throw new Error(`Missing staged photo ${record.id}.`);
      await db.runAsync(
        `INSERT INTO plant_update_photos (
          id, plant_update_id, local_uri, position, created_at
        ) VALUES (?, ?, ?, ?, ?)`,
        record.id,
        record.plantUpdateId,
        localUri,
        record.position,
        record.createdAt,
      );
    }
    for (const record of data.plantStageHistory) {
      await db.runAsync(
        `INSERT INTO plant_stage_history (
          id, plant_id, from_stage_id, to_stage_id, journal_entry_id,
          changed_at, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        record.id,
        record.plantId,
        record.fromStageId,
        record.toStageId,
        record.journalEntryId,
        record.changedAt,
        record.createdAt,
      );
    }
    for (const record of data.stageScheduleSnapshots) {
      await db.runAsync(
        `INSERT INTO stage_care_plan_schedule_snapshots (
          id, mutation_id, stage_id, care_plan_id,
          ground_frequency_override_days, container_frequency_override_days,
          notification_enabled, notification_overridden, notification_time,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        record.id,
        record.mutationId,
        record.stageId,
        record.carePlanId,
        record.groundFrequencyOverrideDays,
        record.containerFrequencyOverrideDays,
        Number(record.notificationEnabled),
        Number(record.notificationOverridden),
        record.notificationTime,
        record.createdAt,
        record.updatedAt,
      );
    }
    for (const record of data.plantScheduleSnapshots) {
      await db.runAsync(
        `INSERT INTO plant_care_plan_schedule_snapshots (
          id, mutation_id, plant_id, care_plan_id, interval_days,
          notification_enabled, notification_overridden, notification_time,
          is_active, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        record.id,
        record.mutationId,
        record.plantId,
        record.carePlanId,
        record.intervalDays,
        Number(record.notificationEnabled),
        Number(record.notificationOverridden),
        record.notificationTime,
        Number(record.isActive),
        record.createdAt,
        record.updatedAt,
      );
    }
    if (data.reminderPreferences) {
      await db.runAsync(
        `INSERT INTO reminder_preferences (
          id, notification_enabled, updated_at
        ) VALUES ('global', ?, ?)`,
        Number(data.reminderPreferences.notificationEnabled),
        data.reminderPreferences.updatedAt,
      );
    }
    if (data.weatherLocation) {
      await db.runAsync(
        `INSERT INTO weather_locations (
          id, label, latitude, longitude, updated_at
        ) VALUES ('growing-location', ?, ?, ?, ?)`,
        data.weatherLocation.label,
        data.weatherLocation.latitude,
        data.weatherLocation.longitude,
        data.weatherLocation.updatedAt,
      );
    }
  });
}
