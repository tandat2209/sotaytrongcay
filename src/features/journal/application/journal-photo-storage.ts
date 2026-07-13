import { Directory, File, Paths } from "expo-file-system";
import type { PlantUpdatePhoto } from "../models/plant-update";

const SUPPORTED_EXTENSIONS = new Set(["heic", "jpeg", "jpg", "png", "webp"]);

export type PendingJournalPhoto = Readonly<{
  createdAt: string;
  fileName: string | null;
  id: string;
  position: number;
  sourceUri: string;
}>;

export function getPersistentPhotoName(photoId: string, fileName: string | null, sourceUri: string): string {
  const uriPath = sourceUri.split(/[?#]/, 1)[0] ?? sourceUri;
  const candidate = fileName ?? uriPath;
  const extension = candidate.match(/\.([a-zA-Z0-9]+)$/)?.[1]?.toLowerCase();
  return `${photoId}.${extension && SUPPORTED_EXTENSIONS.has(extension) ? extension : "jpg"}`;
}

export async function persistJournalPhotos(
  plantId: string,
  updateId: string,
  photos: readonly PendingJournalPhoto[],
): Promise<PlantUpdatePhoto[]> {
  const directory = new Directory(Paths.document, "journal-photos", plantId, updateId);
  directory.create({ idempotent: true, intermediates: true });

  const persisted: PlantUpdatePhoto[] = [];
  for (const photo of photos) {
    const destination = new File(directory, getPersistentPhotoName(photo.id, photo.fileName, photo.sourceUri));
    if (!destination.exists) {
      await new File(photo.sourceUri).copy(destination);
    }
    persisted.push({ id: photo.id, localUri: destination.uri, position: photo.position, createdAt: photo.createdAt });
  }
  return persisted;
}

export function deletePersistedJournalPhotos(plantId: string, updateId: string): void {
  const directory = new Directory(Paths.document, "journal-photos", plantId, updateId);
  if (directory.exists) directory.delete();
}
