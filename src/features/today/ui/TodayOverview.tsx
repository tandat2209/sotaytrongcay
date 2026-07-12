import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, View } from "react-native";

import { CARE_ACTIVITY_ICONS, CARE_ACTIVITY_LABELS } from "@/features/journal";
import { EmptyState } from "@/shared/ui/EmptyState";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { Typography } from "@/shared/ui/Typography";
import { colors, control, radius, spacing } from "@/shared/ui/theme";
import { WeatherCard } from "@/shared/weather/WeatherCard";
import type { TodayActivity, TodayProjection } from "../models/today-projection";
import { PlantRail } from "./PlantRail";
import { TodayHeader } from "./TodayHeader";

export { WeatherCard } from "@/shared/weather/WeatherCard";

type Props = {
  date?: Date;
  onAddPlant: () => void;
  onOpenActivity: (id: string) => void;
  onOpenPlant: (id: string) => void;
  projection: TodayProjection;
};

export function TodayOverview({ date, onAddPlant, onOpenActivity, onOpenPlant, projection }: Props) {
  if (projection.plants.length === 0) {
    return <View style={styles.emptyState}><EmptyState description="Thêm cây đầu tiên để theo dõi lịch sử chăm sóc và xem việc cần chú ý." title="Bắt đầu với cây đầu tiên của bạn" /><Pressable accessibilityLabel="Thêm cây" accessibilityRole="button" onPress={onAddPlant} style={styles.addPlantButton}><Typography style={styles.addPlantLabel} variant="bodyLarge">Thêm cây</Typography></Pressable></View>;
  }

  return <View style={styles.content}>{date ? <TodayHeader date={date} /> : <TodayHeader />}<WeatherCard weather={projection.weather} /><PlantRail onAddPlant={onAddPlant} onOpenPlant={onOpenPlant} plants={projection.plants} /><View style={styles.section}><Typography variant="headlineSmall">Việc cần làm hôm nay</Typography><SurfaceCard><Typography color="textSecondary" variant="bodyMedium">Hôm nay chưa có việc đến hạn.</Typography></SurfaceCard></View><RecentActivities activities={projection.recentActivities} onOpenActivity={onOpenActivity} /></View>;
}

function RecentActivities({ activities, onOpenActivity }: { activities: readonly TodayActivity[]; onOpenActivity: (id: string) => void }) {
  return <View style={styles.section}><Typography variant="headlineSmall">Vừa ghi gần đây</Typography>{activities.length === 0 ? <SurfaceCard><Typography color="textSecondary" variant="bodyMedium">Chưa có hoạt động chăm sóc nào được lưu.</Typography></SurfaceCard> : activities.map((activity) => <ActivityRow activity={activity} key={activity.id} onPress={() => onOpenActivity(activity.id)} />)}</View>;
}

function ActivityRow({ activity, onPress }: { activity: TodayActivity; onPress: () => void }) {
  return <Pressable accessibilityLabel={`Mở ${CARE_ACTIVITY_LABELS[activity.type]} của ${activity.plantName}`} accessibilityRole="button" onPress={onPress}><SurfaceCard style={styles.activityCard}><Ionicons color={colors.primary} name={CARE_ACTIVITY_ICONS[activity.type]} size={20} /><View style={styles.activityCopy}><Typography variant="bodyLarge">{CARE_ACTIVITY_LABELS[activity.type]}</Typography><Typography color="textSecondary" variant="bodyMedium">{activity.plantName} · {new Date(activity.occurredAt).toLocaleDateString("vi-VN")}</Typography></View><Ionicons color={colors.textSecondary} name="chevron-forward" size={20} /></SurfaceCard></Pressable>;
}

const styles = StyleSheet.create({
  activityCard: { alignItems: "center", flexDirection: "row", gap: spacing.md, minHeight: 68 }, activityCopy: { flex: 1, gap: spacing.xs },
  addPlantButton: { alignItems: "center", backgroundColor: colors.primary, borderRadius: radius.control, justifyContent: "center", minHeight: control.primaryHeight, paddingHorizontal: spacing.md }, addPlantLabel: { color: colors.surface, fontWeight: "600" },
  content: { gap: spacing.lg }, emptyState: { gap: spacing.md }, section: { gap: spacing.md },
  weatherCard: { alignItems: "center", backgroundColor: colors.surfaceSubtle, borderColor: colors.primarySoft, flexDirection: "row", gap: spacing.md }, weatherCopy: { flex: 1, gap: spacing.xs }, weatherIcon: { alignItems: "center", backgroundColor: colors.primarySoft, borderRadius: 24, height: 48, justifyContent: "center", width: 48 },
});
