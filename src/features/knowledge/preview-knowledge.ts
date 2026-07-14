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
  goal: string;
  bodyMarkdown: string;
  recommendedInputs?: readonly { group: string; examples: string }[];
  frequency?: {
    ground: { display: string; intervalDays: number };
    container: { display: string; intervalDays: number };
  };
  notes?: readonly string[];
}>;

export type CarePlan = Readonly<{
  id: string;
  title: string;
  goal: string;
  bodyMarkdown: string;
  priority: number;
  activityType: "watering" | "fertilizing" | "spraying";
  eligibility: Readonly<{
    kind: "elapsed_days_since_activity";
    suggestAfterDays: number;
  }>;
  onMissingHistory: "suggest" | "withhold";
  frequency?: {
    ground: { display: string; intervalDays: number };
    container: { display: string; intervalDays: number };
  };
  recommendedInputs?: readonly { group: string; examples: string }[];
  notes?: readonly string[];
  version: string;
}>;

// ---------------------------------------------------------------------------
// Raw bundle shape (only the fields we use)
// ---------------------------------------------------------------------------

type RawSpecies = {
  id: string;
  title: string;
  lifecycles: Record<
    string,
    {
      stages: {
        id: string;
        title: string;
        transitions: { to: string }[];
      }[];
    }
  >;
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
  goal: string;
  speciesIds?: string[];
  stageIds?: string[];
  bodyMarkdown?: string;
  recommendedInputs?: { group: string; examples: string }[];
  frequency?: {
    ground: { display: string; intervalDays: number };
    container: { display: string; intervalDays: number };
  };
  notes?: string[];
};

type RawCarePlan = {
  id: string;
  title: string;
  goal: string;
  bodyMarkdown: string;
  priority: number;
  speciesIds: string[];
  stageIds: string[];
  activityType: "watering" | "fertilizing" | "spraying";
  eligibility: {
    kind: "elapsed_days_since_activity";
    suggestAfterDays: number;
  };
  onMissingHistory: "suggest" | "withhold";
  frequency?: {
    ground: { display: string; intervalDays: number };
    container: { display: string; intervalDays: number };
  };
  recommendedInputs?: { group: string; examples: string }[];
  notes?: string[];
  version: string;
};

type PreviewBundle = {
  species: RawSpecies[];
  stagePlaybooks: RawPlaybook[];
  guides: RawGuide[];
  carePlans: RawCarePlan[];
};

// ---------------------------------------------------------------------------
// Helper — cast once at module load
// ---------------------------------------------------------------------------

const bundle: PreviewBundle = previewBundle as PreviewBundle;

// ---------------------------------------------------------------------------
// getPreviewPlantKnowledge
// ---------------------------------------------------------------------------

export function getPreviewPlantKnowledge(): PreviewPlantKnowledge;
export function getPreviewPlantKnowledge(
  speciesId: string,
): PreviewPlantKnowledge | null;
export function getPreviewPlantKnowledge(
  speciesId?: string,
): PreviewPlantKnowledge | null {
  const species = speciesId
    ? bundle.species.find((candidate) => candidate.id === speciesId)
    : bundle.species[0];
  if (!species) {
    if (!speciesId)
      throw new Error("Preview knowledge does not contain a species");
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
 * according to its authored lifecycle transition, or null when no transition exists.
 */
export function getNextStagePlaybook(
  currentStageId: string,
): StagePlaybook | null {
  const currentStage = bundle.species
    .flatMap((species) => Object.values(species.lifecycles))
    .flatMap((lifecycle) => lifecycle.stages)
    .find((stage) => stage.id === currentStageId);
  const nextStageId = currentStage?.transitions[0]?.to;
  if (!nextStageId) return null;

  const next = bundle.stagePlaybooks.find(
    (playbook) => playbook.id === nextStageId,
  );
  return next ? toPlaybook(next) : null;
}

export function listInformationalGuidesForStage(
  stageId: string,
): readonly CareGuide[] {
  return bundle.guides
    .filter((guide) => (guide.stageIds ?? []).includes(stageId))
    .sort((left, right) => left.id.localeCompare(right.id))
    .map(toCareGuide);
}

export function getCarePlansForStage(stageId: string): readonly CarePlan[] {
  return bundle.carePlans
    .filter((plan) => plan.stageIds.includes(stageId))
    .sort(sortPlans)
    .map(toCarePlan);
}

export function listCarePlans(
  input: Readonly<{
    speciesId: string;
    stageId: string;
  }>,
): readonly CarePlan[] {
  return bundle.carePlans
    .filter((plan) => plan.speciesIds.includes(input.speciesId))
    .filter((plan) => plan.stageIds.includes(input.stageId))
    .sort(sortPlans)
    .map(toCarePlan);
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function toCarePlan(raw: RawCarePlan): CarePlan {
  return {
    id: raw.id,
    title: raw.title,
    goal: raw.goal,
    bodyMarkdown: raw.bodyMarkdown,
    priority: raw.priority,
    activityType: raw.activityType,
    eligibility: raw.eligibility,
    onMissingHistory: raw.onMissingHistory,
    ...(raw.frequency !== undefined && { frequency: raw.frequency }),
    ...(raw.recommendedInputs !== undefined && {
      recommendedInputs: raw.recommendedInputs,
    }),
    ...(raw.notes !== undefined && { notes: raw.notes }),
    version: raw.version,
  };
}

function toCareGuide(raw: RawGuide): CareGuide {
  return {
    id: raw.id,
    title: raw.title,
    goal: raw.goal,
    bodyMarkdown: raw.bodyMarkdown ?? "",
    ...(raw.recommendedInputs !== undefined && {
      recommendedInputs: raw.recommendedInputs,
    }),
    ...(raw.frequency !== undefined && { frequency: raw.frequency }),
    ...(raw.notes !== undefined && { notes: raw.notes }),
  };
}

function sortPlans(left: RawCarePlan, right: RawCarePlan): number {
  return right.priority - left.priority || left.id.localeCompare(right.id);
}

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
