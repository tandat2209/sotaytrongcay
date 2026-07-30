import {
  Check,
  CloudRain,
  Droplet,
  Droplets,
  Waves,
} from "lucide-react-native";
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
              <View
                accessibilityElementsHidden
                style={[styles.icon, selected && styles.selectedIcon]}
              >
                <Icon
                  color={selected ? colors.activityWater : colors.textSecondary}
                  size={20}
                />
              </View>
              <View style={styles.copy}>
                <Typography variant="bodyStrong">{label}</Typography>
                <Typography color="textSecondary" variant="secondary">
                  {description}
                </Typography>
              </View>
              {selected ? (
                <View accessibilityElementsHidden style={styles.check}>
                  <Check color={colors.surface} size={16} strokeWidth={3} />
                </View>
              ) : null}
            </Pressable>
          );
        })}
      </View>
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
    borderColor: colors.divider,
    borderRadius: radius.medium,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: spacing.md,
    minHeight: 68,
    padding: spacing.md,
  },
  options: { gap: spacing.sm },
  pressed: { opacity: 0.78 },
  selectedOption: {
    backgroundColor: colors.activityWaterSoft,
    borderColor: colors.activityWater,
    borderWidth: 1.5,
  },
  icon: {
    alignItems: "center",
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.small,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  selectedIcon: { backgroundColor: colors.surface },
  copy: { flex: 1, gap: spacing.xs },
  check: {
    alignItems: "center",
    backgroundColor: colors.activityWater,
    borderRadius: radius.pill,
    height: 24,
    justifyContent: "center",
    width: 24,
  },
});
