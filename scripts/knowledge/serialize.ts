import type {
  NormalizedKnowledgeDocument,
  CompilationMode,
  NormalizedPlantSpecies,
  NormalizedGrowthStagePlaybook,
  NormalizedCarePlan,
  NormalizedCareGuide,
  NormalizedDisease,
  NormalizedPest,
  NormalizedThreatBase,
  NormalizedReferenceSource,
  StageJourneyItem,
} from "./types";

export const PRODUCTION_BUNDLE_SCHEMA_VERSION = "1.0.0";
export const PREVIEW_BUNDLE_SCHEMA_VERSION = "1.1.0";
export const KNOWLEDGE_CONTENT_VERSION = "1.0.0";

function sortArray(arr: readonly string[]): readonly string[] {
  return [...arr].sort();
}

export function serializeBundle(
  documents: readonly NormalizedKnowledgeDocument[],
  mode: CompilationMode,
): string {
  // 1. Separate types and sort by ID
  const speciesDocs = (
    documents.filter(
      (d) => d.type === "plant_species",
    ) as NormalizedPlantSpecies[]
  ).sort((a, b) => a.id.localeCompare(b.id));

  const stageDocs = (
    documents.filter(
      (d) => d.type === "growth_stage_playbook",
    ) as NormalizedGrowthStagePlaybook[]
  ).sort((a, b) => a.id.localeCompare(b.id));

  const planDocs = (
    documents.filter((d) => d.type === "care_plan") as NormalizedCarePlan[]
  ).sort((a, b) => b.priority - a.priority || a.id.localeCompare(b.id));

  const guideDocs = (
    documents.filter((d) => d.type === "care_guide") as NormalizedCareGuide[]
  ).sort((a, b) => a.id.localeCompare(b.id));

  const diseaseDocs = (
    documents.filter((d) => d.type === "disease") as NormalizedDisease[]
  ).sort((a, b) => a.id.localeCompare(b.id));

  const pestDocs = (
    documents.filter((d) => d.type === "pest") as NormalizedPest[]
  ).sort((a, b) => a.id.localeCompare(b.id));

  const refDocs = (
    documents.filter(
      (d) => d.type === "reference_source",
    ) as NormalizedReferenceSource[]
  ).sort((a, b) => a.id.localeCompare(b.id));

  // 2. Build objects in contract key order
  const compiledSpecies = speciesDocs.map((s) => {
    const parseStages = (stages: readonly StageJourneyItem[]) =>
      [...stages]
        .sort((a, b) => a.sequence - b.sequence)
        .map((item) => ({
          id: item.id,
          title: item.title,
          sequence: item.sequence,
          transitions: item.transitions,
          playbookStatus: item.playbookStatus,
        }));

    const lifecycles = {
      development: {
        title: s.lifecycles?.development?.title,
        repeatable: s.lifecycles?.development?.repeatable,
        initialStageId: s.lifecycles?.development?.initialStageId,
        stages: parseStages(s.lifecycles?.development?.stages ?? []),
      },
      production: {
        title: s.lifecycles?.production?.title,
        repeatable: s.lifecycles?.production?.repeatable,
        initialStageId: s.lifecycles?.production?.initialStageId,
        stages: parseStages(s.lifecycles?.production?.stages ?? []),
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
      lifecycles,
      bodyMarkdown: s.bodyMarkdown,
    };
  });

  const compiledStagePlaybooks = stageDocs.map((s) => {
    // Find the species document to extract title, sequence, lifecycleId, transitions
    const species = compiledSpecies.find((sp) => sp.id === s.speciesId);
    let title = s.title;
    let sequence = s.sequence;
    let lifecycleId = s.lifecycleId;

    if (species) {
      const devStage = species.lifecycles.development.stages.find(
        (st) => st.id === s.id,
      );
      if (devStage) {
        title = devStage.title;
        sequence = devStage.sequence;
        lifecycleId = "development";
      } else {
        const prodStage = species.lifecycles.production.stages.find(
          (st) => st.id === s.id,
        );
        if (prodStage) {
          title = prodStage.title;
          sequence = prodStage.sequence;
          lifecycleId = "production";
        }
      }
    }

    return {
      id: s.id,
      type: s.type,
      title,
      locale: s.locale,
      version: s.version,
      status: s.status,
      references: sortArray(s.references),
      speciesId: s.speciesId,
      sequence,
      lifecycleId,
      primaryObjective: s.primaryObjective,
      entryCriteria: s.entryCriteria,
      exitCriteria: s.exitCriteria,
      estimatedDuration: s.estimatedDuration,
      recommendedKnowledgeTopics: sortArray(s.recommendedKnowledgeTopics),
      bodyMarkdown: s.bodyMarkdown,
    };
  });

  const compiledCarePlans = planDocs.map((r) => ({
    id: r.id,
    type: r.type,
    title: r.title,
    goal: r.goal,
    locale: r.locale,
    version: r.version,
    status: r.status,
    references: sortArray(r.references),
    priority: r.priority,
    speciesIds: sortArray(r.speciesIds),
    stageIds: sortArray(r.stageIds),
    activityType: r.activityType,
    eligibility: {
      kind: r.eligibility.kind,
      suggestAfterDays: r.eligibility.suggestAfterDays,
    },
    onMissingHistory: r.onMissingHistory,
    ...(r.recommendedInputs !== undefined && {
      recommendedInputs: r.recommendedInputs,
    }),
    ...(r.frequency !== undefined && { frequency: r.frequency }),
    ...(r.notes !== undefined && { notes: r.notes }),
    bodyMarkdown: r.bodyMarkdown,
  }));

  const compiledGuides = guideDocs.map((g) => ({
    id: g.id,
    type: g.type,
    title: g.title,
    goal: g.goal,
    locale: g.locale,
    version: g.version,
    status: g.status,
    references: sortArray(g.references),
    speciesIds: sortArray(g.speciesIds),
    stageIds: sortArray(g.stageIds),
    ...(g.recommendedInputs !== undefined && {
      recommendedInputs: g.recommendedInputs,
    }),
    ...(g.frequency !== undefined && { frequency: g.frequency }),
    ...(g.notes !== undefined && { notes: g.notes }),
    bodyMarkdown: g.bodyMarkdown,
  }));

  const compileThreat = (threat: NormalizedThreatBase) => ({
    id: threat.id,
    type: threat.type,
    title: threat.title,
    locale: threat.locale,
    version: threat.version,
    status: threat.status,
    references: sortArray(threat.references),
    speciesIds: sortArray(threat.speciesIds),
    stageIds: sortArray(threat.stageIds),
    warningSignIds: sortArray(threat.warningSignIds),
    ...(threat.scientificName !== undefined && {
      scientificName: threat.scientificName,
    }),
    bodyMarkdown: threat.bodyMarkdown,
  });

  const compiledDiseases = diseaseDocs.map(compileThreat);
  const compiledPests = pestDocs.map(compileThreat);

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
    schemaVersion:
      mode === "preview"
        ? PREVIEW_BUNDLE_SCHEMA_VERSION
        : PRODUCTION_BUNDLE_SCHEMA_VERSION,
    contentVersion: KNOWLEDGE_CONTENT_VERSION,
    mode,
    species: compiledSpecies,
    stagePlaybooks: compiledStagePlaybooks,
    carePlans: compiledCarePlans,
    guides: compiledGuides,
    ...(mode === "preview" && {
      diseases: compiledDiseases,
      pests: compiledPests,
    }),
    references: compiledReferences,
  };

  return `${JSON.stringify(bundle, null, 2)}\n`;
}
