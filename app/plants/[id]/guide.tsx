import { router, useLocalSearchParams } from "expo-router";
import { Text } from "react-native";
import { z } from "zod";
import {
  getNextStagePlaybook,
  getStagePlaybook,
  listCarePlans,
  listInformationalGuidesForStage,
} from "@/features/knowledge/preview-knowledge";
import { getPlant } from "@/features/plants";
import { StagePlaybookScreen } from "@/features/plants/ui/StagePlaybookScreen";
import { useQuery } from "@tanstack/react-query";

const paramsSchema = z.object({
  id: z.string().uuid(),
  // stageId is optional — falls back to the plant's current stage
  stageId: z.string().optional(),
});

export default function StagePlaybookRoute() {
  const { id, stageId: stageIdParam } = paramsSchema.parse(useLocalSearchParams());

  const query = useQuery({
    queryKey: ["plant", id],
    queryFn: () => getPlant(id),
  });

  if (query.isPending) return <Text>Đang tải…</Text>;
  if (query.isError || !query.data) return <Text>Không tìm thấy cây trồng.</Text>;

  const plant = query.data;
  // Use the explicit stageId param when browsing to a different stage,
  // otherwise default to the plant's current stage.
  const stageId = stageIdParam ?? plant.stageId;
  const playbook = getStagePlaybook(stageId);

  if (!playbook) {
    return <Text>Chưa có hướng dẫn cho giai đoạn này.</Text>;
  }

  const carePlans = listCarePlans({ speciesId: plant.speciesId, stageId });
  const informationalGuides = listInformationalGuidesForStage(stageId);
  const nextStage = getNextStagePlaybook(stageId);

  return (
    <StagePlaybookScreen
      carePlans={carePlans}
      informationalGuides={informationalGuides}
      nextStage={nextStage}
      onBack={() => router.back()}
      {...(nextStage
        ? {
            onOpenNextStage: () =>
              router.push({ pathname: "/plants/[id]/guide", params: { id, stageId: nextStage.id } }),
          }
        : {})}
      playbook={playbook}
    />
  );
}
