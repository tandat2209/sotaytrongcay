import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, View } from "react-native";
import { CARE_ACTIVITY_LABELS, CARE_ACTIVITY_VISUALS } from "@/features/journal";
import type { CareEvaluationStatus } from "@/features/guidance/models/care-evaluation";
import { IconButton } from "@/shared/ui/IconButton";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";
import type { PlantDetailCareCard as CareCardModel } from "../models/plant-detail-projection";

type Props = Readonly<{
  card: CareCardModel;
  onOpenActivity: (id: string) => void;
  onOpenDetails: (card: CareCardModel) => void;
}>;

export function PlantDetailCareCard({ card, onOpenActivity, onOpenDetails }: Props) {
  const label = CARE_ACTIVITY_LABELS[card.activityType];
  const visual = CARE_ACTIVITY_VISUALS[card.activityType];
  const status = statusContent(card.evaluation?.status);

  return (
    <SurfaceCard style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.icon, { backgroundColor: visual.backgroundColor }]}><Ionicons color={visual.color} name={visual.icon} size={30} /></View>
        {card.details ? <IconButton accessibilityLabel={`Xem khuyến nghị ${label.toLowerCase()}`} icon="information-circle-outline" onPress={() => onOpenDetails(card)} /> : null}
      </View>
      <View style={styles.copy}>
        <Typography variant="headlineMedium">{label}</Typography>
        <View style={styles.chip}>
          <Ionicons color={colors.primary} name="calendar-outline" size={15} />
          <Typography color="primary" variant="label">{card.frequencyDisplay ?? "Chưa có tần suất đã duyệt"}</Typography>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.information}>
        <Pressable
          accessibilityLabel={card.lastActivity ? `Xem lần ${label.toLowerCase()} gần nhất` : undefined}
          accessibilityRole={card.lastActivity ? "button" : undefined}
          disabled={!card.lastActivity}
          onPress={() => card.lastActivity && onOpenActivity(card.lastActivity.id)}
          style={styles.latest}
        >
          <Typography color="textSecondary" variant="bodyMedium">Lần gần nhất</Typography>
          <Typography variant="bodyLarge">{card.lastActivity ? formatRelativeActivity(card.lastActivity.occurredAt) : "Chưa có dữ liệu"}</Typography>
        </Pressable>
        <View style={[styles.status, { backgroundColor: status.backgroundColor }]}>
          <Ionicons color={status.color} name={status.icon} size={16} />
          <Typography color={status.textColor} variant="label">{status.label}</Typography>
        </View>
      </View>
    </SurfaceCard>
  );
}

function statusContent(status: CareEvaluationStatus | undefined) {
  if (status === "recommended") return { backgroundColor: "#FCE8E6", color: colors.error, icon: "alert-circle" as const, label: "Nên xem xét", textColor: "error" as const };
  if (status === "not_recommended") return { backgroundColor: colors.primarySoft, color: colors.primary, icon: "checkmark-circle" as const, label: "Chưa cần", textColor: "primary" as const };
  return { backgroundColor: colors.surfaceSubtle, color: colors.textSecondary, icon: "help-circle" as const, label: "Chưa có gợi ý", textColor: "textSecondary" as const };
}

function formatRelativeActivity(occurredAt: string): string {
  const elapsedDays = Math.max(0, Math.floor((Date.now() - new Date(occurredAt).getTime()) / 86_400_000));
  if (elapsedDays === 0) return "Hôm nay";
  return `${elapsedDays} ngày trước`;
}

const styles = StyleSheet.create({
  card: { gap: spacing.md, padding: spacing.lg },
  chip: { alignItems: "center", alignSelf: "flex-start", backgroundColor: colors.primarySoft, borderRadius: radius.chip, flexDirection: "row", gap: spacing.xs, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
  copy: { gap: spacing.sm },
  divider: { backgroundColor: colors.border, height: StyleSheet.hairlineWidth },
  header: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  icon: { alignItems: "center", backgroundColor: colors.primarySoft, borderRadius: radius.round, height: 60, justifyContent: "center", width: 60 },
  information: { alignItems: "center", flexDirection: "row", gap: spacing.md, justifyContent: "space-between" },
  latest: { flex: 1, gap: spacing.xs },
  status: { alignItems: "center", borderRadius: radius.round, flexDirection: "row", gap: spacing.xs, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
});
