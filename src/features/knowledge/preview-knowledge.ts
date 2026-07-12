import previewBundle from "../../../knowledge/_generated/mobile-bundle.preview.json";

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export type PlantKnowledgeStage = Readonly<{
  id: string;
  title: string;
}>;

export type PreviewPlantKnowledge = Readonly<{
  species: Readonly<{ id: string; title: string }>;
  stages: readonly PlantKnowledgeStage[];
}>;

export type StagePlaybook = Readonly<{
  id: string;
  title: string;
  primaryObjective: string;
  estimatedDuration: string | null;
  entryCriteria: readonly string[];
  exitCriteria: readonly string[];
  recommendedKnowledgeTopics: readonly string[];
  bodyMarkdown: string;
}>;

export type CareGuide = Readonly<{
  id: string;
  title: string;
  bodyMarkdown: string;
}>;

export type CareRecommendation = Readonly<{
  id: string;
  title: string;
  activityType: string;
  bodyMarkdown: string;
}>;

// ---------------------------------------------------------------------------
// Raw bundle shape (only the fields we use)
// ---------------------------------------------------------------------------

type RawSpecies = {
  id: string;
  title: string;
  lifecycles: Record<string, { stages: Array<{ id: string; title: string }> }>;
};

type RawPlaybook = {
  id: string;
  title: string;
  speciesId: string;
  lifecycleId: string;
  sequence: number;
  primaryObjective?: string;
  estimatedDuration?: string;
  entryCriteria?: string[];
  exitCriteria?: string[];
  recommendedKnowledgeTopics?: string[];
  bodyMarkdown?: string;
};

type RawGuide = {
  id: string;
  title: string;
  stageIds?: string[];
  bodyMarkdown?: string;
};

type RawCareRecommendation = {
  id: string;
  title: string;
  stageIds?: string[];
  activityType?: string;
  bodyMarkdown?: string;
};

type PreviewBundle = {
  species: RawSpecies[];
  stagePlaybooks: RawPlaybook[];
  guides: RawGuide[];
  careRecommendations: RawCareRecommendation[];
};

// ---------------------------------------------------------------------------
// Helper — cast once at module load
// ---------------------------------------------------------------------------

const bundle: PreviewBundle = previewBundle as PreviewBundle;

// ---------------------------------------------------------------------------
// getPreviewPlantKnowledge
// ---------------------------------------------------------------------------

export function getPreviewPlantKnowledge(): PreviewPlantKnowledge;
export function getPreviewPlantKnowledge(speciesId: string): PreviewPlantKnowledge | null;
export function getPreviewPlantKnowledge(speciesId?: string): PreviewPlantKnowledge | null {
  const species = speciesId
    ? bundle.species.find((candidate) => candidate.id === speciesId)
    : bundle.species[0];
  if (!species) {
    if (!speciesId) throw new Error("Preview knowledge does not contain a species");
    return null;
  }
  return {
    species: { id: species.id, title: species.title },
    stages: Object.values(species.lifecycles).flatMap((lifecycle) =>
      lifecycle.stages.map(({ id, title }) => ({ id, title })),
    ),
  };
}

// ---------------------------------------------------------------------------
// getStagePlaybook
// ---------------------------------------------------------------------------

/**
 * Returns the stage playbook for a given stage ID from the preview bundle,
 * or null if no playbook is found. Content has status "review" and is
 * displayed with the "Nội dung chờ duyệt" label per CONTEXT.md vocabulary.
 */
export function getStagePlaybook(stageId: string): StagePlaybook | null {
  const raw = bundle.stagePlaybooks.find((pb) => pb.id === stageId);
  if (!raw) return null;
  return toPlaybook(raw);
}

// ---------------------------------------------------------------------------
// getNextStagePlaybook
// ---------------------------------------------------------------------------

/**
 * Returns the playbook for the stage that comes after `currentStageId`
 * within the same lifecycle (by sequence), or null if already at the end.
 */
export function getNextStagePlaybook(currentStageId: string): StagePlaybook | null {
  const current = bundle.stagePlaybooks.find((pb) => pb.id === currentStageId);
  if (!current) return null;
  const next = bundle.stagePlaybooks.find(
    (pb) => pb.lifecycleId === current.lifecycleId && pb.sequence === current.sequence + 1,
  );
  return next ? toPlaybook(next) : null;
}

// ---------------------------------------------------------------------------
// getCareGuideForStage
// ---------------------------------------------------------------------------

/** Returns the first care guide that applies to the given stage, or null. */
export function getCareGuideForStage(stageId: string): CareGuide | null {
  const raw = bundle.guides.find((g) => (g.stageIds ?? []).includes(stageId));
  if (!raw) return null;
  return {
    id: raw.id,
    title: raw.title,
    bodyMarkdown: raw.bodyMarkdown ?? "",
  };
}

// ---------------------------------------------------------------------------
// getCareRecommendationsForStage
// ---------------------------------------------------------------------------

/** Returns all care recommendations that apply to the given stage. */
export function getCareRecommendationsForStage(stageId: string): readonly CareRecommendation[] {
  return bundle.careRecommendations
    .filter((cr) => (cr.stageIds ?? []).includes(stageId))
    .map((cr) => ({
      id: cr.id,
      title: cr.title,
      activityType: cr.activityType ?? "",
      bodyMarkdown: cr.bodyMarkdown ?? "",
    }));
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function toPlaybook(raw: RawPlaybook): StagePlaybook {
  return {
    id: raw.id,
    title: raw.title,
    primaryObjective: raw.primaryObjective ?? "",
    estimatedDuration: raw.estimatedDuration ?? null,
    entryCriteria: raw.entryCriteria ?? [],
    exitCriteria: raw.exitCriteria ?? [],
    recommendedKnowledgeTopics: raw.recommendedKnowledgeTopics ?? [],
    bodyMarkdown: raw.bodyMarkdown ?? "",
  };
}
