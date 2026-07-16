import type { WeatherCondition } from "@/features/weather/models/weather";
import {
  CircleHelp,
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  Sun,
  type LucideIcon,
} from "lucide-react-native";

export const weatherConditionIcons: Record<WeatherCondition, LucideIcon> = {
  clear: Sun,
  cloudy: Cloud,
  fog: CloudFog,
  rain: CloudRain,
  showers: CloudRainWind,
  snow: CloudSnow,
  thunderstorm: CloudLightning,
  unknown: CircleHelp,
};
