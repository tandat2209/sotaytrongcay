import { writeFile, rename, rm } from "node:fs/promises";
import { dirname, basename, join } from "node:path";

export async function writeAtomic(
  destinationPath: string,
  content: string,
): Promise<void> {
  const dir = dirname(destinationPath);
  const base = basename(destinationPath);
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const tempPath = join(dir, `.${base}.tmp-${randomSuffix}`);

  try {
    // Write content with 'wx' flag (exclusive write, fails if file exists somehow)
    await writeFile(tempPath, content, { flag: "wx", encoding: "utf8" });
    // Atomically rename over the destination
    await rename(tempPath, destinationPath);
  } catch (error: unknown) {
    // Attempt cleanup of our temporary file only
    try {
      await rm(tempPath, { force: true });
    } catch {
      // Ignore cleanup error to let the original error propagate
    }
    throw error;
  }
}
