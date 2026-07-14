import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";

import matter from "gray-matter";

import { toRepositoryRelativePath } from "./paths";
import type { ParseMarkdownFileInput, ParseMarkdownFileResult } from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

interface YamlParserModule {
  readonly parse: (source: string) => unknown;
}

function isYamlParserModule(value: unknown): value is YamlParserModule {
  return isRecord(value) && typeof value.parse === "function";
}

function loadYamlParser(): (source: string) => object {
  const requireFromModule = createRequire(__filename);
  const packagePath = requireFromModule.resolve("yaml/package.json");
  const yamlModule = requireFromModule(
    join(dirname(packagePath), "dist", "index.js"),
  ) as unknown;

  if (isYamlParserModule(yamlModule)) {
    return (source: string): object => {
      const parsed = yamlModule.parse(source);
      if (!isRecord(parsed)) {
        throw new Error(
          "Knowledge document frontmatter must parse to an object.",
        );
      }

      return parsed;
    };
  }

  throw new Error("YAML parser could not be loaded.");
}

const parseYaml = loadYamlParser();

export async function parseMarkdownFile({
  sourcePath,
  repositoryRoot,
}: ParseMarkdownFileInput): Promise<ParseMarkdownFileResult> {
  const diagnosticPath = toRepositoryRelativePath(repositoryRoot, sourcePath);
  const rawSource = await readFile(sourcePath, "utf8");

  if (!rawSource.startsWith("---")) {
    return {
      document: null,
      diagnostics: [
        {
          code: "KNOWLEDGE_FRONTMATTER_MISSING",
          path: diagnosticPath,
          message: "Knowledge document is missing YAML frontmatter.",
        },
      ],
    };
  }

  try {
    const parsed = matter(rawSource, {
      engines: {
        yaml: (source: string): object => parseYaml(source),
      },
    });

    if (!isRecord(parsed.data)) {
      return {
        document: null,
        diagnostics: [
          {
            code: "KNOWLEDGE_PARSE_FAILED",
            path: diagnosticPath,
            message: "Knowledge document frontmatter must parse to an object.",
          },
        ],
      };
    }

    return {
      document: {
        id: optionalString(parsed.data.id) ?? "",
        type: optionalString(parsed.data.type) ?? "",
        path: diagnosticPath,
        absolutePath: sourcePath,
        frontmatter: parsed.data,
        body: parsed.content,
      },
      diagnostics: [],
    };
  } catch (error: unknown) {
    const detail =
      error instanceof Error ? error.message : "Unknown parse error";
    return {
      document: null,
      diagnostics: [
        {
          code: "KNOWLEDGE_PARSE_FAILED",
          path: diagnosticPath,
          message: `Knowledge document frontmatter could not be parsed: ${detail}`,
        },
      ],
    };
  }
}
