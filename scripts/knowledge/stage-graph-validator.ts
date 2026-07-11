import type {
  NormalizedKnowledgeDocument,
  KnowledgeDiagnostic,
  NormalizedPlantSpecies,
  NormalizedGrowthStagePlaybook,
} from "./types";

export function validateStageGraphs(
  documents: readonly NormalizedKnowledgeDocument[],
): readonly KnowledgeDiagnostic[] {
  const diagnostics: KnowledgeDiagnostic[] = [];

  const speciesDocs = documents.filter(
    (doc): doc is NormalizedPlantSpecies => doc.type === "plant_species",
  );
  const playbookDocs = documents.filter(
    (doc): doc is NormalizedGrowthStagePlaybook => doc.type === "growth_stage_playbook",
  );

  const playbookMap = new Map<string, NormalizedGrowthStagePlaybook>();
  for (const pb of playbookDocs) {
    playbookMap.set(pb.id, pb);
  }

  for (const species of speciesDocs) {
    const allStages = new Map<string, any>();
    
    // Collect all stages
    for (const st of species.lifecycles?.development?.stages ?? []) {
      allStages.set(st.id, { ...st, lifecycleId: "development" });
    }
    for (const st of species.lifecycles?.production?.stages ?? []) {
      allStages.set(st.id, { ...st, lifecycleId: "production" });
    }

    for (const [stageId, item] of allStages.entries()) {
      const playbook = playbookMap.get(item.id);

      if (item.playbookStatus === "unavailable") {
        if (playbook) {
          diagnostics.push({
            code: "KNOWLEDGE_STAGE_CHAIN_INVALID",
            path: playbook.path,
            documentId: playbook.id,
            field: "status",
            message: `Playbook ${playbook.id} exists but is marked 'unavailable' in ${item.lifecycleId} lifecycle of species ${species.id}.`,
          });
        }
      } else {
        if (!playbook) {
          diagnostics.push({
            code: "KNOWLEDGE_STAGE_CHAIN_INVALID",
            path: species.path,
            documentId: species.id,
            field: `lifecycles.${item.lifecycleId}`,
            message: `Playbook ${item.id} is marked '${item.playbookStatus}' in species ${species.id} but the document is missing.`,
          });
        }
      }

      // Validate transitions
      for (const transition of item.transitions ?? []) {
        const targetId = transition.to;
        const targetStage = allStages.get(targetId);
        if (!targetStage) {
          diagnostics.push({
            code: "KNOWLEDGE_STAGE_CHAIN_INVALID",
            path: species.path,
            documentId: species.id,
            field: `lifecycles.${item.lifecycleId}`,
            message: `Stage ${item.id} transitions to an unknown stage ${targetId}.`,
          });
        }
      }
    }
  }

  return diagnostics;
}
