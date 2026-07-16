import type { WeatherState } from "@/features/weather/models/weather";
import { formatNumber, t } from "@/shared/i18n";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { Typography } from "@/shared/ui/Typography";
import { colors, spacing } from "@/shared/ui/theme";
import {
  Clock,
  Droplets,
  Thermometer,
  Umbrella,
  Wind,
  type LucideIcon,
} from "lucide-react-native";
import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { formatWeatherCondition } from "./weather-copy";
import { weatherConditionIcons } from "./weather-icons";
import { WeatherUnavailableCard } from "./WeatherUnavailableCard";

type Props = Readonly<{
  disabled?: boolean;
  header?: ReactNode;
  onRetry?: () => void;
  onUseLocation?: () => void;
  weather: WeatherState;
}>;

export function WeatherCard({
  disabled = false,
  header,
  onRetry,
  onUseLocation,
  weather,
}: Props) {
  if (weather.status === "available" || weather.status === "stale") {
    const temperature = formatNumber(weather.metrics.temperatureCelsius);
    const windSpeed = formatNumber(weather.metrics.windSpeedKph);
    const ConditionIcon = weatherConditionIcons[weather.condition];

    return (
      <SurfaceCard style={styles.availableCard}>
        {header}
        <View style={styles.summaryRow}>
          <Icon icon={ConditionIcon} />
          <Typography variant="bodyLarge">
            {formatWeatherCondition(weather.condition)}
          </Typography>
          {weather.status === "stale" ? (
            <View
              accessibilityLabel={t("weather.state.stale")}
              accessible
              style={styles.staleIcon}
            >
              <Clock color={colors.textSecondary} size={18} />
            </View>
          ) : null}
        </View>
        <View style={styles.metricsRow}>
          <Metric
            accessibilityLabel={t("weather.metric.temperature", {
              temperature,
            })}
            icon={Thermometer}
            value={`${temperature}°C`}
          />
          <Metric
            accessibilityLabel={t("weather.metric.humidity", {
              percent: weather.metrics.humidityPercent,
            })}
            icon={Droplets}
            value={`${weather.metrics.humidityPercent}%`}
          />
          <Metric
            accessibilityLabel={t("weather.metric.rain", {
              percent: weather.metrics.rainChancePercent,
            })}
            icon={Umbrella}
            value={`${weather.metrics.rainChancePercent}%`}
          />
          <Metric
            accessibilityLabel={t("weather.metric.wind", {
              speed: windSpeed,
            })}
            icon={Wind}
            value={`${windSpeed} km/h`}
          />
        </View>
      </SurfaceCard>
    );
  }

  return (
    <WeatherUnavailableCard
      disabled={disabled}
      header={header}
      onRetry={onRetry}
      onUseLocation={onUseLocation}
      weather={weather}
    />
  );
}

function Metric({
  accessibilityLabel,
  icon: MetricIcon,
  value,
}: {
  accessibilityLabel: string;
  icon: LucideIcon;
  value: string;
}) {
  return (
    <View
      accessibilityLabel={accessibilityLabel}
      accessible
      style={styles.metric}
    >
      <MetricIcon color={colors.primary} size={18} />
      <Typography color="textSecondary" variant="label">
        {value}
      </Typography>
    </View>
  );
}

function Icon({ icon: WeatherIcon }: { icon: LucideIcon }) {
  return (
    <View accessibilityElementsHidden style={styles.icon}>
      <WeatherIcon color={colors.primary} size={22} />
    </View>
  );
}

const styles = StyleSheet.create({
  availableCard: {
    backgroundColor: colors.surfaceSubtle,
    borderColor: colors.primarySoft,
    gap: spacing.sm,
  },
  icon: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  metric: { alignItems: "center", flexDirection: "row", gap: spacing.xs },
  metricsRow: {
    alignItems: "center",
    columnGap: spacing.lg,
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: spacing.sm,
  },
  staleIcon: { marginLeft: "auto" },
  summaryRow: { alignItems: "center", flexDirection: "row", gap: spacing.sm },
});
