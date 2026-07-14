import { relative, sep } from "node:path";

export function toRepositoryRelativePath(
  repositoryRoot: string,
  absolutePath: string,
): string {
  return relative(repositoryRoot, absolutePath).split(sep).join("/");
}

export function toKnowledgeRelativePath(
  repositoryRoot: string,
  absolutePath: string,
): string {
  return toRepositoryRelativePath(repositoryRoot, absolutePath);
}
