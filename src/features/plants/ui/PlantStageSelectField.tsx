import { ChevronDown } from "lucide-react-native";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { PlantStagePickerSheet } from "@/features/journal";
import type { PlantKnowledgeStage } from "@/features/knowledge";
import { StageIcon } from "@/features/knowledge/stage-icons";
import { t } from "@/shared/i18n";
import { FormField } from "@/shared/ui/FormField";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";

type Props = Readonly<{
  onChange: (stageId: string) => void;
  stages: readonly PlantKnowledgeStage[];
  value: string;
}>;

export function PlantStageSelectField({ onChange, stages, value }: Props) {
  const [open, setOpen] = useState(false);
  const selectedStage = stages.find((stage) => stage.id === value);

  return (
    <>
      <FormField label={t("plants.create.stage")}>
        <Pressable
          accessibilityLabel={t("plants.create.stageAccessibility", {
            stage: selectedStage?.title ?? t("common.fallback.unknown"),
          })}
          accessibilityRole="button"
          onPress={() => setOpen(true)}
          style={({ pressed }) => [styles.control, pressed && styles.pressed]}
        >
          <View style={styles.selection}>
            <StageIcon color={colors.primary} size={20} stageId={value} />
            <Typography variant="bodyLarge">
              {selectedStage?.title ?? t("common.fallback.unknown")}
            </Typography>
          </View>
          <ChevronDown color={colors.textSecondary} size={20} />
        </Pressable>
      </FormField>
      <PlantStagePickerSheet
        onDismiss={() => setOpen(false)}
        onSelect={(stageId) => {
          onChange(stageId);
          setOpen(false);
        }}
        selectedStageId={value}
        stages={stages}
        visible={open}
      />
    </>
  );
}

const styles = StyleSheet.create({
  control: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.control,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 52,
    paddingHorizontal: spacing.base,
  },
  pressed: { backgroundColor: colors.primarySoft },
  selection: { alignItems: "center", flexDirection: "row", gap: spacing.sm },
});
