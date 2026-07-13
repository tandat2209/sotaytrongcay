import { join } from "node:path";
import { readFile } from "node:fs/promises";
import Ajv2020 from "ajv/dist/2020";
import addFormats from "ajv-formats";

import { validateKnowledgeSources } from "./schema-validator";
import { normalizeDocument } from "./normalize";
import { validateRelationships } from "./relationship-validator";
import { validateStageGraphs } from "./stage-graph-validator";
import { validateContentQuality } from "./content-quality-validator";
import { selectEligibleContent } from "./eligibility";
import { serializeBundle } from "./serialize";
import { writeAtomic } from "./atomic-write";
import { sortKnowledgeDiagnostics } from "./diagnostics";
import type {
  CompileRequest,
  CompilationResult,
  KnowledgeDiagnostic,
  NormalizedKnowledgeDocument,
} from "./types";

async function validateBundle(
  bundle: unknown,
  knowledgeRoot: string,
  repositoryRoot: string,
): Promise<string | null> {
  const ajv = new Ajv2020({
    allErrors: true,
    strict: true,
    validateFormats: true,
  });
  addFormats(ajv);

  const bundleSchemaPath = join(knowledgeRoot, "_schemas", "mobile-bundle.schema.json");
  try {
    const schemaContent = await readFile(bundleSchemaPath, "utf8");
    const schema = JSON.parse(schemaContent);
    const validate = ajv.compile(schema);
    const isValid = validate(bundle);
    if (!isValid) {
      const errors = validate.errors ?? [];
      return errors.map((e) => `${e.instancePath || "root"}: ${e.message}`).join("; ");
    }
  } catch (error: unknown) {
    return error instanceof Error ? error.message : "Unknown schema load error";
  }
  return null;
}

export async function compileKnowledge(
  request: CompileRequest,
): Promise<CompilationResult> {
  const { repositoryRoot, knowledgeRoot, mode, write, destinationPath } = request;

  // 1. Discover, parse and schema-validate source documents
  const sourceValidation = await validateKnowledgeSources({
    repositoryRoot,
    knowledgeRoot,
  });

  const diagnostics: KnowledgeDiagnostic[] = [...sourceValidation.diagnostics];

  if (diagnostics.some((d) => d.code === "KNOWLEDGE_PARSE_FAILED" || d.code === "KNOWLEDGE_SCHEMA_INVALID" || d.code === "KNOWLEDGE_SCHEMA_LOAD_FAILED")) {
    return { ok: false, diagnostics: sortKnowledgeDiagnostics(diagnostics) };
  }

  // 2. Normalize eligible documents
  const normalizedDocs: NormalizedKnowledgeDocument[] = [];
  for (const doc of sourceValidation.documents) {
    normalizedDocs.push(normalizeDocument(doc));
  }

  // 3. Validate entire graph relations, stage chains, and content quality
  const relationshipDiagnostics = validateRelationships(normalizedDocs);
  const stageGraphDiagnostics = validateStageGraphs(normalizedDocs);
  const contentQualityDiagnostics = validateContentQuality(normalizedDocs);

  diagnostics.push(
    ...relationshipDiagnostics,
    ...stageGraphDiagnostics,
    ...contentQualityDiagnostics,
  );

  // If there are any errors so far, stop compile before eligibility selection
  if (diagnostics.length > 0) {
    return { ok: false, diagnostics: sortKnowledgeDiagnostics(diagnostics) };
  }

  // 4. Mode-based eligibility filtering and graph closure validation
  const selection = selectEligibleContent(normalizedDocs, mode);
  if (!selection.ok) {
    return {
      ok: false,
      diagnostics: sortKnowledgeDiagnostics([...diagnostics, ...selection.diagnostics]),
    };
  }

  // 5. Serialize into deterministic JSON string
  const serialized = serializeBundle(selection.documents, mode);
  const bundle = JSON.parse(serialized);

  // 6. Validate the assembled output bundle against mobile-bundle.schema.json
  const bundleValidationError = await validateBundle(bundle, knowledgeRoot, repositoryRoot);
  if (bundleValidationError !== null) {
    return {
      ok: false,
      diagnostics: [
        {
          code: "KNOWLEDGE_BUNDLE_INVALID",
          path: join("knowledge", "_generated", "mobile-bundle.json"),
          message: `Compiled bundle fails bundle schema validation: ${bundleValidationError}`,
        },
      ],
    };
  }

  // 7. Write atomically if requested
  if (write && destinationPath) {
    try {
      await writeAtomic(destinationPath, serialized);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Unknown filesystem error";
      return {
        ok: false,
        diagnostics: [
          {
            code: "KNOWLEDGE_WRITE_FAILED",
            path: destinationPath,
            message: `Failed to write compilation bundle atomically: ${msg}`,
          },
        ],
      };
    }
  }

  if (destinationPath !== undefined) {
    return {
      ok: true,
      mode,
      bundle,
      serialized,
      destinationPath,
    };
  }

  return {
    ok: true,
    mode,
    bundle,
    serialized,
  };
}
