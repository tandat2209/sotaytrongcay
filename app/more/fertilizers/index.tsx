import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { Text } from "react-native";
import {
  FertilizerManagementScreen,
  findOrCreateSuggestedUserFertilizer,
  listUserFertilizers,
} from "@/features/fertilizers";
import { listFertilizerSuggestions } from "@/features/knowledge";
import {
  listUserFertilizerUsages,
  selectLatestUserFertilizerUsages,
} from "@/features/journal";
import { t } from "@/shared/i18n";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { LoadingScreen } from "@/shared/ui/LoadingScreen";

export default function FertilizerManagementRoute() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["user-fertilizers"],
    queryFn: listUserFertilizers,
  });
  const usagesQuery = useQuery({
    queryKey: ["user-fertilizer-usages"],
    queryFn: listUserFertilizerUsages,
  });
  const addSuggestionMutation = useMutation({
    mutationFn: findOrCreateSuggestedUserFertilizer,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user-fertilizers"] });
    },
  });
  if (query.isPending) return <LoadingScreen />;
  if (query.isError)
    return (
      <>
        <Text>{t("fertilizers.error.load")}</Text>
        <PrimaryButton
          label={t("common.actions.retry")}
          onPress={() => void query.refetch()}
        />
      </>
    );
  return (
    <FertilizerManagementScreen
      addSuggestionFailed={addSuggestionMutation.isError}
      addingSuggestionId={
        addSuggestionMutation.isPending
          ? (addSuggestionMutation.variables?.id ?? null)
          : null
      }
      fertilizers={query.data}
      fertilizerSuggestions={listFertilizerSuggestions()}
      onAdd={() => router.push("/more/fertilizers/new")}
      onAddSuggestion={(suggestion) => {
        addSuggestionMutation.reset();
        addSuggestionMutation.mutate(suggestion);
      }}
      onBack={() => router.back()}
      onOpen={(fertilizer) =>
        router.push({
          pathname: "/more/fertilizers/[id]",
          params: { id: fertilizer.id },
        })
      }
      onRetryUsage={() => void usagesQuery.refetch()}
      usageLoadFailed={usagesQuery.isError}
      usages={selectLatestUserFertilizerUsages(usagesQuery.data ?? [])}
    />
  );
}
