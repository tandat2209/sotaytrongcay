import { readFile } from "node:fs/promises";
import { join } from "node:path";

import Ajv2020 from "ajv/dist/2020";
import type { AnySchema, ErrorObject, ValidateFunction } from "ajv";
import addFormats from "ajv-formats";

import { discoverMarkdownFiles } from "./discover";
import { parseMarkdownFile } from "./parse";
import { toRepositoryRelativePath } from "./paths";
import { sortKnowledgeDiagnostics } from "./diagnostics";
import type {
  KnowledgeDiagnostic,
  KnowledgeDocumentType,
  ParsedSourceDocument,
  ValidatedSourceDocument,
  ValidateSourceDocumentsInput,
  ValidateSourceDocumentsResult,
} from "./types";
import { KNOWLEDGE_DOCUMENT_TYPES } from "./types";

const TYPE_TO_SCHEMA_FILENAME = new Map<KnowledgeDocumentType, string>([
  ["plant_species", "species.schema.json"],
  ["growth_stage_playbook", "stage-playbook.schema.json"],
  ["care_plan", "care-plan.schema.json"],
  ["care_guide", "guide.schema.json"],
  ["reference_source", "reference.schema.json"],
]);

const SUPPORTED_TYPES = new Set<string>(KNOWLEDGE_DOCUMENT_TYPES);

function isKnowledgeDocumentType(type: string): type is KnowledgeDocumentType {
  return SUPPORTED_TYPES.has(type);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function readJsonFile(path: string): Promise<AnySchema> {
  const parsed = JSON.parse(await readFile(path, "utf8")) as unknown;
  if (!isRecord(parsed)) {
    throw new Error(`Schema file ${path} must contain a JSON object.`);
  }

  return parsed;
}

interface ValidatorBuildResult {
  readonly validators: Map<KnowledgeDocumentType, ValidateFunction>;
  readonly diagnostics: KnowledgeDiagnostic[];
}

async function buildValidators(
  knowledgeRoot: string,
  repositoryRoot: string,
): Promise<ValidatorBuildResult> {
  const ajv = new Ajv2020({
    allErrors: true,
    strict: true,
    validateFormats: true,
  });
  addFormats(ajv);

  const validators = new Map<KnowledgeDocumentType, ValidateFunction>();
  const diagnostics: KnowledgeDiagnostic[] = [];
  for (const type of KNOWLEDGE_DOCUMENT_TYPES) {
    const schemaFilename = TYPE_TO_SCHEMA_FILENAME.get(type);
    if (schemaFilename === undefined) {
      continue;
    }

    const schemaPath = join(knowledgeRoot, "_schemas", schemaFilename);
    try {
      const schema = await readJsonFile(schemaPath);
      validators.set(type, ajv.compile(schema));
    } catch (error: unknown) {
      const detail = error instanceof Error ? error.name : "Unknown error";
      diagnostics.push({
        code: "KNOWLEDGE_SCHEMA_LOAD_FAILED",
        path: toRepositoryRelativePath(repositoryRoot, schemaPath),
        message: `Knowledge schema could not be loaded or compiled: ${detail}.`,
      });
    }
  }

  return { validators, diagnostics };
}

function schemaFieldPath(error: ErrorObject): string {
  const missingProperty =
    isRecord(error.params) && typeof error.params.missingProperty === "string"
      ? error.params.missingProperty
      : undefined;

  if (missingProperty !== undefined) {
    const parentPath = error.instancePath
      .split("/")
      .filter((segment) => segment.length > 0)
      .join(".");
    return parentPath.length > 0
      ? `${parentPath}.${missingProperty}`
      : missingProperty;
  }

  return error.instancePath
    .split("/")
    .filter((segment) => segment.length > 0)
    .join(".");
}

function schemaDiagnostic(
  document: ParsedSourceDocument,
  error: ErrorObject,
): KnowledgeDiagnostic {
  const field = schemaFieldPath(error);
  return {
    code: "KNOWLEDGE_SCHEMA_INVALID",
    path: document.path,
    documentId: document.id,
    field,
    message: `Knowledge document does not match schema at ${field || "root"}: ${error.message ?? "invalid value"}.`,
  };
}

function matchesPlacement(
  document: ParsedSourceDocument,
  type: KnowledgeDocumentType,
): boolean {
  const path = document.path;

  switch (type) {
    case "plant_species":
      return /^knowledge\/species\/[^/]+\/species\.md$/.test(path);
    case "growth_stage_playbook":
      return /^knowledge\/species\/[^/]+\/lifecycles\/[^/]+\/[^/]+\.md$/.test(
        path,
      );
    case "care_plan":
      return /^knowledge\/species\/[^/]+\/care-plans\/[^/]+\.md$/.test(path);
    case "care_guide":
      return /^knowledge\/species\/[^/]+\/guides\/.+\.md$/.test(path);
    case "reference_source":
      return /^knowledge\/references\/[^/]+\.md$/.test(path);
  }
}

function directoryMismatchDiagnostic(
  document: ParsedSourceDocument,
): KnowledgeDiagnostic {
  return {
    code: "KNOWLEDGE_DIRECTORY_MISMATCH",
    path: document.path,
    documentId: document.id,
    field: "type",
    message: `Knowledge document ${document.id} is not in the expected directory for type ${document.type}.`,
  };
}

function unsupportedTypeDiagnostic(
  document: ParsedSourceDocument,
): KnowledgeDiagnostic {
  return {
    code: "KNOWLEDGE_TYPE_UNSUPPORTED",
    path: document.path,
    documentId: document.id,
    field: "type",
    message: `Knowledge document declares unsupported type ${document.type}.`,
  };
}

function isIgnoredRootMarkdownFile(path: string): boolean {
  return /^knowledge\/[^/]+\.md$/.test(path);
}

export async function validateKnowledgeSources({
  repositoryRoot,
  knowledgeRoot = join(repositoryRoot, "knowledge"),
}: ValidateSourceDocumentsInput): Promise<ValidateSourceDocumentsResult> {
  const diagnostics: KnowledgeDiagnostic[] = [];
  const documents: ValidatedSourceDocument[] = [];
  const validatorBuild = await buildValidators(knowledgeRoot, repositoryRoot);
  diagnostics.push(...validatorBuild.diagnostics);
  const sourcePaths = await discoverMarkdownFiles(knowledgeRoot);

  for (const sourcePath of sourcePaths) {
    const relPath = toRepositoryRelativePath(repositoryRoot, sourcePath);
    if (isIgnoredRootMarkdownFile(relPath)) {
      continue;
    }

    const parsed = await parseMarkdownFile({ sourcePath, repositoryRoot });
    diagnostics.push(...parsed.diagnostics);

    if (parsed.document === null) {
      continue;
    }

    if (!isKnowledgeDocumentType(parsed.document.type)) {
      diagnostics.push(unsupportedTypeDiagnostic(parsed.document));
      continue;
    }

    const validator = validatorBuild.validators.get(parsed.document.type);
    if (validator === undefined) {
      continue;
    }

    const isValid = validator(parsed.document.frontmatter);
    if (!isValid) {
      for (const error of validator.errors ?? []) {
        diagnostics.push(schemaDiagnostic(parsed.document, error));
      }
      continue;
    }

    if (!matchesPlacement(parsed.document, parsed.document.type)) {
      diagnostics.push(directoryMismatchDiagnostic(parsed.document));
      continue;
    }

    documents.push({
      ...parsed.document,
      type: parsed.document.type,
    });
  }

  return {
    documents,
    diagnostics: sortKnowledgeDiagnostics(diagnostics),
  };
}
