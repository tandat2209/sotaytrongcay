import { getDb } from "@/shared/lib/db/database";
import type { SQLiteDatabase } from "expo-sqlite";
import {
  type FertilizerApplication,
  FertilizerApplicationSchema,
} from "../models/fertilizer-application";
import type {
  FertilizerSuggestionUsage,
  UserFertilizerUsage,
} from "../models/suggested-fertilizer-application";

export type FertilizerApplicationRow = Readonly<{
  id: string;
  care_activity_id: string;
  user_fertilizer_id: string | null;
  position: number;
  name_snapshot: string;
  group_snapshot: string | null;
  knowledge_id_snapshot: string | null;
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
    application.knowledgeIdSnapshot,
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
    knowledgeIdSnapshot: row.knowledge_id_snapshot,
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
       group_snapshot, knowledge_id_snapshot, amount_value, amount_unit,
       application_method, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    fertilizerApplicationToParams(application),
  );
}

export type FertilizerSuggestionUsageRow = Readonly<{
  knowledge_id: string;
  occurred_at: string;
  plant_name: string;
}>;

export async function listFertilizerSuggestionUsages(): Promise<
  FertilizerSuggestionUsage[]
> {
  const db = await getDb();
  const rows = await db.getAllAsync<FertilizerSuggestionUsageRow>(
    `SELECT applications.knowledge_id_snapshot AS knowledge_id,
            activities.occurred_at,
            plants.name AS plant_name
       FROM fertilizer_applications AS applications
       JOIN care_activities AS activities
         ON activities.id = applications.care_activity_id
       JOIN plants ON plants.id = activities.plant_id
      WHERE applications.knowledge_id_snapshot IS NOT NULL
      ORDER BY activities.occurred_at DESC`,
  );
  return rows.map((row) => ({
    knowledgeId: row.knowledge_id,
    occurredAt: row.occurred_at,
    plantName: row.plant_name,
  }));
}

export type UserFertilizerUsageRow = Readonly<{
  fertilizer_id: string;
  occurred_at: string;
  plant_name: string;
}>;

export async function listUserFertilizerUsages(): Promise<
  UserFertilizerUsage[]
> {
  const db = await getDb();
  const rows = await db.getAllAsync<UserFertilizerUsageRow>(
    `SELECT fertilizers.id AS fertilizer_id,
            activities.occurred_at,
            plants.name AS plant_name
       FROM user_fertilizers AS fertilizers
       JOIN fertilizer_applications AS applications
         ON applications.user_fertilizer_id = fertilizers.id
         OR (
           fertilizers.knowledge_id IS NOT NULL
           AND applications.knowledge_id_snapshot = fertilizers.knowledge_id
         )
       JOIN care_activities AS activities
         ON activities.id = applications.care_activity_id
       JOIN plants ON plants.id = activities.plant_id
      ORDER BY activities.occurred_at DESC`,
  );
  return rows.map((row) => ({
    fertilizerId: row.fertilizer_id,
    occurredAt: row.occurred_at,
    plantName: row.plant_name,
  }));
}
