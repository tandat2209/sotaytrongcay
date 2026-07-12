import { useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { Text } from "react-native";
import { z } from "zod";
import { CareEntryScreen, saveCareActivity, type CareActivityType } from "@/features/journal";
import { getPlant } from "@/features/plants";
import { createId } from "@/shared/lib/identifiers";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";

const CareRouteSchema = z.object({ id: z.string().uuid(), type: z.enum(["watering", "fertilizing", "spraying"]), origin: z.enum(["today", "manual"]).optional() });

export default function CareEntryRoute() {
  const { id, origin = "manual", type } = CareRouteSchema.parse(useLocalSearchParams());
  const plantQuery = useQuery({ queryKey: ["plant", id], queryFn: () => getPlant(id) });
  if (plantQuery.isPending) return <Text>Đang tải dữ liệu trên thiết bị…</Text>;
  if (plantQuery.isError) return <><Text>Chưa thể tải cây.</Text><PrimaryButton label="Thử lại" onPress={() => void plantQuery.refetch()} /></>;
  if (!plantQuery.data) return <><Text>Không tìm thấy cây trồng.</Text><PrimaryButton label="Quay lại Cây trồng" onPress={() => router.replace("/plants")} /></>;
  return <CareEntry origin={origin} plantId={id} plantName={plantQuery.data.name} type={type} />;
}

function CareEntry({ origin, plantId, plantName, type }: Readonly<{ origin: "today" | "manual"; plantId: string; plantName: string; type: CareActivityType }>) {
  const queryClient = useQueryClient();
  return <CareEntryScreen onBack={() => router.back()} onSave={async (details) => {
    const now = new Date().toISOString();
    await saveCareActivity({ id: createId(), mutationId: createId(), plantId, type, occurredAt: now, origin, amount: details.amount, notes: details.notes, createdAt: now });
    await Promise.all([queryClient.invalidateQueries({ queryKey: ["plant-detail", plantId] }), queryClient.invalidateQueries({ queryKey: ["today"] }), queryClient.invalidateQueries({ queryKey: ["journal"] })]);
    router.back();
  }} plantName={plantName} type={type} />;
}
