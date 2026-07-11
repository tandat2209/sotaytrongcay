import type {
  NormalizedKnowledgeDocument,
  KnowledgeDiagnostic,
  NormalizedUserFacingBaseDocument,
} from "./types";

// Explicit Vietnamese diacritics Unicode character regex (case-insensitive)
const VIETNAMESE_REGEX = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;

export function extractMarkdownSection(body: string, heading: string): string {
  const lines = body.split("\n");
  const headingIndex = lines.findIndex((line) => line !== undefined && line.trim().startsWith(heading));
  if (headingIndex === -1) {
    return "";
  }

  const sectionLines: string[] = [];
  for (let i = headingIndex + 1; i < lines.length; i++) {
    const line = lines[i];
    if (line !== undefined) {
      if (line.trim().startsWith("#")) {
        break;
      }
      sectionLines.push(line);
    }
  }

  return sectionLines.join("\n").trim();
}

export function validateContentQuality(
  documents: readonly NormalizedKnowledgeDocument[],
): readonly KnowledgeDiagnostic[] {
  const diagnostics: KnowledgeDiagnostic[] = [];

  for (const doc of documents) {
    // 1. Language validation: User-facing documents must contain Vietnamese copy
    if (doc.type !== "reference_source") {
      const userFacing = doc as NormalizedUserFacingBaseDocument;
      
      // Combine title and body to check for Vietnamese diacritics
      const fullText = `${doc.title}\n${doc.bodyMarkdown}`;
      if (!VIETNAMESE_REGEX.test(fullText)) {
        diagnostics.push({
          code: "KNOWLEDGE_VIETNAMESE_CONTENT_MISSING",
          path: doc.path,
          documentId: doc.id,
          field: "locale",
          message: `User-facing document ${doc.id} must contain Vietnamese content (diacritics expected).`,
        });
      }
    }

    // 2. Specific validations by type
    if (doc.type === "care_recommendation_definition") {
      // Must contain a non-empty "## Vì sao nên làm" section
      const reasonSection = extractMarkdownSection(doc.bodyMarkdown, "## Vì sao nên làm");
      if (reasonSection.length === 0) {
        diagnostics.push({
          code: "KNOWLEDGE_REASON_MISSING",
          path: doc.path,
          documentId: doc.id,
          field: "bodyMarkdown",
          message: `Care recommendation definition ${doc.id} is missing a non-empty '## Vì sao nên làm' section.`,
        });
      }

      // Check if it has avoid guidance in body (e.g. "## Điều cần tránh" exists and is not empty)
      const avoidSection = extractMarkdownSection(doc.bodyMarkdown, "## Điều cần tránh");
      const userFacing = doc as NormalizedUserFacingBaseDocument;
      if (avoidSection.length > 0 && userFacing.references.length === 0) {
        diagnostics.push({
          code: "KNOWLEDGE_REFERENCE_REQUIRED",
          path: doc.path,
          documentId: doc.id,
          field: "references",
          message: `Safety or avoid guidance in care recommendation ${doc.id} requires at least one reference.`,
        });
      }
    } else if (doc.type === "growth_stage_playbook") {
      // Check if it has avoid guidance and references
      const avoidSection = extractMarkdownSection(doc.bodyMarkdown, "## Điều cần tránh");
      const userFacing = doc as NormalizedUserFacingBaseDocument;
      if (avoidSection.length > 0 && userFacing.references.length === 0) {
        diagnostics.push({
          code: "KNOWLEDGE_REFERENCE_REQUIRED",
          path: doc.path,
          documentId: doc.id,
          field: "references",
          message: `Safety or avoid guidance in growth stage playbook ${doc.id} requires at least one reference.`,
        });
      }
    }
  }

  return diagnostics;
}
