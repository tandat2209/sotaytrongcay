import type {
  NormalizedKnowledgeDocument,
  KnowledgeDiagnostic,
  NormalizedUserFacingBaseDocument,
  NormalizedCareGuide,
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
    if (doc.type !== "reference_source" && doc.type !== "care_plan") {
      // Definitions are decision-only; linked guides own Vietnamese user-facing copy.
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
    if (doc.type === "care_guide") {
      const guide = doc as NormalizedCareGuide;
      if (!guide.goal.trim()) {
        diagnostics.push({
          code: "KNOWLEDGE_REASON_MISSING",
          path: doc.path,
          documentId: doc.id,
          field: "goal",
          message: `Care guide ${doc.id} is missing a non-empty 'goal' field.`,
        });
      }
    } else if (doc.type === "growth_stage_playbook") {
      // Playbooks with safety/avoid guidance must cite a reference
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
