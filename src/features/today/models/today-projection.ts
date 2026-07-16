import {
  evaluateCarePlans,
  formatCareEvaluationReason,
} from "@/features/guidance";
import {
  findLatestCareActivity,
  getLatestPlantPhotoUrisByPlant,
  type CareActivity,
  type CareActivityType,
  type PlantUpdate,
} from "@/features/journal";
import type { CarePlan } from "@/features/knowledge";
import { resolvePlantIdentity } from "@/features/plants/models/plant-identity";
import type { Plant } from "@/features/plants/models/plant";
import {
  resolveCarePlanSchedule,
  type PlantCarePlanScheduleSnapshot,
  type StageCarePlanScheduleSnapshot,
} from "@/features/reminders";
import { t } from "@/shared/i18n";
import {
  productionWeather,
  type WeatherState,
} from "@/shared/weather/weather-state";

export type TodayWeather = WeatherState;
export { productionWeather };
export type TodayActivity = CareActivity & { plantName: string };

export type TodayCareCard = Readonly<{
  activityType: CareActivityType;
  carePlanId: string;
  dueStatus: "due" | "overdue" | null;
  explanation: string;
  fertilizerSuggestions: NonNullable<CarePlan["fertilizerSuggestions"]>;
  id: string;
  imageUri: string | null;
  plantId: string;
  plantName: string;
  priority: number;
  speciesTitle: string;
  stageId: string;
  stageTitle: string;
  suggestion: string | null;
  title: string;
}>;

export type TodayProjection = Readonly<{
  careCards: readonly TodayCareCard[];
  plantPhotoUris: Readonly<Record<string, string>>;
  plants: readonly Plant[];
  recentActivities: readonly TodayActivity[];
  weather: TodayWeather;
}>;

type TodayProjectionInput = Readonly<{
  activities: readonly CareActivity[];
  evaluatedAt?: Date;
  plantPhotoUris?: Readonly<Record<string, string>>;
  plansByPlant?: ReadonlyMap<string, readonly CarePlan[]>;
  plantSnapshots?: readonly PlantCarePlanScheduleSnapshot[];
  plants: readonly Plant[];
  stageSnapshots?: readonly StageCarePlanScheduleSnapshot[];
  updates?: readonly PlantUpdate[];
  weather?: TodayWeather;
}>;

export function createTodayProjection({
  activities,
  evaluatedAt = new Date(),
  plantPhotoUris: persistedPlantPhotoUris,
  plansByPlant = new Map(),
  plantSnapshots = [],
  plants,
  stageSnapshots = [],
  updates = [],
  weather = productionWeather,
}: TodayProjectionInput): TodayProjection {
  const plantMap = new Map(plants.map((plant) => [plant.id, plant]));
  const plantPhotoUris =
    persistedPlantPhotoUris ?? getLatestPlantPhotoUrisByPlant(updates);
  const recentActivities = activities
    .slice()
    .sort((left, right) => right.occurredAt.localeCompare(left.occurredAt))
    .slice(0, 3)
    .map((activity) => ({
      ...activity,
      plantName:
        plantMap.get(activity.plantId)?.name ?? t("common.fallback.plant"),
    }));
  const careCards = plants
    .flatMap<TodayCareCard>((plant) =>
      (plansByPlant.get(plant.id) ?? []).flatMap<TodayCareCard>((plan) => {
        const identity = resolvePlantIdentity(plant);
        const base = {
          activityType: plan.activityType,
          carePlanId: plan.id,
          fertilizerSuggestions: plan.fertilizerSuggestions ?? [],
          id: `${plant.id}:${plan.id}`,
          imageUri: plantPhotoUris[plant.id] ?? null,
          plantId: plant.id,
          plantName: plant.name,
          priority: plan.priority,
          speciesTitle: identity.speciesTitle,
          stageId: plant.stageId,
          stageTitle: identity.stageTitle,
          suggestion:
            plan.recommendedInputs
              ?.flatMap((input) => input.suggestions)
              .map(({ name }) => name)
              .join(" · ") ?? null,
          title: plan.title,
        };
        const plantSnapshot =
          plantSnapshots.find(
            (snapshot) =>
              snapshot.plantId === plant.id &&
              snapshot.carePlanId === plan.id &&
              snapshot.isActive,
          ) ?? null;
        const stageSnapshot =
          stageSnapshots.find(
            (snapshot) =>
              snapshot.stageId === plant.stageId &&
              snapshot.carePlanId === plan.id,
          ) ?? null;
        const latestActivity = findLatestCareActivity(
          activities,
          plant.id,
          plan.activityType,
        );
        const schedule = resolveCarePlanSchedule({
          evaluatedAt,
          latestActivityAt: latestActivity?.occurredAt ?? null,
          plan,
          plant,
          plantSnapshot,
          stageSnapshot,
        });
        if (schedule) {
          if (schedule.status === "upcoming") return [];
          return [
            {
              ...base,
              dueStatus: schedule.status,
              explanation: plan.goal,
            },
          ];
        }
        const evaluation = evaluateCarePlans({
          activities,
          evaluatedAt,
          plant,
          plans: [plan],
        })[0];
        if (!evaluation || evaluation.status !== "recommended") return [];
        return [
          {
            ...base,
            dueStatus: null,
            explanation: formatCareEvaluationReason(evaluation.reason),
          },
        ];
      }),
    )
    .sort(
      (left, right) =>
        dueRank(left.dueStatus) - dueRank(right.dueStatus) ||
        right.priority - left.priority ||
        left.plantName.localeCompare(right.plantName) ||
        left.carePlanId.localeCompare(right.carePlanId),
    )
    .slice(0, 3);

  return { careCards, plantPhotoUris, plants, recentActivities, weather };
}

function dueRank(status: TodayCareCard["dueStatus"]): number {
  return status === "overdue" ? 0 : status === "due" ? 1 : 2;
}
