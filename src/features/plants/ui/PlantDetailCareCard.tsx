import {
  CalendarDays,
  CheckCircle,
  CircleAlert,
  CircleHelp,
  Info,
} from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";
import {
  CARE_ACTIVITY_LABELS,
  CARE_ACTIVITY_VISUALS,
} from "@/features/journal";
import type { CareEvaluationStatus } from "@/features/guidance/models/care-evaluation";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";
import type { PlantDetailCareCard as CareCardModel } from "../models/plant-detail-projection";

type Props = Readonly<{
  card: CareCardModel;
  onOpenActivity: (id: string) => void;
  onOpenDetails: (card: CareCardModel) => void;
}>;

export function PlantDetailCareCard({
  card,
  onOpenActivity,
  onOpenDetails,
}: Props) {
  const label = CARE_ACTIVITY_LABELS[card.activityType];
  const visual = CARE_ACTIVITY_VISUALS[card.activityType];
  const status = statusContent(card.evaluation?.status);
  const ActivityIcon = visual.icon;
  const StatusIcon = status.icon;

  return (
    <SurfaceCard style={styles.card}>
      <View style={styles.header}>
        <View style={styles.title}>
          <View
            style={[styles.icon, { backgroundColor: visual.backgroundColor }]}
          >
            <ActivityIcon color={visual.color} size={20} />
          </View>
          <Typography variant="headlineMedium">{label}</Typography>
        </View>
        {card.details ? (
          <Pressable
            accessibilityLabel={`Xem khuyến nghị ${label.toLowerCase()}`}
            accessibilityRole="button"
            hitSlop={6}
            onPress={() => onOpenDetails(card)}
            style={({ pressed }) => [
              styles.infoAction,
              pressed && styles.infoActionPressed,
            ]}
          >
            <Info color={colors.textSecondary} size={20} />
          </Pressable>
        ) : null}
      </View>
      <View style={styles.frequency}>
        <CalendarDays color={colors.textSecondary} size={15} />
        <Typography color="textSecondary" variant="bodyMedium">
          {card.frequencyDisplay ?? "Chưa có tần suất đã duyệt"}
        </Typography>
      </View>
      <View style={styles.information}>
        <Pressable
          accessibilityLabel={
            card.lastActivity
              ? `Xem lần ${label.toLowerCase()} gần nhất`
              : undefined
          }
          accessibilityRole={card.lastActivity ? "button" : undefined}
          disabled={!card.lastActivity}
          onPress={() =>
            card.lastActivity && onOpenActivity(card.lastActivity.id)
          }
          style={styles.latest}
        >
          <Typography variant="bodyLarge">
            {card.lastActivity
              ? formatRelativeActivity(card.lastActivity.occurredAt)
              : "Chưa có dữ liệu"}
          </Typography>
        </Pressable>
        <View
          style={[styles.status, { backgroundColor: status.backgroundColor }]}
        >
          <StatusIcon color={status.color} size={16} />
          <Typography color={status.textColor} variant="label">
            {status.label}
          </Typography>
        </View>
      </View>
    </SurfaceCard>
  );
}

function statusContent(status: CareEvaluationStatus | undefined) {
  if (status === "recommended")
    return {
      backgroundColor: "#FCE8E6",
      color: colors.error,
      icon: CircleAlert,
      label: "Nên xem xét",
      textColor: "error" as const,
    };
  if (status === "not_recommended")
    return {
      backgroundColor: colors.primarySoft,
      color: colors.primary,
      icon: CheckCircle,
      label: "Chưa cần",
      textColor: "primary" as const,
    };
  return {
    backgroundColor: colors.surfaceSubtle,
    color: colors.textSecondary,
    icon: CircleHelp,
    label: "Chưa có gợi ý",
    textColor: "textSecondary" as const,
  };
}

function formatRelativeActivity(occurredAt: string): string {
  const elapsedDays = Math.max(
    0,
    Math.floor((Date.now() - new Date(occurredAt).getTime()) / 86_400_000),
  );
  if (elapsedDays === 0) return "Hôm nay";
  return `${elapsedDays} ngày trước`;
}

const styles = StyleSheet.create({
  card: { gap: spacing.md, padding: spacing.lg },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  icon: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: radius.round,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  infoAction: {
    alignItems: "center",
    borderRadius: radius.round,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  infoActionPressed: { backgroundColor: colors.surfaceSubtle },
  information: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between",
  },
  latest: { flex: 1 },
  frequency: { alignItems: "center", flexDirection: "row", gap: spacing.sm },
  status: {
    alignItems: "center",
    borderRadius: radius.round,
    flexDirection: "row",
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  title: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: spacing.sm,
  },
});
