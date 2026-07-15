import { useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { Text } from "react-native";
import { z } from "zod";
import {
  CareEntryScreen,
  getLatestPlantPhoto,
  listPlantUpdates,
  saveCareActivity,
  type CareActivityType,
} from "@/features/journal";
import { t } from "@/shared/i18n";
import { getStagePlaybook, listCarePlans } from "@/features/knowledge";
import { getPlant, resolvePlantIdentity, type Plant } from "@/features/plants";
import { reconcilePlantCarePlanReminders } from "@/features/reminders";
import { createId } from "@/shared/lib/identifiers";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";

const CareRouteSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(["watering", "fertilizing", "spraying"]),
  origin: z.enum(["today", "reminder", "manual"]).optional(),
});

export default function CareEntryRoute() {
  const {
    id,
    origin = "manual",
    type,
  } = CareRouteSchema.parse(useLocalSearchParams());
  const plantQuery = useQuery({
    queryKey: ["plant", id],
    queryFn: () => getPlant(id),
  });
  const photosQuery = useQuery({
    queryKey: ["plant-photos", id],
    queryFn: () => listPlantUpdates(id),
  });
  if (plantQuery.isPending)
    return <Text>{t("common.state.loadingDeviceData")}</Text>;
  if (plantQuery.isError)
    return (
      <>
        <Text>{t("plants.error.load")}</Text>
        <PrimaryButton
          label={t("common.actions.retry")}
          onPress={() => void plantQuery.refetch()}
        />
      </>
    );
  if (!plantQuery.data)
    return (
      <>
        <Text>{t("plants.error.notFound")}</Text>
        <PrimaryButton
          label={t("common.actions.backToPlants")}
          onPress={() => router.replace("/plants")}
        />
      </>
    );
  return (
    <CareEntry
      imageUri={getLatestPlantPhoto(photosQuery.data ?? [])?.localUri ?? null}
      origin={origin}
      plant={plantQuery.data}
      type={type}
    />
  );
}

function CareEntry({
  imageUri,
  origin,
  plant,
  type,
}: Readonly<{
  imageUri: string | null;
  origin: "today" | "reminder" | "manual";
  plant: Plant;
  type: CareActivityType;
}>) {
  const queryClient = useQueryClient();
  const identity = resolvePlantIdentity(plant);
  const plan = listCarePlans({
    speciesId: plant.speciesId,
    stageId: plant.stageId,
  }).find((candidate) => candidate.activityType === type);
  const reason = getStagePlaybook(plant.stageId)?.primaryObjective;
  const suggestion = plan?.recommendedInputs
    ?.map((input) => input.examples)
    .join(" · ");
  return (
    <CareEntryScreen
      {...(reason ? { reason } : {})}
      {...(suggestion ? { suggestion } : {})}
      onDismiss={() => router.back()}
      onSave={async (details) => {
        const now = new Date().toISOString();
        await saveCareActivity({
          id: createId(),
          mutationId: createId(),
          plantId: plant.id,
          type,
          occurredAt: details.occurredAt,
          origin,
          amount: details.amount,
          notes: details.notes,
          createdAt: now,
        });
        await reconcilePlantCarePlanReminders(plant);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: ["plant-detail", plant.id],
          }),
          queryClient.invalidateQueries({ queryKey: ["today"] }),
          queryClient.invalidateQueries({ queryKey: ["reminders"] }),
          queryClient.invalidateQueries({ queryKey: ["journal"] }),
        ]);
        router.back();
      }}
      imageUri={imageUri}
      plantName={plant.name}
      speciesTitle={identity.speciesTitle}
      stageId={plant.stageId}
      stageTitle={identity.stageTitle}
      type={type}
      visible
    />
  );
}
