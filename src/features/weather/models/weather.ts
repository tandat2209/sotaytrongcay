import { z } from "zod";

export const WeatherConditionSchema = z.enum([
  "clear",
  "cloudy",
  "fog",
  "rain",
  "showers",
  "snow",
  "thunderstorm",
  "unknown",
]);

export type WeatherCondition = z.infer<typeof WeatherConditionSchema>;

export const WeatherMetricsSchema = z.object({
  humidityPercent: z.number().min(0).max(100),
  rainChancePercent: z.number().min(0).max(100),
  temperatureCelsius: z.number().finite(),
  windSpeedKph: z.number().nonnegative(),
});

export type WeatherMetrics = Readonly<z.infer<typeof WeatherMetricsSchema>>;

export const WeatherLocationSchema = z.object({
  label: z.string().trim().min(1),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  updatedAt: z.iso.datetime(),
});

export type WeatherLocation = Readonly<z.infer<typeof WeatherLocationSchema>>;

export const WeatherConditionsSchema = z.object({
  condition: WeatherConditionSchema,
  metrics: WeatherMetricsSchema,
  observedAt: z.iso.datetime(),
  source: z.string().trim().min(1),
});

export type WeatherConditions = Readonly<
  z.infer<typeof WeatherConditionsSchema>
>;

export const WeatherSnapshotSchema = WeatherConditionsSchema.extend({
  fetchedAt: z.iso.datetime(),
  location: WeatherLocationSchema,
});

export type WeatherSnapshot = Readonly<z.infer<typeof WeatherSnapshotSchema>>;

type WeatherObservation = WeatherConditions &
  Readonly<{
    fetchedAt: string;
    locationLabel: string;
  }>;

export type WeatherState =
  | ({ status: "available" | "stale" } & WeatherObservation)
  | { status: "loading" }
  | { status: "offline" }
  | { status: "unavailable"; reason: "not-configured" | "permission-denied" }
  | { status: "error" };
