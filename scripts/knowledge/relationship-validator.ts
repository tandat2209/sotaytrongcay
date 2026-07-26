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
  const fertilizerRoles = new Map<
    string,
    Readonly<{ group: string; guideId: string; path: string }>
  >();

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

    if (
      doc.type === "fertilizer_guide" &&
      doc.id === "fertilizer-guide.focused"
    ) {
      for (const section of doc.sections) {
        for (const item of section.items) {
          const existing = fertilizerRoles.get(item.id);
          if (existing && existing.guideId !== doc.id) {
            diagnostics.push({
              code: "KNOWLEDGE_FERTILIZER_GUIDE_INVALID",
              path: doc.path,
              documentId: doc.id,
              field: "sections.items",
              message: `Fertilizer role ${item.id} is already declared by ${existing.guideId} in ${existing.path}.`,
            });
          } else if (!existing) {
            fertilizerRoles.set(item.id, {
              group: item.group,
              guideId: doc.id,
              path: doc.path,
            });
          }
        }
      }
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
          const allStages = [
            ...(species.lifecycles?.development?.stages ?? []),
            ...(species.lifecycles?.production?.stages ?? []),
          ];
          const inJourney = allStages.some((j) => j.id === doc.id);
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

      case "care_plan": {
        for (const spId of doc.speciesIds) {
          validateIdRef(doc, spId, "speciesIds", "plant_species");
        }
        for (const stId of doc.stageIds) {
          validateIdRef(doc, stId, "stageIds", "growth_stage_playbook");
        }

        if (
          doc.activityType === "fertilizing" &&
          doc.onMissingHistory !== "withhold"
        ) {
          diagnostics.push({
            code: "KNOWLEDGE_FERTILIZER_MISSING_HISTORY_INVALID",
            path: doc.path,
            documentId: doc.id,
            field: "onMissingHistory",
            message: `Fertilizing Care Plan ${doc.id} must withhold suggestions when fertilizing history is missing.`,
          });
        }

        const recommendedGroups = new Set<string>();
        if (doc.recommendedInputs) {
          const catalogIds = new Set<string>();
          let primaryCount = 0;
          for (const input of doc.recommendedInputs) {
            if (input.priority === "primary") {
              primaryCount += 1;
            }
            if (catalogIds.has(input.catalogId)) {
              diagnostics.push({
                code: "KNOWLEDGE_FERTILIZER_ROLE_REFERENCE_INVALID",
                path: doc.path,
                documentId: doc.id,
                field: "recommendedInputs",
                message: `Care Plan ${doc.id} references fertilizer role ${input.catalogId} more than once.`,
              });
            }
            catalogIds.add(input.catalogId);

            const role = fertilizerRoles.get(input.catalogId);
            if (!role) {
              diagnostics.push({
                code: "KNOWLEDGE_FERTILIZER_ROLE_REFERENCE_INVALID",
                path: doc.path,
                documentId: doc.id,
                field: "recommendedInputs",
                message: `Care Plan ${doc.id} references missing fertilizer role ${input.catalogId}.`,
              });
            } else {
              recommendedGroups.add(role.group);
            }
          }

          if (primaryCount !== 1) {
            diagnostics.push({
              code: "KNOWLEDGE_FERTILIZER_ROLE_REFERENCE_INVALID",
              path: doc.path,
              documentId: doc.id,
              field: "recommendedInputs",
              message: `Care Plan ${doc.id} must reference exactly one primary fertilizer role, but found ${primaryCount}.`,
            });
          }
        }

        if (doc.fertilizerGroupGuidance) {
          const describedGroups = new Set<string>();

          for (const guidance of doc.fertilizerGroupGuidance) {
            if (describedGroups.has(guidance.group)) {
              diagnostics.push({
                code: "KNOWLEDGE_FERTILIZER_GROUP_GUIDANCE_INVALID",
                path: doc.path,
                documentId: doc.id,
                field: "fertilizerGroupGuidance",
                message: `Care Plan ${doc.id} describes fertilizer group ${guidance.group} more than once.`,
              });
            }
            describedGroups.add(guidance.group);

            if (!recommendedGroups.has(guidance.group)) {
              diagnostics.push({
                code: "KNOWLEDGE_FERTILIZER_GROUP_GUIDANCE_INVALID",
                path: doc.path,
                documentId: doc.id,
                field: "fertilizerGroupGuidance",
                message: `Care Plan ${doc.id} describes fertilizer group ${guidance.group}, but no recommended input uses that group.`,
              });
            }
          }
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

      case "fertilizer_guide": {
        const sectionIds = new Set<string>();
        const fertilizerIds = new Set<string>();
        for (const section of doc.sections) {
          if (sectionIds.has(section.id)) {
            diagnostics.push({
              code: "KNOWLEDGE_FERTILIZER_GUIDE_INVALID",
              path: doc.path,
              documentId: doc.id,
              field: "sections",
              message: `Fertilizer guide ${doc.id} repeats section ${section.id}.`,
            });
          }
          sectionIds.add(section.id);
          for (const item of section.items) {
            if (fertilizerIds.has(item.id)) {
              diagnostics.push({
                code: "KNOWLEDGE_FERTILIZER_GUIDE_INVALID",
                path: doc.path,
                documentId: doc.id,
                field: "sections.items",
                message: `Fertilizer guide ${doc.id} repeats fertilizer ${item.id}.`,
              });
            }
            fertilizerIds.add(item.id);
          }
        }
        break;
      }

      case "disease":
      case "pest": {
        for (const spId of doc.speciesIds) {
          validateIdRef(doc, spId, "speciesIds", "plant_species");
        }
        for (const stId of doc.stageIds) {
          validateIdRef(doc, stId, "stageIds", "growth_stage_playbook");
        }
        // Warning Sign entities are not implemented yet. Empty lists are valid;
        // populated relationships will be validated when that document type ships.
        break;
      }

      case "reference_source":
        break;
    }
  }

  const recommendationScopes = new Set<string>();
  for (const doc of documents) {
    if (doc.type !== "care_plan") {
      continue;
    }

    for (const speciesId of doc.speciesIds) {
      for (const stageId of doc.stageIds) {
        const scope = `${speciesId}:${stageId}:${doc.activityType}`;
        if (recommendationScopes.has(scope)) {
          diagnostics.push({
            code: "KNOWLEDGE_RECOMMENDATION_SCOPE_DUPLICATE",
            path: doc.path,
            documentId: doc.id,
            field: "speciesIds",
            message: `Care recommendation scope ${scope} must have only one definition.`,
          });
        } else {
          recommendationScopes.add(scope);
        }
      }
    }
  }

  return diagnostics;
}
