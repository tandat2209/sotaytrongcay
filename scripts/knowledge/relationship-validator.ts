import type {
  NormalizedKnowledgeDocument,
  KnowledgeDiagnostic,
  NormalizedUserFacingBaseDocument,
} from "./types";

export function validateRelationships(
  documents: readonly NormalizedKnowledgeDocument[],
): readonly KnowledgeDiagnostic[] {
  const diagnostics: KnowledgeDiagnostic[] = [];
  const idMap = new Map<string, NormalizedKnowledgeDocument>();
  const idToDocPath = new Map<string, string>();

  // 1. Check duplicate IDs
  for (const doc of documents) {
    if (idMap.has(doc.id)) {
      diagnostics.push({
        code: "KNOWLEDGE_DUPLICATE_ID",
        path: doc.path,
        documentId: doc.id,
        field: "id",
        message: `Knowledge document has duplicate ID: ${doc.id} (already declared in ${idToDocPath.get(doc.id)}).`,
      });
    } else {
      idMap.set(doc.id, doc);
      idToDocPath.set(doc.id, doc.path);
    }
  }

  // Helper to validate a reference or relationship ID
  function validateIdRef(
    doc: NormalizedKnowledgeDocument,
    refId: string,
    field: string,
    expectedType: NormalizedKnowledgeDocument["type"],
  ) {
    const target = idMap.get(refId);
    if (!target) {
      diagnostics.push({
        code: "KNOWLEDGE_RELATIONSHIP_MISSING",
        path: doc.path,
        documentId: doc.id,
        field,
        message: `Document ${doc.id} references missing ID ${refId} in field ${field}.`,
      });
      return;
    }

    if (target.type !== expectedType) {
      diagnostics.push({
        code: "KNOWLEDGE_RELATIONSHIP_WRONG_TYPE",
        path: doc.path,
        documentId: doc.id,
        field,
        message: `Document ${doc.id} references ID ${refId} in field ${field} with type ${target.type}, expected type ${expectedType}.`,
      });
    }
  }

  // 2. Validate relationships for each document type
  for (const doc of documents) {
    // All user-facing documents have references to reference sources
    if (doc.type !== "reference_source") {
      const userFacing = doc as NormalizedUserFacingBaseDocument;
      for (const refId of userFacing.references) {
        validateIdRef(doc, refId, "references", "reference_source");
      }
    }

    switch (doc.type) {
      case "plant_species": {
        // Plant species stages in the journey are validated in stage-graph-validator.
        break;
      }

      case "growth_stage_playbook": {
        // Validate speciesId exists and has type plant_species
        validateIdRef(doc, doc.speciesId, "speciesId", "plant_species");



        // Validate if this playbook is present in its species stage journey
        const species = idMap.get(doc.speciesId);
        if (species && species.type === "plant_species") {
          const inJourney = species.stageJourney.some((j) => j.id === doc.id);
          if (!inJourney) {
            diagnostics.push({
              code: "KNOWLEDGE_RELATIONSHIP_MISSING",
              path: doc.path,
              documentId: doc.id,
              field: "speciesId",
              message: `Playbook ${doc.id} is not present in the stage journey of species ${doc.speciesId}.`,
            });
          }
        }
        break;
      }

      case "care_recommendation_definition": {
        for (const spId of doc.speciesIds) {
          validateIdRef(doc, spId, "speciesIds", "plant_species");
        }
        for (const stId of doc.stageIds) {
          validateIdRef(doc, stId, "stageIds", "growth_stage_playbook");
        }
        break;
      }

      case "care_guide": {
        for (const spId of doc.speciesIds) {
          validateIdRef(doc, spId, "speciesIds", "plant_species");
        }
        for (const stId of doc.stageIds) {
          validateIdRef(doc, stId, "stageIds", "growth_stage_playbook");
        }
        break;
      }

      case "reference_source":
        break;
    }
  }

  return diagnostics;
}
