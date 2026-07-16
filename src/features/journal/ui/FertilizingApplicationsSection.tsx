import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  saveUserFertilizer,
  type FertilizerGroup,
  type UserFertilizer,
} from "@/features/fertilizers";
import type {
  FertilizerAmountUnit,
  FertilizerApplicationMethod,
} from "../models/fertilizer-application";
import { createId } from "@/shared/lib/identifiers";
import { t } from "@/shared/i18n";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { Typography } from "@/shared/ui/Typography";
import { spacing } from "@/shared/ui/theme";
import { FertilizerApplicationEditorSheet } from "./FertilizerApplicationEditorSheet";
import { FertilizerPickerSheet } from "./FertilizerPickerSheet";
import type { CreateFertilizerFields } from "./FertilizerPickerSheet";
import type { FertilizerSuggestion } from "../models/suggested-fertilizer-application";
import { FertilizerSuggestionChips } from "./FertilizerSuggestionChips";
import { useSuggestedFertilizers } from "./useSuggestedFertilizers";

export type FertilizerApplicationDetails = Readonly<{
  userFertilizerId: string | null;
  nameSnapshot: string;
  groupSnapshot: FertilizerGroup | null;
  knowledgeIdSnapshot: string | null;
  amountValue: number | null;
  amountUnit: FertilizerAmountUnit | null;
  applicationMethod: FertilizerApplicationMethod | null;
  notes: string | null;
}>;

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
  const [pickerVisible, setPickerVisible] = useState(false);
  const [creatingFertilizer, setCreatingFertilizer] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  function select(fertilizer: UserFertilizer, openDetails = true) {
    const next = [
      ...value,
      {
        userFertilizerId: fertilizer.id,
        nameSnapshot: fertilizer.name,
        groupSnapshot: fertilizer.group,
        knowledgeIdSnapshot: fertilizer.knowledgeId,
        amountValue: null,
        amountUnit: null,
        applicationMethod: null,
        notes: null,
      },
    ];
    onChange(next);
    setPickerVisible(false);
    setCreatingFertilizer(false);
    if (openDetails) setEditingIndex(next.length - 1);
  }

  async function create({ group, name }: CreateFertilizerFields) {
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
    select(fertilizer, false);
  }

  const editing = editingIndex === null ? null : (value[editingIndex] ?? null);
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
        onAdd={() => {
          setCreatingFertilizer(true);
          setPickerVisible(true);
        }}
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
      {pickerVisible ? (
        <FertilizerPickerSheet
          fertilizers={suggested.fertilizersQuery.data ?? []}
          failed={suggested.fertilizersQuery.isError}
          loading={suggested.fertilizersQuery.isPending}
          onCreate={create}
          onDismiss={() => {
            setCreatingFertilizer(false);
            setPickerVisible(false);
          }}
          onRetry={() => void suggested.fertilizersQuery.refetch()}
          onSelect={select}
          startInCreateMode={creatingFertilizer}
          visible
        />
      ) : null}
      {editing ? (
        <FertilizerApplicationEditorSheet
          application={editing}
          key={editingIndex}
          onDismiss={() => setEditingIndex(null)}
          onRemove={() => {
            if (editingIndex === null) return;
            onChange(value.filter((_, index) => index !== editingIndex));
            setEditingIndex(null);
          }}
          onSave={(application) => {
            if (editingIndex === null) return;
            onChange(
              value.map((item, index) =>
                index === editingIndex ? application : item,
              ),
            );
            setEditingIndex(null);
          }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  error: { gap: spacing.sm },
  section: { gap: spacing.md },
});
