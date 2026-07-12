import type { CareActivity } from "@/features/journal";
import type { Plant } from "@/features/plants";

type WeatherMetrics = {
  humidityPercent?: number;
  rainChancePercent?: number;
  temperatureCelsius?: number;
};

type WeatherObservation = {
  freshnessLabel: string;
  locationLabel: string;
  metrics?: WeatherMetrics;
  observedAt: string;
  source: string;
  summary: string;
};

export type TodayWeather =
  | ({ status: "available" | "stale" } & WeatherObservation)
  | { status: "loading" }
  | { status: "offline" }
  | { status: "unavailable"; reason: "not-configured" | "permission-denied" }
  | { status: "error" };

export const productionWeather: TodayWeather = {
  status: "unavailable",
  reason: "not-configured",
};

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
