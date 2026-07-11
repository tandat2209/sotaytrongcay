import { Pressable, StyleSheet, Text, View } from "react-native";
import { CareActivity } from "@/features/journal/models/care-activity";
import { getPreviewPlantKnowledge } from "@/features/knowledge/preview-knowledge";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { Screen } from "@/shared/ui/Screen";
import { colors, radius, spacing } from "@/shared/ui/theme";
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
    <Screen introduction={`Giai đoạn hiện tại: ${stage?.title ?? "Chưa xác định"}`} title={plant.name}>
      {onBack ? (
        <Pressable
          accessibilityLabel="Quay lại Cây trồng"
          accessibilityRole="button"
          onPress={onBack}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>‹ Cây trồng</Text>
        </Pressable>
      ) : null}
      <View style={styles.section}>
        <Text style={styles.heading}>Chăm sóc gần đây</Text>
        <Pressable disabled={!watering} onPress={() => watering && onOpenActivity(watering.id)} style={styles.card}>
          <Text style={styles.label}>Tưới nước</Text>
          <Text style={styles.value}>{watering ? formatWatering(watering) : "Chưa có dữ liệu"}</Text>
        </Pressable>
        <PrimaryButton label="Ghi tưới nước" onPress={onWater} />
      </View>
      <View style={styles.section}>
        <Text style={styles.heading}>Mẹo cho giai đoạn này</Text>
        <Text style={styles.supporting}>Nội dung giai đoạn đang chờ duyệt nên chưa được hiển thị như hướng dẫn chăm sóc.</Text>
      </View>
    </Screen>
  );
}

function formatWatering(activity: CareActivity): string {
  if (!activity.amount) return new Date(activity.occurredAt).toLocaleString("vi-VN");
  return `${activity.amount.value.toLocaleString("vi-VN")} lít`;
}

const styles = StyleSheet.create({
  backButton: { alignSelf: "flex-start", minHeight: 44, justifyContent: "center" },
  backButtonText: { color: colors.primary, fontSize: 16, fontWeight: "600" },
  section: { gap: spacing.md }, heading: { color: colors.text, fontSize: 18, fontWeight: "600" },
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.card, borderWidth: StyleSheet.hairlineWidth, gap: spacing.xs, minHeight: 72, padding: spacing.md },
  label: { color: colors.text, fontSize: 16, fontWeight: "600" }, value: { color: colors.textSecondary, fontSize: 14 }, supporting: { color: colors.textSecondary, fontSize: 14, lineHeight: 20 },
});
