import { fetch } from "expo/fetch";
import { z } from "zod";
import {
  WeatherConditionsSchema,
  type WeatherConditions,
  type WeatherLocation,
} from "../models/weather";
import { WeatherNetworkError } from "../models/weather-errors";

const OpenMeteoResponseSchema = z.object({
  current: z.object({
    interval: z.number(),
    precipitation: z.number(),
    relative_humidity_2m: z.number(),
    temperature_2m: z.number(),
    time: z.number().int(),
    weather_code: z.number().int(),
    wind_speed_10m: z.number(),
  }),
  daily: z.object({
    precipitation_probability_max: z.array(z.number().nullable()).min(1),
    time: z.array(z.number()).min(1),
  }),
});

export function normalizeOpenMeteoResponse(value: unknown): WeatherConditions {
  const response = OpenMeteoResponseSchema.parse(value);
  const rainChance = response.daily.precipitation_probability_max[0];
  if (rainChance === null || rainChance === undefined)
    throw new Error("Weather response does not include today's rain chance.");

  return WeatherConditionsSchema.parse({
    condition: weatherConditionFromCode(response.current.weather_code),
    metrics: {
      humidityPercent: Math.round(response.current.relative_humidity_2m),
      rainChancePercent: Math.round(rainChance),
      temperatureCelsius: roundOne(response.current.temperature_2m),
      windSpeedKph: roundOne(response.current.wind_speed_10m),
    },
    observedAt: new Date(response.current.time * 1_000).toISOString(),
    source: "Open-Meteo",
  });
}

export async function fetchOpenMeteoWeather(
  location: WeatherLocation,
  signal?: AbortSignal,
): Promise<WeatherConditions> {
  const parameters = new URLSearchParams({
    current:
      "temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m",
    daily: "precipitation_probability_max",
    forecast_days: "1",
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    timeformat: "unixtime",
    timezone: "auto",
  });

  let response: Awaited<ReturnType<typeof fetch>>;
  try {
    response = await fetch(
      `https://api.open-meteo.com/v1/forecast?${parameters.toString()}`,
      signal ? { signal } : undefined,
    );
  } catch {
    throw new WeatherNetworkError();
  }
  if (!response.ok)
    throw new Error(`Weather request failed: ${response.status}`);
  return normalizeOpenMeteoResponse(await response.json());
}

function weatherConditionFromCode(
  code: number,
): WeatherConditions["condition"] {
  if (code === 0) return "clear";
  if (code >= 1 && code <= 3) return "cloudy";
  if (code === 45 || code === 48) return "fog";
  if (code >= 51 && code <= 67) return "rain";
  if (code >= 71 && code <= 77) return "snow";
  if (code >= 80 && code <= 82) return "showers";
  if (code === 85 || code === 86) return "snow";
  if (code >= 95 && code <= 99) return "thunderstorm";
  return "unknown";
}

function roundOne(value: number): number {
  return Math.round(value * 10) / 10;
}
