import type { CareEvaluation } from "@/features/guidance";
import type { CareActivity } from "@/features/journal";
import { resolvePlantIdentity } from "@/features/plants/models/plant-identity";
import type { Plant } from "@/features/plants/models/plant";
import { productionWeather, type WeatherState } from "@/shared/weather/weather-state";

export type TodayWeather = WeatherState;
export { productionWeather };
export type TodayActivity = CareActivity & { plantName: string };

export type TodayPriority = CareEvaluation & { plantName: string; speciesTitle: string; stageId: string; stageTitle: string };
export type TodayEvaluation = CareEvaluation & { plantName: string };

export type TodayProjection = {
  evaluations: readonly TodayEvaluation[];
  plants: readonly Plant[];
  priorities: readonly TodayPriority[];
  recentActivities: readonly TodayActivity[];
  weather: TodayWeather;
};

type TodayProjectionInput = {
  activities: readonly CareActivity[];
  evaluations?: readonly CareEvaluation[];
  plants: readonly Plant[];
  weather?: TodayWeather;
};

export function createTodayProjection({ activities, evaluations = [], plants, weather = productionWeather }: TodayProjectionInput): TodayProjection {
  const plantMap = new Map(plants.map((plant) => [plant.id, plant]));
  const recentActivities = activities
    .slice()
    .sort((left, right) => right.occurredAt.localeCompare(left.occurredAt))
    .slice(0, 3)
    .map((activity) => ({ ...activity, plantName: plantMap.get(activity.plantId)?.name ?? "Cây trồng" }));
  const namedEvaluations = evaluations.map((evaluation) => ({
    ...evaluation,
    plantName: plantMap.get(evaluation.plantId)?.name ?? "Cây trồng",
  }));
  const priorities = namedEvaluations
    .filter((evaluation) => evaluation.status === "recommended")
    .slice(0, 3)
    .map((evaluation) => {
      const plant = plantMap.get(evaluation.plantId);
      const identity = plant ? resolvePlantIdentity(plant) : { speciesTitle: "Chưa xác định", stageTitle: "Chưa xác định" };
      return {
        ...evaluation,
        speciesTitle: identity.speciesTitle,
        stageId: plant?.stageId ?? "",
        stageTitle: identity.stageTitle,
      };
    });

  return { evaluations: namedEvaluations, plants, priorities, recentActivities, weather };
}
