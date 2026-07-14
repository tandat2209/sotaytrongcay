import { getDb } from "@/shared/lib/db/database";
import { CareActivity, CareActivitySchema } from "../models/care-activity";

export type CareActivityRow = {
  id: string;
  mutation_id: string;
  plant_id: string;
  activity_type: string;
  occurred_at: string;
  origin: string;
  amount_value: number | null;
  amount_unit: string | null;
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
    activity.amount?.value ?? null,
    activity.amount?.unit ?? null,
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
    amount:
      row.amount_value === null || row.amount_unit === null
        ? null
        : { value: row.amount_value, unit: row.amount_unit },
    notes: row.notes,
    createdAt: row.created_at,
  });
}

export async function saveCareActivity(input: CareActivity): Promise<void> {
  const activity = CareActivitySchema.parse(input);
  const db = await getDb();
  await db.runAsync(
    `INSERT OR IGNORE INTO care_activities
      (id, mutation_id, plant_id, activity_type, occurred_at, origin, amount_value, amount_unit, notes, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    careActivityToInsertParams(activity),
  );
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
