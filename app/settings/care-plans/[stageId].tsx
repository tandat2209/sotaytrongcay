import { useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { z } from "zod";

import {
  getCarePlansForStage,
  getNextStagePlaybook,
  getStagePlaybook,
  listInformationalGuidesForStage,
  listThreatsForStageId,
} from "@/features/knowledge/preview-knowledge";
import { StagePlaybookScreen } from "@/features/plants/ui/StagePlaybookScreen";
import {
  deleteStageScheduleSnapshot,
  listStageScheduleSnapshots,
  reconcilePlantsForStage,
  saveStageScheduleSnapshot,
  StageScheduleSnapshotEditor,
} from "@/features/reminders";
import { createId } from "@/shared/lib/identifiers";
import { t } from "@/shared/i18n";
import { Typography } from "@/shared/ui/Typography";
import { spacing } from "@/shared/ui/theme";

const paramsSchema = z.object({ stageId: z.string().min(1) });

export default function StageCarePlanDetailRoute() {
  const { stageId } = paramsSchema.parse(useLocalSearchParams());
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["stage-schedule-snapshots"],
    queryFn: listStageScheduleSnapshots,
  });
  const playbook = getStagePlaybook(stageId);

  if (!playbook) return <Text>{t("plants.guide.missing")}</Text>;

  const carePlans = getCarePlansForStage(stageId);
  const nextStage = getNextStagePlaybook(stageId);
  return (
    <StagePlaybookScreen
      carePlans={carePlans}
      carePlansEmptyMessage={
        <Typography color="textSecondary" variant="bodyMedium">
          {t("settings.carePlans.empty")}
        </Typography>
      }
      informationalGuides={listInformationalGuidesForStage(stageId)}
      nextStage={nextStage}
      onBack={() => router.back()}
      {...(nextStage
        ? {
            onOpenNextStage: () =>
              router.push({
                pathname: "/settings/care-plans/[stageId]",
                params: { stageId: nextStage.id },
              }),
          }
        : {})}
      playbook={playbook}
      renderCarePlanSchedule={(plan) => {
        if (!plan.frequency) {
          return (
            <Typography color="textSecondary" variant="bodyMedium">
              {t("plants.care.frequencyMissing")}
            </Typography>
          );
        }
        const snapshot = query.data?.find(
          (item) => item.stageId === stageId && item.carePlanId === plan.id,
        );
        return (
          <View style={styles.schedule}>
            <StageScheduleSnapshotEditor
              initial={{
                groundIntervalDays:
                  snapshot?.groundFrequencyOverrideDays ??
                  plan.frequency.ground.intervalDays,
                containerIntervalDays:
                  snapshot?.containerFrequencyOverrideDays ??
                  plan.frequency.container.intervalDays,
                notificationEnabled: snapshot?.notificationEnabled ?? false,
                notificationTime: snapshot?.notificationTime ?? null,
              }}
              {...(snapshot
                ? {
                    onReset: async () => {
                      await deleteStageScheduleSnapshot(stageId, plan.id);
                      await refreshStageSchedules(queryClient, stageId);
                    },
                  }
                : {})}
              onSave={async (value) => {
                const now = new Date().toISOString();
                await saveStageScheduleSnapshot({
                  id: snapshot?.id ?? createId(),
                  mutationId: createId(),
                  stageId,
                  carePlanId: plan.id,
                  groundFrequencyOverrideDays: value.groundIntervalDays,
                  containerFrequencyOverrideDays: value.containerIntervalDays,
                  notificationEnabled: value.notificationEnabled,
                  notificationTime: value.notificationTime,
                  createdAt: snapshot?.createdAt ?? now,
                  updatedAt: now,
                });
                await refreshStageSchedules(queryClient, stageId);
              }}
              resetValues={{
                groundIntervalDays: plan.frequency.ground.intervalDays,
                containerIntervalDays: plan.frequency.container.intervalDays,
                notificationEnabled: false,
                notificationTime: null,
              }}
            />
          </View>
        );
      }}
      screenTitle={t("settings.carePlans.title")}
      threats={listThreatsForStageId(stageId)}
    />
  );
}

async function refreshStageSchedules(
  queryClient: ReturnType<typeof useQueryClient>,
  stageId: string,
) {
  await reconcilePlantsForStage(stageId);
  await queryClient.invalidateQueries({
    queryKey: ["stage-schedule-snapshots"],
  });
  await queryClient.invalidateQueries({ queryKey: ["today"] });
}

const styles = StyleSheet.create({
  schedule: { gap: spacing.sm },
});
