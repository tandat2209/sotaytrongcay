import { getDb } from "@/shared/lib/db/database";
import {
  type NewUserFertilizer,
  NewUserFertilizerSchema,
  type UserFertilizer,
  UserFertilizerSchema,
} from "../models/user-fertilizer";

export type UserFertilizerRow = Readonly<{
  id: string;
  mutation_id: string;
  name: string;
  fertilizer_group: string | null;
  npk: string | null;
  created_at: string;
  updated_at: string;
}>;

export function userFertilizerToParams(
  fertilizer: UserFertilizer,
): (string | null)[] {
  return [
    fertilizer.id,
    fertilizer.mutationId,
    fertilizer.name,
    fertilizer.group,
    fertilizer.npk,
    fertilizer.createdAt,
    fertilizer.updatedAt,
  ];
}

export function userFertilizerFromRow(row: UserFertilizerRow): UserFertilizer {
  return UserFertilizerSchema.parse({
    id: row.id,
    mutationId: row.mutation_id,
    name: row.name,
    group: row.fertilizer_group,
    npk: row.npk,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

export async function listUserFertilizers(): Promise<UserFertilizer[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<UserFertilizerRow>(
    "SELECT * FROM user_fertilizers ORDER BY name COLLATE NOCASE, created_at",
  );
  return rows.map(userFertilizerFromRow);
}

export async function getUserFertilizer(
  id: string,
): Promise<UserFertilizer | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<UserFertilizerRow>(
    "SELECT * FROM user_fertilizers WHERE id = ?",
    [id],
  );
  return row ? userFertilizerFromRow(row) : null;
}

export async function saveUserFertilizer(
  input: NewUserFertilizer,
): Promise<void> {
  const fertilizer = NewUserFertilizerSchema.parse(input);
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO user_fertilizers
      (id, mutation_id, name, fertilizer_group, npk, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       mutation_id = excluded.mutation_id,
       name = excluded.name,
       fertilizer_group = excluded.fertilizer_group,
       npk = excluded.npk,
       updated_at = excluded.updated_at`,
    userFertilizerToParams(fertilizer),
  );
}

export async function deleteUserFertilizer(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync("DELETE FROM user_fertilizers WHERE id = ?", [id]);
}
