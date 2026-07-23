import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  findOrCreateSuggestedUserFertilizer,
  listUserFertilizers,
} from "@/features/fertilizers";
import { t } from "@/shared/i18n";
import {
  listFertilizerSuggestionUsages,
  listUserFertilizerUsages,
} from "../data/fertilizer-application-repository";
import type { FertilizerApplicationDetails } from "../models/fertilizer-application";
import {
  selectLatestFertilizerSuggestionUsages,
  selectLatestUserFertilizerUsages,
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
  const userUsageQuery = useQuery({
    queryKey: ["user-fertilizer-usages"],
    queryFn: listUserFertilizerUsages,
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
      const fertilizer = await findOrCreateSuggestedUserFertilizer(suggestion);
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

  async function retryUsage() {
    await Promise.all([usageQuery.refetch(), userUsageQuery.refetch()]);
  }

  return {
    fertilizersQuery,
    savingSuggestionId,
    suggestionError,
    toggleSuggestion,
    usageFailed: usageQuery.isError || userUsageQuery.isError,
    retryUsage,
    usages: selectLatestFertilizerSuggestionUsages(usageQuery.data ?? []),
    userUsages: selectLatestUserFertilizerUsages(userUsageQuery.data ?? []),
  };
}
