import { useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";
import { z } from "zod";

import {
  CARE_ACTIVITY_VISUALS,
  findLatestCareActivity,
  listCareActivities,
} from "@/features/journal";
import { getPlant } from "@/features/plants";
import { listCarePlans } from "@/features/knowledge";
import {
  createPlantScheduleSnapshot,
  deletePlantScheduleSnapshot,
  findStageSnapshot,
  listPlantScheduleSnapshots,
  listStageScheduleSnapshots,
  reconcilePlantCarePlanReminders,
  resolveCarePlanSchedule,
  savePlantScheduleSnapshot,
  ScheduleSnapshotEditor,
} from "@/features/reminders";
import { Screen } from "@/shared/ui/Screen";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { TopBar } from "@/shared/ui/TopBar";
import { Typography } from "@/shared/ui/Typography";
import { spacing } from "@/shared/ui/theme";

export default function PlantScheduleDetailRoute() {
  const { id } = z
    .object({ id: z.string().uuid() })
    .parse(useLocalSearchParams());
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["plant-schedules", id],
    queryFn: async () => {
      const plant = await getPlant(id);
      if (!plant) return null;
      const [activities, plantSnapshots, stageSnapshots] = await Promise.all([
        listCareActivities(id),
        listPlantScheduleSnapshots(id),
        listStageScheduleSnapshots(),
      ]);
      return { activities, plant, plantSnapshots, stageSnapshots };
    },
  });
  if (query.isPending)
    return <Typography variant="bodyMedium">Đang tải cây trồng…</Typography>;
  if (!query.data)
    return (
      <Typography variant="bodyMedium">Không tìm thấy cây trồng.</Typography>
    );

  const { activities, plant, plantSnapshots, stageSnapshots } = query.data;
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
        title={`Tùy chỉnh · ${plant.name}`}
      />
      {activePlans.map((plan) => {
        const snapshot =
          plantSnapshots.find(
            (item) => item.carePlanId === plan.id && item.isActive,
          ) ?? null;
        const resolved = resolveCarePlanSchedule({
          evaluatedAt: new Date(),
          latestActivityAt:
            findLatestCareActivity(activities, plant.id, plan.activityType)
              ?.occurredAt ?? null,
          plan,
          plant,
          plantSnapshot: snapshot,
          stageSnapshot: findStageSnapshot(stageSnapshots, plant, plan.id),
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
                ? "Đang dùng tùy chỉnh theo cây."
                : `Đang dùng cài đặt theo ${resolved.source === "stage" ? "giai đoạn" : "kế hoạch chăm sóc"}.`}
            </Typography>
            <ScheduleSnapshotEditor
              allowInheritedFrequency={false}
              initial={{
                intervalDays: resolved.intervalDays,
                notificationEnabled: resolved.notificationEnabled,
                notificationTime: resolved.notificationTime,
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
      {inactive.length > 0 ? (
        <>
          <Typography variant="headlineSmall">Giai đoạn khác</Typography>
          {inactive.map((snapshot) => (
            <SurfaceCard key={snapshot.id}>
              <Typography variant="bodyLarge">{snapshot.carePlanId}</Typography>
              <Typography color="textSecondary" variant="bodyMedium">
                Tùy chỉnh được giữ lại và sẽ hoạt động khi kế hoạch này áp dụng
                lại.
              </Typography>
            </SurfaceCard>
          ))}
        </>
      ) : null}
    </Screen>
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
