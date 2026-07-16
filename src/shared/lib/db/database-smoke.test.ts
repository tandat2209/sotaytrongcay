import {
  validateDatabaseSmokeSnapshot,
  type DatabaseSmokeSnapshot,
} from "./database-smoke";
import { DATABASE_VERSION } from "./database";

const validSnapshot: DatabaseSmokeSnapshot = {
  afterDelete: {
    careActivities: 0,
    photos: 0,
    plantUpdates: 0,
    plants: 0,
  },
  beforeDelete: {
    careActivities: 1,
    photos: 1,
    plantUpdates: 1,
    plants: 1,
  },
  foreignKeys: 1,
  foreignKeyViolations: 0,
  integrityCheck: "ok",
  journalMode: "wal",
  tables: [
    "care_activities",
    "fertilizer_applications",
    "plant_care_plan_notification_states",
    "plant_care_plan_schedule_snapshots",
    "plant_stage_history",
    "plant_update_photos",
    "plant_updates",
    "plants",
    "stage_care_plan_schedule_snapshots",
    "user_fertilizers",
  ],
  updatedPlantName: "Database smoke updated",
  userVersion: DATABASE_VERSION,
};

describe("validateDatabaseSmokeSnapshot", () => {
  it("accepts a complete native SQLite CRUD and cascade cycle", () => {
    expect(validateDatabaseSmokeSnapshot(validSnapshot)).toEqual({
      foreignKeys: true,
      integrity: true,
      journalMode: "wal",
      schema: true,
      userVersion: DATABASE_VERSION,
    });
  });

  it.each([
    [{ ...validSnapshot, journalMode: "delete" }, "WAL"],
    [{ ...validSnapshot, foreignKeys: 0 }, "foreign keys"],
    [{ ...validSnapshot, integrityCheck: "malformed" }, "integrity"],
    [{ ...validSnapshot, tables: ["plants"] }, "schema"],
    [
      {
        ...validSnapshot,
        afterDelete: { ...validSnapshot.afterDelete, photos: 1 },
      },
      "cascade",
    ],
  ])("rejects an invalid database snapshot", (snapshot, message) => {
    expect(() =>
      validateDatabaseSmokeSnapshot(snapshot as DatabaseSmokeSnapshot),
    ).toThrow(message);
  });
});
