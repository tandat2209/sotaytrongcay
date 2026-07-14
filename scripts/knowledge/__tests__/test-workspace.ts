import { cp, mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";

export interface TestWorkspace {
  readonly repositoryRoot: string;
  readonly knowledgeRoot: string;
  writeKnowledgeFile(relativePath: string, content: string): Promise<string>;
  cleanup(): Promise<void>;
}

export async function createTestWorkspace(): Promise<TestWorkspace> {
  const repositoryRoot = await mkdtemp(join(tmpdir(), "knowledge-compiler-"));
  const knowledgeRoot = join(repositoryRoot, "knowledge");
  await mkdir(knowledgeRoot, { recursive: true });
  await cp(
    join(process.cwd(), "knowledge", "_schemas"),
    join(knowledgeRoot, "_schemas"),
    {
      recursive: true,
    },
  );

  return {
    repositoryRoot,
    knowledgeRoot,
    async writeKnowledgeFile(
      relativePath: string,
      content: string,
    ): Promise<string> {
      const absolutePath = join(knowledgeRoot, relativePath);
      await mkdir(dirname(absolutePath), { recursive: true });
      await writeFile(absolutePath, content, "utf8");
      return absolutePath;
    },
    async cleanup(): Promise<void> {
      await rm(repositoryRoot, { recursive: true, force: true });
    },
  };
}
