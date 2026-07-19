import { StyleSheet, View } from "react-native";
import { FertilizerUsageLabel } from "@/features/fertilizers";
import {
  type FertilizerSuggestion,
  type FertilizerSuggestionUsage,
} from "../models/suggested-fertilizer-application";
import { t } from "@/shared/i18n";
import { SelectableChip } from "@/shared/ui/SelectableChip";
import { spacing } from "@/shared/ui/theme";

type Props = Readonly<{
  customNames: readonly string[];
  onAdd: () => void;
  onToggle: (suggestion: FertilizerSuggestion) => void;
  onToggleCustom: (name: string) => void;
  savingSuggestionId: string | null;
  selectedKnowledgeIds: readonly string[];
  suggestions: readonly FertilizerSuggestion[];
  usages: Readonly<Record<string, FertilizerSuggestionUsage>>;
}>;

export function FertilizerSuggestionChips({
  customNames,
  onAdd,
  onToggle,
  onToggleCustom,
  savingSuggestionId,
  selectedKnowledgeIds,
  suggestions,
  usages,
}: Props) {
  return (
    <View style={styles.wrap}>
      {suggestions.map((suggestion) => {
        const selected = selectedKnowledgeIds.includes(suggestion.id);
        const saving = savingSuggestionId === suggestion.id;
        const usage = usages[suggestion.id];
        return (
          <View key={suggestion.id} style={styles.suggestion}>
            <SelectableChip
              accessibilityLabel={t(
                saving
                  ? "journal.fertilizing.suggestion.saving"
                  : selected
                    ? "journal.fertilizing.suggestion.selected"
                    : "journal.fertilizing.suggestion.unselected",
                { name: suggestion.name },
              )}
              label={suggestion.name}
              onPress={() => onToggle(suggestion)}
              selected={selected}
              selectedPrefix="✓ "
              selectedTone="solid"
              unselectedPrefix={saving ? "… " : "+ "}
            />
            {usage ? <FertilizerUsageLabel usage={usage} /> : null}
          </View>
        );
      })}
      {customNames.map((name) => (
        <SelectableChip
          accessibilityLabel={t("journal.fertilizing.suggestion.selected", {
            name,
          })}
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
  suggestion: { alignItems: "flex-start", gap: spacing.xs },
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
});
