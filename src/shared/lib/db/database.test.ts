import { DATABASE_VERSION, getMigrationStatements } from "./database";

describe("database migrations", () => {
  it("creates plants and care activities with stable watering units", () => {
    const sql = getMigrationStatements(0).join("\n");

    expect(DATABASE_VERSION).toBe(6);
    expect(sql).toContain("CREATE TABLE plants");
    expect(sql).toContain("name TEXT NOT NULL");
    expect(sql).toContain("CREATE TABLE IF NOT EXISTS care_activities");
    expect(sql).toContain("amount_unit TEXT CHECK (amount_unit IN ('liter'))");
    expect(sql).toContain("mutation_id TEXT NOT NULL UNIQUE");
  });

  it("adds journal updates, ordered photos, and stage history in version 5", () => {
    const sql = getMigrationStatements(4).join("\n");

    expect(sql).toContain("CREATE TABLE plant_updates");
    expect(sql).toContain("CREATE TABLE plant_update_photos");
    expect(sql).toContain("position INTEGER NOT NULL");
    expect(sql).toContain("CREATE TABLE plant_stage_history");
    expect(sql).toContain("journal_entry_id TEXT NOT NULL UNIQUE");
    expect(sql).not.toContain("DROP TABLE");
  });

  it("adds and truthfully backfills the current stage start in version 6", () => {
    const sql = getMigrationStatements(5).join("\n");

    expect(sql).toContain("ALTER TABLE plants ADD COLUMN stage_started_at TEXT");
    expect(sql).toContain("UPDATE plants");
    expect(sql).toContain("FROM plant_stage_history");
    expect(sql).toContain("history.to_stage_id = plants.stage_id");
    expect(sql).not.toContain("planted_at");
    expect(sql).not.toContain("created_at");
  });

  it("resets the prototype tables before establishing the clean baseline", () => {
    const sql = getMigrationStatements(0).join("\n");

    expect(sql).toContain("DROP TABLE IF EXISTS activities");
    expect(sql).toContain("DROP TABLE IF EXISTS observations");
    expect(sql).toContain("DROP TABLE IF EXISTS plants");
  });

  it("resets version-one prototype databases before using the current schema", () => {
    const sql = getMigrationStatements(1).join("\n");

    expect(sql).toContain("DROP TABLE IF EXISTS activities");
    expect(sql).toContain("CREATE TABLE plants");
  });

  it("adds the location column when upgrading from version 2", () => {
    const sql = getMigrationStatements(2).join("\n");

    expect(sql).toContain("ALTER TABLE plants ADD COLUMN location TEXT");
    expect(sql).not.toContain("DROP TABLE");
  });

  it("does not return applied migrations", () => {
    expect(getMigrationStatements(DATABASE_VERSION)).toEqual([]);
  });
});
