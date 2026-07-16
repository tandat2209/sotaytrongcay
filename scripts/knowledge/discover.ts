import { readdir } from "node:fs/promises";
import { join } from "node:path";

const EXCLUDED_DIRECTORIES = new Set(["_schemas", "_generated", "assets"]);

export async function discoverMarkdownFiles(
  knowledgeRoot: string,
): Promise<string[]> {
  const discovered: string[] = [];

  async function visit(directory: string): Promise<void> {
    const entries = await readdir(directory, { withFileTypes: true });

    for (const entry of entries) {
      const absolutePath = join(directory, entry.name);
      if (entry.isDirectory()) {
        if (!EXCLUDED_DIRECTORIES.has(entry.name)) {
          await visit(absolutePath);
        }
        continue;
      }

      if (entry.isFile() && entry.name.endsWith(".md")) {
        discovered.push(absolutePath);
      }
    }
  }

  await visit(knowledgeRoot);
  return discovered.sort((left, right) => left.localeCompare(right));
}
