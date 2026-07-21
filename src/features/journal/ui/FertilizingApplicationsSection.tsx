import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  saveUserFertilizer,
  type UserFertilizer,
  type UserFertilizerFields,
} from "@/features/fertilizers";
import type { FertilizerApplicationDetails } from "../models/fertilizer-application";
import { createId } from "@/shared/lib/identifiers";
import { t } from "@/shared/i18n";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { Typography } from "@/shared/ui/Typography";
import { spacing } from "@/shared/ui/theme";
import type { FertilizerSuggestion } from "../models/suggested-fertilizer-application";
import { toggleUserFertilizerApplication } from "../models/fertilizer-selection";
import { FertilizerSuggestionChips } from "./FertilizerSuggestionChips";
import { FertilizerSelectionSheet } from "./FertilizerSelectionSheet";
import { useSuggestedFertilizers } from "./useSuggestedFertilizers";

type Props = Readonly<{
  onChange: (value: readonly FertilizerApplicationDetails[]) => void;
  suggestions: readonly FertilizerSuggestion[];
  value: readonly FertilizerApplicationDetails[];
}>;

export function FertilizingApplicationsSection({
  onChange,
  suggestions,
  value,
}: Props) {
  const queryClient = useQueryClient();
  const suggested = useSuggestedFertilizers({ onChange, value });
  const [selectionVisible, setSelectionVisible] = useState(false);

  function toggle(fertilizer: UserFertilizer) {
    onChange(toggleUserFertilizerApplication(value, fertilizer));
  }

  async function create({ group, name }: UserFertilizerFields) {
    const now = new Date().toISOString();
    const fertilizer: UserFertilizer = {
      id: createId(),
      mutationId: createId(),
      name,
      group,
      knowledgeId: null,
      createdAt: now,
      updatedAt: now,
    };
    await saveUserFertilizer(fertilizer);
    await queryClient.invalidateQueries({ queryKey: ["user-fertilizers"] });
    toggle(fertilizer);
  }

  const detailedApplications = value.filter(
    (application) => application.knowledgeIdSnapshot === null,
  );
  return (
    <View style={styles.section}>
      <Typography variant="headlineSmall">
        {t("journal.fertilizing.usedTitle")}
      </Typography>
      <FertilizerSuggestionChips
        customNames={detailedApplications.map(
          (application) => application.nameSnapshot,
        )}
        onAdd={() => setSelectionVisible(true)}
        onToggle={(suggestion) => void suggested.toggleSuggestion(suggestion)}
        onToggleCustom={(name) =>
          onChange(
            value.filter((application) => application.nameSnapshot !== name),
          )
        }
        savingSuggestionId={suggested.savingSuggestionId}
        selectedKnowledgeIds={value.flatMap((application) =>
          application.knowledgeIdSnapshot
            ? [application.knowledgeIdSnapshot]
            : [],
        )}
        suggestions={suggestions}
        usages={suggested.usages}
      />
      {suggested.suggestionError ? (
        <Typography
          accessibilityRole="alert"
          color="error"
          variant="bodyMedium"
        >
          {suggested.suggestionError}
        </Typography>
      ) : null}
      {suggested.usageFailed ? (
        <View style={styles.error}>
          <Typography
            accessibilityRole="alert"
            color="error"
            variant="bodyMedium"
          >
            {t("journal.fertilizing.suggestion.usageError")}
          </Typography>
          <PrimaryButton
            label={t("common.actions.retry")}
            onPress={() => void suggested.retryUsage()}
          />
        </View>
      ) : null}
      <FertilizerSelectionSheet
        failed={suggested.fertilizersQuery.isError}
        fertilizers={suggested.fertilizersQuery.data ?? []}
        loading={suggested.fertilizersQuery.isPending}
        onCreate={create}
        onDismiss={() => setSelectionVisible(false)}
        onRetry={() => void suggested.fertilizersQuery.refetch()}
        onSelect={toggle}
        selectedIds={value.flatMap((application) =>
          application.userFertilizerId ? [application.userFertilizerId] : [],
        )}
        usages={suggested.userUsages}
        visible={selectionVisible}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  error: { gap: spacing.sm },
  section: { gap: spacing.base },
});
