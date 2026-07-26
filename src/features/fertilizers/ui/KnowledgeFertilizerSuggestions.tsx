import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { Plus, Sparkles } from "lucide-react-native";
import { t } from "@/shared/i18n";
import type { FocusedFertilizerSuggestion } from "@/features/knowledge";
import { SectionHeader } from "@/shared/ui/SectionHeader";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { Typography } from "@/shared/ui/Typography";
import { colors, control, spacing } from "@/shared/ui/theme";
import type { FertilizerSuggestionIdentity } from "../models/user-fertilizer";
import { FERTILIZER_GROUP_ICONS } from "./fertilizer-group-visual";

type Props = Readonly<{
  addingId: string | null;
  addFailed: boolean;
  onAdd: (suggestion: FertilizerSuggestionIdentity) => void;
  suggestions: readonly FocusedFertilizerSuggestion[];
}>;

export function KnowledgeFertilizerSuggestions({
  addingId,
  addFailed,
  onAdd,
  suggestions,
}: Props) {
  if (suggestions.length === 0) return null;

  return (
    <View style={styles.section}>
      <SectionHeader
        icon={Sparkles}
        title={t("fertilizers.management.suggestionsTitle")}
      />
      <Typography color="textSecondary" variant="body">
        {t("fertilizers.management.suggestionsDescription")}
      </Typography>
      {addFailed ? (
        <Typography accessibilityRole="alert" color="error" variant="body">
          {t("fertilizers.error.addSuggestion")}
        </Typography>
      ) : null}
      <View style={styles.list}>
        {suggestions.map((suggestion, index) => {
          const GroupIcon = FERTILIZER_GROUP_ICONS[suggestion.group];
          const adding = addingId === suggestion.id;
          const startsSection =
            suggestions[index - 1]?.section.id !== suggestion.section.id;
          return (
            <View key={suggestion.id} style={styles.suggestion}>
              {startsSection ? (
                <Typography style={styles.sectionTitle} variant="sectionTitle">
                  {suggestion.section.title}
                </Typography>
              ) : null}
              <Pressable
                accessibilityLabel={t(
                  adding
                    ? "fertilizers.management.suggestionAdding"
                    : "fertilizers.management.suggestionAdd",
                  { name: suggestion.name },
                )}
                accessibilityRole="button"
                accessibilityState={{
                  busy: adding,
                  disabled: addingId !== null,
                }}
                disabled={addingId !== null}
                onPress={() => onAdd(suggestion)}
                style={({ pressed }) => [
                  pressed && !adding && styles.pressed,
                  addingId !== null && !adding && styles.disabled,
                ]}
              >
                <SurfaceCard style={styles.card}>
                  <View style={styles.identity}>
                    <Typography style={styles.name} variant="bodyLarge">
                      {suggestion.name}
                    </Typography>
                    <Typography color="textSecondary" variant="bodyMedium">
                      {suggestion.description}
                    </Typography>
                    <View style={styles.group}>
                      <GroupIcon color={colors.textSecondary} size={16} />
                      <Typography color="textSecondary" variant="label">
                        {t(`fertilizers.group.${suggestion.group}`)}
                      </Typography>
                    </View>
                  </View>
                  <View accessibilityElementsHidden style={styles.addAction}>
                    {adding ? (
                      <ActivityIndicator color={colors.primary} />
                    ) : (
                      <Plus color={colors.primary} size={20} />
                    )}
                    <Typography color="primary" variant="label">
                      {t(
                        adding
                          ? "fertilizers.management.suggestionAddingLabel"
                          : "fertilizers.management.suggestionAddLabel",
                      )}
                    </Typography>
                  </View>
                </SurfaceCard>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  addAction: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.xs,
    minHeight: control.iconTarget,
  },
  card: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between",
  },
  disabled: { opacity: 0.55 },
  group: { alignItems: "center", flexDirection: "row", gap: spacing.xs },
  identity: { flex: 1, gap: spacing.xs, minWidth: 0 },
  list: { gap: spacing.sm },
  name: { flexShrink: 1 },
  pressed: { opacity: 0.72 },
  section: { gap: spacing.sm },
  sectionTitle: { marginTop: spacing.sm },
  suggestion: { gap: spacing.sm },
});
