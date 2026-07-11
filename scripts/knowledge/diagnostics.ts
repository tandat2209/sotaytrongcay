import type { KnowledgeDiagnostic } from "./types";

function compareOptionalText(left: string | undefined, right: string | undefined): number {
  return (left ?? "").localeCompare(right ?? "");
}

export function sortKnowledgeDiagnostics(
  diagnostics: readonly KnowledgeDiagnostic[],
): KnowledgeDiagnostic[] {
  return [...diagnostics].sort((left, right) => {
    const pathOrder = left.path.localeCompare(right.path);
    if (pathOrder !== 0) {
      return pathOrder;
    }

    const documentOrder = compareOptionalText(left.documentId, right.documentId);
    if (documentOrder !== 0) {
      return documentOrder;
    }

    const fieldOrder = compareOptionalText(left.field, right.field);
    if (fieldOrder !== 0) {
      return fieldOrder;
    }

    return left.code.localeCompare(right.code);
  });
}
