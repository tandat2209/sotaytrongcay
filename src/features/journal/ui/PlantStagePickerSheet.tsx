import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet } from "react-native";
import { stageIcon } from "@/features/knowledge/stage-icons";
import type { PlantKnowledgeStage } from "@/features/knowledge";
import { BottomSheet } from "@/shared/ui/BottomSheet";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";

type Props = Readonly<{
  onDismiss: () => void;
  onSelect: (stageId: string) => void;
  selectedStageId: string;
  stages: readonly PlantKnowledgeStage[];
  visible: boolean;
}>;

export function PlantStagePickerSheet({ onDismiss, onSelect, selectedStageId, stages, visible }: Props) {
  return <BottomSheet onDismiss={onDismiss} title="Chọn giai đoạn" visible={visible}>
    {stages.map((stage) => {
      const selected = stage.id === selectedStageId;
      return <Pressable accessibilityLabel={`Chọn giai đoạn ${stage.title}`} accessibilityRole="radio" accessibilityState={{ checked: selected }} key={stage.id} onPress={() => onSelect(stage.id)} style={[styles.option, selected && styles.selected]}>
        <Ionicons color={selected ? colors.surface : colors.primary} name={stageIcon(stage.id)} size={20} />
        <Typography color={selected ? "surface" : "text"} variant="bodyLarge">{stage.title}</Typography>
      </Pressable>;
    })}
  </BottomSheet>;
}

const styles = StyleSheet.create({
  option: { alignItems: "center", borderColor: colors.border, borderRadius: radius.control, borderWidth: 1, flexDirection: "row", gap: spacing.md, minHeight: 52, paddingHorizontal: spacing.md },
  selected: { backgroundColor: colors.primary, borderColor: colors.primary },
});
