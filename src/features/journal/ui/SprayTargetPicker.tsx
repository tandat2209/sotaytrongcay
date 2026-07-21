import { StyleSheet, View } from "react-native";
import type { SprayTarget } from "@/features/knowledge";
import { t } from "@/shared/i18n";
import { SelectableChip } from "@/shared/ui/SelectableChip";
import { Typography } from "@/shared/ui/Typography";
import { spacing } from "@/shared/ui/theme";

type Props = Readonly<{
  onChange: (targetId: string | null) => void;
  targets: readonly SprayTarget[];
  value: string | null;
}>;

export function SprayTargetPicker({ onChange, targets, value }: Props) {
  if (targets.length === 0) return null;

  return (
    <View style={styles.section}>
      <View style={styles.copy}>
        <Typography variant="headlineSmall">
          {t("journal.spraying.targetTitle")}
        </Typography>
        <Typography color="textSecondary" variant="bodyMedium">
          {t("journal.spraying.targetHelper")}
        </Typography>
      </View>
      <View style={styles.chips}>
        {targets.map((target) => {
          const selected = target.id === value;
          return (
            <SelectableChip
              accessibilityLabel={t(
                selected
                  ? "journal.spraying.targetSelected"
                  : "journal.spraying.targetUnselected",
                { target: target.title },
              )}
              key={target.id}
              label={target.title}
              onPress={() => onChange(selected ? null : target.id)}
              selected={selected}
              selectedTone="solid"
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  copy: { gap: spacing.xs },
  section: { gap: spacing.base },
});
