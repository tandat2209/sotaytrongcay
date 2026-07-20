import { getCareActivityLabel } from "@/features/journal";
import {
  createJournalItems,
  getLatestPlantPhoto,
  type CareActivity,
  type CareActivityType,
  type JournalItem,
  type PlantUpdate,
} from "@/features/journal";
import type { CareEvaluation } from "@/features/guidance/models/care-evaluation";
import { evaluateCarePlans } from "@/features/guidance/models/evaluate-care-recommendations";
import {
  getPreviewPlantKnowledge,
  getStagePlaybook,
  listCarePlans,
  type FertilizerGroupGuidance,
  type RecommendedInput,
  type StagePlaybook,
} from "@/features/knowledge/preview-knowledge";
import { t } from "@/shared/i18n";
import type { Plant } from "./plant";
import { resolvePlantIdentity } from "./plant-identity";

const CARE_TYPES: readonly CareActivityType[] = [
  "watering",
  "fertilizing",
  "spraying",
];
const HERO_CARE_TYPES = ["watering", "fertilizing"] as const;
const RECENT_JOURNAL_LIMIT = 3;

export type PlantDetailCareDetails = Readonly<{
  frequencyDisplay: string | null;
  goal: string;
  notes: readonly string[];
  fertilizerGroupGuidance: readonly FertilizerGroupGuidance[];
  recommendedInputs: readonly RecommendedInput[];
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
  ageLabels: readonly string[];
  careCards: readonly PlantDetailCareCard[];
  latestCare: Readonly<Record<CareActivityType, CareActivity | null>>;
  lifecycleStages: readonly PlantDetailLifecycleStage[];
  latestPhotoUri: string | null;
  plant: Plant;
  recentJournalItems: readonly JournalItem[];
  speciesTitle: string;
  stagePlaybook: StagePlaybook | null;
  stageTitle: string;
}>;

type PlantDetailProjectionInput = Readonly<{
  activities: readonly CareActivity[];
  evaluatedAt: Date;
  latestPhotoUri?: string | null;
  plant: Plant;
  updates?: readonly PlantUpdate[];
}>;

export function createPlantDetailProjection({
  activities,
  evaluatedAt,
  latestPhotoUri: persistedLatestPhotoUri,
  plant,
  updates = [],
}: PlantDetailProjectionInput): PlantDetailProjection {
  const sortedActivities = activities
    .slice()
    .sort((left, right) => right.occurredAt.localeCompare(left.occurredAt));
  const latestCare = Object.fromEntries(
    CARE_TYPES.map((type) => [
      type,
      sortedActivities.find((activity) => activity.type === type) ?? null,
    ]),
  ) as Record<CareActivityType, CareActivity | null>;
  const knowledge = getPreviewPlantKnowledge(plant.speciesId);
  const identity = resolvePlantIdentity(plant);
  const plans = listCarePlans({
    speciesId: plant.speciesId,
    stageId: plant.stageId,
  });
  const evaluations = evaluateCarePlans({
    activities,
    evaluatedAt,
    plant,
    plans,
  });
  const plantedAgeDays = elapsedCalendarDays(plant.plantedAt, evaluatedAt);
  const stageAgeDays = elapsedCalendarDays(plant.stageStartedAt, evaluatedAt);

  return {
    ageLabels: createAgeLabels(stageAgeDays, plantedAgeDays),
    careCards: HERO_CARE_TYPES.map((activityType) => {
      const plan = plans.find(
        (candidate) => candidate.activityType === activityType,
      );
      const frequencyDisplay =
        plan?.frequency?.[plant.growingMethod].display ?? null;
      return {
        activityType,
        details: plan
          ? {
              frequencyDisplay,
              goal: plan.goal,
              notes: plan.notes ?? [],
              fertilizerGroupGuidance: plan.fertilizerGroupGuidance ?? [],
              recommendedInputs: plan.recommendedInputs ?? [],
            }
          : null,
        evaluation:
          evaluations.find(
            (candidate) => candidate.activityType === activityType,
          ) ?? null,
        frequencyDisplay,
        lastActivity: latestCare[activityType],
        title: plan?.title ?? getCareActivityLabel(activityType),
      };
    }),
    latestCare,
    latestPhotoUri:
      persistedLatestPhotoUri === undefined
        ? (getLatestPlantPhoto(updates)?.localUri ?? null)
        : persistedLatestPhotoUri,
    lifecycleStages:
      knowledge?.stages.map((stage) => ({
        ...stage,
        isCurrent: stage.id === plant.stageId,
      })) ?? [],
    plant,
    recentJournalItems: createJournalItems(activities, updates).slice(
      0,
      RECENT_JOURNAL_LIMIT,
    ),
    speciesTitle: identity.speciesTitle,
    stagePlaybook: getStagePlaybook(plant.stageId),
    stageTitle: identity.stageTitle,
  };
}

function createAgeLabels(
  stageAgeDays: number | null,
  plantedAgeDays: number | null,
): string[] {
  const labels: string[] = [];
  if (stageAgeDays !== null)
    labels.push(
      stageAgeDays === 0
        ? t("plants.age.stageToday")
        : t("plants.age.stageDays", { days: stageAgeDays }),
    );
  if (plantedAgeDays !== null)
    labels.push(
      plantedAgeDays === 0
        ? t("plants.age.plantedToday")
        : t("plants.age.plantedDays", { days: plantedAgeDays }),
    );
  return labels;
}

function elapsedCalendarDays(
  startedAt: string | null,
  evaluatedAt: Date,
): number | null {
  if (!startedAt) return null;
  const start = startedAt.includes("T")
    ? new Date(startedAt)
    : dateFromLocalIsoDate(startedAt);
  if (Number.isNaN(start.getTime())) return null;
  const startDay = Date.UTC(
    start.getFullYear(),
    start.getMonth(),
    start.getDate(),
  );
  const evaluatedDay = Date.UTC(
    evaluatedAt.getFullYear(),
    evaluatedAt.getMonth(),
    evaluatedAt.getDate(),
  );
  const elapsedDays = Math.floor((evaluatedDay - startDay) / 86_400_000);
  return elapsedDays >= 0 ? elapsedDays : null;
}

function dateFromLocalIsoDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(
    year ?? Number.NaN,
    (month ?? Number.NaN) - 1,
    day ?? Number.NaN,
  );
}
