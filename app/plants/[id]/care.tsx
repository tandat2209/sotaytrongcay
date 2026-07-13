import { useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { Text } from "react-native";
import { z } from "zod";
import { CareEntryScreen, saveCareActivity, type CareActivityType } from "@/features/journal";
import { getStagePlaybook, listCarePlans } from "@/features/knowledge";
import { getPlant, resolvePlantIdentity, type Plant } from "@/features/plants";
import { createId } from "@/shared/lib/identifiers";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";

const CareRouteSchema = z.object({ id: z.string().uuid(), type: z.enum(["watering", "fertilizing", "spraying"]), origin: z.enum(["today", "manual"]).optional() });

export default function CareEntryRoute() {
  const { id, origin = "manual", type } = CareRouteSchema.parse(useLocalSearchParams());
  const plantQuery = useQuery({ queryKey: ["plant", id], queryFn: () => getPlant(id) });
  if (plantQuery.isPending) return <Text>Đang tải dữ liệu trên thiết bị…</Text>;
  if (plantQuery.isError) return <><Text>Chưa thể tải cây.</Text><PrimaryButton label="Thử lại" onPress={() => void plantQuery.refetch()} /></>;
  if (!plantQuery.data) return <><Text>Không tìm thấy cây trồng.</Text><PrimaryButton label="Quay lại Cây trồng" onPress={() => router.replace("/plants")} /></>;
  return <CareEntry origin={origin} plant={plantQuery.data} type={type} />;
}

function CareEntry({ origin, plant, type }: Readonly<{ origin: "today" | "manual"; plant: Plant; type: CareActivityType }>) {
  const queryClient = useQueryClient();
  const identity = resolvePlantIdentity(plant);
  const plan = listCarePlans({ speciesId: plant.speciesId, stageId: plant.stageId }).find((candidate) => candidate.activityType === type);
  const reason = getStagePlaybook(plant.stageId)?.primaryObjective;
  const suggestion = plan?.recommendedInputs?.map((input) => input.examples).join(" · ");
  return <CareEntryScreen {...(reason ? { reason } : {})} {...(suggestion ? { suggestion } : {})} onDismiss={() => router.back()} onSave={async (details) => {
    const now = new Date().toISOString();
    await saveCareActivity({ id: createId(), mutationId: createId(), plantId: plant.id, type, occurredAt: details.occurredAt, origin, amount: details.amount, notes: details.notes, createdAt: now });
    await Promise.all([queryClient.invalidateQueries({ queryKey: ["plant-detail", plant.id] }), queryClient.invalidateQueries({ queryKey: ["today"] }), queryClient.invalidateQueries({ queryKey: ["journal"] })]);
    router.back();
  }} plantName={plant.name} speciesTitle={identity.speciesTitle} stageId={plant.stageId} stageTitle={identity.stageTitle} type={type} visible />;
}
