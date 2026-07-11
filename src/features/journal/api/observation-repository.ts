import { getDb } from "@/shared/lib/db/database";
import { Observation, ObservationSchema } from "../models/observation";

export async function insertObservation(observation: Observation): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO observations (id, plant_id, observation_type, value_json, created_at)
     VALUES (?, ?, ?, ?, ?)`,
    [
      observation.id,
      observation.plantId,
      observation.observationType,
      JSON.stringify(observation.value),
      observation.createdAt,
    ]
  );
}

export async function getObservationsForPlant(plantId: string): Promise<Observation[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<{
    id: string;
    plant_id: string;
    observation_type: string;
    value_json: string;
    created_at: string;
  }>(`SELECT * FROM observations WHERE plant_id = ? ORDER BY created_at DESC`, [plantId]);

  return rows.map((row) =>
    ObservationSchema.parse({
      id: row.id,
      plantId: row.plant_id,
      observationType: row.observation_type,
      value: JSON.parse(row.value_json),
      createdAt: row.created_at,
    })
  );
}
