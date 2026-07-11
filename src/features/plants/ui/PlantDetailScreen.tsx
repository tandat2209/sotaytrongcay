import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, View } from "react-native";
import { CareActivity } from "@/features/journal/models/care-activity";
import { getPreviewPlantKnowledge } from "@/features/knowledge/preview-knowledge";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { Screen } from "@/shared/ui/Screen";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { TopBar } from "@/shared/ui/TopBar";
import { Typography } from "@/shared/ui/Typography";
import { colors, spacing } from "@/shared/ui/theme";
import { Plant } from "../models/plant";

type Props = {
  activities: CareActivity[];
  onBack?: () => void;
  onOpenActivity: (id: string) => void;
  onWater: () => void;
  plant: Plant;
};

export function PlantDetailScreen({ activities, onBack, onOpenActivity, onWater, plant }: Props) {
  const stage = getPreviewPlantKnowledge().stages.find((item) => item.id === plant.stageId);
  const watering = activities.find((item) => item.type === "watering");
  return (
    <Screen introduction={null} title="">
      {onBack ? <TopBar backAccessibilityLabel="Quay lại Cây trồng" onBack={onBack} title={plant.name} /> : null}
      <SurfaceCard style={styles.stageCard}>
        <View style={styles.stageEyebrow}>
          <Ionicons color={colors.secondary} name="leaf-outline" size={18} />
          <Typography color="secondary" variant="label">GIAI ĐOẠN HIỆN TẠI</Typography>
        </View>
        <Typography variant="headlineMedium">{stage?.title ?? "Chưa xác định"}</Typography>
        <Typography color="textSecondary" variant="bodyMedium">Theo dõi chăm sóc quan trọng và ghi lại khi bạn đã thực hiện.</Typography>
      </SurfaceCard>
      <View style={styles.section}>
        <Typography variant="headlineSmall">Chăm sóc gần đây</Typography>
        <Pressable accessibilityLabel="Xem lần tưới nước gần nhất" accessibilityRole="button" disabled={!watering} onPress={() => watering && onOpenActivity(watering.id)}>
          <SurfaceCard style={styles.careCard}>
            <View style={styles.careIcon}><Ionicons color={colors.primary} name="water-outline" size={21} /></View>
            <View style={styles.careCopy}>
              <Typography variant="bodyLarge">Tưới nước</Typography>
              <Typography color="textSecondary" variant="bodyMedium">{watering ? formatWatering(watering) : "Chưa có dữ liệu"}</Typography>
            </View>
            <Ionicons color={colors.textSecondary} name="chevron-forward" size={20} />
          </SurfaceCard>
        </Pressable>
        <PrimaryButton label="Ghi tưới nước" onPress={onWater} />
      </View>
      <View style={styles.section}>
        <Typography variant="headlineSmall">Mẹo cho giai đoạn này</Typography>
        <Typography color="textSecondary" variant="bodyMedium">Nội dung giai đoạn đang chờ duyệt nên chưa được hiển thị như hướng dẫn chăm sóc.</Typography>
      </View>
    </Screen>
  );
}

function formatWatering(activity: CareActivity): string {
  if (!activity.amount) return new Date(activity.occurredAt).toLocaleString("vi-VN");
  return `${activity.amount.value.toLocaleString("vi-VN")} lít`;
}

const styles = StyleSheet.create({
  careCard: { alignItems: "center", flexDirection: "row", gap: spacing.md, minHeight: 76 },
  careCopy: { flex: 1, gap: spacing.xs },
  careIcon: { alignItems: "center", backgroundColor: colors.primarySoft, borderRadius: 22, height: 44, justifyContent: "center", width: 44 },
  section: { gap: spacing.md },
  stageCard: { backgroundColor: colors.surfaceSubtle, borderColor: colors.primary, gap: spacing.sm },
  stageEyebrow: { alignItems: "center", flexDirection: "row", gap: spacing.sm },
});
