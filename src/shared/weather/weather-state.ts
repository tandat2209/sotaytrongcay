export type WeatherMetrics = Readonly<{
  humidityPercent?: number;
  rainChancePercent?: number;
  temperatureCelsius?: number;
}>;

type WeatherObservation = Readonly<{
  freshnessLabel: string;
  locationLabel: string;
  metrics?: WeatherMetrics;
  observedAt: string;
  source: string;
  summary: string;
}>;

export type WeatherState =
  | ({ status: "available" | "stale" } & WeatherObservation)
  | { status: "loading" }
  | { status: "offline" }
  | { status: "unavailable"; reason: "not-configured" | "permission-denied" }
  | { status: "error" };

export const productionWeather: WeatherState = {
  status: "unavailable",
  reason: "not-configured",
};
