import previewBundle from "../../../knowledge/_generated/mobile-bundle.preview.json";

export type PlantKnowledgeStage = Readonly<{
  id: string;
  title: string;
}>;

export type PreviewPlantKnowledge = Readonly<{
  species: Readonly<{ id: string; title: string }>;
  stages: readonly PlantKnowledgeStage[];
}>;

type PreviewBundle = {
  species: Array<{
    id: string;
    title: string;
    lifecycles: Record<string, { stages: Array<{ id: string; title: string }> }>;
  }>;
};

export function getPreviewPlantKnowledge(): PreviewPlantKnowledge {
  const bundle: PreviewBundle = previewBundle;
  const species = bundle.species[0];
  if (!species) {
    throw new Error("Preview knowledge does not contain a species");
  }

  return {
    species: { id: species.id, title: species.title },
    stages: Object.values(species.lifecycles).flatMap((lifecycle) =>
      lifecycle.stages.map(({ id, title }) => ({ id, title })),
    ),
  };
}
