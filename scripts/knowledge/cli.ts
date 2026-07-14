import { join, resolve } from "node:path";
import { compileKnowledge } from "./compiler";
import { checkKnowledgeFreshness } from "./freshness";
import { validateKnowledgeSources } from "./schema-validator";
import { normalizeDocument } from "./normalize";
import { validateRelationships } from "./relationship-validator";
import { validateStageGraphs } from "./stage-graph-validator";
import { validateContentQuality } from "./content-quality-validator";
import { sortKnowledgeDiagnostics } from "./diagnostics";
import type {
  CompilationMode,
  KnowledgeDiagnostic,
  NormalizedKnowledgeDocument,
} from "./types";

const REPOSITORY_ROOT = resolve(__dirname, "../..");
const KNOWLEDGE_ROOT = join(REPOSITORY_ROOT, "knowledge");

function printDiagnostics(diagnostics: readonly KnowledgeDiagnostic[]) {
  for (const diag of diagnostics) {
    const fieldPart = diag.field ? ` [field: ${diag.field}]` : "";
    const docIdPart = diag.documentId ? ` [docId: ${diag.documentId}]` : "";
    console.error(
      `Error: ${diag.code} in ${diag.path}${docIdPart}${fieldPart} - ${diag.message}`,
    );
  }
}

function parseArgs(args: string[]): Record<string, string> {
  const options: Record<string, string> = {};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg !== undefined && arg.startsWith("--")) {
      const name = arg.substring(2);
      const val = args[i + 1];
      if (val !== undefined && !val.startsWith("--")) {
        options[name] = val;
        i++;
      }
    }
  }
  return options;
}

async function run() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || !["validate", "compile", "check"].includes(command)) {
    console.error("Usage: tsx cli.ts <validate|compile|check> [options]");
    console.error(
      "Options for compile: --mode <production|preview> --output <path>",
    );
    process.exit(2);
  }

  if (command === "validate") {
    // 1. Validate sources
    const sourceValidation = await validateKnowledgeSources({
      repositoryRoot: REPOSITORY_ROOT,
      knowledgeRoot: KNOWLEDGE_ROOT,
    });
    const diagnostics: KnowledgeDiagnostic[] = [
      ...sourceValidation.diagnostics,
    ];

    if (
      diagnostics.some(
        (d) =>
          d.code === "KNOWLEDGE_PARSE_FAILED" ||
          d.code === "KNOWLEDGE_SCHEMA_INVALID" ||
          d.code === "KNOWLEDGE_SCHEMA_LOAD_FAILED",
      )
    ) {
      printDiagnostics(sortKnowledgeDiagnostics(diagnostics));
      process.exit(1);
    }

    // 2. Normalize
    const normalizedDocs: NormalizedKnowledgeDocument[] = [];
    for (const doc of sourceValidation.documents) {
      normalizedDocs.push(normalizeDocument(doc));
    }

    // 3. Graph relations, stage chains, and content quality validation
    const relationshipDiag = validateRelationships(normalizedDocs);
    const stageGraphDiag = validateStageGraphs(normalizedDocs);
    const contentQualityDiag = validateContentQuality(normalizedDocs);

    diagnostics.push(
      ...relationshipDiag,
      ...stageGraphDiag,
      ...contentQualityDiag,
    );

    if (diagnostics.length > 0) {
      printDiagnostics(sortKnowledgeDiagnostics(diagnostics));
      process.exit(1);
    }

    console.log("Validation successful.");
    process.exit(0);
  }

  if (command === "compile") {
    const options = parseArgs(args.slice(1));
    const mode = options.mode;
    const output = options.output;

    if (!mode || !["production", "preview"].includes(mode)) {
      console.error("Error: --mode must be 'production' or 'preview'");
      process.exit(2);
    }

    if (!output) {
      console.error("Error: --output path is required");
      process.exit(2);
    }

    // Explicit constraint: preview mode cannot write to the production output path
    const resolvedOutput = resolve(REPOSITORY_ROOT, output);
    const resolvedProductionOutput = resolve(
      KNOWLEDGE_ROOT,
      "_generated/mobile-bundle.json",
    );

    if (mode === "preview" && resolvedOutput === resolvedProductionOutput) {
      console.error(
        "Error: Preview mode cannot write to the production output path knowledge/_generated/mobile-bundle.json.",
      );
      process.exit(2);
    }

    const compileResult = await compileKnowledge({
      repositoryRoot: REPOSITORY_ROOT,
      knowledgeRoot: KNOWLEDGE_ROOT,
      mode: mode as CompilationMode,
      write: true,
      destinationPath: resolvedOutput,
    });

    if (!compileResult.ok) {
      printDiagnostics(compileResult.diagnostics);
      process.exit(1);
    }

    console.log(`Compilation successful. Written to ${output}`);
    process.exit(0);
  }

  if (command === "check") {
    const committedBundlePath = join(
      KNOWLEDGE_ROOT,
      "_generated",
      "mobile-bundle.json",
    );
    const checkResult = await checkKnowledgeFreshness({
      repositoryRoot: REPOSITORY_ROOT,
      knowledgeRoot: KNOWLEDGE_ROOT,
      committedBundlePath,
    });

    if (!checkResult.ok) {
      printDiagnostics(checkResult.diagnostics);
      process.exit(1);
    }

    console.log("Committed bundle is fresh.");
    process.exit(0);
  }
}

run().catch((err) => {
  console.error("Fatal compiler execution error:", err);
  process.exit(1);
});
