import { useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";
import { z } from "zod";

import { t } from "@/shared/i18n";
import { CARE_ACTIVITY_VISUALS } from "@/features/journal";
import { getCarePlansForStage, getStagePlaybook } from "@/features/knowledge";
import {
  deleteStageScheduleSnapshot,
  listStageScheduleSnapshots,
  reconcilePlantsForStage,
  saveStageScheduleSnapshot,
  StageScheduleSnapshotEditor,
} from "@/features/reminders";
import { createId } from "@/shared/lib/identifiers";
import { Screen } from "@/shared/ui/Screen";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { TopBar } from "@/shared/ui/TopBar";
import { Typography } from "@/shared/ui/Typography";
import { spacing } from "@/shared/ui/theme";

export default function StageCarePlanDetailRoute() {
  const { stageId } = z
    .object({ stageId: z.string().min(1) })
    .parse(useLocalSearchParams());
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["stage-schedule-snapshots"],
    queryFn: listStageScheduleSnapshots,
  });
  const plans = getCarePlansForStage(stageId);
  const title = getStagePlaybook(stageId)?.title ?? t("common.fallback.stage");

  return (
    <Screen title="">
      <TopBar onBack={() => router.back()} title={title} />
      {plans.length === 0 ? (
        <Typography color="textSecondary" variant="bodyMedium">
          {t("settings.carePlans.empty")}
        </Typography>
      ) : null}
      {plans.map((plan) => {
        const snapshot = query.data?.find(
          (item) => item.stageId === stageId && item.carePlanId === plan.id,
        );
        const visual = CARE_ACTIVITY_VISUALS[plan.activityType];
        const Icon = visual.icon;
        return (
          <SurfaceCard key={plan.id}>
            <View style={styles.titleRow}>
              <Icon color={visual.color} size={22} />
              <Typography style={styles.fill} variant="headlineSmall">
                {plan.title}
              </Typography>
            </View>
            <Typography color="textSecondary" variant="bodyMedium">
              {plan.goal}
            </Typography>
            {plan.frequency ? (
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
              />
            ) : (
              <Typography color="textSecondary" variant="bodyMedium">
                {t("plants.care.frequencyMissing")}
              </Typography>
            )}
          </SurfaceCard>
        );
      })}
    </Screen>
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
  fill: { flex: 1 },
  titleRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },
});
