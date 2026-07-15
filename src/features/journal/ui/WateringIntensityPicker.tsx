import { CloudRain, Droplet, Droplets, Waves } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";
import type { WateringIntensity } from "../models/care-activity";
import {
  getWateringIntensityDescription,
  getWateringIntensityLabel,
} from "./care-activity-copy";
import { t } from "@/shared/i18n";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";

const intensities = [
  { value: "light", icon: Droplet },
  { value: "moderate", icon: Droplets },
  { value: "deep", icon: Waves },
  { value: "rain", icon: CloudRain },
] as const;

type Props = Readonly<{
  error?: string | null;
  onChange: (value: WateringIntensity) => void;
  value: WateringIntensity | null;
}>;

export function WateringIntensityPicker({ error, onChange, value }: Props) {
  return (
    <View style={styles.field}>
      <Typography variant="label">
        {t("journal.careEntry.intensity.title")}
      </Typography>
      <View accessibilityRole="radiogroup" style={styles.options}>
        {intensities.map(({ icon: Icon, value: intensity }) => {
          const selected = value === intensity;
          const label = getWateringIntensityLabel(intensity);
          const description = getWateringIntensityDescription(intensity);
          return (
            <Pressable
              accessibilityHint={description}
              accessibilityLabel={label}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              key={intensity}
              onPress={() => onChange(intensity)}
              style={({ pressed }) => [
                styles.option,
                selected && styles.selectedOption,
                pressed && styles.pressed,
              ]}
            >
              <Icon
                color={selected ? colors.activityWater : colors.textSecondary}
                size={20}
              />
              <Typography variant="bodyMedium">{label}</Typography>
            </Pressable>
          );
        })}
      </View>
      {value ? (
        <Typography color="primary" variant="bodyMedium">
          {t("journal.careEntry.intensity.selected", {
            label: getWateringIntensityLabel(value),
          })}
        </Typography>
      ) : null}
      {error ? (
        <Typography
          accessibilityRole="alert"
          color="error"
          variant="bodyMedium"
        >
          {error}
        </Typography>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: spacing.sm },
  option: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.control,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.xs,
    justifyContent: "center",
    minHeight: 48,
    paddingHorizontal: spacing.sm,
  },
  options: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  pressed: { opacity: 0.8 },
  selectedOption: {
    backgroundColor: colors.activityWaterSoft,
    borderColor: colors.activityWater,
    borderWidth: 2,
  },
});
