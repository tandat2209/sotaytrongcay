import { useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";
import { z } from "zod";

import {
  CARE_ACTIVITY_VISUALS,
  findLatestCareActivity,
  listCareActivities,
} from "@/features/journal";
import { t } from "@/shared/i18n";
import { getActivePlant } from "@/features/plants";
import { listCarePlans } from "@/features/knowledge";
import {
  createPlantScheduleSnapshot,
  deletePlantScheduleSnapshot,
  ensureReminderNotificationPermission,
  findStageSnapshot,
  getReminderPreferences,
  listPlantScheduleSnapshots,
  listStageScheduleSnapshots,
  reconcilePlantCarePlanReminders,
  resolveCarePlanNotificationPreference,
  resolveCarePlanSchedule,
  savePlantScheduleSnapshot,
  ScheduleSnapshotEditor,
} from "@/features/reminders";
import { Screen } from "@/shared/ui/Screen";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { TopBar } from "@/shared/ui/TopBar";
import { Typography } from "@/shared/ui/Typography";
import { spacing } from "@/shared/ui/theme";
import { LoadingScreen } from "@/shared/ui/LoadingScreen";

export default function PlantScheduleDetailRoute() {
  const { id } = z
    .object({ id: z.string().uuid() })
    .parse(useLocalSearchParams());
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["plant-schedules", id],
    queryFn: async () => {
      const plant = await getActivePlant(id);
      if (!plant) return null;
      const [activities, plantSnapshots, reminderPreferences, stageSnapshots] =
        await Promise.all([
          listCareActivities(id),
          listPlantScheduleSnapshots(id),
          getReminderPreferences(),
          listStageScheduleSnapshots(),
        ]);
      return {
        activities,
        plant,
        plantSnapshots,
        reminderPreferences,
        stageSnapshots,
      };
    },
  });
  if (query.isPending) return <LoadingScreen />;
  if (!query.data)
    return (
      <Typography variant="bodyMedium">{t("plants.error.notFound")}</Typography>
    );

  const {
    activities,
    plant,
    plantSnapshots,
    reminderPreferences,
    stageSnapshots,
  } = query.data;
  const activePlans = listCarePlans({
    speciesId: plant.speciesId,
    stageId: plant.stageId,
  }).filter((plan) => plan.frequency?.[plant.growingMethod] !== undefined);
  const inactive = plantSnapshots.filter(
    (snapshot) =>
      !snapshot.isActive ||
      !activePlans.some((plan) => plan.id === snapshot.carePlanId),
  );

  return (
    <Screen title="">
      <TopBar
        onBack={() => router.back()}
        title={t("settings.plants.titleForPlant", { plant: plant.name })}
      />
      {activePlans.map((plan) => {
        const snapshot =
          plantSnapshots.find(
            (item) => item.carePlanId === plan.id && item.isActive,
          ) ?? null;
        const stageSnapshot = findStageSnapshot(stageSnapshots, plant, plan.id);
        const notificationPreference = resolveCarePlanNotificationPreference({
          plantSnapshot: snapshot,
          stageSnapshot,
        });
        const resolved = resolveCarePlanSchedule({
          defaultNotificationEnabled: reminderPreferences.notificationEnabled,
          evaluatedAt: new Date(),
          latestActivityAt:
            findLatestCareActivity(activities, plant.id, plan.activityType)
              ?.occurredAt ?? null,
          plan,
          plant,
          plantSnapshot: snapshot,
          stageSnapshot,
        });
        if (!resolved) return null;
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
              {snapshot
                ? t("settings.plants.activeCustom")
                : resolved.source === "stage"
                  ? t("settings.plants.sourceStage")
                  : t("settings.plants.sourceCarePlan")}
            </Typography>
            <ScheduleSnapshotEditor
              allowInheritedFrequency={false}
              notificationControlEnabled={
                reminderPreferences.notificationEnabled
              }
              initial={{
                intervalDays: resolved.intervalDays,
                notificationEnabled: notificationPreference.enabled,
                notificationOverridden: notificationPreference.overridden,
                notificationTime: notificationPreference.time,
              }}
              {...(snapshot
                ? {
                    onReset: async () => {
                      await deletePlantScheduleSnapshot(plant.id, plan.id);
                      await reconcilePlantCarePlanReminders(plant);
                      await queryClient.invalidateQueries({
                        queryKey: ["plant-schedules", id],
                      });
                      await queryClient.invalidateQueries({
                        queryKey: ["today"],
                      });
                    },
                  }
                : {})}
              onSave={async (value) => {
                if (value.notificationEnabled) {
                  await ensureReminderNotificationPermission();
                }
                const now = new Date().toISOString();
                const base =
                  snapshot ??
                  createPlantScheduleSnapshot({
                    carePlanId: plan.id,
                    plantId: plant.id,
                    now,
                    resolved,
                  });
                await savePlantScheduleSnapshot({
                  ...base,
                  intervalDays: value.intervalDays ?? resolved.intervalDays,
                  notificationEnabled: value.notificationEnabled,
                  notificationOverridden: value.notificationOverridden,
                  notificationTime: value.notificationTime,
                  updatedAt: now,
                });
                await reconcilePlantCarePlanReminders(plant);
                await queryClient.invalidateQueries({
                  queryKey: ["plant-schedules", id],
                });
                await queryClient.invalidateQueries({ queryKey: ["today"] });
              }}
            />
          </SurfaceCard>
        );
      })}
      <InactiveScheduleSnapshots snapshots={inactive} />
    </Screen>
  );
}

function InactiveScheduleSnapshots({
  snapshots,
}: Readonly<{
  snapshots: readonly Readonly<{ carePlanId: string; id: string }>[];
}>) {
  if (snapshots.length === 0) return null;
  return (
    <>
      <Typography variant="headlineSmall">
        {t("settings.plants.otherStage")}
      </Typography>
      {snapshots.map((snapshot) => (
        <SurfaceCard key={snapshot.id}>
          <Typography variant="bodyLarge">{snapshot.carePlanId}</Typography>
          <Typography color="textSecondary" variant="bodyMedium">
            {t("settings.plants.inactive")}
          </Typography>
        </SurfaceCard>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  titleRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },
});
