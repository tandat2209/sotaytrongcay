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
    const journey = species.stageJourney;
    if (journey.length === 0) {
      continue;
    }

    // 1. Verify sequence numbers in stage journey are unique and contiguous 1..N
    const sortedJourney = [...journey].sort((a, b) => a.sequence - b.sequence);
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
        field: "stageJourney",
        message: `Stage journey for species ${species.id} has invalid or non-contiguous sequences.`,
      });
      continue; // Skip further stage graph validation for this species if journey is broken
    }

    // 2. Validate playbooks against registry journey items
    for (let i = 0; i < sortedJourney.length; i++) {
      const item = sortedJourney[i];
      if (item === undefined) {
        continue;
      }
      const playbook = playbookMap.get(item.id);

      if (item.playbookStatus === "unavailable") {
        if (playbook) {
          diagnostics.push({
            code: "KNOWLEDGE_STAGE_CHAIN_INVALID",
            path: playbook.path,
            documentId: playbook.id,
            field: "status",
            message: `Playbook ${playbook.id} exists but is marked 'unavailable' in the journey of species ${species.id}.`,
          });
        }
      } else {
        if (!playbook) {
          diagnostics.push({
            code: "KNOWLEDGE_STAGE_CHAIN_INVALID",
            path: species.path,
            documentId: species.id,
            field: "stageJourney",
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
              message: `Playbook ${playbook.id} sequence (${playbook.sequence}) does not match the journey sequence (${item.sequence}) for species ${species.id}.`,
            });
          }

          // Check nextStageId
          const isTerminal = i === sortedJourney.length - 1;
          if (isTerminal) {
            if (playbook.nextStageId !== null) {
              diagnostics.push({
                code: "KNOWLEDGE_STAGE_CHAIN_INVALID",
                path: playbook.path,
                documentId: playbook.id,
                field: "nextStageId",
                message: `Terminal playbook ${playbook.id} has a nextStageId: ${playbook.nextStageId}, expected null.`,
              });
            }
          } else {
            const nextItem = sortedJourney[i + 1];
            if (nextItem !== undefined) {
              const expectedNextId = nextItem.id;
              if (playbook.nextStageId !== expectedNextId) {
                diagnostics.push({
                  code: "KNOWLEDGE_STAGE_CHAIN_INVALID",
                  path: playbook.path,
                  documentId: playbook.id,
                  field: "nextStageId",
                  message: `Playbook ${playbook.id} has nextStageId '${playbook.nextStageId}', expected '${expectedNextId}'.`,
                });
              }
            }
          }
        }
      }
    }
  }

  return diagnostics;
}
