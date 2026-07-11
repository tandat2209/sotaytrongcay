import { getDb } from "@/shared/lib/db/database";
import { Activity, ActivitySchema } from "../models/activity";

export async function insertActivity(activity: Activity): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO activities (id, plant_id, activity_type, status, metadata, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      activity.id,
      activity.plantId,
      activity.activityType,
      activity.status,
      activity.metadata ? JSON.stringify(activity.metadata) : null,
      activity.createdAt,
    ]
  );
}

export async function getActivitiesForPlant(plantId: string): Promise<Activity[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<{
    id: string;
    plant_id: string;
    activity_type: string;
    status: string;
    metadata: string | null;
    created_at: string;
  }>(`SELECT * FROM activities WHERE plant_id = ? ORDER BY created_at DESC`, [plantId]);

  return rows.map((row) =>
    ActivitySchema.parse({
      id: row.id,
      plantId: row.plant_id,
      activityType: row.activity_type,
      status: row.status,
      metadata: row.metadata ? JSON.parse(row.metadata) : null,
      createdAt: row.created_at,
    })
  );
}
