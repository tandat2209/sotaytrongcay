import type { WeatherCondition } from "@/features/weather/models/weather";
import { t } from "@/shared/i18n";

export function formatWeatherCondition(condition: WeatherCondition): string {
  const keys = {
    clear: "weather.condition.clear",
    cloudy: "weather.condition.cloudy",
    fog: "weather.condition.fog",
    rain: "weather.condition.rain",
    showers: "weather.condition.showers",
    snow: "weather.condition.snow",
    thunderstorm: "weather.condition.thunderstorm",
    unknown: "weather.condition.unknown",
  } as const;
  return t(keys[condition]);
}
