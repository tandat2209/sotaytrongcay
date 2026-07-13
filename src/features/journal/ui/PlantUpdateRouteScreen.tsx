import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Text } from "react-native";
import { z } from "zod";
import { getPreviewPlantKnowledge } from "@/features/knowledge";
import { getPlant, resolvePlantIdentity } from "@/features/plants";
import { createId } from "@/shared/lib/identifiers";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { savePlantUpdateWithPhotos } from "../application/save-plant-update";
import { PlantUpdateScreen, type PlantUpdateDraft } from "./PlantUpdateScreen";

type Props = Readonly<{ onBack: () => void; onSaved: () => void; plantId: string }>;

export function PlantUpdateRouteScreen({ onBack, onSaved, plantId }: Props) {
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ["plant", plantId], queryFn: () => getPlant(plantId) });
  if (query.isPending) return <Text>Đang tải dữ liệu trên thiết bị…</Text>;
  if (query.isError) return <><Text>{query.error instanceof z.ZodError ? "Dữ liệu trên thiết bị chưa hợp lệ." : "Chưa thể tải cây."}</Text><PrimaryButton label="Thử lại" onPress={() => void query.refetch()} /></>;
  if (!query.data) return <><Text>Không tìm thấy cây trồng.</Text><PrimaryButton label="Quay lại Cây trồng" onPress={onBack} /></>;

  const plant = query.data;
  const identity = resolvePlantIdentity(plant);
  const knowledge = getPreviewPlantKnowledge(plant.speciesId);
  const stages = knowledge?.stages ?? [{ id: plant.stageId, title: identity.stageTitle }];

  async function save(draft: PlantUpdateDraft) {
    const createdAt = new Date().toISOString();
    await savePlantUpdateWithPhotos({
      id: createId(), mutationId: createId(), plantId, occurredAt: draft.occurredAt, notes: draft.notes, stageId: draft.stageId, createdAt,
      stageHistoryId: createId(),
      photos: draft.photos.map((photo, position) => ({ id: createId(), sourceUri: photo.uri, fileName: photo.fileName, position, createdAt })),
    });
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["plant", plantId] }),
      queryClient.invalidateQueries({ queryKey: ["plant-detail", plantId] }),
      queryClient.invalidateQueries({ queryKey: ["plants"] }),
      queryClient.invalidateQueries({ queryKey: ["today"] }),
      queryClient.invalidateQueries({ queryKey: ["journal"] }),
    ]);
    onSaved();
  }

  return <PlantUpdateScreen initialStageId={plant.stageId} onBack={onBack} onSave={save} plantName={plant.name} speciesTitle={identity.speciesTitle} stages={stages} />;
}
