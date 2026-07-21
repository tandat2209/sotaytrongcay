import { LandPlot, Sprout, type LucideIcon } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";
import { t } from "@/shared/i18n";
import { FormField } from "@/shared/ui/FormField";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";
import type { Plant } from "../models/plant";

const METHODS: readonly Readonly<{
  icon: LucideIcon;
  label: "plants.method.container" | "plants.method.ground";
  value: Plant["growingMethod"];
}>[] = [
  { icon: Sprout, label: "plants.method.container", value: "container" },
  { icon: LandPlot, label: "plants.method.ground", value: "ground" },
];

type Props = Readonly<{
  onChange: (value: Plant["growingMethod"]) => void;
  value: Plant["growingMethod"];
}>;

export function GrowingMethodField({ onChange, value }: Props) {
  return (
    <FormField label={t("plants.create.growingMethod")}>
      <View accessibilityRole="radiogroup" style={styles.options}>
        {METHODS.map((method) => {
          const label = t(method.label);
          const selected = method.value === value;
          const Icon = method.icon;

          return (
            <Pressable
              accessibilityLabel={t(
                "plants.create.growingMethodAccessibility",
                { method: label },
              )}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              key={method.value}
              onPress={() => onChange(method.value)}
              style={({ pressed }) => [
                styles.option,
                selected && styles.selected,
                pressed && styles.pressed,
              ]}
            >
              <Icon
                color={selected ? colors.surface : colors.primary}
                size={20}
              />
              <Typography
                color={selected ? "surface" : "text"}
                variant="bodyMedium"
              >
                {label}
              </Typography>
            </Pressable>
          );
        })}
      </View>
    </FormField>
  );
}

const styles = StyleSheet.create({
  option: {
    alignItems: "center",
    borderColor: colors.border,
    borderRadius: radius.chip,
    borderWidth: 1,
    flex: 1,
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 48,
    paddingHorizontal: spacing.base,
  },
  options: { flexDirection: "row", gap: spacing.sm },
  pressed: { opacity: 0.82 },
  selected: { backgroundColor: colors.primary, borderColor: colors.primary },
});
