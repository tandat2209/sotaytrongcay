import { BackupManifestSchema } from "./backup-manifest";

const plantId = "00000000-0000-4000-8000-000000000001";
const updateId = "00000000-0000-4000-8000-000000000002";
const photoId = "00000000-0000-4000-8000-000000000003";

function manifest() {
  return {
    format: "so-tay-trong-cay-backup",
    formatVersion: 1,
    databaseVersion: 3,
    backupId: "00000000-0000-4000-8000-000000000004",
    createdAt: "2026-07-30T08:00:00.000Z",
    data: {
      plants: [
        {
          id: plantId,
          name: "Cà chua",
          speciesId: "plant.tomato",
          stageId: "stage.seedling",
          growingMethod: "container",
          location: null,
          plantedAt: "2026-07-01",
          stageStartedAt: "2026-07-01T08:00:00.000Z",
          archivedAt: null,
          createdAt: "2026-07-01T08:00:00.000Z",
        },
      ],
      careActivities: [],
      plantUpdates: [
        {
          id: updateId,
          mutationId: "00000000-0000-4000-8000-000000000005",
          plantId,
          occurredAt: "2026-07-30T08:00:00.000Z",
          notes: null,
          stageId: "stage.seedling",
          createdAt: "2026-07-30T08:00:00.000Z",
        },
      ],
      plantUpdatePhotos: [
        {
          id: photoId,
          plantUpdateId: updateId,
          fileName: `${photoId}.jpg`,
          position: 0,
          createdAt: "2026-07-30T08:00:00.000Z",
        },
      ],
      plantStageHistory: [],
      stageScheduleSnapshots: [],
      plantScheduleSnapshots: [],
      reminderPreferences: null,
      userFertilizers: [],
      fertilizerApplications: [],
      weatherLocation: null,
    },
  };
}

function first<Value>(values: readonly Value[]): Value {
  const value = values[0];
  if (value === undefined) throw new Error("Expected fixture value.");
  return value;
}

describe("BackupManifestSchema", () => {
  it("accepts a supported, internally consistent archive", () => {
    expect(BackupManifestSchema.parse(manifest()).formatVersion).toBe(1);
  });

  it("rejects an unsupported archive version", () => {
    expect(() =>
      BackupManifestSchema.parse({ ...manifest(), formatVersion: 2 }),
    ).toThrow();
  });

  it("rejects records that reference a missing parent", () => {
    const value = manifest();
    first(value.data.plantUpdates).plantId =
      "00000000-0000-4000-8000-000000000099";

    expect(() => BackupManifestSchema.parse(value)).toThrow();
  });

  it("rejects unsafe photo paths", () => {
    const value = manifest();
    first(value.data.plantUpdatePhotos).fileName = "../photo.jpg";

    expect(() => BackupManifestSchema.parse(value)).toThrow();
  });

  it("rejects duplicate identifiers", () => {
    const value = manifest();
    value.data.plantUpdatePhotos.push({
      ...first(value.data.plantUpdatePhotos),
      position: 1,
    });

    expect(() => BackupManifestSchema.parse(value)).toThrow();
  });

  it("rejects duplicate child positions", () => {
    const value = manifest();
    value.data.plantUpdatePhotos.push({
      ...first(value.data.plantUpdatePhotos),
      id: "00000000-0000-4000-8000-000000000006",
      fileName: "00000000-0000-4000-8000-000000000006.jpg",
    });

    expect(() => BackupManifestSchema.parse(value)).toThrow();
  });
});
