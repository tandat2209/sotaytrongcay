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
    const validateMachine = (machineName: "development" | "production", stages: readonly any[]) => {
      if (stages.length === 0) {
        return;
      }

      // 1. Verify sequence numbers in stage journey are unique and contiguous 1..N
      const sortedJourney = [...stages].sort((a, b) => a.sequence - b.sequence);
      let sequenceContiguous = true;
      for (let i = 0; i < sortedJourney.length; i++) {
        const item = sortedJourney[i];
        if (item === undefined || item.sequence !== i + 1) {
          sequenceContiguous = false;
          break;
        }
      }

      if (!sequenceContiguous) {
        diagnostics.push({
          code: "KNOWLEDGE_STAGE_CHAIN_INVALID",
          path: species.path,
          documentId: species.id,
          field: `stateMachines.${machineName}`,
          message: `${machineName} state machine for species ${species.id} has invalid or non-contiguous sequences.`,
        });
        return; // Skip further stage graph validation for this machine
      }

      // 2. Validate playbooks against registry journey items
      for (let i = 0; i < sortedJourney.length; i++) {
        const item = sortedJourney[i];
        if (item === undefined) continue;
        
        const playbook = playbookMap.get(item.id);

        if (item.playbookStatus === "unavailable") {
          if (playbook) {
            diagnostics.push({
              code: "KNOWLEDGE_STAGE_CHAIN_INVALID",
              path: playbook.path,
              documentId: playbook.id,
              field: "status",
              message: `Playbook ${playbook.id} exists but is marked 'unavailable' in ${machineName} machine of species ${species.id}.`,
            });
          }
        } else {
          if (!playbook) {
            diagnostics.push({
              code: "KNOWLEDGE_STAGE_CHAIN_INVALID",
              path: species.path,
              documentId: species.id,
              field: `stateMachines.${machineName}`,
              message: `Playbook ${item.id} is marked '${item.playbookStatus}' in species ${species.id} but the document is missing.`,
            });
          } else {
            // Playbook exists, check sequence matches journey
            if (playbook.sequence !== item.sequence) {
              diagnostics.push({
                code: "KNOWLEDGE_STAGE_CHAIN_INVALID",
                path: playbook.path,
                documentId: playbook.id,
                field: "sequence",
                message: `Playbook ${playbook.id} sequence (${playbook.sequence}) does not match the ${machineName} machine sequence (${item.sequence}) for species ${species.id}.`,
              });
            }
            if (playbook.machineId !== machineName) {
              diagnostics.push({
                code: "KNOWLEDGE_STAGE_CHAIN_INVALID",
                path: playbook.path,
                documentId: playbook.id,
                field: "machineId",
                message: `Playbook ${playbook.id} machineId (${playbook.machineId}) does not match the ${machineName} machine for species ${species.id}.`,
              });
            }
          }
        }
      }
    };

    validateMachine("development", species.stateMachines?.development?.stages ?? []);
    validateMachine("production", species.stateMachines?.production?.stages ?? []);
  }

  return diagnostics;
}
