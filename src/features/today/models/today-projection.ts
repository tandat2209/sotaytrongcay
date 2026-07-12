import type { CareActivity } from "@/features/journal";
import type { Plant } from "@/features/plants";
import { productionWeather, type WeatherState } from "@/shared/weather/weather-state";

export type TodayWeather = WeatherState;
export { productionWeather };
export type TodayActivity = CareActivity & { plantName: string };

export type TodayProjection = {
  plants: readonly Plant[];
  recentActivities: readonly TodayActivity[];
  weather: TodayWeather;
};

type TodayProjectionInput = {
  activities: readonly CareActivity[];
  plants: readonly Plant[];
  weather?: TodayWeather;
};

export function createTodayProjection({ activities, plants, weather = productionWeather }: TodayProjectionInput): TodayProjection {
  const plantNames = new Map(plants.map((plant) => [plant.id, plant.name]));
  const recentActivities = activities
    .slice()
    .sort((left, right) => right.occurredAt.localeCompare(left.occurredAt))
    .slice(0, 3)
    .map((activity) => ({ ...activity, plantName: plantNames.get(activity.plantId) ?? "Cây trồng" }));

  return { plants, recentActivities, weather };
}
