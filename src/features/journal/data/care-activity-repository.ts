import { getDb, runDatabaseWrite } from "@/shared/lib/db/database";
import {
  type IdempotentInsertOutcome,
  resolveIdempotentInsertOutcome,
} from "@/shared/lib/db/idempotent-insert";
import type { SQLiteDatabase } from "expo-sqlite";
import {
  type CareActivity,
  CareActivitySchema,
  type NewCareActivity,
  NewCareActivitySchema,
} from "../models/care-activity";

export type CareActivityRow = {
  id: string;
  mutation_id: string;
  plant_id: string;
  activity_type: string;
  occurred_at: string;
  origin: string;
  watering_intensity: string | null;
  amount_value: number | null;
  amount_unit: string | null;
  spray_target_id: string | null;
  spray_target_name_snapshot: string | null;
  notes: string | null;
  created_at: string;
};

export function careActivityToInsertParams(
  activity: CareActivity,
): (string | number | null)[] {
  return [
    activity.id,
    activity.mutationId,
    activity.plantId,
    activity.type,
    activity.occurredAt,
    activity.origin,
    activity.intensity,
    activity.estimatedAmountLiters,
    activity.estimatedAmountLiters === null ? null : "liter",
    activity.sprayTargetId ?? null,
    activity.sprayTargetNameSnapshot ?? null,
    activity.notes,
    activity.createdAt,
  ];
}

export function careActivityFromRow(row: CareActivityRow): CareActivity {
  return CareActivitySchema.parse({
    id: row.id,
    mutationId: row.mutation_id,
    plantId: row.plant_id,
    type: row.activity_type,
    occurredAt: row.occurred_at,
    origin: row.origin,
    intensity: row.watering_intensity,
    estimatedAmountLiters:
      row.amount_value === null || row.amount_unit === null
        ? null
        : row.amount_value,
    sprayTargetId: row.spray_target_id,
    sprayTargetNameSnapshot: row.spray_target_name_snapshot,
    notes: row.notes,
    createdAt: row.created_at,
  });
}

export async function saveCareActivity(input: NewCareActivity): Promise<void> {
  const activity = NewCareActivitySchema.parse(input);
  await runDatabaseWrite(async (db) => {
    await insertCareActivity(db, activity);
  });
}

export async function insertCareActivity(
  db: SQLiteDatabase,
  activity: NewCareActivity,
): Promise<IdempotentInsertOutcome> {
  const result = await db.runAsync(
    `INSERT INTO care_activities
      (id, mutation_id, plant_id, activity_type, occurred_at, origin, watering_intensity, amount_value, amount_unit, spray_target_id, spray_target_name_snapshot, notes, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(mutation_id) DO NOTHING`,
    careActivityToInsertParams(activity),
  );
  const saved =
    result.changes === 0
      ? await db.getFirstAsync<{ id: string }>(
          "SELECT id FROM care_activities WHERE mutation_id = ?",
          [activity.mutationId],
        )
      : null;
  return resolveIdempotentInsertOutcome({
    changes: result.changes,
    expectedId: activity.id,
    savedId: saved?.id ?? null,
  });
}

export async function updateCareActivity(
  db: SQLiteDatabase,
  activity: CareActivity,
): Promise<void> {
  await db.runAsync(
    `UPDATE care_activities
     SET occurred_at = ?, watering_intensity = ?, amount_value = ?,
         amount_unit = ?, spray_target_id = ?, spray_target_name_snapshot = ?,
         notes = ?
     WHERE id = ?`,
    [
      activity.occurredAt,
      activity.intensity,
      activity.estimatedAmountLiters,
      activity.estimatedAmountLiters === null ? null : "liter",
      activity.sprayTargetId ?? null,
      activity.sprayTargetNameSnapshot ?? null,
      activity.notes,
      activity.id,
    ],
  );
}

export async function deleteCareActivity(id: string): Promise<void> {
  await runDatabaseWrite(async (db) => {
    await db.runAsync("DELETE FROM care_activities WHERE id = ?", [id]);
  });
}

export async function listCareActivities(
  plantId?: string,
): Promise<CareActivity[]> {
  const db = await getDb();
  const rows = plantId
    ? await db.getAllAsync<CareActivityRow>(
        "SELECT * FROM care_activities WHERE plant_id = ? ORDER BY occurred_at DESC",
        [plantId],
      )
    : await db.getAllAsync<CareActivityRow>(
        "SELECT * FROM care_activities ORDER BY occurred_at DESC",
      );
  return rows.map(careActivityFromRow);
}

export async function getCareActivity(
  id: string,
): Promise<CareActivity | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<CareActivityRow>(
    "SELECT * FROM care_activities WHERE id = ?",
    [id],
  );
  return row ? careActivityFromRow(row) : null;
}
