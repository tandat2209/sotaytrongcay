import { evaluateCarePlans } from "@/features/guidance";
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
  deriveDueReminder,
  type CarePlanReminderPreference,
} from "@/features/reminders";
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
  id: string;
  imageUri: string | null;
  plantId: string;
  plantName: string;
  priority: number;
  reminderId: string | null;
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
  plansByPlant?: ReadonlyMap<string, readonly CarePlan[]>;
  plants: readonly Plant[];
  preferences?: readonly CarePlanReminderPreference[];
  updates?: readonly PlantUpdate[];
  weather?: TodayWeather;
}>;

export function createTodayProjection({
  activities,
  evaluatedAt = new Date(),
  plansByPlant = new Map(),
  plants,
  preferences = [],
  updates = [],
  weather = productionWeather,
}: TodayProjectionInput): TodayProjection {
  const plantMap = new Map(plants.map((plant) => [plant.id, plant]));
  const plantPhotoUris = getLatestPlantPhotoUrisByPlant(updates);
  const recentActivities = activities
    .slice()
    .sort((left, right) => right.occurredAt.localeCompare(left.occurredAt))
    .slice(0, 3)
    .map((activity) => ({
      ...activity,
      plantName: plantMap.get(activity.plantId)?.name ?? "Cây trồng",
    }));
  const preferenceMap = new Map(
    preferences.map((preference) => [
      `${preference.plantId}:${preference.carePlanId}`,
      preference,
    ]),
  );
  const careCards = plants
    .flatMap<TodayCareCard>((plant) =>
      (plansByPlant.get(plant.id) ?? []).flatMap<TodayCareCard>((plan) => {
        const identity = resolvePlantIdentity(plant);
        const base = {
          activityType: plan.activityType,
          carePlanId: plan.id,
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
              ?.map((input) => input.examples)
              .join(" · ") ?? null,
          title: plan.title,
        };
        const hasFrequency =
          plan.frequency?.[plant.growingMethod] !== undefined;
        if (hasFrequency) {
          const preference = preferenceMap.get(`${plant.id}:${plan.id}`);
          if (!preference) return [];
          const latestActivity = findLatestCareActivity(
            activities,
            plant.id,
            plan.activityType,
          );
          const due = deriveDueReminder({
            evaluatedAt,
            latestActivityAt: latestActivity?.occurredAt ?? null,
            onMissingHistory: plan.onMissingHistory,
            preference,
          });
          if (!due || due.status === "upcoming") return [];
          return [
            {
              ...base,
              dueStatus: due.status,
              explanation: plan.goal,
              reminderId: preference.id,
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
            explanation: evaluation.explanation,
            reminderId: null,
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

  return {
    careCards,
    plantPhotoUris,
    plants,
    recentActivities,
    weather,
  };
}

function dueRank(status: TodayCareCard["dueStatus"]): number {
  return status === "overdue" ? 0 : status === "due" ? 1 : 2;
}
