import type { CareActivity, CareActivityType } from "@/features/journal";
import type { CareEvaluation } from "@/features/guidance/models/care-evaluation";
import { evaluateCarePlans } from "@/features/guidance/models/evaluate-care-recommendations";
import {
  getPreviewPlantKnowledge,
  getStagePlaybook,
  listCarePlans,
  type StagePlaybook,
} from "@/features/knowledge/preview-knowledge";
import type { Plant } from "./plant";

const CARE_TYPES: readonly CareActivityType[] = ["watering", "fertilizing", "spraying"];
const HERO_CARE_TYPES = ["watering", "fertilizing"] as const;
const RECENT_CARE_LIMIT = 3;

export type PlantDetailCareDetails = Readonly<{
  frequencyDisplay: string | null;
  goal: string;
  notes: readonly string[];
  recommendedInputs: readonly Readonly<{ examples: string; group: string }>[];
}>;

export type PlantDetailCareCard = Readonly<{
  activityType: (typeof HERO_CARE_TYPES)[number];
  details: PlantDetailCareDetails | null;
  evaluation: CareEvaluation | null;
  frequencyDisplay: string | null;
  lastActivity: CareActivity | null;
  title: string;
}>;

export type PlantDetailLifecycleStage = Readonly<{
  id: string;
  isCurrent: boolean;
  title: string;
}>;

export type PlantDetailProjection = Readonly<{
  careCards: readonly PlantDetailCareCard[];
  latestCare: Readonly<Record<CareActivityType, CareActivity | null>>;
  lifecycleStages: readonly PlantDetailLifecycleStage[];
  plant: Plant;
  recentCare: readonly CareActivity[];
  stagePlaybook: StagePlaybook | null;
  stageTitle: string;
}>;

type PlantDetailProjectionInput = Readonly<{
  activities: readonly CareActivity[];
  evaluatedAt: Date;
  plant: Plant;
}>;

export function createPlantDetailProjection({ activities, evaluatedAt, plant }: PlantDetailProjectionInput): PlantDetailProjection {
  const sortedActivities = activities.slice().sort((left, right) => right.occurredAt.localeCompare(left.occurredAt));
  const latestCare = Object.fromEntries(
    CARE_TYPES.map((type) => [type, sortedActivities.find((activity) => activity.type === type) ?? null]),
  ) as Record<CareActivityType, CareActivity | null>;
  const knowledge = getPreviewPlantKnowledge(plant.speciesId);
  const plans = listCarePlans({ speciesId: plant.speciesId, stageId: plant.stageId });
  const evaluations = evaluateCarePlans({ activities, evaluatedAt, plant, plans });

  return {
    careCards: HERO_CARE_TYPES.map((activityType) => {
      const plan = plans.find((candidate) => candidate.activityType === activityType);
      const frequencyDisplay = plan?.frequency?.[plant.growingMethod].display ?? null;
      return {
        activityType,
        details: plan ? {
          frequencyDisplay,
          goal: plan.goal,
          notes: plan.notes ?? [],
          recommendedInputs: plan.recommendedInputs ?? [],
        } : null,
        evaluation: evaluations.find((candidate) => candidate.activityType === activityType) ?? null,
        frequencyDisplay,
        lastActivity: latestCare[activityType],
        title: plan?.title ?? (activityType === "watering" ? "Tưới nước" : "Bón phân"),
      };
    }),
    latestCare,
    lifecycleStages: knowledge?.stages.map((stage) => ({ ...stage, isCurrent: stage.id === plant.stageId })) ?? [],
    plant,
    recentCare: sortedActivities.slice(0, RECENT_CARE_LIMIT),
    stagePlaybook: getStagePlaybook(plant.stageId),
    stageTitle: knowledge?.stages.find((stage) => stage.id === plant.stageId)?.title ?? "Chưa xác định",
  };
}
