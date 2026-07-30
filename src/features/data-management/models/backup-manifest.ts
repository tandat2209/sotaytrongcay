import { z } from "zod";

export const BACKUP_FORMAT = "so-tay-trong-cay-backup";
export const BACKUP_FORMAT_VERSION = 1;

const id = z.string().uuid();
const dateTime = z.iso.datetime();
const notificationTime = z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/);

const PlantBackupSchema = z.object({
  id,
  name: z.string().trim().min(1),
  speciesId: z.string().min(1),
  stageId: z.string().min(1),
  growingMethod: z.enum(["ground", "container"]),
  location: z.string().trim().nullable(),
  plantedAt: z.iso.date().nullable(),
  stageStartedAt: dateTime.nullable(),
  archivedAt: dateTime.nullable(),
  createdAt: dateTime,
});

const CareActivityBackupSchema = z
  .object({
    id,
    mutationId: id,
    plantId: id,
    type: z.enum(["watering", "fertilizing", "spraying"]),
    occurredAt: dateTime,
    origin: z.enum(["today", "reminder", "manual"]),
    intensity: z.enum(["light", "moderate", "deep", "rain"]).nullable(),
    amountValue: z.number().positive().nullable(),
    amountUnit: z.literal("liter").nullable(),
    sprayTargetId: z
      .string()
      .regex(/^(?:disease|pest)\.[a-z0-9-]+(?:\.[a-z0-9-]+)*$/)
      .nullable(),
    sprayTargetNameSnapshot: z.string().trim().min(1).nullable(),
    notes: z.string().nullable(),
    createdAt: dateTime,
  })
  .superRefine((record, context) => {
    if ((record.amountValue === null) !== (record.amountUnit === null)) {
      context.addIssue({
        code: "custom",
        path: ["amountValue"],
        message: "Amount and unit must be saved together.",
      });
    }
    if (
      (record.sprayTargetId === null) !==
      (record.sprayTargetNameSnapshot === null)
    ) {
      context.addIssue({
        code: "custom",
        path: ["sprayTargetId"],
        message: "Spray target fields must be saved together.",
      });
    }
    if (
      record.type !== "watering" &&
      (record.intensity !== null || record.amountValue !== null)
    ) {
      context.addIssue({
        code: "custom",
        path: ["intensity"],
        message: "Watering details require a watering activity.",
      });
    }
    if (record.type !== "spraying" && record.sprayTargetId !== null) {
      context.addIssue({
        code: "custom",
        path: ["sprayTargetId"],
        message: "Spray details require a spraying activity.",
      });
    }
  });

const PlantUpdateBackupSchema = z.object({
  id,
  mutationId: id,
  plantId: id,
  occurredAt: dateTime,
  notes: z.string().trim().min(1).nullable(),
  stageId: z.string().min(1),
  createdAt: dateTime,
});

const PlantUpdatePhotoBackupSchema = z.object({
  id,
  plantUpdateId: id,
  fileName: z.string().regex(/^[0-9a-f-]{36}\.(?:heic|jpeg|jpg|png|webp)$/i),
  position: z.number().int().nonnegative(),
  createdAt: dateTime,
});

const PlantStageHistoryBackupSchema = z.object({
  id,
  plantId: id,
  fromStageId: z.string().min(1),
  toStageId: z.string().min(1),
  journalEntryId: id,
  changedAt: dateTime,
  createdAt: dateTime,
});

const SnapshotFields = {
  id,
  mutationId: id,
  carePlanId: z.string().min(1),
  notificationEnabled: z.boolean(),
  notificationOverridden: z.boolean(),
  notificationTime: notificationTime.nullable(),
  createdAt: dateTime,
  updatedAt: dateTime,
};

const StageScheduleSnapshotBackupSchema = z.object({
  ...SnapshotFields,
  stageId: z.string().min(1),
  groundFrequencyOverrideDays: z.number().int().positive().nullable(),
  containerFrequencyOverrideDays: z.number().int().positive().nullable(),
});

const PlantScheduleSnapshotBackupSchema = z.object({
  ...SnapshotFields,
  plantId: id,
  intervalDays: z.number().int().positive(),
  isActive: z.boolean(),
});

const ReminderPreferencesBackupSchema = z.object({
  notificationEnabled: z.boolean(),
  updatedAt: dateTime,
});

const fertilizerGroup = z.enum([
  "organic",
  "nitrogen-rich",
  "npk-balanced",
  "phosphorus-rich",
  "potassium-rich",
  "support",
  "other",
]);

const UserFertilizerBackupSchema = z.object({
  id,
  mutationId: id,
  name: z.string().trim().min(1),
  group: fertilizerGroup.nullable(),
  knowledgeId: z.string().trim().min(1).nullable(),
  createdAt: dateTime,
  updatedAt: dateTime,
});

const FertilizerApplicationBackupSchema = z
  .object({
    id,
    careActivityId: id,
    userFertilizerId: id.nullable(),
    position: z.number().int().nonnegative(),
    nameSnapshot: z.string().trim().min(1),
    groupSnapshot: fertilizerGroup.nullable(),
    knowledgeIdSnapshot: z.string().trim().min(1).nullable(),
    amountValue: z.number().positive().nullable(),
    amountUnit: z
      .enum(["handful", "spoon", "cap", "gram", "milliliter", "other"])
      .nullable(),
    applicationMethod: z
      .enum(["root", "drench", "foliar", "topdress"])
      .nullable(),
    notes: z.string().trim().min(1).nullable(),
  })
  .refine(
    (record) => (record.amountValue === null) === (record.amountUnit === null),
    {
      message: "Fertilizer amount and unit must be saved together.",
      path: ["amountValue"],
    },
  );

