import previewBundle from "../../../knowledge/_generated/mobile-bundle.preview.json";

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

type PreviewBundle = {
  species: Array<{
    id: string;
    title: string;
    lifecycles: Record<string, { stages: Array<{ id: string; title: string }> }>;
  }>;
  stagePlaybooks: Array<{
    id: string;
    title: string;
    primaryObjective?: string;
    estimatedDuration?: string;
    entryCriteria?: string[];
    exitCriteria?: string[];
    recommendedKnowledgeTopics?: string[];
    bodyMarkdown?: string;
  }>;
};

export function getPreviewPlantKnowledge(): PreviewPlantKnowledge;
export function getPreviewPlantKnowledge(speciesId: string): PreviewPlantKnowledge | null;
export function getPreviewPlantKnowledge(speciesId?: string): PreviewPlantKnowledge | null {
  const bundle: PreviewBundle = previewBundle;
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

/**
 * Returns the stage playbook for a given stage ID from the preview bundle,
 * or null if no playbook is found. Content has status "review" and is
 * displayed with the "Nội dung chờ duyệt" label per CONTEXT.md vocabulary.
 */
export function getStagePlaybook(stageId: string): StagePlaybook | null {
  const bundle: PreviewBundle = previewBundle;
  const raw = bundle.stagePlaybooks.find((pb) => pb.id === stageId);
  if (!raw) return null;
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
