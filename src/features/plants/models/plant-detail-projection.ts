import type { CareActivity, CareActivityType } from "@/features/journal";
import { getPreviewPlantKnowledge, getStagePlaybook, type StagePlaybook } from "@/features/knowledge/preview-knowledge";
import type { Plant } from "./plant";

const CARE_TYPES: readonly CareActivityType[] = ["watering", "fertilizing", "spraying"];
const RECENT_CARE_LIMIT = 5;

export type PlantDetailProjection = Readonly<{
  latestCare: Readonly<Record<CareActivityType, CareActivity | null>>;
  plant: Plant;
  recentCare: readonly CareActivity[];
  stagePlaybook: StagePlaybook | null;
  stageTitle: string;
}>;

type PlantDetailProjectionInput = Readonly<{
  activities: readonly CareActivity[];
  plant: Plant;
}>;

export function createPlantDetailProjection({ activities, plant }: PlantDetailProjectionInput): PlantDetailProjection {
  const sortedActivities = activities.slice().sort((left, right) => right.occurredAt.localeCompare(left.occurredAt));
  const latestCare = Object.fromEntries(
    CARE_TYPES.map((type) => [type, sortedActivities.find((activity) => activity.type === type) ?? null]),
  ) as Record<CareActivityType, CareActivity | null>;

  return {
    latestCare,
    plant,
    recentCare: sortedActivities.slice(0, RECENT_CARE_LIMIT),
    stagePlaybook: getStagePlaybook(plant.stageId),
    stageTitle: getStageTitle(plant),
  };
}

function getStageTitle(plant: Plant): string {
  const knowledge = getPreviewPlantKnowledge(plant.speciesId);
  if (!knowledge) return "Chưa xác định";
  return knowledge.stages.find((stage) => stage.id === plant.stageId)?.title ?? "Chưa xác định";
}
