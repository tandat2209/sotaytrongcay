import { router, useLocalSearchParams } from "expo-router";
import { Text } from "react-native";
import { z } from "zod";
import {
  getNextStagePlaybook,
  getStagePlaybook,
  listCarePlans,
  listInformationalGuidesForStage,
  listThreatsForStage,
} from "@/features/knowledge/preview-knowledge";
import { t } from "@/shared/i18n";
import { getActivePlant } from "@/features/plants";
import { StagePlaybookScreen } from "@/features/plants/ui/StagePlaybookScreen";
import { useQuery } from "@tanstack/react-query";
import { LoadingScreen } from "@/shared/ui/LoadingScreen";

const paramsSchema = z.object({
  id: z.string().uuid(),
  // stageId is optional — falls back to the plant's current stage
  stageId: z.string().optional(),
});

export default function StagePlaybookRoute() {
  const { id, stageId: stageIdParam } = paramsSchema.parse(
    useLocalSearchParams(),
  );

  const query = useQuery({
    queryKey: ["plant", id],
    queryFn: () => getActivePlant(id),
  });

  if (query.isPending) return <LoadingScreen />;
  if (query.isError || !query.data)
    return <Text>{t("plants.error.notFound")}</Text>;

  const plant = query.data;
  // Use the explicit stageId param when browsing to a different stage,
  // otherwise default to the plant's current stage.
  const stageId = stageIdParam ?? plant.stageId;
  const playbook = getStagePlaybook(stageId);

  if (!playbook) {
    return <Text>{t("plants.guide.missing")}</Text>;
  }

  const carePlans = listCarePlans({ speciesId: plant.speciesId, stageId });
  const informationalGuides = listInformationalGuidesForStage(stageId);
  const threats = listThreatsForStage({ speciesId: plant.speciesId, stageId });
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
              router.push({
                pathname: "/plants/[id]/guide",
                params: { id, stageId: nextStage.id },
              }),
          }
        : {})}
      playbook={playbook}
      threats={threats}
    />
  );
}
