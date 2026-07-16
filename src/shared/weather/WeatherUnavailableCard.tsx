import type { WeatherState } from "@/features/weather/models/weather";
import { t } from "@/shared/i18n";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { Typography } from "@/shared/ui/Typography";
import { colors, spacing } from "@/shared/ui/theme";
import { CircleAlert, CloudOff } from "lucide-react-native";
import type { ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";

type Props = Readonly<{
  disabled: boolean;
  header: ReactNode;
  onRetry: (() => void) | undefined;
  onUseLocation: (() => void) | undefined;
  weather: WeatherState;
}>;

export function WeatherUnavailableCard({
  disabled,
  header,
  onRetry,
  onUseLocation,
  weather,
}: Props) {
  const content = getContent(weather);
  const WeatherIcon = weather.status === "error" ? CircleAlert : CloudOff;

  return (
    <SurfaceCard style={styles.card}>
      {header}
      <View style={styles.stateRow}>
        <View accessibilityElementsHidden style={styles.icon}>
          <WeatherIcon color={colors.primary} size={22} />
        </View>
        <View style={styles.copy}>
          <Typography color="textSecondary" variant="bodyMedium">
            {content.detail}
          </Typography>
          <Typography color="textSecondary" variant="label">
            {content.label}
          </Typography>
          {weather.status === "unavailable" && onUseLocation ? (
            <WeatherAction
              disabled={disabled}
              label={
                weather.reason === "not-configured"
                  ? t("weather.actions.useLocation")
                  : t("common.actions.retry")
              }
              onPress={onUseLocation}
            />
          ) : onRetry && weather.status !== "loading" ? (
            <WeatherAction
              disabled={disabled}
              label={t("common.actions.retry")}
              onPress={onRetry}
            />
          ) : null}
        </View>
      </View>
    </SurfaceCard>
  );
}

function getContent(weather: WeatherState) {
  if (weather.status === "loading") {
    return {
      detail: t("weather.detail.loading"),
      label: t("weather.state.loading"),
    };
  }
  if (weather.status === "offline") {
    return {
      detail: t("weather.detail.offline"),
      label: t("weather.state.offline"),
    };
  }
  if (weather.status === "error") {
    return {
      detail: t("weather.detail.error"),
      label: t("weather.state.error"),
    };
  }
  if (
    weather.status === "unavailable" &&
    weather.reason === "permission-denied"
  ) {
    return {
      detail: t("weather.detail.permission"),
      label: t("weather.state.unavailable"),
    };
  }
  return {
    detail: t("weather.detail.unavailable"),
    label: t("weather.state.unavailable"),
  };
}

function WeatherAction({
  disabled,
  label,
  onPress,
}: {
  disabled: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.action,
        pressed && styles.actionPressed,
        disabled && styles.actionDisabled,
      ]}
    >
      <Typography color="primary" variant="label">
        {label}
      </Typography>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  action: { alignItems: "flex-start", justifyContent: "center", minHeight: 44 },
  actionDisabled: { opacity: 0.45 },
  actionPressed: { opacity: 0.7 },
  card: {
    backgroundColor: colors.surfaceSubtle,
    borderColor: colors.primarySoft,
    gap: spacing.sm,
  },
  copy: { flex: 1, gap: spacing.xs },
  icon: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  stateRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
  },
});
