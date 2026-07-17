import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  getUserFertilizerByKnowledgeId,
  listUserFertilizers,
  saveUserFertilizer,
  type UserFertilizer,
} from "@/features/fertilizers";
import { createId } from "@/shared/lib/identifiers";
import { t } from "@/shared/i18n";
import { listFertilizerSuggestionUsages } from "../data/fertilizer-application-repository";
import type { FertilizerApplicationDetails } from "../models/fertilizer-application";
import {
  selectLatestFertilizerSuggestionUsages,
  toggleSuggestedFertilizerApplication,
  type FertilizerSuggestion,
} from "../models/suggested-fertilizer-application";

type Input = Readonly<{
  onChange: (value: readonly FertilizerApplicationDetails[]) => void;
  value: readonly FertilizerApplicationDetails[];
}>;

export function useSuggestedFertilizers({ onChange, value }: Input) {
  const queryClient = useQueryClient();
  const fertilizersQuery = useQuery({
    queryKey: ["user-fertilizers"],
    queryFn: listUserFertilizers,
  });
  const usageQuery = useQuery({
    queryKey: ["fertilizer-suggestion-usages"],
    queryFn: listFertilizerSuggestionUsages,
  });
  const [savingSuggestionId, setSavingSuggestionId] = useState<string | null>(
    null,
  );
  const [suggestionError, setSuggestionError] = useState<string | null>(null);

  async function toggleSuggestion(suggestion: FertilizerSuggestion) {
    if (savingSuggestionId) return;
    const selected = value.find(
      (application) => application.knowledgeIdSnapshot === suggestion.id,
    );
    if (selected) {
      onChange(
        toggleSuggestedFertilizerApplication(
          value,
          suggestion,
          selected.userFertilizerId,
        ),
      );
      return;
    }
    setSavingSuggestionId(suggestion.id);
    setSuggestionError(null);
    try {
      const fertilizer = await findOrCreateSuggestedFertilizer(suggestion);
      onChange(
        toggleSuggestedFertilizerApplication(value, suggestion, fertilizer.id),
      );
      void queryClient.invalidateQueries({ queryKey: ["user-fertilizers"] });
    } catch {
      setSuggestionError(t("journal.fertilizing.suggestion.catalogError"));
    } finally {
      setSavingSuggestionId(null);
    }
  }

  return {
    fertilizersQuery,
    savingSuggestionId,
    suggestionError,
    toggleSuggestion,
    usageFailed: usageQuery.isError,
    retryUsage: usageQuery.refetch,
    usages: selectLatestFertilizerSuggestionUsages(usageQuery.data ?? []),
  };
}

async function findOrCreateSuggestedFertilizer(
  suggestion: FertilizerSuggestion,
): Promise<UserFertilizer> {
  const existing = await getUserFertilizerByKnowledgeId(suggestion.id);
  if (existing) return existing;
  const now = new Date().toISOString();
  const fertilizer: UserFertilizer = {
    id: createId(),
    mutationId: createId(),
    name: suggestion.name,
    group: suggestion.group,
    knowledgeId: suggestion.id,
    createdAt: now,
    updatedAt: now,
  };
  await saveUserFertilizer(fertilizer);
  return fertilizer;
}
