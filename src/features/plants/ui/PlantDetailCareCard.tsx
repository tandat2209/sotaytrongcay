import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, View } from "react-native";
import { CARE_ACTIVITY_ICONS, CARE_ACTIVITY_LABELS } from "@/features/journal";
import { IconButton } from "@/shared/ui/IconButton";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";
import type { PlantDetailCareCard as CareCardModel } from "../models/plant-detail-projection";

type Props = Readonly<{
  card: CareCardModel;
  onOpenActivity: (id: string) => void;
  onOpenPlaybook?: () => void;
}>;

export function PlantDetailCareCard({ card, onOpenActivity, onOpenPlaybook }: Props) {
  const label = CARE_ACTIVITY_LABELS[card.activityType];
  const status = statusContent(card.evaluation?.status);

  return (
    <SurfaceCard style={styles.card}>
      <View style={styles.header}>
        <View style={styles.icon}><Ionicons color={colors.primary} name={CARE_ACTIVITY_ICONS[card.activityType]} size={30} /></View>
        {onOpenPlaybook ? <IconButton accessibilityLabel="Mở hướng dẫn giai đoạn" icon="book-outline" onPress={onOpenPlaybook} /> : null}
      </View>
      <View style={styles.copy}>
        <Typography variant="headlineMedium">{label}</Typography>
        <Typography color="textSecondary" variant="bodyLarge">{card.title}</Typography>
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
          style={styles.fact}
        >
          <Typography color="textSecondary" variant="label">LẦN GẦN NHẤT</Typography>
          <Typography variant="bodyLarge">{card.lastActivity ? formatActivity(card.lastActivity) : "Chưa có dữ liệu"}</Typography>
        </Pressable>
        <View style={styles.fact}>
          <Typography color="textSecondary" variant="label">TRẠNG THÁI</Typography>
          <View style={styles.status}>
            <Ionicons color={status.color} name={status.icon} size={17} />
            <Typography color={status.textColor} variant="bodyLarge">{status.label}</Typography>
          </View>
        </View>
      </View>
      {card.evaluation ? <Typography color="textSecondary" variant="bodyMedium">{card.evaluation.explanation}</Typography> : null}
    </SurfaceCard>
  );
}

function statusContent(status: CareCardModel["evaluation"] extends infer _ ? "recommended" | "not_recommended" | "unavailable" | undefined : never) {
  if (status === "recommended") return { color: colors.error, icon: "alert-circle" as const, label: "Nên xem xét", textColor: "error" as const };
  if (status === "not_recommended") return { color: colors.primary, icon: "checkmark-circle" as const, label: "Chưa cần", textColor: "primary" as const };
  return { color: colors.textSecondary, icon: "help-circle" as const, label: "Chưa có gợi ý", textColor: "textSecondary" as const };
}

function formatActivity(activity: NonNullable<CareCardModel["lastActivity"]>): string {
  const date = new Date(activity.occurredAt).toLocaleString("vi-VN");
  return activity.type === "watering" && activity.amount ? `${date} · ${activity.amount.value.toLocaleString("vi-VN")} lít` : date;
}

const styles = StyleSheet.create({
  card: { gap: spacing.md, padding: spacing.lg },
  chip: { alignItems: "center", alignSelf: "flex-start", backgroundColor: colors.primarySoft, borderRadius: radius.chip, flexDirection: "row", gap: spacing.xs, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
  copy: { gap: spacing.sm },
  divider: { backgroundColor: colors.border, height: StyleSheet.hairlineWidth },
  fact: { flex: 1, gap: spacing.xs },
  header: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  icon: { alignItems: "center", backgroundColor: colors.primarySoft, borderRadius: radius.round, height: 60, justifyContent: "center", width: 60 },
  information: { flexDirection: "row", gap: spacing.md },
  status: { alignItems: "center", flexDirection: "row", gap: spacing.xs },
});
