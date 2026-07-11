import { readFile } from "node:fs/promises";
import { compileKnowledge } from "./compiler";
import type { KnowledgeDiagnostic } from "./types";

export interface FreshnessResult {
  readonly ok: boolean;
  readonly diagnostics: readonly KnowledgeDiagnostic[];
}

export async function checkKnowledgeFreshness(request: {
  readonly repositoryRoot: string;
  readonly knowledgeRoot: string;
  readonly committedBundlePath: string;
}): Promise<FreshnessResult> {
  const { repositoryRoot, knowledgeRoot, committedBundlePath } = request;

  // 1. Run in-memory compilation for production mode
  const compileResult = await compileKnowledge({
    repositoryRoot,
    knowledgeRoot,
    mode: "production",
    write: false,
  });

  if (!compileResult.ok) {
    return {
      ok: false,
      diagnostics: compileResult.diagnostics,
    };
  }

  // 2. Read the existing committed bundle file
  let committedContent = "";
  try {
    committedContent = await readFile(committedBundlePath, "utf8");
  } catch (error: unknown) {
    return {
      ok: false,
      diagnostics: [
        {
          code: "KNOWLEDGE_ARTIFACT_STALE",
          path: committedBundlePath,
          message: `Committed knowledge bundle does not exist or could not be read. Run "pnpm knowledge:compile" and commit knowledge/_generated/mobile-bundle.json.`,
        },
      ],
    };
  }

  // 3. Compare serialized string bytes
  if (compileResult.serialized !== committedContent) {
    return {
      ok: false,
      diagnostics: [
        {
          code: "KNOWLEDGE_ARTIFACT_STALE",
          path: committedBundlePath,
          message: `Committed knowledge bundle is stale. Run "pnpm knowledge:compile" and commit knowledge/_generated/mobile-bundle.json.`,
        },
      ],
    };
  }

  return {
    ok: true,
    diagnostics: [],
  };
}
