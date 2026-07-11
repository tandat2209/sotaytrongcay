import type {
  NormalizedKnowledgeDocument,
  CompilationMode,
  NormalizedPlantSpecies,
  NormalizedGrowthStagePlaybook,
  NormalizedCareRecommendationDefinition,
  NormalizedCareGuide,
  NormalizedReferenceSource,
} from "./types";

export const BUNDLE_SCHEMA_VERSION = "1.0.0";
export const KNOWLEDGE_CONTENT_VERSION = "1.0.0";

function sortArray(arr: readonly string[]): readonly string[] {
  return [...arr].sort();
}

export function serializeBundle(
  documents: readonly NormalizedKnowledgeDocument[],
  mode: CompilationMode,
): string {
  // 1. Separate types and sort by ID
  const speciesDocs = (documents.filter((d) => d.type === "plant_species") as NormalizedPlantSpecies[])
    .sort((a, b) => a.id.localeCompare(b.id));

  const stageDocs = (documents.filter((d) => d.type === "growth_stage_playbook") as NormalizedGrowthStagePlaybook[])
    .sort((a, b) => a.id.localeCompare(b.id));

  const recDocs = (documents.filter((d) => d.type === "care_recommendation_definition") as NormalizedCareRecommendationDefinition[])
    .sort((a, b) => a.id.localeCompare(b.id));

  const guideDocs = (documents.filter((d) => d.type === "care_guide") as NormalizedCareGuide[])
    .sort((a, b) => a.id.localeCompare(b.id));

  const refDocs = (documents.filter((d) => d.type === "reference_source") as NormalizedReferenceSource[])
    .sort((a, b) => a.id.localeCompare(b.id));

  // 2. Build objects in contract key order
  const compiledSpecies = speciesDocs.map((s) => {
    const parseStages = (stages: readonly any[]) =>
      [...stages]
        .sort((a, b) => a.sequence - b.sequence)
        .map((item) => ({
          id: item.id,
          title: item.title,
          sequence: item.sequence,
          playbookStatus: item.playbookStatus,
        }));

    const stateMachines = {
      development: {
        stages: parseStages(s.stateMachines?.development?.stages ?? []),
      },
      production: {
        stages: parseStages(s.stateMachines?.production?.stages ?? []),
      },
    };

    return {
      id: s.id,
      type: s.type,
      title: s.title,
      locale: s.locale,
      version: s.version,
      status: s.status,
      references: sortArray(s.references),
      scientificName: s.scientificName,
      stateMachines,
      bodyMarkdown: s.bodyMarkdown,
    };
  });

  const compiledStagePlaybooks = stageDocs.map((s) => ({
    id: s.id,
    type: s.type,
    title: s.title,
    locale: s.locale,
    version: s.version,
    status: s.status,
    references: sortArray(s.references),
    speciesId: s.speciesId,
    sequence: s.sequence,
    machineId: s.machineId,
    primaryObjective: s.primaryObjective,
    entryCriteria: s.entryCriteria,
    exitCriteria: s.exitCriteria,
    estimatedDuration: s.estimatedDuration,
    recommendedPlaybook: s.recommendedPlaybook,
    defaultReminderTemplates: sortArray(s.defaultReminderTemplates),
    recommendedKnowledgeTopics: sortArray(s.recommendedKnowledgeTopics),
    bodyMarkdown: s.bodyMarkdown,
  }));

  const compiledCareRecommendations = recDocs.map((r) => ({
    id: r.id,
    type: r.type,
    title: r.title,
    locale: r.locale,
    version: r.version,
    status: r.status,
    references: sortArray(r.references),
    speciesIds: sortArray(r.speciesIds),
    stageIds: sortArray(r.stageIds),
    activityType: r.activityType,
    bodyMarkdown: r.bodyMarkdown,
  }));

  const compiledGuides = guideDocs.map((g) => ({
    id: g.id,
    type: g.type,
    title: g.title,
    locale: g.locale,
    version: g.version,
    status: g.status,
    references: sortArray(g.references),
    speciesIds: sortArray(g.speciesIds),
    stageIds: sortArray(g.stageIds),
    bodyMarkdown: g.bodyMarkdown,
  }));

  const compiledReferences = refDocs.map((r) => ({
    id: r.id,
    type: r.type,
    title: r.title,
    version: r.version,
    status: r.status,
    publisher: r.publisher,
    sourceType: r.sourceType,
    url: r.url,
    accessed: r.accessed,
    bodyMarkdown: r.bodyMarkdown,
  }));

  // Construct the bundle using exact contract key order
  const bundle = {
    schemaVersion: BUNDLE_SCHEMA_VERSION,
    contentVersion: KNOWLEDGE_CONTENT_VERSION,
    mode,
    species: compiledSpecies,
    stagePlaybooks: compiledStagePlaybooks,
    careRecommendations: compiledCareRecommendations,
    guides: compiledGuides,
    references: compiledReferences,
  };

  return `${JSON.stringify(bundle, null, 2)}\n`;
}
