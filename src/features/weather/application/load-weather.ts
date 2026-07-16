import type {
  WeatherConditions,
  WeatherLocation,
  WeatherSnapshot,
  WeatherState,
} from "../models/weather";
import { WeatherNetworkError } from "../models/weather-errors";

export { WeatherNetworkError } from "../models/weather-errors";

type Dependencies = Readonly<{
  fetchCurrentWeather: (
    location: WeatherLocation,
  ) => Promise<WeatherConditions>;
  getCachedWeather: () => Promise<WeatherSnapshot | null>;
  getGrowingLocation: () => Promise<WeatherLocation | null>;
  now: () => Date;
  saveWeather: (weather: WeatherSnapshot) => Promise<void>;
}>;

export async function loadWeather(
  dependencies: Dependencies,
  options: Readonly<{ forceRefresh?: boolean }> = {},
): Promise<WeatherState> {
  const location = await dependencies.getGrowingLocation();
  if (!location) return { reason: "not-configured", status: "unavailable" };

  const cachedWeather = await dependencies.getCachedWeather();
  const cacheAge = cachedWeather
    ? dependencies.now().getTime() - new Date(cachedWeather.fetchedAt).getTime()
    : Number.POSITIVE_INFINITY;
  if (!options.forceRefresh && cachedWeather && cacheAge <= 30 * 60 * 1_000)
    return snapshotToState(cachedWeather, "available");

  try {
    const conditions = await dependencies.fetchCurrentWeather(location);
    const snapshot: WeatherSnapshot = {
      ...conditions,
      fetchedAt: dependencies.now().toISOString(),
      location,
    };
    await dependencies.saveWeather(snapshot);
    return snapshotToState(snapshot, "available");
  } catch (error) {
    if (cachedWeather) return snapshotToState(cachedWeather, "stale");
    return error instanceof WeatherNetworkError
      ? { status: "offline" }
      : { status: "error" };
  }
}

function snapshotToState(
  snapshot: WeatherSnapshot,
  status: "available" | "stale",
): WeatherState {
  return {
    condition: snapshot.condition,
    fetchedAt: snapshot.fetchedAt,
    locationLabel: snapshot.location.label,
    metrics: snapshot.metrics,
    observedAt: snapshot.observedAt,
    source: snapshot.source,
    status,
  };
}
