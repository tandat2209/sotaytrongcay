import { router, useLocalSearchParams } from "expo-router";
import { Text } from "react-native";
import { z } from "zod";
import {
  getCareGuideForStage,
  getCareRecommendationsForStage,
  getNextStagePlaybook,
  getStagePlaybook,
} from "@/features/knowledge/preview-knowledge";
import { getPlant } from "@/features/plants";
import { StagePlaybookScreen } from "@/features/plants/ui/StagePlaybookScreen";
import { useQuery } from "@tanstack/react-query";

export default function StagePlaybookRoute() {
  const { id } = z.object({ id: z.string().uuid() }).parse(useLocalSearchParams());

  const query = useQuery({
    queryKey: ["plant", id],
    queryFn: () => getPlant(id),
  });

  if (query.isPending) return <Text>Đang tải…</Text>;
  if (query.isError || !query.data) return <Text>Không tìm thấy cây trồng.</Text>;

  const plant = query.data;
  const playbook = getStagePlaybook(plant.stageId);

  if (!playbook) {
    return <Text>Chưa có hướng dẫn cho giai đoạn này.</Text>;
  }

  const careGuide = getCareGuideForStage(plant.stageId);
  const careRecommendations = getCareRecommendationsForStage(plant.stageId);
  const nextStage = getNextStagePlaybook(plant.stageId);

  return (
    <StagePlaybookScreen
      careGuide={careGuide}
      careRecommendations={careRecommendations}
      nextStage={nextStage}
      onBack={() => router.back()}
      {...(nextStage ? { onOpenNextStage: () => router.replace({ pathname: "/plants/[id]/guide", params: { id } }) } : {})}
      plant={plant}
      playbook={playbook}
    />
  );
}
