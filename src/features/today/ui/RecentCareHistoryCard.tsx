
import { Pressable, StyleSheet, View } from "react-native";

import { CARE_ACTIVITY_VISUALS } from "@/features/journal";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { Typography } from "@/shared/ui/Typography";
import { colors, control, spacing } from "@/shared/ui/theme";
import type { TodayActivity } from "../models/today-projection";

type Props = {
  activities: readonly TodayActivity[];
  onOpenActivity: (id: string) => void;
  onOpenJournal: () => void;
};

export function RecentCareHistoryCard({ activities, onOpenActivity, onOpenJournal }: Props) {
  return <SurfaceCard style={styles.card}>
    <Typography variant="headlineSmall">Lịch sử chăm sóc gần đây</Typography>
    {activities.length === 0 ? <Typography color="textSecondary" variant="bodyMedium">Chưa có hoạt động chăm sóc nào được lưu.</Typography> : <View>{activities.map((activity, index) => <View key={activity.id}>{index > 0 ? <View style={styles.divider} /> : null}<HistoryRow activity={activity} onPress={() => onOpenActivity(activity.id)} /></View>)}</View>}
    <Pressable accessibilityLabel="Xem tất cả nhật ký" accessibilityRole="button" onPress={onOpenJournal} style={styles.journalAction}><Typography color="primary" variant="bodyMedium">Xem tất cả nhật ký</Typography></Pressable>
  </SurfaceCard>;
}

function HistoryRow({ activity, onPress }: { activity: TodayActivity; onPress: () => void }) {
  const visual = CARE_ACTIVITY_VISUALS[activity.type];
  const ActivityIcon = visual.icon;
  return <Pressable accessibilityLabel={`Mở ${activityLabel(activity)} lúc ${formatOccurredAt(activity.occurredAt)}`} accessibilityRole="button" onPress={onPress} style={styles.row}>
    <ActivityIcon color={visual.color} size={22} />
    <View style={styles.copy}><Typography variant="bodyLarge">{activityLabel(activity)}</Typography><Typography color="textSecondary" variant="bodyMedium">{formatOccurredAt(activity.occurredAt)}</Typography></View>
  </Pressable>;
}

function activityLabel(activity: TodayActivity): string {
  const verb = activity.type === "watering" ? "Đã tưới" : activity.type === "fertilizing" ? "Đã bón phân" : "Đã phun thuốc";
  return `${verb} ${activity.plantName}`;
}

function formatOccurredAt(occurredAt: string): string {
  return new Intl.DateTimeFormat("vi-VN", { day: "numeric", hour: "2-digit", minute: "2-digit", month: "long" }).format(new Date(occurredAt));
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  copy: { flex: 1, gap: spacing.xs },
  divider: { backgroundColor: colors.border, height: StyleSheet.hairlineWidth },
  journalAction: { alignItems: "center", borderTopColor: colors.border, borderTopWidth: StyleSheet.hairlineWidth, justifyContent: "center", minHeight: control.iconTarget, paddingTop: spacing.sm },
  row: { alignItems: "center", flexDirection: "row", gap: spacing.md, minHeight: 64, paddingVertical: spacing.sm },
});
