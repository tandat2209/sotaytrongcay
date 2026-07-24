import * as SQLite from "expo-sqlite";
import { DATABASE_VERSION, getDb, getMigrationStatements } from "./database";

jest.mock("expo-sqlite", () => ({
  openDatabaseAsync: jest.fn(),
}));

const mockOpenDatabaseAsync = jest.mocked(SQLite.openDatabaseAsync);

describe("database migrations", () => {
  it("creates the complete unreleased schema from one V1 baseline", () => {
    const migrations = getMigrationStatements(0);

    expect(DATABASE_VERSION).toBe(3);
    expect(migrations).toHaveLength(1);

    const [sql] = migrations;
    expect(sql).toContain("CREATE TABLE plants");
    expect(sql).toContain("location TEXT");
    expect(sql).toContain("growing_method TEXT NOT NULL");
    expect(sql).toContain("stage_started_at TEXT");
    expect(sql).toContain("archived_at TEXT");

    expect(sql).toContain("CREATE TABLE care_activities");
    expect(sql).toContain("watering_intensity TEXT");
    expect(sql).toContain("spray_target_id TEXT");
    expect(sql).toContain("spray_target_name_snapshot TEXT");
    expect(sql).toContain(
      "(spray_target_id IS NULL) = (spray_target_name_snapshot IS NULL)",
    );

    expect(sql).toContain("CREATE TABLE plant_updates");
    expect(sql).toContain("CREATE TABLE plant_update_photos");
    expect(sql).toContain("CREATE TABLE plant_stage_history");
    expect(sql).toContain("CREATE TABLE stage_care_plan_schedule_snapshots");
    expect(sql).toContain("ground_frequency_override_days INTEGER");
    expect(sql).toContain("container_frequency_override_days INTEGER");
    expect(sql).toContain("notification_overridden INTEGER");
    expect(sql).toContain("CREATE TABLE plant_care_plan_schedule_snapshots");
    expect(sql).toContain("CREATE TABLE reminder_preferences");
    expect(sql).toContain("CREATE TABLE plant_care_plan_notification_states");
    expect(sql).toContain("CREATE TABLE user_fertilizers");
    expect(sql).toContain("knowledge_id TEXT");
    expect(sql).toContain("CREATE TABLE fertilizer_applications");
    expect(sql).toContain("knowledge_id_snapshot TEXT");
    expect(sql).toContain("'nitrogen-rich'");
    expect(sql).toContain("'npk-balanced'");
    expect(sql).toContain("'phosphorus-rich'");
    expect(sql).toContain("'potassium-rich'");
    expect(sql).toContain("'support'");
    expect(sql).not.toContain("'single'");
    expect(sql).not.toContain("'supplement'");
    expect(sql).toContain("CREATE TABLE weather_locations");
    expect(sql).toContain("CREATE TABLE weather_cache");
    expect(sql).toContain("CREATE INDEX idx_care_activities_time");
    expect(sql).toContain("CREATE INDEX idx_plant_updates_time");

    expect(sql).not.toContain("ALTER TABLE");
    expect(sql).not.toContain("DROP TABLE");
    expect(sql).not.toContain("UPDATE plants");
    expect(sql).not.toContain("care_plan_reminder_preferences");
    expect(sql).not.toContain("npk_snapshot");
  });

  it("adds archive state to an installed V1 database", () => {
    const migrations = getMigrationStatements(1);

    expect(migrations).toHaveLength(2);
    expect(migrations[0]).toBe(
      "ALTER TABLE plants ADD COLUMN archived_at TEXT;",
    );
    expect(migrations[1]).toContain("CREATE TABLE reminder_preferences");
  });

  it("adds inherited notification preferences to an installed V2 database", () => {
    const migrations = getMigrationStatements(2);

    expect(migrations).toHaveLength(1);
    expect(migrations[0]).toContain("CREATE TABLE reminder_preferences");
    expect(migrations[0]).toMatch(
      /ALTER TABLE stage_care_plan_schedule_snapshots\s+ADD COLUMN notification_overridden/,
    );
    expect(migrations[0]).toMatch(
      /ALTER TABLE plant_care_plan_schedule_snapshots\s+ADD COLUMN notification_overridden/,
    );
    expect(migrations[0]).toContain(
      "SET notification_overridden = notification_enabled",
    );
  });

  it("does not migrate a current database", () => {
    expect(getMigrationStatements(DATABASE_VERSION)).toEqual([]);
  });

  it("reuses one database connection across concurrent repository reads", () => {
    const opening = new Promise<SQLite.SQLiteDatabase>(() => undefined);
    mockOpenDatabaseAsync.mockReturnValue(opening);

    const first = getDb();
    const second = getDb();

    expect(mockOpenDatabaseAsync).toHaveBeenCalledTimes(1);
    expect(first).toBe(opening);
    expect(second).toBe(opening);
  });
});
