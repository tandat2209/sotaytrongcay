import type {
  NormalizedKnowledgeDocument,
  KnowledgeDiagnostic,
  CompilationMode,
  NormalizedUserFacingBaseDocument,
  NormalizedReferenceSource,
  NormalizedPlantSpecies,
  NormalizedGrowthStagePlaybook,
  NormalizedCareRecommendationDefinition,
  NormalizedCareGuide,
} from "./types";

export interface SelectionResult {
  readonly ok: boolean;
  readonly documents: readonly NormalizedKnowledgeDocument[];
  readonly diagnostics: readonly KnowledgeDiagnostic[];
}

export function isUserFacingEligible(
  doc: NormalizedUserFacingBaseDocument,
  mode: CompilationMode,
): boolean {
  if (doc.locale !== "vi-VN") {
    return false;
  }

  if (mode === "production") {
    return doc.status === "approved";
  } else {
    return doc.status === "approved" || doc.status === "review";
  }
}

export function selectEligibleContent(
  documents: readonly NormalizedKnowledgeDocument[],
  mode: CompilationMode,
): SelectionResult {
  const diagnostics: KnowledgeDiagnostic[] = [];
  const idMap = new Map<string, NormalizedKnowledgeDocument>();
  for (const doc of documents) {
    idMap.set(doc.id, doc);
  }

  // 1. Identify eligible user-facing documents
  const eligibleUserFacing = new Map<string, NormalizedKnowledgeDocument>();
  for (const doc of documents) {
    if (doc.type !== "reference_source") {
      const uf = doc as NormalizedUserFacingBaseDocument;
      if (isUserFacingEligible(uf, mode)) {
        eligibleUserFacing.set(uf.id, doc);
      }
    }
  }

  // Helper to check if a referenced user-facing document is eligible
  function checkUfDependency(
    doc: NormalizedUserFacingBaseDocument,
    depId: string,
    field: string,
  ) {
    const target = idMap.get(depId);
    if (!target) {
      // Missing dependency is already handled by relationship-validator.
      return;
    }

    if (target.type !== "reference_source") {
      const depUf = target as NormalizedUserFacingBaseDocument;
      if (!isUserFacingEligible(depUf, mode)) {
        diagnostics.push({
          code: "KNOWLEDGE_DEPENDENCY_INELIGIBLE",
          path: doc.path,
          documentId: doc.id,
          field,
          message: `Document ${doc.id} references ineligible dependency ${depId} (status is ${depUf.status}) in mode ${mode}.`,
        });
      }
    }
  }

  // 2. Validate that all user-facing dependencies of eligible documents are also eligible
  for (const doc of eligibleUserFacing.values()) {
    switch (doc.type) {
      case "plant_species": {
        const species = doc as NormalizedPlantSpecies;
        for (const item of species.stageJourney) {
          if (item.playbookStatus !== "unavailable") {
            checkUfDependency(species, item.id, "stageJourney");
          }
        }
        break;
      }

      case "growth_stage_playbook": {
        const playbook = doc as NormalizedGrowthStagePlaybook;
        checkUfDependency(playbook, playbook.speciesId, "speciesId");
        for (const recId of playbook.careRecommendationIds) {
          checkUfDependency(playbook, recId, "careRecommendationIds");
        }
        for (const guideId of playbook.guideIds) {
          checkUfDependency(playbook, guideId, "guideIds");
        }
        if (playbook.nextStageId !== null) {
          checkUfDependency(playbook, playbook.nextStageId, "nextStageId");
        }
        break;
      }

      case "care_recommendation_definition": {
        const rec = doc as NormalizedCareRecommendationDefinition;
        for (const spId of rec.speciesIds) {
          checkUfDependency(rec, spId, "speciesIds");
        }
        for (const stId of rec.stageIds) {
          checkUfDependency(rec, stId, "stageIds");
        }
        break;
      }

      case "care_guide": {
        const guide = doc as NormalizedCareGuide;
        for (const spId of guide.speciesIds) {
          checkUfDependency(guide, spId, "speciesIds");
        }
        for (const stId of guide.stageIds) {
          checkUfDependency(guide, stId, "stageIds");
        }
        break;
      }
    }
  }

  // 3. Resolve reachable reference sources and ensure they are active
  const eligibleReferences = new Map<string, NormalizedReferenceSource>();
  for (const doc of eligibleUserFacing.values()) {
    const uf = doc as NormalizedUserFacingBaseDocument;
    for (const refId of uf.references) {
      const refDoc = idMap.get(refId);
      if (!refDoc) {
        // Missing relationship, relationship validator will catch it.
        continue;
      }

      if (refDoc.type === "reference_source") {
        const refSrc = refDoc as NormalizedReferenceSource;
        if (refSrc.status !== "active") {
          diagnostics.push({
            code: "KNOWLEDGE_DEPENDENCY_INELIGIBLE",
            path: uf.path,
            documentId: uf.id,
            field: "references",
            message: `Document ${uf.id} references inactive reference source ${refId} (status is ${refSrc.status}).`,
          });
        } else {
          eligibleReferences.set(refSrc.id, refSrc);
        }
      }
    }
  }

  if (diagnostics.length > 0) {
    return {
      ok: false,
      documents: [],
      diagnostics,
    };
  }

  const selectedDocs: NormalizedKnowledgeDocument[] = [
    ...eligibleUserFacing.values(),
    ...eligibleReferences.values(),
  ];

  return {
    ok: true,
    documents: selectedDocs,
    diagnostics: [],
  };
}
