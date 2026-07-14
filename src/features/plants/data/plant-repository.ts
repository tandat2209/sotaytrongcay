import { getDb } from "@/shared/lib/db/database";
import { Plant, PlantSchema } from "../models/plant";

export type PlantRow = {
  id: string;
  name: string;
  species_id: string;
  stage_id: string;
  growing_method: "ground" | "container";
  location: string | null;
  planted_at: string | null;
  stage_started_at: string | null;
  created_at: string;
};

export function plantToInsertParams(plant: Plant): (string | null)[] {
  return [
    plant.id,
    plant.name,
    plant.speciesId,
    plant.stageId,
    plant.growingMethod,
    plant.location,
    plant.plantedAt,
    plant.stageStartedAt,
    plant.createdAt,
  ];
}

export function plantFromRow(row: PlantRow): Plant {
  return PlantSchema.parse({
    id: row.id,
    name: row.name,
    speciesId: row.species_id,
    stageId: row.stage_id,
    growingMethod: row.growing_method,
    location: row.location,
    plantedAt: row.planted_at,
    stageStartedAt: row.stage_started_at,
    createdAt: row.created_at,
  });
}

export async function savePlant(plantInput: Plant): Promise<void> {
  const plant = PlantSchema.parse(plantInput);
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO plants (id, name, species_id, stage_id, growing_method, location, planted_at, stage_started_at, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    plantToInsertParams(plant),
  );
}

export async function getPlant(id: string): Promise<Plant | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<PlantRow>("SELECT * FROM plants WHERE id = ?", [id]);
  return row ? plantFromRow(row) : null;
}

export async function listPlants(): Promise<Plant[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<PlantRow>("SELECT * FROM plants ORDER BY created_at DESC");
  return rows.map(plantFromRow);
}
