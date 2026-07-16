import { getDb } from "@/shared/lib/db/database";
import type { SQLiteDatabase } from "expo-sqlite";
import {
  type FertilizerApplication,
  FertilizerApplicationSchema,
} from "../models/fertilizer-application";

export type FertilizerApplicationRow = Readonly<{
  id: string;
  care_activity_id: string;
  user_fertilizer_id: string | null;
  position: number;
  name_snapshot: string;
  group_snapshot: string | null;
  npk_snapshot: string | null;
  amount_value: number | null;
  amount_unit: string | null;
  application_method: string | null;
  notes: string | null;
}>;

export function fertilizerApplicationToParams(
  application: FertilizerApplication,
): (string | number | null)[] {
  return [
    application.id,
    application.careActivityId,
    application.userFertilizerId,
    application.position,
    application.nameSnapshot,
    application.groupSnapshot,
    application.npkSnapshot,
    application.amountValue,
    application.amountUnit,
    application.applicationMethod,
    application.notes,
  ];
}

export function fertilizerApplicationFromRow(
  row: FertilizerApplicationRow,
): FertilizerApplication {
  return FertilizerApplicationSchema.parse({
    id: row.id,
    careActivityId: row.care_activity_id,
    userFertilizerId: row.user_fertilizer_id,
    position: row.position,
    nameSnapshot: row.name_snapshot,
    groupSnapshot: row.group_snapshot,
    npkSnapshot: row.npk_snapshot,
    amountValue: row.amount_value,
    amountUnit: row.amount_unit,
    applicationMethod: row.application_method,
    notes: row.notes,
  });
}

export async function listFertilizerApplications(
  careActivityId?: string,
): Promise<FertilizerApplication[]> {
  const db = await getDb();
  const rows = careActivityId
    ? await db.getAllAsync<FertilizerApplicationRow>(
        "SELECT * FROM fertilizer_applications WHERE care_activity_id = ? ORDER BY position",
        [careActivityId],
      )
    : await db.getAllAsync<FertilizerApplicationRow>(
        "SELECT * FROM fertilizer_applications ORDER BY care_activity_id, position",
      );
  return rows.map(fertilizerApplicationFromRow);
}

export async function insertFertilizerApplication(
  db: SQLiteDatabase,
  input: FertilizerApplication,
): Promise<void> {
  const application = FertilizerApplicationSchema.parse(input);
  await db.runAsync(
    `INSERT OR IGNORE INTO fertilizer_applications
      (id, care_activity_id, user_fertilizer_id, position, name_snapshot,
       group_snapshot, npk_snapshot, amount_value, amount_unit,
       application_method, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    fertilizerApplicationToParams(application),
  );
}
