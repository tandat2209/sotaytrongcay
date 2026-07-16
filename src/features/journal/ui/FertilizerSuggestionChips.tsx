import { StyleSheet, View } from "react-native";
import type { FertilizerSuggestion } from "../models/suggested-fertilizer-application";
import { t } from "@/shared/i18n";
import { SelectableChip } from "@/shared/ui/SelectableChip";
import { spacing } from "@/shared/ui/theme";

type Props = Readonly<{
  customNames: readonly string[];
  onAdd: () => void;
  onToggle: (suggestion: FertilizerSuggestion) => void;
  onToggleCustom: (name: string) => void;
  selectedNames: readonly string[];
  suggestions: readonly FertilizerSuggestion[];
}>;

export function FertilizerSuggestionChips({
  customNames,
  onAdd,
  onToggle,
  onToggleCustom,
  selectedNames,
  suggestions,
}: Props) {
  return (
    <View style={styles.wrap}>
      {suggestions.map((suggestion) => {
        const selected = selectedNames.includes(suggestion.name);
        return (
          <SelectableChip
            accessibilityLabel={`${suggestion.name}, ${selected ? "đã chọn" : "chưa chọn"}`}
            key={suggestion.id}
            label={suggestion.name}
            onPress={() => onToggle(suggestion)}
            selected={selected}
            selectedPrefix="✓ "
            selectedTone="solid"
            unselectedPrefix="+ "
          />
        );
      })}
      {customNames.map((name) => (
        <SelectableChip
          accessibilityLabel={`${name}, đã chọn`}
          key={name}
          label={name}
          onPress={() => onToggleCustom(name)}
          selected
          selectedPrefix="✓ "
          selectedTone="solid"
        />
      ))}
      <SelectableChip
        accent
        accessibilityLabel={t("journal.fertilizing.add")}
        label={t("journal.fertilizing.addChip")}
        onPress={onAdd}
        selected={false}
        unselectedPrefix="+ "
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
});
