import { Directory, File, Paths } from "expo-file-system";
import * as Notifications from "expo-notifications";

import { reconcileAllCarePlanReminders } from "@/features/reminders";
import { DATABASE_VERSION } from "@/shared/lib/db/database";
import { createId } from "@/shared/lib/identifiers";
import {
  readBackupSnapshot,
  replaceDataFromBackup,
} from "../data/backup-repository";
import {
  BACKUP_FORMAT,
  BACKUP_FORMAT_VERSION,
  BackupManifestSchema,
  type BackupManifest,
} from "../models/backup-manifest";

const MANIFEST_FILE_NAME = "manifest.json";
const PHOTOS_DIRECTORY_NAME = "photos";
const RESTORE_DIRECTORY_PREFIX = "restored-journal-photos-";

export type PreparedRestore = Readonly<{
  archiveDirectory: Directory;
  manifest: BackupManifest;
}>;

export type BackupSummary = Readonly<{
  careEntryCount: number;
  createdAt: string;
  folderName: string;
  plantCount: number;
}>;

function backupFolderName(createdAt: string, backupId: string): string {
  const timestamp = createdAt.replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  return `So-Tay-Trong-Cay-${timestamp}-${backupId.slice(0, 8)}`;
}

export async function chooseBackupDestination(): Promise<Directory | null> {
  try {
    return await Directory.pickDirectoryAsync();
  } catch {
    return null;
  }
}

export async function createLocalBackup(
  destination: Directory,
): Promise<BackupSummary> {
  const snapshot = await readBackupSnapshot();
  const createdAt = new Date().toISOString();
  const manifest = BackupManifestSchema.parse({
    format: BACKUP_FORMAT,
    formatVersion: BACKUP_FORMAT_VERSION,
    databaseVersion: DATABASE_VERSION,
    backupId: createId(),
    createdAt,
    data: snapshot.data,
  });
  const archive = new Directory(
    destination,
    backupFolderName(createdAt, manifest.backupId),
  );
  let archiveCreated = false;

  try {
    archive.create({ intermediates: true });
    archiveCreated = true;
    const photos = new Directory(archive, PHOTOS_DIRECTORY_NAME);
    photos.create();
    for (const photo of manifest.data.plantUpdatePhotos) {
      const sourceUri = snapshot.photoSourceUris.get(photo.id);
      if (!sourceUri) throw new Error(`Missing source photo ${photo.id}.`);
      const source = new File(sourceUri);
      if (!source.exists)
        throw new Error(`Source photo ${photo.id} is unavailable.`);
      await source.copy(new File(photos, photo.fileName));
    }
    const manifestFile = new File(archive, MANIFEST_FILE_NAME);
    manifestFile.create();
    manifestFile.write(JSON.stringify(manifest, null, 2));
  } catch (error) {
    if (archiveCreated && archive.exists) archive.delete();
    throw error;
  }

  return summarize(manifest, archive.name);
}

export async function chooseBackupForRestore(): Promise<PreparedRestore | null> {
  let archiveDirectory: Directory;
  try {
    archiveDirectory = await Directory.pickDirectoryAsync();
  } catch {
    return null;
  }
  const manifestFile = new File(archiveDirectory, MANIFEST_FILE_NAME);
  if (!manifestFile.exists) throw new Error("Backup manifest is missing.");
  const manifest = BackupManifestSchema.parse(
    JSON.parse(await manifestFile.text()) as unknown,
  );
  if (manifest.databaseVersion > DATABASE_VERSION) {
    throw new Error("Backup requires a newer database version.");
  }
  validatePhotoFiles(archiveDirectory, manifest);
  return { archiveDirectory, manifest };
}

function validatePhotoFiles(
  archiveDirectory: Directory,
  manifest: BackupManifest,
): void {
  const photos = new Directory(archiveDirectory, PHOTOS_DIRECTORY_NAME);
  if (manifest.data.plantUpdatePhotos.length > 0 && !photos.exists) {
    throw new Error("Backup photo directory is missing.");
  }
  for (const photo of manifest.data.plantUpdatePhotos) {
    if (!new File(photos, photo.fileName).exists) {
      throw new Error(`Backup photo ${photo.fileName} is missing.`);
    }
  }
}

async function stageRestorePhotos(
  prepared: PreparedRestore,
): Promise<
  Readonly<{ directory: Directory; uris: ReadonlyMap<string, string> }>
> {
  const directory = new Directory(
    Paths.document,
    `${RESTORE_DIRECTORY_PREFIX}${prepared.manifest.backupId}`,
  );
  if (directory.exists) directory.delete();
  directory.create({ intermediates: true });
  const sourceDirectory = new Directory(
    prepared.archiveDirectory,
    PHOTOS_DIRECTORY_NAME,
  );
  const uris = new Map<string, string>();
  try {
    for (const photo of prepared.manifest.data.plantUpdatePhotos) {
      const destination = new File(directory, photo.fileName);
      await new File(sourceDirectory, photo.fileName).copy(destination);
      uris.set(photo.id, destination.uri);
    }
    return { directory, uris };
  } catch (error) {
    if (directory.exists) directory.delete();
    throw error;
  }
}

export async function restoreLocalBackup(
  prepared: PreparedRestore,
): Promise<BackupSummary & Readonly<{ remindersReconciled: boolean }>> {
  validatePhotoFiles(prepared.archiveDirectory, prepared.manifest);
  const staged = await stageRestorePhotos(prepared);
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await replaceDataFromBackup(prepared.manifest.data, staged.uris);
  } catch (error) {
    if (staged.directory.exists) staged.directory.delete();
    try {
      await reconcileAllCarePlanReminders();
    } catch {
      // The original records remain valid even if notification repair must retry.
    }
    throw error;
  }

  removeSupersededPhotoDirectories(staged.directory.name);
  let remindersReconciled = true;
  try {
    await reconcileAllCarePlanReminders();
  } catch {
    remindersReconciled = false;
  }
  return {
    ...summarize(prepared.manifest, prepared.archiveDirectory.name),
    remindersReconciled,
  };
}

function removeSupersededPhotoDirectories(currentName: string): void {
  for (const entry of new Directory(Paths.document).list()) {
    if (
      entry instanceof Directory &&
      (entry.name === "journal-photos" ||
        (entry.name.startsWith(RESTORE_DIRECTORY_PREFIX) &&
          entry.name !== currentName))
    ) {
      try {
        entry.delete();
      } catch {
        // The restored database is durable; stale photo cleanup is best-effort.
      }
    }
  }
}

export function summarize(
  manifest: BackupManifest,
  folderName: string,
): BackupSummary {
  return {
    careEntryCount:
      manifest.data.careActivities.length + manifest.data.plantUpdates.length,
    createdAt: manifest.createdAt,
    folderName,
    plantCount: manifest.data.plants.length,
  };
}