const WeatherLocationBackupSchema = z.object({
  label: z.string().trim().min(1),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  updatedAt: dateTime,
});

const BackupDataSchema = z.object({
  plants: z.array(PlantBackupSchema),
  careActivities: z.array(CareActivityBackupSchema),
  plantUpdates: z.array(PlantUpdateBackupSchema),
  plantUpdatePhotos: z.array(PlantUpdatePhotoBackupSchema),
  plantStageHistory: z.array(PlantStageHistoryBackupSchema),
  stageScheduleSnapshots: z.array(StageScheduleSnapshotBackupSchema),
  plantScheduleSnapshots: z.array(PlantScheduleSnapshotBackupSchema),
  reminderPreferences: ReminderPreferencesBackupSchema.nullable(),
  userFertilizers: z.array(UserFertilizerBackupSchema),
  fertilizerApplications: z.array(FertilizerApplicationBackupSchema),
  weatherLocation: WeatherLocationBackupSchema.nullable(),
});

function duplicate(values: readonly string[]): boolean {
  return new Set(values).size !== values.length;
}

export const BackupManifestSchema = z
  .object({
    format: z.literal(BACKUP_FORMAT),
    formatVersion: z.literal(BACKUP_FORMAT_VERSION),
    databaseVersion: z.number().int().positive(),
    backupId: id,
    createdAt: dateTime,
    data: BackupDataSchema,
  })
  .superRefine(({ data }, context) => {
    const collections = [
      data.plants,
      data.careActivities,
      data.plantUpdates,
      data.plantUpdatePhotos,
      data.plantStageHistory,
      data.stageScheduleSnapshots,
      data.plantScheduleSnapshots,
      data.userFertilizers,
      data.fertilizerApplications,
    ];
    if (
      collections.some((records) =>
        duplicate(records.map(({ id: recordId }) => recordId)),
      )
    ) {
      context.addIssue({
        code: "custom",
        path: ["data"],
        message: "Archive contains duplicate identifiers.",
      });
    }
    const duplicateConstrainedValue =
      duplicate(data.careActivities.map((record) => record.mutationId)) ||
      duplicate(data.plantUpdates.map((record) => record.mutationId)) ||
      duplicate(
        data.stageScheduleSnapshots.map((record) => record.mutationId),
      ) ||
      duplicate(
        data.plantScheduleSnapshots.map((record) => record.mutationId),
      ) ||
      duplicate(data.userFertilizers.map((record) => record.mutationId)) ||
      duplicate(
        data.plantUpdatePhotos.map(
          (record) => `${record.plantUpdateId}:${record.position}`,
        ),
      ) ||
      duplicate(
        data.fertilizerApplications.map(
          (record) => `${record.careActivityId}:${record.position}`,
        ),
      ) ||
      duplicate(
        data.stageScheduleSnapshots.map(
          (record) => `${record.stageId}:${record.carePlanId}`,
        ),
      ) ||
      duplicate(
        data.plantScheduleSnapshots.map(
          (record) => `${record.plantId}:${record.carePlanId}`,
        ),
      ) ||
      duplicate(
        data.plantStageHistory.map((record) => record.journalEntryId),
      ) ||
      duplicate(
        data.userFertilizers.flatMap((record) =>
          record.knowledgeId === null ? [] : [record.knowledgeId],
        ),
      );
    if (duplicateConstrainedValue) {
      context.addIssue({
        code: "custom",
        path: ["data"],
        message: "Archive violates a unique record constraint.",
      });
    }

    const plantIds = new Set(data.plants.map((plant) => plant.id));
    const updateIds = new Set(data.plantUpdates.map((update) => update.id));
    const activityIds = new Set(
      data.careActivities.map((activity) => activity.id),
    );
    const fertilizerIds = new Set(
      data.userFertilizers.map((fertilizer) => fertilizer.id),
    );
    const hasMissingReference =
      data.careActivities.some((record) => !plantIds.has(record.plantId)) ||
      data.plantUpdates.some((record) => !plantIds.has(record.plantId)) ||
      data.plantUpdatePhotos.some(
        (record) => !updateIds.has(record.plantUpdateId),
      ) ||
      data.plantStageHistory.some(
        (record) =>
          !plantIds.has(record.plantId) ||
          !updateIds.has(record.journalEntryId),
      ) ||
      data.plantScheduleSnapshots.some(
        (record) => !plantIds.has(record.plantId),
      ) ||
      data.fertilizerApplications.some(
        (record) =>
          !activityIds.has(record.careActivityId) ||
          (record.userFertilizerId !== null &&
            !fertilizerIds.has(record.userFertilizerId)),
      );
    if (hasMissingReference) {
      context.addIssue({
        code: "custom",
        path: ["data"],
        message: "Archive contains a missing record reference.",
      });
    }

    for (const photo of data.plantUpdatePhotos) {
      if (
        !photo.fileName.toLowerCase().startsWith(`${photo.id.toLowerCase()}.`)
      ) {
        context.addIssue({
          code: "custom",
          path: ["data", "plantUpdatePhotos"],
          message: "Photo filename does not match its identifier.",
        });
      }
    }
  });

export type BackupManifest = z.infer<typeof BackupManifestSchema>;
