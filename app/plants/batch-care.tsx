import { useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { TriangleAlert } from "lucide-react-native";
import { z } from "zod";
import {
  BatchCareFlowScreen,
  intersectSharedSprayTargets,
  saveCareActivityBatch,
  type CareActivityBatchCommand,
} from "@/features/journal";
import { listSprayTargets } from "@/features/knowledge";
import { listPlants, parseBatchCarePlantIds } from "@/features/plants";
import { reconcilePlantCarePlanReminders } from "@/features/reminders";
import { t } from "@/shared/i18n";
import { EmptyState } from "@/shared/ui/EmptyState";
import { LoadingScreen } from "@/shared/ui/LoadingScreen";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { Screen } from "@/shared/ui/Screen";

const BatchCareRouteSchema = z.object({ plantIds: z.string() });

export default function BatchCareRoute() {
  const queryClient = useQueryClient();
  const route = BatchCareRouteSchema.safeParse(useLocalSearchParams());
  const selectedPlantIds = parseRoutePlantIds(
    route.success ? route.data.plantIds : null,
  );
  const plantsQuery = useQuery({ queryKey: ["plants"], queryFn: listPlants });

  if (plantsQuery.isPending) return <LoadingScreen />;
  if (plantsQuery.isError || !selectedPlantIds) {
    return <UnavailableBatchCare />;
  }

  const plantsById = new Map(
    plantsQuery.data.map((plant) => [plant.id, plant] as const),
  );
  const selectedPlants = selectedPlantIds.flatMap((plantId) => {
    const plant = plantsById.get(plantId);
    return plant ? [plant] : [];
  });
  if (selectedPlants.length !== selectedPlantIds.length) {
    return <UnavailableBatchCare />;
  }

  const speciesIds = [
    ...new Set(selectedPlants.map((plant) => plant.speciesId)),
  ];
  const sprayTargets = intersectSharedSprayTargets(
    speciesIds.map(listSprayTargets),
  );

  async function save(commands: readonly CareActivityBatchCommand[]) {
    await saveCareActivityBatch(commands);
    await Promise.all(
      selectedPlants.map((plant) => reconcilePlantCarePlanReminders(plant)),
    );
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["plant-detail"] }),
      queryClient.invalidateQueries({ queryKey: ["today"] }),
      queryClient.invalidateQueries({ queryKey: ["reminders"] }),
      queryClient.invalidateQueries({ queryKey: ["journal"] }),
      queryClient.invalidateQueries({
        queryKey: ["fertilizer-suggestion-usages"],
      }),
      queryClient.invalidateQueries({ queryKey: ["user-fertilizer-usages"] }),
    ]);
    router.replace("/plants");
  }

  return (
    <BatchCareFlowScreen
      onBack={() => router.back()}
      onSave={save}
      plants={selectedPlants}
      sprayTargets={sprayTargets}
    />
  );
}

function parseRoutePlantIds(value: string | null): readonly string[] | null {
  if (!value) return null;
  try {
    return parseBatchCarePlantIds(value);
  } catch {
    return null;
  }
}

function UnavailableBatchCare() {
  return (
    <Screen
      footer={
        <PrimaryButton
          label={t("common.actions.backToPlants")}
          onPress={() => router.replace("/plants")}
        />
      }
      title={t("plants.batch.title")}
    >
      <EmptyState
        description={t("plants.batch.invalidDescription")}
        icon={TriangleAlert}
        title={t("plants.batch.invalidTitle")}
      />
    </Screen>
  );
}
