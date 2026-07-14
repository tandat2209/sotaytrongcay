import { router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import { listAllCarePlanStages, StageIcon } from "@/features/knowledge";
import { Screen } from "@/shared/ui/Screen";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { TopBar } from "@/shared/ui/TopBar";
import { Typography } from "@/shared/ui/Typography";
import { colors, spacing } from "@/shared/ui/theme";

export default function StageCarePlansRoute() {
  const stages = listAllCarePlanStages();
  return (
    <Screen title="">
      <TopBar onBack={() => router.back()} title="Kế hoạch theo giai đoạn" />
      <Typography color="textSecondary" variant="bodyMedium">
        Tùy chỉnh lịch nhắc cho tất cả cây dùng cùng kế hoạch chăm sóc.
      </Typography>
      <View style={styles.list}>
        {stages.map((stage) => (
          <Pressable
            accessibilityLabel={`Mở kế hoạch giai đoạn ${stage.title}`}
            accessibilityRole="button"
            key={stage.id}
            onPress={() =>
              router.push({
                pathname: "/settings/care-plans/[stageId]",
                params: { stageId: stage.id },
              })
            }
          >
            <SurfaceCard style={styles.row}>
              <StageIcon color={colors.primary} size={22} stageId={stage.id} />
              <Typography style={styles.fill} variant="bodyLarge">
                {stage.title}
              </Typography>
              <Typography color="primary" variant="bodyMedium">
                Xem
              </Typography>
            </SurfaceCard>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  list: { gap: spacing.sm },
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 52,
  },
});
